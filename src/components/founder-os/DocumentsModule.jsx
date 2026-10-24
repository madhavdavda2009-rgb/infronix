"use client";
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  FileText,
  Plus,
  MagnifyingGlass,
  ArrowLeft,
  Trash,
  DownloadSimple,
  PaperPlaneTilt,
  FloppyDisk,
  Stack,
  Seal,
  X,
  CheckCircle,
  Warning,
  PenNib,
  CaretUp,
  CaretDown,
  PencilSimple,
  BookmarkSimple,
  IdentificationCard
} from '@phosphor-icons/react';
import EmptyState from './EmptyState';
import { ConfirmModal } from './ConfirmModal';
import { useToast } from '@/context/ToastContext';
import {
  DOC_TYPES,
  DOC_TYPE_KEYS,
  DOC_STATUSES,
  getFieldSchema,
  renderDocumentHtml,
  computeInvoiceTotals,
  inr,
  BLOCK_PLACEHOLDERS,
  PROFILE_FIELDS,
  newSectionId
} from '@/lib/document_templates';
import { downloadDocumentPdf } from '@/lib/document_pdf';
import SignaturePad from '@/components/SignaturePad';

const STATUS_STYLES = {
  Draft: 'bg-slate-100 text-slate-600 border-slate-200',
  Sent: 'bg-sky-50 text-sky-700 border-sky-200',
  Viewed: 'bg-amber-50 text-amber-700 border-amber-200',
  'Changes Requested': 'bg-rose-50 text-rose-700 border-rose-200',
  Signed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
};

const inputClass = 'w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500 disabled:bg-slate-50 disabled:text-slate-500';
const labelClass = 'block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1';
const primaryBtn = 'inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed';
const secondaryBtn = 'inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs font-semibold shadow-xs transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed';

function StatusBadge({ status }) {
  return (
    <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border whitespace-nowrap ${STATUS_STYLES[status] || STATUS_STYLES.Draft}`}>
      {status}
    </span>
  );
}

function formatShortDate(value) {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

function ModalFrame({ title, onClose, children, maxWidth = 'max-w-lg' }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fadeIn">
      <div className={`relative w-full ${maxWidth} bg-white border border-slate-200 rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto`}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h3 className="text-base font-bold text-slate-900 font-outfit">{title}</h3>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg cursor-pointer">
            <X size={18} />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

function SignatureField({ value, onChange, disabled }) {
  const [drawing, setDrawing] = useState(false);
  const [draft, setDraft] = useState('');
  const [loadingSaved, setLoadingSaved] = useState(false);
  const { showToast } = useToast();

  async function useSaved() {
    setLoadingSaved(true);
    try {
      const res = await fetch('/api/founder-os/documents/settings');
      const json = await res.json();
      if (json.profile?.agency_signature) onChange(json.profile.agency_signature);
      else showToast('No saved signature yet. Add one in Business Profile.', 'warning');
    } finally {
      setLoadingSaved(false);
    }
  }

  return (
    <div className="space-y-2">
      <div className="h-20 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden">
        {value ? <img src={value} alt="Signature" className="max-h-16 max-w-[80%] object-contain" /> : <span className="text-[11px] text-slate-400">No signature – the signer&apos;s name is shown instead</span>}
      </div>
      {!disabled && (
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => { setDraft(''); setDrawing(true); }} className={secondaryBtn}><PenNib size={14} /> Draw</button>
          <button type="button" onClick={useSaved} disabled={loadingSaved} className={secondaryBtn}>Use saved</button>
          {value && <button type="button" onClick={() => onChange('')} className={secondaryBtn}>Remove</button>}
        </div>
      )}
      {drawing && (
        <ModalFrame title="Draw signature" onClose={() => setDrawing(false)}>
          <SignaturePad value="" onChange={setDraft} allowUpload />
          <div className="flex justify-end gap-2 mt-4">
            <button type="button" onClick={() => setDrawing(false)} className={secondaryBtn}>Cancel</button>
            <button type="button" disabled={!draft} onClick={() => { onChange(draft); setDrawing(false); }} className={primaryBtn}>Use this signature</button>
          </div>
        </ModalFrame>
      )}
    </div>
  );
}

function FieldInput({ field, value, onChange, disabled }) {
  if (field.type === 'signature') {
    return <SignatureField value={value} onChange={onChange} disabled={disabled} />;
  }
  if (field.type === 'textarea' || field.type === 'pairs') {
    const rows = field.type === 'textarea' ? 2 : Math.min(Math.max(String(value || '').split('\n').length + 1, 3), 9);
    return (
      <textarea
        className={`${inputClass} ${field.type === 'pairs' ? 'font-mono text-[11px]' : ''}`}
        rows={rows}
        value={value ?? ''}
        disabled={disabled}
        onChange={e => onChange(e.target.value)}
      />
    );
  }
  if (field.type === 'checkbox') {
    return (
      <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
        <input type="checkbox" className="w-4 h-4 accent-violet-600" checked={value === true || value === 'true'} disabled={disabled} onChange={e => onChange(e.target.checked)} />
        {field.label}
      </label>
    );
  }
  if (field.type === 'select') {
    return (
      <select className={inputClass} value={value ?? ''} disabled={disabled} onChange={e => onChange(e.target.value)}>
        {field.options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    );
  }
  const numeric = field.type === 'number' || field.type === 'money';
  return (
    <input
      type={numeric ? 'number' : field.type === 'date' ? 'date' : 'text'}
      className={inputClass}
      value={value ?? ''}
      disabled={disabled}
      onChange={e => onChange(numeric ? (e.target.value === '' ? '' : Number(e.target.value)) : e.target.value)}
    />
  );
}

function SectionsEditor({ docType, sections, onChange, disabled, schema }) {
  const [activeId, setActiveId] = useState(null);
  const [openIds, setOpenIds] = useState(() => new Set(sections.slice(0, 1).map(s => s.id)));
  const textareas = React.useRef({});

  const variables = [
    ...schema.filter(f => !['pairs', 'signature', 'checkbox'].includes(f.type)).map(f => ({ key: f.key, label: f.label, group: f.group })),
  ];
  const blocks = BLOCK_PLACEHOLDERS[docType] || [];

  function update(id, patch) {
    onChange(sections.map(s => (s.id === id ? { ...s, ...patch } : s)));
  }

  function move(index, dir) {
    const next = [...sections];
    const [item] = next.splice(index, 1);
    next.splice(index + dir, 0, item);
    onChange(next);
  }

  function remove(id) {
    onChange(sections.filter(s => s.id !== id));
  }

  function add() {
    const s = { id: newSectionId(), title: 'New section', body: 'Write the content here.' };
    onChange([...sections, s]);
    setOpenIds(prev => new Set(prev).add(s.id));
    setActiveId(s.id);
  }

  function toggle(id) {
    setOpenIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  function insert(token) {
    const id = activeId || sections[0]?.id;
    const el = textareas.current[id];
    const section = sections.find(s => s.id === id);
    if (!section) return;
    const start = el ? el.selectionStart : section.body.length;
    const end = el ? el.selectionEnd : section.body.length;
    const body = section.body.slice(0, start) + token + section.body.slice(end);
    update(id, { body });
    requestAnimationFrame(() => {
      if (el) {
        el.focus();
        el.selectionStart = el.selectionEnd = start + token.length;
      }
    });
  }

  return (
    <div className="space-y-3">
      {!disabled && (
        <div className="p-4 rounded-2xl bg-violet-50/60 border border-violet-100 space-y-3">
          <p className="text-[11px] text-slate-600 leading-relaxed">
            <strong className="text-slate-800">Formatting:</strong> blank line = new paragraph · start lines with <code className="px-1 rounded bg-white">- </code> for bullets · <code className="px-1 rounded bg-white">1. </code> for numbered steps · <code className="px-1 rounded bg-white">**bold**</code>. Click a field below to insert it where your cursor is – it updates automatically when you change Details.
          </p>
          <div className="flex flex-wrap gap-1.5">
            {blocks.map(b => (
              <button key={b.key} type="button" onClick={() => insert(`\n\n{{${b.key}}}\n\n`)} className="px-2 py-1 rounded-lg bg-violet-600 text-white text-[10px] font-semibold cursor-pointer hover:bg-violet-700">
                + {b.label}
              </button>
            ))}
            {variables.map(v => (
              <button key={v.key} type="button" onClick={() => insert(`{{${v.key}}}`)} title={`{{${v.key}}}`} className="px-2 py-1 rounded-lg bg-white border border-violet-200 text-violet-700 text-[10px] font-semibold cursor-pointer hover:bg-violet-100">
                {v.group === 'InfronixWeb' ? 'Our ' : v.group === 'Client' ? 'Client ' : ''}{v.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {sections.map((section, index) => {
        const open = openIds.has(section.id);
        return (
          <div key={section.id} className={`rounded-2xl bg-white border shadow-xs transition-colors ${activeId === section.id ? 'border-violet-300' : 'border-slate-200'}`}>
            <div className="flex items-center gap-2 px-3 py-2.5">
              <span className="w-7 text-center text-[11px] font-bold text-violet-600 shrink-0">{String(index + 1).padStart(2, '0')}</span>
              <input
                className="flex-1 min-w-0 px-2 py-1.5 rounded-lg text-xs font-semibold text-slate-900 border border-transparent hover:border-slate-200 focus:border-violet-400 focus:outline-none disabled:bg-transparent"
                value={section.title}
                disabled={disabled}
                onFocus={() => setActiveId(section.id)}
                onChange={e => update(section.id, { title: e.target.value })}
              />
              {!disabled && (
                <div className="flex items-center shrink-0">
                  <button type="button" title="Move up" disabled={index === 0} onClick={() => move(index, -1)} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 disabled:opacity-30 cursor-pointer"><CaretUp size={14} weight="bold" /></button>
                  <button type="button" title="Move down" disabled={index === sections.length - 1} onClick={() => move(index, 1)} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 disabled:opacity-30 cursor-pointer"><CaretDown size={14} weight="bold" /></button>
                  <button type="button" title="Delete section" onClick={() => remove(section.id)} className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"><Trash size={14} /></button>
                </div>
              )}
              <button type="button" onClick={() => toggle(section.id)} className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 cursor-pointer shrink-0" title={open ? 'Collapse' : 'Edit text'}>
                {open ? <CaretUp size={14} /> : <PencilSimple size={14} />}
              </button>
            </div>
            {open && (
              <div className="px-3 pb-3">
                <textarea
                  ref={el => { textareas.current[section.id] = el; }}
                  className={`${inputClass} leading-relaxed`}
                  rows={Math.min(Math.max(section.body.split('\n').reduce((n, line) => n + Math.max(1, Math.ceil(line.length / 52)), 0) + 1, 4), 22)}
                  value={section.body}
                  disabled={disabled}
                  onFocus={() => setActiveId(section.id)}
                  onChange={e => update(section.id, { body: e.target.value })}
                />
              </div>
            )}
          </div>
        );
      })}

      {!disabled && (
        <button type="button" onClick={add} className="w-full py-3 rounded-2xl border-2 border-dashed border-slate-300 hover:border-violet-400 hover:bg-violet-50/40 text-xs font-semibold text-slate-600 cursor-pointer inline-flex items-center justify-center gap-1.5">
          <Plus size={14} /> Add section
        </button>
      )}
    </div>
  );
}

function DocumentEditor({ docId, onBack, onChanged }) {
  const [doc, setDoc] = useState(null);
  const [portalUsers, setPortalUsers] = useState([]);
  const [title, setTitle] = useState('');
  const [data, setData] = useState({});
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [showSend, setShowSend] = useState(false);
  const [showSigned, setShowSigned] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [confirmTemplate, setConfirmTemplate] = useState(null);
  const [tab, setTab] = useState('content');
  const [mobilePane, setMobilePane] = useState('edit');
  const { showToast } = useToast();

  const load = useCallback(async () => {
    try {
      const res = await fetch(`/api/founder-os/documents/${docId}`);
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      setDoc(json.document);
      setPortalUsers(json.portalUsers || []);
      setTitle(json.document.title);
      setData(json.document.data || {});
      setDirty(false);
    } catch (err) {
      showToast(err.message || 'Could not load document', 'error');
      onBack();
    }
  }, [docId]);

  useEffect(() => { load(); }, [load]);

  const locked = doc?.status === 'Signed';
  const schema = doc ? getFieldSchema(doc.doc_type) : [];
  const groups = [];
  for (const f of schema) {
    let g = groups.find(x => x.name === f.group);
    if (!g) { g = { name: f.group, fields: [] }; groups.push(g); }
    g.fields.push(f);
  }

  const previewDoc = doc ? { ...doc, title, data } : null;
  const previewHtml = previewDoc ? renderDocumentHtml(previewDoc) : '';

  function updateField(key, value) {
    setData(prev => ({ ...prev, [key]: value }));
    setDirty(true);
  }

  async function save() {
    setSaving(true);
    try {
      const res = await fetch(`/api/founder-os/documents/${docId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, data })
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      setDoc(json.document);
      setData(json.document.data || {});
      setDirty(false);
      showToast(json.revertedToDraft ? 'Saved. Document moved back to Draft – send it again so the client sees the update.' : 'Document saved', 'success');
      onChanged();
      return true;
    } catch (err) {
      showToast(err.message || 'Save failed', 'error');
      return false;
    } finally {
      setSaving(false);
    }
  }

  async function templateAction(action) {
    setConfirmTemplate(null);
    try {
      const res = await fetch('/api/founder-os/documents/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(action === 'save' ? { doc_type: doc.doc_type, sections: data.sections } : { doc_type: doc.doc_type, reset: true })
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      if (action === 'save') {
        showToast(`Saved as the default ${DOC_TYPES[doc.doc_type].short} template for new documents`, 'success');
      } else {
        updateField('sections', json.sections);
        showToast('Content reset to the built-in template (not saved yet)', 'success');
      }
    } catch (err) {
      showToast(err.message || 'Template update failed', 'error');
    }
  }

  async function loadDefaultTemplate() {
    setConfirmTemplate(null);
    const res = await fetch('/api/founder-os/documents/settings');
    const json = await res.json();
    if (json.success) {
      updateField('sections', json.templates[doc.doc_type].sections);
      showToast('Default template loaded (not saved yet)', 'success');
    }
  }

  async function handleDownload() {
    setPdfLoading(true);
    try {
      await downloadDocumentPdf(previewDoc);
    } catch {
      showToast('PDF generation failed', 'error');
    } finally {
      setPdfLoading(false);
    }
  }

  async function openSend() {
    if (dirty && !(await save())) return;
    setShowSend(true);
  }

  async function handleDelete() {
    const res = await fetch(`/api/founder-os/documents/${docId}`, { method: 'DELETE' });
    const json = await res.json();
    if (json.success) {
      showToast('Document deleted', 'success');
      onChanged();
      onBack();
    } else {
      showToast(json.error || 'Delete failed', 'error');
      setConfirmDelete(false);
    }
  }

  if (!doc) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="w-8 h-8 border-3 border-violet-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const meta = DOC_TYPES[doc.doc_type];
  const invoiceTotals = doc.doc_type === 'invoice' ? computeInvoiceTotals(data) : null;
  const sections = Array.isArray(data.sections) ? data.sections : [];

  return (
    <div className="space-y-4 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3 min-w-0">
          <button type="button" onClick={onBack} className="p-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 shadow-xs cursor-pointer shrink-0">
            <ArrowLeft size={18} weight="bold" />
          </button>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-violet-50 text-violet-700 border border-violet-200">{meta.short}</span>
              <span className="text-[10px] font-mono text-slate-500">{doc.doc_number}</span>
              <StatusBadge status={doc.status} />
              {dirty && <span className="text-[10px] font-semibold text-amber-600">Unsaved changes</span>}
            </div>
            <input
              className="block w-full text-lg font-bold text-slate-900 font-outfit mt-1 bg-transparent border-b border-transparent hover:border-slate-200 focus:border-violet-400 focus:outline-none disabled:hover:border-transparent"
              value={title}
              disabled={locked}
              onChange={e => { setTitle(e.target.value); setDirty(true); }}
              title="Internal title (shown in lists and emails)"
            />
            <p className="text-[11px] text-slate-500">{doc.client_display_company || doc.client_display_name}{doc.project_name ? ` · ${doc.project_name}` : ''}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {!locked && (
            <button type="button" onClick={save} disabled={saving || !dirty} className={secondaryBtn}>
              <FloppyDisk size={15} /> {saving ? 'Saving…' : 'Save'}
            </button>
          )}
          <button type="button" onClick={handleDownload} disabled={pdfLoading} className={secondaryBtn}>
            <DownloadSimple size={15} /> {pdfLoading ? 'Preparing…' : 'PDF'}
          </button>
          {!locked && meta.requiresSignature && doc.status !== 'Draft' && (
            <button type="button" onClick={() => setShowSigned(true)} className={secondaryBtn}>
              <Seal size={15} /> Mark signed offline
            </button>
          )}
          {!locked && (
            <button type="button" onClick={openSend} className={primaryBtn}>
              <PaperPlaneTilt size={15} /> {doc.status === 'Draft' ? 'Send to client' : 'Resend'}
            </button>
          )}
          {!locked && (
            <button type="button" onClick={() => setConfirmDelete(true)} className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 cursor-pointer" title="Delete">
              <Trash size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Status banners */}
      {doc.status === 'Changes Requested' && doc.client_comment && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex gap-3">
          <Warning size={20} className="text-rose-600 shrink-0" weight="fill" />
          <div>
            <p className="text-xs font-bold text-rose-800">Client requested changes</p>
            <p className="text-xs text-rose-700 mt-1 whitespace-pre-wrap">{doc.client_comment}</p>
            <p className="text-[11px] text-rose-600 mt-2">Edit the document, save, and send it again.</p>
          </div>
        </div>
      )}
      {locked && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex gap-3">
          <CheckCircle size={20} className="text-emerald-600 shrink-0" weight="fill" />
          <div className="text-xs text-emerald-800">
            <p className="font-bold">Signed by {doc.signer_name}{doc.signer_title ? `, ${doc.signer_title}` : ''} on {new Date(doc.signed_at).toLocaleString('en-IN')}</p>
            <p className="mt-1 text-emerald-700">This document is locked. Fingerprint: <span className="font-mono break-all">{doc.content_hash}</span></p>
            {doc.client_comment && <p className="mt-1 text-emerald-700">{doc.client_comment}</p>}
          </div>
        </div>
      )}
      {doc.status !== 'Draft' && !locked && (
        <p className="text-[11px] text-slate-500">
          Sent {formatShortDate(doc.sent_at)}{doc.sent_to_email ? ` to ${doc.sent_to_email}` : ''}{doc.viewed_at ? ` · Viewed ${formatShortDate(doc.viewed_at)}` : ' · Not opened yet'}
        </p>
      )}

      {/* Mobile pane switch */}
      <div className="flex lg:hidden rounded-xl border border-slate-200 bg-white p-1 text-xs font-semibold">
        {['edit', 'preview'].map(p => (
          <button key={p} type="button" onClick={() => setMobilePane(p)} className={`flex-1 py-2 rounded-lg capitalize cursor-pointer ${mobilePane === p ? 'bg-violet-600 text-white' : 'text-slate-600'}`}>{p}</button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* Editing panel */}
        <div className={`lg:col-span-2 space-y-3 ${mobilePane === 'edit' ? '' : 'hidden lg:block'}`}>
          <div className="flex rounded-xl border border-slate-200 bg-white p-1 text-xs font-semibold">
            {[['content', `Content (${sections.length} sections)`], ['details', 'Details']].map(([id, label]) => (
              <button key={id} type="button" onClick={() => setTab(id)} className={`flex-1 py-2 rounded-lg cursor-pointer ${tab === id ? 'bg-violet-600 text-white' : 'text-slate-600 hover:bg-slate-50'}`}>{label}</button>
            ))}
          </div>

          {tab === 'content' && (
            <>
              <SectionsEditor
                key={doc.id}
                docType={doc.doc_type}
                sections={sections}
                schema={schema}
                disabled={locked}
                onChange={next => updateField('sections', next)}
              />
              {!locked && (
                <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Template</p>
                  <p className="text-[11px] text-slate-500">Reuse this wording for every new {meta.short}.</p>
                  <div className="flex flex-wrap gap-2">
                    <button type="button" onClick={() => setConfirmTemplate('save')} className={secondaryBtn}><BookmarkSimple size={14} /> Save as default</button>
                    <button type="button" onClick={() => setConfirmTemplate('load')} className={secondaryBtn}>Load default</button>
                    <button type="button" onClick={() => setConfirmTemplate('reset')} className={secondaryBtn}>Reset to built-in</button>
                  </div>
                </div>
              )}
            </>
          )}

          {tab === 'details' && (
            <>
              {groups.map(group => (
                <div key={group.name} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">{group.name}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {group.fields.map(field => (
                      <div key={field.key} className={['textarea', 'pairs', 'signature', 'checkbox'].includes(field.type) ? 'sm:col-span-2' : ''}>
                        {field.type !== 'checkbox' && <label className={labelClass}>{field.label}</label>}
                        <FieldInput field={field} value={data[field.key]} disabled={locked} onChange={v => updateField(field.key, v)} />
                        {field.hint && <p className="text-[10px] text-slate-400 mt-1">{field.hint}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              {invoiceTotals && (
                <div className="p-4 rounded-2xl bg-violet-50 border border-violet-200 text-xs text-violet-900 space-y-1">
                  <div className="flex justify-between"><span>Total</span><span>{inr(invoiceTotals.total)}</span></div>
                  <div className="flex justify-between"><span>Paid</span><span>{inr(invoiceTotals.paid)}</span></div>
                  <div className="flex justify-between font-bold"><span>Balance due</span><span>{inr(invoiceTotals.balance)}</span></div>
                </div>
              )}
            </>
          )}
          {(doc.doc_type === 'agreement' || doc.doc_type === 'nda') && (
            <p className="text-[10px] text-slate-400 leading-relaxed px-1">
              Template wording is a general starting point. Have a lawyer review the Agreement and NDA once, then save it as the default.
            </p>
          )}
        </div>

        {/* Preview */}
        <div className={`lg:col-span-3 ${mobilePane === 'preview' ? '' : 'hidden lg:block'}`}>
          <div className="lg:sticky lg:top-20 rounded-2xl border border-slate-200 bg-slate-100 p-2 sm:p-4 max-h-[calc(100vh-7rem)] overflow-auto">
            <div className="bg-white shadow-md rounded-sm overflow-hidden min-w-[600px]" dangerouslySetInnerHTML={{ __html: previewHtml }} />
          </div>
        </div>
      </div>

      {showSend && (
        <SendModal
          doc={doc}
          portalUsers={portalUsers}
          onClose={() => setShowSend(false)}
          onSent={(updated) => { setDoc(updated); setShowSend(false); onChanged(); }}
        />
      )}
      {showSigned && (
        <MarkSignedModal
          doc={doc}
          onClose={() => setShowSigned(false)}
          onDone={(updated) => { setDoc(updated); setShowSigned(false); onChanged(); }}
        />
      )}
      <ConfirmModal
        isOpen={confirmDelete}
        title="Delete document?"
        message={`${doc.doc_number} will be permanently removed. This cannot be undone.`}
        confirmLabel="Delete"
        isDestructive
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete(false)}
      />
      <ConfirmModal
        isOpen={Boolean(confirmTemplate)}
        title={confirmTemplate === 'save' ? 'Save as default template?' : confirmTemplate === 'load' ? 'Load default template?' : 'Reset to built-in template?'}
        message={confirmTemplate === 'save'
          ? `Every new ${meta.short} will start with these ${sections.length} sections. Existing documents are not changed.`
          : 'This replaces the content of this document with the template sections. Your Details stay the same.'}
        confirmLabel={confirmTemplate === 'save' ? 'Save template' : 'Replace content'}
        onConfirm={() => (confirmTemplate === 'load' ? loadDefaultTemplate() : templateAction(confirmTemplate))}
        onCancel={() => setConfirmTemplate(null)}
      />
    </div>
  );
}

function ProfileModal({ onClose }) {
  const [profile, setProfile] = useState(null);
  const [saving, setSaving] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    fetch('/api/founder-os/documents/settings')
      .then(r => r.json())
      .then(json => { if (json.success) setProfile(json.profile); else throw new Error(json.error); })
      .catch(err => { showToast(err.message || 'Could not load profile', 'error'); onClose(); });
  }, []);

  async function submit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/founder-os/documents/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile })
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      showToast('Business profile saved. New documents will use it.', 'success');
      onClose();
    } catch (err) {
      showToast(err.message || 'Save failed', 'error');
    } finally {
      setSaving(false);
    }
  }

  return (
    <ModalFrame title="Business Profile" onClose={onClose} maxWidth="max-w-2xl">
      {!profile ? (
        <div className="flex justify-center p-8"><div className="w-7 h-7 border-3 border-violet-600 border-t-transparent rounded-full animate-spin" /></div>
      ) : (
        <form onSubmit={submit} className="space-y-4">
          <p className="text-xs text-slate-500">These details and your signature are filled into every new document. Existing documents keep their own copy (edit them in Details).</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {PROFILE_FIELDS.map(field => (
              <div key={field.key} className={field.type === 'textarea' || field.type === 'signature' ? 'sm:col-span-2' : ''}>
                <label className={labelClass}>{field.label}</label>
                {field.type === 'signature' ? (
                  <SignaturePad value={profile.agency_signature} onChange={v => setProfile(p => ({ ...p, agency_signature: v }))} allowUpload height={150} />
                ) : field.type === 'textarea' ? (
                  <textarea className={inputClass} rows={2} value={profile[field.key] || ''} onChange={e => setProfile(p => ({ ...p, [field.key]: e.target.value }))} />
                ) : (
                  <input className={inputClass} value={profile[field.key] || ''} onChange={e => setProfile(p => ({ ...p, [field.key]: e.target.value }))} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className={secondaryBtn}>Cancel</button>
            <button type="submit" disabled={saving} className={primaryBtn}><FloppyDisk size={15} /> {saving ? 'Saving…' : 'Save profile'}</button>
          </div>
        </form>
      )}
    </ModalFrame>
  );
}

function SendModal({ doc, portalUsers, onClose, onSent }) {
  const meta = DOC_TYPES[doc.doc_type];
  const [email, setEmail] = useState(doc.sent_to_email || doc.data?.client_email || '');
  const [sendEmail, setSendEmail] = useState(true);
  const [notifyPortal, setNotifyPortal] = useState(Boolean(portalUsers.length && doc.project_id));
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const { showToast } = useToast();

  const firstName = (doc.data?.client_name || '').split(' ')[0] || 'there';
  const placeholder = meta.requiresSignature
    ? `Hi ${firstName},\n\nPlease find the ${meta.label} for ${doc.project_name || 'your project'} below. Have a read, and if everything looks good, you can sign it online in your client portal.\n\nThanks,\n${doc.data?.agency_signer_name || 'Team InfronixWeb'}`
    : `Hi ${firstName},\n\nSharing the ${meta.label} for ${doc.project_name || 'your project'} below. Let us know if you have any questions.`;

  async function submit(e) {
    e.preventDefault();
    setSending(true);
    try {
      const res = await fetch(`/api/founder-os/documents/${doc.id}/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, send_email: sendEmail, notify_portal: notifyPortal, message })
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      showToast(`${meta.short} sent${sendEmail ? ` to ${email}` : ''}${json.portalNotified ? ' and published in the client portal' : ''}`, 'success');
      onSent(json.document);
    } catch (err) {
      showToast(err.message || 'Send failed', 'error');
    } finally {
      setSending(false);
    }
  }

  return (
    <ModalFrame title={`Send ${meta.short}`} onClose={onClose}>
      <form onSubmit={submit} className="space-y-4">
        <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
          <input type="checkbox" className="w-4 h-4 accent-violet-600" checked={sendEmail} onChange={e => setSendEmail(e.target.checked)} />
          Email the document
        </label>
        {sendEmail && (
          <div>
            <label className={labelClass}>Client Email</label>
            <input type="email" className={inputClass} value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
        )}
        <label className={`flex items-start gap-2 text-xs cursor-pointer ${portalUsers.length && doc.project_id ? 'text-slate-700' : 'text-slate-400'}`}>
          <input
            type="checkbox"
            className="w-4 h-4 accent-violet-600 mt-0.5"
            checked={notifyPortal}
            disabled={!portalUsers.length || !doc.project_id}
            onChange={e => setNotifyPortal(e.target.checked)}
          />
          <span>
            Publish in client portal{meta.requiresSignature ? ' for online signing' : ''}
            <span className="block text-[10px] text-slate-400">
              {portalUsers.length && doc.project_id
                ? `Notifies ${portalUsers.map(u => u.full_name).join(', ')}`
                : !doc.project_id ? 'Link this document to a project to use the portal.' : 'This client has no portal account yet (create one in Client 360°).'}
            </span>
          </span>
        </label>
        <div>
          <label className={labelClass}>Message</label>
          <textarea className={inputClass} rows={7} value={message} placeholder={placeholder} onChange={e => setMessage(e.target.value)} />
          <p className="text-[10px] text-slate-400 mt-1">Leave empty to use the friendly default shown above. The full document is included below the message.</p>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className={secondaryBtn}>Cancel</button>
          <button type="submit" disabled={sending} className={primaryBtn}>
            <PaperPlaneTilt size={15} /> {sending ? 'Sending…' : 'Send'}
          </button>
        </div>
      </form>
    </ModalFrame>
  );
}

function MarkSignedModal({ doc, onClose, onDone }) {
  const [name, setName] = useState(doc.data?.client_name || '');
  const [signerTitle, setSignerTitle] = useState('');
  const [saving, setSaving] = useState(false);
  const { showToast } = useToast();

  async function submit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`/api/founder-os/documents/${doc.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'mark_signed_offline', signer_name: name, signer_title: signerTitle })
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      showToast('Marked as signed', 'success');
      onDone(json.document);
    } catch (err) {
      showToast(err.message || 'Failed', 'error');
    } finally {
      setSaving(false);
    }
  }

  return (
    <ModalFrame title="Mark as signed offline" onClose={onClose} maxWidth="max-w-md">
      <form onSubmit={submit} className="space-y-4">
        <p className="text-xs text-slate-500">Use this when the client signed a printed copy or over email. The document will be locked.</p>
        <div>
          <label className={labelClass}>Signed by</label>
          <input className={inputClass} value={name} onChange={e => setName(e.target.value)} required />
        </div>
        <div>
          <label className={labelClass}>Title (optional)</label>
          <input className={inputClass} value={signerTitle} onChange={e => setSignerTitle(e.target.value)} placeholder="e.g. Owner" />
        </div>
        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose} className={secondaryBtn}>Cancel</button>
          <button type="submit" disabled={saving} className={primaryBtn}><Seal size={15} /> {saving ? 'Saving…' : 'Mark signed'}</button>
        </div>
      </form>
    </ModalFrame>
  );
}

function NewDocumentModal({ clients, projects, onClose, onCreated }) {
  const [docType, setDocType] = useState('agreement');
  const [clientId, setClientId] = useState('');
  const [projectId, setProjectId] = useState('');
  const [saving, setSaving] = useState(false);
  const { showToast } = useToast();

  const clientProjects = projects.filter(p => !clientId || String(p.client_id) === String(clientId));

  function pickProject(id) {
    setProjectId(id);
    const proj = projects.find(p => String(p.id) === String(id));
    if (proj?.client_id) setClientId(String(proj.client_id));
  }

  async function submit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/founder-os/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ doc_type: docType, client_id: clientId || null, project_id: projectId || null })
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      showToast(`${DOC_TYPES[docType].short} draft created`, 'success');
      onCreated(json.document);
    } catch (err) {
      showToast(err.message || 'Could not create document', 'error');
    } finally {
      setSaving(false);
    }
  }

  return (
    <ModalFrame title="New Document" onClose={onClose}>
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className={labelClass}>Document Type</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {DOC_TYPE_KEYS.map(key => (
              <button
                key={key}
                type="button"
                onClick={() => setDocType(key)}
                className={`text-left px-3 py-2.5 rounded-xl border text-xs cursor-pointer transition-colors ${docType === key ? 'border-violet-500 bg-violet-50 text-violet-800 font-semibold' : 'border-slate-200 hover:bg-slate-50 text-slate-700'}`}
              >
                {DOC_TYPES[key].label}
                {DOC_TYPES[key].requiresSignature && <span className="block text-[10px] font-normal text-slate-400">Needs client signature</span>}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className={labelClass}>Client</label>
          <select className={inputClass} value={clientId} onChange={e => { setClientId(e.target.value); setProjectId(''); }}>
            <option value="">Select client…</option>
            {clients.map(c => <option key={c.id} value={c.id}>{c.company ? `${c.company} (${c.name})` : c.name}</option>)}
          </select>
        </div>
        <div>
          <label className={labelClass}>Project (recommended)</label>
          <select className={inputClass} value={projectId} onChange={e => pickProject(e.target.value)}>
            <option value="">No project</option>
            {clientProjects.map(p => <option key={p.id} value={p.id}>{p.project_name} – {p.client_name}</option>)}
          </select>
          <p className="text-[10px] text-slate-400 mt-1">Picking a project pre-fills amounts, dates and payment milestones, and enables portal signing.</p>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className={secondaryBtn}>Cancel</button>
          <button type="submit" disabled={saving || (!clientId && !projectId)} className={primaryBtn}><Plus size={15} /> {saving ? 'Creating…' : 'Create draft'}</button>
        </div>
      </form>
    </ModalFrame>
  );
}

function GeneratePackModal({ projects, onClose, onDone }) {
  const [projectId, setProjectId] = useState('');
  const [saving, setSaving] = useState(false);
  const { showToast } = useToast();

  async function submit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/founder-os/documents/generate-pack', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ project_id: projectId })
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      showToast(json.created.length ? `${json.created.length} draft(s) created` : 'This project already has all 5 documents', json.created.length ? 'success' : 'warning');
      onDone(projectId);
    } catch (err) {
      showToast(err.message || 'Could not generate pack', 'error');
    } finally {
      setSaving(false);
    }
  }

  return (
    <ModalFrame title="Generate Deal Pack" onClose={onClose}>
      <form onSubmit={submit} className="space-y-4">
        <p className="text-xs text-slate-600 leading-relaxed">
          Deal closed? Pick the project and we will create drafts of all 5 documents, pre-filled from the project and client records:
        </p>
        <ol className="text-xs text-slate-700 space-y-1 list-decimal pl-5">
          {DOC_TYPE_KEYS.map(k => <li key={k}>{DOC_TYPES[k].label}</li>)}
        </ol>
        <div>
          <label className={labelClass}>Project</label>
          <select className={inputClass} value={projectId} onChange={e => setProjectId(e.target.value)} required>
            <option value="">Select project…</option>
            {projects.map(p => <option key={p.id} value={p.id}>{p.project_name} – {p.client_name}</option>)}
          </select>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className={secondaryBtn}>Cancel</button>
          <button type="submit" disabled={saving || !projectId} className={primaryBtn}><Stack size={15} /> {saving ? 'Generating…' : 'Generate 5 drafts'}</button>
        </div>
      </form>
    </ModalFrame>
  );
}

export default function DocumentsModule() {
  const [documents, setDocuments] = useState([]);
  const [clients, setClients] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [projectFilter, setProjectFilter] = useState('');
  const [search, setSearch] = useState('');
  const [openDocId, setOpenDocId] = useState(null);
  const [showNew, setShowNew] = useState(false);
  const [showPack, setShowPack] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const { showToast } = useToast();

  const fetchDocuments = useCallback(async () => {
    try {
      const qs = new URLSearchParams({ type: typeFilter, status: statusFilter, search });
      if (projectFilter) qs.set('project_id', projectFilter);
      const res = await fetch(`/api/founder-os/documents?${qs}`);
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      setDocuments(json.documents || []);
      setClients(json.clients || []);
      setProjects(json.projects || []);
    } catch (err) {
      showToast(err.message || 'Error loading documents', 'error');
    } finally {
      setLoading(false);
    }
  }, [typeFilter, statusFilter, projectFilter, search]);

  useEffect(() => {
    const t = setTimeout(fetchDocuments, search ? 250 : 0);
    return () => clearTimeout(t);
  }, [fetchDocuments]);

  const counts = useMemo(() => {
    const c = { total: documents.length, awaiting: 0, changes: 0, signed: 0, drafts: 0 };
    for (const d of documents) {
      if (d.status === 'Draft') c.drafts++;
      if (d.status === 'Signed') c.signed++;
      if (d.status === 'Changes Requested') c.changes++;
      if (d.requires_signature && (d.status === 'Sent' || d.status === 'Viewed')) c.awaiting++;
    }
    return c;
  }, [documents]);

  if (openDocId) {
    return (
      <div className="pb-12">
        <DocumentEditor docId={openDocId} onBack={() => setOpenDocId(null)} onChanged={fetchDocuments} />
      </div>
    );
  }

  const stats = [
    { label: 'Drafts', value: counts.drafts, tone: 'text-slate-900' },
    { label: 'Awaiting signature', value: counts.awaiting, tone: 'text-amber-600' },
    { label: 'Changes requested', value: counts.changes, tone: 'text-rose-600' },
    { label: 'Signed', value: counts.signed, tone: 'text-emerald-600' },
  ];

  return (
    <div className="space-y-5 pb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900 font-outfit">Client Documents</h2>
          <p className="text-xs text-slate-500 mt-1">Welcome kit, agreement, SOW, invoice and NDA – generated, sent and signed in one place.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => setShowProfile(true)} className={secondaryBtn}><IdentificationCard size={15} /> Business Profile</button>
          <button type="button" onClick={() => setShowPack(true)} className={secondaryBtn}><Stack size={15} /> Generate Deal Pack</button>
          <button type="button" onClick={() => setShowNew(true)} className={primaryBtn}><Plus size={15} /> New Document</button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {stats.map(s => (
          <div key={s.label} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{s.label}</p>
            <p className={`text-2xl font-bold font-outfit mt-1 ${s.tone}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-2">
        <div className="relative flex-1">
          <MagnifyingGlass size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input className={`${inputClass} pl-9`} placeholder="Search by title, number or client…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className={`${inputClass} lg:w-48`} value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
          <option value="ALL">All types</option>
          {DOC_TYPE_KEYS.map(k => <option key={k} value={k}>{DOC_TYPES[k].short}</option>)}
        </select>
        <select className={`${inputClass} lg:w-48`} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="ALL">All statuses</option>
          {DOC_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select className={`${inputClass} lg:w-56`} value={projectFilter} onChange={e => setProjectFilter(e.target.value)}>
          <option value="">All projects</option>
          {projects.map(p => <option key={p.id} value={p.id}>{p.project_name}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center p-12">
          <div className="w-8 h-8 border-3 border-violet-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : documents.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No documents yet"
          description="Closed a deal? Generate the full 5-document pack for the project in one click, then review and send each one."
          actionLabel="Generate Deal Pack"
          onAction={() => setShowPack(true)}
          secondaryActionLabel="New Document"
          onSecondaryAction={() => setShowNew(true)}
        />
      ) : (
        <div className="rounded-2xl bg-white border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="px-4 py-3">Document</th>
                  <th className="px-4 py-3">Client / Project</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 hidden md:table-cell">Updated</th>
                </tr>
              </thead>
              <tbody>
                {documents.map(d => (
                  <tr key={d.id} onClick={() => setOpenDocId(d.id)} className="border-b border-slate-100 last:border-0 hover:bg-violet-50/40 cursor-pointer">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-violet-100 text-violet-700 flex items-center justify-center shrink-0"><FileText size={16} weight="duotone" /></div>
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-900 truncate max-w-[260px]">{DOC_TYPES[d.doc_type]?.short}</p>
                          <p className="text-[10px] font-mono text-slate-400">{d.doc_number}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-slate-800 font-medium">{d.client_display_company || d.client_display_name || '—'}</p>
                      <p className="text-[10px] text-slate-400">{d.project_name || 'No project'}</p>
                    </td>
                    <td className="px-4 py-3"><StatusBadge status={d.status} /></td>
                    <td className="px-4 py-3 text-slate-500 hidden md:table-cell">{formatShortDate(d.updated_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showNew && (
        <NewDocumentModal
          clients={clients}
          projects={projects}
          onClose={() => setShowNew(false)}
          onCreated={(doc) => { setShowNew(false); fetchDocuments(); setOpenDocId(doc.id); }}
        />
      )}
      {showProfile && <ProfileModal onClose={() => setShowProfile(false)} />}
      {showPack && (
        <GeneratePackModal
          projects={projects}
          onClose={() => setShowPack(false)}
          onDone={(pid) => { setShowPack(false); setProjectFilter(String(pid)); fetchDocuments(); }}
        />
      )}
    </div>
  );
}
