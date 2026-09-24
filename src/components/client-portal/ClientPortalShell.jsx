"use client";
import React, { Suspense } from 'react';
import ClientSidebar from './ClientSidebar';
import ClientHeader from './ClientHeader';
import AdminPreviewBanner from './AdminPreviewBanner';
import { useClientPortal } from '@/context/ClientPortalContext';

// ─── Skeleton shown while session data loads on initial cold start ──────────
function PortalSkeleton() {
  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      <aside className="fixed top-0 bottom-0 left-0 z-40 w-64 bg-white border-r border-slate-200 hidden lg:flex flex-col">
        <div className="h-16 px-5 flex items-center border-b border-slate-100">
          <div className="w-32 h-6 bg-slate-100 rounded animate-pulse" />
        </div>
        <div className="flex-1 p-4 space-y-2">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-10 bg-slate-100 rounded-xl animate-pulse"
              style={{ opacity: 1 - i * 0.15 }}
            />
          ))}
        </div>
      </aside>
      <div className="flex-1 flex flex-col lg:pl-64">
        <div className="h-16 bg-white border-b border-slate-200 px-6 flex items-center gap-4">
          <div className="w-48 h-5 bg-slate-100 rounded animate-pulse" />
        </div>
        <div className="flex-1 p-6 md:p-8 space-y-4 max-w-7xl w-full mx-auto">
          <div className="h-8 w-64 bg-slate-100 rounded animate-pulse" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-28 bg-white rounded-2xl border border-slate-200 animate-pulse" />
            ))}
          </div>
          <div className="h-48 bg-white rounded-2xl border border-slate-200 animate-pulse" />
        </div>
      </div>
    </div>
  );
}

// ─── Inner shell that uses shared ClientPortalContext ─────────────────────────
function PortalShellInner({ title, subtitle, breadcrumbs, children }) {
  const {
    user,
    client,
    stats,
    notifications,
    unreadCount,
    isAdminPreview,
    adminPreviewClientId,
    loading,
    isMobileOpen,
    setIsMobileOpen,
    handleLogout
  } = useClientPortal();

  if (loading && !user) return <PortalSkeleton />;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {isAdminPreview && (
        <AdminPreviewBanner
          clientName={client?.name}
          clientId={client?.id || adminPreviewClientId}
        />
      )}

      <div className="flex-1 flex min-h-0">
        <ClientSidebar
          user={user}
          client={client}
          stats={stats}
          isMobileOpen={isMobileOpen}
          onCloseMobile={() => setIsMobileOpen(false)}
          onLogout={handleLogout}
          adminPreviewClientId={adminPreviewClientId}
        />

        <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
          <ClientHeader
            title={title}
            subtitle={subtitle}
            breadcrumbs={breadcrumbs}
            user={user}
            notifications={notifications}
            unreadCount={unreadCount}
            onOpenMobileSidebar={() => setIsMobileOpen(true)}
            adminPreviewClientId={adminPreviewClientId}
          />

          <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-7xl w-full mx-auto">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}

// ─── Public export ────────────────────────────────────────────────────────────
export default function ClientPortalShell({ title, subtitle, breadcrumbs = [], children }) {
  return (
    <PortalShellInner
      title={title}
      subtitle={subtitle}
      breadcrumbs={breadcrumbs}
    >
      {children}
    </PortalShellInner>
  );
}

