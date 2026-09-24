import { NextResponse } from 'next/server';
import { 
  verifyClientAuth, 
  verifyPassword, 
  hashPassword, 
  getPortalSecurityHeaders 
} from '@/lib/client_auth';
import { query, initFounderOSDb } from '@/lib/founder_os_db';

export async function POST(request) {
  try {
    const auth = await verifyClientAuth(request);
    if (!auth) {
      return NextResponse.json({ success: false, error: 'Unauthorized.' }, { status: 401, headers: getPortalSecurityHeaders() });
    }

    if (auth.isAdminPreview) {
      return NextResponse.json({ success: false, error: 'Password changes are disabled in Admin Preview mode.' }, { status: 403, headers: getPortalSecurityHeaders() });
    }

    await initFounderOSDb();
    const body = await request.json();
    const currentPassword = typeof body.currentPassword === 'string' ? body.currentPassword : '';
    const newPassword = typeof body.newPassword === 'string' ? body.newPassword : '';

    if (!newPassword || newPassword.length < 8) {
      return NextResponse.json({ success: false, error: 'New password must be at least 8 characters long.' }, { status: 400, headers: getPortalSecurityHeaders() });
    }

    // Retrieve existing hash
    const userRes = await query('SELECT password_hash, must_change_password FROM founder_os_portal_users WHERE id = $1', [auth.user.id]);
    if (userRes.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'User not found.' }, { status: 404, headers: getPortalSecurityHeaders() });
    }

    const { password_hash: currentHash, must_change_password } = userRes.rows[0];

    // If account doesn't have must_change_password flag, verify current password
    if (currentHash && !must_change_password) {
      if (!currentPassword) {
        return NextResponse.json({ success: false, error: 'Current password is required.' }, { status: 400, headers: getPortalSecurityHeaders() });
      }
      const match = await verifyPassword(currentPassword, currentHash);
      if (!match) {
        return NextResponse.json({ success: false, error: 'Current password is incorrect.' }, { status: 400, headers: getPortalSecurityHeaders() });
      }
    }

    const newHash = await hashPassword(newPassword);

    await query(`
      UPDATE founder_os_portal_users
      SET password_hash = $1,
          must_change_password = FALSE,
          password_changed_at = NOW(),
          failed_login_count = 0,
          locked_until = NULL,
          updated_at = NOW()
      WHERE id = $2
    `, [newHash, auth.user.id]);

    return NextResponse.json({
      success: true,
      message: 'Password updated successfully.'
    }, { headers: getPortalSecurityHeaders() });
  } catch (err) {
    console.error('Client change password error:', err);
    return NextResponse.json({ success: false, error: 'Failed to update password.' }, { status: 500, headers: getPortalSecurityHeaders() });
  }
}
