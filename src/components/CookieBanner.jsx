"use client";
import { X, Cookie, Gear } from "@phosphor-icons/react";
import { useState, useEffect } from 'react';
import { getConsentPreferences, setConsentPreferences, getOrSetDeviceId } from '@/utils/cookieManager';

export default function CookieBanner() {
  const [consent, setConsent] = useState(getConsentPreferences());
  const [showBanner, setShowBanner] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Preference form states inside modal
  const [analyticsToggle, setAnalyticsToggle] = useState(false);
  const [marketingToggle, setMarketingToggle] = useState(false);

  useEffect(() => {
    // Ensure rate-limiting device ID cookie is set
    getOrSetDeviceId();

    const currentConsent = getConsentPreferences();
    setConsent(currentConsent);

    // Show banner if choice hasn't been made yet
    if (!currentConsent.chosen) {
      const timer = setTimeout(() => setShowBanner(true), 1000);
      return () => clearTimeout(timer);
    }

    // Listen for custom event to open preferences anytime (e.g. from footer)
    function handleOpenEvent() {
      const fresh = getConsentPreferences();
      setAnalyticsToggle(fresh.analytics || false);
      setMarketingToggle(fresh.marketing || false);
      setShowModal(true);
    }

    window.addEventListener('open_cookie_preferences', handleOpenEvent);
    return () => window.removeEventListener('open_cookie_preferences', handleOpenEvent);
  }, []);

  function handleAcceptAll() {
    const updated = setConsentPreferences({
      essential: true,
      analytics: true,
      marketing: true
    });
    setConsent(updated);
    setShowBanner(false);
    setShowModal(false);
  }

  function handleAcceptEssential() {
    const updated = setConsentPreferences({
      essential: true,
      analytics: false,
      marketing: false
    });
    setConsent(updated);
    setShowBanner(false);
    setShowModal(false);
  }

  function handleSaveCustom() {
    const updated = setConsentPreferences({
      essential: true,
      analytics: analyticsToggle,
      marketing: marketingToggle
    });
    setConsent(updated);
    setShowBanner(false);
    setShowModal(false);
  }

  function openCustomizeModal() {
    const current = getConsentPreferences();
    setAnalyticsToggle(current.analytics || false);
    setMarketingToggle(current.marketing || false);
    setShowModal(true);
  }

  return (
    <>
      {/* Floating Bottom Cookie Banner */}
      {showBanner && !showModal && (
        <div className="fixed bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-auto sm:max-w-md z-50 bg-navy-muted/95 text-surface border border-champagne-light/40 shadow-2xl p-5 sm:p-6 backdrop-blur-xl animate-slide-in">
          <div className="flex items-start gap-3 mb-3">
            <Cookie className="text-champagne-light text-2xl shrink-0 mt-0.5" weight="bold" />
            <div>
              <h3 className="font-bold text-white text-sm sm:text-base">Cookie & Data Privacy Preferences</h3>
              <p className="text-xs text-slate-200 mt-1 leading-relaxed font-medium">
                We use essential cookies for security, anti-spam rate limiting, and core site performance. You can choose whether to enable additional analytical cookies.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 mt-4 pt-3 border-t border-champagne-light/20">
            <button
              onClick={handleAcceptEssential}
              className="px-4 py-2 bg-transparent border border-slate-400 hover:border-white text-slate-200 hover:text-white text-xs font-label-caps uppercase tracking-wider font-bold transition-all cursor-pointer flex-1 text-center"
            >
              Essential Only
            </button>
            <button
              onClick={handleAcceptAll}
              className="px-4 py-2 bg-champagne-light hover:bg-white text-navy-muted text-xs font-label-caps uppercase tracking-wider font-bold transition-all shadow-md cursor-pointer flex-1 text-center"
            >
              Accept All
            </button>
            <button
              onClick={openCustomizeModal}
              className="px-3 py-2 text-champagne-light hover:text-white text-xs font-label-caps uppercase tracking-wider underline cursor-pointer text-center"
            >
              Customize
            </button>
          </div>
        </div>
      )}

      {/* Cookie Customization Preferences Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-margin-mobile">
          <div className="bg-navy-dark text-surface border border-champagne-light/40 w-full max-w-lg p-6 sm:p-8 shadow-2xl animate-fade-in max-h-[90vh] overflow-y-auto">

            <div className="flex justify-between items-start border-b border-champagne-light/30 pb-4 mb-6">
              <div className="flex items-center gap-2">
                <Gear className="text-champagne-light text-2xl" weight="bold" />
                <div>
                  <h2 className="font-headline-md text-xl text-white font-bold">Cookie Preferences</h2>
                  <p className="text-xs text-slate-300 font-medium">Manage how cookies & session data are handled.</p>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="text-2xl" weight="bold" />
              </button>
            </div>

            <div className="flex flex-col gap-5 text-sm">

              {/* Essential Cookies (Always Active) */}
              <div className="p-4 bg-slate-900/90 border border-champagne-light/30 flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-bold text-champagne-light text-sm">Essential & Rate-Limiting Cookies</h4>
                    <span className="text-[10px] font-label-caps uppercase tracking-wider bg-champagne-light/20 text-champagne-light px-2 py-0.5 font-bold">Always Active</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed font-medium">
                    Required for security, IP rate-limiting protection, form submission tokens, and administrative session authentication. Cannot be disabled.
                  </p>
                </div>
              </div>

              {/* Performance & Analytics Cookies */}
              <div className="p-4 bg-slate-900/60 border border-slate-800 flex items-start justify-between gap-4">
                <div>
                  <h4 className="font-bold text-white text-sm mb-1">Performance & Analytics</h4>
                  <p className="text-xs text-slate-300 leading-relaxed font-medium">
                    Allows us to count visits and traffic sources so we can measure and improve performance across sections.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
                  <input
                    type="checkbox"
                    checked={analyticsToggle}
                    onChange={(e) => setAnalyticsToggle(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-champagne-light"></div>
                </label>
              </div>

              {/* Marketing & Personalization Cookies */}
              <div className="p-4 bg-slate-900/60 border border-slate-800 flex items-start justify-between gap-4">
                <div>
                  <h4 className="font-bold text-white text-sm mb-1">Marketing & Functional</h4>
                  <p className="text-xs text-slate-300 leading-relaxed font-medium">
                    Enables enhanced functionality and personalization, such as instant WhatsApp chat session memory.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
                  <input
                    type="checkbox"
                    checked={marketingToggle}
                    onChange={(e) => setMarketingToggle(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-champagne-light"></div>
                </label>
              </div>

            </div>

            <div className="flex justify-end gap-3 pt-6 mt-6 border-t border-slate-800">
              <button
                onClick={handleAcceptEssential}
                className="px-4 py-2 border border-slate-700 hover:border-white text-slate-300 hover:text-white text-xs font-label-caps uppercase tracking-wider font-bold transition-all cursor-pointer"
              >
                Save Essential Only
              </button>
              <button
                onClick={handleSaveCustom}
                className="px-5 py-2 bg-champagne-light hover:bg-white text-navy-muted text-xs font-label-caps uppercase tracking-wider font-bold transition-all shadow-md cursor-pointer"
              >
                Save Preferences
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
