import { NextResponse } from 'next/server';
import { verifyAdminAuth } from '@/lib/auth';
import { query, initFounderOSDb } from '@/lib/founder_os_db';
import { generateSecureToken, hashToken, getRequestBaseUrl } from '@/lib/client_auth';
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
    const setupToken = generateSecureToken(32);
    const setupTokenHash = hashToken(setupToken);
    const setupExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await query(`
      UPDATE founder_os_portal_users
      SET setup_token_hash = $1,
          setup_token_expires_at = $2,
          status = 'Invited',
          updated_at = NOW()
      WHERE id = $3
    `, [setupTokenHash, setupExpiresAt, user.id]);

    const baseUrl = getRequestBaseUrl(request);
    const setupLink = `${baseUrl}/client/setup-password#token=${setupToken}`;

    sendPortalNotificationEmail({
      toEmail: user.email,
      recipientName: user.full_name,
      subject: 'InfronixWeb Client Portal Invitation',
      messageText: `You are invited to access your InfronixWeb Client Portal (${user.public_client_id}). Click below to set up your password and view your live project deliverables, timeline, milestones, and staging preview.`,
      actionUrl: setupLink,
      actionButtonText: 'Set Up Portal Password'
    }).catch(err => console.warn('Resend invite email error:', err.message));

    await logActivity(
      auth.username || 'Admin',
      'Client Portal Access',
      clientId,
      'Resent Portal Invitation',
      `Resent portal invitation to ${user.public_client_id} (${user.email})`
    );

    return NextResponse.json({
      success: true,
      message: 'Portal setup invitation resent to client email.',
      setup_token: setupToken,
      setupUrl: setupLink,
      publicClientId: user.public_client_id,
      email: user.email,
      emailSent: true
    });
  } catch (err) {
    console.error('Send invite error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
