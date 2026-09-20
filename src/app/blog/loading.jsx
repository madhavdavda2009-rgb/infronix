import React from 'react';

export default function BlogListingLoading() {
  return (
    <main className="w-full pt-20 sm:pt-28 md:pt-32 min-h-screen bg-surface" aria-busy="true" aria-live="polite">
      {/* Top Subtle Loading Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 h-[3px] bg-outline-variant/30 overflow-hidden">
        <div className="h-full bg-gradient-to-r from-primary via-violet-400 to-primary animate-pulse w-full" />
      </div>

      {/* Header Section Skeleton */}
      <section className="relative w-full py-10 sm:py-14 md:py-20 animate-pulse">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 md:px-12 text-center max-w-3xl">
          <div className="h-3.5 w-32 bg-primary/20 rounded-md mx-auto mb-4" />
          <div className="h-9 sm:h-12 w-3/4 bg-outline-variant/80 rounded-2xl mx-auto mb-4" />
          <div className="h-4 w-5/6 bg-outline-variant/50 rounded-lg mx-auto" />
        </div>
      </section>

      {/* Filter Bar Skeleton */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 md:px-12 mb-10 sm:mb-14 animate-pulse">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 bg-surface-container-lowest rounded-2xl border border-outline-variant/60 shadow-xs">
          <div className="flex items-center gap-2">
            <div className="h-8 w-20 bg-primary/20 rounded-xl" />
            <div className="h-8 w-28 bg-outline-variant/50 rounded-xl" />
            <div className="h-8 w-24 bg-outline-variant/50 rounded-xl" />
            <div className="h-8 w-24 bg-outline-variant/50 rounded-xl" />
          </div>
          <div className="h-9 w-64 bg-outline-variant/40 rounded-xl" />
        </div>
      </div>

      {/* Featured Post Hero Skeleton */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 md:px-12 mb-12 sm:mb-16 animate-pulse">
        <div className="bg-surface-container-lowest border border-outline-variant/70 rounded-3xl p-6 sm:p-8 md:p-10 grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
          <div className="lg:col-span-6 aspect-[16/10] bg-outline-variant/50 rounded-2xl" />
          <div className="lg:col-span-6 space-y-4">
            <div className="h-3.5 w-24 bg-primary/20 rounded-md" />
            <div className="h-8 w-full bg-outline-variant/80 rounded-xl" />
            <div className="h-8 w-4/5 bg-outline-variant/70 rounded-xl" />
            <div className="h-4 w-full bg-outline-variant/40 rounded-lg" />
            <div className="h-4 w-3/4 bg-outline-variant/40 rounded-lg" />
            <div className="pt-4 border-t border-outline-variant/40 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-outline-variant/60" />
                <div className="h-3.5 w-24 bg-outline-variant/50 rounded" />
              </div>
              <div className="h-4 w-20 bg-primary/30 rounded" />
            </div>
          </div>
        </div>
      </div>

      {/* Grid Articles Skeleton */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 md:px-12 pb-16 animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="bg-surface-container-lowest border border-outline-variant/70 rounded-2xl p-5 space-y-4">
              <div className="aspect-[16/10] bg-outline-variant/50 rounded-xl" />
              <div className="h-3 w-16 bg-primary/20 rounded-md" />
              <div className="h-5 w-4/5 bg-outline-variant/70 rounded-md" />
              <div className="h-3.5 w-full bg-outline-variant/40 rounded-md" />
              <div className="h-3.5 w-3/4 bg-outline-variant/40 rounded-md" />
              <div className="pt-3.5 border-t border-outline-variant/40 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-outline-variant/50" />
                  <div className="h-3 w-20 bg-outline-variant/40 rounded" />
                </div>
                <div className="h-3 w-12 bg-primary/30 rounded" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
