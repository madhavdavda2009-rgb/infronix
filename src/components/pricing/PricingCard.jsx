"use client";
import { CheckCircle, ArrowRight, Star } from "@phosphor-icons/react";

export default function PricingCard({ pkg, serviceId }) {
  // Construct the URL to pass parameters to the start-project form safely
  const queryParams = new URLSearchParams({
    service: serviceId,
    package: pkg.id
  }).toString();

  const href = `/start-project?${queryParams}`;

  return (
    <div className={`flex flex-col h-full bg-navy-dark/60 backdrop-blur-md border ${pkg.isRecommended ? 'border-champagne-light shadow-[0_0_15px_rgba(240,230,210,0.15)] scale-[1.02]' : 'border-outline-variant hover:border-champagne-light/50'} p-5 md:p-6 lg:p-8 relative group transition-all`}>
      {pkg.isRecommended && (
        <div className="absolute top-0 right-0 bg-champagne-light text-navy-muted font-label-caps uppercase tracking-widest text-[9px] md:text-[10px] font-bold px-2.5 py-1 md:px-3 flex items-center gap-1 shadow-md">
          <Star weight="fill" size={12} /> Recommended
        </div>
      )}

      <div className="flex flex-col gap-1.5 md:gap-2 mb-4 md:mb-6 border-b border-outline-variant/50 pb-4 md:pb-6">
        <h3 className="font-headline-md text-lg md:text-xl lg:text-2xl text-surface font-bold">{pkg.name}</h3>
        <p className="font-body-md text-xs md:text-sm text-slate-300 font-medium min-h-[2rem] md:min-h-[2.5rem]">{pkg.scope}</p>

        <div className="mt-3 md:mt-4 flex items-baseline gap-1.5 md:gap-2 flex-wrap">
          {pkg.label === "Starting from" && (
            <span className="font-label-caps uppercase tracking-widest text-[9px] md:text-[10px] text-champagne-light/80 font-bold">
              {pkg.label}
            </span>
          )}
          <span className="font-display text-2xl sm:text-3xl md:text-4xl text-champagne-light font-bold">
            {pkg.price}
          </span>
        </div>
      </div>

      <div className="flex-grow mb-6 md:mb-8">
        <ul className="space-y-2 md:space-y-3 font-body-md text-xs md:text-sm text-slate-200">
          {pkg.features.map((feature, idx) => (
            <li key={idx} className="flex items-start gap-1.5 md:gap-2">
              <CheckCircle className="text-champagne-light mt-0.5 shrink-0" weight="fill" size={16} />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-auto pt-4 md:pt-6 border-t border-outline-variant/30 w-full">
        <a
          href={href}
          className={`w-full font-label-caps uppercase tracking-widest text-[10px] md:text-xs px-4 md:px-6 py-3 md:py-3.5 rounded-none transition-all text-center font-bold flex items-center justify-center gap-2 ${pkg.isRecommended
              ? 'bg-champagne-light text-navy-muted hover:bg-white shadow-lg'
              : 'bg-transparent border border-champagne-light text-champagne-light hover:bg-champagne-light hover:text-navy-muted'
            }`}
        >
          {pkg.ctaText} <ArrowRight weight="bold" size={14} />
        </a>
      </div>
    </div>
  );
}
