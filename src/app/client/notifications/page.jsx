"use client";
import React from 'react';
import Link from 'next/link';
import ClientPortalShell from '@/components/client-portal/ClientPortalShell';
import { useClientPortal } from '@/context/ClientPortalContext';
import { Bell, CheckCircle, ArrowRight, ShieldCheck } from '@phosphor-icons/react';

function NotificationsContent() {
  const { notifications, loading, markAllNotificationsRead } = useClientPortal();

  return (
    <ClientPortalShell
      title="Notifications"
      subtitle="Important project updates, requirement reminders, and team communications"
      breadcrumbs={[{ label: 'Client Portal', href: '/client/dashboard' }, { label: 'Notifications' }]}
    >
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 className="font-bold text-sm text-slate-900 font-outfit">Activity & Alerts</h3>
          <button
            onClick={markAllNotificationsRead}
            className="text-xs font-semibold text-violet-600 hover:text-violet-700 cursor-pointer"
          >
            Mark all as read
          </button>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-slate-100 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-500">
            No notifications available.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {notifications.map((n) => (
              <div
                key={n.id}
                className={`p-4 rounded-2xl transition-colors flex items-start justify-between gap-4 ${
                  !n.is_read ? 'bg-violet-50/50' : 'hover:bg-slate-50'
                }`}
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-xs text-slate-900">{n.title}</span>
                    {!n.is_read && (
                      <span className="w-2 h-2 rounded-full bg-violet-600 shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{n.message}</p>
                  <div className="text-[10px] text-slate-400 mt-1">
                    {new Date(n.created_at).toLocaleDateString('en-IN', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>

                {n.action_url && (
                  <Link
                    href={n.action_url}
                    className="p-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 shadow-2xs transition-colors shrink-0"
                    title="View Action"
                  >
                    <ArrowRight size={16} weight="bold" />
                  </Link>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </ClientPortalShell>
  );
}

export default function ClientNotificationsPage() {
  return (
    <React.Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-slate-50"><div className="w-8 h-8 border-3 border-violet-600 border-t-transparent rounded-full animate-spin" /></div>}>
      <NotificationsContent />
    </React.Suspense>
  );
}
