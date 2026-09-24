import { NextResponse } from 'next/server';
import { verifyAdminAuth } from '@/lib/auth';
import { query, initFounderOSDb } from '@/lib/founder_os_db';
import { 
  generatePublicClientId, 
  generateSecureToken, 
  generateSecureTempPassword, 
  hashToken, 
  hashPassword,
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

    const clientRes = await query('SELECT * FROM founder_os_clients WHERE id = $1', [clientId]);
    if (clientRes.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Client not found' }, { status: 404 });
    }
    const client = clientRes.rows[0];

    const body = await request.json();
    const fullName = (typeof body.name === 'string' && body.name.trim()) || (typeof body.full_name === 'string' && body.full_name.trim()) || client.name;
    const email = (typeof body.email === 'string' ? body.email.trim().toLowerCase() : (client.email ? client.email.trim().toLowerCase() : ''));
    const phone = (typeof body.phone === 'string' ? body.phone.trim() : (client.phone || ''));
    const roleTitle = (typeof body.designation === 'string' && body.designation.trim()) || (typeof body.role_title === 'string' && body.role_title.trim()) || 'Primary Contact';
    const authMethod = body.authMethod || body.auth_type || 'temp_password';

    if (!email) {
      return NextResponse.json({ success: false, error: 'A valid email address is required for client portal user.' }, { status: 400 });
    }

    // Check if email already in use
    const existingEmail = await query('SELECT id, client_id, public_client_id FROM founder_os_portal_users WHERE LOWER(email) = LOWER($1)', [email]);
    if (existingEmail.rows.length > 0) {
      return NextResponse.json({ 
        success: false, 
        error: `A portal user with email ${email} already exists (Client ID: ${existingEmail.rows[0].public_client_id}).` 
      }, { status: 400 });
    }

    // Generate unique Client ID
    let publicClientId = generatePublicClientId();
    let collision = await query('SELECT id FROM founder_os_portal_users WHERE public_client_id = $1', [publicClientId]);
    while (collision.rows.length > 0) {
      publicClientId = generatePublicClientId();
      collision = await query('SELECT id FROM founder_os_portal_users WHERE public_client_id = $1', [publicClientId]);
    }

    let passwordHash = null;
    let tempPasswordForDisplay = null;
    let setupToken = null;
    let setupTokenHash = null;
    let setupExpiresAt = null;
    let status = 'active';

    if (authMethod === 'temp_password' || authMethod === 'temporary_password') {
      tempPasswordForDisplay = generateSecureTempPassword();
      passwordHash = await hashPassword(tempPasswordForDisplay);
      status = 'active';
    } else {
      setupToken = generateSecureToken(32);
      setupTokenHash = hashToken(setupToken);
      setupExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days expiry
      status = 'invited';
    }

    const insertRes = await query(`
      INSERT INTO founder_os_portal_users (
        client_id, public_client_id, full_name, email, phone, role_title,
        password_hash, status, must_change_password, setup_token_hash, setup_token_expires_at, created_by
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, TRUE, $9, $10, $11)
      RETURNING id, public_client_id, client_id, full_name, email, phone, role_title, status, must_change_password, created_at
    `, [
      clientId,
      publicClientId,
      fullName,
      email,
      phone,
      roleTitle,
      passwordHash,
      status,
      setupTokenHash,
      setupExpiresAt,
      auth.username || 'admin'
    ]);

    const newUser = insertRes.rows[0];

    const baseUrl = getRequestBaseUrl(request);
    const setupUrl = setupToken ? `${baseUrl}/client/setup-password#token=${setupToken}` : `${baseUrl}/client/login`;

    // Log Activity
    await logActivity(
      auth.username || 'Admin',
      'Client Portal Access',
      clientId,
      'Created Portal User',
      `Created portal account ${publicClientId} (${email}) for client ${client.name}`
    );

    // Send invitation email if invite link requested
    if (setupToken) {
      sendPortalNotificationEmail({
        toEmail: email,
        recipientName: fullName,
        subject: 'Welcome to your InfronixWeb Client Portal',
        messageText: `Your dedicated InfronixWeb Client Portal is now ready. Your Client ID is <strong>${publicClientId}</strong>.<br/><br/>Click below to set up your secure password and access your live project updates, milestones, file uploads, and deliverables.`,
        actionUrl: setupUrl,
        actionButtonText: 'Set Up Portal Password'
      }).catch(err => console.warn('Portal invite email dispatch error:', err.message));
    }

    return NextResponse.json({
      success: true,
      message: 'Client portal account created successfully.',
      user: newUser,
      publicClientId: publicClientId,
      temporaryPassword: tempPasswordForDisplay,
      temporary_password: tempPasswordForDisplay,
      setupUrl: setupUrl,
      setup_token: setupToken
    });
  } catch (err) {
    console.error('Admin create portal user error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
