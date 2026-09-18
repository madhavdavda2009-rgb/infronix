"use client";
import React from 'react';
import {
  ChartBar,
  Briefcase,
  Folder,
  BookOpen,
  CurrencyInr,
  Users,
  UserCheck,
  Article,
  ShieldCheck,
  ClockCounterClockwise,
  Gear,
  SignOut,
  X
} from '@phosphor-icons/react';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: ChartBar, badgeKey: null },
  { id: 'sales', label: 'Sales CRM', icon: Briefcase, badgeKey: 'openLeads' },
  { id: 'clients', label: 'Client 360°', icon: UserCheck, badgeKey: null },
  { id: 'delivery', label: 'Delivery', icon: Folder, badgeKey: 'activeProjects' },
  { id: 'sops', label: 'SOP Library', icon: BookOpen, badgeKey: null },
  { id: 'finance', label: 'Finance', icon: CurrencyInr, badgeKey: null },
  { id: 'people', label: 'People & Roles', icon: Users, badgeKey: null },
  { id: 'blog', label: 'Blog Management', icon: Article, badgeKey: null },
  { id: 'security', label: 'Security Center', icon: ShieldCheck, badgeKey: null },
  { id: 'activity', label: 'Activity Log', icon: ClockCounterClockwise, badgeKey: null },
  { id: 'settings', label: 'Settings', icon: Gear, badgeKey: null },
];

export default function FounderSidebar({
  activeTab,
  onSelectTab,
  metrics = {},
  isMobileOpen,
  onCloseMobile,
  onLogout,
  currentUser
}) {
  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-white border-r border-slate-200 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header with Exact Light Logo */}
        <div className="h-16 px-5 flex items-center justify-between border-b border-slate-100 shrink-0 bg-white">
          <div className="flex items-center gap-2.5">
            <img
              src="/light-web-logo.png"
              alt="InfronixWeb"
              className="h-7 w-auto object-contain"
            />
            <span className="px-1.5 py-0.5 rounded bg-violet-50 border border-violet-200 text-[9px] font-bold text-violet-700 uppercase tracking-wider">
              OS
            </span>
          </div>
          <button
            onClick={onCloseMobile}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Section */}
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
            BUSINESS DOMAINS
          </div>
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            const badgeCount = item.badgeKey ? metrics[item.badgeKey] : null;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  onSelectTab(item.id);
                  onCloseMobile();
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer min-h-[42px] ${
                  isActive
                    ? 'bg-violet-50 text-violet-700 border border-violet-200 font-bold shadow-xs'
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

                {badgeCount !== null && badgeCount > 0 && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    isActive
                      ? 'bg-violet-600 text-white'
                      : 'bg-slate-100 text-slate-700 border border-slate-200'
                  }`}>
                    {badgeCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Footer User Info & Logout */}
        <div className="p-3 border-t border-slate-100 shrink-0 bg-slate-50/70">
          <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200 shadow-xs">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-violet-100 border border-violet-200 flex items-center justify-center text-xs font-bold text-violet-700 shrink-0">
                {currentUser?.username?.charAt(0)?.toUpperCase() || 'F'}
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-slate-800 truncate">
                  {currentUser?.username || 'Founder'}
                </div>
                <div className="text-[10px] text-slate-500 truncate">
                  Administrator
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
