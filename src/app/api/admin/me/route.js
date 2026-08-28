import { NextResponse } from 'next/server';
import { verifyAdminAuth } from '@/lib/auth';

export async function GET(request) {
  const admin = verifyAdminAuth(request);
  if (!admin) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized access. Authentication token missing or invalid.' },
      { status: 401 }
    );
  }

  return NextResponse.json({ success: true, admin });
}
