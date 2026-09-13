"use client";
import { motion } from "framer-motion";
import { LinkedinLogo, TwitterLogo } from "@phosphor-icons/react";
import myImage from "@/assets/my-image.png";

const team = [
  {
    name: "Madhav Davda",
    role: "Founder & Lead Engineer",
    image: myImage.src,
  }
];

export default function TeamSection() {
  return (
    <section className="py-16 sm:py-20 md:py-24 bg-surface">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12">
        
        <div className="mb-12 sm:mb-16 md:mb-20 flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-8">
          <div className="max-w-2xl">
            <h2 className="text-xs sm:text-sm font-bold tracking-widest uppercase text-text-light mb-3 sm:mb-4">Leadership</h2>
            <h3 className="text-2xl sm:text-4xl md:text-5xl font-heading font-bold text-on-surface leading-tight">
              Direct access. <br className="hidden md:block" />
              Massive impact.
            </h3>
          </div>
          <p className="text-sm sm:text-base md:text-lg text-main-text max-w-md md:text-right font-medium leading-relaxed">
            We intentionally keep our operations direct. You work closely with the expert engineering and designing your product.
          </p>
        </div>

        <div className="max-w-sm sm:max-w-md md:max-w-none grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {team.map((member, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group bg-surface-container-lowest p-4 sm:p-5 rounded-xl border border-outline-variant/60 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="relative aspect-[3/4] w-full overflow-hidden rounded-lg bg-surface mb-4 sm:mb-6">
                <img 
                  src={member.image} 
                  alt={member.name} 
                  className="w-full h-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Socials on hover */}
                <div className="absolute bottom-4 left-4 right-4 flex gap-3 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                  <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-surface-container-lowest text-on-surface flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                    <LinkedinLogo size={18} weight="fill" />
                  </a>
                  <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-surface-container-lowest text-on-surface flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                    <TwitterLogo size={18} weight="fill" />
                  </a>
                </div>
              </div>
              
              <h4 className="text-xl sm:text-2xl font-heading font-bold text-on-surface mb-1">
                {member.name}
              </h4>
              <p className="text-xs sm:text-sm font-bold tracking-wider uppercase text-primary">
                {member.role}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
