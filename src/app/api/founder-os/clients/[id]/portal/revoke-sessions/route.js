import { NextResponse } from 'next/server';
import { verifyAdminAuth } from '@/lib/auth';
import { query, initFounderOSDb } from '@/lib/founder_os_db';
import { revokeAllUserSessions } from '@/lib/client_auth';
import { logActivity } from '@/lib/audit_logger';

export async function POST(request, { params }) {
  const auth = verifyAdminAuth(request);
  if (!auth) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await initFounderOSDb();
    const resolvedParams = await params;
    const { id } = resolvedParams;
    const clientId = parseInt(id, 10);
    const body = await request.json();
    const portalUserId = body.portal_user_id ? parseInt(body.portal_user_id, 10) : null;

    if (portalUserId) {
      await revokeAllUserSessions(portalUserId);
    } else {
      // Revoke all sessions for all users of this client
      const usersRes = await query('SELECT id FROM founder_os_portal_users WHERE client_id = $1', [clientId]);
      for (const u of usersRes.rows) {
        await revokeAllUserSessions(u.id);
      }
    }

    await logActivity(
      auth.username || 'Admin',
      'Client Portal Access',
      clientId,
      'Revoked Active Sessions',
      `Revoked all active portal sessions for client ID ${clientId}`
    );

    return NextResponse.json({
      success: true,
      message: 'Active portal sessions revoked successfully.'
    });
  } catch (err) {
    console.error('Revoke sessions error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
