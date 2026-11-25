'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Info } from '@phosphor-icons/react';
import { MARKETING_PRICING, formatInr } from '@/lib/pricing';

const num = (n) => String(n).padStart(2, '0');

// Monthly marketing plans on /pricing, laid out like the home page service selector: a numbered
// service list on the left and the selected service's plan ladder on the right. Every panel stays
// in the HTML (inactive ones are visually hidden) so search engines and AI tools can read all prices.
// /pricing#seo-pricing opens a service directly.
export default function MarketingPricingTabs() {
  const [active, setActive] = useState(MARKETING_PRICING[0].id);

  useEffect(() => {
    const open = () => {
      const id = window.location.hash.replace('#', '').replace(/-pricing$/, '');
      if (!MARKETING_PRICING.some(group => group.id === id)) return;
      setActive(id);
      // Wait for fonts and images above to settle so the jump lands on the section.
      setTimeout(() => document.getElementById('marketing-plans')?.scrollIntoView({ block: 'start' }), 350);
    };
    open();
    window.addEventListener('hashchange', open);
    return () => window.removeEventListener('hashchange', open);
  }, []);

  const onKey = (event, index) => {
    const keys = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 };
    if (!(event.key in keys)) return;
    event.preventDefault();
    const next = MARKETING_PRICING[(index + keys[event.key] + MARKETING_PRICING.length) % MARKETING_PRICING.length];
    setActive(next.id);
    document.getElementById(`${next.id}-tab`)?.focus();
  };

  return (
    <section id="marketing-plans" aria-labelledby="marketing-plans-heading" className="py-16 sm:py-24 scroll-mt-24 relative overflow-hidden">
      <div className="absolute top-1/3 left-0 w-[300px] sm:w-[560px] h-[300px] sm:h-[560px] bg-primary/[0.05] rounded-full blur-[110px] pointer-events-none -translate-x-1/2" aria-hidden="true" />

      <div className="relative max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12">
        <div className="mb-10 sm:mb-14 flex flex-col md:flex-row md:items-end justify-between gap-4 md:gap-8">
          <div className="max-w-2xl">
            <span className="text-xs sm:text-sm font-semibold tracking-widest uppercase text-primary mb-3 sm:mb-4 flex items-center gap-3">
              <span className="w-8 sm:w-12 h-[2px] bg-primary" /> Monthly Marketing Plans
            </span>
            <h2 id="marketing-plans-heading" className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-on-surface leading-tight">
              Ads, social media &amp; SEO <span className="text-primary">from ₹2,000/month.</span>
            </h2>
          </div>
          <p className="text-sm sm:text-base text-main-text max-w-md leading-relaxed">
            Pick a service to see its plans. Every plan is billed monthly, and you get a written proposal before work starts.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12">
          {/* Service list */}
          <div role="tablist" aria-label="Marketing services" aria-orientation="vertical" className="lg:col-span-4 grid grid-cols-2 lg:grid-cols-1 gap-3 lg:gap-3.5 content-start lg:sticky lg:top-32 self-start">
            {MARKETING_PRICING.map((group, index) => {
              const selected = group.id === active;
              return (
                <button
                  key={group.id}
                  id={`${group.id}-tab`}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  aria-controls={`${group.id}-pricing`}
                  aria-label={`${group.label}, ${group.packages.length > 1 ? 'from ' : ''}${formatInr(group.packages[0].price)} per month`}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setActive(group.id)}
                  onKeyDown={event => onKey(event, index)}
                  className={`group text-left p-4 sm:p-5 lg:p-6 rounded-2xl border transition-all duration-300 ${
                    selected
                      ? 'bg-surface-container-lowest border-primary/30 shadow-md ring-1 ring-primary/10 lg:translate-x-1'
                      : 'bg-surface border-outline hover:border-outline-variant hover:bg-surface-container-lowest'
                  }`}
                >
                  <span className="flex flex-col lg:flex-row lg:items-center gap-2 lg:gap-5">
                    <span className={`text-2xl lg:text-4xl font-heading font-bold transition-colors ${selected ? 'text-primary' : 'text-text-light/40'}`}>{num(index + 1)}</span>
                    <span className="min-w-0">
                      <span className={`block font-heading font-bold text-base sm:text-lg lg:text-xl leading-tight ${selected ? 'text-on-surface' : 'text-main-text group-hover:text-on-surface'}`}>{group.label}</span>
                      <span className={`block text-xs sm:text-sm mt-1 ${selected ? 'text-main-text' : 'text-text-light'}`}>
                        {group.packages.length > 1 ? 'from ' : ''}<span className="font-semibold">{formatInr(group.packages[0].price)}</span>/month
                      </span>
                    </span>
                  </span>
                </button>
              );
            })}
          </div>

          {/* Plan ladders */}
          <div className="lg:col-span-8">
            {MARKETING_PRICING.map(group => {
              const selected = group.id === active;
              const Wrapper = selected ? motion.div : 'div';
              const motionProps = selected ? { initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } } : {};
              return (
                <Wrapper
                  key={group.id}
                  id={`${group.id}-pricing`}
                  role="tabpanel"
                  aria-labelledby={`${group.id}-tab`}
                  className={selected ? '' : 'sr-only'}
                  {...motionProps}
                >
                  <div className="rounded-3xl bg-surface-container-lowest border border-outline p-5 sm:p-8 lg:p-10 shadow-xl shadow-deep-space/[0.03]">
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-6 sm:pb-8 border-b border-outline">
                      <div>
                        <span className="text-xs font-semibold uppercase tracking-widest text-text-light">{group.eyebrow}</span>
                        <h3 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-bold text-on-surface mt-1.5">{group.title} <span className="text-primary">{formatInr(group.packages[0].price)}/month</span></h3>
                      </div>
                      {group.suffix && <span className="self-start sm:self-auto px-3 py-1.5 rounded-full bg-surface border border-outline text-xs font-semibold text-main-text whitespace-nowrap">Ad spend paid separately</span>}
                    </div>
                    <p className="text-sm sm:text-base text-main-text leading-relaxed mt-6">{group.intro}</p>

                    <ol className="mt-8 space-y-4 sm:space-y-5">
                      {group.packages.map((pkg, index) => {
                        const dark = pkg.popular;
                        const last = index === group.packages.length - 1;
                        return (
                          <li key={pkg.id} className="relative grid grid-cols-1 sm:grid-cols-[2.75rem_1fr] gap-3 sm:gap-5">
                            {/* Ladder rail (tablet and up) */}
                            <span className="relative hidden sm:flex justify-center" aria-hidden="true">
                              <span className={`relative z-10 w-8 h-8 sm:w-11 sm:h-11 rounded-full flex items-center justify-center font-heading font-bold text-xs sm:text-sm ${dark ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'bg-surface border border-outline text-main-text'}`}>{num(index + 1)}</span>
                              {!last && <span className="absolute top-8 sm:top-11 -bottom-5 w-px bg-outline-variant" />}
                            </span>

                            <article className={`rounded-2xl p-5 sm:p-6 overflow-hidden relative ${dark ? 'agency-dark-card text-white' : 'bg-surface border border-outline'}`}>
                              {dark && <div className="absolute -top-16 -right-16 w-48 h-48 bg-primary/40 rounded-full blur-[70px] pointer-events-none" aria-hidden="true" />}
                              <div className="relative flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                                <div className="min-w-0">
                                  <h4 className={`flex flex-wrap items-center gap-2.5 text-lg sm:text-xl font-heading font-bold ${dark ? 'text-white' : 'text-on-surface'}`}>
                                    {pkg.name}
                                    {dark && <span className="px-2.5 py-0.5 rounded-full bg-accent-alt text-deep-space text-[11px] font-bold tracking-wide">Most Popular</span>}
                                  </h4>
                                  <p className={`text-sm mt-1 leading-relaxed ${dark ? 'text-white/70' : 'text-main-text'}`}>{pkg.tagline}</p>
                                </div>
                                <p className="shrink-0 sm:text-right">
                                  <span className={`text-3xl sm:text-4xl font-heading font-bold tracking-tight ${dark ? 'text-white' : 'text-on-surface'}`}>{formatInr(pkg.price)}</span>
                                  <span className={`block text-xs ${dark ? 'text-white/50' : 'text-text-light'}`}>per month{group.suffix ? ` ${group.suffix}` : ''}</span>
                                </p>
                              </div>

                              <ul className="relative grid sm:grid-cols-2 gap-x-6 gap-y-2.5 mt-5 pt-5 border-t border-dashed border-current/10">
                                {pkg.features.map(feature => {
                                  const inherits = feature.startsWith('Everything in');
                                  return (
                                    <li key={feature} className={`flex items-start gap-2.5 text-sm leading-relaxed ${inherits ? 'sm:col-span-2 font-semibold' : ''} ${dark ? 'text-white/85' : 'text-main-text'}`}>
                                      <span className={`w-1.5 h-1.5 rounded-full shrink-0 mt-2 ${inherits ? (dark ? 'bg-accent-alt' : 'bg-deep-space') : (dark ? 'bg-accent' : 'bg-primary')}`} />
                                      <span>{feature}</span>
                                    </li>
                                  );
                                })}
                              </ul>

                              <Link
                                href={`/start-project?service=${group.service}`}
                                tabIndex={selected ? 0 : -1}
                                className={`group/cta relative mt-6 inline-flex items-center gap-2 font-semibold text-sm px-5 py-3 rounded-xl transition-colors ${
                                  dark ? 'bg-white text-deep-space hover:bg-accent' : 'bg-deep-space text-white hover:bg-primary'
                                }`}
                              >
                                Get Started <ArrowRight size={15} weight="bold" className="group-hover/cta:translate-x-1 transition-transform" />
                              </Link>
                            </article>
                          </li>
                        );
                      })}
                    </ol>

                    <ul className="mt-8 pt-6 border-t border-outline space-y-2.5">
                      {group.notes.map(note => (
                        <li key={note} className="flex items-start gap-2.5 text-xs sm:text-sm text-main-text leading-relaxed">
                          <Info size={16} className="text-primary shrink-0 mt-0.5" aria-hidden="true" />
                          <span>{note}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Wrapper>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
