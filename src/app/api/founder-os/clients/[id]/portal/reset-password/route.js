import { NextResponse } from 'next/server';
import { verifyAdminAuth } from '@/lib/auth';
import { query, initFounderOSDb } from '@/lib/founder_os_db';
import { 
  generateSecureToken, 
  generateSecureTempPassword, 
  hashToken, 
  hashPassword,
  revokeAllUserSessions,
  getRequestBaseUrl
} from '@/lib/client_auth';
import { logActivity } from '@/lib/audit_logger';
import { sendPortalNotificationEmail } from '@/lib/portal_notifications';

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
    const portalUserId = parseInt(body.portal_user_id, 10);
    const actionType = body.action_type || 'temporary_password'; // 'temporary_password' | 'email_link'

    const userRes = await query(`
      SELECT u.*, c.name as client_name 
      FROM founder_os_portal_users u
      JOIN founder_os_clients c ON c.id = u.client_id
      WHERE u.id = $1 AND u.client_id = $2
    `, [portalUserId, clientId]);

    if (userRes.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Portal user not found' }, { status: 404 });
    }

    const user = userRes.rows[0];

    // Revoke existing sessions immediately
    await revokeAllUserSessions(user.id);

    let tempPasswordForDisplay = null;
    let resetToken = null;

    if (actionType === 'temporary_password') {
      tempPasswordForDisplay = generateSecureTempPassword();
      const passwordHash = await hashPassword(tempPasswordForDisplay);

      await query(`
        UPDATE founder_os_portal_users
        SET password_hash = $1,
            must_change_password = TRUE,
            failed_login_count = 0,
            locked_until = NULL,
            reset_token_hash = NULL,
            reset_token_expires_at = NULL,
            status = 'Active',
            updated_at = NOW()
        WHERE id = $2
      `, [passwordHash, user.id]);

      await logActivity(
        auth.username || 'Admin',
        'Client Portal Access',
        clientId,
        'Issued Temporary Password',
        `Issued new temporary password for portal user ${user.public_client_id} (${user.email})`
      );

      return NextResponse.json({
        success: true,
        message: 'New temporary password generated successfully. It will be required to be changed on first login.',
        temporary_password: tempPasswordForDisplay,
        temporaryPassword: tempPasswordForDisplay,
        publicClientId: user.public_client_id,
        email: user.email
      });
    } else {
      resetToken = generateSecureToken(32);
      const resetTokenHash = hashToken(resetToken);
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

      await query(`
        UPDATE founder_os_portal_users
        SET reset_token_hash = $1,
            reset_token_expires_at = $2,
            failed_login_count = 0,
            locked_until = NULL,
            updated_at = NOW()
        WHERE id = $3
      `, [resetTokenHash, expiresAt, user.id]);

      const baseUrl = getRequestBaseUrl(request);
      const resetLink = `${baseUrl}/client/setup-password#token=${resetToken}`;

      sendPortalNotificationEmail({
        toEmail: user.email,
        recipientName: user.full_name,
        subject: 'Password Reset from Admin',
        messageText: `Your InfronixWeb Client Portal password has been reset by your project manager. Click below to choose a new secure password.`,
        actionUrl: resetLink,
        actionButtonText: 'Reset Password'
      }).catch(err => console.warn('Reset email error:', err.message));

      await logActivity(
        auth.username || 'Admin',
        'Client Portal Access',
        clientId,
        'Sent Password Reset Link',
        `Sent password reset link to portal user ${user.public_client_id} (${user.email})`
      );

      return NextResponse.json({
        success: true,
        message: 'Password reset link sent to client email successfully.',
        setupUrl: resetLink,
        setup_token: resetToken,
        publicClientId: user.public_client_id,
        email: user.email
      });
    }
  } catch (err) {
    console.error('Admin reset password error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
