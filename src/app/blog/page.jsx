import CTASection from '@/components/CTASection';
import Breadcrumb from '@/components/Breadcrumb';

export const metadata = {
  title: 'Blog | Web Development & SEO Insights | InfronixWeb',
  description: 'Read the latest insights on web development, technical SEO, and AI automation for businesses in Ahmedabad and across India.',
  alternates: {
    canonical: 'https://www.infronixweb.in/blog'
  }
};

export default function BlogPage() {
  return (
    <>
      <main className="w-full pt-20 sm:pt-28 md:pt-32 min-h-screen bg-surface" id="main-content">
        <section className="relative w-full py-12 sm:py-16 md:py-24" aria-label="Blog Header">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 md:px-12">
            <Breadcrumb className="justify-center" />
            <div className="text-center">
            <span className="flex items-center justify-center gap-2 text-xs font-bold tracking-widest uppercase text-primary mb-3 sm:mb-4">
              <span className="w-6 sm:w-8 h-[2px] bg-primary" /> Insights <span className="w-6 sm:w-8 h-[2px] bg-primary" />
            </span>
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-heading font-bold text-on-surface mb-4 sm:mb-6">InfronixWeb Digital Insights</h1>
            <p className="text-sm sm:text-base text-main-text max-w-2xl mx-auto leading-relaxed">
              Actionable articles, guides, and practical insights on custom website creation, local Google search growth, and smart business automations.
            </p>
            </div>
          </div>
        </section>

        <section className="w-full py-10 sm:py-12 md:py-20 border-t border-outline-variant/30">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 md:px-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">

              <article className="border border-outline-variant p-6 hover:shadow-lg transition-shadow bg-surface-container-lowest flex flex-col gap-4 group rounded-xl">
                <span className="text-xs font-bold text-primary uppercase tracking-widest">Web Development</span>
                <h2 className="text-xl font-heading font-bold text-on-surface group-hover:text-primary transition-colors">
                  What Should a Modern Business Website Include?
                </h2>
                <p className="text-sm text-main-text line-clamp-3">
                  Discover the essential features, clean design principles, and mobile-friendly standards every business website needs to build trust and attract customers.
                </p>
                <div className="mt-auto pt-4 border-t border-outline-variant/50">
                  <span className="text-sm font-bold text-text-light">Coming Soon</span>
                </div>
              </article>

              <article className="border border-outline-variant p-6 hover:shadow-lg transition-shadow bg-surface-container-lowest flex flex-col gap-4 group rounded-xl">
                <span className="text-xs font-bold text-primary uppercase tracking-widest">Local SEO</span>
                <h2 className="text-xl font-heading font-bold text-on-surface group-hover:text-primary transition-colors">
                  How Local SEO Helps Ahmedabad Businesses
                </h2>
                <p className="text-sm text-main-text line-clamp-3">
                  A practical guide on setting up Google Maps, local search visibility, and customer reviews to attract more nearby clients in Ahmedabad and Gujarat.
                </p>
                <div className="mt-auto pt-4 border-t border-outline-variant/50">
                  <span className="text-sm font-bold text-text-light">Coming Soon</span>
                </div>
              </article>

              <article className="border border-outline-variant p-6 hover:shadow-lg transition-shadow bg-surface-container-lowest flex flex-col gap-4 group rounded-xl">
                <span className="text-xs font-bold text-primary uppercase tracking-widest">AI Automation</span>
                <h2 className="text-xl font-heading font-bold text-on-surface group-hover:text-primary transition-colors">
                  How AI Automation Can Help Small Businesses
                </h2>
                <p className="text-sm text-main-text line-clamp-3">
                  Learn how 24/7 customer chat assistants and automatic inquiry follow-ups can save your team hours of manual work every week.
                </p>
                <div className="mt-auto pt-4 border-t border-outline-variant/50">
                  <span className="text-sm font-bold text-text-light">Coming Soon</span>
                </div>
              </article>

            </div>
          </div>
        </section>

        <CTASection />
      </main>
    </>
  );
}
