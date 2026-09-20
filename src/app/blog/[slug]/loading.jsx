import React from 'react';

export default function BlogArticleLoading() {
  return (
    <main className="w-full pt-20 sm:pt-28 md:pt-32 min-h-screen bg-surface" aria-busy="true" aria-live="polite">
      {/* Top Subtle Loading Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 h-[3px] bg-outline-variant/30 overflow-hidden">
        <div className="h-full bg-gradient-to-r from-primary via-violet-400 to-primary animate-pulse w-full" />
      </div>

      <article className="max-w-[880px] mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-12 animate-pulse">
        
        {/* Breadcrumb & Category Skeleton */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="h-4 w-28 bg-outline-variant/60 rounded-md" />
          <div className="h-6 w-24 bg-primary/10 rounded-full" />
        </div>

        {/* Article Title Skeleton (2 lines) */}
        <div className="space-y-3 mb-6">
          <div className="h-9 sm:h-11 md:h-12 w-11/12 bg-outline-variant/80 rounded-xl" />
          <div className="h-9 sm:h-11 md:h-12 w-3/4 bg-outline-variant/70 rounded-xl" />
        </div>

        {/* Excerpt / Lead Skeleton */}
        <div className="space-y-2.5 mb-8 pb-8 border-b border-outline-variant/40">
          <div className="h-4 sm:h-5 w-full bg-outline-variant/50 rounded-lg" />
          <div className="h-4 sm:h-5 w-5/6 bg-outline-variant/40 rounded-lg" />
        </div>

        {/* Author & Meta Row Skeleton */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-outline-variant/70 shrink-0" />
            <div className="space-y-1.5">
              <div className="h-4 w-32 bg-outline-variant/80 rounded-md" />
              <div className="h-3 w-24 bg-outline-variant/50 rounded-md" />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="h-4 w-24 bg-outline-variant/50 rounded-md" />
            <div className="h-4 w-16 bg-outline-variant/50 rounded-md" />
          </div>
        </div>

        {/* Cover Photo Skeleton */}
        <div className="mb-10 sm:mb-12 rounded-2xl overflow-hidden border border-outline-variant/60 aspect-[16/9] w-full bg-gradient-to-br from-surface-container-lowest via-outline-variant/40 to-surface-container-lowest flex items-center justify-center relative">
          <div className="w-12 h-12 rounded-2xl bg-outline-variant/50 flex items-center justify-center">
            <div className="w-6 h-6 rounded-lg bg-outline-variant/80" />
          </div>
        </div>

        {/* Article Body Content Skeleton */}
        <div className="pt-2 pb-10 border-b border-outline-variant/40 space-y-6">
          
          {/* Paragraph 1 */}
          <div className="space-y-2.5">
            <div className="h-4 w-full bg-outline-variant/60 rounded-md" />
            <div className="h-4 w-11/12 bg-outline-variant/50 rounded-md" />
            <div className="h-4 w-4/5 bg-outline-variant/50 rounded-md" />
          </div>

          {/* Section Heading */}
          <div className="pt-4">
            <div className="h-7 w-2/3 bg-outline-variant/80 rounded-lg mb-3" />
            <div className="h-[1px] w-full bg-outline-variant/30 mb-4" />
          </div>

          {/* Paragraph 2 */}
          <div className="space-y-2.5">
            <div className="h-4 w-full bg-outline-variant/60 rounded-md" />
            <div className="h-4 w-5/6 bg-outline-variant/50 rounded-md" />
            <div className="h-4 w-9/12 bg-outline-variant/40 rounded-md" />
          </div>

          {/* Callout Box Skeleton */}
          <div className="p-5 rounded-2xl border-l-4 border-primary/50 bg-surface-container-lowest/80 space-y-2">
            <div className="h-3.5 w-20 bg-primary/20 rounded-md mb-2" />
            <div className="h-3.5 w-full bg-outline-variant/50 rounded-md" />
            <div className="h-3.5 w-4/5 bg-outline-variant/40 rounded-md" />
          </div>

          {/* List Skeleton */}
          <div className="space-y-2 pl-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary/40" />
              <div className="h-3.5 w-3/4 bg-outline-variant/50 rounded-md" />
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary/40" />
              <div className="h-3.5 w-2/3 bg-outline-variant/50 rounded-md" />
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary/40" />
              <div className="h-3.5 w-4/5 bg-outline-variant/50 rounded-md" />
            </div>
          </div>

        </div>

        {/* Tags & Footer Skeleton */}
        <div className="py-8 border-b border-outline-variant/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="h-6 w-20 bg-outline-variant/60 rounded-xl" />
            <div className="h-6 w-24 bg-outline-variant/60 rounded-xl" />
            <div className="h-6 w-16 bg-outline-variant/60 rounded-xl" />
          </div>
          <div className="h-8 w-28 bg-outline-variant/50 rounded-xl" />
        </div>

      </article>

      {/* Related Articles Section Skeleton */}
      <section className="w-full py-12 sm:py-16 bg-surface-container-lowest border-t border-outline-variant/40">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 md:px-12 animate-pulse">
          <div className="h-3.5 w-24 bg-primary/20 rounded-md mb-2" />
          <div className="h-7 w-64 bg-outline-variant/70 rounded-lg mb-8" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-surface border border-outline-variant/60 rounded-2xl p-5 space-y-4">
                <div className="aspect-[16/10] bg-outline-variant/50 rounded-xl" />
                <div className="h-3.5 w-20 bg-primary/20 rounded-md" />
                <div className="h-5 w-4/5 bg-outline-variant/70 rounded-md" />
                <div className="h-3.5 w-full bg-outline-variant/40 rounded-md" />
                <div className="pt-3 border-t border-outline-variant/40 flex justify-between">
                  <div className="h-3 w-16 bg-outline-variant/40 rounded" />
                  <div className="h-3 w-12 bg-primary/20 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
