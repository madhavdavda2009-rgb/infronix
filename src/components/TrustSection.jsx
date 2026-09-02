"use client";
import { Headset, Books, Handshake } from "@phosphor-icons/react";
export default function TrustSection() {
  return (
    <section id="trust" className="w-full py-16 md:py-24 bg-navy-muted text-surface" aria-labelledby="trust-title">
      <div className="max-w-[1280px] mx-auto px-margin-mobile md:px-margin-desktop grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
        <div className="flex flex-col gap-6">
          <div>
            <span className="font-label-caps text-xs text-champagne-light tracking-widest uppercase block font-bold mb-2">Why Choose Us</span>
            <h2 id="trust-title" className="font-headline-lg text-2xl sm:text-3xl md:text-4xl text-surface font-bold">Professionalism & Client Support</h2>
          </div>
          <p className="font-body-md text-sm sm:text-base text-slate-200 leading-relaxed font-medium">
            We deliver more than just code. What we offer is unparalleled client support, professional-grade development, and comprehensive technical documentation. We partner with you transparently to ensure absolute project success.
          </p>

          <div className="flex flex-col gap-6 mt-2">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 border border-champagne-light flex items-center justify-center flex-shrink-0 bg-navy-dark/40" aria-hidden="true">
                <Headset className="text-champagne-light text-2xl" weight="bold" />
              </div>
              <div>
                <h3 className="font-headline-md text-lg sm:text-xl text-surface font-bold">Dedicated Client Support</h3>
                <p className="font-body-md text-xs sm:text-sm text-slate-200 mt-1 leading-relaxed font-medium">
                  Responsive communication and proactive maintenance to ensure your platform operates flawlessly around the clock.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 border border-champagne-light flex items-center justify-center flex-shrink-0 bg-navy-dark/40" aria-hidden="true">
                <Books className="text-champagne-light text-2xl" weight="bold" />
              </div>
              <div>
                <h3 className="font-headline-md text-lg sm:text-xl text-surface font-bold">Detailed Documentation</h3>
                <p className="font-body-md text-xs sm:text-sm text-slate-200 mt-1 leading-relaxed font-medium">
                  Clean, scalable codebases accompanied by comprehensive technical guides for seamless onboarding and future growth.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 border border-champagne-light flex items-center justify-center flex-shrink-0 bg-navy-dark/40" aria-hidden="true">
                <Handshake className="text-champagne-light text-2xl" weight="bold" />
              </div>
              <div>
                <h3 className="font-headline-md text-lg sm:text-xl text-surface font-bold">Transparent Workflow</h3>
                <p className="font-body-md text-xs sm:text-sm text-slate-200 mt-1 leading-relaxed font-medium">
                  Clear milestones, predictable timelines, and absolute transparency throughout the entire development lifecycle.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative h-[320px] sm:h-[400px] md:h-[480px] w-full rounded-none overflow-hidden border border-outline-variant shadow-2xl">
          <img
            src="/trust_bg.webp"
            alt="Creative team reviewing high fidelity wireframes on a tablet, modern minimalist office, dark aesthetic."
            className="absolute inset-0 w-full h-full object-cover object-center grayscale opacity-80"
            width="640"
            height="500"
            loading="lazy"
            decoding="async"
          />
          <div className="absolute inset-0 bg-navy-muted/20 mix-blend-multiply"></div>

          {/* Decorative chart element overlay */}
          <div className="absolute bottom-4 right-4 bg-navy-muted/90 backdrop-blur-md p-4 rounded-none border border-champagne-light flex gap-4 items-center shadow-lg" aria-hidden="true">
            <svg className="text-champagne-light rotate-[-90deg]" height="48" viewBox="0 0 40 40" width="48" aria-hidden="true">
              <circle className="opacity-20" cx="20" cy="20" fill="none" r="16" stroke="currentColor" strokeWidth="2"></circle>
              <circle cx="20" cy="20" fill="none" r="16" stroke="currentColor" strokeDasharray="100" strokeDashoffset="25" strokeWidth="2"></circle>
            </svg>
            <div className="flex flex-col">
              <span className="font-headline-md text-2xl text-surface font-bold leading-none">100%</span>
              <span className="font-label-caps text-[10px] text-slate-200 tracking-widest uppercase mt-1 font-bold">Satisfaction</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
