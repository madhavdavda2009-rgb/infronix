"use client";
export default function HeroSection() {
  return (
    <section className="relative w-full min-h-[560px] md:h-[700px] flex items-center bg-navy-muted overflow-hidden pt-20 pb-12" aria-label="Introduction">
      <img
        src="/hero_bg.webp"
        alt="Infronix Web Agency workspace showcasing custom UI/UX design, web development, and SEO in Ahmedabad"
        className="absolute inset-0 w-full h-full object-cover object-center opacity-30 mix-blend-luminosity"
        width="1920"
        height="700"
        fetchPriority="high"
        decoding="async"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-navy-muted via-navy-muted/95 to-navy-muted/60"></div>

      <div className="relative z-10 max-w-[1280px] w-full mx-auto px-margin-mobile md:px-margin-desktop flex flex-col gap-6">
        <div className="flex flex-col gap-4 max-w-3xl border-l-2 border-champagne-light pl-4 sm:pl-gutter py-2">
          <span className="font-label-caps text-xs text-champagne-light tracking-widest uppercase font-bold">
            Best Web Agency in Ahmedabad
          </span>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-[56px] text-surface font-semibold leading-tight">
            Premier Web Development &amp; SEO Agency in Ahmedabad
          </h1>
          <p className="font-body-md text-sm sm:text-base md:text-lg text-slate-200 font-medium max-w-xl leading-relaxed">
            We engineer custom, high-converting websites, Next.js web applications, and intelligent AI automations that drive measurable growth for modern businesses across Gujarat and India.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-2 sm:pl-gutter w-full sm:w-auto">
          <a
            href="/start-project"
            className="bg-champagne-light text-navy-muted font-label-caps uppercase tracking-widest text-xs px-6 py-3.5 rounded-none hover:bg-white transition-all shadow-lg border border-champagne-light text-center font-bold"
          >
            Get Started
          </a>
          <a
            href="/web-development"
            className="bg-transparent border border-outline-variant text-slate-200 font-label-caps uppercase tracking-widest text-xs px-6 py-3.5 rounded-none hover:text-champagne-light hover:border-champagne-light transition-all text-center font-bold"
          >
            Explore Services
          </a>
        </div>
      </div>
    </section>
  );
}
