"use client";
import React, { useRef, useEffect, useState } from 'react';
import { Bell, Warning, Info, CheckCircle, X, EnvelopeSimple, UserCircle, Checks } from '@phosphor-icons/react';

function timeAgo(value) {
  const seconds = Math.max(0, Math.round((Date.now() - new Date(value).getTime()) / 1000));
  if (seconds < 60) return 'just now';
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} hr${hours > 1 ? 's' : ''} ago`;
  const days = Math.round(hours / 24);
  if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;
  return new Date(value).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

export default function NotificationsPopover({
  isOpen,
  onClose,
  alerts = [],
  notifications = [],
  unreadCount = 0,
  onMarkRead,
  onMarkAllRead,
  onNavigate
}) {
  const popoverRef = useRef(null);
  const [tab, setTab] = useState('notifications');

  useEffect(() => {
    function handleClickOutside(event) {
      if (popoverRef.current && !popoverRef.current.contains(event.target) && !event.target.closest?.('button[title="Notifications"]')) {
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

  const tabs = [
    { id: 'notifications', label: 'Notifications', count: unreadCount },
    { id: 'alerts', label: 'Alerts', count: alerts.length },
  ];

  return (
    <div
      ref={popoverRef}
      className="absolute right-0 top-12 w-[calc(100vw-2rem)] max-w-[24rem] bg-white border border-slate-200 rounded-2xl shadow-2xl z-50 overflow-hidden animate-fadeIn"
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50/70">
        <div className="flex items-center gap-2">
          <Bell size={16} className="text-violet-600" weight="bold" />
          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">Notifications</span>
        </div>
        <div className="flex items-center gap-1">
          {tab === 'notifications' && unreadCount > 0 && (
            <button type="button" onClick={onMarkAllRead} className="inline-flex items-center gap-1 text-[11px] font-semibold text-violet-700 hover:bg-violet-50 px-2 py-1 rounded-md cursor-pointer">
              <Checks size={13} weight="bold" /> Mark all as read
            </button>
          )}
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 rounded-md transition-colors cursor-pointer" aria-label="Close notifications">
            <X size={14} />
          </button>
        </div>
      </div>

      <div className="flex gap-1 px-2 pt-2">
        {tabs.map(t => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`flex-1 inline-flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${tab === t.id ? 'bg-violet-600 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            {t.label}
            {t.count > 0 && (
              <span className={`px-1.5 rounded-full text-[10px] font-bold ${tab === t.id ? 'bg-white/25 text-white' : t.id === 'notifications' ? 'bg-rose-500 text-white' : 'bg-slate-200 text-slate-700'}`}>{t.count}</span>
            )}
          </button>
        ))}
      </div>

      <div className="max-h-[22rem] overflow-y-auto p-2">
        {tab === 'notifications' && (
          notifications.length === 0 ? (
            <div className="py-10 text-center text-xs text-slate-500">
              <CheckCircle size={28} className="text-emerald-500 mx-auto mb-2 opacity-90" weight="duotone" />
              <span>No website leads or client updates yet.</span>
            </div>
          ) : (
            <div className="space-y-1">
              {notifications.map(item => {
                const isLead = item.kind === 'lead';
                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => {
                      onMarkRead?.(item);
                      onClose();
                      if (onNavigate && item.link) onNavigate(item.link);
                    }}
                    className={`w-full text-left p-3 rounded-xl transition-colors cursor-pointer flex items-start gap-3 ${item.unread ? 'bg-violet-50/70 hover:bg-violet-100/70' : 'hover:bg-slate-50'}`}
                  >
                    <span className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${isLead ? 'bg-emerald-100 text-emerald-700' : 'bg-violet-100 text-violet-700'}`}>
                      {isLead ? <EnvelopeSimple size={16} weight="fill" /> : <UserCircle size={17} weight="fill" />}
                    </span>
                    <span className="flex-1 min-w-0">
                      <span className="flex items-start justify-between gap-2">
                        <span className={`text-xs leading-snug ${item.unread ? 'font-bold text-slate-900' : 'font-semibold text-slate-700'}`}>{item.title}</span>
                        {item.unread && <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0 mt-1" aria-label="Unread" />}
                      </span>
                      {item.message && <span className="block text-[11px] text-slate-500 leading-relaxed mt-0.5 line-clamp-2">{item.message}</span>}
                      <span className="flex items-center gap-1.5 mt-1 text-[10px] text-slate-400">
                        <span className={`font-semibold uppercase tracking-wide ${isLead ? 'text-emerald-600' : 'text-violet-600'}`}>{item.category}</span>
                        <span>·</span>
                        <span>{timeAgo(item.created_at)}</span>
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          )
        )}

        {tab === 'alerts' && (
          alerts.length === 0 ? (
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
                          <span className="text-xs font-bold truncate">{alert.title}</span>
                          <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-white border border-slate-200 text-slate-600 shadow-xs">{alert.category}</span>
                        </div>
                        <p className="text-[11px] text-slate-600 leading-relaxed">{alert.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )
        )}
      </div>

      <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 text-[11px] text-center text-slate-400">
        {tab === 'notifications' ? 'Checks for new leads and client updates every minute' : 'Alerts are calculated dynamically from active records'}
      </div>
    </div>
  );
}
