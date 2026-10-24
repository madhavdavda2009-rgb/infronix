import { NextResponse } from 'next/server';
import { verifyAdminAuth } from '@/lib/auth';
import { logActivity } from '@/lib/audit_logger';
import { sendMail, mailboxErrorMessage, mailboxErrorStatus } from '@/lib/mailbox';

export async function POST(request) {
  const auth = verifyAdminAuth(request);
  if (!auth) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const sent = await sendMail(body);
    const kind = body.replyTo ? 'Replied' : body.forwardOf ? 'Forwarded' : 'Sent';
    await logActivity(auth.username, 'Mailbox', null, kind, `${kind} "${sent.subject || '(no subject)'}" to ${sent.to.join(', ')}`);
    return NextResponse.json({ success: true, ...sent });
  } catch (err) {
    console.error('Mailbox send error:', err);
    return NextResponse.json({ success: false, error: mailboxErrorMessage(err) }, { status: mailboxErrorStatus(err) });
  }
}
