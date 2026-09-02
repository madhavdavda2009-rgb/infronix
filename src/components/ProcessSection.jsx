"use client";
import { Compass, Palette, CodeBlock, Rocket, CheckCircle, ArrowRight } from "@phosphor-icons/react";
import Link from "next/link";

const PROCESS_STEPS = [
  {
    step: "01",
    title: "Discovery & Technical Architecture",
    icon: Compass,
    summary: "Every high-impact digital project starts with deep strategic clarity.",
    description:
      "We analyze your business objectives, target audience, competitive landscape in Ahmedabad and across India, and technical requirements. We then architect a bespoke software roadmap, select the ideal technology stack (Next.js, React, Node.js), and outline data structures for maximum scalability and organic search performance.",
    deliverables: ["Project Scope & Architecture", "SEO Keyword Mapping", "Tech Stack Strategy"]
  },
  {
    step: "02",
    title: "Custom UI/UX & Responsive Design",
    icon: Palette,
    summary: "Visual excellence engineered specifically to maximize client conversions.",
    description:
      "Our design philosophy blends modern aesthetic elegance with intuitive user experiences. We craft custom, brand-tailored layouts with sleek dark-mode aesthetics, responsive typography, and mobile-first micro-animations that captivate visitors on smartphones, tablets, and desktop displays alike.",
    deliverables: ["High-Fidelity Wireframes", "Interactive Design Prototypes", "Design System & Tokens"]
  },
  {
    step: "03",
    title: "Full-Stack Engineering & AI Automation",
    icon: CodeBlock,
    summary: "Clean, robust codebases powered by modern web technologies and AI.",
    description:
      "We develop lightning-fast web applications using Server-Side Rendering (SSR), secure API routes, and optimized database integrations. For modern businesses seeking operational efficiency, we seamlessly integrate custom AI chatbots, automated lead qualification, and WhatsApp customer communication workflows.",
    deliverables: ["Clean Next.js Codebase", "AI Chatbots & Workflows", "API Integrations & Security"]
  },
  {
    step: "04",
    title: "Technical SEO & Performance Launch",
    icon: Rocket,
    summary: "Flawless deployment backed by 100/100 Core Web Vitals and Google indexation.",
    description:
      "Before launch, we conduct rigorous multi-browser testing, automated security audits, speed optimization, and complete on-page and technical SEO setup. We implement JSON-LD Schema structured data, XML sitemaps, canonical tags, and Google Search Console registration to ensure immediate search engine discoverability.",
    deliverables: ["100/100 Lighthouse Score", "Structured Data & Schema", "Search Console Indexing"]
  }
];

export default function ProcessSection() {
  return (
    <section id="process" className="w-full py-16 md:py-24 bg-surface relative z-20 border-b border-outline-variant/30" aria-labelledby="process-title">
      <div className="max-w-[1280px] mx-auto px-margin-mobile md:px-margin-desktop">

        {/* Section Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 md:mb-14 border-b border-outline-variant pb-6 gap-4">
          <div>
            <span className="font-label-caps text-xs text-secondary tracking-widest uppercase mb-2 block font-bold">
              Our Proven Methodology
            </span>
            <h2 id="process-title" className="font-headline-lg text-2xl sm:text-3xl md:text-4xl text-primary font-bold">
              Strategic Web Development &amp; SEO Process
            </h2>
            <p className="font-body-md text-sm sm:text-base text-on-surface-variant max-w-2xl mt-2 leading-relaxed font-medium">
              From concept to deployment, our 4-step engineering framework ensures your web applications achieve elite performance, higher Google rankings, and tangible business ROI.
            </p>
          </div>
          <Link
            href="/start-project"
            className="font-label-caps text-xs uppercase tracking-widest text-secondary hover:text-primary transition-colors flex items-center gap-1 font-bold whitespace-nowrap"
          >
            <span>Start Your Project</span>
            <ArrowRight aria-hidden="true" className="text-[16px]" weight="bold" />
          </Link>
        </div>

        {/* 4-Step Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {PROCESS_STEPS.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <div
                key={index}
                className="bg-surface rounded-none p-6 md:p-8 flex flex-col justify-between border border-outline-variant hover:border-champagne-light transition-all shadow-sm hover:shadow-md relative group overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-[2px] bg-champagne-light transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-label-caps text-secondary font-bold text-2xl opacity-60">
                      {item.step}
                    </span>
                    <div className="w-12 h-12 border border-champagne-light/50 flex items-center justify-center bg-surface-container-lowest text-secondary group-hover:bg-navy-muted group-hover:text-champagne-light transition-colors">
                      <IconComponent size={24} weight="bold" />
                    </div>
                  </div>

                  <h3 className="font-headline-md text-lg sm:text-xl text-primary font-bold mb-2">
                    {item.title}
                  </h3>

                  <p className="font-body-md text-xs font-semibold text-secondary mb-3">
                    {item.summary}
                  </p>

                  <p className="font-body-md text-xs sm:text-sm text-on-surface-variant leading-relaxed font-medium mb-6">
                    {item.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-outline-variant/60">
                  <p className="font-label-caps text-[10px] uppercase tracking-widest text-primary font-bold mb-2">
                    Key Deliverables:
                  </p>
                  <ul className="space-y-1.5 font-body-md text-xs text-on-surface-variant font-medium">
                    {item.deliverables.map((deliv, dIdx) => (
                      <li key={dIdx} className="flex items-center gap-1.5">
                        <CheckCircle size={14} weight="fill" className="text-secondary shrink-0" />
                        <span>{deliv}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
