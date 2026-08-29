"use client";
import { X, List } from "@phosphor-icons/react";

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import webLogo from '@/assets/web-logo.png';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (path) => {
    return pathname === path
      ? "text-champagne-light font-bold underline decoration-1 underline-offset-8"
      : "text-slate-200 hover:text-champagne-light font-medium";
  };

  return (
    <header className="fixed top-0 w-full z-50 bg-navy-muted/95 backdrop-blur-md shadow-[0_1px_8px_rgba(0,0,0,0.2)] border-b border-champagne-light/20">
      <div className="h-24 md:h-28 max-w-[1280px] mx-auto px-margin-mobile md:px-margin-desktop flex items-center justify-between">

        {/* Logo - Extra Large, bold, responsive, and clear */}
        <Link href="/" className="flex items-center py-1 group shrink-0" aria-label="Infronix Home">
          <img
            alt="Infronix Logo"
            className="h-20 sm:h-24 md:h-28 w-auto object-contain brightness-0 invert max-h-[100px] transition-transform duration-300 group-hover:scale-105 drop-shadow-md"
            src={webLogo.src || webLogo}
            loading="eager"
            fetchPriority="high"
            width="250"
            height="100"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-8" aria-label="Primary Navigation">
          <Link
            href="/"
            className={`font-label-caps text-xs uppercase tracking-widest transition-colors ${isActive('/')}`}
          >
            Home
          </Link>
          <Link
            href="/web-development"
            className={`font-label-caps text-xs uppercase tracking-widest transition-colors ${isActive('/web-development')}`}
          >
            Web Dev
          </Link>
          <Link
            href="/seo"
            className={`font-label-caps text-xs uppercase tracking-widest transition-colors ${isActive('/seo')}`}
          >
            SEO
          </Link>
          <Link
            href="/ai-automation"
            className={`font-label-caps text-xs uppercase tracking-widest transition-colors ${isActive('/ai-automation')}`}
          >
            AI
          </Link>
          <Link
            href="/projects"
            className={`font-label-caps text-xs uppercase tracking-widest transition-colors ${isActive('/projects')}`}
          >
            Projects
          </Link>
          <Link
            href="/about"
            className={`font-label-caps text-xs uppercase tracking-widest transition-colors ${isActive('/about')}`}
          >
            About
          </Link>
          <Link
            href="/contact"
            className={`font-label-caps text-xs uppercase tracking-widest transition-colors ${isActive('/contact')}`}
          >
            Contact
          </Link>
          <Link
            href="/blog"
            className={`font-label-caps text-xs uppercase tracking-widest transition-colors ${isActive('/blog')}`}
          >
            Blog
          </Link>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <a
            href="/start-project"
            className="hidden sm:inline-block bg-transparent border border-champagne-light text-champagne-light font-label-caps uppercase tracking-widest text-xs px-5 py-2.5 rounded-none hover:bg-champagne-light hover:text-navy-muted transition-all font-bold"
          >
            Start Project
          </a>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
            className="lg:hidden w-10 h-10 border border-champagne-light/40 text-champagne-light flex items-center justify-center cursor-pointer hover:bg-champagne-light/10 transition-colors"
          >
            {mobileMenuOpen ? <X className="text-2xl" /> : <List className="text-2xl" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-navy-dark/98 border-b border-champagne-light/30 px-margin-mobile py-6 backdrop-blur-xl animate-slide-in">
          <nav className="flex flex-col gap-4 text-center">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 text-sm font-label-caps uppercase tracking-widest text-champagne-light font-bold"
            >
              Home
            </Link>
            <Link
              href="/web-development"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 text-sm font-label-caps uppercase tracking-widest text-slate-200 hover:text-champagne-light font-semibold"
            >
              Web Dev
            </Link>
            <Link
              href="/seo"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 text-sm font-label-caps uppercase tracking-widest text-slate-200 hover:text-champagne-light font-semibold"
            >
              SEO
            </Link>
            <Link
              href="/ai-automation"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 text-sm font-label-caps uppercase tracking-widest text-slate-200 hover:text-champagne-light font-semibold"
            >
              AI Automation
            </Link>
            <Link
              href="/projects"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 text-sm font-label-caps uppercase tracking-widest text-slate-200 hover:text-champagne-light font-semibold"
            >
              Projects
            </Link>
            <Link
              href="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 text-sm font-label-caps uppercase tracking-widest text-slate-200 hover:text-champagne-light font-semibold"
            >
              About
            </Link>
            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 text-sm font-label-caps uppercase tracking-widest text-slate-200 hover:text-champagne-light font-semibold"
            >
              Contact
            </Link>
            <Link
              href="/blog"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 text-sm font-label-caps uppercase tracking-widest text-slate-200 hover:text-champagne-light font-semibold"
            >
              Blog
            </Link>

            <div className="pt-4 border-t border-slate-800 flex justify-center">
              <a
                href="/start-project"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full max-w-xs bg-champagne-light text-navy-muted font-label-caps uppercase tracking-widest text-xs py-3 rounded-none font-bold text-center"
              >
                Start Project
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
