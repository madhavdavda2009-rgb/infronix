"use client";

const FAQS = [
  {
    question: "Why choose Infronix for my business website?",
    answer: "Infronix creates custom, fast-loading, and modern websites designed to turn visitors into real customers. We focus on clean design, effortless customer navigation, and strong Google search visibility to help your business grow and stand out from competitors."
  },
  {
    question: "How long does it take to build and launch a website?",
    answer: "A focused sales landing page or standard business website usually takes 1 to 3 weeks. Larger online stores or advanced business websites take around 3 to 6 weeks. We keep you updated at every stage so you always know the exact progress."
  },
  {
    question: "How will you help more people find my business on Google?",
    answer: "We structure your website so Google easily understands your business, your services, and your location in Ahmedabad and across Gujarat. We optimize your page content, speed, and local business listings so customers searching for your products or services find you first."
  },
  {
    question: "What kind of websites and digital solutions can you create for my business?",
    answer: "We create everything from clean corporate websites and high-converting landing pages to online stores, customer inquiry systems, and automated customer support tools tailored specifically to your business goals."
  },
  {
    question: "Can you automate repetitive tasks and save my team time?",
    answer: "Yes. We build smart, easy-to-use automations like 24/7 instant chat assistants, automatic WhatsApp inquiry replies, and customer inquiry notifications that help you respond to leads instantly without manual effort."
  },
  {
    question: "Can you connect my website with the tools my business already uses?",
    answer: "Yes. We can seamlessly connect your website with your WhatsApp, email inbox, payment gateways, booking systems, or customer management software so all your business data stays organized in one place."
  },
  {
    question: "Will my website work properly on mobile phones, tablets, and computers?",
    answer: "Yes, 100%. Every website we create is thoroughly tested on iPhones, Android smartphones, tablets, laptops, and desktop computers to ensure fast loading, easy reading, and simple navigation on every screen size."
  },
  {
    question: "How much does a new website or marketing service cost?",
    answer: "We offer transparent, upfront pricing: high-impact landing pages starting from ₹8,000, complete business websites from ₹18,000 to ₹30,000, and ongoing Google visibility and marketing plans from ₹5,000/month. We also create custom packages tailored to your specific budget."
  },
  {
    question: "Do you help maintain and update my website after it goes live?",
    answer: "Yes. We provide continuous support, regular security updates, fast technical help, and content changes so your website stays secure, fast, and up-to-date while you focus on running your business."
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
            Web Development &amp; SEO FAQs
          </h2>
          <p className="font-body-md text-xs sm:text-sm md:text-base text-main-text max-w-xl mx-auto mt-2 leading-relaxed font-medium">
            Everything you need to know about partnering with Infronix Web Agency for your website, SEO, and AI automation needs.
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
