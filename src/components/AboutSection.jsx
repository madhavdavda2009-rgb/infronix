"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react";

export default function AboutSection() {
  return (
    <section className="py-16 sm:py-20 md:py-24 bg-surface">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12">
        <div className="flex flex-col lg:flex-row gap-10 sm:gap-16 lg:gap-24 items-center">
          
          {/* Left: Large Typography & Context */}
          <div className="w-full lg:w-1/2">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-xs sm:text-sm font-bold tracking-widest uppercase text-text-light mb-3 sm:mb-6">Why Infronix</h2>
              
              <h3 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-on-surface leading-[1.15] sm:leading-[1.1] mb-6 sm:mb-8">
                Built to solve the <br className="hidden md:block" />
                fragmentation <br className="hidden md:block" />
                problem.
              </h3>
              
              <div className="w-16 sm:w-20 h-1 bg-primary mb-6 sm:mb-8" />
              
              <p className="text-base sm:text-xl md:text-2xl text-on-surface font-medium leading-relaxed mb-4 sm:mb-6">
                Most agencies do one thing well. You hire them for a website, then need another for SEO, and a completely different consultant for automation.
              </p>
              
              <p className="text-sm sm:text-base md:text-lg text-main-text leading-relaxed mb-6 sm:mb-10 font-medium">
                Infronix was founded by a close-knit, highly technical team to stop this cycle. We bridge the gap between premium design, organic search growth, and cutting-edge AI integrations—delivering a unified digital ecosystem for small and growing businesses.
              </p>
              
              <Link 
                href="/about" 
                className="inline-flex items-center gap-2 sm:gap-3 font-bold text-on-surface hover:text-primary transition-colors uppercase tracking-wider text-xs sm:text-sm border-b-2 border-transparent hover:border-primary pb-1"
              >
                Read Our Story <ArrowRight weight="bold" />
              </Link>
            </motion.div>
          </div>

          {/* Right: Editorial Images & Stats */}
          <div className="w-full lg:w-1/2 relative mt-6 lg:mt-0">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative aspect-square md:aspect-[4/5] w-full max-w-sm sm:max-w-lg mx-auto"
            >
              {/* Main Image placeholder */}
              <div className="absolute inset-0 bg-surface-container-lowest rounded-xl overflow-hidden border border-outline-variant/60 shadow-lg">
                <img 
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80" 
                  alt="Infronix Team Collaboration" 
                  className="w-full h-full object-cover grayscale opacity-90 hover:grayscale-0 transition-all duration-700"
                />
              </div>
              
              {/* Floating Stat Card 1 */}
              <motion.div 
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="absolute left-2 sm:-left-6 md:-left-12 top-1/4 bg-surface-container-lowest p-3 sm:p-5 md:p-6 shadow-xl border border-outline-variant rounded-lg"
              >
                <div className="text-xl sm:text-3xl md:text-4xl font-heading font-bold text-on-surface mb-0.5 sm:mb-1">
                  All-in-One
                </div>
                <div className="text-[10px] sm:text-xs md:text-sm font-bold tracking-wider uppercase text-primary">
                  Methodology
                </div>
              </motion.div>

              {/* Floating Stat Card 2 */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="absolute right-2 sm:-right-6 md:-right-12 bottom-1/4 bg-ink-black text-white p-3 sm:p-5 md:p-6 shadow-xl rounded-lg border border-[#1A1E26]"
              >
                <div className="text-xl sm:text-3xl md:text-4xl font-heading font-bold mb-0.5 sm:mb-1">
                  100%
                </div>
                <div className="text-[10px] sm:text-xs md:text-sm font-bold tracking-wider uppercase text-primary">
                  Dedicated Direct
                </div>
              </motion.div>

            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
