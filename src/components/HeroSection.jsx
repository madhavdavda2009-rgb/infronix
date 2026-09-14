"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Code, ChartLineUp, Robot } from "@phosphor-icons/react";
import heroImg from "@/assets/hero-section.png";
import Breadcrumb from "@/components/Breadcrumb";

export default function HeroSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } 
    }
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.92, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.3 }
    }
  };

  return (
    <section className="relative w-full flex items-center justify-center pt-2 sm:pt-4 md:pt-6 lg:pt-8 pb-10 sm:pb-14 overflow-hidden bg-surface-container-lowest">
      {/* Background subtle elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-soft-violet rounded-full blur-[80px] sm:blur-[100px] opacity-40 mix-blend-multiply animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute bottom-1/4 left-1/4 w-[250px] sm:w-[400px] h-[250px] sm:h-[400px] bg-[#00F5D4]/20 rounded-full blur-[60px] sm:blur-[80px] opacity-60 mix-blend-multiply" />
      </div>

      <div className="max-w-[1440px] w-full mx-auto px-4 sm:px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 xl:gap-12 items-center">
          
          {/* Left Column: Text & Content (7 Cols) */}
          <motion.div 
            className="lg:col-span-7 xl:col-span-7"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <Breadcrumb />

            {/* Trust indicator */}
            <motion.div variants={itemVariants} className="flex items-center gap-3 mb-5 sm:mb-7">
              <span className="flex items-center gap-1.5 text-[10px] sm:text-xs font-bold tracking-wider sm:tracking-widest uppercase text-main-text bg-soft-violet/50 px-2.5 sm:px-3 py-1 rounded-sm">
                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-primary animate-pulse" />
                Ahmedabad&apos;s Premium Digital Agency
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1 
              variants={itemVariants}
              className="text-3xl sm:text-5xl md:text-6xl lg:text-6xl xl:text-7xl leading-[1.1] sm:leading-[1.05] font-heading font-bold text-on-surface tracking-tight mb-5 sm:mb-7"
            >
              Websites. SEO.<br />
              AI Automation.<br />
              <span className="text-text-light">Built to move your</span><br />
              <span className="relative inline-block">
                business forward.
                <svg className="absolute -bottom-1 sm:-bottom-2 left-0 w-full h-2 sm:h-3 text-primary" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0 5 Q 50 10 100 5" fill="transparent" stroke="currentColor" strokeWidth="4" />
                </svg>
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p 
              variants={itemVariants}
              className="text-base sm:text-lg md:text-xl text-main-text max-w-2xl mb-7 sm:mb-9 font-medium leading-relaxed"
            >
              We build custom, fast-loading websites, help more customers find you on Google, and automate repetitive tasks to grow your business.
            </motion.p>

            {/* CTAs */}
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-6 w-full sm:w-auto">
              <Link 
                href="/start-project" 
                className="group relative flex items-center justify-center gap-2 bg-primary text-white font-bold text-sm sm:text-base md:text-lg px-6 py-3.5 sm:px-8 sm:py-4 rounded-md overflow-hidden transition-transform hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_20px_rgba(139, 92, 246,0.2)] text-center"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Get a Quote <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-primary-dark transform scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 ease-out" />
              </Link>
              
              <Link 
                href="#services" 
                className="flex items-center justify-center gap-2 bg-transparent border border-outline-variant text-on-surface font-medium text-sm sm:text-base md:text-lg px-6 py-3.5 sm:px-8 sm:py-4 rounded-md hover:border-primary hover:bg-soft-violet/20 transition-colors text-center"
              >
                Explore Services
              </Link>
            </motion.div>

            {/* Key Service Highlights */}
            <motion.div variants={itemVariants} className="mt-8 sm:mt-12 md:mt-14 pt-5 sm:pt-7 border-t border-outline-variant flex flex-wrap items-center gap-4 sm:gap-6 md:gap-10 opacity-80">
              <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-on-surface tracking-wider uppercase">
                <Code size={18} weight="bold" className="text-primary shrink-0" /> Custom Websites
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-on-surface tracking-wider uppercase">
                <ChartLineUp size={18} weight="bold" className="text-primary shrink-0" /> Google Search Growth
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-on-surface tracking-wider uppercase">
                <Robot size={18} weight="bold" className="text-primary shrink-0" /> Smart Automations
              </div>
            </motion.div>

          </motion.div>

          {/* Right Column: Hero Visual Photo (5 Cols) */}
          <motion.div
            className="lg:col-span-5 xl:col-span-5 flex justify-center items-center relative mt-2 lg:mt-0"
            variants={imageVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="relative w-full max-w-[320px] sm:max-w-[420px] lg:max-w-[480px] mx-auto flex items-center justify-center">
              
              {/* Background gradient decorative glow */}
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/25 via-soft-violet/40 to-[#00F5D4]/20 rounded-full blur-3xl transform scale-90 opacity-60 pointer-events-none" />
              
              {/* Clean Hero Person Image without overlays or borders */}
              <div className="relative w-full flex items-center justify-center">
                <Image
                  src={heroImg}
                  alt="InfronixWeb Digital Marketing Hero"
                  className="w-full h-auto max-h-[420px] sm:max-h-[500px] lg:max-h-[540px] object-contain drop-shadow-2xl"
                  priority
                />
              </div>

            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}

