import { NextResponse } from 'next/server';
import { verifyAdminAuth } from '@/lib/auth';
import { logActivity } from '@/lib/audit_logger';
import {
  listMessages,
  listLocalDrafts,
  updateFlags,
  moveMessages,
  archiveMessages,
  trashMessages,
  deleteMessagesForever,
  mailboxErrorMessage,
  mailboxErrorStatus,
} from '@/lib/mailbox';

export async function GET(request) {
  const auth = verifyAdminAuth(request);
  if (!auth) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const folder = searchParams.get('folder') || 'INBOX';
    const page = Math.max(1, parseInt(searchParams.get('page'), 10) || 1);
    const perPage = Math.min(100, Math.max(5, parseInt(searchParams.get('perPage'), 10) || 25));
    const search = (searchParams.get('q') || '').trim().slice(0, 200);
    const filter = searchParams.get('filter') || '';

    const result = await listMessages({ folder, page, perPage, search, filter });
    // Drafts saved in the panel (while IMAP is unavailable) sit above mailbox drafts.
    const localDrafts = searchParams.get('role') === 'drafts' && page === 1 && !search && !filter
      ? await listLocalDrafts()
      : [];

    return NextResponse.json({ success: true, ...result, localDrafts });
  } catch (err) {
    console.error('Mailbox list error:', err);
    return NextResponse.json({ success: false, error: mailboxErrorMessage(err) }, { status: mailboxErrorStatus(err) });
  }
}

const FLAG_ACTIONS = {
  read: { add: ['\\Seen'] },
  unread: { remove: ['\\Seen'] },
  star: { add: ['\\Flagged'] },
  unstar: { remove: ['\\Flagged'] },
};

export async function POST(request) {
  const auth = verifyAdminAuth(request);
  if (!auth) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { action, folder, uids = [], target } = await request.json();
    if (!folder) {
      return NextResponse.json({ success: false, error: 'Folder is required' }, { status: 422 });
    }
    const count = uids.length;
    const label = `${count} message${count === 1 ? '' : 's'}`;

    if (FLAG_ACTIONS[action]) {
      const result = await updateFlags(folder, uids, FLAG_ACTIONS[action]);
      return NextResponse.json({ success: true, result });
    }

    if (action === 'move') {
      await moveMessages(folder, uids, target);
      await logActivity(auth.username, 'Mailbox', null, 'Moved', `Moved ${label} from ${folder} to ${target}`);
      return NextResponse.json({ success: true, target });
    }

    if (action === 'archive') {
      const archived = await archiveMessages(folder, uids);
      await logActivity(auth.username, 'Mailbox', null, 'Archived', `Archived ${label} from ${folder}`);
      return NextResponse.json({ success: true, target: archived });
    }

    if (action === 'trash') {
      const result = await trashMessages(folder, uids);
      await logActivity(auth.username, 'Mailbox', null, result.permanent ? 'Deleted' : 'Trashed',
        `${result.permanent ? 'Permanently deleted' : 'Moved to Trash'} ${label} from ${folder}`);
      return NextResponse.json({ success: true, ...result });
    }

    if (action === 'delete') {
      await deleteMessagesForever(folder, uids);
      await logActivity(auth.username, 'Mailbox', null, 'Deleted', `Permanently deleted ${label} from ${folder}`);
      return NextResponse.json({ success: true, permanent: true });
    }

    return NextResponse.json({ success: false, error: 'Unknown action' }, { status: 422 });
  } catch (err) {
    console.error('Mailbox action error:', err);
    return NextResponse.json({ success: false, error: mailboxErrorMessage(err) }, { status: mailboxErrorStatus(err) });
  }
}
