import { createHash } from 'node:crypto';
import { NextResponse } from 'next/server';
import { query } from '@/lib/founder_os_db';
import { verifyAdminAuth } from '@/lib/auth';
import { logActivity } from '@/lib/audit_logger';
import { notifyClient } from '@/lib/portal_notifications';
import { sendOutreachEmail } from '@/lib/email-automation/mailer';
import { initClientDocumentsDb, hashDocumentContent, DOCUMENT_LIST_SQL } from '@/lib/client_documents';
import { DOC_TYPES, SITE_URL, EMAIL_FONT_LINKS, esc, isSignatureImage, renderDocumentHtml } from '@/lib/document_templates';
import { storeContentImage } from '@/lib/cloudinary-upload';

// Already live on the website, so emails show the logo even before this code is deployed.
const EMAIL_LOGO_PATH = "/brand-light.png";

// The site's own signature route only exists once this code is deployed.
async function signatureRouteIsLive() {
  try {
    const res = await fetch(`${SITE_URL}/api/public/doc-signature/0`, { cache: 'no-store', signal: AbortSignal.timeout(4000) });
    return res.status === 404 && !(res.headers.get('content-type') || '').includes('text/html');
  } catch {
    return false;
  }
}

/**
 * Mail clients block inline data: images, so the agency signature needs a public URL.
 * Prefer a Cloudinary copy (works immediately), then the site route; null falls back to the signer's name.
 */
async function resolveEmailSignatureUrl(doc) {
  const sig = doc.data?.agency_signature;
  if (!isSignatureImage(sig)) return null;
  const [, mime, b64] = sig.match(/^data:(image\/(?:png|jpeg));base64,(.+)$/);
  const bytes = Buffer.from(b64, 'base64');
  try {
    const publicId = `signature-${createHash('sha256').update(bytes).digest('hex').slice(0, 32)}`;
    const stored = await storeContentImage(bytes, 'signatures', { mime, ext: mime === 'image/png' ? 'png' : 'jpg', publicId });
    if (stored.storage === 'cloudinary') return stored.imageUrl;
  } catch (err) {
    console.warn('Signature upload for email skipped:', err.message);
  }
  return (await signatureRouteIsLive()) ? `${SITE_URL}/api/public/doc-signature/${doc.id}` : null;
}

function buildEmailHtml({ doc, message, portalLink, baseUrl, signatureUrl }) {
  const emailDoc = signatureUrl ? doc : { ...doc, data: { ...doc.data, agency_signature: '' } };
  const meta = DOC_TYPES[doc.doc_type];
  const cta = meta.requiresSignature ? 'Review &amp; Sign in Client Portal' : 'Open in Client Portal';
  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${esc(meta.label)} ${esc(doc.doc_number)}</title>${EMAIL_FONT_LINKS.map(href => `<link rel="stylesheet" href="${href}">`).join('')}</head>
<body style="margin:0;padding:24px 12px;background:#F8F9FA;">
  <div style="max-width:760px;margin:0 auto;">
    <div style="background:#ffffff;border:1px solid #E2E8F0;border-radius:14px;padding:24px 28px;margin-bottom:16px;font-family:'General Sans',Arial,sans-serif;color:#1E293B;font-size:14px;line-height:1.7;">
      ${esc(message).replace(/\n/g, '<br/>')}
      ${portalLink ? `<div style="margin-top:20px;"><a href="${esc(portalLink)}" style="display:inline-block;background:#6D28D9;color:#ffffff;padding:12px 26px;border-radius:10px;font-weight:600;text-decoration:none;">${cta}</a></div>` : ''}
    </div>
    <div style="background:#ffffff;border:1px solid #E2E8F0;border-radius:14px;overflow:hidden;">${renderDocumentHtml(emailDoc, { logoUrl: `${baseUrl}${EMAIL_LOGO_PATH}`, forEmail: true, agencySignatureUrl: signatureUrl })}</div>
    <p style="font-family:'General Sans',Arial,sans-serif;font-size:11px;color:#64748B;text-align:center;margin:16px 0 0;">Sent by ${esc(doc.data?.agency_name || 'InfronixWeb')} · ${esc(doc.data?.agency_email || '')}</p>
  </div>
</body></html>`;
}

export async function POST(request, { params }) {
  const auth = verifyAdminAuth(request);
  if (!auth) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await initClientDocumentsDb();
    const { id } = await params;
    const docId = parseInt(id, 10);
    const docRes = await query(`${DOCUMENT_LIST_SQL} WHERE d.id = $1`, [docId]);
    const doc = docRes.rows[0];
    if (!doc) {
      return NextResponse.json({ success: false, error: 'Document not found' }, { status: 404 });
    }
    if (doc.status === 'Signed') {
      return NextResponse.json({ success: false, error: 'This document is already signed' }, { status: 409 });
    }

    const body = await request.json();
    const email = typeof body.email === 'string' ? body.email.trim() : '';
    const sendEmail = body.send_email !== false;
    const notifyPortal = body.notify_portal !== false;
    const meta = DOC_TYPES[doc.doc_type];

    const portalUsersRes = await query(
      "SELECT id FROM founder_os_portal_users WHERE client_id = $1 AND status NOT IN ('Suspended', 'Disabled')",
      [doc.client_id]
    );
    const portalUsers = portalUsersRes.rows;
    if (!sendEmail && !(notifyPortal && portalUsers.length && doc.project_id)) {
      return NextResponse.json({ success: false, error: 'Choose email or the client portal to deliver this document' }, { status: 400 });
    }
    if (sendEmail && !email.includes('@')) {
      return NextResponse.json({ success: false, error: 'Enter a valid client email' }, { status: 400 });
    }

    const portalPath = doc.project_id ? `/client/projects/${doc.project_id}?tab=documents&doc=${doc.id}` : null;
    const baseUrl = SITE_URL;
    const portalLink = portalPath && portalUsers.length ? `${baseUrl}${portalPath}` : null;
    const firstName = (doc.data?.client_name || '').split(' ')[0] || 'there';
    const defaultMessage = meta.requiresSignature
      ? `Hi ${firstName},\n\nPlease find the ${meta.label} (${doc.doc_number}) for ${doc.project_name || 'your project'} below. Have a read, and if everything looks good, you can sign it online in your client portal. Happy to jump on a call if anything needs clarifying.\n\nThanks,\n${doc.data?.agency_signer_name || 'Team InfronixWeb'}`
      : `Hi ${firstName},\n\nSharing the ${meta.label} (${doc.doc_number}) for ${doc.project_name || 'your project'} below. Let us know if you have any questions.\n\nThanks,\n${doc.data?.agency_signer_name || 'Team InfronixWeb'}`;
    const message = typeof body.message === 'string' && body.message.trim() ? body.message.trim() : defaultMessage;

    // Hash and timestamps are set before rendering so the emailed copy shows the issue date.
    const sentAt = new Date().toISOString();
    const issued = { ...doc, sent_at: sentAt, content_hash: hashDocumentContent(doc) };

    if (sendEmail) {
      await sendOutreachEmail({
        leadId: null,
        recipient: email,
        subject: `${meta.label} ${doc.doc_number} — InfronixWeb`,
        body: message,
        htmlOverride: buildEmailHtml({ doc: issued, message, portalLink, baseUrl, signatureUrl: await resolveEmailSignatureUrl(issued) }),
      });
    }

    const nextStatus = doc.status === 'Viewed' ? 'Viewed' : 'Sent';
    await query(`
      UPDATE founder_os_client_documents
      SET status = $1, sent_at = $2, sent_to_email = COALESCE($3, sent_to_email), content_hash = $4, updated_at = NOW()
      WHERE id = $5
    `, [nextStatus, sentAt, sendEmail ? email : null, issued.content_hash, docId]);

    if (notifyPortal && doc.project_id) {
      for (const user of portalUsers) {
        await notifyClient({
          clientId: doc.client_id,
          portalUserId: user.id,
          projectId: doc.project_id,
          title: meta.requiresSignature ? `${meta.short} ready for your signature` : `New document: ${meta.short}`,
          message: `${meta.label} (${doc.doc_number}) has been shared with you${meta.requiresSignature ? '. Please review and sign it.' : '.'}`,
          actionUrl: portalPath,
          category: 'Documents',
          sendEmail: !sendEmail,
        });
      }
    }

    await logActivity(auth.username, 'Document', docId, 'Sent', `Sent ${doc.doc_number}${sendEmail ? ` to ${email}` : ''}${notifyPortal && portalUsers.length ? ' and published to client portal' : ''}`);

    const updated = await query(`${DOCUMENT_LIST_SQL} WHERE d.id = $1`, [docId]);
    return NextResponse.json({
      success: true,
      document: updated.rows[0],
      portalNotified: notifyPortal && doc.project_id ? portalUsers.length : 0,
    });
  } catch (err) {
    console.error('Document send error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
