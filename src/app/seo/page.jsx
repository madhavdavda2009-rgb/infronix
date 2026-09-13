import FAQSection from '@/components/FAQSection';
import CTASection from '@/components/CTASection';
import Breadcrumb from '@/components/Breadcrumb';
import Link from 'next/link';

export const metadata = {
  title: 'SEO Agency & Technical SEO Services in Ahmedabad',
  description: 'Infronix Web Agency provides expert Technical SEO, Local SEO, and performance optimization services to help businesses in Ahmedabad and India rank higher organically.',
  alternates: {
    canonical: 'https://www.infronixweb.in/seo'
  }
};

export default function SEOPage() {
  return (
    <>
      <main className="w-full pt-20 sm:pt-28 md:pt-32" id="main-content">
        {/* Hero — matches Home page light design */}
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
                Search Engine Optimization (SEO)
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-main-text font-medium max-w-xl leading-relaxed">
                We help your business get found on Google by customers who are actively searching for the products and services you offer.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-2 w-full sm:w-auto">
              <Link
                href="/start-project"
                className="bg-primary text-white font-bold text-xs sm:text-sm px-6 py-3.5 sm:px-8 sm:py-4 rounded-md hover:bg-primary-dark transition-all hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_15px_rgba(139, 92, 246,0.3)] text-center w-full sm:w-auto"
              >
                Boost Your Rankings
              </Link>
            </div>
          </div>
        </section>

        <section className="w-full py-12 sm:py-16 md:py-24 bg-surface border-b border-outline-variant/30">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 md:px-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold text-on-surface mb-6 sm:mb-8">Proven SEO for Real Business Growth</h2>
            <div className="prose max-w-4xl text-main-text space-y-6">
              <p>
                Search Engine Optimization is not about tricks or temporary shortcuts. It is about building a clean, trustworthy website that gives search engines and real customers exactly what they are looking for. As your dedicated <strong className="text-on-surface">SEO partner</strong>, we follow best practices to bring steady, long-term traffic to your business.
              </p>

              <h3 className="font-bold text-xl text-on-surface mt-8 mb-4">How We Help You Rank Higher</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong className="text-on-surface">Speed &amp; Structure:</strong> Ensuring your website loads fast, works seamlessly on mobile, and is easy for Google to understand.</li>
                <li><strong className="text-on-surface">Local Search Visibility:</strong> Helping local customers in Ahmedabad, Gujarat, and across India find your business when searching nearby.</li>
                <li><strong className="text-on-surface">Content &amp; Keywords:</strong> Crafting page titles and descriptions that match the exact search terms your potential buyers use.</li>
                <li><strong className="text-on-surface">Performance Tracking:</strong> Regular reports and visibility updates so you can see your search rankings grow over time.</li>
              </ul>

              <h3 className="font-bold text-xl text-on-surface mt-8 mb-4">Why Search Visibility Matters</h3>
              <p>
                A great website needs qualified visitors to generate sales. By making your site easy for search engines to find, index, and recommend, we help you reach active buyers without relying solely on paid ads.
              </p>
            </div>
          </div>
        </section>

        <CTASection />
        <FAQSection />
      </main>
    </>
  );
}
