"use client";
import { 
  X, 
  CaretDown, 
  Envelope, 
  Phone, 
  MapPin, 
  Clock, 
  Globe, 
  MagnifyingGlass, 
  Robot, 
  ShieldCheck, 
  ChartLineUp, 
  Megaphone, 
  ArrowUpRight,
  Sparkle
} from "@phosphor-icons/react";
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { useIntro } from '@/context/IntroContext';

export default function Header() {
  const drawerRef = useRef(null);
  const menuButtonRef = useRef(null);
  const dropdownRef = useRef(null);
  
  const [menuOpen, setMenuOpen] = useState(false);
  const [desktopServicesOpen, setDesktopServicesOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  
  const pathname = usePathname();
  const { introPhase, isIntroActive } = useIntro();
  const { scrollYProgress } = useScroll();
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMenuOpen(false);
    setDesktopServicesOpen(false);
    if (pathname.startsWith('/digital-marketing') || pathname === '/web-development' || pathname === '/seo' || pathname === '/ai-automation') {
      setMobileServicesOpen(true);
    }
  }, [pathname]);

  // Click outside to close desktop services dropdown
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDesktopServicesOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Accessible keyboard trap for mobile drawer
  useEffect(() => {
    if (!menuOpen) return;
    const previousFocus = document.activeElement;
    const drawer = drawerRef.current;
    if (!drawer) return;
    const controls = () => [...drawer.querySelectorAll('a[href], button:not([disabled])')].filter(el => el.getClientRects().length);
    controls()[0]?.focus();
    const handleKey = event => {
      if (event.key === 'Escape') { setMenuOpen(false); return; }
      if (event.key !== 'Tab') return;
      const items = controls();
      const first = items[0], last = items.at(-1);
      if (event.shiftKey && (document.activeElement === first || !drawer.contains(document.activeElement))) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && (document.activeElement === last || !drawer.contains(document.activeElement))) { event.preventDefault(); first?.focus(); }
    };
    document.addEventListener('keydown', handleKey);
    return () => { document.removeEventListener('keydown', handleKey); previousFocus?.focus(); };
  }, [menuOpen]);

  // Prevent body scroll when mobile menu open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  if (pathname?.startsWith('/admin') || pathname?.startsWith('/founder-os') || pathname?.startsWith('/client')) {
    return null;
  }

  const isPreloading = isIntroActive && introPhase === 'loading';
  const isLogoHidden = isIntroActive && introPhase !== 'completed';

  const servicesList = [
    {
      title: 'Web Development',
      href: '/web-development',
      desc: 'High-speed Next.js web applications, e-commerce & corporate sites.',
      icon: Globe
    },
    {
      title: 'SEO Optimization',
      href: '/seo',
      desc: 'Top Google search rankings & local Maps visibility.',
      icon: MagnifyingGlass
    },
    {
      title: 'AI Automation',
      href: '/ai-automation',
      desc: 'Custom AI chatbots, lead capture & CRM automation.',
      icon: Robot
    },
    {
      title: 'Digital Marketing',
      href: '/digital-marketing',
      desc: 'Comprehensive growth marketing & conversion strategies.',
      icon: ChartLineUp
    },
    {
      title: 'Paid Advertising',
      href: '/digital-marketing/paid-advertising',
      desc: 'High-ROI Google Ads, Meta Ads & retargeting campaigns.',
      icon: Megaphone
    },
    {
      title: 'Social Media Marketing',
      href: '/digital-marketing/social-media-marketing',
      desc: 'Engaging content creation, reels & social brand presence.',
      icon: Sparkle
    }
  ];

  const isServicesActive = 
    pathname.startsWith('/web-development') ||
    pathname.startsWith('/seo') ||
    pathname.startsWith('/ai-automation') ||
    pathname.startsWith('/digital-marketing') ||
    pathname === '/services';

  return (
    <>
      <div className={`fixed top-0 w-full z-50 flex flex-col transition-opacity duration-700 ease-out ${
        isPreloading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}>
        {/* Top Info Bar */}
        <div className={`hidden lg:flex text-[#A0AEC0] text-xs py-2 w-full transition-all duration-700 ${
          isPreloading ? 'opacity-0 -translate-y-4' : 'opacity-100 translate-y-0'
        } ${scrolled ? 'bg-[#0B0D12]/95 backdrop-blur-md' : 'bg-[#0B0D12]'}`}>
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
                <Clock size={14} weight="bold" className="text-violet-400" /> Mon - Sat: 9:00 AM - 8:00 PM
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
          <div className="h-16 sm:h-20 max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12 flex items-center justify-between gap-4">

            {/* Logo + Brand Title */}
            <Link href="/" className="flex items-center gap-3 group shrink-0" aria-label="InfronixWeb Home">
              <Image
                id="header-logo-image"
                src="/dark-web-logo.webp"
                alt="InfronixWeb Digital Marketing"
                width={160}
                height={48}
                priority
                style={{
                  width: 'auto',
                  height: 'auto',
                  opacity: isLogoHidden ? 0 : 1,
                  transition: 'opacity 0.2s ease',
                }}
                className="h-8 sm:h-10 md:h-12 w-auto object-contain"
              />
            </Link>

            {/* DESKTOP DIRECT NAVIGATION (Hidden on mobile/tablet, replaces hamburger on desktop) */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5" aria-label="Main Desktop Navigation">
              {/* Home */}
              <Link
                href="/"
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                  pathname === '/'
                    ? 'text-white bg-white/[0.08] shadow-2xs font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                Home
              </Link>

              {/* Services with Desktop Dropdown */}
              <div 
                ref={dropdownRef}
                className="relative"
                onMouseEnter={() => setDesktopServicesOpen(true)}
                onMouseLeave={() => setDesktopServicesOpen(false)}
              >
                <button
                  type="button"
                  onClick={() => setDesktopServicesOpen(!desktopServicesOpen)}
                  aria-expanded={desktopServicesOpen}
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                    isServicesActive
                      ? 'text-white bg-white/[0.08] font-semibold'
                      : 'text-slate-300 hover:text-white hover:bg-white/[0.04]'
                  }`}
                >
                  <span>Services</span>
                  <CaretDown 
                    size={14} 
                    className={`transition-transform duration-200 ${desktopServicesOpen ? 'rotate-180 text-primary' : 'text-slate-400'}`} 
                  />
                </button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {desktopServicesOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.98 }}
                      transition={{ duration: 0.18, ease: 'easeOut' }}
                      className="absolute top-full left-0 mt-1 w-[560px] bg-[#0E1118]/98 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-4 z-50 grid grid-cols-2 gap-2"
                    >
                      {servicesList.map((svc) => {
                        const Icon = svc.icon;
                        const isCurrent = pathname === svc.href;
                        return (
                          <Link
                            key={svc.href}
                            href={svc.href}
                            onClick={() => setDesktopServicesOpen(false)}
                            className={`p-2.5 rounded-xl transition-all group flex items-start gap-3 ${
                              isCurrent ? 'bg-primary/15 border border-primary/30' : 'hover:bg-white/[0.06] border border-transparent'
                            }`}
                          >
                            <div className={`p-2 rounded-lg shrink-0 transition-colors ${
                              isCurrent ? 'bg-primary text-white' : 'bg-white/5 text-primary group-hover:bg-primary group-hover:text-white'
                            }`}>
                              <Icon size={18} weight="bold" />
                            </div>
                            <div className="min-w-0">
                              <span className={`block text-xs font-semibold ${isCurrent ? 'text-primary' : 'text-white group-hover:text-primary transition-colors'}`}>
                                {svc.title}
                              </span>
                              <span className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                                {svc.desc}
                              </span>
                            </div>
                          </Link>
                        );
                      })}

                      {/* View All Services Footer */}
                      <div className="col-span-2 pt-2 mt-1 border-t border-white/10 flex items-center justify-between px-1">
                        <span className="text-[11px] text-slate-400">
                          Looking for full bespoke digital architectures?
                        </span>
                        <Link
                          href="/services"
                          onClick={() => setDesktopServicesOpen(false)}
                          className="text-xs font-bold text-primary hover:text-white flex items-center gap-1 transition-colors"
                        >
                          <span>Explore All Services</span>
                          <ArrowUpRight size={13} weight="bold" />
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Our Work */}
              <Link
                href="/projects"
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                  pathname === '/projects'
                    ? 'text-white bg-white/[0.08] shadow-2xs font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                Our Work
              </Link>

              {/* About Us */}
              <Link
                href="/about"
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                  pathname === '/about'
                    ? 'text-white bg-white/[0.08] shadow-2xs font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                About Us
              </Link>

              {/* Blog */}
              <Link
                href="/blog"
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                  pathname.startsWith('/blog')
                    ? 'text-white bg-white/[0.08] shadow-2xs font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                Blog
              </Link>

              {/* Contact */}
              <Link
                href="/contact"
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                  pathname === '/contact'
                    ? 'text-white bg-white/[0.08] shadow-2xs font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                Contact
              </Link>

              {/* Client Portal Link */}
              <Link
                href="/client/login"
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                  pathname.startsWith('/client')
                    ? 'text-white bg-white/[0.08] shadow-2xs font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                Client Portal
              </Link>
            </nav>

            {/* Right side: CTA + Hamburger Toggle (Mobile/Tablet Only) */}
            <div className={`flex items-center gap-2.5 sm:gap-3 transition-all duration-700 shrink-0 ${
              isPreloading ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'
            }`}>
              {/* Get a Quote CTA */}
              <Link
                href="/start-project"
                className="hidden sm:inline-flex items-center justify-center bg-primary text-white font-medium text-xs sm:text-sm px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl hover:bg-primary-dark transition-all hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_15px_rgba(139,92,246,0.3)] tracking-wide shrink-0"
              >
                Get a Quote
              </Link>

              {/* HAMBURGER MENU TOGGLE: STRICTLY FOR MOBILE & TABLET (Hidden on lg+ desktop) */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label={menuOpen ? "Close Navigation Menu" : "Open Navigation Menu"}
                ref={menuButtonRef}
                aria-controls="navigation-drawer"
                aria-expanded={menuOpen}
                className="lg:hidden group flex items-center gap-2 px-3 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-primary/40 transition-all cursor-pointer z-[60]"
              >
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

      {/* Drawer Overlay Backdrop (Mobile & Tablet) */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="lg:hidden fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
            onClick={() => setMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile / Tablet Navigation Drawer */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            ref={drawerRef}
            id="navigation-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="lg:hidden fixed top-0 right-0 z-50 bg-[#0B0D12] text-white flex flex-col justify-between px-5 sm:px-8 py-6 sm:py-8 overflow-y-auto w-[88vw] sm:w-[380px] max-w-[400px] h-[100dvh] border-l border-primary/20 shadow-2xl custom-scrollbar font-sans select-none"
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
            <div className="py-5 flex flex-col gap-1.5 flex-grow">
              {/* Home */}
              <Link
                href="/"
                onClick={() => setMenuOpen(false)}
                className={`py-2.5 px-3 rounded-xl text-base font-light transition-all flex items-center justify-between ${
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
                  onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                  aria-expanded={mobileServicesOpen}
                  className={`w-full py-2.5 px-3 rounded-xl text-base font-light transition-all flex items-center justify-between cursor-pointer ${
                    isServicesActive
                      ? 'text-primary'
                      : 'text-slate-200 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span>Services</span>
                  <motion.div animate={{ rotate: mobileServicesOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                    <CaretDown size={14} className="text-slate-400" />
                  </motion.div>
                </button>

                {/* Mobile Services Links */}
                <AnimatePresence initial={false}>
                  {mobileServicesOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="pl-4 pr-1 py-1 flex flex-col gap-1 border-l border-primary/20 ml-3.5 my-1"
                    >
                      <Link
                        href="/services"
                        onClick={() => setMenuOpen(false)}
                        className={`py-1.5 px-2.5 rounded-lg text-xs font-semibold transition-colors text-violet-400 hover:text-violet-300`}
                      >
                        All Services Overview →
                      </Link>
                      {servicesList.map((svc) => (
                        <Link
                          key={svc.href}
                          href={svc.href}
                          onClick={() => setMenuOpen(false)}
                          className={`py-1.5 px-2.5 rounded-lg text-sm font-light transition-colors ${
                            pathname === svc.href ? 'text-primary font-normal bg-primary/10' : 'text-slate-300 hover:text-white'
                          }`}
                        >
                          {svc.title}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Our Work */}
              <Link
                href="/projects"
                onClick={() => setMenuOpen(false)}
                className={`py-2.5 px-3 rounded-xl text-base font-light transition-all flex items-center justify-between ${
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
                className={`py-2.5 px-3 rounded-xl text-base font-light transition-all flex items-center justify-between ${
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
                className={`py-2.5 px-3 rounded-xl text-base font-light transition-all flex items-center justify-between ${
                  pathname.startsWith('/blog')
                    ? 'text-primary bg-primary/10 font-normal'
                    : 'text-slate-200 hover:text-white hover:bg-white/5'
                }`}
              >
                <span>Blog &amp; Insights</span>
              </Link>

              {/* Contact */}
              <Link
                href="/contact"
                onClick={() => setMenuOpen(false)}
                className={`py-2.5 px-3 rounded-xl text-base font-light transition-all flex items-center justify-between ${
                  pathname === '/contact'
                    ? 'text-primary bg-primary/10 font-normal'
                    : 'text-slate-200 hover:text-white hover:bg-white/5'
                }`}
              >
                <span>Contact Us</span>
              </Link>

              {/* Client Portal */}
              <Link
                href="/client/login"
                onClick={() => setMenuOpen(false)}
                className={`py-2.5 px-3 rounded-xl text-base font-light transition-all flex items-center justify-between ${
                  pathname.startsWith('/client')
                    ? 'text-primary bg-primary/10 font-normal'
                    : 'text-slate-200 hover:text-white hover:bg-white/5'
                }`}
              >
                <span>Client Portal</span>
              </Link>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-white/10 space-y-3">
              <Link
                href="/start-project"
                onClick={() => setMenuOpen(false)}
                className="w-full inline-flex items-center justify-center py-3 px-4 rounded-xl bg-primary hover:bg-primary-dark text-white text-sm font-medium tracking-wide transition-all shadow-[0_0_20px_rgba(139,92,246,0.25)]"
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
