"use client";
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function ReloadRedirect() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check if the current page navigation was triggered by a reload (Refresh / F5 / Ctrl+R)
    const navEntries = performance.getEntriesByType('navigation');
    const isReload =
      (navEntries.length > 0 && navEntries[0].type === 'reload') ||
      (window.performance && window.performance.navigation && window.performance.navigation.type === 1);

    if (isReload) {
      if (location.pathname !== '/' || location.hash !== '') {
        // Redirect user to home page on refresh
        navigate('/', { replace: true });
        window.scrollTo(0, 0);
      }
    }
  }, []); // Runs once on app mount

  return null;
}
