'use client';
import { useEffect, useState } from 'react';

// Keep the server-rendered content visible during background refreshes.
export function usePublicData(url, initialData) {
  const [data, setData] = useState(initialData);
  useEffect(() => {
    setData(initialData);
    const controller = new AbortController();
    let pending = false;
    async function refresh() {
      if (pending || document.visibilityState === 'hidden') return;
      pending = true;
      try {
        const response = await fetch(url, { cache: 'no-store', signal: controller.signal });
        if (!response.ok) return;
        const next = await response.json();
        if (next.success && !controller.signal.aborted) {
          setData(current => JSON.stringify(current) === JSON.stringify(next) ? current : next);
        }
      } catch { /* Retain the last successful content on a temporary network failure. */ }
      finally { pending = false; }
    }
    if (!initialData?.success) refresh();
    const interval = setInterval(refresh, 5000);
    window.addEventListener('focus', refresh);
    document.addEventListener('visibilitychange', refresh);
    return () => {
      controller.abort();
      clearInterval(interval);
      window.removeEventListener('focus', refresh);
      document.removeEventListener('visibilitychange', refresh);
    };
  }, [url, initialData]);
  return data;
}
