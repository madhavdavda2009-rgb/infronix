"use client";
export default function FAQSection() {
  const faqs = [
    {
      question: "What is your typical project timeline?",
      answer: "Most web design and development projects take between 6 to 12 weeks from initial strategy to launch, depending on the complexity and scope of the requirements."
    },
    {
      question: "Do you provide ongoing SEO support?",
      answer: "Yes, we offer comprehensive ongoing digital marketing and technical SEO packages to ensure your site continues to rank well and drive conversions."
    },
    {
      question: "Will my website be mobile-friendly?",
      answer: "Absolutely. All our digital experiences are built with a mobile-first philosophy, ensuring responsive design and flawless performance across all devices."
    },
    {
      question: "What technologies do you use?",
      answer: "We specialize in modern web architectures including React, Next.js, and Tailwind CSS to deliver fast, secure, and highly scalable applications."
    }
  ];

  return (
    <section id="faq" className="w-full py-section-gap bg-surface relative z-20" aria-labelledby="faq-title">
      <div className="max-w-[800px] mx-auto px-margin-mobile md:px-margin-desktop">
        
        <div className="text-center mb-margin-desktop border-b border-outline-variant pb-margin-mobile">
          <span className="font-label-caps text-label-caps text-secondary tracking-widest uppercase mb-unit block font-bold">Support</span>
          <h2 id="faq-title" className="font-headline-lg text-headline-lg text-primary font-bold">Frequently Asked Questions</h2>
        </div>
        
        <div className="flex flex-col gap-margin-mobile" itemScope itemType="https://schema.org/FAQPage">
          {faqs.map((faq, index) => (
            <div key={index} className="border border-outline-variant p-margin-mobile bg-surface-container-lowest" itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
              <h3 className="font-headline-md text-headline-md text-primary mb-unit font-bold" itemProp="name">{faq.question}</h3>
              <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                <p className="font-body-md text-body-md text-on-surface-variant font-medium" itemProp="text">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
