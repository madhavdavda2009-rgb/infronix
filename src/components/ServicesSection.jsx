"use client";
import { MagnifyingGlass, ArrowRight, Code, Robot } from "@phosphor-icons/react";
import Link from "next/link";
export default function ServicesSection() {
  return (
    <section id="services" className="w-full py-16 md:py-24 bg-surface relative z-20" aria-labelledby="services-title">
      <div className="max-w-[1280px] mx-auto px-margin-mobile md:px-margin-desktop">

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 md:mb-12 border-b border-outline-variant pb-4 md:pb-6 gap-4">
          <div>
            <span className="font-label-caps text-xs text-secondary tracking-widest uppercase mb-2 block font-bold">Our Expertise</span>
            <h2 id="services-title" className="font-headline-lg text-2xl sm:text-3xl md:text-4xl text-primary font-bold">Digital Services & Capabilities</h2>
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
              <h3 className="font-headline-md text-xl md:text-2xl text-primary font-bold">Website Development</h3>
            </div>
            <p className="font-body-md text-sm text-on-surface-variant leading-relaxed font-medium">
              We build websites that make your business look as good as it actually is.
            </p>
            <p className="font-body-md text-sm text-on-surface-variant leading-relaxed font-medium">
              From high-converting landing pages to complete business websites, we create fast, responsive, modern experiences designed around your brand and goals.
            </p>
            <div className="mt-2 flex-grow">
              <p className="font-label-caps text-xs text-primary font-bold mb-3 uppercase tracking-widest">What we offer:</p>
              <ul className="space-y-2 font-body-md text-sm text-on-surface-variant">
                <li className="flex items-start gap-2"><span className="text-secondary mt-1 text-xs">▹</span> Custom Website Development</li>
                <li className="flex items-start gap-2"><span className="text-secondary mt-1 text-xs">▹</span> Business & Corporate Websites</li>
                <li className="flex items-start gap-2"><span className="text-secondary mt-1 text-xs">▹</span> Landing Pages</li>
                <li className="flex items-start gap-2"><span className="text-secondary mt-1 text-xs">▹</span> Portfolio Websites</li>
                <li className="flex items-start gap-2"><span className="text-secondary mt-1 text-xs">▹</span> E-commerce Websites</li>
                <li className="flex items-start gap-2"><span className="text-secondary mt-1 text-xs">▹</span> Responsive & Mobile-First Design</li>
                <li className="flex items-start gap-2"><span className="text-secondary mt-1 text-xs">▹</span> Performance Optimization</li>
                <li className="flex items-start gap-2"><span className="text-secondary mt-1 text-xs">▹</span> SEO-Friendly Development</li>
                <li className="flex items-start gap-2"><span className="text-secondary mt-1 text-xs">▹</span> Website Maintenance & Updates</li>
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
              <h3 className="font-headline-md text-xl md:text-2xl text-primary font-bold">SEO Optimization</h3>
            </div>
            <p className="font-body-md text-sm text-on-surface-variant leading-relaxed font-medium">
              Get discovered. Get clicks. Turn visibility into growth.
            </p>
            <p className="font-body-md text-sm text-on-surface-variant leading-relaxed font-medium">
              We optimize your website so search engines can understand it and your potential customers can actually find it. Our approach focuses on technical performance, content structure, and search visibility.
            </p>
            <div className="mt-2 flex-grow">
              <p className="font-label-caps text-xs text-primary font-bold mb-3 uppercase tracking-widest">What we offer:</p>
              <ul className="space-y-2 font-body-md text-sm text-on-surface-variant">
                <li className="flex items-start gap-2"><span className="text-secondary mt-1 text-xs">▹</span> Technical SEO</li>
                <li className="flex items-start gap-2"><span className="text-secondary mt-1 text-xs">▹</span> On-Page SEO</li>
                <li className="flex items-start gap-2"><span className="text-secondary mt-1 text-xs">▹</span> Keyword Research</li>
                <li className="flex items-start gap-2"><span className="text-secondary mt-1 text-xs">▹</span> Meta Tags & Structured Content</li>
                <li className="flex items-start gap-2"><span className="text-secondary mt-1 text-xs">▹</span> Website Performance Optimization</li>
                <li className="flex items-start gap-2"><span className="text-secondary mt-1 text-xs">▹</span> SEO-Friendly Site Architecture</li>
                <li className="flex items-start gap-2"><span className="text-secondary mt-1 text-xs">▹</span> Sitemap & Robots.txt Setup</li>
                <li className="flex items-start gap-2"><span className="text-secondary mt-1 text-xs">▹</span> Search Console Setup</li>
                <li className="flex items-start gap-2"><span className="text-secondary mt-1 text-xs">▹</span> Local SEO Basics</li>
                <li className="flex items-start gap-2"><span className="text-secondary mt-1 text-xs">▹</span> SEO Monitoring & Improvements</li>
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
              <h3 className="font-headline-md text-xl md:text-2xl text-primary font-bold">AI Automation</h3>
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
