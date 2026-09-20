"use client";

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

export default function Preloader() {
  const [shouldRender, setShouldRender] = useState(false);
  const [percent, setPercent] = useState(0);
  const [phase, setPhase] = useState('initial'); // 'initial' | 'loading' | 'exiting' | 'done'
  const containerRef = useRef(null);

  useEffect(() => {
    // Completely bypass preloader for search engine & LLM crawlers
    const isBot = typeof navigator !== 'undefined' && /bot|crawler|spider|googlebot|bingbot|yandex|duckduckbot|slurp|baiduspider|facebookexternalhit|twitterbot|linkedinbot|embedly|quora|whatsapp|slackbot|claude|chatgpt|gptbot|perplexity/i.test(navigator.userAgent);
    if (isBot) return;

    // Respect reduced motion
    const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    // Only run on initial session load
    const hasPlayed = localStorage.getItem('infronix_preloader_played');
    if (!hasPlayed) {
      setShouldRender(true);
      localStorage.setItem('infronix_preloader_played', 'true');
    }
  }, []);

  useEffect(() => {
    if (!shouldRender) return;

    setPhase('loading');
    let start = null;
    const duration = 1800; // 1.8s smooth loading

    let animationFrameId;

    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      // Ease out cubic
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      setPercent(Math.round(easedProgress * 100));

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step);
      } else {
        setPhase('exiting');
        setTimeout(() => {
          setShouldRender(false);
          setPhase('done');
        }, 600);
      }
    };

    animationFrameId = requestAnimationFrame(step);

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [shouldRender]);

  if (!shouldRender || phase === 'done') return null;

  const isExiting = phase === 'exiting';

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 z-[9999] bg-deep-space flex flex-col justify-between p-8 md:p-16 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        isExiting ? '-translate-y-full pointer-events-none' : 'translate-y-0'
      }`}
      aria-hidden="true"
    >
      <div className={`flex-grow flex flex-col items-center justify-center text-center transition-opacity duration-300 ${isExiting ? 'opacity-0' : 'opacity-100'}`}>
        <div className="mb-6 flex justify-center">
          <Image
            src="/dark-web-logo.webp"
            alt="InfronixWeb Logo"
            width={220}
            height={70}
            priority
            style={{ width: 'auto', height: 'auto' }}
            className="h-24 sm:h-32 md:h-40 lg:h-48 w-auto object-contain drop-shadow-lg"
          />
        </div>
        <p className="font-label-caps text-xs sm:text-sm text-accent tracking-[0.3em] uppercase font-bold">
          Introducing the InfronixWeb Digital Marketing
        </p>
      </div>

      <div className={`w-full flex flex-col gap-4 transition-opacity duration-300 ${isExiting ? 'opacity-0' : 'opacity-100'}`}>
        <div className="flex justify-between items-end">
          <span className="font-label-caps text-[10px] sm:text-xs text-slate-400 tracking-widest uppercase font-bold animate-pulse">
            Loading your experience...
          </span>
          <span
            className="font-headline-lg text-2xl sm:text-4xl text-accent font-bold"
            style={{ fontVariantNumeric: 'tabular-nums' }}
          >
            {percent.toString().padStart(2, '0')}%
          </span>
        </div>

        <div className="w-full h-[2px] bg-surface-container-lowest/10 relative overflow-hidden">
          <div
            className="absolute top-0 left-0 w-full h-full bg-accent origin-left transition-transform duration-75 ease-out will-change-transform"
            style={{ transform: `scaleX(${percent / 100})` }}
          />
        </div>
      </div>
    </div>
  );
}
