"use client";
import React, { useState, useRef, useEffect } from 'react';
import {
  List,
  MagnifyingGlass,
  Bell,
  Plus,
  ArrowsClockwise,
  CaretDown,
  Briefcase,
  Folder,
  CurrencyInr,
  Users,
  BookOpen,
  PhoneCall,
  FileText
} from '@phosphor-icons/react';
import NotificationsPopover from './NotificationsPopover';

const TAB_TITLES = {
  dashboard: 'Business Overview',
  sales: 'Sales CRM & Pipeline',
  delivery: 'Delivery & Projects',
  sops: 'SOPs Standard Operating Procedures',
  finance: 'Finance & Profitability',
  people: 'Team & Responsibilities',
  security: 'Security Center & Backups',
  activity: 'Audit & Activity Log',
  settings: 'System & Business Settings'
};

export default function FounderHeader({
  activeTab,
  onOpenMobile,
  onOpenSearch,
  alerts = [],
  onRefresh,
  loading = false,
  onQuickAction,
  onNavigate
}) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showQuickMenu, setShowQuickMenu] = useState(false);
  const quickMenuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (quickMenuRef.current && !quickMenuRef.current.contains(event.target)) {
        setShowQuickMenu(false);
      }
    }
    if (showQuickMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showQuickMenu]);

  return (
    <header className="h-16 px-4 md:px-6 bg-white/95 backdrop-blur-md border-b border-slate-200 flex items-center justify-between sticky top-0 z-30 shrink-0">
      {/* Left: Mobile Toggle & Breadcrumbs */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onOpenMobile}
          className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 lg:hidden min-w-[40px] min-h-[40px] flex items-center justify-center cursor-pointer transition-colors"
          title="Open Menu"
        >
          <List size={22} weight="bold" />
        </button>

        <div className="min-w-0">
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            <span className="hidden sm:inline">INFRONIXWEB</span>
            <span className="hidden sm:inline">/</span>
            <span className="text-violet-600 font-black">FOUNDER OS</span>
          </div>
          <h1 className="text-sm md:text-base font-bold text-slate-900 tracking-tight font-outfit truncate">
            {TAB_TITLES[activeTab] || 'Dashboard'}
          </h1>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-1.5 sm:gap-2.5">
        {/* Search trigger (Ctrl+K) */}
        <button
          onClick={onOpenSearch}
          type="button"
          className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 border border-slate-200 text-slate-600 hover:text-slate-900 text-xs transition-all cursor-pointer min-h-[38px]"
        >
          <MagnifyingGlass size={15} className="text-slate-500" />
          <span>Search records...</span>
          <kbd className="px-1.5 py-0.5 rounded bg-white border border-slate-200 text-[10px] font-mono text-slate-500 shadow-xs">
            Ctrl+K
          </kbd>
        </button>

        <button
          onClick={onOpenSearch}
          title="Search"
          className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 md:hidden min-w-[40px] min-h-[40px] flex items-center justify-center cursor-pointer transition-colors"
        >
          <MagnifyingGlass size={20} />
        </button>

        {/* Refresh Data button */}
        <button
          onClick={onRefresh}
          disabled={loading}
          title="Refresh Data"
          className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer disabled:opacity-50 min-w-[40px] min-h-[40px] flex items-center justify-center"
        >
          <ArrowsClockwise size={19} className={loading ? 'animate-spin text-violet-600' : ''} />
        </button>

        {/* Notifications Trigger & Popover */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            title="Notifications"
            className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors relative cursor-pointer min-w-[40px] min-h-[40px] flex items-center justify-center"
          >
            <Bell size={19} />
            {alerts.length > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-violet-600 ring-2 ring-white animate-pulse" />
            )}
          </button>

          <NotificationsPopover
            isOpen={showNotifications}
            onClose={() => setShowNotifications(false)}
            alerts={alerts}
            onNavigate={onNavigate}
          />
        </div>

        {/* + Quick Action Menu */}
        <div className="relative" ref={quickMenuRef}>
          <button
            type="button"
            onClick={() => setShowQuickMenu(!showQuickMenu)}
            className="flex items-center gap-1.5 px-3 sm:px-3.5 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-sm shadow-violet-600/20 cursor-pointer active:scale-98 min-h-[38px]"
          >
            <Plus size={14} weight="bold" />
            <span className="hidden sm:inline">Create</span>
            <CaretDown size={12} weight="bold" />
          </button>

          {showQuickMenu && (
            <div className="absolute right-0 top-11 w-52 bg-white border border-slate-200 rounded-2xl shadow-2xl p-1.5 z-50 animate-fadeIn space-y-0.5">
              <button
                type="button"
                onClick={() => { setShowQuickMenu(false); onQuickAction('new_lead'); }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-violet-700 hover:bg-violet-50 transition-colors"
              >
                <Briefcase size={16} className="text-violet-600" />
                <span>Add Lead</span>
              </button>
              <button
                type="button"
                onClick={() => { setShowQuickMenu(false); onQuickAction('log_call'); }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-sky-700 hover:bg-sky-50 transition-colors"
              >
                <PhoneCall size={16} className="text-sky-600" />
                <span>Log Sales Call</span>
              </button>
              <button
                type="button"
                onClick={() => { setShowQuickMenu(false); onQuickAction('new_proposal'); }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-purple-700 hover:bg-purple-50 transition-colors"
              >
                <FileText size={16} className="text-purple-600" />
                <span>Create Proposal</span>
              </button>
              <button
                type="button"
                onClick={() => { setShowQuickMenu(false); onQuickAction('new_project'); }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-amber-700 hover:bg-amber-50 transition-colors"
              >
                <Folder size={16} className="text-amber-600" />
                <span>New Project</span>
              </button>
              <div className="h-px bg-slate-100 my-1" />
              <button
                type="button"
                onClick={() => { setShowQuickMenu(false); onQuickAction('add_revenue'); }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
              >
                <CurrencyInr size={16} className="text-emerald-600" />
                <span>Record Revenue</span>
              </button>
              <button
                type="button"
                onClick={() => { setShowQuickMenu(false); onQuickAction('add_expense'); }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-rose-700 hover:bg-rose-50 transition-colors"
              >
                <CurrencyInr size={16} className="text-rose-600" />
                <span>Add Expense</span>
              </button>
              <div className="h-px bg-slate-100 my-1" />
              <button
                type="button"
                onClick={() => { setShowQuickMenu(false); onQuickAction('new_person'); }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-indigo-700 hover:bg-indigo-50 transition-colors"
              >
                <Users size={16} className="text-indigo-600" />
                <span>Add Team Member</span>
              </button>
              <button
                type="button"
                onClick={() => { setShowQuickMenu(false); onQuickAction('new_sop'); }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-cyan-700 hover:bg-cyan-50 transition-colors"
              >
                <BookOpen size={16} className="text-cyan-600" />
                <span>New SOP</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
