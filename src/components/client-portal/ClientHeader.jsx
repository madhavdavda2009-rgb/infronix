"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { List, Bell, ShieldCheck, CheckCircle, Warning, CaretRight } from '@phosphor-icons/react';

export default function ClientHeader({
  title,
  subtitle,
  breadcrumbs = [],
  user,
  notifications = [],
  unreadCount = 0,
  onOpenMobileSidebar,
  adminPreviewClientId
}) {
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const querySuffix = adminPreviewClientId ? `?admin_preview_client_id=${adminPreviewClientId}` : '';

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
      {/* Left side: Mobile button + Breadcrumbs / Title */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onOpenMobileSidebar}
          className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 lg:hidden cursor-pointer shrink-0"
          aria-label="Open Navigation Menu"
        >
          <List size={22} weight="bold" />
        </button>

        <div className="min-w-0">
          {breadcrumbs.length > 0 && (
            <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-slate-500 font-medium mb-0.5 truncate">
              {breadcrumbs.map((b, idx) => (
                <React.Fragment key={idx}>
                  {b.href ? (
                    <Link href={`${b.href}${querySuffix}`} className="hover:text-violet-600 transition-colors">
                      {b.label}
                    </Link>
                  ) : (
                    <span className="text-slate-700 font-semibold">{b.label}</span>
                  )}
                  {idx < breadcrumbs.length - 1 && <CaretRight size={10} className="text-slate-400" />}
                </React.Fragment>
              ))}
            </div>
          )}
          <h1 className="text-base sm:text-lg font-bold text-slate-900 font-outfit truncate">
            {title}
          </h1>
        </div>
      </div>

      {/* Right side: Client ID Badge + Notifications */}
      <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
        <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-xs font-mono font-bold text-slate-700">
          <ShieldCheck size={14} className="text-emerald-600" weight="bold" />
          <span>{user?.public_client_id || 'CLIENT'}</span>
        </div>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => setShowNotifMenu(!showNotifMenu)}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 relative transition-colors cursor-pointer"
            title="Notifications"
            aria-label="View notifications"
          >
            <Bell size={20} weight={unreadCount > 0 ? 'fill' : 'regular'} className={unreadCount > 0 ? 'text-violet-600' : ''} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-violet-600 ring-2 ring-white animate-pulse" />
            )}
          </button>

          {showNotifMenu && (
            <>
              <div 
                onClick={() => setShowNotifMenu(false)} 
                className="fixed inset-0 z-40"
              />
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden animate-fadeIn">
                <div className="p-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
                  <div className="text-xs font-bold text-slate-900 font-outfit">Project Notifications</div>
                  <Link
                    href={`/client/notifications${querySuffix}`}
                    onClick={() => setShowNotifMenu(false)}
                    className="text-[11px] text-violet-600 hover:underline font-semibold"
                  >
                    View All
                  </Link>
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-xs text-slate-500">
                      No notifications yet
                    </div>
                  ) : (
                    notifications.slice(0, 5).map((n) => (
                      <div
                        key={n.id}
                        className={`p-3 text-xs transition-colors ${
                          !n.is_read ? 'bg-violet-50/40' : 'hover:bg-slate-50'
                        }`}
                      >
                        <div className="font-semibold text-slate-800 mb-0.5">{n.title}</div>
                        <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">{n.message}</p>
                        <div className="text-[10px] text-slate-400 mt-1">
                          {new Date(n.created_at).toLocaleDateString('en-IN', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
