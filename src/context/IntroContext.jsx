"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { usePathname } from "next/navigation";

const IntroContext = createContext({
  introPhase: "completed", // 'loading' | 'transitioning' | 'completed'
  setIntroPhase: () => {},
  isIntroActive: false,
  targetLogoRect: null,
  setTargetLogoRect: () => {},
  targetHeroRect: null,
  setTargetHeroRect: () => {},
});

export function IntroProvider({ children }) {
  const pathname = usePathname();
  const isHome = pathname === "/";

  // When on home page, start with 'loading' so preloader executes every reload/load
  const [introPhase, setIntroPhase] = useState("loading");
  const [targetLogoRect, setTargetLogoRect] = useState(null);
  const [targetHeroRect, setTargetHeroRect] = useState(null);

  useEffect(() => {
    // If not on homepage, complete immediately
    if (!isHome) {
      setIntroPhase("completed");
    } else {
      setIntroPhase("loading");
    }
  }, [pathname, isHome]);

  const isIntroActive = isHome && introPhase !== "completed";

  return (
    <IntroContext.Provider
      value={{
        introPhase,
        setIntroPhase,
        isIntroActive,
        targetLogoRect,
        setTargetLogoRect,
        targetHeroRect,
        setTargetHeroRect,
      }}
    >
      {children}
    </IntroContext.Provider>
  );
}

export function useIntro() {
  return useContext(IntroContext);
}
