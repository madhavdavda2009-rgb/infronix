import { NextResponse } from 'next/server';
import { verifyAdminAuth } from '@/lib/auth';
import { initEmailAutomationDb } from '@/lib/email-automation/db-init';
import { sendOutreachEmail } from '@/lib/email-automation/mailer';

export async function POST(request) {
  try {
    const admin = verifyAdminAuth(request);
    if (!admin) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await initEmailAutomationDb();

    const body = await request.json();
    const { leadId, recipient, subject, body: emailBody, draftId } = body;

    if (!recipient || !recipient.includes('@')) {
      return NextResponse.json(
        { success: false, error: 'A valid recipient email address is required.' },
        { status: 400 }
      );
    }

    if (!subject || subject.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Subject line cannot be empty.' },
        { status: 400 }
      );
    }

    if (!emailBody || emailBody.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Email body cannot be empty.' },
        { status: 400 }
      );
    }

    // Explicit approval dispatch through server-side Hostinger SMTP
    const result = await sendOutreachEmail({
      leadId,
      recipient,
      subject,
      body: emailBody,
      draftId
    });

    return NextResponse.json({
      success: true,
      message: `Email successfully delivered to ${recipient}`,
      data: result
    });
  } catch (err) {
    console.error('Send error:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to send outreach email.' },
      { status: 500 }
    );
  }
}
