"use client";
import { motion } from "framer-motion";
import { Star } from "@phosphor-icons/react";

const STAT_COLUMNS = { 1: 'sm:grid-cols-1', 2: 'sm:grid-cols-2', 3: 'sm:grid-cols-3', 4: 'sm:grid-cols-4' };

/** Rating summary and real-number stats shown right under the hero. Renders nothing without data. */
export default function TrustBar({ rating, stats = [], showRating = true }) {
  const hasRating = showRating && rating?.count > 0;
  if (!hasRating && !stats.length) return null;

  const full = Math.round(rating?.average || 0);

  return (
    <section aria-label="Client ratings and track record" className="bg-surface-container-lowest border-t border-outline/60">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12 py-6 sm:py-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-10"
        >
          {hasRating && (
            <a href="#reviews" className="group flex items-center gap-4 shrink-0 lg:pr-10 lg:border-r lg:border-outline">
              <span className="text-4xl sm:text-5xl font-heading font-bold text-on-surface leading-none">{rating.average.toFixed(1)}</span>
              <span className="flex flex-col gap-1">
                <span className="flex items-center gap-0.5" aria-label={`Rated ${rating.average.toFixed(1)} out of 5`}>
                  {[1, 2, 3, 4, 5].map(n => (
                    <Star key={n} size={18} weight="fill" className={n <= full ? 'text-amber-400' : 'text-outline-variant'} />
                  ))}
                </span>
                <span className="text-xs sm:text-sm text-main-text">
                  from <span className="font-semibold text-on-surface group-hover:text-primary transition-colors">{rating.count} client review{rating.count === 1 ? '' : 's'}</span>
                  {rating.sources?.length ? <span className="text-text-light"> · {rating.sources.slice(0, 3).join(', ')}</span> : null}
                </span>
              </span>
            </a>
          )}

          {stats.length > 0 && (
            <dl className={`grid grid-cols-2 ${STAT_COLUMNS[stats.length] || 'sm:grid-cols-4'} gap-x-6 gap-y-5 flex-1`}>
              {stats.map(s => (
                <div key={s.label} className="flex flex-col">
                  <dt className="order-2 text-xs sm:text-sm text-main-text mt-1">{s.label}</dt>
                  <dd className="order-1 text-2xl sm:text-3xl font-heading font-bold text-on-surface leading-none">{s.value}</dd>
                </div>
              ))}
            </dl>
          )}
        </motion.div>
      </div>
    </section>
  );
}
