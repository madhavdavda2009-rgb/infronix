"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { InstagramLogo, ArrowUpRight, MapPin, SpinnerGap } from "@phosphor-icons/react";

const MAP_QUERY_URL = "https://maps.google.com/maps?q=Shree%20Eklingji%20Residency%202%2C%20Sanand%2C%20Ahmedabad%20382110%2C%20Gujarat%2C%20India&t=&z=15&ie=UTF8&iwloc=&output=embed";
const GOOGLE_MAPS_LINK = "https://www.google.com/maps/search/?api=1&query=Shree+Eklingji+Residency+2,+Sanand,+Ahmedabad+382110";

export default function Footer() {
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();
  const [isMapVisible, setIsMapVisible] = useState(false);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const mapContainerRef = useRef(null);

  // Lazy load map iframe ONLY when user scrolls near the footer (200px threshold)
  useEffect(() => {
    if (!mapContainerRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsMapVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "250px" }
    );

    observer.observe(mapContainerRef.current);
    return () => observer.disconnect();
  }, []);

  if (pathname?.startsWith('/admin') || pathname?.startsWith('/founder-os')) {
    return null;
  }

  return (
    <footer className="bg-ink-black text-white pt-16 sm:pt-20 md:pt-24 pb-12 sm:pb-16 border-t border-[#0B0D12] relative z-20">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12">

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-8 mb-12 sm:mb-16 md:mb-20">
          
          {/* Brand & Socials (lg:col-span-3) */}
          <div className="sm:col-span-2 md:col-span-3 lg:col-span-3">
            <Link href="/" className="inline-block mb-4 sm:mb-6" aria-label="InfronixWeb Home">
              <Image
                src="/dark-web-logo.webp"
                alt="InfronixWeb Digital Marketing"
                width={160}
                height={48}
                style={{ width: 'auto', height: 'auto' }}
                className="h-8 sm:h-10 md:h-12 w-auto object-contain hover:opacity-90 transition-opacity"
              />
            </Link>
            <p className="text-[#9CA3AF] max-w-sm mb-6 sm:mb-8 leading-relaxed text-sm sm:text-base">
              Build, grow and automate with InfronixWeb, your Ahmedabad digital agency for websites, SEO, digital marketing, advertising and business automation.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://www.instagram.com/infronixwebagency2026"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-primary/50 text-slate-200 hover:text-primary transition-all group"
                aria-label="Follow InfronixWeb Digital Marketing on Instagram"
              >
                <InstagramLogo size={20} weight="fill" className="text-white group-hover:text-primary transition-colors shrink-0" />
                <span className="text-xs sm:text-sm font-medium">@infronixwebagency2026</span>
              </a>
            </div>
          </div>

          {/* Services (lg:col-span-2) */}
          <div className="lg:col-span-2">
            <h3 className="font-bold tracking-widest uppercase text-xs sm:text-sm text-white mb-4 sm:mb-6">Services</h3>
            <ul className="flex flex-col gap-3 sm:gap-4 text-xs sm:text-sm">
              <li><Link href="/services" className="text-[#9CA3AF] hover:text-violet-300 transition-colors">All Services</Link></li>
              <li><Link href="/web-development" className="text-[#9CA3AF] hover:text-primary transition-colors">Web Development</Link></li>
              <li><Link href="/seo" className="text-[#9CA3AF] hover:text-primary transition-colors">SEO Optimization</Link></li>
              <li><Link href="/ai-automation" className="text-[#9CA3AF] hover:text-primary transition-colors">AI Automation</Link></li>
              <li><Link href="/digital-marketing" className="text-[#9CA3AF] hover:text-primary transition-colors">Digital Marketing</Link></li>
              <li><Link href="/projects" className="text-[#9CA3AF] hover:text-primary transition-colors">Our Work</Link></li>
            </ul>
          </div>

          {/* Company (lg:col-span-2) */}
          <div className="lg:col-span-2">
            <h3 className="font-bold tracking-widest uppercase text-xs sm:text-sm text-white mb-4 sm:mb-6">Company</h3>
            <ul className="flex flex-col gap-3 sm:gap-4 text-xs sm:text-sm">
              <li><Link href="/about" className="text-[#9CA3AF] hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="/blog" className="text-[#9CA3AF] hover:text-primary transition-colors">Blog &amp; Insights</Link></li>
              <li><Link href="/contact" className="text-[#9CA3AF] hover:text-primary transition-colors">Contact Us</Link></li>
              <li><Link href="/start-project" className="text-[#9CA3AF] hover:text-primary transition-colors">Start a Project</Link></li>
            </ul>
          </div>

          {/* Contact (lg:col-span-2) */}
          <div className="lg:col-span-2">
            <h3 className="font-bold tracking-widest uppercase text-xs sm:text-sm text-white mb-4 sm:mb-6">Contact</h3>
            <ul className="flex flex-col gap-3 sm:gap-4 text-xs sm:text-sm">
              <li>
                <a href="mailto:support@infronixweb.in" className="group flex items-center gap-1.5 text-[#9CA3AF] hover:text-primary transition-colors break-all">
                  support@infronixweb.in <ArrowUpRight className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform shrink-0" />
                </a>
              </li>
              <li>
                <a href="tel:+916355792936" className="text-[#9CA3AF] hover:text-white transition-colors block">
                  +91 63557 92936
                </a>
              </li>
              <li>
                <a href="tel:+919106291540" className="text-[#9CA3AF] hover:text-white transition-colors block">
                  +91 91062 91540
                </a>
              </li>
              <li className="text-xs text-slate-300 font-medium">
                Mon – Sat: 9:00 AM to 8:00 PM
              </li>
              <li className="text-[#9CA3AF] mt-1 text-xs leading-relaxed">
                Shree Eklingji Residency 2, Sanand, Ahmedabad 382110, Gujarat, India
              </li>
            </ul>
          </div>

          {/* High-Performance Lazy Loaded Map Widget (lg:col-span-3) */}
          <div className="sm:col-span-2 md:col-span-3 lg:col-span-3">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h3 className="font-bold tracking-widest uppercase text-xs sm:text-sm text-white flex items-center gap-1.5">
                <MapPin size={16} weight="fill" className="text-primary" /> Office Location
              </h3>
              <a
                href={GOOGLE_MAPS_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] text-primary hover:underline flex items-center gap-1 font-semibold"
                aria-label="Open InfronixWeb location in Google Maps"
              >
                Directions <ArrowUpRight size={12} weight="bold" />
              </a>
            </div>

            <div 
              ref={mapContainerRef}
              className="relative w-full h-44 sm:h-48 rounded-2xl overflow-hidden border border-white/15 bg-[#12151C] shadow-md group"
            >
              {isMapVisible ? (
                <>
                  {!isMapLoaded && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#12151C] text-slate-400 text-xs gap-2 z-10">
                      <SpinnerGap size={22} className="animate-spin text-primary" />
                      <span>Loading map...</span>
                    </div>
                  )}
                  <iframe
                    title="InfronixWeb Location Map - Shree Eklingji Residency 2, Sanand, Ahmedabad"
                    src={MAP_QUERY_URL}
                    onLoad={() => setIsMapLoaded(true)}
                    className={`w-full h-full border-0 grayscale invert contrast-125 opacity-80 group-hover:grayscale-0 group-hover:invert-0 group-hover:opacity-100 transition-all duration-500 ${
                      isMapLoaded ? 'opacity-80' : 'opacity-0'
                    }`}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-[#12151C] text-slate-400 p-4 text-center">
                  <MapPin size={28} className="text-primary/70 mb-2 animate-bounce" />
                  <span className="text-xs text-slate-300 font-medium">Shree Eklingji Residency 2, Sanand</span>
                  <span className="text-[10px] text-slate-500 mt-0.5">Ahmedabad 382110</span>
                </div>
              )}

              <div className="absolute bottom-2.5 left-2.5 pointer-events-none bg-[#0B0D12]/90 backdrop-blur-xs px-2.5 py-1 rounded-lg border border-white/10 text-[10px] text-slate-200 font-medium flex items-center gap-1.5 shadow-sm z-20">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Sanand, Ahmedabad
              </div>
            </div>
            <p className="text-[11px] text-[#9CA3AF] mt-2 leading-relaxed">
              Shree Eklingji Residency 2, Sanand, Ahmedabad 382110
            </p>
          </div>

        </div>

        {/* Bottom */}
        <div className="pt-6 sm:pt-8 border-t border-[#1A1E26] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm">
          <p className="text-slate-300 font-medium">&copy; {currentYear} InfronixWeb Digital Marketing. All rights reserved.</p>
          <div className="flex items-center gap-4 sm:gap-6 text-slate-400">
            <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms-and-conditions" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
