import { NextResponse } from 'next/server';
import { verifyClientAuth, verifyClientProjectAccess, getPortalSecurityHeaders } from '@/lib/client_auth';
import { query, initFounderOSDb } from '@/lib/founder_os_db';

export async function GET(request, { params }) {
  try {
    const auth = await verifyClientAuth(request);
    if (!auth) {
      return NextResponse.json({ success: false, error: 'Unauthorized.' }, { status: 401, headers: getPortalSecurityHeaders() });
    }

    await initFounderOSDb();
    const resolvedParams = await params;
    const { id } = resolvedParams;
    const projectId = parseInt(id, 10);

    const accessCheck = await verifyClientProjectAccess(auth.client.id, auth.user.id, projectId);
    if (!accessCheck.authorized) {
      return NextResponse.json({ success: false, error: 'Project not found.' }, { status: 404, headers: getPortalSecurityHeaders() });
    }

    const docsRes = await query(`
      SELECT 
        id, 
        title, 
        category, 
        description, 
        file_url, 
        file_name, 
        file_size, 
        version, 
        is_download_allowed, 
        published_date, 
        created_at
      FROM founder_os_portal_documents
      WHERE project_id = $1 AND is_visible_to_client = TRUE
      ORDER BY published_date DESC, created_at DESC
    `, [projectId]);

    return NextResponse.json({
      success: true,
      documents: docsRes.rows
    }, { headers: getPortalSecurityHeaders() });
  } catch (err) {
    console.error('Client documents get error:', err);
    return NextResponse.json({ success: false, error: 'Failed to retrieve documents.' }, { status: 500, headers: getPortalSecurityHeaders() });
  }
}
