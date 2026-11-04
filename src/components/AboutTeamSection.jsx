"use client";
import React, { useMemo } from "react";
import { usePublicData } from '@/hooks/usePublicData';
import { TeamSlider } from '@/components/TeamSection';

export default function AboutTeamSection({ initialTeam = null }) {
  const initialData = useMemo(() => initialTeam === null ? null : { success: true, team: initialTeam }, [initialTeam]);
  const data = usePublicData('/api/public/team?page=about', initialData);
  const teamMembers = data?.team ?? [];

  return (
    <section className="pt-16 sm:pt-20 md:pt-24 pb-16 sm:pb-20 md:pb-24 lg:pb-12 bg-surface border-b border-outline-variant/30" id="team">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12">
        
        {/* Header */}
        <div className="max-w-3xl mb-10 sm:mb-12 md:mb-14">
          <h2 className="text-xs sm:text-sm font-bold tracking-widest uppercase text-text-light mb-3">The People Behind InfronixWeb</h2>
          <h3 className="text-2xl sm:text-4xl md:text-5xl font-heading font-bold text-on-surface leading-tight mb-4">
            Thoughtful work, <br className="hidden sm:block" />
            driven by specialists.
          </h3>
          <p className="text-sm sm:text-base md:text-lg text-main-text font-medium leading-relaxed">
            Meet the people who design your website, plan your marketing and help customers find your business.
          </p>
        </div>

      </div>

      {/* Same scroll slider as the home page */}
      <TeamSlider teamMembers={teamMembers} headingLevel="h4" />
    </section>
  );
}
