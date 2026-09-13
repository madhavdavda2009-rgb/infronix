"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react";

export default function CTASection() {
  return (
    <section className="relative py-16 sm:py-24 md:py-32 bg-ink-black overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[600px] h-[300px] sm:h-[600px] bg-primary rounded-full blur-[100px] sm:blur-[150px] opacity-15 pointer-events-none" />
      
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12 relative z-10">
        <div className="flex flex-col items-center text-center">
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="w-full max-w-4xl"
          >
            <h2 className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-heading font-bold text-white leading-[1.1] sm:leading-[0.95] tracking-tight mb-4 sm:mb-8">
              Have a <br />
              <span className="text-primary">business idea?</span>
            </h2>
            
            <p className="text-base sm:text-xl md:text-3xl text-[#cccccc] font-medium mb-8 sm:mb-16">
              Let&apos;s build what comes next.
            </p>
            
            <Link 
              href="/start-project" 
              className="group relative inline-flex items-center justify-center gap-2 sm:gap-3 bg-primary text-white font-bold text-sm sm:text-lg md:text-xl px-6 py-3.5 sm:px-10 sm:py-5 md:px-12 md:py-6 rounded-md overflow-hidden transition-transform hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(139, 92, 246,0.4)] w-full sm:w-auto text-center"
            >
              <span className="relative z-10 flex items-center justify-center gap-2 sm:gap-3">
                Get a Quote <ArrowRight className="group-hover:translate-x-2 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-primary-dark transform scale-y-0 group-hover:scale-y-100 origin-bottom transition-transform duration-500 ease-out" />
            </Link>
          </motion.div>
          
        </div>
      </div>
    </section>
  );
}
