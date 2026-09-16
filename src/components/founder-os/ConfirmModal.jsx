"use client";
import React, { useState } from 'react';
import { Warning, Trash, X } from '@phosphor-icons/react';

export function ConfirmModal({
  isOpen,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  isDestructive = false,
  loading = false,
  onConfirm,
  onCancel
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-2xl p-5 sm:p-6 overflow-hidden">
        <div className="flex items-start gap-3 sm:gap-4">
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${isDestructive ? 'bg-rose-50 text-rose-600 border border-rose-200' : 'bg-violet-50 text-violet-600 border border-violet-200'}`}>
            <Warning size={22} weight="bold" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-bold text-slate-900 mb-1 font-outfit">
              {title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              {message}
            </p>
          </div>
          <button
            onClick={onCancel}
            disabled={loading}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mt-6 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2.5 sm:gap-3 border-t border-slate-100 pt-4">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="w-full sm:w-auto px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer text-center min-h-[42px]"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={`w-full sm:w-auto px-5 py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer min-h-[42px] ${
              isDestructive
                ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-sm shadow-rose-600/20'
                : 'bg-violet-600 hover:bg-violet-700 text-white shadow-sm shadow-violet-600/20'
            } disabled:opacity-50`}
          >
            {loading ? (
              <div className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : isDestructive ? (
              <Trash size={14} weight="bold" />
            ) : null}
            <span>{confirmLabel}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export function DangerConfirmModal({
  isOpen,
  title = 'Destructive Action',
  message = 'This will permanently wipe data. Type RESET to confirm.',
  requiredPhrase = 'RESET',
  loading = false,
  onConfirm,
  onCancel
}) {
  const [typedPhrase, setTypedPhrase] = useState('');

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (typedPhrase.trim() === requiredPhrase) {
      onConfirm();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-white border border-rose-200 rounded-2xl shadow-2xl p-5 sm:p-6 overflow-hidden">
        <div className="flex items-start gap-3 sm:gap-4">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 bg-rose-50 text-rose-600 border border-rose-200">
            <Warning size={24} weight="fill" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-bold text-rose-700 mb-1 font-outfit">
              {title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              {message}
            </p>
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2">
            Type <span className="text-rose-600 font-mono font-black">{requiredPhrase}</span> to confirm:
          </label>
          <input
            type="text"
            value={typedPhrase}
            onChange={(e) => setTypedPhrase(e.target.value)}
            placeholder={requiredPhrase}
            className="w-full bg-slate-50 border border-rose-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 font-mono placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
          />
        </div>

        <div className="mt-6 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2.5 sm:gap-3 border-t border-rose-100 pt-4">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="w-full sm:w-auto px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer text-center min-h-[42px]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={typedPhrase.trim() !== requiredPhrase || loading}
            className="w-full sm:w-auto px-5 py-2.5 text-xs font-bold uppercase tracking-wider bg-rose-600 hover:bg-rose-700 text-white rounded-xl transition-all shadow-sm shadow-rose-600/20 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer min-h-[42px]"
          >
            {loading && <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />}
            <span>Permanently Reset</span>
          </button>
        </div>
      </div>
    </div>
  );
}
