import FAQSection from '@/components/FAQSection';
import CTASection from '@/components/CTASection';
import Breadcrumb from '@/components/Breadcrumb';
import Link from 'next/link';
import { Gear, FileText, MagnifyingGlass, MapPin, Article, ChartLineUp } from '@phosphor-icons/react/dist/ssr';

export const metadata = {
  title: 'SEO Optimization Services in Ahmedabad | InfronixWeb',
  description: 'InfronixWeb helps businesses improve search engine visibility with Technical SEO, On-Page SEO, keyword research, Local SEO, and content optimization in Ahmedabad, Gujarat, and across India.',
  keywords: [
    'SEO Optimization Services',
    'SEO Agency',
    'SEO Company',
    'Search Engine Optimization',
    'Local SEO Services',
    'Technical SEO Services',
    'On-Page SEO',
    'Keyword Research Services',
    'Google Business Profile Optimization',
    'SEO Agency in Ahmedabad',
    'SEO Company in Gujarat',
    'Digital Marketing Agency in Ahmedabad'
  ],
  alternates: {
    canonical: 'https://www.infronixweb.in/seo'
  }
};

const services = [
  {
    icon: Gear,
    title: 'Technical SEO',
    desc: 'Improve website structure, crawlability, indexing, and technical performance.'
  },
  {
    icon: FileText,
    title: 'On-Page SEO',
    desc: 'Optimize page titles, headings, content, internal links, and other important website elements.'
  },
  {
    icon: MagnifyingGlass,
    title: 'Keyword Research',
    desc: 'Discover relevant search terms that your potential customers use to find products and services.'
  },
  {
    icon: MapPin,
    title: 'Local SEO',
    desc: 'Help businesses improve their visibility in relevant local search results and Google Business Profile.'
  },
  {
    icon: Article,
    title: 'Content Optimization',
    desc: 'Create useful, search-friendly content that supports your audience and organic visibility.'
  },
  {
    icon: ChartLineUp,
    title: 'SEO Reporting',
    desc: 'Track important performance metrics and identify opportunities for improvement.'
  }
];

export default function SEOPage() {
  return (
    <>
      <main className="w-full pt-20 sm:pt-28 md:pt-32" id="main-content">
        {/* Hero */}
        <section className="relative w-full min-h-[480px] sm:min-h-[560px] md:min-h-[640px] flex items-center bg-surface-container-lowest overflow-hidden pt-16 sm:pt-20 pb-12 sm:pb-16" aria-label="SEO Services">
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 right-1/4 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-soft-violet rounded-full blur-[80px] sm:blur-[120px] opacity-30 mix-blend-multiply" />
            <div className="absolute bottom-1/3 left-1/3 w-[250px] sm:w-[400px] h-[250px] sm:h-[400px] bg-[#00F5D4]/20 rounded-full blur-[60px] sm:blur-[80px] opacity-40 mix-blend-multiply" />
          </div>

          <div className="relative z-10 max-w-[1280px] w-full mx-auto px-4 sm:px-6 md:px-12 flex flex-col gap-5 sm:gap-6">
            <Breadcrumb />
            <div className="flex flex-col gap-3 sm:gap-4 max-w-3xl">
              <span className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-primary">
                <span className="w-8 sm:w-12 h-[2px] bg-primary" /> SEO Optimization
              </span>
              <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-heading font-bold text-on-surface leading-tight tracking-tight">
                Get Found. Get Noticed. Grow Online.
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-main-text font-medium max-w-2xl leading-relaxed">
                InfronixWeb is a digital marketing agency helping businesses improve their search engine visibility, reach relevant customers, and build a stronger online presence.
              </p>
              <p className="text-sm sm:text-base text-text-light font-medium max-w-2xl leading-relaxed">
                Our SEO optimization services focus on technical improvements, relevant content, keyword research, and local search strategies designed around your business goals.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-2 w-full sm:w-auto">
              <Link
                href="/start-project"
                className="bg-primary text-white font-bold text-xs sm:text-sm px-6 py-3.5 sm:px-8 sm:py-4 rounded-md hover:bg-primary-dark transition-all hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_15px_rgba(139,92,246,0.3)] text-center w-full sm:w-auto"
              >
                Get a Quote
              </Link>
            </div>
          </div>
        </section>

        {/* Our SEO Services — Services Grid */}
        <section className="w-full py-12 sm:py-16 md:py-24 bg-surface border-b border-outline-variant/30">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 md:px-12">
            <div className="mb-10 sm:mb-14 max-w-2xl">
              <span className="text-xs sm:text-sm font-bold tracking-widest uppercase text-primary mb-2 sm:mb-3 flex items-center gap-3">
                <span className="w-8 sm:w-12 h-[2px] bg-primary" /> What We Do
              </span>
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-heading font-bold text-on-surface leading-tight">
                Our SEO Services
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {services.map((service, idx) => {
                const IconComponent = service.icon;
                return (
                  <div
                    key={idx}
                    className="group bg-surface-container-lowest border border-outline-variant/60 hover:border-primary/50 rounded-2xl p-6 sm:p-8 transition-all duration-300 hover:shadow-xl flex flex-col gap-4"
                  >
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-surface border border-outline-variant flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                      <IconComponent size={24} weight="duotone" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-heading font-bold text-on-surface group-hover:text-primary transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-sm sm:text-base text-main-text leading-relaxed">
                      {service.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Why SEO Matters */}
        <section className="w-full py-12 sm:py-16 md:py-24 bg-surface-container-lowest border-b border-outline-variant/30">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 md:px-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold text-on-surface mb-6 sm:mb-8">
              Why SEO Matters
            </h2>
            <div className="prose max-w-4xl text-main-text space-y-6">
              <p>
                A strong SEO strategy can help your business become more discoverable, attract relevant website visitors, and build long-term organic growth opportunities. Whether you are targeting customers in Ahmedabad, Gujarat, or across India, search visibility is essential for sustainable growth.
              </p>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="w-full py-12 sm:py-16 md:py-24 bg-surface border-b border-outline-variant/30">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 md:px-12 text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold text-on-surface mb-4 sm:mb-6">
              Ready to Improve Your Online Visibility?
            </h2>
            <p className="text-base sm:text-lg text-main-text font-medium max-w-2xl mx-auto mb-6 sm:mb-8 leading-relaxed">
              Let&apos;s build an SEO strategy that helps your business reach the right audience.
            </p>
            <Link
              href="/start-project"
              className="inline-block bg-primary text-white font-bold text-xs sm:text-sm px-8 py-4 rounded-md hover:bg-primary-dark transition-all hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_15px_rgba(139,92,246,0.3)]"
            >
              Get a Quote
            </Link>
          </div>
        </section>

        <CTASection />
        <FAQSection />
      </main>
    </>
  );
}
