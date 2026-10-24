import { NextResponse } from 'next/server';
import { verifyClientAuth, verifyClientProjectAccess, getPortalSecurityHeaders } from '@/lib/client_auth';
import { query } from '@/lib/founder_os_db';
import { initClientDocumentsDb, CLIENT_DOCUMENT_COLUMNS } from '@/lib/client_documents';

export async function GET(request, { params }) {
  try {
    const auth = await verifyClientAuth(request);
    if (!auth) {
      return NextResponse.json({ success: false, error: 'Unauthorized.' }, { status: 401, headers: getPortalSecurityHeaders() });
    }

    await initClientDocumentsDb();
    const { id } = await params;
    const projectId = parseInt(id, 10);

    const accessCheck = await verifyClientProjectAccess(auth.client.id, auth.user.id, projectId);
    if (!accessCheck.authorized) {
      return NextResponse.json({ success: false, error: 'Project not found.' }, { status: 404, headers: getPortalSecurityHeaders() });
    }

    const docsRes = await query(`
      SELECT ${CLIENT_DOCUMENT_COLUMNS}
      FROM founder_os_client_documents d
      WHERE d.project_id = $1 AND d.client_id = $2 AND d.status != 'Draft'
      ORDER BY d.sent_at DESC NULLS LAST, d.id DESC
    `, [projectId, auth.client.id]);

    return NextResponse.json({ success: true, documents: docsRes.rows }, { headers: getPortalSecurityHeaders() });
  } catch (err) {
    console.error('Client agreements list error:', err);
    return NextResponse.json({ success: false, error: 'Failed to retrieve documents.' }, { status: 500, headers: getPortalSecurityHeaders() });
  }
}
