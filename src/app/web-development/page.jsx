import FAQSection from '@/components/FAQSection';
import CTASection from '@/components/CTASection';
import Breadcrumb from '@/components/Breadcrumb';
import Link from 'next/link';

export const metadata = {
  title: 'Custom Web Development Agency in Ahmedabad',
  description: 'InfronixWeb Digital Marketing provides premium, responsive, and high-performance custom website development services for modern businesses in Ahmedabad, Gujarat, and across India.',
  alternates: {
    canonical: 'https://www.infronixweb.in/web-development'
  }
};

export default function WebDevelopmentPage() {
  return (
    <>
      <main className="w-full pt-20 sm:pt-28 md:pt-32" id="main-content">
        {/* Hero — matches Home page light design */}
        <section className="relative w-full min-h-[480px] sm:min-h-[560px] md:min-h-[640px] flex items-center bg-surface-container-lowest overflow-hidden pt-16 sm:pt-20 pb-12 sm:pb-16" aria-label="Web Development Services">
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 right-1/4 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-soft-violet rounded-full blur-[80px] sm:blur-[120px] opacity-30 mix-blend-multiply" />
            <div className="absolute bottom-1/3 left-1/3 w-[250px] sm:w-[400px] h-[250px] sm:h-[400px] bg-[#00F5D4]/20 rounded-full blur-[60px] sm:blur-[80px] opacity-40 mix-blend-multiply" />
          </div>

          <div className="relative z-10 max-w-[1280px] w-full mx-auto px-4 sm:px-6 md:px-12 flex flex-col gap-5 sm:gap-6">
            <Breadcrumb />
            <div className="flex flex-col gap-3 sm:gap-4 max-w-3xl">
              <span className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-primary">
                <span className="w-8 sm:w-12 h-[2px] bg-primary" /> Web Development
              </span>
              <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-heading font-bold text-on-surface leading-tight tracking-tight">
                Custom Web Development Agency
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-main-text font-medium max-w-xl leading-relaxed">
                We build fast, elegant, and mobile-friendly websites designed to attract visitors and turn them into paying customers for businesses in Ahmedabad and beyond.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-2 w-full sm:w-auto">
              <Link
                href="/start-project"
                className="bg-primary text-white font-bold text-xs sm:text-sm px-6 py-3.5 sm:px-8 sm:py-4 rounded-md hover:bg-primary-dark transition-all hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_15px_rgba(139, 92, 246,0.3)] text-center w-full sm:w-auto"
              >
                Get a Quote
              </Link>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="w-full py-12 sm:py-16 md:py-24 bg-surface border-b border-outline-variant/30">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 md:px-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold text-on-surface mb-6 sm:mb-8">Custom Websites Built for Business Growth</h2>
            <div className="prose max-w-4xl text-main-text space-y-6">
              <p>
                In today&apos;s digital-first economy, a generic template is no longer enough. Your website is the core of your brand&apos;s digital identity. At InfronixWeb Digital Marketing, we specialize in <strong className="text-on-surface">custom website development</strong> that combines clean design with fast loading and reliable performance.
              </p>
              <h3 className="font-bold text-xl text-on-surface mt-8 mb-4">Why Choose a Custom Website?</h3>
              <p>
                We build fast, modern websites tailored specifically to your business goals. Your website will load instantly on all mobile phones, tablets, and computers, giving your visitors a smooth experience that builds trust and drives more inquiries.
              </p>
              <h3 className="font-bold text-xl text-on-surface mt-8 mb-4">Our Website Creation Process</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong className="text-on-surface">Discovery &amp; Planning:</strong> We learn about your business goals, target customers, and essential features.</li>
                <li><strong className="text-on-surface">Custom Design:</strong> Creating a modern, premium look that reflects your brand identity.</li>
                <li><strong className="text-on-surface">Clean Development:</strong> Building a fast, secure, and reliable website that works smoothly on every screen.</li>
                <li><strong className="text-on-surface">Testing &amp; Launch:</strong> Thoroughly checking every page and setting up your site to be easily found on Google.</li>
              </ul>
            </div>
          </div>
        </section>

        <CTASection />
        <FAQSection />
      </main>
    </>
  );
}
