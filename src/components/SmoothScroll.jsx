"use client";
import { useEffect, useRef } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePathname } from "next/navigation";

export default function SmoothScroll({ children }) {
  const lenisRef = useRef(null);
  const pathname = usePathname();

  useEffect(() => {
    // Completely disable Lenis on Admin routes to prevent scroll hijacking on admin tables & modals
    if (pathname && pathname.startsWith('/admin')) {
      if (lenisRef.current) {
        lenisRef.current.destroy();
        lenisRef.current = null;
        window.lenis = null;
      }
      return;
    }

    // Completely bypass Lenis for search engine and LLM crawlers to ensure 100% native crawler accessibility
    const isCrawler = typeof navigator !== "undefined" && /bot|crawler|spider|googlebot|bingbot|yandex|duckduckbot|slurp|baiduspider|facebookexternalhit|twitterbot|linkedinbot|embedly|quora|whatsapp|slackbot|claude|chatgpt|gptbot|perplexity/i.test(navigator.userAgent);
    if (isCrawler) return;

    // Respect user's motion preferences
    const prefersReducedMotion = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    if (typeof window !== "undefined") {
      gsap.registerPlugin(ScrollTrigger);
    }

    // Keep mobile touch scrolling 100% native to avoid touch stutter or viewport locking
    const isMobile = typeof window !== "undefined" && window.matchMedia("(max-width: 768px)").matches;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: !isMobile, // Use smooth wheel on desktop; keep mobile touch native
      wheelMultiplier: 1,
      touchMultiplier: 1,
      syncTouch: false,
      infinite: false,
    });

    lenisRef.current = lenis;

    // Connect Lenis scroll events to GSAP ScrollTrigger
    lenis.on("scroll", ScrollTrigger.update);

    // Sync Lenis with GSAP's internal ticker
    const updateTicker = (time) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateTicker);
    gsap.ticker.lagSmoothing(0);

    // Smooth scroll for anchor tags (#id and /#id) across the site
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
          if (lenisRef.current) {
            lenisRef.current.scrollTo(target, { offset: -80 });
          } else {
            target.scrollIntoView({ behavior: "smooth" });
          }
        }
      }
    };

    document.addEventListener("click", handleAnchorClick);

    // Scroll to initial hash target if present in URL on direct load
    if (typeof window !== "undefined" && window.location.hash) {
      const target = document.querySelector(window.location.hash);
      if (target) {
        setTimeout(() => {
          if (lenisRef.current) {
            lenisRef.current.scrollTo(target, { offset: -80 });
          } else {
            target.scrollIntoView({ behavior: "smooth" });
          }
        }, 150);
      }
    }

    // Expose lenis globally for any component needing custom scrollTo
    window.lenis = lenis;

    return () => {
      document.removeEventListener("click", handleAnchorClick);
      gsap.ticker.remove(updateTicker);
      lenis.destroy();
      lenisRef.current = null;
      window.lenis = null;
    };
  }, [pathname]);

  // Reset scroll to top on route change (unless navigating to a specific hash)
  useEffect(() => {
    if (lenisRef.current && (!pathname || !pathname.startsWith('/admin'))) {
      if (typeof window !== 'undefined' && !window.location.hash) {
        lenisRef.current.scrollTo(0, { immediate: true });
      }
    }
  }, [pathname]);

  return <>{children}</>;
}
