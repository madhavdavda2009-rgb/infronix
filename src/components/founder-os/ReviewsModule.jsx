"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { Star, Plus, PencilSimple, Trash, X, Eye, EyeSlash, PushPin, FloppyDisk, ArrowSquareOut } from '@phosphor-icons/react';
import EmptyState from './EmptyState';
import { ConfirmModal } from './ConfirmModal';
import { useToast } from '@/context/ToastContext';

const SOURCES = ['Google', 'WhatsApp', 'Email', 'LinkedIn', 'GoodFirms', 'Clutch', 'DesignRush', 'Direct'];
const EMPTY_REVIEW = { reviewer_name: '', reviewer_role: '', business_name: '', rating: 5, review_text: '', source: 'Google', source_url: '', review_date: '', is_published: true, is_featured: false, display_order: 0 };

const inputClass = 'w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500';
const labelClass = 'block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1';
const primaryBtn = 'inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed';
const secondaryBtn = 'inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs font-semibold shadow-xs transition-colors cursor-pointer disabled:opacity-60';

function Stars({ value, onChange, size = 16 }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(n => (
        <button
          key={n}
          type="button"
          disabled={!onChange}
          onClick={() => onChange?.(n)}
          className={onChange ? 'cursor-pointer' : 'cursor-default'}
          aria-label={`${n} star${n > 1 ? 's' : ''}`}
        >
          <Star size={size} weight={n <= value ? 'fill' : 'regular'} className={n <= value ? 'text-amber-400' : 'text-slate-300'} />
        </button>
      ))}
    </div>
  );
}

function ReviewModal({ review, onClose, onSaved }) {
  const [form, setForm] = useState({ ...EMPTY_REVIEW, ...review, review_date: review?.review_date ? String(review.review_date).slice(0, 10) : '' });
  const [saving, setSaving] = useState(false);
  const { showToast } = useToast();
  const set = (key, value) => setForm(f => ({ ...f, [key]: value }));

  async function submit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(review?.id ? `/api/founder-os/reviews/${review.id}` : '/api/founder-os/reviews', {
        method: review?.id ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      showToast(review?.id ? 'Review updated' : 'Review added', 'success');
      onSaved();
    } catch (err) {
      showToast(err.message || 'Save failed', 'error');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="w-full max-w-xl bg-white border border-slate-200 rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h3 className="text-base font-bold text-slate-900 font-outfit">{review?.id ? 'Edit review' : 'Add a client review'}</h3>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg cursor-pointer"><X size={18} /></button>
        </div>
        <form onSubmit={submit} className="p-5 space-y-4">
          <p className="text-[11px] text-slate-500">Copy the review exactly as the client wrote it (Google, WhatsApp, email…). Only add reviews you actually received.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Client name *</label>
              <input className={inputClass} value={form.reviewer_name} onChange={e => set('reviewer_name', e.target.value)} required />
            </div>
            <div>
              <label className={labelClass}>Business</label>
              <input className={inputClass} value={form.business_name} onChange={e => set('business_name', e.target.value)} placeholder="e.g. Shah Dental Clinic" />
            </div>
            <div>
              <label className={labelClass}>Role</label>
              <input className={inputClass} value={form.reviewer_role} onChange={e => set('reviewer_role', e.target.value)} placeholder="e.g. Owner" />
            </div>
            <div>
              <label className={labelClass}>Rating</label>
              <div className="h-[34px] flex items-center"><Stars value={form.rating} onChange={v => set('rating', v)} size={22} /></div>
            </div>
          </div>
          <div>
            <label className={labelClass}>Review *</label>
            <textarea className={inputClass} rows={5} value={form.review_text} onChange={e => set('review_text', e.target.value)} required />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className={labelClass}>Source</label>
              <select className={inputClass} value={form.source} onChange={e => set('source', e.target.value)}>
                {SOURCES.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Review date</label>
              <input type="date" className={inputClass} value={form.review_date} onChange={e => set('review_date', e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Order</label>
              <input type="number" className={inputClass} value={form.display_order} onChange={e => set('display_order', e.target.value)} />
            </div>
          </div>
          <div>
            <label className={labelClass}>Link to original review (optional)</label>
            <input className={inputClass} value={form.source_url} onChange={e => set('source_url', e.target.value)} placeholder="https://g.page/…" />
            <p className="text-[10px] text-slate-400 mt-1">Shown as &ldquo;View on Google&rdquo; so visitors can verify it. Must start with https://</p>
          </div>
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 accent-violet-600" checked={form.is_published} onChange={e => set('is_published', e.target.checked)} /> Show on website
            </label>
            <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 accent-violet-600" checked={form.is_featured} onChange={e => set('is_featured', e.target.checked)} /> Pin to top
            </label>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className={secondaryBtn}>Cancel</button>
            <button type="submit" disabled={saving} className={primaryBtn}><FloppyDisk size={15} /> {saving ? 'Saving…' : 'Save review'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function TrustSettingsCard() {
  const [trust, setTrust] = useState(null);
  const [saving, setSaving] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    fetch('/api/founder-os/website-trust').then(r => r.json()).then(json => {
      if (json.success) setTrust(json.trust);
    });
  }, []);

  if (!trust) return null;

  const rows = (list, n, blank) => [...list, ...Array.from({ length: Math.max(0, n - list.length) }, () => ({ ...blank }))].slice(0, n);
  const stats = rows(trust.stats, 4, { value: '', label: '' });
  const badges = rows(trust.badges, 4, { title: '', description: '' });

  function setRow(kind, index, key, value) {
    const list = kind === 'stats' ? [...stats] : [...badges];
    list[index] = { ...list[index], [key]: value };
    setTrust(t => ({ ...t, [kind]: list }));
  }

  async function save() {
    setSaving(true);
    try {
      const res = await fetch('/api/founder-os/website-trust', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(trust)
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      setTrust(json.trust);
      showToast('Homepage trust section saved', 'success');
    } catch (err) {
      showToast(err.message || 'Save failed', 'error');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-slate-900 font-outfit">Homepage trust section</h3>
          <p className="text-[11px] text-slate-500 mt-0.5">Empty rows are hidden on the website. Only use real numbers and promises you keep.</p>
        </div>
        <button type="button" onClick={save} disabled={saving} className={primaryBtn}><FloppyDisk size={15} /> {saving ? 'Saving…' : 'Save'}</button>
      </div>

      <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
        <input type="checkbox" className="w-4 h-4 accent-violet-600" checked={trust.show_rating_strip} onChange={e => setTrust(t => ({ ...t, show_rating_strip: e.target.checked }))} />
        Show rating strip under the hero (average stars and review count, calculated from published reviews)
      </label>

      <div>
        <p className={labelClass}>Numbers strip (up to 4)</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {stats.map((s, i) => (
            <div key={i} className="flex gap-2">
              <input className={`${inputClass} w-28 shrink-0`} placeholder="e.g. 25+" value={s.value} onChange={e => setRow('stats', i, 'value', e.target.value)} />
              <input className={inputClass} placeholder="e.g. Websites delivered" value={s.label} onChange={e => setRow('stats', i, 'label', e.target.value)} />
            </div>
          ))}
        </div>
      </div>

      <div>
        <p className={labelClass}>Trust badges (up to 4)</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {badges.map((b, i) => (
            <div key={i} className="space-y-1.5 p-3 rounded-xl bg-slate-50 border border-slate-200">
              <input className={inputClass} placeholder="Title, e.g. On-time delivery" value={b.title} onChange={e => setRow('badges', i, 'title', e.target.value)} />
              <input className={inputClass} placeholder="One line, e.g. Clear timelines agreed in writing" value={b.description} onChange={e => setRow('badges', i, 'description', e.target.value)} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ReviewsModule() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const { showToast } = useToast();

  const load = useCallback(async () => {
    try {
      const res = await fetch('/api/founder-os/reviews');
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      setReviews(json.reviews || []);
    } catch (err) {
      showToast(err.message || 'Could not load reviews', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function quickUpdate(review, patch) {
    const res = await fetch(`/api/founder-os/reviews/${review.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...review, review_date: review.review_date ? String(review.review_date).slice(0, 10) : '', ...patch })
    });
    const json = await res.json();
    if (json.success) load();
    else showToast(json.error || 'Update failed', 'error');
  }

  async function confirmDelete() {
    const res = await fetch(`/api/founder-os/reviews/${deleting.id}`, { method: 'DELETE' });
    const json = await res.json();
    setDeleting(null);
    if (json.success) { showToast('Review deleted', 'success'); load(); }
    else showToast(json.error || 'Delete failed', 'error');
  }

  const published = reviews.filter(r => r.is_published);
  const average = published.length ? (published.reduce((s, r) => s + r.rating, 0) / published.length).toFixed(1) : '–';

  return (
    <div className="space-y-5 pb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900 font-outfit">Reviews &amp; Trust</h2>
          <p className="text-xs text-slate-500 mt-1">Client reviews and trust signals shown on the homepage.</p>
        </div>
        <div className="flex gap-2">
          <a href="/#reviews" target="_blank" rel="noopener noreferrer" className={secondaryBtn}><ArrowSquareOut size={15} /> View on website</a>
          <button type="button" onClick={() => setEditing({})} className={primaryBtn}><Plus size={15} /> Add review</button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[['Published', published.length], ['Average rating', average], ['Hidden', reviews.length - published.length]].map(([k, v]) => (
          <div key={k} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{k}</p>
            <p className="text-2xl font-bold font-outfit mt-1 text-slate-900">{v}</p>
          </div>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center p-12"><div className="w-8 h-8 border-3 border-violet-600 border-t-transparent rounded-full animate-spin" /></div>
      ) : reviews.length === 0 ? (
        <EmptyState icon={Star} title="No reviews yet" description="Add the real reviews your clients gave you on Google, WhatsApp or email. They appear on the homepage straight away." actionLabel="Add first review" onAction={() => setEditing({})} />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {reviews.map(r => (
            <div key={r.id} className={`p-4 rounded-2xl bg-white border shadow-xs ${r.is_published ? 'border-slate-200' : 'border-dashed border-slate-300 opacity-70'}`}>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Stars value={r.rating} size={14} />
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">{r.source}</span>
                    {r.is_featured && <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-violet-50 text-violet-700 border border-violet-200">Pinned</span>}
                    {!r.is_published && <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">Hidden</span>}
                  </div>
                  <p className="text-sm font-bold text-slate-900 mt-2">{r.reviewer_name}</p>
                  <p className="text-[11px] text-slate-500">{[r.reviewer_role, r.business_name].filter(Boolean).join(', ')}</p>
                </div>
                <div className="flex items-center shrink-0">
                  <button type="button" title={r.is_published ? 'Hide from website' : 'Show on website'} onClick={() => quickUpdate(r, { is_published: !r.is_published })} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer">{r.is_published ? <Eye size={16} /> : <EyeSlash size={16} />}</button>
                  <button type="button" title={r.is_featured ? 'Unpin' : 'Pin to top'} onClick={() => quickUpdate(r, { is_featured: !r.is_featured })} className={`p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer ${r.is_featured ? 'text-violet-600' : 'text-slate-400 hover:text-slate-700'}`}><PushPin size={16} weight={r.is_featured ? 'fill' : 'regular'} /></button>
                  <button type="button" title="Edit" onClick={() => setEditing(r)} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"><PencilSimple size={16} /></button>
                  <button type="button" title="Delete" onClick={() => setDeleting(r)} className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"><Trash size={16} /></button>
                </div>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed mt-3 line-clamp-4 whitespace-pre-line">{r.review_text}</p>
            </div>
          ))}
        </div>
      )}

      <TrustSettingsCard />

      {editing && <ReviewModal review={editing} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); load(); }} />}
      <ConfirmModal
        isOpen={Boolean(deleting)}
        title="Delete review?"
        message={deleting ? `The review from ${deleting.reviewer_name} will be removed from the website and Founder OS.` : ''}
        confirmLabel="Delete"
        isDestructive
        onConfirm={confirmDelete}
        onCancel={() => setDeleting(null)}
      />
    </div>
  );
}
