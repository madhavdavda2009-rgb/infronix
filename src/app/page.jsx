import dynamic from 'next/dynamic';
import HeroSection from '@/components/HeroSection';
import ServicesSection from '@/components/ServicesSection';
import PortfolioSection from '@/components/PortfolioSection';
import AboutSection from '@/components/AboutSection';

const ProcessSection = dynamic(() => import('@/components/ProcessSection'));
const TeamSection = dynamic(() => import('@/components/TeamSection'));
const FAQSection = dynamic(() => import('@/components/FAQSection'));
const CTASection = dynamic(() => import('@/components/CTASection'));

export default function Home() {
  return (
    <>
      <main className="w-full pt-20 sm:pt-24 md:pt-28 lg:pt-32" id="main-content">
        <HeroSection />
        <ServicesSection />
        <PortfolioSection />
        <AboutSection />
        <ProcessSection />
        <TeamSection />
        <FAQSection />
        <CTASection />
      </main>
    </>
  );
}

