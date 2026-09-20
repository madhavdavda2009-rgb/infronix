"use client";
import { X, List, CaretDown, Envelope, Phone, MapPin, Clock, Globe, MagnifyingGlass, Robot, Megaphone, ArrowRight } from "@phosphor-icons/react";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(true);
  const [digitalMarketingOpen, setDigitalMarketingOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { scrollYProgress } = useScroll();
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu on route change and auto-expand active sections
  useEffect(() => {
    setMenuOpen(false);
    if (pathname.startsWith('/digital-marketing')) {
      setServicesOpen(true);
      setDigitalMarketingOpen(true);
    } else if (pathname === '/web-development' || pathname === '/seo' || pathname === '/ai-automation') {
      setServicesOpen(true);
    }
  }, [pathname]);

  // Prevent body scroll when menu open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const digitalMarketingSubItems = [
    { path: '/digital-marketing', label: 'Overview & All Services', highlight: true },
    { path: '/digital-marketing/social-media-marketing', label: 'Social Media Marketing' },
    { path: '/digital-marketing/paid-advertising', label: 'Paid Advertising (Meta & Google)' }
  ];

  const mainServices = [
    { path: '/web-development', label: 'Web Development', icon: Globe },
    { path: '/seo', label: 'SEO Optimization', icon: MagnifyingGlass },
    { path: '/ai-automation', label: 'AI Automation', icon: Robot }
  ];

  if (pathname?.startsWith('/admin') || pathname?.startsWith('/founder-os')) {
    return null;
  }

  return (
    <>
      <div className="fixed top-0 w-full z-50 flex flex-col">
        {/* Top Info Bar */}
        <div className={`hidden lg:flex text-[#A0AEC0] text-xs py-2 w-full transition-colors duration-300 ${scrolled ? 'bg-[#0B0D12]/95 backdrop-blur-md' : 'bg-[#0B0D12]'}`}>
          <div className="max-w-[1440px] mx-auto px-6 md:px-12 w-full flex justify-between items-center">
            <div className="flex items-center gap-6">
              <a href="mailto:support@infronixweb.in" className="flex items-center gap-2 hover:text-white transition-colors">
                <Envelope size={14} weight="bold" /> support@infronixweb.in
              </a>
              <a href="tel:+916355792936" className="flex items-center gap-2 hover:text-white transition-colors">
                <Phone size={14} weight="bold" /> +91 6355 792 936
              </a>
              <a href="tel:+919106291540" className="flex items-center gap-2 hover:text-white transition-colors">
                <Phone size={14} weight="bold" /> +91 91062 91540
              </a>
              <span className="flex items-center gap-2">
                <MapPin size={14} weight="bold" /> Ahmedabad, Gujarat
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-2 font-medium text-white/90">
                <Clock size={14} weight="bold" className="text-primary" /> Mon - Sat: 9:00 AM - 8:00 PM
              </span>
            </div>
          </div>
        </div>

        {/* Top Scroll Progress Bar */}
        <motion.div
          className="w-full h-1 origin-left bg-gradient-to-r from-soft-violet via-primary to-primary-dark shrink-0"
          style={{ scaleX }}
        />

        {/* Main Header */}
        <header className={`w-full transition-colors duration-300 ${scrolled ? 'bg-ink-black/95 backdrop-blur-md shadow-sm border-b border-[#0B0D12]' : 'bg-ink-black'}`}>
          <div className="h-16 sm:h-20 max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12 flex items-center justify-between">

            {/* Logo + Brand Title */}
            <Link href="/" className="flex items-center gap-3 group shrink-0" aria-label="InfronixWeb Home">
              <Image
                src="/dark-web-logo.webp"
                alt="InfronixWeb Digital Marketing"
                width={160}
                height={48}
                priority
                style={{ width: 'auto', height: 'auto' }}
                className="h-8 sm:h-10 md:h-12 w-auto object-contain"
              />
            </Link>

            {/* Right side: CTA + Taste-Driven Hamburger */}
            <div className="flex items-center gap-3 sm:gap-4">
              <Link
                href="/start-project"
                className="hidden sm:flex items-center justify-center bg-primary text-white font-normal text-xs sm:text-sm px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg hover:bg-primary-dark transition-all hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_15px_rgba(139,92,246,0.3)] tracking-wide"
              >
                Get a Quote
              </Link>

              {/* Bespoke Architectural Menu Toggle */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label={menuOpen ? "Close Navigation Menu" : "Open Navigation Menu"}
                aria-expanded={menuOpen}
                className="group flex items-center gap-2.5 px-3 py-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-primary/40 transition-all cursor-pointer z-[60]"
              >
                <span className="text-[11px] font-mono tracking-[0.2em] uppercase text-slate-300 group-hover:text-white transition-colors hidden sm:inline-block font-light">
                  {menuOpen ? 'CLOSE' : 'MENU'}
                </span>
                <div className="w-5 h-4 flex flex-col justify-between items-end py-0.5">
                  <span className={`h-[1.5px] bg-white transition-all duration-300 ${menuOpen ? 'w-5 translate-y-[6px] rotate-45' : 'w-5'}`} />
                  <span className={`h-[1.5px] bg-white transition-all duration-200 ${menuOpen ? 'opacity-0 scale-x-0' : 'w-3.5 group-hover:w-5'}`} />
                  <span className={`h-[1.5px] bg-white transition-all duration-300 ${menuOpen ? 'w-5 -translate-y-[6px] -rotate-45' : 'w-4 group-hover:w-5'}`} />
                </div>
              </button>
            </div>
          </div>
        </header>
      </div>

      {/* Drawer Overlay Backdrop */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            onClick={() => setMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Navigation Drawer */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed top-0 right-0 z-50 bg-[#0B0D12] text-white flex flex-col justify-between px-6 sm:px-8 py-6 sm:py-8 overflow-y-auto w-[88vw] sm:w-[380px] max-w-[400px] h-[100dvh] border-l border-primary/20 shadow-2xl custom-scrollbar font-sans select-none"
          >
            {/* Top Bar */}
            <div className="flex items-center justify-between pb-5 border-b border-white/10">
              <Link href="/" onClick={() => setMenuOpen(false)}>
                <img
                  src="/dark-web-logo.webp"
                  alt="InfronixWeb"
                  width={120}
                  height={36}
                  className="h-7 sm:h-8 w-auto object-contain"
                />
              </Link>
              <button
                onClick={() => setMenuOpen(false)}
                className="p-2 text-slate-400 hover:text-white transition-colors cursor-pointer"
                aria-label="Close menu"
              >
                <X size={20} />
              </button>
            </div>

            {/* Pure Navigation Links */}
            <div className="py-6 flex flex-col gap-1.5 flex-grow">
              
              {/* Home */}
              <Link
                href="/"
                onClick={() => setMenuOpen(false)}
                className={`py-2.5 px-3 rounded-lg text-base font-light transition-all flex items-center justify-between ${
                  pathname === '/'
                    ? 'text-primary bg-primary/10 font-normal'
                    : 'text-slate-200 hover:text-white hover:bg-white/5'
                }`}
              >
                <span>Home</span>
              </Link>

              {/* Services Header / Accordion */}
              <div className="py-1">
                <button
                  type="button"
                  onClick={() => setServicesOpen(!servicesOpen)}
                  className={`w-full py-2.5 px-3 rounded-lg text-base font-light transition-all flex items-center justify-between cursor-pointer ${
                    pathname.startsWith('/web-development') || pathname.startsWith('/seo') || pathname.startsWith('/ai-automation') || pathname.startsWith('/digital-marketing')
                      ? 'text-primary'
                      : 'text-slate-200 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span>Services</span>
                  <motion.div animate={{ rotate: servicesOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                    <CaretDown size={14} className="text-slate-400" />
                  </motion.div>
                </button>

                {/* Services Links */}
                <AnimatePresence initial={false}>
                  {servicesOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="pl-4 pr-1 py-1 flex flex-col gap-1 border-l border-primary/20 ml-3.5 my-1"
                    >
                      <Link
                        href="/web-development"
                        onClick={() => setMenuOpen(false)}
                        className={`py-1.5 px-2.5 rounded-md text-sm font-light transition-colors ${
                          pathname === '/web-development' ? 'text-primary font-normal bg-primary/10' : 'text-slate-300 hover:text-white'
                        }`}
                      >
                        Web Development
                      </Link>

                      <Link
                        href="/seo"
                        onClick={() => setMenuOpen(false)}
                        className={`py-1.5 px-2.5 rounded-md text-sm font-light transition-colors ${
                          pathname === '/seo' ? 'text-primary font-normal bg-primary/10' : 'text-slate-300 hover:text-white'
                        }`}
                      >
                        SEO Optimization
                      </Link>

                      <Link
                        href="/ai-automation"
                        onClick={() => setMenuOpen(false)}
                        className={`py-1.5 px-2.5 rounded-md text-sm font-light transition-colors ${
                          pathname === '/ai-automation' ? 'text-primary font-normal bg-primary/10' : 'text-slate-300 hover:text-white'
                        }`}
                      >
                        AI Automation
                      </Link>

                      <Link
                        href="/digital-marketing"
                        onClick={() => setMenuOpen(false)}
                        className={`py-1.5 px-2.5 rounded-md text-sm font-light transition-colors ${
                          pathname === '/digital-marketing' ? 'text-primary font-normal bg-primary/10' : 'text-slate-300 hover:text-white'
                        }`}
                      >
                        Digital Marketing
                      </Link>

                      <Link
                        href="/digital-marketing/social-media-marketing"
                        onClick={() => setMenuOpen(false)}
                        className={`py-1.5 px-2.5 rounded-md text-sm font-light transition-colors ${
                          pathname === '/digital-marketing/social-media-marketing' ? 'text-primary font-normal bg-primary/10' : 'text-slate-300 hover:text-white'
                        }`}
                      >
                        Social Media Marketing
                      </Link>

                      <Link
                        href="/digital-marketing/paid-advertising"
                        onClick={() => setMenuOpen(false)}
                        className={`py-1.5 px-2.5 rounded-md text-sm font-light transition-colors ${
                          pathname === '/digital-marketing/paid-advertising' ? 'text-primary font-normal bg-primary/10' : 'text-slate-300 hover:text-white'
                        }`}
                      >
                        Paid Advertising (Meta & Google)
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Our Work */}
              <Link
                href="/projects"
                onClick={() => setMenuOpen(false)}
                className={`py-2.5 px-3 rounded-lg text-base font-light transition-all flex items-center justify-between ${
                  pathname === '/projects'
                    ? 'text-primary bg-primary/10 font-normal'
                    : 'text-slate-200 hover:text-white hover:bg-white/5'
                }`}
              >
                <span>Our Work</span>
              </Link>

              {/* About Us */}
              <Link
                href="/about"
                onClick={() => setMenuOpen(false)}
                className={`py-2.5 px-3 rounded-lg text-base font-light transition-all flex items-center justify-between ${
                  pathname === '/about'
                    ? 'text-primary bg-primary/10 font-normal'
                    : 'text-slate-200 hover:text-white hover:bg-white/5'
                }`}
              >
                <span>About Us</span>
              </Link>

              {/* Blog */}
              <Link
                href="/blog"
                onClick={() => setMenuOpen(false)}
                className={`py-2.5 px-3 rounded-lg text-base font-light transition-all flex items-center justify-between ${
                  pathname === '/blog'
                    ? 'text-primary bg-primary/10 font-normal'
                    : 'text-slate-200 hover:text-white hover:bg-white/5'
                }`}
              >
                <span>Blog</span>
              </Link>

              {/* Contact */}
              <Link
                href="/contact"
                onClick={() => setMenuOpen(false)}
                className={`py-2.5 px-3 rounded-lg text-base font-light transition-all flex items-center justify-between ${
                  pathname === '/contact'
                    ? 'text-primary bg-primary/10 font-normal'
                    : 'text-slate-200 hover:text-white hover:bg-white/5'
                }`}
              >
                <span>Contact</span>
              </Link>
            </div>

            {/* Bottom Actions */}
            <div className="pt-5 border-t border-white/10 space-y-3">
              <Link
                href="/start-project"
                onClick={() => setMenuOpen(false)}
                className="w-full inline-flex items-center justify-center py-3 px-4 rounded-xl bg-primary hover:bg-primary-dark text-white text-sm font-normal tracking-wide transition-all shadow-[0_0_20px_rgba(139,92,246,0.25)]"
              >
                <span>Get a Quote</span>
              </Link>

              <div className="flex items-center justify-between text-xs text-slate-400 font-light pt-1">
                <a href="tel:+916355792936" className="hover:text-primary transition-colors">
                  +91 6355 792 936
                </a>
                <a href="mailto:support@infronixweb.in" className="hover:text-primary transition-colors">
                  support@infronixweb.in
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
