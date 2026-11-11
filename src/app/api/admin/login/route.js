import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { execute } from '@/lib/db';
import { setMfaCookie, issueAdminSession } from '@/lib/admin_2fa';
import { checkAndRecord, resetKey, getIp, LOGIN_LOCK_MS } from '@/lib/rate_limiter';

export async function POST(request) {
  try {
    const ip = getIp(request);
    const ipKey = `admin_login:ip:${ip}`;

    // ─── IP-based rate limit: 3 attempts, then a 2-minute lock ───────────────────────────
    const ipCheck = checkAndRecord(ipKey, { maxAttempts: 3, lockMs: LOGIN_LOCK_MS, windowMs: LOGIN_LOCK_MS });
    if (!ipCheck.allowed) {
      return NextResponse.json(
        { success: false, error: ipCheck.message },
        {
          status: 429,
          headers: {
            'Retry-After': String(Math.ceil((ipCheck.lockedUntilMs - Date.now()) / 1000)),
            'X-RateLimit-Limit': '3',
            'X-RateLimit-Remaining': '0',
          }
        }
      );
    }

    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: 'Please provide both username and password.' },
        { status: 400 }
      );
    }

    // Per-username rate limit (protects against distributed IP attacks)
    const userKey = `admin_login:user:${String(username).trim().toLowerCase()}`;
    const userCheck = checkAndRecord(userKey, { maxAttempts: 3, lockMs: LOGIN_LOCK_MS, windowMs: LOGIN_LOCK_MS });
    if (!userCheck.allowed) {
      return NextResponse.json(
        { success: false, error: userCheck.message },
        { status: 429 }
      );
    }

    const [rows] = await execute('SELECT * FROM admins WHERE username = ? LIMIT 1', [username.trim()]);
    
    if (rows.length === 0) {
      // This attempt was already counted above for both the IP and the username.
      return NextResponse.json(
        { success: false, error: 'Invalid username or password.' },
        { status: 401 }
      );
    }

    const admin = rows[0];
    const isPasswordValid = await bcrypt.compare(password, admin.password_hash);

    if (!isPasswordValid) {
      // This attempt was already counted above for both the IP and the username.
      return NextResponse.json(
        { success: false, error: 'Invalid username or password.' },
        { status: 401 }
      );
    }

    // ─── Success: clear rate limit counters ─────────────────────────────────
    resetKey(ipKey);
    resetKey(userKey);

    const notConfigured = () => NextResponse.json(
      { success: false, error: 'Login is not configured on the server. Contact the site owner.' },
      { status: 503 }
    );

    // ─── Two-step login: password is right, now ask for the authenticator code ──
    if (admin.totp_enabled) {
      if (!(await setMfaCookie(admin.id))) return notConfigured();
      return NextResponse.json({
        success: true,
        mfa_required: true,
        message: 'Enter the 6-digit code from Google Authenticator.'
      });
    }

    if (!(await issueAdminSession(admin))) return notConfigured();

    return NextResponse.json({
      success: true,
      message: 'Authentication successful.',
      admin: { id: admin.id, username: admin.username }
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: 'An error occurred during authentication.' },
      { status: 500 }
    );
  }
}
