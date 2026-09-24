import { NextResponse } from 'next/server';
import { verifyClientAuth, getPortalSecurityHeaders } from '@/lib/client_auth';
import { query, initFounderOSDb } from '@/lib/founder_os_db';

export async function PUT(request, { params }) {
  try {
    const auth = await verifyClientAuth(request);
    if (!auth) {
      return NextResponse.json({ success: false, error: 'Unauthorized.' }, { status: 401, headers: getPortalSecurityHeaders() });
    }

    if (auth.isAdminPreview) {
      return NextResponse.json({ success: true, message: 'Preview mode - read state ignored.' }, { headers: getPortalSecurityHeaders() });
    }

    await initFounderOSDb();
    const resolvedParams = await params;
    const { id } = resolvedParams;
    const notifId = parseInt(id, 10);

    if (id === 'all') {
      await query(`
        UPDATE founder_os_portal_notifications
        SET is_read = TRUE
        WHERE (client_id = $1 OR portal_user_id = $2) AND recipient_type = 'Client'
      `, [auth.client.id, auth.user.id]);
    } else {
      await query(`
        UPDATE founder_os_portal_notifications
        SET is_read = TRUE
        WHERE id = $1 AND (client_id = $2 OR portal_user_id = $3)
      `, [notifId, auth.client.id, auth.user.id]);
    }

    return NextResponse.json({ success: true, message: 'Notification marked as read.' }, { headers: getPortalSecurityHeaders() });
  } catch (err) {
    console.error('Client notification read update error:', err);
    return NextResponse.json({ success: false, error: 'Failed to update notification.' }, { status: 500, headers: getPortalSecurityHeaders() });
  }
}
