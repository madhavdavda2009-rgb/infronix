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

    const stagesRes = await query(`
      SELECT 
        id, stage_name, stage_order, status,
        COALESCE(client_title, stage_name) as client_title,
        client_description,
        client_status,
        client_note,
        COALESCE(stage_weight, 1) as stage_weight,
        target_date,
        completed_at,
        created_at
      FROM founder_os_project_stages
      WHERE project_id = $1 AND (visible_to_client IS NULL OR visible_to_client = TRUE)
      ORDER BY stage_order ASC
    `, [projectId]);

    return NextResponse.json({
      success: true,
      stages: stagesRes.rows
    }, { headers: getPortalSecurityHeaders() });
  } catch (err) {
    console.error('Client stages get error:', err);
    return NextResponse.json({ success: false, error: 'Failed to retrieve stages.' }, { status: 500, headers: getPortalSecurityHeaders() });
  }
}
