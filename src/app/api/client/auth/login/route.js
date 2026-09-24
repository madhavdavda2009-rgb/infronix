import { NextResponse } from 'next/server';
import { 
  checkRateLimit, 
  recordFailedLogin, 
  recordSuccessfulLogin, 
  createPortalSession, 
  verifyPassword,
  getPortalSecurityHeaders
} from '@/lib/client_auth';
import { query, initFounderOSDb } from '@/lib/founder_os_db';

export async function POST(request) {
  try {
    await initFounderOSDb();
    const body = await request.json();
    const identifier = typeof body.identifier === 'string' ? body.identifier.trim() : '';
    const password = typeof body.password === 'string' ? body.password : '';

    if (!identifier || !password) {
      return NextResponse.json(
        { success: false, error: 'Client ID / Email and password are required.' },
        { status: 400, headers: getPortalSecurityHeaders() }
      );
    }

    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
               request.headers.get('x-real-ip')?.trim() || 
               '127.0.0.1';

    // 1. Rate Limiting and Lockout check
    const rateCheck = await checkRateLimit(identifier, ip);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { success: false, error: rateCheck.reason || 'Too many attempts. Please try again later.' },
        { status: 429, headers: getPortalSecurityHeaders() }
      );
    }

    // 2. Lookup user by public_client_id OR email
    const userRes = await query(`
      SELECT u.*, c.name as client_name, c.company as client_company 
      FROM founder_os_portal_users u
      JOIN founder_os_clients c ON c.id = u.client_id
      WHERE (LOWER(u.public_client_id) = LOWER($1) OR LOWER(u.email) = LOWER($1))
    `, [identifier]);

    if (userRes.rows.length === 0) {
      await recordFailedLogin(identifier, ip);
      return NextResponse.json(
        { success: false, error: 'Invalid Client ID/email or password.' },
        { status: 401, headers: getPortalSecurityHeaders() }
      );
    }

    const user = userRes.rows[0];

    // Check status
    if (user.status === 'Suspended' || user.status === 'Disabled') {
      return NextResponse.json(
        { success: false, error: 'Your portal access is currently suspended or disabled. Please contact InfronixWeb support.' },
        { status: 403, headers: getPortalSecurityHeaders() }
      );
    }

    // If user has not set a password yet (invited state without password)
    if (!user.password_hash) {
      return NextResponse.json(
        { success: false, error: 'Account setup required. Please use your setup link or contact your project manager.' },
        { status: 400, headers: getPortalSecurityHeaders() }
      );
    }

    // 3. Verify Password using bcrypt
    const passwordMatch = await verifyPassword(password, user.password_hash);
    if (!passwordMatch) {
      await recordFailedLogin(identifier, ip);
      return NextResponse.json(
        { success: false, error: 'Invalid Client ID/email or password.' },
        { status: 401, headers: getPortalSecurityHeaders() }
      );
    }

    // 4. Success: reset failed counts & create session
    await recordSuccessfulLogin(user.id, ip);
    const { rawToken, expiresAt } = await createPortalSession(user.id, request);

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        public_client_id: user.public_client_id,
        full_name: user.full_name,
        email: user.email,
        role_title: user.role_title,
        must_change_password: user.must_change_password,
        client_name: user.client_name,
        client_company: user.client_company
      },
      redirectTo: user.must_change_password ? '/client/profile' : '/client/dashboard'
    }, { headers: getPortalSecurityHeaders() });

    // Set secure HTTP-only session cookie
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
    console.error('Client Portal login error:', err);
    return NextResponse.json(
      { success: false, error: 'Authentication service unavailable. Please try again.' },
      { status: 500, headers: getPortalSecurityHeaders() }
    );
  }
}
