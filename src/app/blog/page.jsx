import CTASection from '@/components/CTASection';
import Breadcrumb from '@/components/Breadcrumb';
import BlogListClient from '@/components/BlogListClient';

export const metadata = {
  title: 'Blog & Insights | Web Development, Local SEO & AI Automation | InfronixWeb',
  description: 'Explore actionable insights, engineering guides, and digital growth strategies for custom websites, Google Maps visibility, and AI automation.',
  alternates: {
    canonical: 'https://www.infronixweb.in/blog'
  },
  openGraph: {
    title: 'Blog & Insights | InfronixWeb',
    description: 'Actionable articles, guides, and practical insights on custom website creation, local Google search growth, and smart business automations.',
    url: 'https://www.infronixweb.in/blog',
    siteName: 'InfronixWeb',
    locale: 'en_IN',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog & Insights | InfronixWeb',
    description: 'Actionable articles, guides, and practical insights on custom website creation, local Google search growth, and smart business automations.'
  }
};

export default function BlogPage() {
  return (
    <>
      <main className="w-full pt-20 sm:pt-28 md:pt-32 min-h-screen bg-surface" id="main-content">
        {/* Header Section */}
        <section className="relative w-full py-10 sm:py-14 md:py-20" aria-label="Blog Header">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 md:px-12">
            <Breadcrumb className="justify-center mb-4" />
            <div className="text-center max-w-3xl mx-auto">
              <span className="flex items-center justify-center gap-2 text-xs font-bold tracking-widest uppercase text-primary mb-3 sm:mb-4">
                <span className="w-6 sm:w-8 h-[2px] bg-primary" /> Digital Insights <span className="w-6 sm:w-8 h-[2px] bg-primary" />
              </span>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-on-surface mb-4 sm:mb-6 leading-tight">
                Strategies & Insights for Modern Digital Growth
              </h1>
              <p className="text-sm sm:text-base md:text-lg text-main-text leading-relaxed">
                Practical guides, architecture breakdowns, and actionable blueprints for high-performing web platforms, search rankings, and business automation.
              </p>
            </div>
          </div>
        </section>

        {/* Dynamic Database-Driven Articles Section */}
        <BlogListClient />

        <CTASection />
      </main>
    </>
  );
}
