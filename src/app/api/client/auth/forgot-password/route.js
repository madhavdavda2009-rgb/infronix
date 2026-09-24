import { NextResponse } from 'next/server';
import { 
  generateSecureToken, 
  hashToken, 
  getPortalSecurityHeaders,
  getRequestBaseUrl
} from '@/lib/client_auth';
import { query, initFounderOSDb } from '@/lib/founder_os_db';
import { sendPortalNotificationEmail } from '@/lib/portal_notifications';
import { checkAndRecord, getIp } from '@/lib/rate_limiter';

export async function POST(request) {
  try {
    await initFounderOSDb();

    const ip = getIp(request);
    const ipKey = `forgot_password:ip:${ip}`;

    // ─── Rate limit: 3 requests per hour per IP ──────────────────────────────
    const ipCheck = checkAndRecord(ipKey, { maxAttempts: 3, lockMs: 60 * 60 * 1000 });
    if (!ipCheck.allowed) {
      // Still return a generic response to avoid enumeration — just silently block
      return NextResponse.json({
        success: true,
        message: 'If an active account matches the details provided, password reset instructions have been sent.'
      }, { headers: getPortalSecurityHeaders() });
    }

    const body = await request.json();
    const identifier = typeof body.identifier === 'string' ? body.identifier.trim() : '';

    if (!identifier) {
      return NextResponse.json(
        { success: false, error: 'Client ID or Email is required.' },
        { status: 400, headers: getPortalSecurityHeaders() }
      );
    }

    // Per-identifier rate limit to stop targeted email spam
    const identifierKey = `forgot_password:id:${identifier.toLowerCase()}`;
    const idCheck = checkAndRecord(identifierKey, { maxAttempts: 3, lockMs: 60 * 60 * 1000 });
    if (!idCheck.allowed) {
      // Same generic response — don't reveal account existence
      return NextResponse.json({
        success: true,
        message: 'If an active account matches the details provided, password reset instructions have been sent.'
      }, { headers: getPortalSecurityHeaders() });
    }

    // Always return a generic success message to prevent user enumeration
    const genericResponse = NextResponse.json({
      success: true,
      message: 'If an active account matches the details provided, password reset instructions have been sent.'
    }, { headers: getPortalSecurityHeaders() });

    const userRes = await query(`
      SELECT u.*, c.name as client_name 
      FROM founder_os_portal_users u
      JOIN founder_os_clients c ON c.id = u.client_id
      WHERE (LOWER(u.public_client_id) = LOWER($1) OR LOWER(u.email) = LOWER($1))
        AND LOWER(u.status) IN ('active', 'invited')
    `, [identifier]);

    if (userRes.rows.length === 0) {
      return genericResponse;
    }

    const user = userRes.rows[0];
    const resetToken = generateSecureToken(32);
    const resetTokenHash = hashToken(resetToken);
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour expiry

    await query(`
      UPDATE founder_os_portal_users
      SET reset_token_hash = $1,
          reset_token_expires_at = $2,
          updated_at = NOW()
      WHERE id = $3
    `, [resetTokenHash, expiresAt, user.id]);

    // Send reset email
    const baseUrl = getRequestBaseUrl(request);
    const resetLink = `${baseUrl}/client/setup-password#token=${resetToken}`;

    console.log('\n==================================================');
    console.log('[CLIENT PORTAL PASSWORD RESET LINK GENERATED]');
    console.log('Client ID:', user.public_client_id);
    console.log('Recipient:', user.email);
    console.log('Password Reset URL:', resetLink);
    console.log('==================================================\n');

    sendPortalNotificationEmail({
      toEmail: user.email,
      recipientName: user.full_name,
      subject: 'Password Reset Request',
      messageText: `We received a request to reset the password for your InfronixWeb Client Portal account (${user.public_client_id}). Click the button below to choose a new password. This link is single-use and will expire in 1 hour.`,
      actionUrl: resetLink,
      actionButtonText: 'Reset Portal Password'
    }).catch(err => console.warn('Forgot password email dispatch failed:', err.message));

    return genericResponse;
  } catch (err) {
    console.error('Forgot password error:', err);
    return NextResponse.json(
      { success: false, error: 'Failed to process password reset request.' },
      { status: 500, headers: getPortalSecurityHeaders() }
    );
  }
}
