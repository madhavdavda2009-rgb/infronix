import AboutSection from '@/components/AboutSection';
import CTASection from '@/components/CTASection';
import Breadcrumb from '@/components/Breadcrumb';

export const metadata = {
  title: 'About Us | InfronixWeb Digital Marketing',
  description: 'Learn about InfronixWeb Digital Marketing. Based in Sanand, Ahmedabad, we are a collective of engineers dedicated to technical excellence and digital brilliance.',
  alternates: {
    canonical: 'https://www.infronixweb.in/about'
  }
};

export default function AboutPage() {
  return (
    <>
      <main className="w-full pt-20 sm:pt-28 md:pt-32" id="main-content">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12 pt-4 sm:pt-6">
          <Breadcrumb />
        </div>
        <AboutSection asH1={true} />

        {/* Local Context */}
        <section className="w-full py-12 sm:py-16 bg-surface border-b border-outline-variant/30">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 md:px-12">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-heading font-bold text-on-surface mb-4 sm:mb-6">Our Roots in Ahmedabad</h2>
            <div className="prose max-w-4xl text-main-text space-y-4 text-sm sm:text-base leading-relaxed">
              <p>
                Operating out of Sanand, Ahmedabad, InfronixWeb Digital Marketing partners with forward-thinking businesses across Gujarat and India. While we operate a modern, remote-first workflow to ensure maximum efficiency, our roots in the thriving tech ecosystem of Ahmedabad drive our commitment to quality, innovation, and local business growth.
              </p>
            </div>
          </div>
        </section>

        <CTASection />
      </main>
    </>
  );
}
