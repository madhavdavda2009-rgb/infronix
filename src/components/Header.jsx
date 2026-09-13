"use client";
import { 
  X, 
  List, 
  CaretDown, 
  CaretRight, 
  Envelope, 
  Phone, 
  MapPin, 
  Clock, 
  Globe, 
  MagnifyingGlass, 
  Robot, 
  Megaphone,
  ArrowRight
} from "@phosphor-icons/react";
import { useState, useEffect } from 'react';
import Link from 'next/link';
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
            <Link href="/" className="flex items-center gap-3 group shrink-0" aria-label="Infronix Home">
              <img src="/dark-web-logo.png" alt="Infronix Web Agency" className="h-8 sm:h-10 md:h-12 w-auto object-contain" />
            </Link>

            {/* Right side: CTA + Hamburger */}
            <div className="flex items-center gap-3 sm:gap-4">
              <Link
                href="/start-project"
                className="hidden sm:flex items-center justify-center bg-primary text-white font-bold text-xs sm:text-sm px-4 sm:px-6 py-2 sm:py-2.5 rounded-md hover:bg-primary-dark transition-all hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_15px_rgba(139, 92, 246,0.3)]"
              >
                Get a Quote
              </Link>

              {/* Hamburger Toggle — visible on ALL screen sizes */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Toggle Navigation Menu"
                aria-expanded={menuOpen}
                className="w-10 h-10 flex items-center justify-center text-white z-[60] relative cursor-pointer"
              >
                <motion.div animate={{ rotate: menuOpen ? 90 : 0 }} transition={{ duration: 0.2 }}>
                  {menuOpen ? <X className="text-2xl" weight="bold" /> : <List className="text-2xl" weight="bold" />}
                </motion.div>
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
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            onClick={() => setMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Right-side Drawer Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed top-0 right-0 z-50 bg-ink-black flex flex-col px-4 sm:px-6 py-6 sm:py-8 overflow-y-auto w-[92vw] sm:w-[420px] max-w-[420px] h-[100dvh] border-l border-[#1A1E26] shadow-2xl custom-scrollbar"
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#1A1E26]">
              <img src="/dark-web-logo.png" alt="Infronix Web Agency" className="h-7 sm:h-8 w-auto object-contain" />
              <button
                onClick={() => setMenuOpen(false)}
                className="text-text-light hover:text-white p-2 rounded-lg transition-colors"
                aria-label="Close menu"
              >
                <X size={22} weight="bold" />
              </button>
            </div>

            {/* Navigation Structure */}
            <div className="flex flex-col gap-1 w-full flex-grow">
              
              {/* Home */}
              <Link
                href="/"
                onClick={() => setMenuOpen(false)}
                className={`text-lg font-medium py-3 px-3 rounded-lg transition-all flex items-center justify-between ${
                  pathname === '/' ? 'text-primary bg-primary/10 font-bold' : 'text-white hover:text-primary hover:bg-white/5'
                }`}
              >
                Home
              </Link>

              {/* Services Collapsible Section */}
              <div className="my-1 rounded-xl bg-[#0B0E14] border border-[#1A1E26] overflow-hidden">
                <button
                  type="button"
                  onClick={() => setServicesOpen(!servicesOpen)}
                  className="w-full flex items-center justify-between py-3.5 px-4 text-left text-white hover:text-primary font-bold text-base transition-colors"
                  aria-expanded={servicesOpen}
                >
                  <span className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    Services
                  </span>
                  <motion.div
                    animate={{ rotate: servicesOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <CaretDown size={16} weight="bold" className="text-text-light" />
                  </motion.div>
                </button>

                <AnimatePresence initial={false}>
                  {servicesOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="px-3 pb-3 pt-1 flex flex-col gap-1 border-t border-[#161A22]"
                    >
                      {/* Standard Services */}
                      {mainServices.map((service) => {
                        const IconComponent = service.icon;
                        const isActive = pathname === service.path;
                        return (
                          <Link
                            key={service.path}
                            href={service.path}
                            onClick={() => setMenuOpen(false)}
                            className={`flex items-center gap-3 py-2.5 px-3 rounded-lg text-sm font-medium transition-all ${
                              isActive
                                ? 'bg-primary/15 text-primary font-bold border-l-2 border-primary'
                                : 'text-[#A0AEC0] hover:text-white hover:bg-white/5'
                            }`}
                          >
                            <IconComponent size={18} className={isActive ? 'text-primary' : 'text-[#6B7280]'} weight="duotone" />
                            {service.label}
                          </Link>
                        );
                      })}

                      {/* Digital Marketing Nested Accordion */}
                      <div className="mt-1 pt-1 border-t border-[#161A22]">
                        <button
                          type="button"
                          onClick={() => setDigitalMarketingOpen(!digitalMarketingOpen)}
                          className={`w-full flex items-center justify-between py-2.5 px-3 rounded-lg text-sm font-semibold transition-all ${
                            pathname.startsWith('/digital-marketing') ? 'text-primary font-bold bg-primary/10' : 'text-white hover:bg-white/5'
                          }`}
                          aria-expanded={digitalMarketingOpen}
                        >
                          <span className="flex items-center gap-3">
                            <Megaphone size={18} className="text-primary" weight="duotone" />
                            Digital Marketing
                          </span>
                          <motion.div
                            animate={{ rotate: digitalMarketingOpen ? 180 : 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <CaretDown size={14} weight="bold" className="text-text-light" />
                          </motion.div>
                        </button>

                        {/* Digital Marketing Sub-Pages */}
                        <AnimatePresence initial={false}>
                          {digitalMarketingOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="pl-4 ml-3 my-1 border-l-2 border-[#1E2430] flex flex-col gap-1 py-1"
                            >
                              {digitalMarketingSubItems.map((subItem) => {
                                const isSubActive = pathname === subItem.path;
                                return (
                                  <Link
                                    key={subItem.path}
                                    href={subItem.path}
                                    onClick={() => setMenuOpen(false)}
                                    className={`py-1.5 px-2.5 rounded-md text-xs font-medium transition-all flex items-center justify-between ${
                                      isSubActive
                                        ? 'text-primary font-bold bg-primary/15'
                                        : 'text-[#8E9BAC] hover:text-white hover:bg-white/5'
                                    } ${subItem.highlight ? 'text-white font-semibold' : ''}`}
                                  >
                                    <span>{subItem.label}</span>
                                    {subItem.highlight && <ArrowRight size={12} className="text-primary" />}
                                  </Link>
                                );
                              })}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Remaining Main Links */}
              <Link
                href="/projects"
                onClick={() => setMenuOpen(false)}
                className={`text-lg font-medium py-3 px-3 rounded-lg transition-all flex items-center justify-between ${
                  pathname === '/projects' ? 'text-primary bg-primary/10 font-bold' : 'text-white hover:text-primary hover:bg-white/5'
                }`}
              >
                Our Work
              </Link>

              <Link
                href="/about"
                onClick={() => setMenuOpen(false)}
                className={`text-lg font-medium py-3 px-3 rounded-lg transition-all flex items-center justify-between ${
                  pathname === '/about' ? 'text-primary bg-primary/10 font-bold' : 'text-white hover:text-primary hover:bg-white/5'
                }`}
              >
                About Us
              </Link>

              <Link
                href="/blog"
                onClick={() => setMenuOpen(false)}
                className={`text-lg font-medium py-3 px-3 rounded-lg transition-all flex items-center justify-between ${
                  pathname === '/blog' ? 'text-primary bg-primary/10 font-bold' : 'text-white hover:text-primary hover:bg-white/5'
                }`}
              >
                Blog
              </Link>

              <Link
                href="/contact"
                onClick={() => setMenuOpen(false)}
                className={`text-lg font-medium py-3 px-3 rounded-lg transition-all flex items-center justify-between ${
                  pathname === '/contact' ? 'text-primary bg-primary/10 font-bold' : 'text-white hover:text-primary hover:bg-white/5'
                }`}
              >
                Contact
              </Link>
            </div>

            {/* Bottom CTA in Drawer */}
            <div className="pt-6 mt-6 border-t border-[#1A1E26]">
              <Link
                href="/start-project"
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-center w-full bg-primary text-white font-bold py-3.5 rounded-lg hover:bg-primary-dark transition-all hover:scale-[1.02] shadow-[0_0_20px_rgba(139, 92, 246,0.3)] text-base"
              >
                Get a Quote
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
