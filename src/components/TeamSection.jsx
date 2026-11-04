"use client";
import React, { useMemo, useRef, useState } from "react";
import { motion, useScroll, useSpring, useTransform, useMotionValueEvent, useReducedMotion } from "framer-motion";
import Link from "next/link";
import Image from "@/components/CmsImage";
import {
  InstagramLogo, LinkedinLogo, GithubLogo, LinkSimple, ArrowRight, ShieldCheck
} from "@phosphor-icons/react";
import { usePublicData } from '@/hooks/usePublicData';
import { imageCropStyle } from '@/lib/image-crop';
import { leadershipLabel } from '@/lib/team-types';

const pad = (n) => String(n).padStart(2, "0");

function MemberPhoto({ member, sizes }) {
  if (member.profile_image_url) {
    return (
      <Image
        src={member.profile_image_url}
        alt={`${member.name} - ${member.role}`}
        fill
        sizes={sizes}
        className="object-cover"
        style={imageCropStyle(member.profile_image_crop)}
        loading="lazy"
      />
    );
  }
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-surface-container-lowest to-surface text-text-light p-6 text-center">
      <div className="w-20 h-20 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-heading font-bold text-2xl mb-3">
        {member.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
      </div>
      <span className="text-xs font-semibold uppercase tracking-wider text-text-light">InfronixWeb</span>
    </div>
  );
}

function MemberBadge({ member, className = "" }) {
  const badge = leadershipLabel(member);
  if (!badge) return null;
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border border-primary/30 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-primary ${className}`}>
      <ShieldCheck size={13} weight="fill" />
      {badge}
    </span>
  );
}

function MemberLinks({ member, className = "" }) {
  const hasAny = member.linkedin_url || member.github_url || member.portfolio_url || member.instagram_url;
  if (!hasAny) return null;
  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      {member.linkedin_url && (
        <a href={member.linkedin_url} target="_blank" rel="noopener noreferrer" aria-label={`${member.name} LinkedIn Profile`}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-outline-variant text-text-light hover:text-primary hover:border-primary/40 transition-colors">
          <LinkedinLogo size={18} weight="fill" />
        </a>
      )}
      {member.github_url && (
        <a href={member.github_url} target="_blank" rel="noopener noreferrer" aria-label={`${member.name} GitHub Profile`}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-outline-variant text-text-light hover:text-on-surface hover:border-on-surface/40 transition-colors">
          <GithubLogo size={18} weight="fill" />
        </a>
      )}
      {member.portfolio_url && (
        <a href={member.portfolio_url} target="_blank" rel="noopener noreferrer" aria-label={`${member.name} Portfolio`}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-outline-variant text-text-light hover:text-primary hover:border-primary/40 transition-colors">
          <LinkSimple size={18} weight="bold" />
        </a>
      )}
      {member.instagram_url && (
        <a href={member.instagram_url} target="_blank" rel="noopener noreferrer" aria-label={`${member.name} Instagram`}
          className="inline-flex h-10 items-center gap-1.5 rounded-full border border-outline-variant px-4 text-xs font-semibold text-text-light hover:text-primary hover:border-primary/40 transition-colors">
          <InstagramLogo size={16} weight="fill" />
          <span>{member.instagram_url.includes('instagram.com/') ? `@${member.instagram_url.split('instagram.com/')[1].replace(/\/$/, '')}` : 'Instagram'}</span>
        </a>
      )}
    </div>
  );
}

/* The section pins while the page scrolls and the members slide past horizontally. */
function PinnedSlider({ teamMembers, headingLevel: Heading = 'h3' }) {
  const wrapRef = useRef(null);
  const total = teamMembers.length;
  const [active, setActive] = useState(0);

  const { scrollYProgress } = useScroll({ target: wrapRef, offset: ["start start", "end end"] });
  const smooth = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.4 });
  // Each member rests for a moment before the next one slides in.
  const x = useTransform(smooth, (v) => {
    if (total < 2) return "0%";
    const span = total - 1;
    const hold = 0.35; // share of each step spent resting on a slide
    const pos = Math.min(Math.max(v, 0), 1) * span;
    const step = Math.min(Math.floor(pos), span - 1);
    const t = pos - step;
    const eased = t < hold / 2 ? 0 : t > 1 - hold / 2 ? 1 : (t - hold / 2) / (1 - hold);
    return `${-(step + eased) * 100}%`;
  });
  const bar = useTransform(smooth, [0, 1], [1 / total, 1]);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setActive(Math.min(total - 1, Math.round(v * (total - 1))));
  });

  return (
    <div ref={wrapRef} className="relative" style={{ height: `${Math.max(total, 1) * 85 + 15}vh` }}>
      <div className="sticky top-0 h-[100svh] flex flex-col justify-center pt-20 sm:pt-24 lg:pt-28 pb-6 lg:pb-8 overflow-hidden">
        <div className="max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-12">
          <div className="overflow-hidden">
            <motion.div className="flex" style={{ x }}>
              {teamMembers.map((member, index) => (
                <article
                  key={member.id || index}
                  className="w-full shrink-0 flex flex-col items-center gap-5 sm:gap-6 lg:grid lg:grid-cols-12 lg:gap-12 xl:gap-16"
                  aria-roledescription="slide"
                  aria-label={`${index + 1} of ${total}`}
                >
                  <div className="lg:col-span-5 xl:col-span-4 xl:col-start-2 lg:w-full lg:flex lg:justify-center">
                    <div className="relative aspect-[2/3] h-[min(42svh,440px)] w-auto lg:h-[min(60vh,600px)] lg:mx-auto overflow-hidden rounded-2xl bg-soft-violet/60 border border-primary/10 shadow-[0_30px_60px_-30px_rgba(109,40,217,0.35)]">
                      <MemberPhoto member={member} sizes="(max-width: 1024px) 80vw, (max-width: 1280px) 40vw, 460px" />
                      <MemberBadge member={member} className="absolute top-3 left-3 bg-surface-container-lowest/90 backdrop-blur-xs shadow-xs" />
                    </div>
                  </div>

                  <div className="w-full text-center lg:text-left lg:col-span-7 xl:col-span-6">
                    <span className="hidden lg:block font-heading font-bold text-[7rem] xl:text-[9rem] leading-none text-stroke select-none" aria-hidden="true">
                      {pad(index + 1)}
                    </span>
                    <Heading className="lg:mt-2 text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-heading font-bold text-on-surface leading-[1.05]">
                      {member.name}
                    </Heading>
                    <p className="mt-2 lg:mt-4 text-xs sm:text-sm font-bold tracking-widest uppercase text-primary">
                      {member.role}
                    </p>
                    {member.public_bio && (
                      <p className="mt-3 lg:mt-6 text-sm sm:text-base lg:text-lg text-main-text leading-relaxed max-w-xl mx-auto lg:mx-0">
                        {member.public_bio}
                      </p>
                    )}
                    <div className="mt-4 lg:mt-8">
                      <MemberLinks member={member} className="justify-center lg:justify-start" />
                    </div>
                  </div>
                </article>
              ))}
            </motion.div>
          </div>

          {total > 1 && (
            <div className="mt-6 lg:mt-10 flex flex-wrap items-center justify-center lg:justify-start gap-x-4 gap-y-3 lg:gap-8">
              <span className="font-heading font-bold text-on-surface tabular-nums text-sm">
                {pad(active + 1)} <span className="text-text-light">/ {pad(total)}</span>
              </span>
              <div className="relative h-[2px] flex-1 max-w-[180px] sm:max-w-xs bg-outline overflow-hidden rounded-full">
                <motion.div className="absolute inset-0 origin-left bg-primary" style={{ scaleX: bar }} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* Reduced motion: a swipeable carousel. */
function SwipeSlider({ teamMembers, className = "", headingLevel: Heading = 'h3' }) {
  const trackRef = useRef(null);
  const [active, setActive] = useState(0);

  const onScroll = () => {
    const el = trackRef.current;
    if (!el) return;
    const slide = el.firstElementChild?.offsetWidth || 1;
    setActive(Math.round(el.scrollLeft / (slide + 16)));
  };

  return (
    <div className={className}>
      <div
        ref={trackRef}
        onScroll={onScroll}
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory px-4 sm:px-6 md:px-12 pb-2 [scrollbar-width:none]"
      >
        {teamMembers.map((member, index) => (
          <article
            key={member.id || index}
            className="snap-center shrink-0 w-[84%] sm:w-[60%] md:w-[44%] flex flex-col"
          >
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-soft-violet/60 border border-primary/10">
              <MemberPhoto member={member} sizes="(max-width: 640px) 84vw, 60vw" />
              <MemberBadge member={member} className="absolute top-3 left-3 bg-surface-container-lowest/90 backdrop-blur-xs shadow-xs" />
            </div>
            <Heading className="mt-5 text-2xl sm:text-3xl font-heading font-bold text-on-surface">{member.name}</Heading>
            <p className="mt-1 text-xs sm:text-sm font-bold tracking-wider uppercase text-primary">{member.role}</p>
            {member.public_bio && (
              <p className="mt-3 text-sm text-main-text leading-relaxed">{member.public_bio}</p>
            )}
            <div className="mt-4">
              <MemberLinks member={member} />
            </div>
          </article>
        ))}
      </div>

      {teamMembers.length > 1 && (
        <div className="mt-6 flex justify-center gap-2" aria-hidden="true">
          {teamMembers.map((m, i) => (
            <span key={m.id || i} className={`h-1.5 rounded-full transition-all ${active === i ? "w-6 bg-primary" : "w-1.5 bg-outline-variant"}`} />
          ))}
        </div>
      )}
    </div>
  );
}

/** Team members as a scroll-pinned slider (a swipe carousel for visitors who prefer reduced motion). */
export function TeamSlider({ teamMembers, headingLevel = 'h3' }) {
  const reduceMotion = useReducedMotion();
  if (!teamMembers.length) return null;
  return reduceMotion
    ? <SwipeSlider teamMembers={teamMembers} headingLevel={headingLevel} />
    : <PinnedSlider teamMembers={teamMembers} headingLevel={headingLevel} />;
}

export default function TeamSection({ initialTeam = null }) {
  const initialData = useMemo(() => initialTeam === null ? null : { success: true, team: initialTeam }, [initialTeam]);
  const data = usePublicData('/api/public/team?page=home', initialData);
  const teamMembers = data?.team ?? [];

  return (
    <section className="pt-16 sm:pt-20 md:pt-24 pb-16 sm:pb-20 md:pb-24 lg:pb-12 bg-surface" id="leadership">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12">
        <div className="mb-10 sm:mb-12 md:mb-14 flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-8">
          <div className="max-w-2xl">
            <span className="block text-xs sm:text-sm font-bold tracking-widest uppercase text-text-light mb-3 sm:mb-4">Meet the team</span>
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-heading font-bold text-on-surface leading-tight">
              Direct access. <br className="hidden md:block" />
              Massive impact.
            </h2>
          </div>
          <p className="text-sm sm:text-base md:text-lg text-main-text max-w-md md:text-right font-medium leading-relaxed">
            Work directly with the people planning, designing and building your website.
          </p>
        </div>
      </div>

      <TeamSlider teamMembers={teamMembers} />

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
    </section>
  );
}
