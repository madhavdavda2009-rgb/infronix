import { NextResponse } from 'next/server';
import { verifyAdminAuth } from '@/lib/auth';
import { logActivity } from '@/lib/audit_logger';
import { listFolders, mailboxStatus, createFolder, mailboxErrorMessage, mailboxErrorStatus } from '@/lib/mailbox';

export async function GET(request) {
  const auth = verifyAdminAuth(request);
  if (!auth) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const [status, folders] = await Promise.all([mailboxStatus(), listFolders()]);
    return NextResponse.json({ success: true, ...status, folders });
  } catch (err) {
    console.error('Mailbox GET error:', err);
    return NextResponse.json({ success: false, error: mailboxErrorMessage(err) }, { status: mailboxErrorStatus(err) });
  }
}

export async function POST(request) {
  const auth = verifyAdminAuth(request);
  if (!auth) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { name } = await request.json();
    await createFolder(name);
    await logActivity(auth.username, 'Mailbox', null, 'Folder Created', `Created mail folder "${String(name).trim()}"`);
    return NextResponse.json({ success: true, folders: await listFolders() });
  } catch (err) {
    console.error('Mailbox folder create error:', err);
    return NextResponse.json({ success: false, error: mailboxErrorMessage(err) }, { status: mailboxErrorStatus(err) });
  }
}
