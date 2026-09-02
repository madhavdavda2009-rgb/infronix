"use client";
import id5 from '@/assets/id-5.webp';
import { RocketLaunch, ArrowRight } from '@phosphor-icons/react';

export default function PortfolioSection() {
  return (
    <section className="relative w-full bg-navy-muted overflow-hidden py-section-gap" id="portfolio" aria-labelledby="portfolio-title">
      {/* Background image overlay — same pattern as HeroSection */}
      <img
        src={id5.src || id5}
        alt="Infronix featured custom web development and client project portfolio showcase in Ahmedabad"
        className="absolute inset-0 w-full h-full object-cover object-center opacity-10 mix-blend-luminosity"
        loading="lazy"
        width="1920"
        height="800"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-navy-muted via-navy-muted/95 to-navy-muted"></div>

      <div className="relative z-10 max-w-[1280px] mx-auto px-margin-mobile md:px-margin-desktop">

        {/* Header — mirrors HeroSection left-border accent */}
        <div className="flex flex-col gap-4 max-w-3xl border-l-2 border-champagne-light pl-4 sm:pl-gutter py-2 mb-8 md:mb-12">
          <span className="font-label-caps text-xs text-champagne-light tracking-widest uppercase font-bold">Our Work</span>
          <h2 id="portfolio-title" className="font-headline-lg text-2xl sm:text-3xl md:text-4xl text-surface font-bold">Featured Projects &amp; Digital Solutions</h2>
          <p className="font-body-md text-sm sm:text-base text-slate-200 max-w-xl leading-relaxed font-medium">
            We partner with forward-thinking brands in Ahmedabad and across India to create digital experiences that merge stunning aesthetics with powerful technical execution.
          </p>
        </div>

        {/* Welcome Card */}
        <div className="mt-6 sm:mt-10 max-w-4xl">
          <div className="relative overflow-hidden bg-navy-dark/60 backdrop-blur-md border border-champagne-light/30 p-8 md:p-12 shadow-2xl flex flex-col items-start gap-6 group hover:border-champagne-light/60 transition-colors">
            <div className="absolute top-0 right-0 p-8 opacity-10 transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform duration-700">
              <RocketLaunch size={160} weight="fill" className="text-champagne-light" />
            </div>

            <div className="relative z-10">
              <span className="inline-block bg-champagne-light text-navy-muted font-label-caps uppercase tracking-widest text-xs px-3 py-1 font-bold mb-4">
                Special Welcome
              </span>
              <h3 className="font-headline-lg text-3xl md:text-5xl text-surface font-bold mb-4 leading-tight">
                You Are Our First Customer!
              </h3>
              <p className="font-body-md text-slate-200 text-lg max-w-2xl leading-relaxed mb-8">
                We are incredibly thrilled to start this journey with you. Every great agency starts with a visionary client, and we can't wait to build something extraordinary together.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <a href="https://madhavdavda.vercel.app" target="_blank" rel="noopener noreferrer" className="bg-transparent border border-champagne-light text-champagne-light font-label-caps uppercase tracking-widest text-xs px-6 py-3 hover:bg-champagne-light hover:text-navy-muted transition-all font-bold flex items-center gap-2">
                  View Developer's Portfolio <ArrowRight weight="bold" />
                </a>
                <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
                  While we build out this agency's portfolio, check out the lead developer's past work.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-8 md:mt-12 flex flex-col sm:flex-row gap-3 sm:gap-4 sm:pl-gutter w-full sm:w-auto">
          <a href="/#contact" className="bg-champagne-light text-navy-muted font-label-caps uppercase tracking-widest text-xs px-6 py-3.5 rounded-none hover:bg-white transition-all shadow-lg border border-champagne-light text-center font-bold">
            Start Your Project
          </a>
          <a href="/#services" className="bg-transparent border border-outline-variant text-slate-200 font-label-caps uppercase tracking-widest text-xs px-6 py-3.5 rounded-none hover:text-champagne-light hover:border-champagne-light transition-all text-center font-bold">
            Our Services
          </a>
        </div>

      </div>
    </section>
  );
}
