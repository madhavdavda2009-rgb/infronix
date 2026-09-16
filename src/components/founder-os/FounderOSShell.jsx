"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import FounderSidebar from './FounderSidebar';
import FounderHeader from './FounderHeader';
import GlobalSearchModal from './GlobalSearchModal';
import DashboardModule from './DashboardModule';
import SalesModule from './SalesModule';
import DeliveryModule from './DeliveryModule';
import SOPModule from './SOPModule';
import FinanceModule from './FinanceModule';
import PeopleModule from './PeopleModule';
import SecurityModule from './SecurityModule';
import ActivityLogModule from './ActivityLogModule';
import SettingsModule from './SettingsModule';
import { useToast } from '@/context/ToastContext';

export default function FounderOSShell() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'dashboard');
  const [subTab, setSubTab] = useState(searchParams.get('sub') || '');
  const [initialLeadId, setInitialLeadId] = useState(searchParams.get('leadId') || null);
  const [initialProjectId, setInitialProjectId] = useState(searchParams.get('projectId') || null);
  const [initialSopId, setInitialSopId] = useState(searchParams.get('sopId') || null);

  const [metrics, setMetrics] = useState({});
  const [charts, setCharts] = useState({});
  const [alerts, setAlerts] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [settings, setSettings] = useState({ business_name: 'InfronixWeb', currency_symbol: '₹' });
  const [currentUser, setCurrentUser] = useState({ username: 'admin' });

  const [loading, setLoading] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Quick Action modal trigger states
  const [quickActionState, setQuickActionState] = useState(null);

  const { showToast } = useToast();

  // Load User & Dashboard Metrics
  const loadDashboardData = useCallback(async () => {
    try {
      // 1. Check Auth
      const userRes = await fetch('/api/admin/me');
      if (userRes.status === 401) {
        router.replace('/admin/login');
        return;
      }
      const userData = await userRes.json();
      if (userData.success && userData.admin) {
        setCurrentUser(userData.admin);
      }

      // 2. Fetch Dashboard Analytics
      const dashRes = await fetch('/api/founder-os/dashboard');
      const dashData = await dashRes.json();
      if (dashData.success) {
        setMetrics(dashData.metrics || {});
        setCharts(dashData.charts || {});
        setAlerts(dashData.alerts || []);
        setRecentActivity(dashData.recentActivity || []);
        if (dashData.settings) {
          setSettings(dashData.settings);
        }
      }
    } catch (err) {
      console.error('Founder OS init error:', err);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  // Sync tab with URL search params
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam && tabParam !== activeTab) {
      setActiveTab(tabParam);
    }
    const subParam = searchParams.get('sub');
    if (subParam) setSubTab(subParam);

    const leadParam = searchParams.get('leadId');
    if (leadParam) setInitialLeadId(leadParam);

    const projParam = searchParams.get('projectId');
    if (projParam) setInitialProjectId(projParam);

    const sopParam = searchParams.get('sopId');
    if (sopParam) setInitialSopId(sopParam);
  }, [searchParams]);

  // Handle Tab Switch
  const handleSelectTab = (tabId) => {
    setActiveTab(tabId);
    setSubTab('');
    router.push(`/admin?tab=${tabId}`, { scroll: false });
  };

  // Keyboard shortcut: Ctrl+K / Cmd+K for search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handle Logout
  async function handleLogout() {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
      showToast('Signed out of Founder OS', 'success');
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      router.push('/admin/login');
    }
  }

  // Handle Navigation from Search or Notifications
  const handleNavigateUrl = (url) => {
    router.push(url);
  };

  // Handle Quick Action Dispatcher
  const handleQuickAction = (action) => {
    if (action === 'new_lead' || action === 'log_call' || action === 'new_proposal') {
      setActiveTab('sales');
      if (action === 'new_lead') setSubTab('leads');
      else if (action === 'log_call') setSubTab('calls');
      else if (action === 'new_proposal') setSubTab('proposals');
      router.push(`/admin?tab=sales&sub=${action === 'new_lead' ? 'leads' : action === 'log_call' ? 'calls' : 'proposals'}`, { scroll: false });
    } else if (action === 'new_project') {
      setActiveTab('delivery');
      router.push('/admin?tab=delivery', { scroll: false });
    } else if (action === 'add_revenue' || action === 'add_expense') {
      setActiveTab('finance');
      setSubTab(action === 'add_revenue' ? 'revenue' : 'expenses');
      router.push(`/admin?tab=finance&sub=${action === 'add_revenue' ? 'revenue' : 'expenses'}`, { scroll: false });
    } else if (action === 'new_person') {
      setActiveTab('people');
      router.push('/admin?tab=people', { scroll: false });
    } else if (action === 'new_sop') {
      setActiveTab('sops');
      router.push('/admin?tab=sops', { scroll: false });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex antialiased selection:bg-violet-600 selection:text-white">
      {/* Sidebar (Desktop Persistent & Mobile Drawer) */}
      <FounderSidebar
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        metrics={metrics}
        isMobileOpen={isMobileOpen}
        onCloseMobile={() => setIsMobileOpen(false)}
        onLogout={handleLogout}
        currentUser={currentUser}
      />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen min-w-0">
        {/* Top Header */}
        <FounderHeader
          activeTab={activeTab}
          onOpenMobile={() => setIsMobileOpen(true)}
          onOpenSearch={() => setIsSearchOpen(true)}
          alerts={alerts}
          onRefresh={loadDashboardData}
          loading={loading}
          onQuickAction={handleQuickAction}
          onNavigate={handleNavigateUrl}
        />

        {/* Workspace Body */}
        <main className="flex-1 p-4 md:p-6 max-w-7xl w-full mx-auto">
          {activeTab === 'dashboard' && (
            <DashboardModule
              metrics={metrics}
              charts={charts}
              alerts={alerts}
              recentActivity={recentActivity}
              settings={settings}
              onNavigate={handleNavigateUrl}
              onQuickAction={handleQuickAction}
            />
          )}

          {activeTab === 'sales' && (
            <SalesModule
              initialSub={subTab || 'leads'}
              settings={settings}
              onRefreshDashboard={loadDashboardData}
            />
          )}

          {activeTab === 'delivery' && (
            <DeliveryModule
              initialProjectId={initialProjectId}
              settings={settings}
              onRefreshDashboard={loadDashboardData}
            />
          )}

          {activeTab === 'sops' && (
            <SOPModule
              initialSopId={initialSopId}
              settings={settings}
              onRefreshDashboard={loadDashboardData}
            />
          )}

          {activeTab === 'finance' && (
            <FinanceModule
              initialSub={subTab || 'overview'}
              settings={settings}
              onRefreshDashboard={loadDashboardData}
            />
          )}

          {activeTab === 'people' && (
            <PeopleModule
              settings={settings}
              onRefreshDashboard={loadDashboardData}
            />
          )}

          {activeTab === 'security' && (
            <SecurityModule
              initialSub={subTab || 'accounts'}
              settings={settings}
              onRefreshDashboard={loadDashboardData}
            />
          )}

          {activeTab === 'activity' && (
            <ActivityLogModule
              settings={settings}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsModule
              settings={settings}
              currentUser={currentUser}
              onRefreshDashboard={loadDashboardData}
            />
          )}
        </main>
      </div>

      {/* Global Command Palette Search Modal */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigate={handleNavigateUrl}
      />
    </div>
  );
}
