"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const steps = [
  { id: "01", title: "Discover", desc: "We learn about your business, your ideal customers, and your goals to create a clear plan for online growth." },
  { id: "02", title: "Plan", desc: "We design clean visual layouts, organize your page content, and plan your Google search strategy." },
  { id: "03", title: "Build", desc: "We build your custom website with clean, fast-loading code, easy navigation, and modern security." },
  { id: "04", title: "Launch", desc: "Thorough testing on mobile phones, tablets, and desktop screens to ensure everything works smoothly before launch." },
  { id: "05", title: "Grow", desc: "Ongoing Google ranking support, smart automation setup, and continuous improvements to help you win more customers." }
];

export default function ProcessSection() {
  const containerRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  return (
    <section className="py-16 sm:py-24 md:py-32 bg-surface-container-lowest" ref={containerRef}>
      <div className="max-w-[1000px] mx-auto px-4 sm:px-6 md:px-12">
        
        <div className="text-center mb-12 sm:mb-16 md:mb-24">
          <h2 className="text-xs sm:text-sm font-bold tracking-widest uppercase text-text-light mb-3 sm:mb-4">Our Methodology</h2>
          <h3 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-on-surface">
            How we <span className="text-primary">execute.</span>
          </h3>
        </div>

        <div className="relative">
          {/* Vertical Progress Line (Background) */}
          <div className="absolute left-4 sm:left-6 md:left-1/2 top-0 bottom-0 w-[1px] bg-outline-variant md:-translate-x-1/2" />
          
          {/* Vertical Progress Line (Active) */}
          <motion.div 
            className="absolute left-4 sm:left-6 md:left-1/2 top-0 bottom-0 w-[2px] bg-primary md:-translate-x-1/2 origin-top"
            style={{ scaleY: scrollYProgress }}
          />

          <div className="flex flex-col gap-10 sm:gap-16 md:gap-24 relative z-10">
            {steps.map((step, index) => {
              const isEven = index % 2 === 0;
              return (
                <motion.div 
                  key={step.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6 }}
                  className={`flex flex-col md:flex-row items-start md:items-center ${isEven ? 'md:flex-row-reverse' : ''}`}
                >
                  {/* Content */}
                  <div className={`w-full md:w-1/2 pl-10 sm:pl-16 md:pl-0 ${isEven ? 'md:pr-16 md:text-right' : 'md:pl-16'}`}>
                    <div className="md:hidden text-2xl sm:text-3xl font-heading font-bold text-primary/30 mb-1">{step.id}</div>
                    <h4 className="text-xl sm:text-2xl md:text-3xl font-heading font-bold text-on-surface mb-2 sm:mb-4">
                      {step.title}
                    </h4>
                    <p className="text-sm sm:text-base md:text-lg text-main-text leading-relaxed font-medium">
                      {step.desc}
                    </p>
                  </div>

                  {/* Center Node */}
                  <div className="absolute left-4 sm:left-6 md:left-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-surface-container-lowest border-2 border-primary -translate-x-[6px] sm:-translate-x-[7px] md:-translate-x-[7px] mt-1.5 sm:mt-2 md:mt-0 shadow-[0_0_10px_rgba(139,92,246,0.4)]" />

                  {/* Large Number (Desktop) */}
                  <div className={`hidden md:block w-1/2 ${isEven ? 'pl-16 text-left' : 'pr-16 text-right'}`}>
                    <span className="text-[90px] lg:text-[120px] font-heading font-bold text-outline-variant/60 leading-none select-none">
                      {step.id}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
