import { NextResponse } from 'next/server';
import { verifyClientAuth, getPortalSecurityHeaders } from '@/lib/client_auth';
import { query, initFounderOSDb } from '@/lib/founder_os_db';

export async function GET(request) {
  try {
    const auth = await verifyClientAuth(request);
    if (!auth) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Please sign in.' },
        { status: 401, headers: getPortalSecurityHeaders() }
      );
    }

    await initFounderOSDb();
    const { user, client, isAdminPreview } = auth;

    // Get aggregated statistics for the client dashboard
    const statsRes = await query(`
      SELECT 
        COUNT(DISTINCT p.id) as total_projects,
        COUNT(DISTINCT CASE WHEN p.status NOT IN ('Completed', 'Cancelled') THEN p.id END) as active_projects,
        COUNT(DISTINCT CASE WHEN p.status = 'Completed' THEN p.id END) as completed_projects,
        COUNT(DISTINCT CASE WHEN cr.status NOT IN ('Completed', 'Cancelled', 'Rejected') THEN cr.id END) as open_change_requests,
        COUNT(DISTINCT CASE WHEN req.status = 'Pending' THEN req.id END) as pending_requirements,
        COUNT(DISTINCT CASE WHEN n.is_read = FALSE THEN n.id END) as unread_notifications
      FROM founder_os_projects p
      LEFT JOIN founder_os_client_change_requests cr ON (cr.client_id = p.client_id AND cr.project_id = p.id)
      LEFT JOIN founder_os_client_requirements req ON req.project_id = p.id
      LEFT JOIN founder_os_portal_notifications n ON (n.client_id = $1 AND (n.portal_user_id = $2 OR n.portal_user_id IS NULL))
      WHERE p.client_id = $1
    `, [client.id, user.id]);

    const stats = statsRes.rows[0] || {
      total_projects: 0,
      active_projects: 0,
      completed_projects: 0,
      open_change_requests: 0,
      pending_requirements: 0,
      unread_notifications: 0
    };

    return NextResponse.json({
      success: true,
      isAdminPreview: Boolean(isAdminPreview),
      user: {
        id: user.id,
        public_client_id: user.public_client_id,
        full_name: user.full_name,
        email: user.email,
        phone: user.phone,
        role_title: user.role_title,
        status: user.status,
        must_change_password: user.must_change_password
      },
      client: {
        id: client.id,
        name: client.name,
        company: client.company,
        phone: client.phone,
        email: client.email
      },
      stats: {
        total_projects: parseInt(stats.total_projects || 0, 10),
        active_projects: parseInt(stats.active_projects || 0, 10),
        completed_projects: parseInt(stats.completed_projects || 0, 10),
        open_change_requests: parseInt(stats.open_change_requests || 0, 10),
        pending_requirements: parseInt(stats.pending_requirements || 0, 10),
        unread_notifications: parseInt(stats.unread_notifications || 0, 10)
      }
    }, { headers: getPortalSecurityHeaders() });
  } catch (err) {
    console.error('Client ME endpoint error:', err);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve profile information.' },
      { status: 500, headers: getPortalSecurityHeaders() }
    );
  }
}
