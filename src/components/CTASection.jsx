"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react";

export default function CTASection() {
  return (
    <section className="relative py-16 sm:py-24 md:py-32 bg-ink-black overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[600px] h-[350px] sm:h-[600px] bg-primary/[0.12] rounded-full blur-[120px] sm:blur-[160px] pointer-events-none" />
      
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12 relative z-10">
        <div className="flex flex-col items-center text-center">
          
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-4xl"
          >
            <h2 className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-heading font-bold text-white leading-[1.1] sm:leading-[0.95] tracking-tight mb-4 sm:mb-8">
              Have a <br />
              <span className="text-primary">business idea?</span>
            </h2>
            
            <p className="text-base sm:text-xl md:text-3xl text-slate-300 font-normal mb-8 sm:mb-14">
              Let&apos;s build your next step.
            </p>
            
            <Link 
              href="/start-project" 
              className="group relative inline-flex items-center justify-center gap-2.5 sm:gap-3 bg-primary text-white font-semibold text-sm sm:text-lg md:text-xl px-7 py-4 sm:px-10 sm:py-5 md:px-12 md:py-5.5 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 active:translate-y-0 text-center"
            >
              <span className="relative z-10 flex items-center justify-center gap-2 sm:gap-3">
                Get a Quote <ArrowRight weight="bold" className="group-hover:translate-x-1.5 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-primary-dark transform scale-y-0 group-hover:scale-y-100 origin-bottom transition-transform duration-500 ease-out" />
            </Link>
          </motion.div>
          
        </div>
      </div>
    </section>
  );
}
