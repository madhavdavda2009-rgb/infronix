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

    // Get aggregated statistics for the client dashboard with fast index scans
    const statsRes = await query(`
      SELECT 
        (SELECT COUNT(*) FROM founder_os_projects WHERE client_id = $1) as total_projects,
        (SELECT COUNT(*) FROM founder_os_projects WHERE client_id = $1 AND status NOT IN ('Completed', 'Cancelled')) as active_projects,
        (SELECT COUNT(*) FROM founder_os_projects WHERE client_id = $1 AND status = 'Completed') as completed_projects,
        (SELECT COUNT(*) FROM founder_os_client_change_requests WHERE client_id = $1 AND status NOT IN ('Completed', 'Cancelled', 'Rejected')) as open_change_requests,
        (SELECT COUNT(*) FROM founder_os_client_requirements req JOIN founder_os_projects p ON p.id = req.project_id WHERE p.client_id = $1 AND req.status = 'Pending') as pending_requirements,
        (SELECT COUNT(*) FROM founder_os_portal_notifications WHERE client_id = $1 AND (portal_user_id = $2 OR portal_user_id IS NULL) AND is_read = FALSE) as unread_notifications
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
