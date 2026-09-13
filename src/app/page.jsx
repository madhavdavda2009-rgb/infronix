import HeroSection from '@/components/HeroSection';
import ServicesSection from '@/components/ServicesSection';
import PortfolioSection from '@/components/PortfolioSection';
import AboutSection from '@/components/AboutSection';
import ProcessSection from '@/components/ProcessSection';
import TeamSection from '@/components/TeamSection';
import CTASection from '@/components/CTASection';

export default function Home() {
  return (
    <>
      <main className="w-full pt-16 sm:pt-20 lg:pt-24" id="main-content">
        <HeroSection />
        <ServicesSection />
        <PortfolioSection />
        <AboutSection />
        <ProcessSection />
        <TeamSection />
        <CTASection />
      </main>
    </>
  );
}

