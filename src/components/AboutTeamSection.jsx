"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { 
  InstagramLogo, LinkedinLogo, GithubLogo, LinkSimple, ShieldCheck 
} from "@phosphor-icons/react";
import myImage from "@/assets/my-image.webp";

const DEFAULT_FOUNDER = {
  id: "founder-canonical",
  name: "Madhav Davda",
  role: "Founder & Lead Engineer",
  public_role: "Founder & Lead Engineer",
  public_bio: "Leading engineering and technical architecture at InfronixWeb. Focused on building high-performance web applications, AI automation pipelines, and scalable digital solutions for growing businesses.",
  profile_image_url: myImage.src,
  instagram_url: "https://www.instagram.com/madhavdavda09",
  is_founder: true,
  employment_type: "Founder"
};

export default function AboutTeamSection() {
  const [teamMembers, setTeamMembers] = useState([DEFAULT_FOUNDER]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    async function loadTeam() {
      try {
        const res = await fetch('/api/public/team?page=about', {
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
        // Fallback gracefully without console noise
      } finally {
        clearTimeout(timeoutId);
        if (isMounted) setLoading(false);
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
    <section className="py-16 sm:py-20 md:py-24 bg-surface border-b border-outline-variant/30" id="team">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12">
        
        {/* Header */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <h2 className="text-xs sm:text-sm font-bold tracking-widest uppercase text-text-light mb-3">The People Behind InfronixWeb</h2>
          <h3 className="text-2xl sm:text-4xl md:text-5xl font-heading font-bold text-on-surface leading-tight mb-4">
            Engineering excellence, <br className="hidden sm:block" />
            driven by specialists.
          </h3>
          <p className="text-sm sm:text-base md:text-lg text-main-text font-medium leading-relaxed">
            Our team brings together full-stack engineering, performance optimization, UX architecture, and modern automation to deliver exceptional digital outcomes.
          </p>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
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
                className="group bg-surface-container-lowest p-5 sm:p-6 rounded-2xl border border-outline-variant/60 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Photo container */}
                  <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-surface mb-5 flex items-center justify-center">
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

                    {isFounder && (
                      <div className="absolute top-3 left-3 bg-surface-container-lowest/90 backdrop-blur-xs px-2.5 py-1 rounded-full border border-primary/30 flex items-center gap-1 text-[10px] font-bold text-primary uppercase tracking-wider shadow-xs">
                        <ShieldCheck size={13} weight="fill" />
                        <span>Founder</span>
                      </div>
                    )}
                  </div>

                  {/* Name & Role */}
                  <h4 className="text-xl sm:text-2xl font-heading font-bold text-on-surface mb-1">
                    {member.name}
                  </h4>
                  <p className="text-xs sm:text-sm font-bold tracking-wider uppercase text-primary mb-3">
                    {member.role}
                  </p>

                  {/* Biography */}
                  {member.public_bio && (
                    <p className="text-sm text-main-text leading-relaxed mb-4">
                      {member.public_bio}
                    </p>
                  )}
                </div>

                {/* Social links */}
                <div className="pt-4 border-t border-outline-variant/40 flex items-center justify-between text-xs mt-2">
                  <div className="flex items-center gap-3 text-text-light">
                    {member.linkedin_url && (
                      <a
                        href={member.linkedin_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-primary transition-colors p-1"
                        aria-label={`${member.name} LinkedIn Profile`}
                      >
                        <LinkedinLogo size={18} weight="fill" />
                      </a>
                    )}
                    {member.github_url && (
                      <a
                        href={member.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-on-surface transition-colors p-1"
                        aria-label={`${member.name} GitHub Profile`}
                      >
                        <GithubLogo size={18} weight="fill" />
                      </a>
                    )}
                    {member.portfolio_url && (
                      <a
                        href={member.portfolio_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-primary transition-colors p-1"
                        aria-label={`${member.name} Portfolio`}
                      >
                        <LinkSimple size={18} weight="bold" />
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

      </div>
    </section>
  );
}
