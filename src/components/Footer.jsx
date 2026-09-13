"use client";
import Link from "next/link";
import { LinkedinLogo, TwitterLogo, InstagramLogo, ArrowUpRight } from "@phosphor-icons/react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-ink-black text-white pt-16 sm:pt-20 md:pt-24 pb-8 border-t border-[#0B0D12]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12">

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 sm:gap-10 lg:gap-8 mb-12 sm:mb-16 md:mb-24">
          {/* Brand */}
          <div className="sm:col-span-2">
            <Link href="/" className="inline-block mb-4 sm:mb-6">
              <img src="/dark-web-logo.png" alt="Infronix Web Agency" className="h-8 sm:h-10 md:h-12 w-auto object-contain hover:opacity-90 transition-opacity" />
            </Link>
            <p className="text-[#6B7280] max-w-sm mb-6 sm:mb-8 leading-relaxed text-sm sm:text-base">
              Ahmedabad&apos;s premium digital agency. We build high-converting websites, execute technical SEO, and implement AI automation.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="text-[#6B7280] hover:text-primary transition-colors" aria-label="LinkedIn">
                <LinkedinLogo size={22} weight="fill" />
              </a>
              <a href="#" className="text-[#6B7280] hover:text-primary transition-colors" aria-label="Twitter">
                <TwitterLogo size={22} weight="fill" />
              </a>
              <a href="#" className="text-[#6B7280] hover:text-primary transition-colors" aria-label="Instagram">
                <InstagramLogo size={22} weight="fill" />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-bold tracking-widest uppercase text-xs sm:text-sm text-white mb-4 sm:mb-6">Services</h4>
            <ul className="flex flex-col gap-3 sm:gap-4 text-xs sm:text-sm">
              <li>
                <Link href="/web-development" className="text-[#6B7280] hover:text-primary transition-colors">Web Development</Link>
              </li>
              <li>
                <Link href="/seo" className="text-[#6B7280] hover:text-primary transition-colors">SEO Optimization</Link>
              </li>
              <li>
                <Link href="/ai-automation" className="text-[#6B7280] hover:text-primary transition-colors">AI Automation</Link>
              </li>
              <li>
                <Link href="/digital-marketing" className="text-[#6B7280] hover:text-primary transition-colors">Digital Marketing</Link>
              </li>
              <li>
                <Link href="/projects" className="text-[#6B7280] hover:text-primary transition-colors">Our Work</Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-bold tracking-widest uppercase text-xs sm:text-sm text-white mb-4 sm:mb-6">Company</h4>
            <ul className="flex flex-col gap-3 sm:gap-4 text-xs sm:text-sm">
              <li>
                <Link href="/about" className="text-[#6B7280] hover:text-primary transition-colors">About Us</Link>
              </li>
              <li>
                <Link href="/blog" className="text-[#6B7280] hover:text-primary transition-colors">Blog</Link>
              </li>
              <li>
                <Link href="/contact" className="text-[#6B7280] hover:text-primary transition-colors">Contact</Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold tracking-widest uppercase text-xs sm:text-sm text-white mb-4 sm:mb-6">Contact</h4>
            <ul className="flex flex-col gap-3 sm:gap-4 text-xs sm:text-sm">
              <li>
                <a href="mailto:hello@infronixweb.in" className="group flex items-center gap-1.5 text-[#6B7280] hover:text-primary transition-colors break-all">
                  hello@infronixweb.in <ArrowUpRight className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform shrink-0" />
                </a>
              </li>
              <li className="text-[#6B7280]">
                +91 63557 92936
              </li>
              <li className="text-[#6B7280] mt-2 sm:mt-4">
                Ahmedabad, Gujarat <br />
                India
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-6 sm:pt-8 border-t border-[#1A1E26] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm text-[#6B7280]">
          <p>&copy; {currentYear} Infronix Web Agency. All rights reserved.</p>
          <div className="flex items-center gap-4 sm:gap-6">
            <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms-and-conditions" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
