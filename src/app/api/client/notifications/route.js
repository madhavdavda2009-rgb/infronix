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

    const notifsRes = await query(`
      SELECT 
        n.*,
        p.project_name
      FROM founder_os_portal_notifications n
      LEFT JOIN founder_os_projects p ON p.id = n.project_id
      WHERE (n.client_id = $1 OR n.portal_user_id = $2) AND n.recipient_type = 'Client'
      ORDER BY n.created_at DESC
      LIMIT 50
    `, [auth.client.id, auth.user.id]);

    return NextResponse.json({
      success: true,
      notifications: notifsRes.rows
    }, { headers: getPortalSecurityHeaders() });
  } catch (err) {
    console.error('Client notifications get error:', err);
    return NextResponse.json({ success: false, error: 'Failed to retrieve notifications.' }, { status: 500, headers: getPortalSecurityHeaders() });
  }
}
