import ContactSection from '@/components/ContactSection';
import FAQSection from '@/components/FAQSection';
import PricingSection from '@/components/pricing/PricingSection';

export const metadata = {
  title: 'Custom Web Development Agency in Ahmedabad',
  description: 'Infronix Web Agency provides premium, responsive, and high-performance custom website development services for modern businesses in Ahmedabad, Gujarat, and across India.',
  alternates: {
    canonical: 'https://www.infronixweb.in/web-development'
  }
};

export default function WebDevelopmentPage() {
  return (
    <>
      <main className="w-full pt-28 md:pt-32" id="main-content">
        {/* Replicated Hero UI with unique content */}
        <section className="relative w-full min-h-[560px] md:h-[700px] flex items-center bg-navy-muted overflow-hidden pt-20 pb-12" aria-label="Web Development Services">
          <img
            src="/hero_bg.webp"
            alt="Web Development and Coding"
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
                Custom Web Development Agency
              </h1>
              <p className="font-body-md text-sm sm:text-base md:text-lg text-slate-200 font-medium max-w-xl leading-relaxed">
                We engineer lightning-fast, accessible, and highly responsive web applications tailored for modern businesses in Ahmedabad and beyond.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-2 sm:pl-gutter w-full sm:w-auto">
              <a
                href="/start-project"
                className="bg-champagne-light text-navy-muted font-label-caps uppercase tracking-widest text-xs px-6 py-3.5 rounded-none hover:bg-white transition-all shadow-lg border border-champagne-light text-center font-bold"
              >
                Start Your Project
              </a>
            </div>
          </div>
        </section>

        {/* Unique Content Section utilizing existing typography/spacing */}
        <section className="w-full py-16 md:py-24 bg-surface text-slate-900 border-b border-outline-variant/30">
          <div className="max-w-[1280px] mx-auto px-margin-mobile md:px-margin-desktop">
            <h2 className="font-headline-lg text-2xl sm:text-3xl md:text-4xl text-primary font-bold mb-8">Modern Business Websites</h2>
            <div className="prose max-w-4xl font-body-md text-slate-700 space-y-6">
              <p>
                In today's digital-first economy, a generic website is no longer enough. Your website is the core of your brand's digital identity. At Infronix Web Agency, we specialize in <strong>custom website development</strong> that combines breathtaking design with uncompromising performance.
              </p>
              <h3 className="font-bold text-xl text-primary mt-8 mb-4">Why Modern Development?</h3>
              <p>
                We exclusively build using the modern tech stack. This ensures your business website achieves perfect Core Web Vitals, instantaneous page loads, and seamless integrations. This isn't just about looks; it's about providing a frictionless experience that converts visitors into loyal clients.
              </p>
              <h3 className="font-bold text-xl text-primary mt-8 mb-4">Our Web Development Process</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Discovery & Architecture:</strong> We map out your exact business needs and technical requirements.</li>
                <li><strong>UI/UX Design:</strong> Crafting a premium, responsive interface with smooth GSAP animations.</li>
                <li><strong>Full-Stack Engineering:</strong> Building robust, secure frontend and backend systems.</li>
                <li><strong>Performance & SEO Optimization:</strong> Launching with 100/100 Lighthouse scores.</li>
              </ul>
            </div>
          </div>
        </section>

        <PricingSection serviceKey="web-development" />
        <ContactSection />
        <FAQSection />
      </main>
    </>
  );
}
