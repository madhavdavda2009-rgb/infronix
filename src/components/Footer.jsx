"use client";
import { ChatCircle, Envelope, ShareNetwork, Globe, MapPin } from "@phosphor-icons/react";

import Link from 'next/link';
import webLogo from '@/assets/web-logo.png';

export default function Footer() {
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
                className="h-16 sm:h-20 md:h-24 lg:h-28 w-auto object-contain brightness-0 invert max-h-[100px] transition-transform duration-300 group-hover:scale-105 drop-shadow-md"
                src={webLogo.src || webLogo}
                loading="lazy"
                width="240"
                height="100"
              />
            </Link>
          </div>
          <p className="text-xs sm:text-sm text-slate-200 font-medium leading-relaxed">
            Designing digital brilliance, high-converting web applications, and technical innovation for modern brands.
          </p>
          <div className="flex gap-4 mt-1">
            <a href="#" aria-label="Share" className="text-champagne-light hover:text-white transition-colors">
              <ShareNetwork aria-hidden="true" className="text-xl" weight="bold" />
            </a>
            <a href="#" aria-label="Our Global Sites" className="text-champagne-light hover:text-white transition-colors">
              <Globe aria-hidden="true" className="text-xl" weight="bold" />
            </a>
            <a href="mailto:hello@infronix.agency" aria-label="Email Us" className="text-champagne-light hover:text-white transition-colors">
              <Envelope aria-hidden="true" className="text-xl" weight="bold" />
            </a>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <h2 className="font-headline-md text-lg text-champagne-light font-bold border-b border-champagne-light/30 pb-2">Quick Links</h2>
          <Link href="/" className="text-xs uppercase tracking-widest font-label-caps text-slate-200 hover:text-champagne-light transition-colors font-semibold">Home</Link>
          <a href="/#about" className="text-xs uppercase tracking-widest font-label-caps text-slate-200 hover:text-champagne-light transition-colors font-semibold">About Us</a>
          <a href="/#portfolio" className="text-xs uppercase tracking-widest font-label-caps text-slate-200 hover:text-champagne-light transition-colors font-semibold">Portfolio</a>
          <a href="/#services" className="text-xs uppercase tracking-widest font-label-caps text-slate-200 hover:text-champagne-light transition-colors font-semibold">Services</a>
        </div>

        <div className="flex flex-col gap-3">
          <h2 className="font-headline-md text-lg text-champagne-light font-bold border-b border-champagne-light/30 pb-2">Services</h2>
          <a href="/#services" className="text-xs uppercase tracking-widest font-label-caps text-slate-200 hover:text-champagne-light transition-colors font-semibold">Website Development</a>
          <a href="/#services" className="text-xs uppercase tracking-widest font-label-caps text-slate-200 hover:text-champagne-light transition-colors font-semibold">SEO Optimization</a>
          <a href="/#services" className="text-xs uppercase tracking-widest font-label-caps text-slate-200 hover:text-champagne-light transition-colors font-semibold">AI Automation</a>
        </div>

        <div className="flex flex-col gap-3">
          <h2 className="font-headline-md text-lg text-champagne-light font-bold border-b border-champagne-light/30 pb-2">Contact Info</h2>
          <address className="not-italic flex flex-col gap-3">
            <p className="text-xs sm:text-sm text-slate-200 font-medium flex items-start gap-2">
              <MapPin aria-hidden="true" className="text-lg mt-0.5 text-champagne-light" weight="bold" />
              Infronix Digital Agency
            </p>
            <a
              href="https://wa.me/916355792936?text=Hi%20Infronix!%20I'm%20contacting%20you%20from%20your%20website."
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs sm:text-sm text-champagne-light hover:text-white font-bold flex items-center gap-2 transition-colors"
            >
              <ChatCircle aria-hidden="true" className="text-lg" weight="bold" />
              WhatsApp: +91 6355792936
            </a>
            <p className="text-xs sm:text-sm text-slate-200 font-medium flex items-center gap-2">
              <Envelope aria-hidden="true" className="text-lg text-champagne-light" weight="bold" />
              hello@infronix.agency
            </p>
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
