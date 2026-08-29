import ContactSection from '@/components/ContactSection';

export const metadata = {
  title: 'Blog | Web Development & SEO Insights | Infronix',
  description: 'Read the latest insights on web development, technical SEO, and AI automation for businesses in Ahmedabad and across India.',
  alternates: {
    canonical: 'https://www.infronixweb.in/blog'
  }
};

export default function BlogPage() {
  return (
    <>
      <main className="w-full pt-28 md:pt-32 min-h-screen bg-surface" id="main-content">
        <section className="relative w-full py-16 md:py-24" aria-label="Blog Header">
          <div className="max-w-[1280px] mx-auto px-margin-mobile md:px-margin-desktop text-center">
            <span className="font-label-caps text-xs text-primary tracking-widest uppercase font-bold mb-4 block">Insights</span>
            <h1 className="font-headline-lg text-3xl sm:text-4xl md:text-5xl text-slate-900 font-bold mb-6">Infronix Digital Insights</h1>
            <p className="font-body-md text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Expert articles, guides, and technical deep-dives into Next.js web development, local SEO strategies, and business automation.
            </p>
          </div>
        </section>

        <section className="w-full py-12 md:py-20 border-t border-outline-variant/30">
          <div className="max-w-[1280px] mx-auto px-margin-mobile md:px-margin-desktop">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              
              {/* Placeholder Article 1 */}
              <article className="border border-outline-variant p-6 hover:shadow-lg transition-shadow bg-white flex flex-col gap-4 group">
                <span className="text-xs font-label-caps text-primary uppercase tracking-widest">Web Development</span>
                <h2 className="font-headline-lg text-xl font-bold text-slate-900 group-hover:text-primary transition-colors">
                  What Should a Modern Business Website Include?
                </h2>
                <p className="font-body-md text-sm text-slate-600 line-clamp-3">
                  Discover the essential technical requirements, performance benchmarks, and accessibility standards every modern business website needs to succeed in a competitive digital landscape.
                </p>
                <div className="mt-auto pt-4 border-t border-outline-variant/50">
                  <span className="text-sm font-bold text-slate-400">Coming Soon</span>
                </div>
              </article>

              {/* Placeholder Article 2 */}
              <article className="border border-outline-variant p-6 hover:shadow-lg transition-shadow bg-white flex flex-col gap-4 group">
                <span className="text-xs font-label-caps text-primary uppercase tracking-widest">Local SEO</span>
                <h2 className="font-headline-lg text-xl font-bold text-slate-900 group-hover:text-primary transition-colors">
                  How Local SEO Helps Ahmedabad Businesses
                </h2>
                <p className="font-body-md text-sm text-slate-600 line-clamp-3">
                  A comprehensive guide on leveraging local search intent, Google Business Profiles, and structured data to capture market share in Ahmedabad and Gujarat.
                </p>
                <div className="mt-auto pt-4 border-t border-outline-variant/50">
                  <span className="text-sm font-bold text-slate-400">Coming Soon</span>
                </div>
              </article>

              {/* Placeholder Article 3 */}
              <article className="border border-outline-variant p-6 hover:shadow-lg transition-shadow bg-white flex flex-col gap-4 group">
                <span className="text-xs font-label-caps text-primary uppercase tracking-widest">AI Automation</span>
                <h2 className="font-headline-lg text-xl font-bold text-slate-900 group-hover:text-primary transition-colors">
                  How AI Automation Can Help Small Businesses
                </h2>
                <p className="font-body-md text-sm text-slate-600 line-clamp-3">
                  Learn how integrating custom LLM workflows, automated lead routing, and intelligent chatbots can drastically reduce operational overhead.
                </p>
                <div className="mt-auto pt-4 border-t border-outline-variant/50">
                  <span className="text-sm font-bold text-slate-400">Coming Soon</span>
                </div>
              </article>

            </div>
          </div>
        </section>
        
        <ContactSection />
      </main>
    </>
  );
}
