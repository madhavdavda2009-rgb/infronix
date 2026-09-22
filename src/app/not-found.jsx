import Link from 'next/link';
import { House, ArrowRight, EnvelopeSimple, Compass } from '@phosphor-icons/react/dist/ssr';

export const metadata = {
  title: '404 - Page Not Found',
  description: "The page you are looking for doesn't exist or has been moved.",
  alternates: { canonical: null },
  robots: {
    index: false,
    follow: true,
  },
};

export default function NotFound() {
  return (
    <main className="min-h-[85vh] w-full bg-[#0B0D12] flex items-center justify-center p-4 sm:p-6 md:p-8 relative overflow-hidden font-sans">
      {/* Ambient background glow spheres */}
      <div 
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[550px] h-[350px] sm:h-[550px] bg-primary/15 blur-[140px] rounded-full pointer-events-none" 
        aria-hidden="true" 
      />
      <div 
        className="absolute bottom-10 right-10 w-[200px] sm:w-[320px] h-[200px] sm:h-[320px] bg-accent/10 blur-[100px] rounded-full pointer-events-none" 
        aria-hidden="true" 
      />

      <div className="relative z-10 max-w-xl w-full text-center space-y-6 sm:space-y-8 py-12 sm:py-16">
        {/* Decorative Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-mono tracking-widest uppercase font-normal">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          <span>Error 404</span>
        </div>

        {/* Big Thin 404 Headline */}
        <div className="space-y-2">
          <h1 className="text-7xl sm:text-9xl md:text-[11rem] font-extralight tracking-tighter bg-gradient-to-b from-white via-slate-200 to-slate-500 bg-clip-text text-transparent select-none leading-none">
            404
          </h1>
          <h2 className="text-2xl sm:text-3xl md:text-4xl text-white font-light font-heading tracking-tight">
            Lost in Cyberspace
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-slate-400 max-w-md mx-auto leading-relaxed font-light px-4">
            The page you are looking for has been moved, renamed, or never existed in our digital orbit.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2 max-w-md mx-auto">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-primary hover:bg-primary-dark text-white text-xs sm:text-sm font-normal tracking-wide uppercase transition-all shadow-[0_0_25px_rgba(139,92,246,0.3)] hover:shadow-[0_0_35px_rgba(139,92,246,0.45)] hover:scale-[1.02] active:scale-[0.98]"
          >
            <House className="text-base" />
            <span>Back to Home</span>
          </Link>

          <Link
            href="/start-project"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-[#121620] hover:bg-[#1a2030] text-slate-200 hover:text-white border border-primary/30 hover:border-primary/60 text-xs sm:text-sm font-normal tracking-wide uppercase transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Compass className="text-base text-primary" />
            <span>Get a Quote</span>
          </Link>
        </div>

        {/* Quick Links */}
        <div className="pt-6 border-t border-white/5 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 font-light">
          <Link href="/web-development" className="hover:text-primary transition-colors flex items-center gap-1.5">
            <ArrowRight className="text-[10px] text-primary" /> Web Development
          </Link>
          <Link href="/seo" className="hover:text-primary transition-colors flex items-center gap-1.5">
            <ArrowRight className="text-[10px] text-primary" /> SEO Services
          </Link>
          <Link href="/ai-automation" className="hover:text-primary transition-colors flex items-center gap-1.5">
            <ArrowRight className="text-[10px] text-primary" /> AI Automation
          </Link>
          <Link href="/contact" className="hover:text-primary transition-colors flex items-center gap-1.5">
            <EnvelopeSimple className="text-xs text-primary" /> Contact
          </Link>
        </div>
      </div>
    </main>
  );
}
