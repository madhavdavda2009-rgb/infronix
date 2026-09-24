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

    const tasksRes = await query(`
      SELECT 
        id, 
        COALESCE(client_title, title) as title,
        COALESCE(client_description, description) as description,
        stage_id,
        stage_name,
        status,
        deadline,
        created_at
      FROM founder_os_tasks
      WHERE project_id = $1 AND visible_to_client = TRUE
      ORDER BY deadline ASC, id ASC
    `, [projectId]);

    return NextResponse.json({
      success: true,
      tasks: tasksRes.rows
    }, { headers: getPortalSecurityHeaders() });
  } catch (err) {
    console.error('Client tasks get error:', err);
    return NextResponse.json({ success: false, error: 'Failed to retrieve tasks.' }, { status: 500, headers: getPortalSecurityHeaders() });
  }
}
