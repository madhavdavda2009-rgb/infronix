import { NextResponse } from 'next/server';
import { verifyClientAuth, getPortalSecurityHeaders } from '@/lib/client_auth';
import { query, initFounderOSDb } from '@/lib/founder_os_db';

export async function GET(request) {
  try {
    const auth = await verifyClientAuth(request);
    if (!auth) {
      return NextResponse.json({ success: false, error: 'Unauthorized.' }, { status: 401, headers: getPortalSecurityHeaders() });
    }

    await initFounderOSDb();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    let sql = `
      SELECT 
        cr.*,
        p.project_name,
        COALESCE(ps.portal_display_name, p.project_name) as project_display_name,
        s.client_title as stage_title,
        COUNT(c.id) as comment_count
      FROM founder_os_client_change_requests cr
      JOIN founder_os_projects p ON p.id = cr.project_id
      LEFT JOIN founder_os_project_portal_settings ps ON ps.project_id = p.id
      LEFT JOIN founder_os_project_stages s ON s.id = cr.stage_id
      LEFT JOIN founder_os_change_request_comments c ON (c.change_request_id = cr.id AND c.is_internal_note = FALSE)
      WHERE cr.client_id = $1
    `;
    const params = [auth.client.id];

    if (status && status !== 'ALL') {
      params.push(status);
      sql += ` AND cr.status = $${params.length}`;
    }

    sql += ' GROUP BY cr.id, p.project_name, ps.portal_display_name, s.client_title ORDER BY cr.created_at DESC';

    const res = await query(sql, params);

    return NextResponse.json({
      success: true,
      change_requests: res.rows
    }, { headers: getPortalSecurityHeaders() });
  } catch (err) {
    console.error('Client global change requests get error:', err);
    return NextResponse.json({ success: false, error: 'Failed to retrieve change requests.' }, { status: 500, headers: getPortalSecurityHeaders() });
  }
}
