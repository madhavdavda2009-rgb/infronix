"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Code, ChartLineUp, Robot } from "@phosphor-icons/react";
import heroImg from "@/assets/hero-section.webp";
import Breadcrumb from "@/components/Breadcrumb";
import { useIntro } from "@/context/IntroContext";

export default function HeroSection() {
  const { introPhase, isIntroActive } = useIntro();

  const isPreloading = isIntroActive && introPhase === 'loading';
  const isImageHidden = isIntroActive && introPhase !== 'completed';

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: isIntroActive ? 0.35 : 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] }
    }
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 16 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1], delay: 0.15 }
    }
  };

  return (
    <section className="relative w-full flex items-center justify-center pt-6 sm:pt-8 md:pt-12 lg:pt-14 pb-14 sm:pb-18 md:pb-24 overflow-hidden bg-surface-container-lowest">
      {/* Background Subtle Ambient Lighting */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-[380px] sm:w-[540px] h-[380px] sm:h-[540px] bg-primary/[0.07] rounded-full blur-[100px] sm:blur-[130px]" />
        <div className="absolute bottom-1/4 left-1/4 w-[300px] sm:w-[450px] h-[300px] sm:h-[450px] bg-violet-400/[0.05] rounded-full blur-[80px] sm:blur-[110px]" />
      </div>

      <div className="max-w-[1440px] w-full mx-auto px-4 sm:px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 xl:gap-14 items-center">

          {/* Left Column: Text & Content (7 Cols) */}
          <motion.div
            className={`order-1 lg:col-span-7 xl:col-span-7 transition-all duration-700 ${
              isPreloading ? 'opacity-0 translate-y-6 pointer-events-none' : 'opacity-100 translate-y-0'
            }`}
            variants={containerVariants}
            initial={isPreloading ? "hidden" : false}
            animate={isPreloading ? "hidden" : "visible"}
          >
            <Breadcrumb />

            {/* Headline */}
            <motion.h1
              variants={itemVariants}
              className="text-3xl sm:text-5xl md:text-6xl lg:text-6xl xl:text-7xl leading-[1.1] sm:leading-[1.05] font-heading font-bold text-on-surface tracking-tight mb-5 sm:mb-7"
            >
              Build, Grow &amp;<br />
              Automate<br />
              <span className="text-text-light font-normal">your business with</span><br />
              <span className="relative inline-block text-on-surface">
                InfronixWeb.
                <svg className="absolute -bottom-1 sm:-bottom-2 left-0 w-full h-2 sm:h-3 text-primary" viewBox="0 0 100 10" preserveAspectRatio="none" aria-hidden="true">
                  <path d="M0 5 Q 50 10 100 5" fill="transparent" stroke="currentColor" strokeWidth="4" />
                </svg>
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              variants={itemVariants}
              className="text-base sm:text-lg md:text-xl text-main-text max-w-2xl mb-7 sm:mb-9 font-normal leading-relaxed"
            >
              Your digital agency in Ahmedabad for bespoke web applications, search engine visibility, performance marketing, and automated customer workflows.
            </motion.p>

            {/* CTAs */}
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 sm:gap-5 w-full sm:w-auto">
              <Link
                href="/start-project"
                className="group relative inline-flex items-center justify-center gap-2.5 bg-primary text-white font-semibold text-sm sm:text-base md:text-lg px-7 py-3.5 sm:px-8 sm:py-4 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5 active:translate-y-0 text-center"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Get a Quote <ArrowRight weight="bold" className="group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-primary-dark transform scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 ease-out" />
              </Link>

              <Link
                href="#services"
                className="inline-flex items-center justify-center gap-2 bg-surface text-on-surface border border-outline hover:border-primary/50 hover:bg-surface-container-lowest font-medium text-sm sm:text-base md:text-lg px-7 py-3.5 sm:px-8 sm:py-4 rounded-xl transition-all hover:shadow-sm text-center"
              >
                Explore Services
              </Link>
            </motion.div>

            {/* Key Service Highlights */}
            <motion.div variants={itemVariants} className="mt-8 sm:mt-12 md:mt-14 pt-5 sm:pt-7 border-t border-outline flex flex-wrap items-center gap-4 sm:gap-6 md:gap-10">
              <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-on-surface tracking-wider uppercase">
                <Code size={18} weight="bold" className="text-primary shrink-0" /> Custom Websites
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-on-surface tracking-wider uppercase">
                <ChartLineUp size={18} weight="bold" className="text-primary shrink-0" /> SEO & Digital Marketing
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-on-surface tracking-wider uppercase">
                <Robot size={18} weight="bold" className="text-primary shrink-0" /> Smart Automations
              </div>
            </motion.div>

          </motion.div>

          {/* Right Column: Hero Visual Photo (5 Cols) */}
          <motion.div
            id="hero-image-target"
            className="order-2 lg:col-span-5 xl:col-span-5 flex justify-center items-center relative mb-4 sm:mb-6 lg:mb-0"
            variants={imageVariants}
            initial={isPreloading ? "hidden" : false}
            animate={isPreloading ? "hidden" : "visible"}
          >
            <div className="relative w-full max-w-[320px] sm:max-w-[420px] lg:max-w-[480px] mx-auto flex items-center justify-center">

              {/* Background gradient decorative glow */}
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-violet-500/15 to-transparent rounded-full blur-3xl transform scale-90 opacity-70 pointer-events-none" />

              {/* Clean Hero Person Image without overlays or borders */}
              <div className="relative w-full flex items-center justify-center">
                <Image
                  id="hero-image-element"
                  src={heroImg}
                  alt="InfronixWeb Digital Agency"
                  className="w-full h-auto max-h-[420px] sm:max-h-[500px] lg:max-h-[540px] object-contain drop-shadow-xl"
                  priority={true}
                  fetchPriority="high"
                  loading="eager"
                  sizes="(max-width: 640px) 320px, (max-width: 1024px) 420px, 480px"
                  quality={90}
                  style={{
                    opacity: isImageHidden ? 0 : 1,
                    transition: 'opacity 0.2s ease',
                  }}
                />
              </div>

            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
