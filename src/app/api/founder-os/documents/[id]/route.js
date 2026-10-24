import { NextResponse } from 'next/server';
import { query } from '@/lib/founder_os_db';
import { verifyAdminAuth } from '@/lib/auth';
import { logActivity } from '@/lib/audit_logger';
import { initClientDocumentsDb, hashDocumentContent, sanitizeSections, DOCUMENT_LIST_SQL } from '@/lib/client_documents';
import { isSignatureImage } from '@/lib/document_templates';

async function loadDocument(id) {
  const res = await query(`${DOCUMENT_LIST_SQL} WHERE d.id = $1`, [id]);
  return res.rows[0] || null;
}

export async function GET(request, { params }) {
  const auth = verifyAdminAuth(request);
  if (!auth) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await initClientDocumentsDb();
    const { id } = await params;
    const document = await loadDocument(parseInt(id, 10));
    if (!document) {
      return NextResponse.json({ success: false, error: 'Document not found' }, { status: 404 });
    }
    const portalRes = await query(
      "SELECT id, full_name, email, status FROM founder_os_portal_users WHERE client_id = $1 AND status NOT IN ('Suspended', 'Disabled') ORDER BY id",
      [document.client_id]
    );
    return NextResponse.json({ success: true, document, portalUsers: portalRes.rows });
  } catch (err) {
    console.error('Document GET error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  const auth = verifyAdminAuth(request);
  if (!auth) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await initClientDocumentsDb();
    const { id } = await params;
    const docId = parseInt(id, 10);
    const existing = await loadDocument(docId);
    if (!existing) {
      return NextResponse.json({ success: false, error: 'Document not found' }, { status: 404 });
    }
    if (existing.status === 'Signed') {
      return NextResponse.json({ success: false, error: 'Signed documents are locked. Create a new version instead.' }, { status: 409 });
    }

    const body = await request.json();

    if (body.action === 'mark_signed_offline') {
      const signerName = typeof body.signer_name === 'string' ? body.signer_name.trim() : '';
      if (!signerName) {
        return NextResponse.json({ success: false, error: 'Signer name is required' }, { status: 400 });
      }
      await query(`
        UPDATE founder_os_client_documents
        SET status = 'Signed', signed_at = NOW(), signer_name = $1, signer_title = $2,
            signature_text = $1, content_hash = $3, client_comment = $4, updated_at = NOW()
        WHERE id = $5
      `, [signerName.slice(0, 255), (body.signer_title || '').slice(0, 255), hashDocumentContent(existing), 'Marked as signed offline by InfronixWeb', docId]);
      await logActivity(auth.username, 'Document', docId, 'Marked Signed', `${existing.doc_number} marked as signed offline by ${signerName}`);
      return NextResponse.json({ success: true, document: await loadDocument(docId) });
    }

    const title = typeof body.title === 'string' && body.title.trim() ? body.title.trim().slice(0, 255) : existing.title;
    const data = body.data && typeof body.data === 'object' ? { ...body.data } : existing.data;
    if (body.data) {
      data.sections = sanitizeSections(data.sections);
      if (data.agency_signature && !isSignatureImage(data.agency_signature)) data.agency_signature = '';
    }
    const contentChanged = JSON.stringify(data) !== JSON.stringify(existing.data) || title !== existing.title;
    // Editing a document the client has already received sends it back to Draft so it must be re-issued.
    const nextStatus = contentChanged && existing.status !== 'Draft' ? 'Draft' : existing.status;

    await query(`
      UPDATE founder_os_client_documents
      SET title = $1, data = $2::jsonb, status = $3::varchar,
          content_hash = CASE WHEN $3::varchar = 'Draft' THEN NULL ELSE content_hash END,
          updated_at = NOW()
      WHERE id = $4
    `, [title, JSON.stringify(data), nextStatus, docId]);

    return NextResponse.json({ success: true, document: await loadDocument(docId), revertedToDraft: nextStatus !== existing.status });
  } catch (err) {
    console.error('Document PUT error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const auth = verifyAdminAuth(request);
  if (!auth) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await initClientDocumentsDb();
    const { id } = await params;
    const docId = parseInt(id, 10);
    const existing = await loadDocument(docId);
    if (!existing) {
      return NextResponse.json({ success: false, error: 'Document not found' }, { status: 404 });
    }
    if (existing.status === 'Signed') {
      return NextResponse.json({ success: false, error: 'Signed documents cannot be deleted' }, { status: 409 });
    }
    await query('DELETE FROM founder_os_client_documents WHERE id = $1', [docId]);
    await logActivity(auth.username, 'Document', docId, 'Deleted', `Deleted ${existing.doc_number} (${existing.title})`);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Document DELETE error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
