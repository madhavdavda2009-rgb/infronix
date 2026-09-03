"use client";
import { 
  ChatCircle, 
  Envelope, 
  MapPin, 
  InstagramLogo, 
  GithubLogo 
} from "@phosphor-icons/react";
import { useState, useEffect } from "react";

import Link from 'next/link';
import webLogo from '@/assets/web-logo.png';

export default function Footer() {
  const [emailAddress, setEmailAddress] = useState('');

  useEffect(() => {
    // Obfuscate email on mount to protect against raw text scraping
    const user = 'support';
    const domain = 'infronixweb.in';
    setEmailAddress(`${user}@${domain}`);
  }, []);

  function handleEmailClick(e) {
    e.preventDefault();
    const user = 'support';
    const domain = 'infronixweb.in';
    window.location.href = `mailto:${user}@${domain}`;
  }

  function openCookiePreferences() {
    window.dispatchEvent(new Event('open_cookie_preferences'));
  }

  return (
    <footer className="w-full bg-navy-muted text-surface pt-16 md:pt-24 pb-10 border-t border-champagne-light/20" aria-label="Site Footer">
      <div className="max-w-[1280px] mx-auto px-margin-mobile md:px-margin-desktop grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">

        <div className="flex flex-col gap-4">
          <div className="flex items-center -ml-1">
            <Link href="/" className="inline-block group" aria-label="Infronix Home">
              <img
                alt="Infronix Logo"
                className="h-16 sm:h-20 md:h-24 lg:h-28 w-auto object-contain max-h-[100px] transition-transform duration-300 group-hover:scale-105 drop-shadow-md"
                src={webLogo.src || webLogo}
                loading="lazy"
                width="240"
                height="100"
              />
            </Link>
          </div>
          <p className="text-xs sm:text-sm text-slate-200 font-medium leading-relaxed">
            Designing digital brilliance, high-converting web applications, and technical innovation for modern brands in Ahmedabad, Gujarat, and across India.
          </p>
          <div className="flex gap-3 mt-2 flex-wrap items-center" aria-label="Social Media Links">
            <a
              href="https://www.instagram.com/infronix_web_agency"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Follow Infronix on Instagram"
              className="w-9 h-9 border border-champagne-light/40 flex items-center justify-center text-champagne-light hover:text-navy-muted hover:bg-champagne-light transition-all shadow-sm"
            >
              <InstagramLogo aria-hidden="true" className="text-lg" weight="bold" />
            </a>
            <a
              href="https://github.com/madhavdavda2009-rgb"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="View Infronix Open Source Code on GitHub"
              className="w-9 h-9 border border-champagne-light/40 flex items-center justify-center text-champagne-light hover:text-navy-muted hover:bg-champagne-light transition-all shadow-sm"
            >
              <GithubLogo aria-hidden="true" className="text-lg" weight="bold" />
            </a>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <h2 className="font-headline-md text-lg text-champagne-light font-bold border-b border-champagne-light/30 pb-2">Quick Links</h2>
          <Link href="/" className="text-xs uppercase tracking-widest font-label-caps text-slate-200 hover:text-champagne-light transition-colors font-semibold">Home</Link>
          <Link href="/about" className="text-xs uppercase tracking-widest font-label-caps text-slate-200 hover:text-champagne-light transition-colors font-semibold">About Us</Link>
          <Link href="/projects" className="text-xs uppercase tracking-widest font-label-caps text-slate-200 hover:text-champagne-light transition-colors font-semibold">Portfolio</Link>
          <Link href="/blog" className="text-xs uppercase tracking-widest font-label-caps text-slate-200 hover:text-champagne-light transition-colors font-semibold">Blog</Link>
          <Link href="/contact" className="text-xs uppercase tracking-widest font-label-caps text-slate-200 hover:text-champagne-light transition-colors font-semibold">Contact</Link>
        </div>

        <div className="flex flex-col gap-3">
          <h2 className="font-headline-md text-lg text-champagne-light font-bold border-b border-champagne-light/30 pb-2">Services</h2>
          <Link href="/web-development" className="text-xs uppercase tracking-widest font-label-caps text-slate-200 hover:text-champagne-light transition-colors font-semibold">Web Development</Link>
          <Link href="/seo" className="text-xs uppercase tracking-widest font-label-caps text-slate-200 hover:text-champagne-light transition-colors font-semibold">SEO Optimization</Link>
          <Link href="/ai-automation" className="text-xs uppercase tracking-widest font-label-caps text-slate-200 hover:text-champagne-light transition-colors font-semibold">AI Automation</Link>
        </div>

        <div className="flex flex-col gap-3">
          <h2 className="font-headline-md text-lg text-champagne-light font-bold border-b border-champagne-light/30 pb-2">Contact Info</h2>
          <address className="not-italic flex flex-col gap-3">
            <p className="text-xs sm:text-sm text-slate-200 font-medium flex items-start gap-2">
              <MapPin aria-hidden="true" className="text-lg mt-0.5 text-champagne-light shrink-0" weight="bold" />
              <span>Infronix Digital Agency, Sanand, Ahmedabad, Gujarat, India</span>
            </p>
            <a
              href="https://wa.me/916355792936?text=Hi%20Infronix!%20I'm%20contacting%20you%20from%20your%20website."
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs sm:text-sm text-champagne-light hover:text-white font-bold flex items-center gap-2 transition-colors"
            >
              <ChatCircle aria-hidden="true" className="text-lg shrink-0" weight="bold" />
              <span>WhatsApp: +91 6355792936</span>
            </a>
            <button
              onClick={handleEmailClick}
              type="button"
              className="text-xs sm:text-sm text-slate-200 hover:text-champagne-light font-medium flex items-center gap-2 transition-colors text-left cursor-pointer bg-transparent border-none p-0"
              aria-label="Send email to Infronix"
            >
              <Envelope aria-hidden="true" className="text-lg text-champagne-light shrink-0" weight="bold" />
              <span>{emailAddress || 'Contact via Email'}</span>
            </button>
          </address>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-margin-mobile md:px-margin-desktop mt-12 pt-6 border-t border-champagne-light/20 flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left">
        <p className="text-xs font-label-caps uppercase tracking-widest text-slate-300 font-semibold">
          © {new Date().getFullYear()} Infronix Web Agency. All rights reserved.
        </p>
        <div className="flex gap-4 flex-wrap justify-center items-center">
          <Link href="/privacy-policy" className="text-xs font-label-caps uppercase tracking-widest text-slate-300 hover:text-champagne-light transition-colors font-bold">Privacy Policy</Link>
          <Link href="/terms-and-conditions" className="text-xs font-label-caps uppercase tracking-widest text-slate-300 hover:text-champagne-light transition-colors font-bold">Terms of Service</Link>
          <button
            onClick={openCookiePreferences}
            className="text-xs font-label-caps uppercase tracking-widest text-champagne-light hover:text-white transition-colors font-bold underline cursor-pointer"
          >
            Cookie Settings
          </button>
        </div>
      </div>
    </footer>
  );
}
