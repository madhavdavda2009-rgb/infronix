import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { execute } from '@/lib/db';
import { cookies } from 'next/headers';
import { checkAndRecord, resetKey, getIp } from '@/lib/rate_limiter';

export async function POST(request) {
  try {
    const ip = getIp(request);
    const ipKey = `admin_login:ip:${ip}`;

    // ─── IP-based rate limit: 3 attempts per hour ───────────────────────────
    const ipCheck = checkAndRecord(ipKey, { maxAttempts: 3, lockMs: 60 * 60 * 1000 });
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
    const userCheck = checkAndRecord(userKey, { maxAttempts: 3, lockMs: 60 * 60 * 1000 });
    if (!userCheck.allowed) {
      return NextResponse.json(
        { success: false, error: userCheck.message },
        { status: 429 }
      );
    }

    const [rows] = await execute('SELECT * FROM admins WHERE username = ? LIMIT 1', [username.trim()]);
    
    if (rows.length === 0) {
      // Record failed attempt — wrong username still counts
      checkAndRecord(ipKey, { maxAttempts: 3, lockMs: 60 * 60 * 1000 });
      return NextResponse.json(
        { success: false, error: 'Invalid username or password.' },
        { status: 401 }
      );
    }

    const admin = rows[0];
    const isPasswordValid = await bcrypt.compare(password, admin.password_hash);

    if (!isPasswordValid) {
      // Additional failed attempt recorded for both IP and username
      checkAndRecord(userKey, { maxAttempts: 3, lockMs: 60 * 60 * 1000 });
      return NextResponse.json(
        { success: false, error: 'Invalid username or password.' },
        { status: 401 }
      );
    }

    // ─── Success: clear rate limit counters ─────────────────────────────────
    resetKey(ipKey);
    resetKey(userKey);

    const secret = process.env.JWT_SECRET || 'infronix_sec_jwt_key_2026_v99a7b2c';
    const token = jwt.sign(
      { id: admin.id, username: admin.username },
      secret,
      { expiresIn: '8h' }
    );

    // Set secure HTTP-Only cookie using cookies API
    const cookieStore = await cookies();
    cookieStore.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 8 * 60 * 60 // 8 hours in seconds
    });

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
