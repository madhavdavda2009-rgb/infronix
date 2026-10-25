"use client";
import React, { useState, useRef, useEffect, useCallback } from 'react';
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
import { useToast } from '@/context/ToastContext';

const NOTIFICATION_POLL_MS = 60000;

const TAB_TITLES = {
  dashboard: 'Business Overview',
  sales: 'Sales CRM & Pipeline',
  delivery: 'Delivery & Projects',
  documents: 'Client Documents & E-Sign',
  reviews: 'Reviews & Website Trust',
  mailbox: 'Mailbox · support@infronixweb.in',
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
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const knownKeys = useRef(null);
  const { showToast } = useToast();

  // Poll the admin feed so new website leads and client actions show up without a refresh.
  const loadNotifications = useCallback(async () => {
    try {
      const res = await fetch('/api/founder-os/notifications', { cache: 'no-store' });
      if (!res.ok) return;
      const json = await res.json();
      if (!json.success) return;
      const items = json.notifications || [];
      if (knownKeys.current) {
        const fresh = items.filter(i => i.unread && !knownKeys.current.has(i.key));
        const leads = fresh.filter(i => i.kind === 'lead');
        if (leads.length === 1) showToast(`🎉 ${leads[0].title}`, 'success', 8000);
        else if (leads.length > 1) showToast(`🎉 ${leads.length} new website leads`, 'success', 8000);
        const actions = fresh.filter(i => i.kind === 'client');
        if (actions.length) showToast(actions.length === 1 ? actions[0].title : `${actions.length} new client updates`, 'success', 6000);
      }
      knownKeys.current = new Set(items.map(i => i.key));
      setNotifications(items);
      setUnreadCount(json.unreadCount || 0);
    } catch {
      // Network hiccup: keep the last known list.
    }
  }, [showToast]);

  useEffect(() => {
    loadNotifications();
    const timer = setInterval(() => { if (document.visibilityState === 'visible') loadNotifications(); }, NOTIFICATION_POLL_MS);
    const onVisible = () => { if (document.visibilityState === 'visible') loadNotifications(); };
    document.addEventListener('visibilitychange', onVisible);
    return () => { clearInterval(timer); document.removeEventListener('visibilitychange', onVisible); };
  }, [loadNotifications]);

  // Show the unread count in the browser tab title.
  // Next.js sets the page title after mount, so apply the prefix again shortly after.
  useEffect(() => {
    const apply = () => {
      const base = document.title.replace(/^\(\d+\+?\)\s*/, '');
      document.title = unreadCount ? `(${unreadCount > 9 ? '9+' : unreadCount}) ${base}` : base;
    };
    apply();
    const timer = setTimeout(apply, 800);
    return () => clearTimeout(timer);
  }, [unreadCount, activeTab]);

  async function markRead(item) {
    if (!item.unread || item.kind !== 'client') return;
    setNotifications(list => list.map(n => (n.key === item.key ? { ...n, unread: false } : n)));
    setUnreadCount(c => Math.max(0, c - 1));
    fetch('/api/founder-os/notifications', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'read', key: item.key }) }).catch(() => {});
  }

  async function markAllRead() {
    setNotifications(list => list.map(n => ({ ...n, unread: false })));
    setUnreadCount(0);
    await fetch('/api/founder-os/notifications', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'read_all' }) }).catch(() => {});
  }

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
            onClick={() => { if (!showNotifications) loadNotifications(); setShowNotifications(!showNotifications); }}
            title="Notifications"
            className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors relative cursor-pointer min-w-[40px] min-h-[40px] flex items-center justify-center"
          >
            <Bell size={19} />
            {unreadCount > 0 ? (
              <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-rose-500 text-white text-[10px] font-bold leading-[18px] text-center ring-2 ring-white">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            ) : alerts.length > 0 ? (
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-violet-600 ring-2 ring-white" />
            ) : null}
          </button>

          <NotificationsPopover
            isOpen={showNotifications}
            onClose={() => setShowNotifications(false)}
            alerts={alerts}
            notifications={notifications}
            unreadCount={unreadCount}
            onMarkRead={markRead}
            onMarkAllRead={markAllRead}
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
