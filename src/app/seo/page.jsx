import ContactSection from '@/components/ContactSection';
import FAQSection from '@/components/FAQSection';
import PricingSection from '@/components/pricing/PricingSection';

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
      <main className="w-full pt-28 md:pt-32" id="main-content">
        <section className="relative w-full min-h-[560px] md:h-[700px] flex items-center bg-navy-muted overflow-hidden pt-20 pb-12" aria-label="SEO Services">
          <img
            src="/hero_bg.webp"
            alt="SEO Analytics and Search Rankings"
            className="absolute inset-0 w-full h-full object-cover object-center opacity-30 mix-blend-luminosity"
            width="1920"
            height="700"
            fetchPriority="high"
            decoding="async"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-navy-muted via-navy-muted/95 to-navy-muted/60"></div>

          <div className="relative z-10 max-w-[1280px] w-full mx-auto px-margin-mobile md:px-margin-desktop flex flex-col gap-6">
            <div className="flex flex-col gap-4 max-w-3xl border-l-2 border-champagne-light pl-4 sm:pl-gutter py-2">
              <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-[60px] text-surface font-semibold leading-tight">
                Technical SEO Agency
              </h1>
              <p className="font-body-md text-sm sm:text-base md:text-lg text-slate-200 font-medium max-w-xl leading-relaxed">
                We implement robust technical and on-page SEO strategies that drive legitimate, long-term organic visibility for modern brands.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-2 sm:pl-gutter w-full sm:w-auto">
              <a 
                href="/start-project" 
                className="bg-champagne-light text-navy-muted font-label-caps uppercase tracking-widest text-xs px-6 py-3.5 rounded-none hover:bg-white transition-all shadow-lg border border-champagne-light text-center font-bold"
              >
                Boost Your Rankings
              </a>
            </div>
          </div>
        </section>

        <section className="w-full py-16 md:py-24 bg-surface text-slate-900 border-b border-outline-variant/30">
          <div className="max-w-[1280px] mx-auto px-margin-mobile md:px-margin-desktop">
            <h2 className="font-headline-lg text-2xl sm:text-3xl md:text-4xl text-primary font-bold mb-8">Data-Driven SEO Strategies</h2>
            <div className="prose max-w-4xl font-body-md text-slate-700 space-y-6">
              <p>
                Search Engine Optimization is not about tricks or shortcuts. It is about building a high-quality technical foundation and providing the exact value that search engines and users are looking for. As a specialized <strong>SEO Agency</strong>, we follow strict Google Search Essentials guidelines to ensure your traffic is sustainable.
              </p>
              
              <h3 className="font-bold text-xl text-primary mt-8 mb-4">Our SEO Capabilities</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Technical SEO:</strong> Core Web Vitals optimization, semantic HTML mapping, Server-Side Rendering (SSR) configuration, and crawl budget management.</li>
                <li><strong>Local SEO:</strong> Ensuring businesses in Ahmedabad and Gujarat appear exactly when local customers search for their services.</li>
                <li><strong>Content & On-Page:</strong> Strategic keyword mapping, internal linking architecture, and structured data (JSON-LD) implementation.</li>
                <li><strong>Performance Monitoring:</strong> Continuous tracking via Google Search Console and technical audits.</li>
              </ul>

              <h3 className="font-bold text-xl text-primary mt-8 mb-4">Why Technical SEO Matters</h3>
              <p>
                A beautiful website is useless if search engines cannot crawl or understand it. By fixing indexing issues, optimizing site architecture, and utilizing proper canonicalization, we ensure that Google correctly interprets your domain authority and content intent.
              </p>
            </div>
          </div>
        </section>

        <PricingSection serviceKey="seo" />
        <ContactSection />
        <FAQSection />
      </main>
    </>
  );
}
