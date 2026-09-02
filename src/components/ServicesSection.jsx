"use client";
import { MagnifyingGlass, ArrowRight, Code, Robot } from "@phosphor-icons/react";
import Link from "next/link";
export default function ServicesSection() {
  return (
    <section id="services" className="w-full py-16 md:py-24 bg-surface relative z-20" aria-labelledby="services-title">
      <div className="max-w-[1280px] mx-auto px-margin-mobile md:px-margin-desktop">

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 md:mb-12 border-b border-outline-variant pb-4 md:pb-6 gap-4">
          <div>
            <span className="font-label-caps text-xs text-secondary tracking-widest uppercase mb-2 block font-bold">Our Core Capabilities</span>
            <h2 id="services-title" className="font-headline-lg text-2xl sm:text-3xl md:text-4xl text-primary font-bold">Custom Web Development &amp; SEO Services</h2>
          </div>
          <a className="font-label-caps text-xs uppercase tracking-widest text-secondary hover:text-primary transition-colors flex items-center gap-1 font-bold" href="/#services">
            <span>View all services</span>
            <ArrowRight aria-hidden="true" className="text-[16px]" weight="bold" />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">

          {/* Card 1 */}
          <Link href="/web-development" className="bg-surface rounded-none p-6 md:p-8 flex flex-col gap-4 relative group overflow-hidden border border-outline-variant hover:border-champagne-light transition-all shadow-sm hover:shadow-md h-full">
            <div className="absolute top-0 left-0 w-full h-[2px] bg-champagne-light transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
            <div className="flex items-center gap-3 mb-2">
              <span className="font-label-caps text-secondary font-bold text-xl opacity-50">01</span>
              <h3 className="font-headline-md text-xl md:text-2xl text-primary font-bold">Custom Web Development</h3>
            </div>
            <p className="font-body-md text-sm text-on-surface-variant leading-relaxed font-medium">
              We build custom, modern websites and web applications tailored for ambitious brands in Ahmedabad and across India.
            </p>
            <p className="font-body-md text-sm text-on-surface-variant leading-relaxed font-medium">
              From high-converting landing pages to scalable corporate web applications, we engineer lightning-fast experiences with Next.js, React, and clean code architectures.
            </p>
            <div className="mt-2 flex-grow">
              <p className="font-label-caps text-xs text-primary font-bold mb-3 uppercase tracking-widest">What we offer:</p>
              <ul className="space-y-2 font-body-md text-sm text-on-surface-variant">
                <li className="flex items-start gap-2"><span className="text-secondary mt-1 text-xs">▹</span> Custom Next.js Web Development</li>
                <li className="flex items-start gap-2"><span className="text-secondary mt-1 text-xs">▹</span> Business &amp; Corporate Websites</li>
                <li className="flex items-start gap-2"><span className="text-secondary mt-1 text-xs">▹</span> High-Converting Landing Pages</li>
                <li className="flex items-start gap-2"><span className="text-secondary mt-1 text-xs">▹</span> E-commerce Website Platforms</li>
                <li className="flex items-start gap-2"><span className="text-secondary mt-1 text-xs">▹</span> Custom Web Applications &amp; Portals</li>
                <li className="flex items-start gap-2"><span className="text-secondary mt-1 text-xs">▹</span> Responsive Mobile-First Design</li>
                <li className="flex items-start gap-2"><span className="text-secondary mt-1 text-xs">▹</span> 100/100 Core Web Vitals Optimization</li>
                <li className="flex items-start gap-2"><span className="text-secondary mt-1 text-xs">▹</span> Ongoing Website Maintenance &amp; Updates</li>
              </ul>
            </div>
            <div className="mt-6 pt-4 border-t border-outline-variant w-full flex flex-col gap-4">
              <p className="font-body-md text-xs text-on-surface-variant font-medium">Tech: Next.js · React · Node.js · Tailwind CSS</p>
              <div className="flex items-center gap-2 font-label-caps text-xs uppercase tracking-widest font-bold text-secondary group-hover:text-primary transition-colors">
                Build My Website <ArrowRight aria-hidden="true" className="text-[14px]" weight="bold" />
              </div>
            </div>
          </Link>

          {/* Card 2 */}
          <Link href="/seo" className="bg-surface rounded-none p-6 md:p-8 flex flex-col gap-4 relative group overflow-hidden border border-outline-variant hover:border-champagne-light transition-all shadow-sm hover:shadow-md h-full">
            <div className="absolute top-0 left-0 w-full h-[2px] bg-champagne-light transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
            <div className="flex items-center gap-3 mb-2">
              <span className="font-label-caps text-secondary font-bold text-xl opacity-50">02</span>
              <h3 className="font-headline-md text-xl md:text-2xl text-primary font-bold">Technical &amp; Local SEO</h3>
            </div>
            <p className="font-body-md text-sm text-on-surface-variant leading-relaxed font-medium">
              Rank on Google search results and turn organic visibility into paying customers.
            </p>
            <p className="font-body-md text-sm text-on-surface-variant leading-relaxed font-medium">
              Our data-driven SEO strategies help businesses in Ahmedabad, Gujarat, and across India dominate local search queries, accelerate crawl indexing, and drive qualified leads.
            </p>
            <div className="mt-2 flex-grow">
              <p className="font-label-caps text-xs text-primary font-bold mb-3 uppercase tracking-widest">What we offer:</p>
              <ul className="space-y-2 font-body-md text-sm text-on-surface-variant">
                <li className="flex items-start gap-2"><span className="text-secondary mt-1 text-xs">▹</span> Technical SEO Audits &amp; Fixes</li>
                <li className="flex items-start gap-2"><span className="text-secondary mt-1 text-xs">▹</span> Ahmedabad &amp; Gujarat Local SEO</li>
                <li className="flex items-start gap-2"><span className="text-secondary mt-1 text-xs">▹</span> Search Intent Keyword Research</li>
                <li className="flex items-start gap-2"><span className="text-secondary mt-1 text-xs">▹</span> JSON-LD Schema &amp; Structured Data</li>
                <li className="flex items-start gap-2"><span className="text-secondary mt-1 text-xs">▹</span> Core Web Vitals &amp; PageSpeed Optimization</li>
                <li className="flex items-start gap-2"><span className="text-secondary mt-1 text-xs">▹</span> Google Search Console Setup &amp; Indexing</li>
                <li className="flex items-start gap-2"><span className="text-secondary mt-1 text-xs">▹</span> Canonicalization &amp; Site Architecture</li>
                <li className="flex items-start gap-2"><span className="text-secondary mt-1 text-xs">▹</span> Monthly SEO Growth Monitoring</li>
              </ul>
            </div>
            <div className="mt-6 pt-4 border-t border-outline-variant w-full flex flex-col gap-4 justify-end">
              <div className="flex items-center gap-2 font-label-caps text-xs uppercase tracking-widest font-bold text-secondary group-hover:text-primary transition-colors">
                Grow My Visibility <ArrowRight aria-hidden="true" className="text-[14px]" weight="bold" />
              </div>
            </div>
          </Link>

          {/* Card 3 */}
          <Link href="/ai-automation" className="bg-surface rounded-none p-6 md:p-8 flex flex-col gap-4 relative group overflow-hidden border border-outline-variant hover:border-champagne-light transition-all shadow-sm hover:shadow-md h-full md:col-span-2 lg:col-span-1">
            <div className="absolute top-0 left-0 w-full h-[2px] bg-champagne-light transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
            <div className="flex items-center gap-3 mb-2">
              <span className="font-label-caps text-secondary font-bold text-xl opacity-50">03</span>
              <h3 className="font-headline-md text-xl md:text-2xl text-primary font-bold">AI Workflow Automation</h3>
            </div>
            <p className="font-body-md text-sm text-on-surface-variant leading-relaxed font-medium">
              Stop doing manually what AI can handle automatically.
            </p>
            <p className="font-body-md text-sm text-on-surface-variant leading-relaxed font-medium">
              We build intelligent automations that connect your tools, reduce repetitive work, and help your business operate faster with less manual effort.
            </p>
            <div className="mt-2 flex-grow">
              <p className="font-label-caps text-xs text-primary font-bold mb-3 uppercase tracking-widest">What we offer:</p>
              <ul className="space-y-2 font-body-md text-sm text-on-surface-variant">
                <li className="flex items-start gap-2"><span className="text-secondary mt-1 text-xs">▹</span> AI Chatbots</li>
                <li className="flex items-start gap-2"><span className="text-secondary mt-1 text-xs">▹</span> WhatsApp Automation</li>
                <li className="flex items-start gap-2"><span className="text-secondary mt-1 text-xs">▹</span> Lead Capture & Qualification</li>
                <li className="flex items-start gap-2"><span className="text-secondary mt-1 text-xs">▹</span> Automated Customer Support</li>
                <li className="flex items-start gap-2"><span className="text-secondary mt-1 text-xs">▹</span> Email Automation</li>
                <li className="flex items-start gap-2"><span className="text-secondary mt-1 text-xs">▹</span> Workflow Automation</li>
                <li className="flex items-start gap-2"><span className="text-secondary mt-1 text-xs">▹</span> AI-Powered Business Tools</li>
                <li className="flex items-start gap-2"><span className="text-secondary mt-1 text-xs">▹</span> CRM Automation</li>
                <li className="flex items-start gap-2"><span className="text-secondary mt-1 text-xs">▹</span> Data Processing Automation</li>
                <li className="flex items-start gap-2"><span className="text-secondary mt-1 text-xs">▹</span> Custom AI Integrations</li>
              </ul>
            </div>
            <div className="mt-6 pt-4 border-t border-outline-variant w-full flex flex-col gap-4 justify-end">
              <div className="flex items-center gap-2 font-label-caps text-xs uppercase tracking-widest font-bold text-secondary group-hover:text-primary transition-colors">
                Automate My Business <ArrowRight aria-hidden="true" className="text-[14px]" weight="bold" />
              </div>
            </div>
          </Link>

        </div>
      </div>
    </section>
  );
}
