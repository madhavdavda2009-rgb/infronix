"use client";
export function SkeletonLine({ width = 'w-full', height = 'h-4', className = '', dark = false }) {
  return (
    <div
      className={`rounded ${height} ${width} ${
        dark ? 'animate-skeleton-dark bg-slate-800' : 'animate-skeleton bg-slate-200'
      } ${className}`}
    />
  );
}

export function SkeletonHero({ dark = false }) {
  return (
    <div className={`w-full py-16 md:py-24 px-margin-mobile md:px-margin-desktop ${dark ? 'bg-navy-muted' : 'bg-surface'}`}>
      <div className="max-w-[1280px] mx-auto flex flex-col items-center text-center space-y-6">
        <SkeletonLine width="w-32" height="h-4" dark={dark} />
        <SkeletonLine width="w-3/4 max-w-2xl" height="h-10" dark={dark} />
        <SkeletonLine width="w-2/3 max-w-xl" height="h-5" dark={dark} />
        <div className="flex gap-4 pt-4">
          <SkeletonLine width="w-36" height="h-12" dark={dark} />
          <SkeletonLine width="w-36" height="h-12" dark={dark} />
        </div>
      </div>
    </div>
  );
}

export function SkeletonCard({ dark = false }) {
  return (
    <div
      className={`p-6 rounded-lg border space-y-4 ${
        dark
          ? 'bg-slate-900 border-slate-800'
          : 'bg-surface-container-lowest border-outline-variant/40'
      }`}
    >
      <SkeletonLine width="w-12" height="h-12" dark={dark} className="rounded-full" />
      <SkeletonLine width="w-2/3" height="h-6" dark={dark} />
      <SkeletonLine width="w-full" height="h-4" dark={dark} />
      <SkeletonLine width="w-4/5" height="h-4" dark={dark} />
    </div>
  );
}

export function SkeletonTable({ rows = 5, dark = true }) {
  return (
    <div className="w-full overflow-hidden border border-slate-800 bg-slate-950 p-4 space-y-4">
      <div className="flex justify-between items-center pb-4 border-b border-slate-800">
        <SkeletonLine width="w-48" height="h-8" dark={dark} />
        <SkeletonLine width="w-32" height="h-8" dark={dark} />
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4 items-center py-3 border-b border-slate-800/60">
          <SkeletonLine width="w-12" height="h-4" dark={dark} />
          <SkeletonLine width="w-36" height="h-4" dark={dark} />
          <SkeletonLine width="w-48" height="h-4" dark={dark} />
          <SkeletonLine width="w-24" height="h-4" dark={dark} />
          <SkeletonLine width="w-20" height="h-6" dark={dark} className="rounded-full" />
        </div>
      ))}
    </div>
  );
}

export function SkeletonPage({ dark = false }) {
  return (
    <div className={`min-h-screen w-full pt-20 ${dark ? 'bg-navy-muted' : 'bg-surface'}`} aria-busy="true" aria-label="Loading page content">
      <SkeletonHero dark={dark} />
      <div className="max-w-[1280px] mx-auto px-margin-mobile md:px-margin-desktop py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <SkeletonCard dark={dark} />
          <SkeletonCard dark={dark} />
          <SkeletonCard dark={dark} />
        </div>
      </div>
    </div>
  );
}
