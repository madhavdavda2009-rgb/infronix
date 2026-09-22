import { pageMetadata } from '@/lib/site-seo';
import ConsultationForm from '@/components/ConsultationForm';
import FAQSection from '@/components/FAQSection';
import Breadcrumb from '@/components/Breadcrumb';

export const metadata = pageMetadata("Contact Our Digital Agency in Ahmedabad", "Discuss websites, SEO, digital marketing, ads or automation with InfronixWeb in Ahmedabad. Tell us what your business needs.", '/contact');

export default function ContactPage() {
  return (
    <>
      <main className="w-full pt-20 sm:pt-28 md:pt-32" id="main-content">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12 pt-4 sm:pt-6">
          <Breadcrumb />
        </div>
        <ConsultationForm />
        <FAQSection />
      </main>
    </>
  );
}
