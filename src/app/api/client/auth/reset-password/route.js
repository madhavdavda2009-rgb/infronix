import { NextResponse } from 'next/server';
import { 
  hashToken, 
  hashPassword, 
  createPortalSession, 
  revokeAllUserSessions,
  getPortalSecurityHeaders 
} from '@/lib/client_auth';
import { query, initFounderOSDb } from '@/lib/founder_os_db';

export async function POST(request) {
  try {
    await initFounderOSDb();
    const body = await request.json();
    const token = typeof body.token === 'string' ? body.token.trim() : '';
    const newPassword = typeof body.newPassword === 'string' ? body.newPassword : '';

    if (!token || !newPassword) {
      return NextResponse.json(
        { success: false, error: 'Reset token and new password are required.' },
        { status: 400, headers: getPortalSecurityHeaders() }
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 8 characters long.' },
        { status: 400, headers: getPortalSecurityHeaders() }
      );
    }

    const tokenHash = hashToken(token);

    // Find user with valid reset token
    const userRes = await query(`
      SELECT u.*, c.name as client_name, c.company as client_company 
      FROM founder_os_portal_users u
      JOIN founder_os_clients c ON c.id = u.client_id
      WHERE u.reset_token_hash = $1 
        AND u.reset_token_expires_at > NOW()
    `, [tokenHash]);

    if (userRes.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Invalid or expired password reset link. Please request a new one.' },
        { status: 400, headers: getPortalSecurityHeaders() }
      );
    }

    const user = userRes.rows[0];
    const passwordHash = await hashPassword(newPassword);

    // Revoke all existing sessions for security
    await revokeAllUserSessions(user.id);

    // Update password and clear reset token
    await query(`
      UPDATE founder_os_portal_users
      SET password_hash = $1,
          reset_token_hash = NULL,
          reset_token_expires_at = NULL,
          must_change_password = FALSE,
          password_changed_at = NOW(),
          failed_login_count = 0,
          locked_until = NULL,
          updated_at = NOW()
      WHERE id = $2
    `, [passwordHash, user.id]);

    // Create fresh session and set cookie
    const { rawToken, expiresAt } = await createPortalSession(user.id, request);

    const response = NextResponse.json({
      success: true,
      message: 'Password has been reset successfully.',
      redirectTo: '/client/dashboard'
    }, { headers: getPortalSecurityHeaders() });

    response.cookies.set({
      name: 'client_session',
      value: rawToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      expires: expiresAt
    });

    return response;
  } catch (err) {
    console.error('Client Portal reset password error:', err);
    return NextResponse.json(
      { success: false, error: 'Failed to reset password. Please try again.' },
      { status: 500, headers: getPortalSecurityHeaders() }
    );
  }
}
