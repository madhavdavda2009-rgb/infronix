"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { InstagramLogo, ArrowUpRight } from "@phosphor-icons/react";

export default function Footer() {
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();

  if (pathname?.startsWith('/admin') || pathname?.startsWith('/founder-os')) {
    return null;
  }

  return (
    <footer className="bg-ink-black text-white pt-16 sm:pt-20 md:pt-24 pb-12 sm:pb-16 border-t border-[#0B0D12] relative z-20">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12">

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 sm:gap-10 lg:gap-8 mb-12 sm:mb-16 md:mb-24">
          {/* Brand */}
          <div className="sm:col-span-2">
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
              Ahmedabad&apos;s premium digital agency. We build high-converting websites, execute technical SEO, and implement AI automation.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://www.instagram.com/infronixwebagency2026"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-3.5 py-2 rounded-lg bg-white/5 border border-white/10 hover:border-primary/50 text-slate-200 hover:text-primary transition-all group"
                aria-label="Follow InfronixWeb Digital Marketing on Instagram"
              >
                <InstagramLogo size={20} weight="fill" className="text-white group-hover:text-primary transition-colors shrink-0" />
                <span className="text-xs sm:text-sm font-medium">@infronixwebagency2026</span>
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-bold tracking-widest uppercase text-xs sm:text-sm text-white mb-4 sm:mb-6">Services</h3>
            <ul className="flex flex-col gap-3 sm:gap-4 text-xs sm:text-sm">
              <li>
                <Link href="/web-development" className="text-[#9CA3AF] hover:text-primary transition-colors">Web Development</Link>
              </li>
              <li>
                <Link href="/seo" className="text-[#9CA3AF] hover:text-primary transition-colors">SEO Optimization</Link>
              </li>
              <li>
                <Link href="/ai-automation" className="text-[#9CA3AF] hover:text-primary transition-colors">AI Automation</Link>
              </li>
              <li>
                <Link href="/digital-marketing" className="text-[#9CA3AF] hover:text-primary transition-colors">Digital Marketing</Link>
              </li>
              <li>
                <Link href="/projects" className="text-[#9CA3AF] hover:text-primary transition-colors">Our Work</Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-bold tracking-widest uppercase text-xs sm:text-sm text-white mb-4 sm:mb-6">Company</h3>
            <ul className="flex flex-col gap-3 sm:gap-4 text-xs sm:text-sm">
              <li>
                <Link href="/about" className="text-[#9CA3AF] hover:text-primary transition-colors">About Us</Link>
              </li>
              <li>
                <Link href="/blog" className="text-[#9CA3AF] hover:text-primary transition-colors">Blog</Link>
              </li>
              <li>
                <Link href="/contact" className="text-[#9CA3AF] hover:text-primary transition-colors">Contact</Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
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
              <li className="text-xs text-primary font-medium">
                Mon – Sat: 9:00 AM to 8:00 PM
              </li>
              <li className="text-[#9CA3AF] mt-1">
                Ahmedabad, Gujarat, India
              </li>
            </ul>
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
