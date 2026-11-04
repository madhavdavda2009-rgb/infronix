"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Star, Quotes, ArrowUpRight, SealCheck } from "@phosphor-icons/react";

const INITIAL_COUNT = 6;
const BADGE_COLUMNS = { 1: 'sm:grid-cols-1', 2: 'sm:grid-cols-2', 3: 'sm:grid-cols-3', 4: 'sm:grid-cols-2 lg:grid-cols-4' };

function initials(name) {
  return String(name || '').split(/\s+/).filter(Boolean).slice(0, 2).map(p => p[0].toUpperCase()).join('');
}

function formatMonth(value) {
  if (!value) return '';
  const d = new Date(`${String(value).slice(0, 10)}T00:00:00Z`);
  return Number.isNaN(d.getTime()) ? '' : d.toLocaleDateString('en-IN', { month: 'short', year: 'numeric', timeZone: 'UTC' });
}

function GoogleLogo({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true" focusable="false">
      <path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 13 4 4 13 4 24s9 20 20 20 20-9 20-20c0-1.3-.1-2.6-.4-3.9z" />
      <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.6-.4-3.9z" />
    </svg>
  );
}

function ReviewCard({ review, index }) {
  const [expanded, setExpanded] = useState(false);
  const long = review.review_text.length > 260;
  const isGoogle = /google/i.test(review.source || '') || /google\./i.test(review.source_url || '');
  return (
    <motion.figure
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: (index % 3) * 0.08 }}
      className="break-inside-avoid mb-5 sm:mb-6 p-6 sm:p-7 rounded-2xl bg-surface-container-lowest border border-outline shadow-sm hover:shadow-md hover:border-primary/30 transition-all"
    >
      <div className="flex items-center justify-between gap-3 mb-4">
        <span className="flex items-center gap-0.5" aria-label={`${review.rating} out of 5 stars`}>
          {[1, 2, 3, 4, 5].map(n => (
            <Star key={n} size={16} weight="fill" className={n <= review.rating ? 'text-amber-400' : 'text-outline-variant'} />
          ))}
        </span>
        <Quotes size={26} weight="fill" className="text-primary/15" aria-hidden="true" />
      </div>
      <blockquote className="text-sm sm:text-base text-main-text leading-relaxed whitespace-pre-line">
        {long && !expanded ? `${review.review_text.slice(0, 260).trimEnd()}…` : review.review_text}
      </blockquote>
      {long && (
        <button type="button" onClick={() => setExpanded(v => !v)} className="mt-2 text-xs font-semibold text-primary hover:underline cursor-pointer">
          {expanded ? 'Show less' : 'Read more'}
        </button>
      )}
      <figcaption className="mt-5 pt-5 border-t border-outline flex items-center gap-3">
        <span className="w-10 h-10 rounded-full bg-primary/10 text-primary font-heading font-bold text-sm flex items-center justify-center shrink-0" aria-hidden="true">
          {initials(review.reviewer_name)}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-semibold text-on-surface truncate">{review.reviewer_name}</span>
          <span className="block text-xs text-text-light truncate">
            {[review.reviewer_role, review.business_name].filter(Boolean).join(', ') || formatMonth(review.review_date)}
          </span>
        </span>
        {review.source_url ? (
          <a href={review.source_url} target="_blank" rel="noopener noreferrer nofollow" className="group/src inline-flex items-center gap-1.5 rounded-full border border-outline bg-surface-container-lowest pl-2 pr-2.5 py-1.5 text-xs font-semibold text-on-surface shadow-xs hover:border-primary/40 hover:shadow-sm transition-all shrink-0" aria-label={`View this review on ${review.source} (opens in a new tab)`}>
            {isGoogle && <GoogleLogo size={15} />}
            {review.source}
            <ArrowUpRight size={12} weight="bold" className="text-text-light group-hover/src:text-primary transition-colors" />
          </a>
        ) : (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-light shrink-0">
            {isGoogle && <GoogleLogo size={15} />}
            {review.source}
          </span>
        )}
      </figcaption>
    </motion.figure>
  );
}

/** Real client reviews entered in Founder OS, plus optional trust badges. Hidden when both are empty. */
export default function ReviewsSection({ reviews = [], rating, badges = [] }) {
  const [showAll, setShowAll] = useState(false);
  if (!reviews.length && !badges.length) return null;
  const visible = showAll ? reviews : reviews.slice(0, INITIAL_COUNT);

  return (
    <section id="reviews" className="py-16 sm:py-20 md:py-24 bg-surface scroll-mt-24" aria-labelledby="reviews-heading">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12">
        {reviews.length > 0 && (
          <>
            <div className="mb-10 sm:mb-14 flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <span className="block text-xs sm:text-sm font-semibold tracking-widest uppercase text-text-light mb-3 sm:mb-4">Client Reviews</span>
                <h2 id="reviews-heading" className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-on-surface leading-tight">
                  What our clients <span className="text-primary">say.</span>
                </h2>
              </div>
              {rating?.count > 0 && (
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-3xl sm:text-4xl font-heading font-bold text-on-surface">{rating.average.toFixed(1)}</span>
                  <span className="flex flex-col">
                    <span className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map(n => <Star key={n} size={15} weight="fill" className={n <= Math.round(rating.average) ? 'text-amber-400' : 'text-outline-variant'} />)}
                    </span>
                    <span className="text-xs text-text-light mt-0.5">{rating.count} review{rating.count === 1 ? '' : 's'}</span>
                  </span>
                </div>
              )}
            </div>

            <div className="columns-1 md:columns-2 xl:columns-3 gap-5 sm:gap-6">
              {visible.map((review, index) => <ReviewCard key={review.id} review={review} index={index} />)}
            </div>

            {reviews.length > INITIAL_COUNT && (
              <div className="mt-4 text-center">
                <button type="button" onClick={() => setShowAll(v => !v)} className="inline-flex items-center justify-center gap-2 bg-surface-container-lowest text-on-surface border border-outline hover:border-primary/50 font-medium text-sm px-6 py-3 rounded-xl transition-all cursor-pointer">
                  {showAll ? 'Show fewer reviews' : `Show all ${reviews.length} reviews`}
                </button>
              </div>
            )}
          </>
        )}

        {badges.length > 0 && (
          <div className={`${reviews.length ? 'mt-14 sm:mt-16 pt-12 sm:pt-14 border-t border-outline' : ''} grid grid-cols-1 ${BADGE_COLUMNS[badges.length]} gap-4 sm:gap-6`}>
            {badges.map((badge, index) => (
              <motion.div
                key={badge.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: index * 0.06 }}
                className="flex items-start gap-3.5"
              >
                <span className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <SealCheck size={22} weight="fill" />
                </span>
                <span>
                  <span className="block font-heading font-bold text-base sm:text-lg text-on-surface">{badge.title}</span>
                  {badge.description && <span className="block text-sm text-main-text leading-relaxed mt-0.5">{badge.description}</span>}
                </span>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
