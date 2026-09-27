"use client";

const FAQS = [
  {
    "question": "What can InfronixWeb help our business with?",
    "answer": "We help businesses build high-performance web applications, scale search visibility through SEO, run high-ROI digital advertising campaigns, and automate customer workflows like lead capture, CRM synchronization, and WhatsApp follow-ups."
  },
  {
    "question": "Can we start with just one specific service?",
    "answer": "Yes. We can scope a standalone web application, a technical SEO audit, a targeted advertising campaign, or an automation pipeline tailored around your immediate business priority."
  },
  {
    "question": "Do you work with businesses in Ahmedabad and across India?",
    "answer": "InfronixWeb is headquartered in Ahmedabad, Gujarat. We collaborate directly with high-growth businesses locally across Gujarat and remotely with ambitious companies nationwide."
  },
  {
    "question": "How are project costs and timelines determined?",
    "answer": "We review your functional requirements, architecture scope, integrations, and deliverables before delivering a detailed proposal. Ad spend and third-party software licenses are always scoped transparently."
  },
  {
    "question": "Do you guarantee search rankings or ad results?",
    "answer": "We set measurable performance benchmarks and track conversions rigorously. While search algorithms and market competition dictate natural variations, we focus on engineering strategies that deliver measurable commercial ROI."
  },
  {
    "question": "Can you integrate with our existing software stack?",
    "answer": "Yes. We evaluate your current tools, APIs, webhooks, and database infrastructure to build seamless automations with proper error boundaries and human-in-the-loop controls."
  }
];

export default function FAQSection() {
  return (
    <section id="faq" className="w-full py-16 sm:py-20 md:py-24 bg-surface relative z-20" aria-labelledby="faq-title">
      <div className="max-w-[900px] mx-auto px-4 sm:px-6 md:px-8">

        <div className="text-center mb-10 sm:mb-14 border-b border-outline pb-6 sm:pb-8">
          <span className="font-heading text-xs text-primary tracking-widest uppercase mb-2 block font-semibold">
            Frequently Asked Questions
          </span>
          <h2 id="faq-title" className="font-heading text-2xl sm:text-3xl md:text-4xl text-on-surface font-bold">
            Working with InfronixWeb
          </h2>
          <p className="font-body text-xs sm:text-sm md:text-base text-main-text max-w-xl mx-auto mt-2 leading-relaxed">
            Everything you need to know about partnering with our Ahmedabad digital agency for your website, marketing, and automation needs.
          </p>
        </div>

        <div className="flex flex-col gap-3.5 sm:gap-4" itemScope itemType="https://schema.org/FAQPage">
          {FAQS.map((faq, index) => (
            <div
              key={index}
              className="border border-outline p-5 sm:p-6 md:p-7 bg-surface-container-lowest hover:border-primary/40 hover:shadow-md transition-all rounded-2xl"
              itemScope
              itemProp="mainEntity"
              itemType="https://schema.org/Question"
            >
              <h3 className="font-heading text-base sm:text-lg text-on-surface mb-2.5 font-bold leading-snug" itemProp="name">
                {faq.question}
              </h3>
              <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                <p className="font-body text-xs sm:text-sm text-main-text leading-relaxed font-normal" itemProp="text">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
