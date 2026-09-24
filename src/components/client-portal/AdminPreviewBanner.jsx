"use client";
import React from 'react';
import { Eye, ArrowSquareOut, X } from '@phosphor-icons/react';

export default function AdminPreviewBanner({ clientName, clientId, onExit }) {
  return (
    <div className="bg-amber-500 text-slate-950 px-4 py-2 text-xs font-semibold flex items-center justify-between shadow-md relative z-50 animate-fadeIn">
      <div className="flex items-center gap-2">
        <Eye size={16} weight="bold" className="shrink-0" />
        <span>
          <strong>Admin Preview Mode:</strong> Viewing Client Portal as <strong>{clientName || `Client #${clientId}`}</strong> (Read-Only). No actions will create live client comments or approvals.
        </span>
      </div>
      <button
        onClick={onExit || (() => window.location.href = `/admin?tab=clients&clientId=${clientId}`)}
        className="px-3 py-1 bg-slate-950 hover:bg-slate-900 text-white font-medium rounded-lg transition-colors flex items-center gap-1 cursor-pointer shrink-0 ml-3"
      >
        <span>Exit to Founder OS</span>
        <ArrowSquareOut size={14} weight="bold" />
      </button>
    </div>
  );
}
