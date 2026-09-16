"use client";
import React, { useRef, useEffect } from 'react';
import { Bell, Warning, Info, CheckCircle, CaretRight, X } from '@phosphor-icons/react';

export default function NotificationsPopover({
  isOpen,
  onClose,
  alerts = [],
  onNavigate
}) {
  const popoverRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        onClose();
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={popoverRef}
      className="absolute right-0 top-12 w-80 sm:w-96 bg-white border border-slate-200 rounded-2xl shadow-2xl z-50 overflow-hidden animate-fadeIn"
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50/70">
        <div className="flex items-center gap-2">
          <Bell size={16} className="text-violet-600" weight="bold" />
          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Operational Alerts
          </span>
          <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-violet-50 text-violet-700 border border-violet-200">
            {alerts.length}
          </span>
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-600 p-1 rounded-md transition-colors"
        >
          <X size={14} />
        </button>
      </div>

      <div className="max-h-80 overflow-y-auto p-2">
        {alerts.length === 0 ? (
          <div className="py-10 text-center text-xs text-slate-500">
            <CheckCircle size={28} className="text-emerald-500 mx-auto mb-2 opacity-90" weight="duotone" />
            <span>All systems clear. No pending alerts or overdue items.</span>
          </div>
        ) : (
          <div className="space-y-1.5">
            {alerts.map((alert) => {
              const isDanger = alert.type === 'danger';
              const isWarning = alert.type === 'warning';
              return (
                <div
                  key={alert.id}
                  onClick={() => {
                    onClose();
                    if (onNavigate && alert.link) onNavigate(alert.link);
                  }}
                  className={`p-3 rounded-xl cursor-pointer transition-all border ${
                    isDanger
                      ? 'bg-rose-50 border-rose-200 hover:bg-rose-100/70 text-rose-900'
                      : isWarning
                      ? 'bg-amber-50 border-amber-200 hover:bg-amber-100/70 text-amber-900'
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-900'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <div className="mt-0.5 shrink-0">
                      {isDanger ? (
                        <Warning size={16} className="text-rose-500" weight="fill" />
                      ) : isWarning ? (
                        <Warning size={16} className="text-amber-500" weight="bold" />
                      ) : (
                        <Info size={16} className="text-sky-500" weight="bold" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <span className="text-xs font-bold truncate">
                          {alert.title}
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-white border border-slate-200 text-slate-600 shadow-xs">
                          {alert.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-relaxed">
                        {alert.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 text-[11px] text-center text-slate-400">
        Alerts are calculated dynamically from active records
      </div>
    </div>
  );
}
