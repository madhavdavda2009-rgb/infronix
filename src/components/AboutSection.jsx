"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "@phosphor-icons/react";

export default function AboutSection({ asH1 = false }) {
  const Heading = asH1 ? "h1" : "h2";
  return (
    <section className="py-16 sm:py-20 md:py-24 bg-surface">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12">
        <div className="flex flex-col lg:flex-row gap-10 sm:gap-16 lg:gap-24 items-center">
          
          {/* Left: Large Typography & Context */}
          <div className="w-full lg:w-1/2">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7 }}
            >
              <span className="block text-xs sm:text-sm font-semibold tracking-widest uppercase text-text-light mb-3 sm:mb-5">Why InfronixWeb</span>
              
              <Heading className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-on-surface leading-[1.15] sm:leading-[1.1] mb-6 sm:mb-8">
                Built to solve the <br className="hidden md:block" />
                fragmentation <br className="hidden md:block" />
                problem.
              </Heading>
              
              <div className="w-16 sm:w-20 h-1 bg-primary mb-6 sm:mb-8 rounded-full" />
              
              <p className="text-base sm:text-xl md:text-2xl text-on-surface font-medium leading-relaxed mb-4 sm:mb-6">
                Your website, marketing and customer follow-up should work together. We help you bring them into one clear plan, so people can find your business and easily get in touch.
              </p>
              
              <p className="text-sm sm:text-base md:text-lg text-main-text leading-relaxed mb-6 sm:mb-9 font-normal">
                We eliminate the friction of dealing with multiple disconnected vendors. From a useful website to digital marketing and better Google search visibility, we bring your online presence together under one accountable team.
              </p>
              
              <Link 
                href="/about" 
                className="inline-flex items-center gap-2 sm:gap-3 font-semibold text-on-surface hover:text-primary transition-colors uppercase tracking-wider text-xs sm:text-sm border-b-2 border-transparent hover:border-primary pb-1"
              >
                Read Our Story <ArrowRight weight="bold" />
              </Link>
            </motion.div>
          </div>

          {/* Right: Editorial Images & Stats */}
          <div className="w-full lg:w-1/2 relative mt-6 lg:mt-0">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="relative aspect-square md:aspect-[4/5] w-full max-w-sm sm:max-w-lg mx-auto"
            >
              {/* Main Image */}
              <div className="absolute inset-0 bg-surface-container-lowest rounded-3xl overflow-hidden border border-outline shadow-lg">
                <Image 
                  src="/img-1.avif" 
                  alt="InfronixWeb Digital Agency Team" 
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 500px"
                  className="object-cover"
                  loading="lazy"
                />
              </div>
              
              {/* Floating Stat Card 1 */}
              <motion.div 
                initial={{ opacity: 0, x: -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="absolute left-2 sm:-left-6 md:-left-10 top-1/4 bg-white/95 backdrop-blur-md p-4 sm:p-5 md:p-6 shadow-xl border border-slate-200/80 rounded-2xl"
              >
                <div className="text-xl sm:text-3xl md:text-4xl font-heading font-bold text-on-surface mb-0.5 sm:mb-1">
                  All-in-One
                </div>
                <div className="text-[10px] sm:text-xs md:text-sm font-semibold tracking-wider uppercase text-primary">
                  Methodology
                </div>
              </motion.div>

              {/* Floating Stat Card 2 */}
              <motion.div 
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.7 }}
                className="absolute right-2 sm:-right-6 md:-right-10 bottom-1/4 bg-[#0E1118]/95 backdrop-blur-md text-white p-4 sm:p-5 md:p-6 shadow-xl rounded-2xl border border-white/10"
              >
                <div className="text-xl sm:text-3xl md:text-4xl font-heading font-bold mb-0.5 sm:mb-1">
                  Direct
                </div>
                <div className="text-[10px] sm:text-xs md:text-sm font-semibold tracking-wider uppercase text-violet-400">
                  Specialist Access
                </div>
              </motion.div>

            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
