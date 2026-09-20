"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useIntro } from "@/context/IntroContext";
import heroImg from "@/assets/hero-section.webp";

// 100% Deterministic particle array to eliminate any SSR hydration mismatch
const STATIC_PARTICLES = [
  { id: 0, x: 18, y: 22, size: 4, color: "#10B981", duration: 6, delay: 0.2 },
  { id: 1, x: 82, y: 15, size: 5, color: "#8B5CF6", duration: 7, delay: 0.5 },
  { id: 2, x: 28, y: 75, size: 3.5, color: "#10B981", duration: 5.5, delay: 1.0 },
  { id: 3, x: 74, y: 68, size: 4.5, color: "#8B5CF6", duration: 6.5, delay: 0.8 },
  { id: 4, x: 12, y: 48, size: 5, color: "#8B5CF6", duration: 8, delay: 1.2 },
  { id: 5, x: 88, y: 42, size: 3.5, color: "#10B981", duration: 7.2, delay: 0.3 },
  { id: 6, x: 45, y: 18, size: 4, color: "#8B5CF6", duration: 6.8, delay: 1.5 },
  { id: 7, x: 55, y: 82, size: 4.5, color: "#10B981", duration: 5.8, delay: 0.7 },
  { id: 8, x: 35, y: 35, size: 3, color: "#10B981", duration: 7.5, delay: 1.8 },
  { id: 9, x: 65, y: 30, size: 4.2, color: "#8B5CF6", duration: 6.2, delay: 0.4 },
  { id: 10, x: 22, y: 88, size: 5, color: "#8B5CF6", duration: 7.8, delay: 1.1 },
  { id: 11, x: 78, y: 85, size: 3.8, color: "#10B981", duration: 6.4, delay: 1.6 },
];

export default function Preloader() {
  const { introPhase, setIntroPhase, isIntroActive } = useIntro();

  const [mounted, setMounted] = useState(false);
  const [percent, setPercent] = useState(0);
  const [logoTarget, setLogoTarget] = useState(null);
  const [heroTarget, setHeroTarget] = useState(null);
  const [windowDims, setWindowDims] = useState({ width: 1440, height: 900 });

  // Measure live target positions in header and hero section
  const measureTargets = () => {
    if (typeof window === "undefined") return;

    const logoElem = document.getElementById("header-logo-image");
    const heroElem = document.getElementById("hero-image-element") || document.getElementById("hero-image-target");

    if (logoElem) {
      const rect = logoElem.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        setLogoTarget({
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
          width: rect.width,
          height: rect.height,
        });
      }
    }

    if (heroElem) {
      const rect = heroElem.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        setHeroTarget({
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
          width: rect.width,
          height: rect.height,
        });
      }
    }
  };

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      setWindowDims({ width: window.innerWidth, height: window.innerHeight });
      const handleResize = () => {
        setWindowDims({ width: window.innerWidth, height: window.innerHeight });
        measureTargets();
      };
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  // Phase 1: Real-time Page Loading & Smooth Counter
  useEffect(() => {
    if (!isIntroActive || !mounted) return;

    measureTargets();
    const measureInterval = setInterval(measureTargets, 200);

    let docLoaded = typeof document !== "undefined" && document.readyState === "complete";
    const handleLoad = () => {
      docLoaded = true;
    };

    if (!docLoaded && typeof window !== "undefined") {
      window.addEventListener("load", handleLoad);
    }

    let currentPercent = 0;
    let animationFrameId;
    const startTime = performance.now();
    const minDuration = 1400; // Smooth baseline duration

    const updateProgress = (currentTime) => {
      const elapsed = currentTime - startTime;

      if (!docLoaded) {
        // While page is loading resources, advance smoothly up to ~88%
        const targetPercent = Math.min(88, Math.floor((elapsed / 1200) * 88));
        if (currentPercent < targetPercent) {
          currentPercent += 1;
          setPercent(currentPercent);
        }
      } else {
        // When document is fully loaded, smoothly reach 100%
        const progress = Math.min(elapsed / minDuration, 1);
        const eased = 1 - Math.pow(1 - progress, 2.5);
        const targetPercent = Math.min(100, Math.max(currentPercent + 1, Math.floor(eased * 100)));
        currentPercent = targetPercent;
        setPercent(currentPercent);
      }

      if (currentPercent < 100) {
        animationFrameId = requestAnimationFrame(updateProgress);
      } else {
        clearInterval(measureInterval);
        if (typeof window !== "undefined") {
          window.removeEventListener("load", handleLoad);
        }
        measureTargets();

        // Trigger Phase 2: Seamless Physical Transition to Header & Hero
        setTimeout(() => {
          measureTargets();
          setIntroPhase("transitioning");

          // Phase 3: Final handoff completion
          setTimeout(() => {
            setIntroPhase("completed");
          }, 1400);
        }, 150);
      }
    };

    animationFrameId = requestAnimationFrame(updateProgress);

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      clearInterval(measureInterval);
      if (typeof window !== "undefined") {
        window.removeEventListener("load", handleLoad);
      }
    };
  }, [isIntroActive, mounted, setIntroPhase]);

  if (!isIntroActive) return null;

  const isTransitioning = introPhase === "transitioning";
  const isCompleted = introPhase === "completed";

  // Center starting coordinates
  const centerX = windowDims.width / 2;
  const startLogoY = windowDims.height < 700 ? windowDims.height * 0.12 : windowDims.height * 0.14;
  const startLogoScale = windowDims.width < 640 ? 0.9 : 1.05;

  // Hero dimensions & coordinates
  const heroWidth = heroTarget ? heroTarget.width : (windowDims.width < 640 ? 280 : windowDims.width < 1024 ? 360 : 440);
  const heroHeight = heroTarget ? heroTarget.height : (windowDims.width < 640 ? 340 : windowDims.width < 1024 ? 420 : 500);
  const startHeroX = centerX - heroWidth / 2;
  const startHeroY = (windowDims.height < 700 ? windowDims.height * 0.43 : windowDims.height * 0.44) - heroHeight / 2;
  const startHeroScale = windowDims.width < 640 ? 0.72 : 0.8;

  // Final landing targets (with smart responsive fallbacks if not yet measured)
  const finalLogoX = logoTarget ? logoTarget.x : (windowDims.width < 640 ? 80 : 120);
  const finalLogoY = logoTarget ? logoTarget.y : (windowDims.width < 1024 ? 35 : 55);
  const finalLogoScale = logoTarget ? Math.max(0.48, logoTarget.width / 210) : (windowDims.width < 640 ? 0.48 : 0.65);

  const finalHeroX = heroTarget ? heroTarget.x : (windowDims.width > 1024 ? windowDims.width * 0.75 : windowDims.width * 0.5);
  const finalHeroY = heroTarget ? heroTarget.y : (windowDims.width > 1024 ? windowDims.height * 0.5 : windowDims.height * 0.35);
  const targetHeroX = finalHeroX - heroWidth / 2;
  const targetHeroY = finalHeroY - heroHeight / 2;
  const targetHeroScale = 1.0;

  return (
    <div
      className={`fixed inset-0 z-[9999] pointer-events-none select-none ${
        isCompleted ? "hidden" : "block"
      }`}
      aria-hidden="true"
    >
      {/* ═══ CLEAN OFF-WHITE DISSOLVE VEIL ═══ */}
      <motion.div
        className="absolute inset-0 bg-[#F8F9FA]"
        initial={{ opacity: 1 }}
        animate={{ opacity: isTransitioning ? 0 : 1 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Soft Ambient Brand Mesh (Green & Purple) */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Top-Right Purple Aura */}
          <motion.div
            className="absolute -top-20 -right-20 w-[450px] sm:w-[650px] h-[450px] sm:h-[650px] bg-[#8B5CF6]/12 rounded-full blur-[100px] sm:blur-[140px] pointer-events-none"
            animate={{
              scale: [1, 1.08, 1],
              x: [0, -15, 0],
              y: [0, 15, 0],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Bottom-Left Green Aura */}
          <motion.div
            className="absolute -bottom-20 -left-20 w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] bg-[#10B981]/12 rounded-full blur-[90px] sm:blur-[130px] pointer-events-none"
            animate={{
              scale: [1, 1.1, 1],
              x: [0, 15, 0],
              y: [0, -15, 0],
            }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          />

          {/* Drifting subtle ambient spark particles (deterministic, zero hydration error) */}
          {STATIC_PARTICLES.map((p) => (
            <motion.div
              key={p.id}
              className="absolute rounded-full pointer-events-none"
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
                width: `${p.size}px`,
                height: `${p.size}px`,
                backgroundColor: p.color,
                opacity: 0.35,
              }}
              animate={{
                y: [0, -30, -60],
                opacity: [0, 0.45, 0],
                scale: [0.8, 1.2, 0.8],
              }}
              transition={{
                duration: p.duration,
                repeat: Infinity,
                delay: p.delay,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      </motion.div>

      {/* ═══ CONTINUOUS FLYING LOGO: light-web-logo.webp CONVERTS TO dark-web-logo.webp ═══ */}
      <motion.div
        className="fixed z-[10001] origin-center flex items-center justify-center pointer-events-none"
        style={{
          width: "210px",
          height: "60px",
          left: 0,
          top: 0,
        }}
        initial={{
          x: centerX - 105,
          y: startLogoY - 30,
          scale: startLogoScale,
          opacity: 0,
        }}
        animate={
          isTransitioning
            ? {
                x: finalLogoX - 105,
                y: finalLogoY - 30,
                scale: finalLogoScale,
                opacity: 1,
              }
            : {
                x: centerX - 105,
                y: startLogoY - 30,
                scale: startLogoScale,
                opacity: 1,
              }
        }
        transition={{
          duration: isTransitioning ? 1.35 : 0.6,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        {/* Soft Ambient Halo behind the logo in preloader */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-[#10B981]/20 via-[#8B5CF6]/25 to-[#6D28D9]/20 rounded-full blur-2xl pointer-events-none"
          animate={{
            opacity: isTransitioning ? 0 : 0.85,
            scale: isTransitioning ? 0.5 : [0.92, 1.08, 0.92],
          }}
          transition={{
            opacity: { duration: 0.5 },
            scale: { duration: 3.5, repeat: Infinity, ease: "easeInOut" },
          }}
        />

        {/* 1. Light Web Logo (Used on clean light preloader, smoothly fades out during flight to dark header) */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={{ opacity: isTransitioning ? 0 : 1 }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
        >
          <Image
            src="/light-web-logo.webp"
            alt="InfronixWeb Light Logo"
            width={210}
            height={60}
            priority
            style={{ width: "auto", height: "auto" }}
            className="h-10 sm:h-12 md:h-14 w-auto object-contain drop-shadow-sm"
          />
        </motion.div>

        {/* 2. Dark Web Logo (Smoothly fades in during flight as it arrives at the dark header navbar) */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: isTransitioning ? 1 : 0 }}
          transition={{ duration: 0.75, delay: 0.15, ease: "easeInOut" }}
        >
          <Image
            src="/dark-web-logo.webp"
            alt="InfronixWeb Dark Logo"
            width={210}
            height={60}
            priority
            style={{ width: "auto", height: "auto" }}
            className="h-10 sm:h-12 md:h-14 w-auto object-contain drop-shadow-sm"
          />
        </motion.div>
      </motion.div>

      {/* ═══ CONTINUOUS HERO PHOTO (Visible from 0% and physically glides to Hero at 100%) ═══ */}
      <motion.div
        className="fixed z-[10000] origin-center flex items-center justify-center pointer-events-none"
        style={{
          width: `${heroWidth}px`,
          height: `${heroHeight}px`,
          left: 0,
          top: 0,
        }}
        initial={{
          x: startHeroX,
          y: startHeroY + 20,
          scale: startHeroScale * 0.92,
          opacity: 0,
        }}
        animate={
          isTransitioning
            ? {
                x: targetHeroX,
                y: targetHeroY,
                scale: targetHeroScale,
                rotate: 0,
                opacity: 1,
              }
            : {
                x: startHeroX,
                y: startHeroY,
                scale: startHeroScale,
                rotate: 0,
                opacity: 1,
              }
        }
        transition={{
          duration: isTransitioning ? 1.35 : 0.7,
          ease: isTransitioning ? [0.16, 1, 0.3, 1] : [0.22, 1, 0.36, 1],
        }}
      >
        {/* Soft glowing ambient aura behind hero image during preloader */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-tr from-[#10B981]/20 via-[#8B5CF6]/25 to-[#6D28D9]/20 rounded-full blur-3xl pointer-events-none"
          animate={{
            scale: isTransitioning ? 0.7 : [0.95, 1.05, 0.95],
            opacity: isTransitioning ? 0 : [0.4, 0.65, 0.4],
          }}
          transition={{
            scale: isTransitioning ? { duration: 0.6 } : { duration: 4, repeat: Infinity, ease: "easeInOut" },
            opacity: isTransitioning ? { duration: 0.5 } : { duration: 4, repeat: Infinity, ease: "easeInOut" },
          }}
        />

        <Image
          src={heroImg}
          alt="InfronixWeb Digital Marketing Hero"
          className="w-full h-auto max-h-[360px] sm:max-h-[440px] lg:max-h-[500px] object-contain drop-shadow-2xl relative z-10"
          priority={true}
          fetchPriority="high"
        />
      </motion.div>

      {/* ═══ CLEAN PRELOADER TEXT & PROGRESS BAR ═══ */}
      <AnimatePresence>
        {!isTransitioning && (
          <motion.div
            className="fixed inset-x-0 bottom-6 sm:bottom-10 md:bottom-12 z-[10000] flex flex-col items-center justify-center text-center px-4"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15, transition: { duration: 0.35, ease: "easeOut" } }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            {/* Tagline */}
            <p className="font-heading text-xs sm:text-sm font-semibold tracking-[0.25em] sm:tracking-[0.35em] text-slate-700 uppercase mb-3.5 sm:mb-4 flex items-center gap-2 sm:gap-3">
              <span>INNOVATE</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
              <span>AUTOMATE</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6]" />
              <span>ELEVATE</span>
            </p>

            {/* Status & Numeric Counter */}
            <div className="w-64 sm:w-80 md:w-96 flex items-center justify-between text-xs sm:text-sm mb-2 font-mono">
              <span className="text-slate-500 font-medium tracking-wider uppercase text-[10px] sm:text-xs">
                LOADING EXPERIENCE
              </span>
              <span className="font-bold text-[#6D28D9] tabular-nums">
                {percent.toString().padStart(2, "0")}%
              </span>
            </div>

            {/* Green-to-Purple Gradient Progress Bar */}
            <div className="w-64 sm:w-80 md:w-96 h-[3.5px] bg-slate-200/80 rounded-full overflow-hidden relative shadow-inner">
              <motion.div
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#10B981] via-[#8B5CF6] to-[#6D28D9] rounded-full origin-left"
                style={{ width: `${percent}%` }}
                transition={{ ease: "easeOut", duration: 0.1 }}
              />
              {/* Subtle glowing leading edge dot */}
              <div
                className="absolute top-0 h-full w-2 bg-white/90 blur-[1px] transform -translate-x-full transition-all duration-75"
                style={{ left: `${percent}%` }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
