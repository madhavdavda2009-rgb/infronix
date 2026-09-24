"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  House,
  FolderSimple,
  GitPullRequest,
  Bell,
  User,
  SignOut,
  X,
  ShieldCheck,
  Headset
} from '@phosphor-icons/react';

export default function ClientSidebar({
  user,
  client,
  stats = {},
  isMobileOpen,
  onCloseMobile,
  onLogout,
  adminPreviewClientId
}) {
  const pathname = usePathname();

  const querySuffix = adminPreviewClientId ? `?admin_preview_client_id=${adminPreviewClientId}` : '';

  const NAV_ITEMS = [
    { label: 'Dashboard', href: `/client/dashboard${querySuffix}`, icon: House, exact: true },
    { label: 'Projects', href: `/client/dashboard#projects`, icon: FolderSimple, badge: stats.active_projects },
    { label: 'Change Requests', href: `/client/change-requests${querySuffix}`, icon: GitPullRequest, badge: stats.open_change_requests },
    { label: 'Notifications', href: `/client/notifications${querySuffix}`, icon: Bell, badge: stats.unread_notifications },
    { label: 'Profile & Security', href: `/client/profile${querySuffix}`, icon: User },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-white border-r border-slate-200 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-5 flex items-center justify-between border-b border-slate-100 shrink-0 bg-white">
          <div className="flex items-center">
            <img
              src="/light-web-logo.webp"
              alt="InfronixWeb"
              width={140}
              height={36}
              style={{ width: 'auto', height: 'auto' }}
              className="h-7 w-auto object-contain"
            />
          </div>
          <button
            onClick={onCloseMobile}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg lg:hidden cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Section */}
        <div className="flex-1 overflow-y-auto py-2 px-3 space-y-1">
          <div className="px-3 pb-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-400">
            PORTAL NAVIGATION
          </div>
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = item.exact 
              ? pathname === item.href.split('?')[0].split('#')[0]
              : pathname.startsWith(item.href.split('?')[0].split('#')[0]);

            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={onCloseMobile}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer min-h-[42px] ${
                  isActive
                    ? 'bg-violet-50 text-violet-700 border border-violet-200 font-bold shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    size={18}
                    weight={isActive ? 'fill' : 'regular'}
                    className={isActive ? 'text-violet-600' : 'text-slate-400'}
                  />
                  <span>{item.label}</span>
                </div>

                {item.badge !== undefined && item.badge > 0 && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    isActive
                      ? 'bg-violet-600 text-white'
                      : 'bg-slate-100 text-slate-700 border border-slate-200'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* Support Callout */}
        <div className="p-3 mx-3 mb-2 bg-slate-50 rounded-xl border border-slate-200/80 text-xs">
          <div className="flex items-center gap-2 text-slate-700 font-semibold mb-1">
            <Headset size={16} className="text-violet-600" />
            <span>Dedicated Support</span>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Need urgent assistance? Your project lead is available for updates.
          </p>
        </div>

        {/* Footer User Info & Logout */}
        <div className="p-3 border-t border-slate-100 shrink-0 bg-slate-50/70">
          <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200 shadow-2xs">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-violet-100 border border-violet-200 flex items-center justify-center text-xs font-bold text-violet-700 shrink-0">
                {user?.full_name?.charAt(0)?.toUpperCase() || 'C'}
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-slate-800 truncate">
                  {user?.full_name || 'Client'}
                </div>
                <div className="text-[10px] text-slate-500 truncate">
                  {user?.role_title || 'Client Executive'}
                </div>
              </div>
            </div>

            <button
              onClick={onLogout}
              title="Sign Out"
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
            >
              <SignOut size={18} weight="bold" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
