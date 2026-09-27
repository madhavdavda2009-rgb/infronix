"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Globe, MagnifyingGlass, Robot, Megaphone } from "@phosphor-icons/react";

const services = [
  {
    id: "01",
    title: "Website Development",
    short: "Custom websites designed to win customers.",
    desc: "We build modern, fast, and easy-to-use websites and web apps that showcase your brand and make it easier for interested visitors to enquire or buy.",
    features: ["Bespoke Brand Design", "High-Performance Speed", "Intuitive UX Architecture", "E-Commerce & Portals"],
    icon: Globe,
    link: "/web-development",
  },
  {
    id: "02",
    title: "SEO Optimization",
    short: "Help local and national customers find you on Google.",
    desc: "Get your business discovered on Google search and maps. We improve your organic visibility and rankings so relevant customers discover your services.",
    features: ["Google Search Rankings", "Google Maps & Local SEO", "Content & Keyword Strategy", "Technical SEO Audits"],
    icon: MagnifyingGlass,
    link: "/seo",
  },
  {
    id: "03",
    title: "AI Automation",
    short: "Automate daily tasks & save team hours.",
    desc: "Connect supported tools to reduce repeated data entry, route enquiries intelligently, and help your team follow up on every lead instantly.",
    features: ["24/7 AI Chat Assistants", "WhatsApp Workflow Replies", "Instant Lead Routing", "Custom App Integrations"],
    icon: Robot,
    link: "/ai-automation",
  },
  {
    id: "04",
    title: "Digital Marketing",
    short: "Reach targeted buyers on social media & Google.",
    desc: "Reach more high-intent customers with attractive social media campaigns and data-driven advertising built around your target audience and conversion funnel.",
    features: ["Social Media Growth", "Google & Meta Paid Ads", "High-ROI Retargeting", "Inquiry & Sales Tracking"],
    icon: Megaphone,
    link: "/digital-marketing",
  }
];

export default function ServicesSection() {
  const [activeService, setActiveService] = useState(0);

  return (
    <section id="services" className="py-16 sm:py-20 md:py-24 bg-surface-container-lowest relative overflow-hidden">
      {/* Decorative ambient gradient */}
      <div className="absolute top-0 right-0 w-[300px] sm:w-[600px] h-[300px] sm:h-[600px] bg-primary/[0.04] rounded-full blur-[100px] sm:blur-[140px] pointer-events-none translate-x-1/3 -translate-y-1/3" />
      
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-10 sm:mb-16 md:mb-20 flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-8"
        >
          <div className="max-w-2xl">
            <span className="text-xs sm:text-sm font-semibold tracking-widest uppercase text-primary mb-3 sm:mb-4 flex items-center gap-3">
              <span className="w-8 sm:w-12 h-[2px] bg-primary" /> Our Expertise
            </span>
            <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-on-surface leading-tight">
              We specialize in the core <br className="hidden md:block" />
              pillars of digital growth.
            </h2>
          </div>
          <Link href="/services" className="group flex items-center gap-2 text-sm sm:text-base text-on-surface font-semibold border-b-2 border-transparent hover:border-primary pb-1 hover:text-primary transition-all self-start md:self-auto">
            View All Capabilities <ArrowRight weight="bold" className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-6 sm:gap-8 lg:gap-14">
          {/* Left: Interactive List */}
          <div className="lg:w-1/2 flex flex-col gap-3.5 sm:gap-4 relative z-10">
            {services.map((service, index) => (
              <motion.div
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                key={service.id}
                onMouseEnter={() => setActiveService(index)}
                onClick={() => setActiveService(index)}
                onFocus={() => setActiveService(index)}
                className={`group cursor-pointer p-4 sm:p-6 md:p-7 rounded-2xl transition-all duration-300 border ${
                  activeService === index
                    ? 'bg-surface border-primary/30 shadow-md ring-1 ring-primary/10 translate-x-1'
                    : 'bg-surface-container-lowest border-outline hover:border-outline-variant hover:bg-surface/50'
                }`}
              >
                <div className="flex items-center gap-4 sm:gap-6 md:gap-8">
                  <span className={`text-2xl sm:text-4xl md:text-5xl font-heading font-bold transition-colors duration-300 ${activeService === index ? 'text-primary' : 'text-text-light/40'}`}>
                    {service.id}
                  </span>
                  <div>
                    <h3 className={`text-lg sm:text-2xl md:text-3xl font-heading font-bold mb-1 transition-colors duration-300 ${activeService === index ? 'text-on-surface' : 'text-main-text group-hover:text-on-surface'}`}>
                      <button type="button" aria-expanded={activeService === index} onClick={() => setActiveService(index)} className="text-left font-bold">{service.title}</button>
                    </h3>
                    <p className={`text-xs sm:text-base md:text-lg transition-colors duration-300 ${activeService === index ? 'text-main-text' : 'text-text-light'}`}>
                      {service.short}
                    </p>
                  </div>
                </div>

                {/* Mobile Expandable Content */}
                <AnimatePresence>
                  {activeService === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0, marginTop: 0 }}
                      animate={{ height: "auto", opacity: 1, marginTop: 16 }}
                      exit={{ height: 0, opacity: 0, marginTop: 0 }}
                      className="lg:hidden overflow-hidden pt-2"
                    >
                      <p className="text-main-text mb-4 sm:mb-6 text-sm sm:text-base leading-relaxed">{service.desc}</p>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 mb-6">
                        {service.features.map((feature, i) => (
                          <li key={i} className="flex items-center gap-2 sm:gap-3 text-on-surface font-medium text-xs sm:text-sm">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" /> {feature}
                          </li>
                        ))}
                      </ul>
                      <Link
                        href={service.link}
                        className="inline-flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold bg-deep-space text-white px-5 py-3 sm:px-6 sm:py-3.5 rounded-xl hover:bg-primary transition-colors shadow-sm w-full sm:w-auto text-center"
                      >
                        Explore Service <ArrowRight weight="bold" />
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>

          {/* Right: Detailed View (Desktop Only) */}
          <div className="hidden lg:block lg:w-1/2 relative">
            <div className="sticky top-32">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeService}
                  initial={{ opacity: 0, y: 16, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -16, scale: 0.98 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="bg-surface p-10 xl:p-12 border border-outline shadow-xl rounded-3xl h-[520px] flex flex-col justify-between relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-64 h-64 bg-primary/[0.06] rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                  <div className="relative z-10">
                    <div className="w-14 h-14 rounded-2xl bg-surface-container-lowest border border-outline flex items-center justify-center mb-7 shadow-xs">
                      {(() => {
                        const Icon = services[activeService].icon;
                        return Icon ? <Icon size={28} className="text-primary" weight="duotone" /> : null;
                      })()}
                    </div>
                    <h3 className="text-3xl xl:text-4xl font-heading font-bold text-on-surface mb-4">
                      {services[activeService].title}
                    </h3>
                    <p className="text-lg text-main-text leading-relaxed mb-6 font-normal">
                      {services[activeService].desc}
                    </p>

                    <ul className="grid grid-cols-2 gap-y-3.5 gap-x-3">
                      {services[activeService].features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-2.5 text-on-surface text-sm font-medium">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" /> {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Link
                    href={services[activeService].link}
                    className="relative z-10 inline-flex items-center justify-center gap-2 text-sm font-semibold bg-deep-space text-white px-7 py-3.5 rounded-xl hover:bg-primary transition-all shadow-md w-fit mt-6 group"
                  >
                    Explore {services[activeService].title} <ArrowRight weight="bold" className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
