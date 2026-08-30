"use client";
import { Warning, PaperPlaneTilt, X, CheckCircle } from "@phosphor-icons/react";

export default function SendConfirmModal({ isOpen, onClose, onConfirm, emailData, loading }) {
  if (!isOpen || !emailData) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-950 border border-champagne-light/50 w-full max-w-lg shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-6 border-b border-champagne-light/20 bg-navy-muted/90 backdrop-blur-md flex justify-between items-center">
          <div className="flex items-center gap-2.5">
            <PaperPlaneTilt className="text-champagne-light text-xl" weight="bold" />
            <h3 className="font-headline-lg text-lg text-white font-bold">
              Confirm Cold Outreach Dispatch
            </h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors cursor-pointer">
            <X size={20} weight="bold" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 text-sm font-body-md text-slate-200">
          <div className="p-3.5 bg-amber-950/40 border border-amber-500/40 text-amber-200 text-xs flex items-start gap-2.5">
            <Warning className="text-amber-400 text-base shrink-0 mt-0.5" weight="bold" />
            <div>
              <p className="font-bold">Manual Approval Required</p>
              <p className="mt-0.5 text-amber-300/90">
                This email will be immediately dispatched from your Hostinger professional account to the recipient. Please verify the details below.
              </p>
            </div>
          </div>

          <div className="bg-slate-900/80 p-4 border border-slate-800 space-y-2 text-xs">
            <div>
              <span className="text-slate-400 font-label-caps uppercase tracking-wider block">Recipient (To):</span>
              <span className="text-white font-semibold">{emailData.recipient}</span>
            </div>
            <div>
              <span className="text-slate-400 font-label-caps uppercase tracking-wider block">Subject:</span>
              <span className="text-champagne-light font-semibold">{emailData.subject}</span>
            </div>
            <div>
              <span className="text-slate-400 font-label-caps uppercase tracking-wider block">Lead Company:</span>
              <span className="text-white">{emailData.companyName || 'N/A'}</span>
            </div>
          </div>

          <p className="text-xs text-slate-400 italic">
            Once sent, the lead status will be updated to <strong className="text-emerald-400">Sent</strong> and logged into your Supabase database records.
          </p>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-800 bg-slate-900/40 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 border border-slate-700 hover:border-slate-500 text-slate-300 text-xs uppercase font-label-caps tracking-widest transition-colors cursor-pointer"
          >
            Cancel / Back to Edit
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="px-5 py-2.5 bg-champagne-light hover:bg-white text-navy-muted text-xs uppercase font-label-caps tracking-widest font-bold transition-all shadow-lg flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <PaperPlaneTilt size={16} weight="bold" />
            <span>{loading ? 'Sending via Hostinger...' : 'Approve & Send Email'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
