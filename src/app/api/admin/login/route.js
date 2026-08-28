import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { execute } from '@/lib/db';
import { cookies } from 'next/headers';

export async function POST(request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: 'Please provide both username and password.' },
        { status: 400 }
      );
    }

    const [rows] = await execute('SELECT * FROM admins WHERE username = ? LIMIT 1', [username.trim()]);
    
    if (rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Invalid username or password.' },
        { status: 401 }
      );
    }

    const admin = rows[0];
    const isPasswordValid = await bcrypt.compare(password, admin.password_hash);

    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, error: 'Invalid username or password.' },
        { status: 401 }
      );
    }

    const secret = process.env.JWT_SECRET || 'infronix_sec_jwt_key_2026_v99a7b2c';
    const token = jwt.sign(
      { id: admin.id, username: admin.username },
      secret,
      { expiresIn: '8h' }
    );

    // Set secure HTTP-Only cookie using Next.js cookies API
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
