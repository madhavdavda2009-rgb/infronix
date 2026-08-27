"use client";
import { ArrowRight, RocketLaunch, Users, TrendUp } from "@phosphor-icons/react";
export default function AboutSection() {
  return (
    <section id="about" className="w-full py-16 md:py-24 bg-surface relative z-20" aria-labelledby="about-title">
      <div className="max-w-[1280px] mx-auto px-margin-mobile md:px-margin-desktop">

        {/* Section Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 md:mb-12 border-b border-outline-variant pb-4 md:pb-6 gap-4">
          <div>
            <span className="font-label-caps text-xs text-secondary tracking-widest uppercase mb-2 block font-bold">Who We Are</span>
            <h2 id="about-title" className="font-headline-lg text-2xl sm:text-3xl md:text-4xl text-primary font-bold">About infronix</h2>
          </div>
          <a className="font-label-caps text-xs uppercase tracking-widest text-secondary hover:text-primary transition-colors flex items-center gap-1 font-bold" href="/#contact">
            <span>Get in touch</span>
            <ArrowRight aria-hidden="true" className="text-[16px]" weight="bold" />
          </a>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">

          {/* Card 1 */}
          <div className="bg-surface rounded-none p-6 md:p-8 flex flex-col gap-4 relative group overflow-hidden border border-outline-variant hover:border-champagne-light transition-all shadow-sm hover:shadow-md">
            <div className="absolute top-0 left-0 w-full h-[2px] bg-champagne-light"></div>
            <div className="w-14 h-14 border border-champagne-light/50 flex items-center justify-center mb-1 bg-surface-container-lowest">
              <RocketLaunch aria-hidden="true" className="text-secondary text-2xl font-light" weight="bold" />
            </div>
            <h3 className="font-headline-md text-xl md:text-2xl text-primary font-bold">Our Mission</h3>
            <p className="font-body-md text-sm text-on-surface-variant flex-grow leading-relaxed font-medium">
              Technology should be as beautiful as it is functional. We build high-performance digital products that drive real business growth.
            </p>
            <div className="mt-4 pt-4 border-t border-outline-variant w-full flex items-center justify-between">
              <div className="flex gap-2 flex-wrap">
                <span className="bg-surface-container-high text-on-surface px-2.5 py-1 rounded-none font-label-caps text-[10px] font-semibold">Vision</span>
                <span className="bg-surface-container-high text-on-surface px-2.5 py-1 rounded-none font-label-caps text-[10px] font-semibold">Purpose</span>
              </div>
              <ArrowRight aria-hidden="true" className="text-secondary opacity-0 group-hover:opacity-100 transition-opacity" weight="bold" />
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-surface rounded-none p-6 md:p-8 flex flex-col gap-4 relative group overflow-hidden border border-outline-variant hover:border-champagne-light transition-all shadow-sm hover:shadow-md">
            <div className="w-14 h-14 border border-champagne-light/50 flex items-center justify-center mb-1 bg-surface-container-lowest">
              <Users aria-hidden="true" className="text-secondary text-2xl font-light" weight="bold" />
            </div>
            <h3 className="font-headline-md text-xl md:text-2xl text-primary font-bold">Our Team</h3>
            <p className="font-body-md text-sm text-on-surface-variant flex-grow leading-relaxed font-medium">
              A collective of designers, engineers, and strategists passionate about bridging creative vision with technical reality.
            </p>
            <div className="mt-4 pt-4 border-t border-outline-variant w-full flex items-center justify-between">
              <div className="flex gap-2 flex-wrap">
                <span className="bg-surface-container-high text-on-surface px-2.5 py-1 rounded-none font-label-caps text-[10px] font-semibold">Design</span>
                <span className="bg-surface-container-high text-on-surface px-2.5 py-1 rounded-none font-label-caps text-[10px] font-semibold">Engineering</span>
              </div>
              <ArrowRight aria-hidden="true" className="text-secondary opacity-0 group-hover:opacity-100 transition-opacity" weight="bold" />
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-surface rounded-none p-6 md:p-8 flex flex-col gap-4 relative group overflow-hidden border border-outline-variant hover:border-champagne-light transition-all shadow-sm hover:shadow-md md:col-span-2 lg:col-span-1">
            <div className="w-14 h-14 border border-champagne-light/50 flex items-center justify-center mb-1 bg-surface-container-lowest">
              <TrendUp aria-hidden="true" className="text-secondary text-2xl font-light" weight="bold" />
            </div>
            <h3 className="font-headline-md text-xl md:text-2xl text-primary font-bold">Our Approach</h3>
            <p className="font-body-md text-sm text-on-surface-variant flex-grow leading-relaxed font-medium">
              Scalable applications, stunning brand identities, and seamless user experiences — delivered with comprehensive documentation and support.
            </p>
            <div className="mt-4 pt-4 border-t border-outline-variant w-full flex items-center justify-between">
              <div className="flex gap-2 flex-wrap">
                <span className="bg-surface-container-high text-on-surface px-2.5 py-1 rounded-none font-label-caps text-[10px] font-semibold">Strategy</span>
                <span className="bg-surface-container-high text-on-surface px-2.5 py-1 rounded-none font-label-caps text-[10px] font-semibold">Results</span>
              </div>
              <ArrowRight aria-hidden="true" className="text-secondary opacity-0 group-hover:opacity-100 transition-opacity" weight="bold" />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
