"use client";
import React, { createContext, useContext, useState, useEffect, useCallback, useRef, Suspense } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useToast } from '@/context/ToastContext';

const ClientPortalContext = createContext(null);

// In-memory data caches for blazing fast transitions
const CACHE_TTL_MS = 60 * 1000; // 1 minute cache TTL
const cacheStore = {
  projects: { data: null, timestamp: 0 },
  projectDetails: new Map(), // projectId -> { data, timestamp }
  changeRequests: new Map()  // filterKey -> { data, timestamp }
};

function ClientPortalProviderInner({ children }) {
  const [user, setUser] = useState(null);
  const [client, setClient] = useState(null);
  const [stats, setStats] = useState({});
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isAdminPreview, setIsAdminPreview] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const adminPreviewClientId = searchParams?.get('admin_preview_client_id');
  const { showToast } = useToast();

  const isAuthRoute = pathname?.includes('/login') || 
                      pathname?.includes('/forgot-password') || 
                      pathname?.includes('/setup-password');

  // Prevent multiple simultaneous profile fetches
  const fetchingProfileRef = useRef(false);

  const fetchProfile = useCallback(async (force = false) => {
    if (isAuthRoute) {
      setLoading(false);
      return;
    }

    if (fetchingProfileRef.current && !force) return;
    fetchingProfileRef.current = true;

    try {
      const headers = {};
      if (adminPreviewClientId) {
        headers['x-admin-preview-client-id'] = adminPreviewClientId;
      }
      const qs = adminPreviewClientId ? `?admin_preview_client_id=${adminPreviewClientId}` : '';

      // Parallel fetch for session and notifications
      const [meRes, notifRes] = await Promise.all([
        fetch(`/api/client/me${qs}`, { headers }),
        fetch(`/api/client/notifications${qs}`, { headers }).catch(() => null)
      ]);

      if (meRes.status === 401) {
        if (!isAuthRoute) {
          router.push('/client/login');
        }
        return;
      }

      const meData = await meRes.json();
      if (meData.success) {
        setUser(meData.user);
        setClient(meData.client);
        setStats(meData.stats || {});
        setIsAdminPreview(Boolean(meData.isAdminPreview));
        setIsLoaded(true);
      } else if (!isAuthRoute) {
        router.push('/client/login');
        return;
      }

      if (notifRes && notifRes.ok) {
        try {
          const notifData = await notifRes.json();
          if (notifData.success) {
            const list = notifData.notifications || [];
            setNotifications(list);
            setUnreadCount(list.filter(n => !n.is_read).length);
          }
        } catch {
          // ignore notification parse error
        }
      }
    } catch (err) {
      console.warn('Client Portal session fetch error:', err);
    } finally {
      fetchingProfileRef.current = false;
      setLoading(false);
    }
  }, [adminPreviewClientId, isAuthRoute, router]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // ─── Cache helpers ──────────────────────────────────────────────────────────
  const invalidateCache = useCallback((type, key = null) => {
    if (type === 'all') {
      cacheStore.projects = { data: null, timestamp: 0 };
      cacheStore.projectDetails.clear();
      cacheStore.changeRequests.clear();
    } else if (type === 'projects') {
      cacheStore.projects = { data: null, timestamp: 0 };
    } else if (type === 'project' && key) {
      cacheStore.projectDetails.delete(String(key));
    } else if (type === 'changeRequests') {
      cacheStore.changeRequests.clear();
    }
  }, []);

  const getProjectsCached = useCallback(async (force = false) => {
    const now = Date.now();
    if (!force && cacheStore.projects.data && (now - cacheStore.projects.timestamp < CACHE_TTL_MS)) {
      return cacheStore.projects.data;
    }

    const headers = {};
    if (adminPreviewClientId) headers['x-admin-preview-client-id'] = adminPreviewClientId;
    const qs = adminPreviewClientId ? `?admin_preview_client_id=${adminPreviewClientId}` : '';

    const res = await fetch(`/api/client/projects${qs}`, { headers });
    const data = await res.json();
    if (data.success) {
      cacheStore.projects = { data: data.projects || [], timestamp: Date.now() };
      return data.projects || [];
    }
    throw new Error(data.error || 'Failed to fetch projects');
  }, [adminPreviewClientId]);

  const getProjectBundleCached = useCallback(async (projectId, force = false) => {
    const pKey = String(projectId);
    const now = Date.now();
    const cached = cacheStore.projectDetails.get(pKey);

    if (!force && cached && (now - cached.timestamp < CACHE_TTL_MS)) {
      return cached.data;
    }

    const headers = {};
    if (adminPreviewClientId) headers['x-admin-preview-client-id'] = adminPreviewClientId;
    const qs = adminPreviewClientId ? `&admin_preview_client_id=${adminPreviewClientId}` : '';

    const res = await fetch(`/api/client/projects/${projectId}?include=all${qs}`, { headers });
    const data = await res.json();
    if (data.success) {
      cacheStore.projectDetails.set(pKey, { data, timestamp: Date.now() });
      return data;
    }
    throw new Error(data.error || 'Failed to fetch project workspace');
  }, [adminPreviewClientId]);

  const getChangeRequestsCached = useCallback(async (filterStatus = 'ALL', force = false) => {
    const key = `${filterStatus}_${adminPreviewClientId || ''}`;
    const now = Date.now();
    const cached = cacheStore.changeRequests.get(key);

    if (!force && cached && (now - cached.timestamp < CACHE_TTL_MS)) {
      return cached.data;
    }

    const headers = {};
    if (adminPreviewClientId) headers['x-admin-preview-client-id'] = adminPreviewClientId;
    const q = new URLSearchParams();
    if (adminPreviewClientId) q.set('admin_preview_client_id', adminPreviewClientId);
    if (filterStatus !== 'ALL') q.set('status', filterStatus);

    const res = await fetch(`/api/client/change-requests?${q.toString()}`, { headers });
    const data = await res.json();
    if (data.success) {
      const crs = data.change_requests || [];
      cacheStore.changeRequests.set(key, { data: crs, timestamp: Date.now() });
      return crs;
    }
    throw new Error(data.error || 'Failed to fetch change requests');
  }, [adminPreviewClientId]);

  // ─── Fast mutations ────────────────────────────────────────────────────────
  const markAllNotificationsRead = useCallback(async () => {
    try {
      const headers = {};
      if (adminPreviewClientId) headers['x-admin-preview-client-id'] = adminPreviewClientId;
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      setUnreadCount(0);
      await fetch('/api/client/notifications/all/read', { method: 'PUT', headers });
      showToast('All notifications marked as read', 'success');
    } catch {
      showToast('Failed to update notifications', 'error');
    }
  }, [adminPreviewClientId, showToast]);

  const handleLogout = useCallback(async () => {
    try {
      await fetch('/api/client/auth/logout', { method: 'POST' });
    } catch {
      // ignore
    } finally {
      invalidateCache('all');
      setUser(null);
      setClient(null);
      showToast('Signed out successfully', 'success');
      router.push('/client/login');
    }
  }, [invalidateCache, router, showToast]);

  const value = {
    user,
    setUser,
    client,
    setClient,
    stats,
    setStats,
    notifications,
    setNotifications,
    unreadCount,
    isAdminPreview,
    adminPreviewClientId,
    loading,
    isLoaded,
    isMobileOpen,
    setIsMobileOpen,
    fetchProfile,
    invalidateCache,
    getProjectsCached,
    getProjectBundleCached,
    getChangeRequestsCached,
    markAllNotificationsRead,
    handleLogout
  };

  return (
    <ClientPortalContext.Provider value={value}>
      {children}
    </ClientPortalContext.Provider>
  );
}

export function ClientPortalProvider({ children }) {
  return (
    <Suspense fallback={null}>
      <ClientPortalProviderInner>
        {children}
      </ClientPortalProviderInner>
    </Suspense>
  );
}

export function useClientPortal() {
  const context = useContext(ClientPortalContext);
  if (!context) {
    throw new Error('useClientPortal must be used within a ClientPortalProvider');
  }
  return context;
}
