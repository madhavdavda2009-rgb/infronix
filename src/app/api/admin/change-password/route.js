import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { execute } from '@/lib/db';
import { verifyAdminAuth } from '@/lib/auth';

export async function POST(request) {
  try {
    const adminSession = verifyAdminAuth(request);
    if (!adminSession) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { success: false, error: 'Please provide both current and new passwords.' },
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { success: false, error: 'New password must be at least 8 characters long.' },
        { status: 400 }
      );
    }

    const [rows] = await execute('SELECT * FROM admins WHERE id = ? LIMIT 1', [adminSession.id]);
    if (rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Admin account not found.' },
        { status: 404 }
      );
    }

    const admin = rows[0];
    const isPasswordValid = await bcrypt.compare(currentPassword, admin.password_hash);
    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, error: 'Incorrect current password.' },
        { status: 400 }
      );
    }

    const salt = await bcrypt.genSalt(10);
    const newPasswordHash = await bcrypt.hash(newPassword, salt);

    await execute('UPDATE admins SET password_hash = ? WHERE id = ?', [newPasswordHash, adminSession.id]);

    return NextResponse.json({ success: true, message: 'Password updated successfully!' });
  } catch (error) {
    console.error('Error changing password:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update password.' },
      { status: 500 }
    );
  }
}
