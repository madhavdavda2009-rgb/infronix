"use client";
import { X, Cookie, Gear } from "@phosphor-icons/react";
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { getConsentPreferences, setConsentPreferences, getOrSetDeviceId } from '@/utils/cookieManager';

export default function CookieBanner() {
  const pathname = usePathname();
  const [consent, setConsent] = useState(getConsentPreferences());
  const [showBanner, setShowBanner] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Preference form states inside modal
  const [analyticsToggle, setAnalyticsToggle] = useState(false);
  const [marketingToggle, setMarketingToggle] = useState(false);

  if (pathname?.startsWith('/admin') || pathname?.startsWith('/founder-os')) {
    return null;
  }

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
        <div className="fixed bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-auto sm:max-w-md z-50 bg-surface-container-lowest text-on-surface border border-outline shadow-2xl p-5 sm:p-6 rounded-2xl animate-slide-in">
          <div className="flex items-start gap-3 mb-3">
            <div className="bg-primary/10 p-2 rounded-full shrink-0">
              <Cookie className="text-primary text-xl" weight="duotone" />
            </div>
            <div>
              <h3 className="font-bold text-on-surface text-sm sm:text-base">Cookie & Data Privacy Preferences</h3>
              <p className="text-xs text-main-text mt-1 leading-relaxed font-medium">
                We use essential cookies for security and core site performance. You can choose whether to enable additional analytical cookies.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 mt-4 pt-4 border-t border-outline-variant">
            <button
              onClick={handleAcceptEssential}
              className="px-4 py-2 bg-surface hover:bg-outline-variant border border-outline-variant text-main-text hover:text-on-surface text-xs font-label-caps uppercase tracking-wider font-bold transition-all cursor-pointer flex-1 text-center rounded-md"
            >
              Essential Only
            </button>
            <button
              onClick={handleAcceptAll}
              className="px-4 py-2 bg-primary hover:bg-primary-dark text-ink-black text-xs font-label-caps uppercase tracking-wider font-bold transition-all shadow-md cursor-pointer flex-1 text-center rounded-md"
            >
              Accept All
            </button>
            <button
              onClick={openCustomizeModal}
              className="px-3 py-2 text-main-text hover:text-primary text-xs font-label-caps uppercase tracking-wider underline cursor-pointer text-center"
            >
              Customize
            </button>
          </div>
        </div>
      )}

      {/* Cookie Customization Preferences Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[60] bg-deep-space/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6">
          <div className="bg-surface-container-lowest text-on-surface border border-outline-variant rounded-2xl w-full max-w-lg p-6 sm:p-8 shadow-2xl animate-fade-in max-h-[90vh] overflow-y-auto">

            <div className="flex justify-between items-start border-b border-outline-variant pb-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Gear className="text-primary text-xl" weight="duotone" />
                </div>
                <div>
                  <h2 className="font-headline-md text-xl text-on-surface font-bold">Cookie Preferences</h2>
                  <p className="text-xs text-main-text font-medium">Manage how cookies & session data are handled.</p>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-text-light hover:text-on-surface transition-colors cursor-pointer bg-surface hover:bg-outline-variant p-1.5 rounded-full"
                aria-label="Close modal"
              >
                <X className="text-xl" weight="bold" />
              </button>
            </div>

            <div className="flex flex-col gap-4 text-sm">

              {/* Essential Cookies (Always Active) */}
              <div className="p-4 bg-surface rounded-xl border border-outline-variant flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-bold text-on-surface text-sm">Essential Cookies</h4>
                    <span className="text-[10px] font-label-caps uppercase tracking-wider bg-primary/20 text-primary-dark px-2 py-0.5 rounded-sm font-bold">Always Active</span>
                  </div>
                  <p className="text-xs text-main-text leading-relaxed font-medium">
                    Required for security, IP rate-limiting protection, form submission tokens, and administrative session authentication. Cannot be disabled.
                  </p>
                </div>
              </div>

              {/* Performance & Analytics Cookies */}
              <div className="p-4 bg-surface rounded-xl border border-outline-variant/60 flex items-start justify-between gap-4">
                <div>
                  <h4 className="font-bold text-on-surface text-sm mb-1">Performance & Analytics</h4>
                  <p className="text-xs text-main-text leading-relaxed font-medium">
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
                  <div className="w-11 h-6 bg-outline-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-surface-container-lowest after:border-outline after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>

              {/* Marketing & Personalization Cookies */}
              <div className="p-4 bg-surface rounded-xl border border-outline-variant/60 flex items-start justify-between gap-4">
                <div>
                  <h4 className="font-bold text-on-surface text-sm mb-1">Marketing & Functional</h4>
                  <p className="text-xs text-main-text leading-relaxed font-medium">
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
                  <div className="w-11 h-6 bg-outline-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-surface-container-lowest after:border-outline after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>

            </div>

            <div className="flex justify-end gap-3 pt-6 mt-6 border-t border-outline-variant">
              <button
                onClick={handleAcceptEssential}
                className="px-4 py-2 bg-surface hover:bg-outline-variant border border-outline-variant text-main-text hover:text-on-surface text-xs font-label-caps uppercase tracking-wider font-bold transition-all cursor-pointer rounded-md"
              >
                Essential Only
              </button>
              <button
                onClick={handleSaveCustom}
                className="px-5 py-2 bg-primary hover:bg-primary-dark text-ink-black text-xs font-label-caps uppercase tracking-wider font-bold transition-all shadow-md cursor-pointer rounded-md"
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
