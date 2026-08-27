"use client";
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
    } else {
      const targetId = hash.replace('#', '');
      const element = document.getElementById(targetId);

      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      } else {
        // Retry shortly in case the target component is mounting after page navigation
        const timer = setTimeout(() => {
          const el = document.getElementById(targetId);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
          }
        }, 150);
        return () => clearTimeout(timer);
      }
    }
  }, [pathname, hash]);

  return null;
}
