import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyAdminAuth } from '@/lib/auth';

export async function POST(request) {
  const admin = verifyAdminAuth(request);
  if (!admin) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }

  const cookieStore = await cookies();
  cookieStore.delete('admin_token');

  return NextResponse.json({ success: true, message: 'Logged out successfully.' });
}
