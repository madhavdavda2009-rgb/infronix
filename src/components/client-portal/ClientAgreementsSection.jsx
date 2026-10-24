"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { FileText, Signature, CheckCircle, X, DownloadSimple, ChatCircleText, ShieldCheck } from '@phosphor-icons/react';
import { useClientPortal } from '@/context/ClientPortalContext';
import { useToast } from '@/context/ToastContext';
import { DOC_TYPES, renderDocumentHtml } from '@/lib/document_templates';
import { downloadDocumentPdf } from '@/lib/document_pdf';
import SignaturePad from '@/components/SignaturePad';

const STATUS_LABELS = {
  Sent: { text: 'Action needed', cls: 'bg-amber-50 text-amber-700 border-amber-200' },
  Viewed: { text: 'Action needed', cls: 'bg-amber-50 text-amber-700 border-amber-200' },
  'Changes Requested': { text: 'Changes requested', cls: 'bg-rose-50 text-rose-700 border-rose-200' },
  Signed: { text: 'Signed', cls: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
};

function statusFor(doc) {
  if (!doc.requires_signature && doc.status !== 'Changes Requested') {
    return { text: 'Shared', cls: 'bg-slate-100 text-slate-600 border-slate-200' };
  }
  return STATUS_LABELS[doc.status] || STATUS_LABELS.Sent;
}

function AgreementViewer({ docId, previewHeaders, isAdminPreview, onClose, onUpdated }) {
  const [doc, setDoc] = useState(null);
  const [mode, setMode] = useState('read');
  const [signerName, setSignerName] = useState('');
  const [signerTitle, setSignerTitle] = useState('');
  const [signatureImage, setSignatureImage] = useState('');
  const [agree, setAgree] = useState(false);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    let active = true;
    fetch(`/api/client/agreements/${docId}`, { headers: previewHeaders })
      .then(r => r.json())
      .then(json => {
        if (!active) return;
        if (!json.success) throw new Error(json.error);
        setDoc(json.document);
        setSignerName(json.document.data?.client_name || '');
      })
      .catch(err => { showToast(err.message || 'Could not open document', 'error'); onClose(); });
    return () => { active = false; };
  }, [docId]);

  async function submit(action) {
    setSubmitting(true);
    try {
      const res = await fetch(`/api/client/agreements/${docId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...previewHeaders },
        body: JSON.stringify(action === 'sign'
          ? { action, signer_name: signerName, signer_title: signerTitle, signature_image: signatureImage, agree, content_hash: doc.content_hash }
          : { action, comment })
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      showToast(json.message, 'success');
      if (json.document) setDoc(prev => ({ ...prev, ...json.document }));
      else setDoc(prev => ({ ...prev, status: 'Changes Requested', client_comment: comment }));
      setMode('read');
      onUpdated();
    } catch (err) {
      showToast(err.message || 'Something went wrong', 'error');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDownload() {
    setPdfLoading(true);
    try {
      await downloadDocumentPdf(doc);
    } catch {
      showToast('PDF download failed', 'error');
    } finally {
      setPdfLoading(false);
    }
  }

  const canAct = doc && doc.status !== 'Signed' && doc.status !== 'Changes Requested';
  const readyToSign = agree && signatureImage && signerName.trim().length > 1;

  return (
    <div className="fixed inset-0 z-50 flex items-stretch sm:items-center justify-center sm:p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl bg-white sm:rounded-3xl shadow-2xl flex flex-col max-h-screen sm:max-h-[92vh] overflow-hidden">
        <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-slate-100 shrink-0">
          <div className="min-w-0">
            <h3 className="font-bold text-sm text-slate-900 font-outfit truncate">{doc ? DOC_TYPES[doc.doc_type]?.label : 'Loading…'}</h3>
            {doc && <p className="text-[10px] font-mono text-slate-400">{doc.doc_number}</p>}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {doc && (
              <button type="button" onClick={handleDownload} disabled={pdfLoading} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 cursor-pointer">
                <DownloadSimple size={14} weight="bold" /> {pdfLoading ? 'Preparing…' : 'PDF'}
              </button>
            )}
            <button type="button" onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 cursor-pointer"><X size={18} /></button>
          </div>
        </div>

        {!doc ? (
          <div className="flex items-center justify-center p-16">
            <div className="w-8 h-8 border-3 border-violet-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto bg-slate-100 p-2 sm:p-5">
              <div className="bg-white shadow-sm rounded-xl overflow-hidden" dangerouslySetInnerHTML={{ __html: renderDocumentHtml(doc) }} />
            </div>

            <div className="shrink-0 border-t border-slate-200 bg-white px-5 py-4 max-h-[65vh] overflow-y-auto">
              {doc.status === 'Signed' && (
                <div className="flex items-center gap-2 text-xs text-emerald-700 font-semibold">
                  <CheckCircle size={18} weight="fill" /> Signed by {doc.signer_name} on {new Date(doc.signed_at).toLocaleString('en-IN')}
                </div>
              )}
              {doc.status === 'Changes Requested' && (
                <p className="text-xs text-rose-700">You requested changes: “{doc.client_comment}”. We will share an updated version soon.</p>
              )}

              {canAct && mode === 'read' && (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <p className="text-xs text-slate-500">
                    {doc.requires_signature ? 'Please review the document. Sign when ready, or tell us what to change.' : 'Have a question about this document? Let us know.'}
                  </p>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => setMode('changes')} className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-xs font-semibold text-slate-700 cursor-pointer">
                      <ChatCircleText size={15} /> {doc.requires_signature ? 'Request changes' : 'Ask a question'}
                    </button>
                    {doc.requires_signature && (
                      <button type="button" onClick={() => setMode('sign')} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-semibold cursor-pointer">
                        <Signature size={15} /> Sign document
                      </button>
                    )}
                  </div>
                </div>
              )}

              {canAct && mode === 'changes' && (
                <div className="space-y-3">
                  <textarea
                    rows={3}
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                    placeholder="Tell us what you would like changed…"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-violet-500/30"
                  />
                  <div className="flex justify-end gap-2">
                    <button type="button" onClick={() => setMode('read')} className="px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 cursor-pointer">Back</button>
                    <button type="button" disabled={submitting || isAdminPreview || comment.trim().length < 5} onClick={() => submit('request_changes')} className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-semibold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
                      {submitting ? 'Sending…' : 'Send feedback'}
                    </button>
                  </div>
                </div>
              )}

              {canAct && mode === 'sign' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Full name</label>
                      <input value={signerName} onChange={e => setSignerName(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-violet-500/30" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Title (optional)</label>
                      <input value={signerTitle} onChange={e => setSignerTitle(e.target.value)} placeholder="e.g. Owner" className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-violet-500/30" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Your signature</label>
                    <SignaturePad value={signatureImage} onChange={setSignatureImage} height={140} disabled={isAdminPreview} />
                  </div>
                  <label className="flex items-start gap-2 text-xs text-slate-700 cursor-pointer">
                    <input type="checkbox" checked={agree} onChange={e => setAgree(e.target.checked)} className="w-4 h-4 accent-violet-600 mt-0.5" />
                    <span>I have read and agree to this document, I am authorised to sign it, and I agree that the signature drawn above is my electronic signature.</span>
                  </label>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <p className="flex items-center gap-1.5 text-[10px] text-slate-400"><ShieldCheck size={13} /> Your signature, time and a fingerprint of this exact version are recorded.</p>
                    <div className="flex justify-end gap-2">
                      <button type="button" onClick={() => setMode('read')} className="px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 cursor-pointer">Back</button>
                      <button type="button" disabled={submitting || isAdminPreview || !readyToSign} onClick={() => submit('sign')} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-semibold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
                        <Signature size={15} /> {submitting ? 'Signing…' : 'Sign & accept'}
                      </button>
                    </div>
                  </div>
                  {isAdminPreview && <p className="text-[10px] text-amber-600">Signing is disabled in admin preview.</p>}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function ClientAgreementsSection({ projectId, initialDocId }) {
  const { isAdminPreview, adminPreviewClientId } = useClientPortal();
  const [documents, setDocuments] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [openId, setOpenId] = useState(initialDocId ? parseInt(initialDocId, 10) : null);
  const previewHeaders = adminPreviewClientId ? { 'x-admin-preview-client-id': adminPreviewClientId } : {};

  const load = useCallback(async () => {
    try {
      const qs = adminPreviewClientId ? `?admin_preview_client_id=${adminPreviewClientId}` : '';
      const res = await fetch(`/api/client/projects/${projectId}/agreements${qs}`, { headers: previewHeaders });
      const json = await res.json();
      if (json.success) setDocuments(json.documents || []);
    } finally {
      setLoaded(true);
    }
  }, [projectId, adminPreviewClientId]);

  useEffect(() => { load(); }, [load]);

  if (!loaded || documents.length === 0) return null;

  const pending = documents.filter(d => d.requires_signature && (d.status === 'Sent' || d.status === 'Viewed')).length;

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-bold text-sm text-slate-900 font-outfit">Agreements & Onboarding</h3>
        {pending > 0 && (
          <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
            {pending} awaiting your signature
          </span>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {documents.map(doc => {
          const st = statusFor(doc);
          return (
            <button
              key={doc.id}
              type="button"
              onClick={() => setOpenId(doc.id)}
              className="text-left p-4 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-violet-50/50 hover:border-violet-200 flex items-center justify-between gap-4 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-violet-100 text-violet-700 flex items-center justify-center shrink-0">
                  {doc.status === 'Signed' ? <CheckCircle size={20} weight="duotone" /> : <FileText size={20} weight="duotone" />}
                </div>
                <div className="min-w-0">
                  <h4 className="font-bold text-xs text-slate-900 truncate">{DOC_TYPES[doc.doc_type]?.label}</h4>
                  <span className="text-[10px] text-slate-400 font-mono">{doc.doc_number}</span>
                </div>
              </div>
              <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border whitespace-nowrap ${st.cls}`}>{st.text}</span>
            </button>
          );
        })}
      </div>

      {openId && (
        <AgreementViewer
          docId={openId}
          previewHeaders={previewHeaders}
          isAdminPreview={isAdminPreview}
          onClose={() => setOpenId(null)}
          onUpdated={load}
        />
      )}
    </div>
  );
}
