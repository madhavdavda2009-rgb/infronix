"use client";
import React, { useState } from 'react';
import { X, CheckCircle, ShieldCheck, Warning } from '@phosphor-icons/react';
import { useToast } from '@/context/ToastContext';

export default function DeliverableApprovalModal({
  isOpen,
  onClose,
  projectId,
  approvalType = 'Deliverable', // 'Design' | 'Content' | 'Stage' | 'Preview' | 'Final Delivery'
  deliverableTitle = '',
  deliverableVersion = '1.0',
  onSuccess
}) {
  const [comment, setComment] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { showToast } = useToast();

  if (!isOpen) return null;

  async function handleApprove(e) {
    e.preventDefault();
    if (!confirmed) {
      showToast('Please check the confirmation box to authorize approval', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/client/approvals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project_id: projectId,
          approval_type: approvalType,
          deliverable_title: deliverableTitle,
          version: deliverableVersion,
          client_comment: comment
        })
      });

      const data = await res.json();
      if (data.success) {
        showToast(`Formal ${approvalType} approval recorded! Thank you.`, 'success');
        onSuccess && onSuccess(data.approval);
        onClose();
      } else {
        showToast(data.error || 'Failed to record approval', 'error');
      }
    } catch (err) {
      showToast('Error recording approval', 'error');
    } finally {
      setSubmitting(false);
    }
  }

  const actionLabels = {
    'Design': 'Approve UI / Design Deliverable',
    'Content': 'Approve Website Content',
    'Stage': 'Approve Milestone Stage',
    'Preview': 'Approve Staging Preview',
    'Final Delivery': 'Confirm Final Project Delivery & Handover'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <CheckCircle size={18} weight="bold" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 font-outfit">Formal Client Approval</h2>
              <p className="text-[11px] text-slate-500">{approvalType} Confirmation</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleApprove} className="p-6 space-y-4 text-xs">
          <div className="p-3.5 bg-emerald-50/60 rounded-xl border border-emerald-100 text-emerald-950">
            <div className="font-bold text-xs mb-0.5">{deliverableTitle}</div>
            <div className="text-[11px] text-emerald-800">Version {deliverableVersion}</div>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1.5">
              Approval Notes / Feedback (Optional)
            </label>
            <textarea
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="e.g. Approved the color scheme, layout, and mobile responsiveness."
              className="w-full bg-white text-slate-900 text-xs p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600 transition-colors leading-relaxed"
            />
          </div>

          <label className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
            <input
              type="checkbox"
              required
              checked={confirmed}
              onChange={(e) => setConfirmed(e.target.checked)}
              className="mt-0.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
            />
            <span className="text-[11px] text-slate-700 leading-snug">
              I confirm that I have reviewed this deliverable and authorise the InfronixWeb team to proceed to the next milestone.
            </span>
          </label>

          {/* Footer */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-medium transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || !confirmed}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition-all shadow-sm shadow-emerald-600/20 cursor-pointer disabled:opacity-50 flex items-center gap-2"
            >
              {submitting ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <span>{actionLabels[approvalType] || 'Confirm Approval'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
