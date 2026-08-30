import { NextResponse } from 'next/server';
import { verifyAdminAuth } from '@/lib/auth';
import { verifySmtpConnection } from '@/lib/email-automation/mailer';

export async function GET(request) {
  try {
    const admin = verifyAdminAuth(request);
    if (!admin) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const status = await verifySmtpConnection();

    return NextResponse.json({
      success: true,
      data: status
    });
  } catch (err) {
    console.error('SMTP Status check error:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to check SMTP connection status' },
      { status: 500 }
    );
  }
}
