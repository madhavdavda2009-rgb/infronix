"use client";
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import ServicesSection from '@/components/ServicesSection';
import PortfolioSection from '@/components/PortfolioSection';
import TrustSection from '@/components/TrustSection';
import ContactSection from '@/components/ContactSection';
import FAQSection from '@/components/FAQSection';
import ConsultationForm from '@/components/ConsultationForm';
import SEO from '@/components/SEO';

export default function Home() {
  return (
    <>
      <SEO
        title="Home"
        description="infronix Web Agency - Designing digital brilliance and technical innovation for modern brands."
      />
      <main className="w-full pt-28 md:pt-32" id="main-content">
        <HeroSection />

        <ServicesSection />
        <PortfolioSection />
        <AboutSection />
        <TrustSection />
        <ContactSection />
        <FAQSection />
        <ConsultationForm />
      </main>
    </>
  );
}
