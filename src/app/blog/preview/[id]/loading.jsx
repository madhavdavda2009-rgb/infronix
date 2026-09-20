import React from 'react';

export default function BlogPreviewLoading() {
  return (
    <main className="w-full pt-28 sm:pt-32 min-h-screen bg-surface" aria-busy="true" aria-live="polite">
      {/* Top Banner Skeleton */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-amber-500 text-slate-950 px-4 py-2.5 shadow-md flex items-center justify-between text-xs font-bold">
        <span>PREVIEW MODE — Loading draft...</span>
      </div>

      <article className="max-w-[880px] mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-12 animate-pulse">
        <div className="h-6 w-24 bg-primary/10 rounded-full mb-4" />
        <div className="h-10 sm:h-12 w-11/12 bg-outline-variant/80 rounded-xl mb-6" />
        <div className="h-5 w-full bg-outline-variant/50 rounded-lg mb-8" />
        
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-full bg-outline-variant/70 shrink-0" />
          <div className="space-y-1.5">
            <div className="h-4 w-32 bg-outline-variant/80 rounded-md" />
            <div className="h-3 w-24 bg-outline-variant/50 rounded-md" />
          </div>
        </div>

        <div className="mb-10 rounded-2xl aspect-[16/9] w-full bg-outline-variant/40" />
        
        <div className="space-y-4">
          <div className="h-4 w-full bg-outline-variant/60 rounded-md" />
          <div className="h-4 w-5/6 bg-outline-variant/50 rounded-md" />
          <div className="h-4 w-4/5 bg-outline-variant/50 rounded-md" />
        </div>
      </article>
    </main>
  );
}
