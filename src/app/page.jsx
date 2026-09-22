import ServiceDirectory from '@/components/ServiceDirectory';
import Link from 'next/link';
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
        <section className="py-12 sm:py-16 bg-surface" aria-label="Build, Grow and Automate services"><div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12"><ServiceDirectory compact /></div></section>
        <ServicesSection />
        <PortfolioSection />
        <AboutSection />
        <ProcessSection />
        <TeamSection />
        <section className="py-12 bg-surface-container-lowest"><div className="max-w-[1280px] mx-auto px-4 sm:px-6 md:px-12"><h2 className="text-2xl sm:text-3xl mb-4">A clearer next step for your business</h2><p className="max-w-2xl leading-relaxed mb-4">Explore our insights on websites, search visibility, marketing and automation before deciding what to invest in.</p><Link href="/blog" className="inline-flex min-h-11 items-center text-primary underline underline-offset-4">Read our insights</Link></div></section>
        <FAQSection />
        <CTASection />
      </main>
    </>
  );
}

