"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { 
  InstagramLogo, LinkedinLogo, GithubLogo, LinkSimple, ArrowRight, User 
} from "@phosphor-icons/react";
import myImage from "@/assets/my-image.webp";

const DEFAULT_FOUNDER = {
  id: "founder-canonical",
  name: "Madhav Davda",
  role: "Founder & Lead Engineer",
  public_role: "Founder & Lead Engineer",
  public_bio: "We intentionally keep our operations direct. You work closely with the expert engineering and designing your product.",
  profile_image_url: myImage.src,
  instagram_url: "https://www.instagram.com/madhavdavda09",
  is_founder: true,
  employment_type: "Founder"
};

export default function TeamSection() {
  const [teamMembers, setTeamMembers] = useState([DEFAULT_FOUNDER]);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    async function loadTeam() {
      try {
        const res = await fetch('/api/public/team?page=home', {
          signal: controller.signal
        });
        if (!res.ok) return;
        const data = await res.json();
        if (data.success && Array.isArray(data.team) && data.team.length > 0 && isMounted) {
          const formatted = data.team.map((m) => {
            const isFounder = m.is_founder || m.employment_type === 'Founder' || m.name?.toLowerCase().includes('madhav');
            return {
              ...m,
              image: m.profile_image_url || (isFounder ? myImage.src : null),
              role: m.public_role || m.role || "Team Member"
            };
          });
          setTeamMembers(formatted);
        }
      } catch (_) {
        // Fallback gracefully to default founder without throwing console error
      } finally {
        clearTimeout(timeoutId);
        if (isMounted) setHasLoaded(true);
      }
    }
    loadTeam();
    return () => {
      isMounted = false;
      controller.abort();
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <section className="py-16 sm:py-20 md:py-24 bg-surface" id="leadership">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12">
        
        <div className="mb-12 sm:mb-16 md:mb-20 flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-8">
          <div className="max-w-2xl">
            <span className="block text-xs sm:text-sm font-bold tracking-widest uppercase text-text-light mb-3 sm:mb-4">Leadership & Engineering</span>
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-heading font-bold text-on-surface leading-tight">
              Direct access. <br className="hidden md:block" />
              Massive impact.
            </h2>
          </div>
          <p className="text-sm sm:text-base md:text-lg text-main-text max-w-md md:text-right font-medium leading-relaxed">
            We intentionally keep our operations direct. You work closely with the experts engineering and designing your digital product.
          </p>
        </div>

        <div className="max-w-sm sm:max-w-md md:max-w-none grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {teamMembers.map((member, index) => {
            const isFounder = member.is_founder || member.employment_type === 'Founder' || member.name.toLowerCase().includes('madhav');
            const memberImage = member.image || member.profile_image_url || (isFounder ? myImage.src : null);

            return (
              <motion.div 
                key={member.id || index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group bg-surface-container-lowest p-4 sm:p-5 rounded-xl border border-outline-variant/60 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-[3/4] w-full overflow-hidden rounded-lg bg-surface mb-4 sm:mb-6 flex items-center justify-center">
                    {memberImage ? (
                      <Image 
                        src={memberImage} 
                        alt={`${member.name} - ${member.role}`} 
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 380px"
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-surface-container-lowest to-surface text-text-light p-6 text-center">
                        <div className="w-20 h-20 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-heading font-bold text-2xl mb-3">
                          {member.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                        </div>
                        <span className="text-xs font-semibold uppercase tracking-wider text-text-light">InfronixWeb</span>
                      </div>
                    )}
                  </div>
                  
                  <h3 className="text-xl sm:text-2xl font-heading font-bold text-on-surface mb-1">
                    {member.name}
                  </h3>
                  <p className="text-xs sm:text-sm font-bold tracking-wider uppercase text-primary mb-2">
                    {member.role}
                  </p>

                  {member.public_bio && (
                    <p className="text-xs sm:text-sm text-main-text leading-relaxed line-clamp-3 mb-3">
                      {member.public_bio}
                    </p>
                  )}
                </div>

                <div className="pt-3 border-t border-outline-variant/40 flex items-center justify-between text-xs mt-2">
                  <div className="flex items-center gap-2.5 text-text-light">
                    {member.linkedin_url && (
                      <a
                        href={member.linkedin_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-primary transition-colors"
                        aria-label={`${member.name} LinkedIn Profile`}
                      >
                        <LinkedinLogo size={17} weight="fill" />
                      </a>
                    )}
                    {member.github_url && (
                      <a
                        href={member.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-on-surface transition-colors"
                        aria-label={`${member.name} GitHub Profile`}
                      >
                        <GithubLogo size={17} weight="fill" />
                      </a>
                    )}
                    {member.portfolio_url && (
                      <a
                        href={member.portfolio_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-primary transition-colors"
                        aria-label={`${member.name} Portfolio`}
                      >
                        <LinkSimple size={17} weight="bold" />
                      </a>
                    )}
                  </div>

                  {member.instagram_url && (
                    <a
                      href={member.instagram_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-light hover:text-primary transition-colors"
                      aria-label={`${member.name} Instagram`}
                    >
                      <InstagramLogo size={16} weight="fill" />
                      <span>{member.instagram_url.includes('instagram.com/') ? `@${member.instagram_url.split('instagram.com/')[1].replace(/\/$/, '')}` : 'Instagram'}</span>
                    </a>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {teamMembers.length > 3 && (
          <div className="mt-12 text-center">
            <Link 
              href="/about#team" 
              className="inline-flex items-center gap-2 text-sm font-bold text-on-surface hover:text-primary transition-colors uppercase tracking-wider border-b border-primary pb-1"
            >
              Meet the complete team on About Us <ArrowRight weight="bold" />
            </Link>
          </div>
        )}

      </div>
    </section>
  );
}

