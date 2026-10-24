import { Configuration, AccountApi, FoldersApi, MessagesApi, SendApi } from 'hostinger-mail-api-sdk';
import { ImapFlow } from 'imapflow';
import MailComposer from 'nodemailer/lib/mail-composer/index.js';
import { query, initFounderOSDb } from '@/lib/founder_os_db';

// The mailbox itself is the source of truth: every read and change goes live to
// the Hostinger Mail API, so other mail apps see the same state. The only thing
// the API cannot do is store a draft (no IMAP APPEND endpoint), so drafts are
// appended over IMAP, falling back to a Postgres table while IMAP login fails.

const ROLE_ORDER = ['inbox', 'drafts', 'sent', 'archive', 'junk', 'trash'];
const SPECIAL_USE_ROLES = {
  '\\Inbox': 'inbox',
  '\\Drafts': 'drafts',
  '\\Sent': 'sent',
  '\\Junk': 'junk',
  '\\Trash': 'trash',
  '\\Archive': 'archive',
};
const MAX_ATTACHMENT_BYTES = 20 * 1024 * 1024;
const REF_HEADER = 'X-IW-Ref';

let cachedMailbox = globalThis._iw_mailbox_ctx || null;

function apiConfig() {
  const accessToken = process.env.HOSTINGER_API_TOKEN;
  if (!accessToken) throw new MailboxError('HOSTINGER_API_TOKEN is not set, so the mailbox cannot be reached.', 503);
  return new Configuration({ accessToken });
}

export class MailboxError extends Error {
  constructor(message, status = 500) {
    super(message);
    this.status = status;
  }
}

export function mailboxErrorMessage(err) {
  if (err instanceof MailboxError) return err.message;
  let data = err?.response?.data;
  if (data instanceof ArrayBuffer || Buffer.isBuffer(data)) {
    try { data = JSON.parse(Buffer.from(data).toString('utf8')); } catch { data = null; }
  }
  const fieldErrors = data?.params ? Object.values(data.params).flat().join(' ') : '';
  return [data?.message || data?.error || err?.message || 'Mailbox request failed', fieldErrors].filter(Boolean).join(': ');
}

export function mailboxErrorStatus(err) {
  if (err instanceof MailboxError) return err.status;
  const status = err?.response?.status;
  return status && status >= 400 && status < 500 ? status : 502;
}

async function resolveMailbox() {
  if (cachedMailbox && cachedMailbox.token === process.env.HOSTINGER_API_TOKEN) return cachedMailbox;
  const res = await new AccountApi(apiConfig()).getCurrentAccount();
  const mailboxes = res?.data?.data?.mailboxes || [];
  const hint = process.env.HOSTINGER_MAILBOX_ID || process.env.HOSTINGER_EMAIL;
  const found = mailboxes.find(m => m.address === hint || m.resourceId === hint) || mailboxes[0];
  if (!found) throw new MailboxError('No mailbox is linked to this Hostinger API token.', 503);
  cachedMailbox = { token: process.env.HOSTINGER_API_TOKEN, resourceId: found.resourceId, address: found.address };
  globalThis._iw_mailbox_ctx = cachedMailbox;
  return cachedMailbox;
}

async function clients() {
  const config = apiConfig();
  const mailbox = await resolveMailbox();
  return {
    id: mailbox.resourceId,
    address: mailbox.address,
    folders: new FoldersApi(config),
    messages: new MessagesApi(config),
    send: new SendApi(config),
  };
}

/* ---------------------------------------------------------------- folders */

function folderRole(folder) {
  if (SPECIAL_USE_ROLES[folder.specialUse]) return SPECIAL_USE_ROLES[folder.specialUse];
  const name = (folder.name || '').toLowerCase();
  if (folder.path === 'INBOX') return 'inbox';
  if (name === 'archive') return 'archive';
  if (name === 'spam') return 'junk';
  return null;
}

export async function listFolders() {
  const api = await clients();
  const res = await api.folders.listFolders(api.id);
  const folders = (res.data?.data || []).map(f => ({
    path: f.path,
    name: folderRole(f) === 'junk' ? 'Spam' : f.name,
    role: folderRole(f),
    total: f.messageCount || 0,
    unread: f.unreadCount || 0,
  }));
  folders.sort((a, b) => {
    const ra = a.role ? ROLE_ORDER.indexOf(a.role) : 99;
    const rb = b.role ? ROLE_ORDER.indexOf(b.role) : 99;
    return ra - rb || a.name.localeCompare(b.name);
  });
  return folders;
}

async function folderByRole(role, { create = false } = {}) {
  const folders = await listFolders();
  const found = folders.find(f => f.role === role);
  if (found || !create) return found || null;
  const api = await clients();
  await api.folders.createFolder(api.id, { name: role.charAt(0).toUpperCase() + role.slice(1) });
  return (await listFolders()).find(f => f.role === role) || null;
}

export async function createFolder(name) {
  const clean = String(name || '').trim();
  if (!clean || clean.length > 100) throw new MailboxError('Folder name must be 1-100 characters.', 422);
  const api = await clients();
  await api.folders.createFolder(api.id, { name: clean });
}

/* --------------------------------------------------------------- messages */

function toSummary(m) {
  const flags = m.flags || [];
  return {
    uid: m.uid,
    folder: m.path,
    date: m.date,
    subject: m.subject || '',
    from: m.from || null,
    to: m.to || [],
    cc: m.cc || [],
    size: m.size || 0,
    unread: Boolean(m.unseen),
    starred: flags.includes('\\Flagged'),
    answered: flags.includes('\\Answered'),
    forwarded: flags.includes('$Forwarded') || flags.includes('$forwarded'),
    hasAttachments: (m.attachments || []).some(a => !a.inline),
  };
}

export async function listMessages({ folder, page = 1, perPage = 25, search = '', filter = '' }) {
  const api = await clients();
  const criteria = {};
  if (search) criteria.text = search;
  // The search endpoint matches IMAP system flags; "\Unseen" is its negation of \Seen.
  if (filter === 'unread') criteria.flags = ['\\Unseen'];
  if (filter === 'starred') criteria.flags = ['\\Flagged'];

  const res = Object.keys(criteria).length
    ? await api.messages.searchMessages(api.id, folder, page, perPage, '-uid', criteria)
    : await api.messages.listMessages(api.id, folder, page, perPage, '-uid');

  return {
    messages: (res.data?.data || []).map(toSummary),
    pagination: res.data?.pagination || { page, perPage, total: 0, totalPages: 0 },
  };
}

export function normalizeSubject(subject) {
  let s = String(subject || '').trim();
  let prev;
  do {
    prev = s;
    s = s.replace(/^\s*(re|fw|fwd|aw|wg)(\[\d+\])?\s*:\s*/i, '');
  } while (s !== prev);
  return s.trim();
}

async function findThread(api, message) {
  const subject = normalizeSubject(message.subject);
  if (!subject) return [];
  const folders = await listFolders();
  const paths = [...new Set([
    message.path,
    folders.find(f => f.role === 'inbox')?.path,
    folders.find(f => f.role === 'sent')?.path,
    folders.find(f => f.role === 'archive')?.path,
  ].filter(Boolean))];

  const related = await Promise.all(paths.map(path =>
    api.messages.searchMessages(api.id, path, 1, 15, '-date', { subject })
      .then(r => r.data?.data || [])
      .catch(() => [])
  ));
  return related.flat()
    .filter(m => normalizeSubject(m.subject).toLowerCase() === subject.toLowerCase())
    .filter(m => !(m.path === message.path && m.uid === message.uid))
    .map(toSummary)
    .sort((a, b) => new Date(a.date) - new Date(b.date));
}

async function readDraftRef(api, folder, uid) {
  try {
    const res = await api.messages.getMessageSource(api.id, folder, uid, { responseType: 'arraybuffer' });
    const head = Buffer.from(res.data).toString('utf8').split(/\r?\n\r?\n/)[0];
    const match = head.match(new RegExp(`^${REF_HEADER}:\\s*(reply|forward);(.+);(\\d+)\\s*$`, 'mi'));
    return match ? { kind: match[1], folder: match[2], uid: parseInt(match[3], 10) } : null;
  } catch {
    return null;
  }
}

export async function getMessage(folder, uid, { withThread = true } = {}) {
  const api = await clients();
  const [metaRes, textRes] = await Promise.all([
    api.messages.getMessage(api.id, folder, uid),
    api.messages.getMessageText(api.id, folder, uid),
  ]);
  const meta = metaRes.data?.data;
  if (!meta) throw new MailboxError('Message not found.', 404);
  const text = textRes.data?.data || {};
  // Opening a message reads it; the text endpoint does not reliably set \Seen itself.
  if (meta.unseen) {
    await api.messages.updateMessageFlags(api.id, folder, { uids: [uid], addFlags: ['\\Seen'] }).catch(() => {});
  }

  const folders = withThread ? await listFolders() : [];
  const isDraft = folders.find(f => f.path === folder)?.role === 'drafts' || (meta.flags || []).includes('\\Draft');

  return {
    ...toSummary(meta),
    unread: false,
    bcc: meta.bcc || [],
    messageId: meta.messageId || null,
    inReplyTo: meta.inReplyTo || null,
    text: text.text || '',
    html: text.html || '',
    attachments: (meta.attachments || []).map(a => ({
      id: a.id,
      filename: a.filename || 'attachment',
      contentType: a.contentType || 'application/octet-stream',
      size: a.sizeBytes || 0,
      inline: Boolean(a.inline),
      contentId: a.contentId ? a.contentId.replace(/^<|>$/g, '') : null,
    })),
    draftRef: isDraft ? await readDraftRef(api, folder, uid) : null,
    thread: withThread && !isDraft ? await findThread(api, meta) : [],
  };
}

export async function getAttachment(folder, uid, attachmentId) {
  const api = await clients();
  const [metaRes, fileRes] = await Promise.all([
    api.messages.getMessage(api.id, folder, uid),
    api.messages.getMessageAttachment(api.id, folder, uid, attachmentId, { responseType: 'arraybuffer' }),
  ]);
  const info = (metaRes.data?.data?.attachments || []).find(a => a.id === attachmentId) || {};
  return {
    buffer: Buffer.from(fileRes.data),
    filename: info.filename || 'attachment',
    contentType: info.contentType || fileRes.headers?.['content-type'] || 'application/octet-stream',
  };
}

function assertUids(uids) {
  const clean = [...new Set((uids || []).map(u => parseInt(u, 10)).filter(u => u > 0))];
  if (!clean.length) throw new MailboxError('No messages selected.', 422);
  if (clean.length > 100) throw new MailboxError('Select at most 100 messages at a time.', 422);
  return clean;
}

export async function updateFlags(folder, uids, { add = [], remove = [] }) {
  const api = await clients();
  const res = await api.messages.updateMessageFlags(api.id, folder, {
    uids: assertUids(uids),
    addFlags: add.length ? add : undefined,
    removeFlags: remove.length ? remove : undefined,
  });
  return res.data?.data || null;
}

export async function moveMessages(folder, uids, targetFolder) {
  if (!targetFolder || targetFolder === folder) throw new MailboxError('Pick a different folder to move to.', 422);
  const api = await clients();
  await api.messages.moveMessages(api.id, folder, { uids: assertUids(uids), targetFolder });
}

export async function archiveMessages(folder, uids) {
  const archive = await folderByRole('archive', { create: true });
  if (!archive) throw new MailboxError('Could not find or create an Archive folder.', 502);
  await moveMessages(folder, uids, archive.path);
  return archive.path;
}

// Moves to Trash; messages already in Trash (or Spam) are deleted for good.
export async function trashMessages(folder, uids) {
  const folders = await listFolders();
  const role = folders.find(f => f.path === folder)?.role;
  const trash = folders.find(f => f.role === 'trash');
  if (!trash || role === 'trash' || role === 'junk') {
    await deleteMessagesForever(folder, uids);
    return { permanent: true };
  }
  await moveMessages(folder, uids, trash.path);
  return { permanent: false, trash: trash.path };
}

export async function deleteMessagesForever(folder, uids) {
  const api = await clients();
  await api.messages.deleteMessages(api.id, folder, { uids: assertUids(uids) });
}

/* ------------------------------------------------------------ composition */

function splitAddresses(value) {
  const list = Array.isArray(value) ? value : String(value || '').split(/[,;\n]+/);
  return [...new Set(list.map(a => String(a).trim()).filter(Boolean))];
}

const EMAIL_RE = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/;

function bareAddress(entry) {
  const m = String(entry).match(/<([^>]+)>/);
  return (m ? m[1] : entry).trim();
}

function validateAddresses(list, label) {
  const bad = list.filter(a => !EMAIL_RE.test(bareAddress(a)));
  if (bad.length) throw new MailboxError(`Invalid ${label} address: ${bad.join(', ')}`, 422);
  return list.map(bareAddress);
}

export function htmlToText(html) {
  return String(html || '')
    .replace(/<(style|script|head)[^>]*>[\s\S]*?<\/\1>/gi, '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(p|div|li|h[1-6]|tr|blockquote)>/gi, '\n')
    .replace(/<li[^>]*>/gi, '- ')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function normalizeRef(ref) {
  if (!ref || !ref.folder || !(parseInt(ref.uid, 10) > 0)) return null;
  return { folder: String(ref.folder), uid: parseInt(ref.uid, 10) };
}

// Collects uploaded files (base64) plus attachments carried over from an
// existing message (forward / reopened draft), fetched from the mailbox.
async function resolveAttachments(uploads = [], carried = []) {
  const out = [];
  let total = 0;
  for (const a of uploads) {
    if (!a?.content || !a?.filename) continue;
    const content = String(a.content).replace(/^data:[^,]*,/, '');
    total += Math.floor(content.length * 0.75);
    out.push({ filename: String(a.filename), content, contentType: a.contentType || 'application/octet-stream' });
  }
  for (const c of carried) {
    if (!c?.id || !normalizeRef(c)) continue;
    const file = await getAttachment(c.folder, parseInt(c.uid, 10), c.id);
    total += file.buffer.length;
    out.push({ filename: c.filename || file.filename, content: file.buffer.toString('base64'), contentType: file.contentType });
  }
  if (total > MAX_ATTACHMENT_BYTES) throw new MailboxError('Attachments are larger than 20 MB in total.', 413);
  return out;
}

function normalizeDraftInput(input = {}) {
  return {
    to: splitAddresses(input.to),
    cc: splitAddresses(input.cc),
    bcc: splitAddresses(input.bcc),
    subject: String(input.subject || '').slice(0, 998),
    html: String(input.html || ''),
    attachments: Array.isArray(input.attachments) ? input.attachments : [],
    carryAttachments: Array.isArray(input.carryAttachments) ? input.carryAttachments : [],
    replyTo: normalizeRef(input.replyTo),
    forwardOf: normalizeRef(input.forwardOf),
    draftUid: parseInt(input.draftUid, 10) || null,
    localDraftId: parseInt(input.localDraftId, 10) || null,
  };
}

export async function sendMail(input) {
  const draft = normalizeDraftInput(input);
  const to = validateAddresses(draft.to, 'To');
  const cc = validateAddresses(draft.cc, 'Cc');
  const bcc = validateAddresses(draft.bcc, 'Bcc');
  if (!to.length) throw new MailboxError('Add at least one recipient.', 422);
  if (!draft.subject.trim() && !htmlToText(draft.html)) throw new MailboxError('The message is empty.', 422);

  const api = await clients();
  const attachments = await resolveAttachments(draft.attachments, draft.carryAttachments);
  await api.send.sendEmail(api.id, {
    to,
    cc: cc.length ? cc : undefined,
    bcc: bcc.length ? bcc : undefined,
    subject: draft.subject,
    html: draft.html,
    text: htmlToText(draft.html),
    displayName: process.env.HOSTINGER_FROM_NAME || 'InfronixWeb',
    attachments: attachments.length ? attachments : undefined,
    inReplyTo: draft.replyTo || undefined,
    forwardOf: draft.replyTo ? undefined : draft.forwardOf || undefined,
  });

  // The draft has become a sent message, so clear it from wherever it lived.
  if (draft.draftUid) {
    const drafts = await folderByRole('drafts');
    if (drafts) await deleteMessagesForever(drafts.path, [draft.draftUid]).catch(() => {});
  }
  if (draft.localDraftId) await deleteLocalDraft(draft.localDraftId).catch(() => {});

  return { to, cc, bcc, subject: draft.subject };
}

/* ----------------------------------------------------------------- drafts */

let imapState = globalThis._iw_imap_state || { failedAt: 0, reason: '' };
const IMAP_RETRY_MS = 5 * 60 * 1000;

async function withImap(fn) {
  const user = process.env.HOSTINGER_EMAIL;
  const pass = process.env.HOSTINGER_EMAIL_PASSWORD;
  if (!user || !pass) throw new MailboxError('IMAP credentials are not configured.', 503);
  if (imapState.failedAt && Date.now() - imapState.failedAt < IMAP_RETRY_MS) {
    throw new MailboxError(imapState.reason, 503);
  }
  const client = new ImapFlow({
    host: process.env.HOSTINGER_IMAP_HOST || 'imap.hostinger.com',
    port: parseInt(process.env.HOSTINGER_IMAP_PORT || '993', 10),
    secure: true,
    auth: { user, pass },
    logger: false,
  });
  try {
    await client.connect();
  } catch (err) {
    imapState = {
      failedAt: Date.now(),
      reason: err.authenticationFailed
        ? 'IMAP login failed: HOSTINGER_EMAIL_PASSWORD is out of date.'
        : `IMAP connection failed: ${err.message}`,
    };
    globalThis._iw_imap_state = imapState;
    throw new MailboxError(imapState.reason, 503);
  }
  imapState = { failedAt: 0, reason: '' };
  globalThis._iw_imap_state = imapState;
  try {
    return await fn(client);
  } finally {
    await client.logout().catch(() => {});
  }
}

export function draftStorageStatus() {
  const blocked = imapState.failedAt && Date.now() - imapState.failedAt < IMAP_RETRY_MS;
  return blocked ? { mode: 'panel', reason: imapState.reason } : { mode: 'mailbox', reason: '' };
}

let draftsTableReady = Boolean(globalThis._iw_mail_drafts_ready);

async function initDraftsTable() {
  await initFounderOSDb();
  if (draftsTableReady) return;
  await query(`
    CREATE TABLE IF NOT EXISTS founder_os_mail_drafts (
      id SERIAL PRIMARY KEY,
      data JSONB NOT NULL DEFAULT '{}'::jsonb,
      created_by VARCHAR(255) DEFAULT 'admin',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `);
  draftsTableReady = true;
  globalThis._iw_mail_drafts_ready = true;
}

async function buildRawDraft(draft, address) {
  const attachments = await resolveAttachments(draft.attachments, draft.carryAttachments);
  const ref = draft.replyTo ? ['reply', draft.replyTo] : draft.forwardOf ? ['forward', draft.forwardOf] : null;
  const mail = new MailComposer({
    from: { name: process.env.HOSTINGER_FROM_NAME || 'InfronixWeb', address },
    to: draft.to.join(', ') || undefined,
    cc: draft.cc.join(', ') || undefined,
    bcc: draft.bcc.join(', ') || undefined,
    subject: draft.subject,
    html: draft.html,
    text: htmlToText(draft.html),
    headers: ref ? { [REF_HEADER]: `${ref[0]};${ref[1].folder};${ref[1].uid}` } : {},
    attachments: attachments.map(a => ({ filename: a.filename, content: a.content, encoding: 'base64', contentType: a.contentType })),
  });
  mail.keepBcc = true;
  return mail.compile().build();
}

// Saves to the mailbox's Drafts folder when IMAP works, otherwise to Postgres.
export async function saveDraft(input, userName = 'admin') {
  const draft = normalizeDraftInput(input);
  const api = await clients();
  const drafts = await folderByRole('drafts');

  if (drafts) {
    try {
      const raw = await buildRawDraft(draft, api.address);
      const appended = await withImap(client => client.append(drafts.path, raw, ['\\Draft', '\\Seen']));
      if (draft.draftUid) await deleteMessagesForever(drafts.path, [draft.draftUid]).catch(() => {});
      if (draft.localDraftId) await deleteLocalDraft(draft.localDraftId).catch(() => {});
      return { mode: 'mailbox', folder: drafts.path, uid: appended?.uid || null };
    } catch (err) {
      if (!(err instanceof MailboxError) || err.status !== 503) throw err;
    }
  }

  await initDraftsTable();
  const data = {
    to: draft.to, cc: draft.cc, bcc: draft.bcc, subject: draft.subject, html: draft.html,
    attachments: draft.attachments, carryAttachments: draft.carryAttachments,
    replyTo: draft.replyTo, forwardOf: draft.forwardOf, draftUid: draft.draftUid,
  };
  const size = JSON.stringify(data).length;
  if (size > MAX_ATTACHMENT_BYTES * 1.4) throw new MailboxError('Draft is too large to save.', 413);
  let res;
  if (draft.localDraftId) {
    res = await query('UPDATE founder_os_mail_drafts SET data = $1, updated_at = NOW() WHERE id = $2 RETURNING id', [data, draft.localDraftId]);
  }
  if (!res?.rows?.length) {
    res = await query('INSERT INTO founder_os_mail_drafts (data, created_by) VALUES ($1, $2) RETURNING id', [data, userName]);
  }
  return { mode: 'panel', localDraftId: res.rows[0].id, reason: draftStorageStatus().reason };
}

export async function listLocalDrafts() {
  await initDraftsTable();
  const res = await query('SELECT id, data, updated_at FROM founder_os_mail_drafts ORDER BY updated_at DESC LIMIT 100');
  return res.rows.map(r => ({
    localDraftId: r.id,
    date: r.updated_at,
    subject: r.data.subject || '',
    from: null,
    to: (r.data.to || []).map(address => ({ name: '', address })),
    unread: false,
    starred: false,
    hasAttachments: (r.data.attachments || []).length + (r.data.carryAttachments || []).length > 0,
  }));
}

export async function getLocalDraft(id) {
  await initDraftsTable();
  const res = await query('SELECT id, data, updated_at FROM founder_os_mail_drafts WHERE id = $1', [id]);
  if (!res.rows.length) throw new MailboxError('Draft not found.', 404);
  return { localDraftId: res.rows[0].id, updatedAt: res.rows[0].updated_at, ...res.rows[0].data };
}

export async function deleteLocalDraft(id) {
  await initDraftsTable();
  await query('DELETE FROM founder_os_mail_drafts WHERE id = $1', [id]);
}

export async function mailboxStatus() {
  const mailbox = await resolveMailbox();
  return { address: mailbox.address, drafts: draftStorageStatus() };
}
