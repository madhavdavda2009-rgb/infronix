import ContactSection from '@/components/ContactSection';
import ConsultationForm from '@/components/ConsultationForm';
import FAQSection from '@/components/FAQSection';

export const metadata = {
  title: 'Contact Infronix | Web Agency in Ahmedabad',
  description: 'Get in touch with Infronix Web Agency. We serve clients in Ahmedabad, Gujarat, and globally with premium web development and SEO services.',
  alternates: {
    canonical: 'https://www.infronixweb.in/contact'
  }
};

export default function ContactPage() {
  return (
    <>
      <main className="w-full pt-28 md:pt-32" id="main-content">
        <ContactSection />
        <ConsultationForm />
        <FAQSection />
      </main>
    </>
  );
}
