"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

// Native anchor smooth-scroll — no Lenis, no external library.
// Browser handles smooth scrolling via CSS scroll-behavior: smooth.
export default function SmoothScroll({ children }) {
  const pathname = usePathname();

  useEffect(() => {
    const handleAnchorClick = (e) => {
      const anchor = e.target.closest("a");
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (!href) return;

      let targetSelector = null;
      if (href.startsWith("#") && href.length > 1) {
        targetSelector = href;
      } else if (pathname === "/" && href.startsWith("/#") && href.length > 2) {
        targetSelector = href.substring(1);
      }

      if (targetSelector) {
        const target = document.querySelector(targetSelector);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: "smooth", block: "start" });
          // Offset for fixed header (~80px)
          const y = target.getBoundingClientRect().top + window.scrollY - 80;
          window.scrollTo({ top: y, behavior: "smooth" });
        }
      }
    };

    document.addEventListener("click", handleAnchorClick);
    return () => document.removeEventListener("click", handleAnchorClick);
  }, [pathname]);

  // Scroll to top on route change (unless hash present)
  useEffect(() => {
    if (typeof window !== "undefined" && !window.location.hash) {
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  }, [pathname]);

  return <>{children}</>;
}
