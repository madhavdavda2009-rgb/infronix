import { pageMetadata } from '@/lib/site-seo';
import PortfolioSection from '@/components/PortfolioSection';
import CTASection from '@/components/CTASection';
import FAQSection from '@/components/FAQSection';
import Breadcrumb from '@/components/Breadcrumb';

export const metadata = pageMetadata("Selected Website Projects", "Explore selected website work from InfronixWeb and discuss a project for your business.", '/projects');

export default function ProjectsPage() {
  return (
    <>
      <main className="w-full pt-20 sm:pt-28 md:pt-32" id="main-content">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12 pt-4 sm:pt-6">
          <Breadcrumb />
        </div>
        <PortfolioSection asH1={true} />
        <CTASection />
        <FAQSection />
      </main>
    </>
  );
}
