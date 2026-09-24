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

    const reqsRes = await query(`
      SELECT 
        id, 
        project_id,
        item_name,
        status,
        notes,
        uploaded_file_url,
        uploaded_file_name,
        uploaded_file_size,
        uploaded_file_type,
        client_message,
        uploaded_at,
        admin_review_note,
        received_date,
        created_at,
        updated_at
      FROM founder_os_client_requirements
      WHERE project_id = $1
      ORDER BY 
        CASE WHEN status = 'Pending' THEN 1 WHEN status = 'Submitted' THEN 2 ELSE 3 END,
        id ASC
    `, [projectId]);

    return NextResponse.json({
      success: true,
      requirements: reqsRes.rows
    }, { headers: getPortalSecurityHeaders() });
  } catch (err) {
    console.error('Client requirements get error:', err);
    return NextResponse.json({ success: false, error: 'Failed to retrieve requirements.' }, { status: 500, headers: getPortalSecurityHeaders() });
  }
}
