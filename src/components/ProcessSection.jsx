"use client";
import { motion, useScroll } from "framer-motion";
import { useRef } from "react";

const steps = [
  { id: "01", title: "Discover", desc: "We learn about your business, your ideal customers, and your growth goals to architect a tailored digital plan." },
  { id: "02", title: "Plan", desc: "We design clean visual layouts, organize conversion-focused page hierarchy, and plan your organic search strategy." },
  { id: "03", title: "Build", desc: "We build your website, connect the tools you need and check that everything works smoothly on phones and computers." },
  { id: "04", title: "Launch", desc: "Thorough testing on mobile, tablet, and desktop screens to ensure flawless responsiveness and performance before go-live." },
  { id: "05", title: "Grow", desc: "Ongoing search ranking optimization, automated customer workflows, and continuous improvements to help you capture and convert more leads." }
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
        
        <div className="text-center mb-12 sm:mb-16 md:mb-20">
          <span className="block text-xs sm:text-sm font-semibold tracking-widest uppercase text-text-light mb-3 sm:mb-4">Our Methodology</span>
          <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-on-surface">
            How we <span className="text-primary">execute.</span>
          </h2>
        </div>

        <div className="relative">
          {/* Vertical Progress Line (Background) */}
          <div className="absolute left-4 sm:left-6 md:left-1/2 top-0 bottom-0 w-[1px] bg-outline md:-translate-x-1/2" />
          
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
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6 }}
                  className={`flex flex-col md:flex-row items-start md:items-center ${isEven ? 'md:flex-row-reverse' : ''}`}
                >
                  {/* Content */}
                  <div className={`w-full md:w-1/2 pl-10 sm:pl-16 md:pl-0 ${isEven ? 'md:pr-16 md:text-right' : 'md:pl-16'}`}>
                    <div className="md:hidden text-2xl sm:text-3xl font-heading font-bold text-primary/30 mb-1">{step.id}</div>
                    <h3 className="text-xl sm:text-2xl md:text-3xl font-heading font-bold text-on-surface mb-2 sm:mb-3">
                      {step.title}
                    </h3>
                    <p className="text-sm sm:text-base md:text-lg text-main-text leading-relaxed font-normal">
                      {step.desc}
                    </p>
                  </div>

                  {/* Center Node */}
                  <div className="absolute left-4 sm:left-6 md:left-1/2 w-4 h-4 rounded-full bg-white border-2 border-primary -translate-x-[7px] md:-translate-x-[8px] mt-1.5 sm:mt-2 md:mt-0 shadow-md ring-4 ring-primary/10" />

                  {/* Large Number (Desktop) */}
                  <div className={`hidden md:block w-1/2 ${isEven ? 'pl-16 text-left' : 'pr-16 text-right'}`}>
                    <span className="text-[90px] lg:text-[120px] font-heading font-bold text-outline/60 leading-none select-none">
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
