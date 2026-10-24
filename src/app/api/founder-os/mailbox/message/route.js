import { NextResponse } from 'next/server';
import { verifyAdminAuth } from '@/lib/auth';
import { getMessage, mailboxErrorMessage, mailboxErrorStatus } from '@/lib/mailbox';

export async function GET(request) {
  const auth = verifyAdminAuth(request);
  if (!auth) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const folder = searchParams.get('folder');
    const uid = parseInt(searchParams.get('uid'), 10);
    if (!folder || !uid) {
      return NextResponse.json({ success: false, error: 'folder and uid are required' }, { status: 422 });
    }
    const message = await getMessage(folder, uid, { withThread: searchParams.get('thread') !== '0' });
    return NextResponse.json({ success: true, message });
  } catch (err) {
    console.error('Mailbox message error:', err);
    return NextResponse.json({ success: false, error: mailboxErrorMessage(err) }, { status: mailboxErrorStatus(err) });
  }
}
