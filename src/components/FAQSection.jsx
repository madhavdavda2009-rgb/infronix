"use client";

const FAQS = [
  {
    "question": "What can InfronixWeb help our business with?",
    "answer": "We help businesses build their online presence through websites, grow through SEO, content and advertising, and automate repeated tasks such as lead capture and follow-ups."
  },
  {
    "question": "Can we start with just one service?",
    "answer": "Yes. We can scope a website, an SEO audit, a campaign or one automation workflow around your immediate priority."
  },
  {
    "question": "Do you work with businesses in Ahmedabad?",
    "answer": "InfronixWeb is based in Ahmedabad, Gujarat. Share your audience, service area and requirements so we can plan work around your business."
  },
  {
    "question": "How are costs and timelines decided?",
    "answer": "We review the deliverables, content, integrations and access required before preparing a proposal. Advertising spend and third-party software costs are identified separately."
  },
  {
    "question": "Do you guarantee rankings or advertising results?",
    "answer": "No. We agree useful measures and review progress, but competition, customer demand, budget and follow-up affect results."
  },
  {
    "question": "Can you connect our existing software?",
    "answer": "We check API availability, permissions, data quality and platform limits before confirming an automation scope. Important exceptions need a clear human handoff."
  }
];

export default function FAQSection() {
  return (
    <section id="faq" className="w-full py-14 sm:py-20 md:py-24 bg-surface relative z-20" aria-labelledby="faq-title">
      <div className="max-w-[900px] mx-auto px-4 sm:px-6 md:px-8">

        <div className="text-center mb-8 sm:mb-12 md:mb-14 border-b border-outline-variant pb-6">
          <span className="font-label-caps text-xs text-primary tracking-widest uppercase mb-2 block font-bold">
            Frequently Asked Questions
          </span>
          <h2 id="faq-title" className="font-headline-lg text-2xl sm:text-3xl md:text-4xl text-on-surface font-bold">
            Working with InfronixWeb
          </h2>
          <p className="font-body-md text-xs sm:text-sm md:text-base text-main-text max-w-xl mx-auto mt-2 leading-relaxed font-medium">
            Everything you need to know about partnering with InfronixWeb Digital Marketing for your website, marketing and automation needs.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:gap-4" itemScope itemType="https://schema.org/FAQPage">
          {FAQS.map((faq, index) => (
            <div
              key={index}
              className="border border-outline-variant p-4 sm:p-6 md:p-7 bg-surface-container-lowest hover:border-primary transition-all shadow-sm rounded-xl"
              itemScope
              itemProp="mainEntity"
              itemType="https://schema.org/Question"
            >
              <h3 className="font-headline-md text-sm sm:text-base md:text-lg text-on-surface mb-2 font-bold leading-snug" itemProp="name">
                {faq.question}
              </h3>
              <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                <p className="font-body-md text-xs sm:text-sm text-main-text leading-relaxed font-medium" itemProp="text">
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
