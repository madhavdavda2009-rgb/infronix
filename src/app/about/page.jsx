import AboutSection from '@/components/AboutSection';
import TrustSection from '@/components/TrustSection';
import ContactSection from '@/components/ContactSection';

export const metadata = {
  title: 'About Us | Infronix Web Agency',
  description: 'Learn about Infronix Web Agency. Based in Sanand, Ahmedabad, we are a collective of engineers dedicated to technical excellence and digital brilliance.',
  alternates: {
    canonical: 'https://www.infronixweb.in/about'
  }
};

export default function AboutPage() {
  return (
    <>
      <main className="w-full pt-28 md:pt-32" id="main-content">
        <AboutSection />
        <TrustSection />
        
        {/* Additional Local Context */}
        <section className="w-full py-16 bg-surface text-slate-900 border-b border-outline-variant/30">
          <div className="max-w-[1280px] mx-auto px-margin-mobile md:px-margin-desktop">
            <h2 className="font-headline-lg text-2xl sm:text-3xl text-primary font-bold mb-6">Our Roots in Ahmedabad</h2>
            <div className="prose max-w-4xl font-body-md text-slate-700 space-y-4">
              <p>
                Operating out of Sanand, Ahmedabad, Infronix Web Agency partners with forward-thinking businesses across Gujarat and India. While we operate a modern, remote-first workflow to ensure maximum efficiency, our roots in the thriving tech ecosystem of Ahmedabad drive our commitment to quality, innovation, and local business growth.
              </p>
            </div>
          </div>
        </section>
        
        <ContactSection />
      </main>
    </>
  );
}
