import ConsultationForm from '@/components/ConsultationForm';
import FAQSection from '@/components/FAQSection';
import Breadcrumb from '@/components/Breadcrumb';

export const metadata = {
  title: 'Contact InfronixWeb | Web Agency in Ahmedabad',
  description: 'Contact InfronixWeb Digital Marketing. We serve clients in Ahmedabad, Gujarat, and globally with premium web development and SEO services.',
  alternates: {
    canonical: 'https://www.infronixweb.in/contact'
  }
};

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
