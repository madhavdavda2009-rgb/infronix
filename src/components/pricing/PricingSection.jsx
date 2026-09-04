"use client";
import PricingCard from "./PricingCard";
import { pricingData } from "./pricingData";
import { ArrowRight } from "@phosphor-icons/react";
import Link from "next/link";

export default function PricingSection({ serviceKey }) {
  const data = pricingData[serviceKey];

  if (!data) return null;

  return (
    <section className="w-full py-16 md:py-24 bg-navy-muted relative z-20 border-b border-champagne-light/20" aria-labelledby="pricing-title">
      <div className="max-w-[1280px] mx-auto px-margin-mobile md:px-margin-desktop">

        {/* Pricing Header */}
        <div className="text-center mb-12 md:mb-16">
          <span className="font-label-caps text-xs text-champagne-light tracking-widest uppercase mb-2 block font-bold">Transparent Pricing</span>
          <h2 id="pricing-title" className="font-headline-lg text-3xl sm:text-4xl text-surface font-bold mb-4">{data.heading}</h2>
          <p className="font-body-md text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed font-medium">
            {data.subheading}
          </p>
        </div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 justify-center items-stretch">
          {data.packages.map((pkg) => (
            <div key={pkg.id} className={data.packages.length < 4 ? "max-w-md w-full mx-auto" : ""}>
              <PricingCard pkg={pkg} serviceId={data.id} />
            </div>
          ))}
        </div>

        {data.disclaimer && (
          <p className="font-body-md text-xs sm:text-sm text-slate-400 text-center max-w-3xl mx-auto mt-10 leading-relaxed">
            {data.disclaimer}
          </p>
        )}

        {/* Cross-Service Navigation */}
        <div className="mt-20 pt-10 border-t border-outline-variant/30 text-center flex flex-col items-center">
          <h3 className="font-headline-md text-xl text-surface font-bold mb-6">Looking for another service?</h3>
          <div className="flex flex-wrap justify-center gap-4">
            {serviceKey !== 'web-development' && (
              <Link href="/web-development" className="bg-transparent border border-outline-variant text-slate-200 font-label-caps uppercase tracking-widest text-xs px-6 py-3 rounded-none hover:text-champagne-light hover:border-champagne-light transition-all font-bold">
                Website Development
              </Link>
            )}
            {serviceKey !== 'seo' && (
              <Link href="/seo" className="bg-transparent border border-outline-variant text-slate-200 font-label-caps uppercase tracking-widest text-xs px-6 py-3 rounded-none hover:text-champagne-light hover:border-champagne-light transition-all font-bold">
                SEO Optimization
              </Link>
            )}
            {serviceKey !== 'ai-automation' && (
              <Link href="/ai-automation" className="bg-transparent border border-outline-variant text-slate-200 font-label-caps uppercase tracking-widest text-xs px-6 py-3 rounded-none hover:text-champagne-light hover:border-champagne-light transition-all font-bold">
                AI Automation
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
