import PortfolioSection from '@/components/PortfolioSection';
import ContactSection from '@/components/ContactSection';
import FAQSection from '@/components/FAQSection';

export const metadata = {
  title: 'Client Projects & Portfolio | Infronix Web Agency',
  description: 'View our featured projects. We partner with forward-thinking brands in Ahmedabad and across India to create stunning, high-performance digital experiences.',
  alternates: {
    canonical: 'https://www.infronixweb.in/projects'
  }
};

export default function ProjectsPage() {
  return (
    <>
      <main className="w-full pt-28 md:pt-32" id="main-content">
        <PortfolioSection />
        <ContactSection />
        <FAQSection />
      </main>
    </>
  );
}
