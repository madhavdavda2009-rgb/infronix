"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react";

const projects = [
  {
    id: 1,
    title: "Toyon Industry Pvt Ltd",
    desc: "Developing interactive 3D visual showcases and modern digital solutions for their industrial operations.",
    tech: ["Interactive 3D", "Custom Web Platform", "Fast Loading"],
    image: "/img-2.avif",
    link: "#"
  }
];

export default function PortfolioSection() {
  return (
    <section className="py-16 sm:py-20 md:py-24 bg-surface-container-lowest">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12">
        
        {/* Header */}
        <div className="mb-10 sm:mb-16 md:mb-24 flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-8">
          <div>
            <h2 className="text-xs sm:text-sm font-bold tracking-widest uppercase text-text-light mb-3 sm:mb-4">Selected Work</h2>
            <h3 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-on-surface leading-tight">
              Digital products that <br className="hidden md:block" />
              perform and inspire.
            </h3>
            <p className="text-sm sm:text-base text-main-text font-medium mt-3 max-w-xl">
              Engineered for ambitious businesses across Ahmedabad, Gujarat, and nationwide.
            </p>
          </div>
          <Link 
            href="/projects" 
            className="group flex items-center gap-2 text-on-surface font-bold text-sm sm:text-base md:text-lg hover:text-primary transition-colors"
          >
            View All Projects 
            <ArrowUpRight weight="bold" className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </Link>
        </div>

        {/* Projects Grid */}
        <div className="flex flex-col gap-12 sm:gap-16 md:gap-20">
          {projects.map((project, index) => (
            <motion.div 
              key={project.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7, delay: index * 0.1 }}
              className="group flex flex-col lg:flex-row gap-6 sm:gap-8 lg:gap-16 items-start lg:items-center"
            >
              {/* Project Image */}
              <div className={`w-full lg:w-3/5 overflow-hidden rounded-xl bg-surface border border-outline-variant/60 ${index % 2 !== 0 ? 'lg:order-2' : ''}`}>
                <Link href={project.link} className="block relative aspect-[16/10] sm:aspect-[4/3] w-full overflow-hidden">
                  <motion.img 
                    src={project.image} 
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Floating View Project Button */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 sm:w-24 sm:h-24 bg-primary text-white rounded-full flex items-center justify-center font-bold text-xs sm:text-sm opacity-0 scale-50 group-hover:opacity-100 group-hover:scale-100 transition-all duration-500 ease-out z-10 shadow-xl">
                    View
                  </div>
                </Link>
              </div>

              {/* Project Info */}
              <div className={`w-full lg:w-2/5 flex flex-col justify-center ${index % 2 !== 0 ? 'lg:order-1' : ''}`}>
                <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-6">
                  <span className="text-xs sm:text-sm font-bold tracking-widest uppercase text-primary">
                    {project.category}
                  </span>
                  <span className="w-8 sm:w-12 h-[1px] bg-outline-variant"></span>
                </div>
                
                <h4 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-on-surface mb-3 sm:mb-6 transition-colors group-hover:text-primary">
                  <Link href={project.link}>{project.title}</Link>
                </h4>
                
                <p className="text-sm sm:text-base md:text-lg lg:text-xl text-main-text mb-6 sm:mb-8 leading-relaxed max-w-md font-medium">
                  {project.desc}
                </p>

                <div className="flex flex-wrap gap-2 sm:gap-3">
                  {project.tech.map((t, i) => (
                    <span 
                      key={i} 
                      className="px-3 py-1.5 sm:px-4 sm:py-2 border border-outline-variant text-on-surface text-xs sm:text-sm font-medium rounded-md bg-surface"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
