"use client";

import { useEffect } from 'react';
import Link from 'next/link';
import { ArrowsClockwise, House, WarningCircle } from '@phosphor-icons/react';

export default function Error({ error, reset }) {
  useEffect(() => {
    // Log exception for telemetry if needed
    console.error('Route error caught:', error);
  }, [error]);

  return (
    <main className="min-h-[85vh] w-full bg-[#0B0D12] flex items-center justify-center p-4 sm:p-6 md:p-8 relative overflow-hidden font-sans">
      {/* Background glow */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-primary/15 blur-[140px] rounded-full pointer-events-none" 
        aria-hidden="true" 
      />

      <div className="relative z-10 max-w-md w-full bg-[#121620]/90 border border-primary/30 p-8 sm:p-10 rounded-2xl shadow-[0_0_40px_rgba(139,92,246,0.15)] text-center space-y-6 backdrop-blur-md">
        <div className="w-16 h-16 bg-primary/10 text-primary border border-primary/25 rounded-full flex items-center justify-center mx-auto">
          <WarningCircle className="text-3xl" weight="duotone" />
        </div>

        <div className="space-y-2">
          <span className="text-[11px] text-primary font-mono tracking-widest uppercase block font-normal">
            Application Error
          </span>
          <h1 className="text-2xl sm:text-3xl text-white font-light font-heading tracking-tight">
            Unexpected Exception
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
            We encountered an unexpected error while loading this page. You can try refreshing the component or return to home.
          </p>
          {error?.message && process.env.NODE_ENV !== 'production' && (
            <div className="mt-4 p-3 bg-[#1A1F2C] border border-primary/30 text-left rounded-xl text-xs font-mono text-purple-200 overflow-x-auto">
              <span className="text-primary font-normal">{error.message}</span>
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={() => reset()}
            className="flex-1 bg-primary hover:bg-primary-dark text-white text-xs uppercase tracking-wider py-3 px-4 rounded-xl transition-all shadow-[0_0_20px_rgba(139,92,246,0.25)] flex items-center justify-center gap-2 cursor-pointer font-normal hover:scale-[1.02] active:scale-[0.98]"
          >
            <ArrowsClockwise className="text-base" />
            <span>Try Again</span>
          </button>

          <Link
            href="/"
            className="flex-1 bg-transparent text-slate-300 hover:text-white hover:bg-white/5 text-xs uppercase tracking-wider py-3 px-4 rounded-xl transition-all border border-slate-700 flex items-center justify-center gap-2 font-normal hover:scale-[1.02] active:scale-[0.98]"
          >
            <House className="text-base" />
            <span>Home Page</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
