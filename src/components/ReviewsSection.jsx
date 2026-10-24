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

function ReviewCard({ review, index }) {
  const [expanded, setExpanded] = useState(false);
  const long = review.review_text.length > 260;
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
          <a href={review.source_url} target="_blank" rel="noopener noreferrer nofollow" className="inline-flex items-center gap-1 text-[11px] font-semibold text-text-light hover:text-primary shrink-0" aria-label={`View this review on ${review.source} (opens in a new tab)`}>
            {review.source} <ArrowUpRight size={12} weight="bold" />
          </a>
        ) : (
          <span className="text-[11px] font-semibold text-text-light shrink-0">{review.source}</span>
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
