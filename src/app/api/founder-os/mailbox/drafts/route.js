import { NextResponse } from 'next/server';
import { verifyAdminAuth } from '@/lib/auth';
import { saveDraft, getLocalDraft, deleteLocalDraft, mailboxErrorMessage, mailboxErrorStatus } from '@/lib/mailbox';

export async function GET(request) {
  const auth = verifyAdminAuth(request);
  if (!auth) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const id = parseInt(new URL(request.url).searchParams.get('id'), 10);
    if (!id) {
      return NextResponse.json({ success: false, error: 'id is required' }, { status: 422 });
    }
    return NextResponse.json({ success: true, draft: await getLocalDraft(id) });
  } catch (err) {
    console.error('Mailbox draft GET error:', err);
    return NextResponse.json({ success: false, error: mailboxErrorMessage(err) }, { status: mailboxErrorStatus(err) });
  }
}

export async function POST(request) {
  const auth = verifyAdminAuth(request);
  if (!auth) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const saved = await saveDraft(await request.json(), auth.username);
    return NextResponse.json({ success: true, ...saved });
  } catch (err) {
    console.error('Mailbox draft save error:', err);
    return NextResponse.json({ success: false, error: mailboxErrorMessage(err) }, { status: mailboxErrorStatus(err) });
  }
}

export async function DELETE(request) {
  const auth = verifyAdminAuth(request);
  if (!auth) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const id = parseInt(new URL(request.url).searchParams.get('id'), 10);
    if (!id) {
      return NextResponse.json({ success: false, error: 'id is required' }, { status: 422 });
    }
    await deleteLocalDraft(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Mailbox draft delete error:', err);
    return NextResponse.json({ success: false, error: mailboxErrorMessage(err) }, { status: mailboxErrorStatus(err) });
  }
}
