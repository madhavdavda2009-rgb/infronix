"use client";
import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { useIntro } from '@/context/IntroContext';

export default function Preloader() {
  const { introPhase, setIntroPhase, isIntroActive } = useIntro();
  const reduceMotion = useReducedMotion();
  const logoRef = useRef(null);
  const [target, setTarget] = useState(null);
  const transitioning = introPhase === 'transitioning';

  const measureTarget = useCallback(() => {
    const header = document.getElementById('header-logo-image');
    const logo = logoRef.current;
    if (!header || !logo) return;
    const rect = header.getBoundingClientRect();
    const width = logo.offsetWidth;
    if (!rect.width || !width) return;
    setTarget({
      x: rect.left + rect.width / 2 - window.innerWidth / 2,
      y: rect.top + rect.height / 2 - window.innerHeight / 2,
      scale: rect.width / width,
    });
  }, []);

  useEffect(() => {
    if (!isIntroActive) return;
    measureTarget();
    window.addEventListener('resize', measureTarget);
    window.addEventListener('scroll', measureTarget, { passive: true });
    return () => {
      window.removeEventListener('resize', measureTarget);
      window.removeEventListener('scroll', measureTarget);
    };
  }, [isIntroActive, measureTarget]);

  useEffect(() => {
    if (!isIntroActive || introPhase !== 'loading') return;
    if (reduceMotion) { setIntroPhase('completed'); return; }
    const started = performance.now();
    let scheduled = false;
    let revealTimer;
    const reveal = () => {
      if (scheduled) return;
      scheduled = true;
      revealTimer = setTimeout(() => {
        measureTarget();
        setIntroPhase('transitioning');
      }, Math.max(0, 500 - (performance.now() - started)));
    };
    if (document.readyState === 'complete') reveal();
    else window.addEventListener('load', reveal, { once: true });
    // A slow third-party resource must never trap visitors behind the intro.
    const fallbackTimer = setTimeout(reveal, 6000);
    return () => {
      clearTimeout(revealTimer);
      clearTimeout(fallbackTimer);
      window.removeEventListener('load', reveal);
    };
  }, [isIntroActive, introPhase, reduceMotion, measureTarget, setIntroPhase]);

  useEffect(() => {
    if (!isIntroActive || !transitioning) return;
    const timer = setTimeout(() => setIntroPhase('completed'), 850);
    return () => clearTimeout(timer);
  }, [isIntroActive, transitioning, setIntroPhase]);

  // Keep the initial server and browser markup identical. The effect above
  // completes the intro immediately for visitors who prefer reduced motion.
  if (!isIntroActive) return null;

  return (
    <div data-site-intro className="fixed inset-0 z-[9999] pointer-events-none select-none" aria-hidden="true">
      <motion.div
        className="absolute inset-0 bg-surface"
        initial={{ opacity: 1 }}
        animate={{ opacity: transitioning ? 0 : 1 }}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      />
      <div ref={logoRef} className="absolute left-1/2 top-1/2 w-[min(70vw,320px)] -translate-x-1/2 -translate-y-1/2">
        <motion.div
          className="relative aspect-[132/31] origin-center"
          initial={{ opacity: 0, y: 8 }}
          animate={{
            opacity: transitioning && !target ? 0 : 1,
            x: transitioning && target ? target.x : 0,
            y: transitioning && target ? target.y : 0,
            scale: transitioning && target ? target.scale : 1,
          }}
          transition={{ duration: transitioning ? 0.8 : 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div className="absolute inset-0" animate={{ opacity: transitioning ? 0 : 1 }} transition={{ duration: 0.45 }}>
            <Image src="/brand-light.webp" alt="" fill sizes="(max-width: 460px) 70vw, 320px" className="object-contain" priority />
          </motion.div>
          <motion.div className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: transitioning ? 1 : 0 }} transition={{ duration: 0.55, delay: 0.1 }}>
            <Image src="/brand-dark.webp" alt="" fill sizes="(max-width: 460px) 70vw, 320px" className="object-contain" priority />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
