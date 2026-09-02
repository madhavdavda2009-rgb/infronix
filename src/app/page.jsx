import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import ServicesSection from '@/components/ServicesSection';
import ProcessSection from '@/components/ProcessSection';
import PortfolioSection from '@/components/PortfolioSection';
import TrustSection from '@/components/TrustSection';
import ContactSection from '@/components/ContactSection';
import FAQSection from '@/components/FAQSection';

export default function Home() {
  return (
    <>
      <main className="w-full pt-28 md:pt-32" id="main-content">
        <HeroSection />
        <ServicesSection />
        <ProcessSection />
        <PortfolioSection />
        <AboutSection />
        <TrustSection />
        <ContactSection />
        <FAQSection />
      </main>
    </>
  );
}
