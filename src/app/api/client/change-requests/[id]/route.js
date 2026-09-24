import { NextResponse } from 'next/server';
import { verifyClientAuth, getPortalSecurityHeaders } from '@/lib/client_auth';
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
    const crId = parseInt(id, 10);

    // Verify change request belongs to client
    const crRes = await query(`
      SELECT 
        cr.*,
        p.project_name,
        COALESCE(ps.portal_display_name, p.project_name) as project_display_name,
        s.client_title as stage_title
      FROM founder_os_client_change_requests cr
      JOIN founder_os_projects p ON p.id = cr.project_id
      LEFT JOIN founder_os_project_portal_settings ps ON ps.project_id = p.id
      LEFT JOIN founder_os_project_stages s ON s.id = cr.stage_id
      WHERE cr.id = $1 AND cr.client_id = $2
    `, [crId, auth.client.id]);

    if (crRes.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Change request not found.' }, { status: 404, headers: getPortalSecurityHeaders() });
    }

    const changeRequest = crRes.rows[0];

    // Fetch conversation thread (NEVER return is_internal_note = TRUE)
    const commentsRes = await query(`
      SELECT 
        id, 
        change_request_id, 
        sender_type, 
        sender_name, 
        sender_id, 
        message, 
        attachment_url, 
        attachment_name, 
        created_at
      FROM founder_os_change_request_comments
      WHERE change_request_id = $1 AND is_internal_note = FALSE
      ORDER BY created_at ASC
    `, [crId]);

    return NextResponse.json({
      success: true,
      change_request: changeRequest,
      comments: commentsRes.rows
    }, { headers: getPortalSecurityHeaders() });
  } catch (err) {
    console.error('Client single change request get error:', err);
    return NextResponse.json({ success: false, error: 'Failed to retrieve change request.' }, { status: 500, headers: getPortalSecurityHeaders() });
  }
}
