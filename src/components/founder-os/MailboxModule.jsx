"use client";
import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import {
  Tray,
  PaperPlaneTilt,
  PencilSimpleLine,
  FileDashed,
  Archive,
  Warning,
  Trash,
  FolderSimple,
  MagnifyingGlass,
  ArrowsClockwise,
  ArrowLeft,
  ArrowBendUpLeft,
  ArrowBendDoubleUpLeft,
  ArrowBendUpRight,
  Star,
  EnvelopeSimple,
  EnvelopeSimpleOpen,
  Paperclip,
  DownloadSimple,
  Image as ImageIcon,
  X,
  CaretLeft,
  CaretRight,
  CaretDown,
  FloppyDisk,
  TextB,
  TextItalic,
  TextUnderline,
  ListBullets,
  ListNumbers,
  LinkSimple,
  TextT,
  FolderPlus,
  ShieldWarning,
  Info,
  CircleNotch,
} from '@phosphor-icons/react';
import EmptyState from './EmptyState';
import { ConfirmModal } from './ConfirmModal';
import { useToast } from '@/context/ToastContext';
import { sanitizeEmailHtml, buildEmailDocument, textToHtml, escapeHtml } from '@/lib/mail_html';

const FOLDER_ICONS = {
  inbox: Tray,
  drafts: FileDashed,
  sent: PaperPlaneTilt,
  archive: Archive,
  junk: Warning,
  trash: Trash,
};
const PER_PAGE = 25;
const MAX_UPLOAD_BYTES = 20 * 1024 * 1024;
const POLL_MS = 60 * 1000;

/* ---------------------------------------------------------------- helpers */

async function api(url, options = {}) {
  const res = await fetch(url, {
    ...options,
    headers: options.body ? { 'Content-Type': 'application/json', ...(options.headers || {}) } : options.headers,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.success === false) throw new Error(data.error || `Request failed (${res.status})`);
  return data;
}

function addrLabel(a) {
  if (!a) return '';
  return a.name?.trim() || a.address || '';
}

function addrFull(a) {
  if (!a) return '';
  return a.name?.trim() ? `${a.name.trim()} <${a.address}>` : a.address;
}

function formatListDate(value) {
  if (!value) return '';
  const d = new Date(value);
  const now = new Date();
  if (d.toDateString() === now.toDateString()) {
    return d.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' });
  }
  if (d.getFullYear() === now.getFullYear()) {
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  }
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: '2-digit' });
}

function formatFullDate(value) {
  if (!value) return '';
  return new Date(value).toLocaleString('en-IN', {
    weekday: 'short', day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit',
  });
}

function formatBytes(bytes) {
  if (!bytes) return '0 KB';
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function initials(a) {
  const label = addrLabel(a) || '?';
  const parts = label.replace(/[^\p{L}\p{N} ]/gu, '').trim().split(/\s+/);
  return ((parts[0]?.[0] || '?') + (parts[1]?.[0] || '')).toUpperCase();
}

function attachmentUrl(folder, uid, id, download = false) {
  const params = new URLSearchParams({ folder, uid: String(uid), id });
  if (download) params.set('download', '1');
  return `/api/founder-os/mailbox/attachment?${params}`;
}

function prefixSubject(prefix, subject) {
  const s = (subject || '').trim();
  return new RegExp(`^${prefix}:`, 'i').test(s) ? s : `${prefix}: ${s}`;
}

function quoteBlock(message) {
  const { html } = message.html
    ? sanitizeEmailHtml(message.html, { forQuote: true })
    : { html: textToHtml(message.text) };
  return `<br><br><div>On ${escapeHtml(formatFullDate(message.date))}, ${escapeHtml(addrFull(message.from))} wrote:</div>`
    + `<blockquote style="margin:0 0 0 4px;padding-left:12px;border-left:3px solid #e2e8f0;color:#475569">${html}</blockquote>`;
}

function forwardBlock(message) {
  const { html } = message.html
    ? sanitizeEmailHtml(message.html, { forQuote: true })
    : { html: textToHtml(message.text) };
  const rows = [
    ['From', addrFull(message.from)],
    ['Date', formatFullDate(message.date)],
    ['Subject', message.subject],
    ['To', (message.to || []).map(addrFull).join(', ')],
    message.cc?.length ? ['Cc', message.cc.map(addrFull).join(', ')] : null,
  ].filter(Boolean);
  return `<br><br><div>---------- Forwarded message ----------</div>`
    + rows.map(([k, v]) => `<div>${k}: ${escapeHtml(v)}</div>`).join('')
    + `<br>${html}`;
}

/* ------------------------------------------------------------ email body */

function EmailBody({ message }) {
  const [showImages, setShowImages] = useState(false);
  const frameRef = useRef(null);

  const rendered = useMemo(() => {
    if (typeof window === 'undefined') return { doc: '', blocked: 0 };
    const cidMap = {};
    for (const a of message.attachments || []) {
      if (a.contentId) cidMap[a.contentId] = attachmentUrl(message.folder, message.uid, a.id);
    }
    const { html, blocked } = message.html
      ? sanitizeEmailHtml(message.html, { showImages, cidMap })
      : { html: textToHtml(message.text || ''), blocked: 0 };
    return { doc: buildEmailDocument(html, { showImages, origin: window.location.origin }), blocked };
  }, [message, showImages]);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return undefined;
    let observer;
    const fit = () => {
      const doc = frame.contentDocument;
      if (doc?.documentElement) frame.style.height = `${Math.max(80, doc.documentElement.scrollHeight + 4)}px`;
    };
    const onLoad = () => {
      fit();
      const body = frame.contentDocument?.body;
      if (body && typeof ResizeObserver !== 'undefined') {
        observer = new ResizeObserver(fit);
        observer.observe(body);
      }
    };
    frame.addEventListener('load', onLoad);
    return () => {
      frame.removeEventListener('load', onLoad);
      observer?.disconnect();
    };
  }, [rendered.doc]);

  return (
    <div>
      {rendered.blocked > 0 && !showImages && (
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3 px-3 py-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs">
          <span className="flex items-center gap-1.5">
            <ImageIcon size={15} weight="bold" />
            Remote images are hidden to protect your privacy.
          </span>
          <button
            type="button"
            onClick={() => setShowImages(true)}
            className="font-bold text-amber-900 hover:underline cursor-pointer"
          >
            Show images
          </button>
        </div>
      )}
      <iframe
        ref={frameRef}
        title="Email content"
        sandbox="allow-same-origin allow-popups allow-popups-to-escape-sandbox"
        srcDoc={rendered.doc}
        className="w-full border-0 bg-white"
        style={{ height: 120 }}
      />
    </div>
  );
}

function AttachmentList({ message }) {
  const files = (message.attachments || []).filter(a => !a.inline || !a.contentId);
  if (!files.length) return null;
  return (
    <div className="mt-4 pt-4 border-t border-slate-100">
      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
        <Paperclip size={13} weight="bold" /> {files.length} attachment{files.length === 1 ? '' : 's'}
      </p>
      <div className="flex flex-wrap gap-2">
        {files.map(a => (
          <div key={a.id} className="flex items-center gap-2 pl-3 pr-1 py-1 rounded-xl border border-slate-200 bg-slate-50 max-w-full">
            <a
              href={attachmentUrl(message.folder, message.uid, a.id)}
              target="_blank"
              rel="noopener noreferrer"
              className="min-w-0 text-xs font-semibold text-slate-700 hover:text-violet-700 truncate"
              title={a.filename}
            >
              {a.filename}
            </a>
            <span className="text-[11px] text-slate-400 shrink-0">{formatBytes(a.size)}</span>
            <a
              href={attachmentUrl(message.folder, message.uid, a.id, true)}
              className="p-1.5 rounded-lg text-slate-500 hover:text-violet-700 hover:bg-violet-50 shrink-0"
              title="Download"
            >
              <DownloadSimple size={15} weight="bold" />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------- composer */

function ToolbarButton({ icon: Icon, label, onClick }) {
  return (
    <button
      type="button"
      title={label}
      onMouseDown={e => e.preventDefault()}
      onClick={onClick}
      className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 cursor-pointer"
    >
      <Icon size={16} weight="bold" />
    </button>
  );
}

function Composer({ initial, onClose, onSent, onSaved }) {
  const { showToast } = useToast();
  const editorRef = useRef(null);
  const fileRef = useRef(null);
  const [to, setTo] = useState(initial.to || '');
  const [cc, setCc] = useState(initial.cc || '');
  const [bcc, setBcc] = useState(initial.bcc || '');
  const [showCc, setShowCc] = useState(Boolean(initial.cc || initial.bcc));
  const [subject, setSubject] = useState(initial.subject || '');
  const [uploads, setUploads] = useState(initial.attachments || []);
  const [carried, setCarried] = useState(initial.carryAttachments || []);
  const [draftUid, setDraftUid] = useState(initial.draftUid || null);
  const [localDraftId, setLocalDraftId] = useState(initial.localDraftId || null);
  const [busy, setBusy] = useState('');
  const [dirty, setDirty] = useState(false);
  const [confirmClose, setConfirmClose] = useState(false);

  useEffect(() => {
    if (editorRef.current) editorRef.current.innerHTML = initial.html || '';
    const el = editorRef.current;
    if (!initial.to && !initial.html) document.getElementById('mail-compose-to')?.focus();
    else if (el) {
      el.focus();
      const range = document.createRange();
      range.setStart(el, 0);
      range.collapse(true);
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    }
  }, [initial]);

  const exec = (command, value = null) => {
    editorRef.current?.focus();
    document.execCommand(command, false, value);
    setDirty(true);
  };

  const addLink = () => {
    const url = window.prompt('Link URL', 'https://');
    if (url && /^(https?:|mailto:)/i.test(url.trim())) exec('createLink', url.trim());
  };

  const totalBytes = uploads.reduce((s, a) => s + (a.size || 0), 0) + carried.reduce((s, a) => s + (a.size || 0), 0);

  const onFiles = async e => {
    const files = Array.from(e.target.files || []);
    e.target.value = '';
    let running = totalBytes;
    const next = [];
    for (const file of files) {
      if (running + file.size > MAX_UPLOAD_BYTES) {
        showToast(`${file.name} skipped: attachments are limited to 20 MB in total`, 'error');
        continue;
      }
      running += file.size;
      const content = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result).split(',')[1] || '');
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      next.push({ filename: file.name, contentType: file.type || 'application/octet-stream', size: file.size, content });
    }
    if (next.length) {
      setUploads(prev => [...prev, ...next]);
      setDirty(true);
    }
  };

  const payload = () => ({
    to, cc, bcc, subject,
    html: editorRef.current?.innerHTML || '',
    attachments: uploads,
    carryAttachments: carried,
    replyTo: initial.replyTo || null,
    forwardOf: initial.forwardOf || null,
    draftUid,
    localDraftId,
  });

  const send = async () => {
    if (!to.trim()) {
      showToast('Add at least one recipient', 'error');
      return;
    }
    setBusy('send');
    try {
      await api('/api/founder-os/mailbox/send', { method: 'POST', body: JSON.stringify(payload()) });
      showToast('Email sent', 'success');
      onSent();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setBusy('');
    }
  };

  const saveDraft = async ({ closeAfter = false } = {}) => {
    setBusy('draft');
    try {
      const saved = await api('/api/founder-os/mailbox/drafts', { method: 'POST', body: JSON.stringify(payload()) });
      if (saved.mode === 'mailbox') {
        setDraftUid(saved.uid);
        setLocalDraftId(null);
        showToast('Draft saved to the mailbox', 'success');
      } else {
        setLocalDraftId(saved.localDraftId);
        showToast('Draft saved in Founder OS (mailbox IMAP login is failing)', 'warning');
      }
      setDirty(false);
      onSaved();
      if (closeAfter) onClose();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setBusy('');
    }
  };

  const requestClose = () => {
    if (dirty) setConfirmClose(true);
    else onClose();
  };

  const inputCls = 'flex-1 min-w-0 bg-transparent text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none py-2';

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/40 backdrop-blur-sm sm:p-4">
      <div className="w-full sm:max-w-3xl h-[100dvh] sm:h-[min(88vh,760px)] bg-white sm:rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-4 sm:px-5 py-3 border-b border-slate-100">
          <h3 className="text-sm font-bold text-slate-900 font-outfit">
            {initial.title || 'New message'}
          </h3>
          <button type="button" onClick={requestClose} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer" title="Close">
            <X size={18} weight="bold" />
          </button>
        </div>

        <div className="px-4 sm:px-5 border-b border-slate-100">
          <div className="flex items-center gap-2 border-b border-slate-100">
            <label htmlFor="mail-compose-to" className="text-xs font-semibold text-slate-400 w-12">To</label>
            <input id="mail-compose-to" value={to} onChange={e => { setTo(e.target.value); setDirty(true); }} placeholder="name@example.com, ..." className={inputCls} />
            {!showCc && (
              <button type="button" onClick={() => setShowCc(true)} className="text-xs font-semibold text-slate-500 hover:text-violet-700 cursor-pointer">Cc / Bcc</button>
            )}
          </div>
          {showCc && (
            <>
              <div className="flex items-center gap-2 border-b border-slate-100">
                <span className="text-xs font-semibold text-slate-400 w-12">Cc</span>
                <input value={cc} onChange={e => { setCc(e.target.value); setDirty(true); }} className={inputCls} />
              </div>
              <div className="flex items-center gap-2 border-b border-slate-100">
                <span className="text-xs font-semibold text-slate-400 w-12">Bcc</span>
                <input value={bcc} onChange={e => { setBcc(e.target.value); setDirty(true); }} className={inputCls} />
              </div>
            </>
          )}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-400 w-12">Subject</span>
            <input value={subject} onChange={e => { setSubject(e.target.value); setDirty(true); }} className={`${inputCls} font-semibold`} />
          </div>
        </div>

        <div className="flex items-center gap-0.5 px-3 sm:px-4 py-1.5 border-b border-slate-100 bg-slate-50/60 overflow-x-auto">
          <ToolbarButton icon={TextB} label="Bold" onClick={() => exec('bold')} />
          <ToolbarButton icon={TextItalic} label="Italic" onClick={() => exec('italic')} />
          <ToolbarButton icon={TextUnderline} label="Underline" onClick={() => exec('underline')} />
          <span className="w-px h-5 bg-slate-200 mx-1" />
          <ToolbarButton icon={ListBullets} label="Bulleted list" onClick={() => exec('insertUnorderedList')} />
          <ToolbarButton icon={ListNumbers} label="Numbered list" onClick={() => exec('insertOrderedList')} />
          <ToolbarButton icon={LinkSimple} label="Insert link" onClick={addLink} />
          <ToolbarButton icon={TextT} label="Clear formatting" onClick={() => exec('removeFormat')} />
        </div>

        <div className="flex-1 overflow-y-auto px-4 sm:px-5 py-3">
          <div
            ref={editorRef}
            contentEditable
            suppressContentEditableWarning
            onInput={() => setDirty(true)}
            className="mail-editor min-h-[220px] text-sm leading-relaxed text-slate-800 focus:outline-none [&_blockquote]:border-l-[3px] [&_blockquote]:border-slate-200 [&_blockquote]:pl-3 [&_blockquote]:text-slate-500 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_a]:text-violet-700 [&_a]:underline [&_img]:max-w-full"
          />
        </div>

        {(uploads.length > 0 || carried.length > 0) && (
          <div className="px-4 sm:px-5 py-2 border-t border-slate-100 flex flex-wrap gap-2">
            {carried.map((a, i) => (
              <span key={`c${i}`} className="flex items-center gap-1.5 pl-2.5 pr-1 py-1 rounded-lg bg-slate-100 text-xs text-slate-700 max-w-full">
                <Paperclip size={13} className="shrink-0" />
                <span className="truncate">{a.filename}</span>
                <span className="text-slate-400 shrink-0">{formatBytes(a.size)}</span>
                <button type="button" onClick={() => { setCarried(prev => prev.filter((_, j) => j !== i)); setDirty(true); }} className="p-0.5 rounded hover:bg-slate-200 cursor-pointer" title="Remove">
                  <X size={12} weight="bold" />
                </button>
              </span>
            ))}
            {uploads.map((a, i) => (
              <span key={`u${i}`} className="flex items-center gap-1.5 pl-2.5 pr-1 py-1 rounded-lg bg-violet-50 text-xs text-violet-800 max-w-full">
                <Paperclip size={13} className="shrink-0" />
                <span className="truncate">{a.filename}</span>
                <span className="text-violet-400 shrink-0">{formatBytes(a.size)}</span>
                <button type="button" onClick={() => { setUploads(prev => prev.filter((_, j) => j !== i)); setDirty(true); }} className="p-0.5 rounded hover:bg-violet-100 cursor-pointer" title="Remove">
                  <X size={12} weight="bold" />
                </button>
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between gap-2 px-4 sm:px-5 py-3 border-t border-slate-100 bg-slate-50/60">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={send}
              disabled={Boolean(busy)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold shadow-sm disabled:opacity-60 cursor-pointer"
            >
              {busy === 'send' ? <CircleNotch size={15} className="animate-spin" /> : <PaperPlaneTilt size={15} weight="bold" />}
              Send
            </button>
            <button
              type="button"
              onClick={() => saveDraft()}
              disabled={Boolean(busy)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold disabled:opacity-60 cursor-pointer"
            >
              {busy === 'draft' ? <CircleNotch size={15} className="animate-spin" /> : <FloppyDisk size={15} weight="bold" />}
              Save draft
            </button>
            <input ref={fileRef} type="file" multiple className="hidden" onChange={onFiles} />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="p-2 rounded-xl text-slate-500 hover:text-violet-700 hover:bg-violet-50 cursor-pointer"
              title="Attach files"
            >
              <Paperclip size={17} weight="bold" />
            </button>
          </div>
          <button type="button" onClick={requestClose} className="text-xs font-semibold text-slate-500 hover:text-rose-600 cursor-pointer">
            Discard
          </button>
        </div>
      </div>

      {confirmClose && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/30">
          <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-slate-200 p-5">
            <h4 className="text-sm font-bold text-slate-900 mb-1 font-outfit">Save this draft?</h4>
            <p className="text-xs text-slate-500 mb-4">You have unsaved changes in this message.</p>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setConfirmClose(false)} className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer">Keep editing</button>
              <button type="button" onClick={onClose} className="px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 cursor-pointer">Discard</button>
              <button type="button" onClick={() => { setConfirmClose(false); saveDraft({ closeAfter: true }); }} className="px-3 py-2 rounded-xl text-xs font-bold bg-violet-600 hover:bg-violet-700 text-white cursor-pointer">Save draft</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------------------------------------------------------------- reader */

function ActionButton({ icon: Icon, label, onClick, active = false, danger = false, disabled = false, weight = 'bold' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={label}
      className={`p-2 rounded-xl transition-colors cursor-pointer disabled:opacity-40 ${
        danger ? 'text-slate-500 hover:text-rose-600 hover:bg-rose-50'
          : active ? 'text-amber-500 hover:bg-amber-50'
            : 'text-slate-500 hover:text-violet-700 hover:bg-violet-50'
      }`}
    >
      <Icon size={18} weight={weight} />
    </button>
  );
}

function MoveMenu({ folders, current, onMove, compact = false }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return undefined;
    const close = e => { if (!ref.current?.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [open]);
  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        title="Move to folder"
        className={`flex items-center gap-1 rounded-xl text-slate-500 hover:text-violet-700 hover:bg-violet-50 cursor-pointer ${compact ? 'px-2 py-1.5 text-xs font-semibold' : 'p-2'}`}
      >
        <FolderSimple size={18} weight="bold" />
        {compact && <span>Move</span>}
        <CaretDown size={11} weight="bold" />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 z-30 w-48 bg-white border border-slate-200 rounded-xl shadow-lg py-1">
          {folders.filter(f => f.path !== current).map(f => {
            const Icon = FOLDER_ICONS[f.role] || FolderSimple;
            return (
              <button
                key={f.path}
                type="button"
                onClick={() => { setOpen(false); onMove(f.path); }}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-violet-50 hover:text-violet-700 cursor-pointer"
              >
                <Icon size={15} /> {f.name}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function ThreadItem({ item, onOpen }) {
  return (
    <button
      type="button"
      onClick={() => onOpen(item)}
      className="w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-xl border border-slate-100 bg-slate-50/70 hover:bg-violet-50/60 hover:border-violet-100 cursor-pointer"
    >
      <span className="w-7 h-7 rounded-full bg-slate-200 text-slate-600 text-[10px] font-bold flex items-center justify-center shrink-0">
        {initials(item.from)}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-xs font-semibold text-slate-700 truncate">{addrLabel(item.from)}</span>
        <span className="block text-[11px] text-slate-400 truncate">{item.folder.replace(/^INBOX\./, '')}</span>
      </span>
      <span className="text-[11px] text-slate-400 shrink-0">{formatListDate(item.date)}</span>
    </button>
  );
}

function MessageReader({ message, folders, folderRole, ownAddress, onBack, onAction, onReply, onOpenThread }) {
  const inSpam = folderRole === 'junk';
  const inTrash = folderRole === 'trash';
  const spamFolder = folders.find(f => f.role === 'junk');
  const inbox = folders.find(f => f.role === 'inbox');
  const toSelf = (message.from?.address || '').toLowerCase() === (ownAddress || '').toLowerCase();

  return (
    <div className="flex flex-col h-full min-h-0">
      <div className="flex items-center justify-between gap-2 px-3 sm:px-4 py-2 border-b border-slate-100">
        <div className="flex items-center gap-0.5">
          <button type="button" onClick={onBack} className="lg:hidden p-2 rounded-xl text-slate-500 hover:bg-slate-100 cursor-pointer" title="Back">
            <ArrowLeft size={18} weight="bold" />
          </button>
          <ActionButton icon={ArrowBendUpLeft} label="Reply" onClick={() => onReply('reply')} />
          <ActionButton icon={ArrowBendDoubleUpLeft} label="Reply all" onClick={() => onReply('replyAll')} />
          <ActionButton icon={ArrowBendUpRight} label="Forward" onClick={() => onReply('forward')} />
        </div>
        <div className="flex items-center gap-0.5">
          <ActionButton
            icon={Star}
            weight={message.starred ? 'fill' : 'bold'}
            active={message.starred}
            label={message.starred ? 'Remove star' : 'Star'}
            onClick={() => onAction(message.starred ? 'unstar' : 'star')}
          />
          <ActionButton icon={EnvelopeSimple} label="Mark as unread" onClick={() => onAction('unread')} />
          {folderRole !== 'archive' && <ActionButton icon={Archive} label="Archive" onClick={() => onAction('archive')} />}
          {inSpam && inbox
            ? <ActionButton icon={Tray} label="Not spam (move to Inbox)" onClick={() => onAction('move', inbox.path)} />
            : spamFolder && !inTrash && <ActionButton icon={ShieldWarning} label="Report spam" onClick={() => onAction('move', spamFolder.path)} />}
          <MoveMenu folders={folders} current={message.folder} onMove={target => onAction('move', target)} />
          <ActionButton icon={Trash} danger label={inTrash || inSpam ? 'Delete forever' : 'Move to Trash'} onClick={() => onAction('trash')} />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-5">
        <h2 className="text-lg sm:text-xl font-bold text-slate-900 font-outfit mb-4 break-words">
          {message.subject || '(no subject)'}
        </h2>

        {message.thread?.length > 0 && (
          <div className="mb-5">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              Earlier in this conversation · {message.thread.length}
            </p>
            <div className="space-y-1.5">
              {message.thread.map(item => (
                <ThreadItem key={`${item.folder}:${item.uid}`} item={item} onOpen={onOpenThread} />
              ))}
            </div>
          </div>
        )}

        <div className="flex items-start gap-3 mb-4">
          <span className="w-10 h-10 rounded-full bg-violet-100 text-violet-700 text-xs font-bold flex items-center justify-center shrink-0">
            {initials(message.from)}
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-baseline justify-between gap-x-3">
              <p className="text-sm font-bold text-slate-900 break-all">
                {addrLabel(message.from)}
                {message.from?.name && <span className="font-normal text-slate-400 text-xs ml-1.5">&lt;{message.from.address}&gt;</span>}
              </p>
              <p className="text-xs text-slate-400">{formatFullDate(message.date)}</p>
            </div>
            <p className="text-xs text-slate-500 break-words">
              to {(message.to || []).map(a => (toSelf || a.address !== ownAddress ? addrLabel(a) : 'me')).join(', ') || '(no recipients)'}
              {message.cc?.length > 0 && <> · cc {message.cc.map(addrLabel).join(', ')}</>}
              {message.bcc?.length > 0 && <> · bcc {message.bcc.map(addrLabel).join(', ')}</>}
            </p>
          </div>
        </div>

        <EmailBody key={`${message.folder}:${message.uid}`} message={message} />
        <AttachmentList message={message} />

        <div className="flex flex-wrap gap-2 mt-6">
          <button type="button" onClick={() => onReply('reply')} className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700 cursor-pointer">
            <ArrowBendUpLeft size={15} weight="bold" /> Reply
          </button>
          <button type="button" onClick={() => onReply('replyAll')} className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700 cursor-pointer">
            <ArrowBendDoubleUpLeft size={15} weight="bold" /> Reply all
          </button>
          <button type="button" onClick={() => onReply('forward')} className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700 cursor-pointer">
            <ArrowBendUpRight size={15} weight="bold" /> Forward
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- module */

export default function MailboxModule() {
  const { showToast } = useToast();
  const [status, setStatus] = useState(null);
  const [folders, setFolders] = useState([]);
  const [folder, setFolder] = useState('INBOX');
  const [messages, setMessages] = useState([]);
  const [localDrafts, setLocalDrafts] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('');
  const [selected, setSelected] = useState(() => new Set());
  const [listLoading, setListLoading] = useState(true);
  const [fatalError, setFatalError] = useState('');
  const [openRef, setOpenRef] = useState(null);
  const [message, setMessage] = useState(null);
  const [messageLoading, setMessageLoading] = useState(false);
  const [composer, setComposer] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [newFolderOpen, setNewFolderOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const listRequest = useRef(0);

  const activeFolder = folders.find(f => f.path === folder);
  const role = activeFolder?.role || null;

  const loadFolders = useCallback(async () => {
    try {
      const data = await api('/api/founder-os/mailbox');
      setStatus({ address: data.address, drafts: data.drafts });
      setFolders(data.folders);
      setFatalError('');
      return data.folders;
    } catch (err) {
      setFatalError(err.message);
      return null;
    }
  }, []);

  const loadMessages = useCallback(async ({ quiet = false } = {}) => {
    const requestId = ++listRequest.current;
    if (!quiet) setListLoading(true);
    try {
      const params = new URLSearchParams({ folder, page: String(page), perPage: String(PER_PAGE) });
      if (search) params.set('q', search);
      if (filter) params.set('filter', filter);
      if (role) params.set('role', role);
      const data = await api(`/api/founder-os/mailbox/messages?${params}`);
      if (requestId !== listRequest.current) return;
      setMessages(data.messages);
      setLocalDrafts(data.localDrafts || []);
      setPagination(data.pagination);
    } catch (err) {
      if (requestId === listRequest.current && !quiet) showToast(err.message, 'error');
    } finally {
      if (requestId === listRequest.current) setListLoading(false);
    }
  }, [folder, page, search, filter, role, showToast]);

  useEffect(() => { loadFolders(); }, [loadFolders]);
  useEffect(() => { if (folders.length) loadMessages(); }, [loadMessages, folders.length]);

  // New mail check while the list is on its first, unfiltered page.
  useEffect(() => {
    if (page !== 1 || search || filter) return undefined;
    const timer = setInterval(() => {
      if (document.visibilityState !== 'visible') return;
      loadFolders();
      loadMessages({ quiet: true });
    }, POLL_MS);
    return () => clearInterval(timer);
  }, [page, search, filter, loadFolders, loadMessages]);

  const refreshAll = useCallback(async () => {
    await Promise.all([loadFolders(), loadMessages({ quiet: true })]);
  }, [loadFolders, loadMessages]);

  const selectFolder = path => {
    setFolder(path);
    setPage(1);
    setSelected(new Set());
    setOpenRef(null);
    setMessage(null);
    setFilter('');
    setSearch('');
    setSearchInput('');
  };

  /* ------------------------------------------------------- opening mail */

  const openMessage = useCallback(async (ref) => {
    setOpenRef(ref);
    setMessageLoading(true);
    try {
      const data = await api(`/api/founder-os/mailbox/message?folder=${encodeURIComponent(ref.folder)}&uid=${ref.uid}`);
      setMessage(data.message);
      setMessages(prev => prev.map(m => (m.uid === ref.uid && m.folder === ref.folder ? { ...m, unread: false } : m)));
      setFolders(prev => prev.map(f => (f.path === ref.folder && ref.wasUnread ? { ...f, unread: Math.max(0, f.unread - 1) } : f)));
    } catch (err) {
      showToast(err.message, 'error');
      setOpenRef(null);
    } finally {
      setMessageLoading(false);
    }
  }, [showToast]);

  const openDraft = async (row) => {
    try {
      if (row.localDraftId) {
        const { draft } = await api(`/api/founder-os/mailbox/drafts?id=${row.localDraftId}`);
        setComposer({
          title: 'Edit draft',
          to: (draft.to || []).join(', '),
          cc: (draft.cc || []).join(', '),
          bcc: (draft.bcc || []).join(', '),
          subject: draft.subject,
          html: draft.html,
          attachments: (draft.attachments || []).map(a => ({ ...a, size: a.size || Math.floor((a.content || '').length * 0.75) })),
          carryAttachments: draft.carryAttachments || [],
          replyTo: draft.replyTo,
          forwardOf: draft.forwardOf,
          draftUid: draft.draftUid,
          localDraftId: draft.localDraftId,
        });
        return;
      }
      const { message: m } = await api(`/api/founder-os/mailbox/message?folder=${encodeURIComponent(row.folder)}&uid=${row.uid}&thread=0`);
      const ref = m.draftRef ? { folder: m.draftRef.folder, uid: m.draftRef.uid } : null;
      setComposer({
        title: 'Edit draft',
        to: (m.to || []).map(addrFull).join(', '),
        cc: (m.cc || []).map(addrFull).join(', '),
        bcc: (m.bcc || []).map(addrFull).join(', '),
        subject: m.subject,
        html: m.html ? sanitizeEmailHtml(m.html, { forQuote: true }).html : textToHtml(m.text),
        carryAttachments: (m.attachments || []).map(a => ({ folder: m.folder, uid: m.uid, id: a.id, filename: a.filename, contentType: a.contentType, size: a.size })),
        replyTo: m.draftRef?.kind === 'reply' ? ref : null,
        forwardOf: m.draftRef?.kind === 'forward' ? ref : null,
        draftUid: m.uid,
      });
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const onRowClick = row => {
    if (role === 'drafts' || row.localDraftId) {
      openDraft(row);
      return;
    }
    openMessage({ folder: row.folder, uid: row.uid, wasUnread: row.unread });
  };

  /* ------------------------------------------------------------ actions */

  const runAction = async (action, uids, target, { fromFolder = folder } = {}) => {
    try {
      const result = await api('/api/founder-os/mailbox/messages', {
        method: 'POST',
        body: JSON.stringify({ action, folder: fromFolder, uids, target }),
      });
      const removed = ['move', 'archive', 'trash', 'delete'].includes(action);
      if (removed) {
        setMessages(prev => prev.filter(m => !(m.folder === fromFolder && uids.includes(m.uid))));
        if (openRef && openRef.folder === fromFolder && uids.includes(openRef.uid)) {
          setOpenRef(null);
          setMessage(null);
        }
        const count = uids.length > 1 ? `${uids.length} messages` : 'Message';
        const targetName = folders.find(f => f.path === (result.target || target))?.name;
        showToast(
          action === 'archive' ? `${count} archived`
            : result.permanent ? `${count} deleted permanently`
              : action === 'trash' ? `${count} moved to Trash`
                : `${count} moved to ${targetName || target}`,
          'success'
        );
      } else {
        const patch = {
          read: { unread: false }, unread: { unread: true }, star: { starred: true }, unstar: { starred: false },
        }[action];
        setMessages(prev => prev.map(m => (m.folder === fromFolder && uids.includes(m.uid) ? { ...m, ...patch } : m)));
        if (message && message.folder === fromFolder && uids.includes(message.uid)) {
          setMessage(prev => ({ ...prev, ...patch }));
          if (action === 'unread') {
            setOpenRef(null);
            setMessage(null);
          }
        }
      }
      setSelected(new Set());
      loadFolders();
      if (removed) loadMessages({ quiet: true });
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const permanentFolder = role === 'trash' || role === 'junk';

  const requestTrash = (uids, fromFolder = folder) => {
    const fromRole = folders.find(f => f.path === fromFolder)?.role;
    if (fromRole === 'trash' || fromRole === 'junk' || !folders.some(f => f.role === 'trash')) {
      setConfirm({
        title: 'Delete permanently?',
        message: `${uids.length > 1 ? `${uids.length} messages` : 'This message'} will be erased from the mailbox for good. This cannot be undone.`,
        onConfirm: () => runAction('trash', uids, null, { fromFolder }),
      });
      return;
    }
    runAction('trash', uids, null, { fromFolder });
  };

  const onReaderAction = (action, target) => {
    if (!message) return;
    if (action === 'trash') requestTrash([message.uid], message.folder);
    else runAction(action, [message.uid], target, { fromFolder: message.folder });
  };

  const startCompose = () => setComposer({ title: 'New message' });

  const onReply = mode => {
    if (!message) return;
    const own = (status?.address || '').toLowerCase();
    const fromSelf = (message.from?.address || '').toLowerCase() === own;
    const ref = { folder: message.folder, uid: message.uid };
    if (mode === 'forward') {
      setComposer({
        title: 'Forward',
        subject: prefixSubject('Fwd', message.subject),
        html: forwardBlock(message),
        carryAttachments: (message.attachments || [])
          .filter(a => !a.inline || !a.contentId)
          .map(a => ({ ...ref, id: a.id, filename: a.filename, contentType: a.contentType, size: a.size })),
        forwardOf: ref,
      });
      return;
    }
    const primary = fromSelf ? (message.to || []) : [message.from].filter(Boolean);
    let cc = [];
    if (mode === 'replyAll') {
      const seen = new Set(primary.map(a => a.address.toLowerCase()).concat(own));
      cc = [...(fromSelf ? [] : message.to || []), ...(message.cc || [])].filter(a => {
        const key = (a.address || '').toLowerCase();
        if (!key || seen.has(key)) return false;
        seen.add(key);
        return true;
      });
    }
    setComposer({
      title: mode === 'replyAll' ? 'Reply all' : 'Reply',
      to: primary.map(addrFull).join(', '),
      cc: cc.map(addrFull).join(', '),
      subject: prefixSubject('Re', message.subject),
      html: `<p><br></p>${quoteBlock(message)}`,
      replyTo: ref,
    });
  };

  const deleteLocalDraft = row => {
    setConfirm({
      title: 'Delete draft?',
      message: 'This draft is stored in Founder OS and will be removed.',
      onConfirm: async () => {
        try {
          await api(`/api/founder-os/mailbox/drafts?id=${row.localDraftId}`, { method: 'DELETE' });
          setLocalDrafts(prev => prev.filter(d => d.localDraftId !== row.localDraftId));
          showToast('Draft deleted', 'success');
        } catch (err) {
          showToast(err.message, 'error');
        }
      },
    });
  };

  const createFolder = async e => {
    e.preventDefault();
    const name = newFolderName.trim();
    if (!name) return;
    try {
      const data = await api('/api/founder-os/mailbox', { method: 'POST', body: JSON.stringify({ name }) });
      setFolders(data.folders);
      setNewFolderOpen(false);
      setNewFolderName('');
      showToast(`Folder "${name}" created`, 'success');
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  /* -------------------------------------------------------------- list */

  const rows = useMemo(() => [...localDrafts, ...messages], [localDrafts, messages]);
  const selectableUids = messages.map(m => m.uid);
  const allSelected = selectableUids.length > 0 && selectableUids.every(u => selected.has(u));
  const selectedUids = [...selected];
  const toggleSelect = uid => setSelected(prev => {
    const next = new Set(prev);
    if (next.has(uid)) next.delete(uid);
    else next.add(uid);
    return next;
  });

  if (fatalError && !folders.length) {
    return (
      <EmptyState
        icon={ShieldWarning}
        title="Mailbox could not connect"
        description={fatalError}
        actionLabel="Try again"
        onAction={() => { setFatalError(''); loadFolders(); }}
      />
    );
  }

  const readerOpen = Boolean(openRef);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden flex flex-col lg:flex-row lg:h-[calc(100vh-7.5rem)] min-h-[560px]">
      {/* Folder rail */}
      <aside className={`lg:w-52 shrink-0 border-b lg:border-b-0 lg:border-r border-slate-100 bg-slate-50/50 flex lg:flex-col ${readerOpen ? 'hidden lg:flex' : 'flex'}`}>
        <div className="p-3 shrink-0">
          <button
            type="button"
            onClick={startCompose}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold shadow-sm cursor-pointer whitespace-nowrap"
          >
            <PencilSimpleLine size={16} weight="bold" /> Compose
          </button>
        </div>
        <nav className="flex lg:flex-col gap-1 px-2 pb-2 overflow-x-auto lg:overflow-y-auto flex-1 items-center lg:items-stretch">
          {folders.map(f => {
            const Icon = FOLDER_ICONS[f.role] || FolderSimple;
            const isActive = f.path === folder;
            const badge = f.role === 'drafts' ? f.total + (isActive ? localDrafts.length : 0) : f.unread;
            return (
              <button
                key={f.path}
                type="button"
                onClick={() => selectFolder(f.path)}
                className={`flex items-center justify-between gap-2 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap cursor-pointer border ${
                  isActive ? 'bg-violet-50 text-violet-700 border-violet-200' : 'text-slate-600 hover:bg-white border-transparent'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <Icon size={16} weight={isActive ? 'fill' : 'regular'} className={isActive ? 'text-violet-600' : 'text-slate-400'} />
                  {f.name}
                </span>
                {badge > 0 && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${f.role === 'drafts' ? 'text-slate-500' : 'bg-violet-600 text-white'}`}>
                    {badge}
                  </span>
                )}
              </button>
            );
          })}
          {newFolderOpen ? (
            <form onSubmit={createFolder} className="flex items-center gap-1 px-1 py-1 shrink-0">
              <input
                autoFocus
                value={newFolderName}
                onChange={e => setNewFolderName(e.target.value)}
                onBlur={() => !newFolderName.trim() && setNewFolderOpen(false)}
                placeholder="Folder name"
                className="w-32 lg:w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-violet-300"
              />
            </form>
          ) : (
            <button
              type="button"
              onClick={() => setNewFolderOpen(true)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-violet-700 hover:bg-white whitespace-nowrap cursor-pointer"
            >
              <FolderPlus size={16} /> New folder
            </button>
          )}
        </nav>
        {status && (
          <div className="hidden lg:block px-4 py-3 border-t border-slate-100 text-[11px] text-slate-400 leading-snug">
            <p className="font-semibold text-slate-500 truncate">{status.address}</p>
            <p>Live from Hostinger Mail</p>
          </div>
        )}
      </aside>

      {/* Message list */}
      <section className={`lg:w-[380px] xl:w-[420px] shrink-0 lg:border-r border-slate-100 flex flex-col min-h-0 ${readerOpen ? 'hidden lg:flex' : 'flex flex-1 lg:flex-none'}`}>
        <div className="p-3 border-b border-slate-100 space-y-2">
          <form
            onSubmit={e => { e.preventDefault(); setPage(1); setSearch(searchInput.trim()); }}
            className="flex items-center gap-2 px-3 rounded-xl border border-slate-200 bg-slate-50 focus-within:border-violet-300 focus-within:bg-white"
          >
            <MagnifyingGlass size={15} className="text-slate-400 shrink-0" />
            <input
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              placeholder={`Search ${activeFolder?.name || 'mail'}`}
              className="flex-1 min-w-0 bg-transparent py-2 text-xs focus:outline-none"
            />
            {search && (
              <button type="button" onClick={() => { setSearch(''); setSearchInput(''); setPage(1); }} className="text-slate-400 hover:text-slate-700 cursor-pointer" title="Clear search">
                <X size={14} weight="bold" />
              </button>
            )}
          </form>
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1">
              <input
                type="checkbox"
                aria-label="Select all on this page"
                checked={allSelected}
                onChange={() => setSelected(allSelected ? new Set() : new Set(selectableUids))}
                className="w-4 h-4 accent-violet-600 cursor-pointer mx-1"
              />
              {selectedUids.length > 0 ? (
                <div className="flex items-center">
                  <ActionButton icon={EnvelopeSimpleOpen} label="Mark as read" onClick={() => runAction('read', selectedUids)} />
                  <ActionButton icon={EnvelopeSimple} label="Mark as unread" onClick={() => runAction('unread', selectedUids)} />
                  <ActionButton icon={Star} label="Star" onClick={() => runAction('star', selectedUids)} />
                  {role !== 'archive' && <ActionButton icon={Archive} label="Archive" onClick={() => runAction('archive', selectedUids)} />}
                  <MoveMenu folders={folders} current={folder} onMove={target => runAction('move', selectedUids, target)} />
                  <ActionButton icon={Trash} danger label={permanentFolder ? 'Delete forever' : 'Move to Trash'} onClick={() => requestTrash(selectedUids)} />
                </div>
              ) : (
                <div className="flex items-center gap-1">
                  {[['', 'All'], ['unread', 'Unread'], ['starred', 'Starred']].map(([key, label]) => (
                    <button
                      key={key || 'all'}
                      type="button"
                      onClick={() => { setFilter(key); setPage(1); }}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer ${filter === key ? 'bg-violet-100 text-violet-700' : 'text-slate-500 hover:bg-slate-100'}`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={refreshAll}
              className="p-2 rounded-xl text-slate-400 hover:text-violet-700 hover:bg-violet-50 cursor-pointer"
              title="Refresh"
            >
              <ArrowsClockwise size={16} weight="bold" className={listLoading ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>

        {status?.drafts?.mode === 'panel' && role === 'drafts' && (
          <div className="mx-3 mt-3 flex gap-2 px-3 py-2 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-800 leading-snug">
            <Info size={15} className="shrink-0 mt-0.5" />
            <span>New drafts are being kept in Founder OS because the mailbox IMAP login failed. Update HOSTINGER_EMAIL_PASSWORD to save drafts into the mailbox.</span>
          </div>
        )}

        <div className="flex-1 overflow-y-auto min-h-0">
          {listLoading && !rows.length ? (
            <div className="p-3 space-y-2">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-16 rounded-xl bg-slate-100 animate-pulse" />
              ))}
            </div>
          ) : !rows.length ? (
            <div className="p-4">
              <EmptyState
                icon={FOLDER_ICONS[role] || Tray}
                title={search ? 'No matching mail' : filter ? `No ${filter} mail` : `${activeFolder?.name || 'Folder'} is empty`}
                description={search ? `Nothing in ${activeFolder?.name} matches "${search}".` : 'Nothing to see here right now.'}
              />
            </div>
          ) : (
            <ul className="divide-y divide-slate-100">
              {rows.map(row => {
                const key = row.localDraftId ? `local-${row.localDraftId}` : `${row.folder}:${row.uid}`;
                const isOpen = openRef && !row.localDraftId && openRef.folder === row.folder && openRef.uid === row.uid;
                const counterpart = role === 'sent' || role === 'drafts' || row.localDraftId
                  ? `To: ${(row.to || []).map(addrLabel).join(', ') || '(no recipients)'}`
                  : addrLabel(row.from) || '(unknown sender)';
                return (
                  <li key={key} className={`group relative flex items-start gap-2 px-3 py-3 cursor-pointer ${isOpen ? 'bg-violet-50' : row.unread ? 'bg-white hover:bg-slate-50' : 'bg-slate-50/30 hover:bg-slate-50'}`}>
                    {isOpen && <span className="absolute left-0 top-0 bottom-0 w-1 bg-violet-600" />}
                    {row.localDraftId ? (
                      <span className="w-4 h-4 mx-1 mt-0.5 shrink-0" />
                    ) : (
                      <input
                        type="checkbox"
                        aria-label="Select message"
                        checked={selected.has(row.uid)}
                        onChange={() => toggleSelect(row.uid)}
                        className="w-4 h-4 mx-1 mt-0.5 accent-violet-600 cursor-pointer shrink-0"
                      />
                    )}
                    <button type="button" onClick={() => onRowClick(row)} className="flex-1 min-w-0 text-left cursor-pointer">
                      <div className="flex items-baseline justify-between gap-2">
                        <span className={`text-xs truncate ${row.unread ? 'font-bold text-slate-900' : 'font-semibold text-slate-600'}`}>
                          {row.unread && <span className="inline-block w-1.5 h-1.5 rounded-full bg-violet-600 mr-1.5 align-middle" />}
                          {counterpart}
                        </span>
                        <span className={`text-[11px] shrink-0 ${row.unread ? 'font-bold text-violet-700' : 'text-slate-400'}`}>
                          {formatListDate(row.date)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        {row.localDraftId && <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 rounded px-1">Panel draft</span>}
                        {(role === 'drafts' && !row.localDraftId) && <span className="text-[10px] font-bold text-rose-600">Draft</span>}
                        <span className={`text-xs truncate ${row.unread ? 'font-semibold text-slate-800' : 'text-slate-500'}`}>
                          {row.subject || '(no subject)'}
                        </span>
                        {row.hasAttachments && <Paperclip size={12} className="text-slate-400 shrink-0" />}
                        {row.answered && <ArrowBendUpLeft size={12} className="text-slate-400 shrink-0" />}
                      </div>
                    </button>
                    {row.localDraftId ? (
                      <button type="button" onClick={() => deleteLocalDraft(row)} title="Delete draft" className="p-1 rounded-lg text-slate-300 hover:text-rose-600 cursor-pointer shrink-0">
                        <Trash size={15} />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => runAction(row.starred ? 'unstar' : 'star', [row.uid])}
                        title={row.starred ? 'Remove star' : 'Star'}
                        className={`p-1 rounded-lg cursor-pointer shrink-0 ${row.starred ? 'text-amber-500' : 'text-slate-300 opacity-60 group-hover:opacity-100 hover:text-amber-500'}`}
                      >
                        <Star size={15} weight={row.starred ? 'fill' : 'regular'} />
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between px-3 py-2 border-t border-slate-100 text-[11px] text-slate-500">
            <span>
              {(pagination.page - 1) * PER_PAGE + 1}–{Math.min(pagination.page * PER_PAGE, pagination.total)} of {pagination.total}
            </span>
            <div className="flex items-center gap-1">
              <button type="button" disabled={page <= 1} onClick={() => setPage(p => p - 1)} className="p-1.5 rounded-lg hover:bg-slate-100 disabled:opacity-30 cursor-pointer" title="Newer">
                <CaretLeft size={14} weight="bold" />
              </button>
              <button type="button" disabled={page >= pagination.totalPages} onClick={() => setPage(p => p + 1)} className="p-1.5 rounded-lg hover:bg-slate-100 disabled:opacity-30 cursor-pointer" title="Older">
                <CaretRight size={14} weight="bold" />
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Reading pane */}
      <section className={`flex-1 min-w-0 min-h-0 ${readerOpen ? 'flex flex-col' : 'hidden lg:flex lg:flex-col'}`}>
        {messageLoading ? (
          <div className="flex-1 flex items-center justify-center text-slate-400">
            <CircleNotch size={26} className="animate-spin" />
          </div>
        ) : message && openRef ? (
          <MessageReader
            message={message}
            folders={folders}
            folderRole={folders.find(f => f.path === message.folder)?.role}
            ownAddress={status?.address}
            onBack={() => { setOpenRef(null); setMessage(null); }}
            onAction={onReaderAction}
            onReply={onReply}
            onOpenThread={item => openMessage({ folder: item.folder, uid: item.uid, wasUnread: item.unread })}
          />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-slate-400">
            <EnvelopeSimpleOpen size={44} weight="duotone" className="text-violet-300 mb-3" />
            <p className="text-sm font-semibold text-slate-500">Select a message to read</p>
            <p className="text-xs mt-1">
              {activeFolder ? `${activeFolder.total} in ${activeFolder.name}${activeFolder.unread ? ` · ${activeFolder.unread} unread` : ''}` : ''}
            </p>
          </div>
        )}
      </section>

      {composer && (
        <Composer
          initial={composer}
          onClose={() => setComposer(null)}
          onSent={() => { setComposer(null); refreshAll(); }}
          onSaved={() => { if (role === 'drafts') loadMessages({ quiet: true }); loadFolders(); }}
        />
      )}

      <ConfirmModal
        isOpen={Boolean(confirm)}
        title={confirm?.title}
        message={confirm?.message}
        confirmLabel="Delete"
        isDestructive
        onCancel={() => setConfirm(null)}
        onConfirm={async () => {
          const action = confirm?.onConfirm;
          setConfirm(null);
          await action?.();
        }}
      />
    </div>
  );
}
