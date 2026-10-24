import { NextResponse } from 'next/server';
import {
  verifyClientAuth,
  verifyClientProjectAccess,
  getClientIp,
  hashIp,
  getPortalSecurityHeaders
} from '@/lib/client_auth';
import { query } from '@/lib/founder_os_db';
import { notifyAdminAboutClientAction } from '@/lib/portal_notifications';
import { logActivity } from '@/lib/audit_logger';
import { initClientDocumentsDb, hashDocumentContent, CLIENT_DOCUMENT_COLUMNS } from '@/lib/client_documents';
import { DOC_TYPES, isSignatureImage } from '@/lib/document_templates';

const OPEN_STATUSES = ['Sent', 'Viewed', 'Changes Requested'];

async function loadAuthorizedDocument(request, params) {
  const auth = await verifyClientAuth(request);
  if (!auth) return { error: 'Unauthorized.', status: 401 };

  await initClientDocumentsDb();
  const { id } = await params;
  const docId = parseInt(id, 10);
  if (!docId) return { error: 'Document not found.', status: 404 };

  const res = await query(`
    SELECT ${CLIENT_DOCUMENT_COLUMNS}, d.client_id
    FROM founder_os_client_documents d
    WHERE d.id = $1 AND d.client_id = $2 AND d.status != 'Draft'
  `, [docId, auth.client.id]);
  const doc = res.rows[0];
  if (!doc) return { error: 'Document not found.', status: 404 };

  const accessCheck = await verifyClientProjectAccess(auth.client.id, auth.user.id, doc.project_id);
  if (!accessCheck.authorized) return { error: 'Document not found.', status: 404 };

  return { auth, doc, project: accessCheck.project };
}

function stripInternal(doc) {
  const { client_id: _clientId, ...rest } = doc;
  return rest;
}

export async function GET(request, { params }) {
  try {
    const result = await loadAuthorizedDocument(request, params);
    if (result.error) {
      return NextResponse.json({ success: false, error: result.error }, { status: result.status, headers: getPortalSecurityHeaders() });
    }
    const { auth, doc } = result;

    if (!auth.isAdminPreview && !doc.viewed_at) {
      await query(`
        UPDATE founder_os_client_documents
        SET viewed_at = NOW(), status = CASE WHEN status = 'Sent' THEN 'Viewed' ELSE status END
        WHERE id = $1
      `, [doc.id]);
      doc.viewed_at = new Date().toISOString();
      if (doc.status === 'Sent') doc.status = 'Viewed';
    }

    return NextResponse.json({ success: true, document: stripInternal(doc) }, { headers: getPortalSecurityHeaders() });
  } catch (err) {
    console.error('Client agreement get error:', err);
    return NextResponse.json({ success: false, error: 'Failed to load document.' }, { status: 500, headers: getPortalSecurityHeaders() });
  }
}

export async function POST(request, { params }) {
  try {
    const result = await loadAuthorizedDocument(request, params);
    if (result.error) {
      return NextResponse.json({ success: false, error: result.error }, { status: result.status, headers: getPortalSecurityHeaders() });
    }
    const { auth, doc, project } = result;

    if (auth.isAdminPreview) {
      return NextResponse.json({ success: false, error: 'Signing is disabled in Admin Preview mode.' }, { status: 403, headers: getPortalSecurityHeaders() });
    }
    if (!OPEN_STATUSES.includes(doc.status)) {
      return NextResponse.json({ success: false, error: 'This document can no longer be changed.' }, { status: 409, headers: getPortalSecurityHeaders() });
    }

    const body = await request.json();
    const meta = DOC_TYPES[doc.doc_type];
    const ipHash = hashIp(getClientIp(request));

    if (body.action === 'request_changes') {
      const comment = typeof body.comment === 'string' ? body.comment.trim() : '';
      if (comment.length < 5) {
        return NextResponse.json({ success: false, error: 'Please describe what you would like changed.' }, { status: 400, headers: getPortalSecurityHeaders() });
      }
      await query(`
        UPDATE founder_os_client_documents
        SET status = 'Changes Requested', client_comment = $1, updated_at = NOW()
        WHERE id = $2
      `, [comment.slice(0, 4000), doc.id]);

      await notifyAdminAboutClientAction({
        clientId: auth.client.id,
        clientName: auth.client.name,
        portalUserId: auth.user.id,
        projectId: doc.project_id,
        projectName: project.project_name,
        actionTitle: `Changes requested on ${meta.short} ${doc.doc_number}`,
        details: `${auth.user.full_name} requested changes: "${comment}"`,
        category: 'Document'
      });

      return NextResponse.json({ success: true, message: 'Thanks! We have received your feedback and will update the document.' }, { headers: getPortalSecurityHeaders() });
    }

    if (body.action !== 'sign') {
      return NextResponse.json({ success: false, error: 'Unknown action.' }, { status: 400, headers: getPortalSecurityHeaders() });
    }
    if (!doc.requires_signature) {
      return NextResponse.json({ success: false, error: 'This document does not need a signature.' }, { status: 400, headers: getPortalSecurityHeaders() });
    }

    const signerName = typeof body.signer_name === 'string' ? body.signer_name.trim() : '';
    const signerTitle = typeof body.signer_title === 'string' ? body.signer_title.trim() : '';
    if (signerName.length < 2) {
      return NextResponse.json({ success: false, error: 'Please enter your full name.' }, { status: 400, headers: getPortalSecurityHeaders() });
    }
    const signatureImage = body.signature_image;
    if (!isSignatureImage(signatureImage) || signatureImage.length > 300000) {
      return NextResponse.json({ success: false, error: 'Please draw your signature in the box.' }, { status: 400, headers: getPortalSecurityHeaders() });
    }
    if (body.agree !== true) {
      return NextResponse.json({ success: false, error: 'Please confirm that you agree to the terms.' }, { status: 400, headers: getPortalSecurityHeaders() });
    }

    // The client must be signing exactly the version that was issued to them.
    const currentHash = hashDocumentContent(doc);
    if (!doc.content_hash || doc.content_hash !== currentHash || body.content_hash !== currentHash) {
      return NextResponse.json({ success: false, error: 'This document was updated. Please refresh and review the latest version.' }, { status: 409, headers: getPortalSecurityHeaders() });
    }

    const updateRes = await query(`
      UPDATE founder_os_client_documents
      SET status = 'Signed', signed_at = NOW(), signer_name = $1, signer_title = $2, signature_text = $3,
          signer_ip_hash = $4, signer_user_agent = $5, signed_by_portal_user_id = $6, signature_image = $9, updated_at = NOW()
      WHERE id = $7 AND status = ANY($8::varchar[])
      RETURNING ${CLIENT_DOCUMENT_COLUMNS.replace(/d\./g, '')}
    `, [
      signerName.slice(0, 255),
      signerTitle.slice(0, 255),
      signerName.slice(0, 255),
      ipHash,
      (request.headers.get('user-agent') || '').slice(0, 500),
      auth.user.id,
      doc.id,
      OPEN_STATUSES,
      signatureImage
    ]);
    if (!updateRes.rows.length) {
      return NextResponse.json({ success: false, error: 'This document can no longer be changed.' }, { status: 409, headers: getPortalSecurityHeaders() });
    }

    // Mirror into the existing approvals ledger so signatures show up alongside deliverable approvals.
    await query(`
      INSERT INTO founder_os_client_approvals (
        project_id, portal_user_id, client_id, approval_type, deliverable_title, version, document_hash, client_comment, ip_hash
      ) VALUES ($1, $2, $3, 'Document Signature', $4, $5, $6, $7, $8)
    `, [doc.project_id, auth.user.id, auth.client.id, `${meta.label} ${doc.doc_number}`, '1.0', currentHash, `Signed by ${signerName}${signerTitle ? `, ${signerTitle}` : ''}`, ipHash]);

    await notifyAdminAboutClientAction({
      clientId: auth.client.id,
      clientName: auth.client.name,
      portalUserId: auth.user.id,
      projectId: doc.project_id,
      projectName: project.project_name,
      actionTitle: `${meta.short} ${doc.doc_number} signed`,
      details: `${signerName}${signerTitle ? ` (${signerTitle})` : ''} signed ${meta.label} ${doc.doc_number}.`,
      category: 'Document'
    });
    await logActivity(auth.user.full_name, 'Document', doc.id, 'Signed', `${doc.doc_number} signed by ${signerName} via client portal`);

    return NextResponse.json({
      success: true,
      message: 'Signed successfully. A copy is saved in your portal.',
      document: updateRes.rows[0]
    }, { headers: getPortalSecurityHeaders() });
  } catch (err) {
    console.error('Client agreement action error:', err);
    return NextResponse.json({ success: false, error: 'Failed to process your request.' }, { status: 500, headers: getPortalSecurityHeaders() });
  }
}
