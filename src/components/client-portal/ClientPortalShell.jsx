"use client";
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ClientSidebar from './ClientSidebar';
import ClientHeader from './ClientHeader';
import AdminPreviewBanner from './AdminPreviewBanner';
import { useToast } from '@/context/ToastContext';

export default function ClientPortalShell({
  title,
  subtitle,
  breadcrumbs = [],
  children
}) {
  const [user, setUser] = useState(null);
  const [client, setClient] = useState(null);
  const [stats, setStats] = useState({});
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isAdminPreview, setIsAdminPreview] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const adminPreviewClientId = searchParams?.get('admin_preview_client_id');
  const { showToast } = useToast();

  useEffect(() => {
    fetchProfile();
  }, [adminPreviewClientId]);

  async function fetchProfile() {
    try {
      const headers = {};
      if (adminPreviewClientId) {
        headers['x-admin-preview-client-id'] = adminPreviewClientId;
      }

      const res = await fetch(`/api/client/me${adminPreviewClientId ? `?admin_preview_client_id=${adminPreviewClientId}` : ''}`, {
        headers
      });

      if (res.status === 401) {
        // Not authenticated
        router.push('/client/login');
        return;
      }

      const data = await res.json();
      if (data.success) {
        setUser(data.user);
        setClient(data.client);
        setStats(data.stats || {});
        setIsAdminPreview(data.isAdminPreview || false);
        fetchNotifications(headers);
      } else {
        router.push('/client/login');
      }
    } catch (err) {
      console.error('Portal session check error:', err);
    } finally {
      setLoading(false);
    }
  }

  async function fetchNotifications(headers = {}) {
    try {
      const res = await fetch(`/api/client/notifications${adminPreviewClientId ? `?admin_preview_client_id=${adminPreviewClientId}` : ''}`, {
        headers
      });
      const data = await res.json();
      if (data.success) {
        setNotifications(data.notifications || []);
        const unread = (data.notifications || []).filter(n => !n.is_read).length;
        setUnreadCount(unread);
      }
    } catch (err) {
      console.warn('Could not load notifications:', err.message);
    }
  }

  async function handleLogout() {
    try {
      await fetch('/api/client/auth/logout', { method: 'POST' });
      showToast('Signed out successfully', 'success');
      router.push('/client/login');
    } catch (err) {
      router.push('/client/login');
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-violet-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-medium text-slate-500">Loading Client Portal...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Admin Preview Floating Top Banner if viewing as admin */}
      {isAdminPreview && (
        <AdminPreviewBanner
          clientName={client?.name}
          clientId={client?.id || adminPreviewClientId}
        />
      )}

      {/* Main Layout Container */}
      <div className="flex-1 flex min-h-0">
        {/* Sidebar */}
        <ClientSidebar
          user={user}
          client={client}
          stats={stats}
          isMobileOpen={isMobileOpen}
          onCloseMobile={() => setIsMobileOpen(false)}
          onLogout={handleLogout}
          adminPreviewClientId={adminPreviewClientId}
        />

        {/* Main Content Area */}
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
