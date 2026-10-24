import { NextResponse } from 'next/server';
import { query } from '@/lib/founder_os_db';
import { hashIp, getClientIp } from '@/lib/client_auth';
import { checkAndRecord, getState } from '@/lib/rate_limiter';
import { notifyAdminAboutClientAction } from '@/lib/portal_notifications';
import { logActivity } from '@/lib/audit_logger';
import { sendOutreachEmail } from '@/lib/email-automation/mailer';
import { hashDocumentContent } from '@/lib/client_documents';
import { DOC_TYPES, esc, isSignatureImage } from '@/lib/document_templates';
import { loadLink, issueOtp, verifyOtp, sessionValid, maskEmail, OTP_TTL_MINUTES } from '@/lib/sign_links';

const NO_STORE = {
  'Cache-Control': 'no-store, no-cache, must-revalidate',
  'X-Robots-Tag': 'noindex, nofollow',
  'Referrer-Policy': 'no-referrer',
};
const IP_LIMIT = { maxAttempts: 20, lockMs: 60 * 60 * 1000, windowMs: 60 * 60 * 1000 };

const LINK_ERRORS = {
  invalid: 'This signing link is not valid. Please check the link or contact InfronixWeb.',
  expired: 'This signing link has expired. Please ask InfronixWeb to send a new one.',
  revoked: 'This signing link is no longer active. Please ask InfronixWeb to send a new one.',
  locked: 'This link was locked after too many wrong codes. Please ask InfronixWeb for a new one.',
  signed: 'This document has already been signed. Thank you!',
};

function json(body, status = 200) {
  return NextResponse.json(body, { status, headers: NO_STORE });
}

function ipKey(request) {
  return `doc-sign:${hashIp(getClientIp(request))}`;
}

function publicMeta(link) {
  const d = link.data || {};
  const meta = DOC_TYPES[link.doc_type] || {};
  return {
    doc_number: link.doc_number,
    doc_label: meta.label,
    requires_signature: link.requires_signature,
    client_name: d.client_name || '',
    client_company: d.client_company || d.client_name || '',
    agency_name: d.agency_name || 'InfronixWeb',
    email_masked: maskEmail(link.email),
    verified: false,
  };
}

function publicDocument(link) {
  return {
    id: link.doc_id,
    doc_number: link.doc_number,
    doc_type: link.doc_type,
    title: link.title,
    data: link.data,
    status: link.doc_status,
    requires_signature: link.requires_signature,
    content_hash: link.content_hash,
    sent_at: link.sent_at,
  };
}

async function guard(request, params) {
  if (getState(ipKey(request), IP_LIMIT).locked) {
    return { response: json({ success: false, error: 'Too many attempts from your network. Please try again later.' }, 429) };
  }
  const { token } = await params;
  const result = await loadLink(token);
  if (result.error) {
    if (result.error === 'invalid') checkAndRecord(ipKey(request), IP_LIMIT);
    return { response: json({ success: false, code: result.error, error: LINK_ERRORS[result.error] }, result.error === 'invalid' ? 404 : 410) };
  }
  return { link: result.link };
}

export async function GET(request, { params }) {
  try {
    const { link, response } = await guard(request, params);
    if (response) return response;

    const session = request.headers.get('x-sign-session');
    if (session && sessionValid(link, session)) {
      return json({ success: true, meta: { ...publicMeta(link), verified: true }, document: publicDocument(link) });
    }
    return json({ success: true, meta: publicMeta(link) });
  } catch (err) {
    console.error('Public sign GET error:', err);
    return json({ success: false, error: 'Something went wrong. Please try again.' }, 500);
  }
}

export async function POST(request, { params }) {
  try {
    const { link, response } = await guard(request, params);
    if (response) return response;
    const body = await request.json().catch(() => ({}));
    const meta = DOC_TYPES[link.doc_type];
    const d = link.data || {};

    if (body.action === 'send_code') {
      const result = await issueOtp(link);
      if (result.error) return json({ success: false, error: result.error }, 429);
      await sendOutreachEmail({
        leadId: null,
        recipient: link.email,
        subject: `${result.code} is your InfronixWeb verification code`,
        body: `Your verification code to open ${meta.label} ${link.doc_number} is ${result.code}. It expires in ${OTP_TTL_MINUTES} minutes. If you did not request this, you can ignore this email.`,
        htmlOverride: `<div style="font-family:Arial,Helvetica,sans-serif;background:#F8F9FA;padding:32px 16px;">
          <div style="max-width:480px;margin:0 auto;background:#ffffff;border:1px solid #E2E8F0;border-radius:14px;padding:28px;color:#1E293B;">
            <p style="margin:0 0 6px;font-size:12px;letter-spacing:1.5px;text-transform:uppercase;color:#6D28D9;font-weight:700;">InfronixWeb</p>
            <p style="margin:0 0 18px;font-size:15px;">Use this code to open <strong>${esc(meta.label)} ${esc(link.doc_number)}</strong>:</p>
            <p style="margin:0 0 18px;font-size:34px;font-weight:800;letter-spacing:10px;color:#0B0D12;">${result.code}</p>
            <p style="margin:0;font-size:13px;color:#64748B;">The code expires in ${OTP_TTL_MINUTES} minutes. Never share it with anyone. If you didn't request it, ignore this email.</p>
          </div>
        </div>`,
      });
      return json({ success: true, message: `We sent a 6-digit code to ${maskEmail(link.email)}.` });
    }

    if (body.action === 'verify_code') {
      if (!/^\d{6}$/.test(String(body.code || '').trim())) {
        return json({ success: false, error: 'Enter the 6-digit code from your email.' }, 400);
      }
      const result = await verifyOtp(link, body.code);
      if (result.error) {
        checkAndRecord(ipKey(request), IP_LIMIT);
        return json({ success: false, error: result.error, locked: Boolean(result.locked) }, result.locked ? 410 : 400);
      }
      return json({ success: true, session: result.session, meta: { ...publicMeta(link), verified: true }, document: publicDocument(link) });
    }

    // Everything below needs a verified session.
    if (!sessionValid(link, request.headers.get('x-sign-session'))) {
      return json({ success: false, code: 'session', error: 'Your verification has expired. Please verify again with a new code.' }, 401);
    }
    const ipHash = hashIp(getClientIp(request));

    if (body.action === 'request_changes') {
      const comment = typeof body.comment === 'string' ? body.comment.trim() : '';
      if (comment.length < 5) return json({ success: false, error: 'Please describe what you would like changed.' }, 400);
      await query(`
        UPDATE founder_os_client_documents SET status = 'Changes Requested', client_comment = $1, updated_at = NOW()
        WHERE id = $2 AND status IN ('Sent', 'Viewed', 'Changes Requested')
      `, [comment.slice(0, 4000), link.doc_id]);
      await notifyAdminAboutClientAction({
        clientId: link.client_id,
        clientName: d.client_company || d.client_name,
        portalUserId: null,
        projectId: link.project_id,
        actionTitle: `Changes requested on ${meta.short} ${link.doc_number}`,
        details: `${d.client_name || 'The client'} requested changes via the signing link: "${comment}"`,
        category: 'Document'
      });
      return json({ success: true, message: 'Thanks! We received your feedback and will share an updated version.' });
    }

    if (body.action !== 'sign') return json({ success: false, error: 'Unknown action.' }, 400);
    if (!link.requires_signature) return json({ success: false, error: 'This document does not need a signature.' }, 400);

    const signerName = typeof body.signer_name === 'string' ? body.signer_name.trim() : '';
    const signerTitle = typeof body.signer_title === 'string' ? body.signer_title.trim() : '';
    if (signerName.length < 2) return json({ success: false, error: 'Please enter your full name.' }, 400);
    if (!isSignatureImage(body.signature_image) || body.signature_image.length > 300000) {
      return json({ success: false, error: 'Please draw your signature in the box.' }, 400);
    }
    if (body.agree !== true) return json({ success: false, error: 'Please confirm that you agree to the terms.' }, 400);

    const currentHash = hashDocumentContent({ doc_type: link.doc_type, doc_number: link.doc_number, title: link.title, data: link.data });
    if (!link.content_hash || link.content_hash !== currentHash || body.content_hash !== currentHash) {
      return json({ success: false, error: 'This document was updated. Please reload the page to review the latest version.' }, 409);
    }

    const signed = await query(`
      UPDATE founder_os_client_documents
      SET status = 'Signed', signed_at = NOW(), signer_name = $1, signer_title = $2, signature_text = $1,
          signature_image = $3, signer_ip_hash = $4, signer_user_agent = $5,
          client_comment = $6, updated_at = NOW()
      WHERE id = $7 AND status IN ('Sent', 'Viewed', 'Changes Requested')
      RETURNING signed_at
    `, [
      signerName.slice(0, 255), signerTitle.slice(0, 255), body.signature_image, ipHash,
      (request.headers.get('user-agent') || '').slice(0, 500),
      `Signed via secure link after email verification (${link.email})`, link.doc_id
    ]);
    if (!signed.rows.length) return json({ success: false, error: 'This document can no longer be signed.' }, 409);

    await query('UPDATE founder_os_document_sign_links SET used_at = NOW(), session_hash = NULL WHERE id = $1', [link.id]);
    if (link.project_id) {
      await query(`
        INSERT INTO founder_os_client_approvals (project_id, client_id, approval_type, deliverable_title, version, document_hash, client_comment, ip_hash)
        VALUES ($1, $2, 'Document Signature', $3, '1.0', $4, $5, $6)
      `, [link.project_id, link.client_id, `${meta.label} ${link.doc_number}`, currentHash, `Signed by ${signerName} via secure link (${link.email})`, ipHash]);
    }

    await notifyAdminAboutClientAction({
      clientId: link.client_id,
      clientName: d.client_company || d.client_name,
      portalUserId: null,
      projectId: link.project_id,
      actionTitle: `${meta.short} ${link.doc_number} signed`,
      details: `${signerName}${signerTitle ? ` (${signerTitle})` : ''} signed ${meta.label} ${link.doc_number} via the secure link, verified with ${link.email}.`,
      category: 'Document'
    });
    await logActivity(signerName, 'Document', link.doc_id, 'Signed', `${link.doc_number} signed via secure link (${link.email})`);

    // Confirmation to the verified address, so a signature made by anyone else gets noticed.
    sendOutreachEmail({
      leadId: null,
      recipient: link.email,
      subject: `You signed ${meta.label} ${link.doc_number}`,
      body: `${meta.label} ${link.doc_number} was signed by ${signerName} on ${new Date(signed.rows[0].signed_at).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST. If this wasn't you, reply to this email immediately.`,
    }).catch(err => console.warn('Signing confirmation email failed:', err.message));

    return json({ success: true, message: 'Signed successfully. Thank you!', signed_at: signed.rows[0].signed_at });
  } catch (err) {
    console.error('Public sign POST error:', err);
    return json({ success: false, error: 'Something went wrong. Please try again.' }, 500);
  }
}
