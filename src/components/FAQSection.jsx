"use client";

const FAQS = [
  {
    question: "Why is Infronix considered one of the best web agencies in Ahmedabad?",
    answer: "Infronix Web Agency combines state-of-the-art web engineering (Next.js, React, Node.js) with tailored UI/UX design and data-driven Technical SEO. Unlike typical template-based agencies, we build bespoke, lightning-fast digital products engineered to achieve 100/100 Core Web Vitals and convert visitors into qualified paying clients."
  },
  {
    question: "How long does custom website development take?",
    answer: "Our typical project turnaround ranges from 1 to 3 weeks for high-converting landing pages and business corporate websites, and 3 to 6 weeks for full-scale custom web applications, e-commerce platforms, or AI integrations. We provide clear milestone deliverables and transparent sprint updates throughout the build."
  },
  {
    question: "How does your SEO agency help Ahmedabad and Gujarat businesses rank on Google?",
    answer: "Our SEO strategy focuses on comprehensive on-page optimization, local Ahmedabad search intent mapping, server-side rendering (SSR), structured data (JSON-LD Schema), site speed acceleration, and Google Search Console optimization. This ensures your website ranks at the top when local customers search for your products and services."
  },
  {
    question: "What web development technologies and frameworks do you use?",
    answer: "We specialize in the modern web stack: Next.js (App Router), React, Tailwind CSS, Node.js, and PostgreSQL / Supabase, paired with GSAP for high-end micro-animations. This architecture guarantees unmatched loading speed, rock-solid security, and effortless scaling without plugin bloat."
  },
  {
    question: "What AI automation services do you provide for businesses?",
    answer: "We build custom AI chatbots, 24/7 automated customer support assistants, WhatsApp API lead generation systems, CRM data sync automations, and LLM-powered workflow tools that eliminate repetitive manual tasks and drastically lower operational overhead."
  },
  {
    question: "Will my website be mobile-friendly and responsive across all devices?",
    answer: "Yes, 100%. Every digital product we engineer follows a rigorous mobile-first design philosophy. We test across iPhones, Android smartphones, tablets, laptops, and ultra-wide desktop monitors to ensure responsive typography, seamless touch navigation, and fluid layouts."
  },
  {
    question: "What are your website development and SEO pricing packages?",
    answer: "We offer transparent, value-focused pricing: landing pages starting from ₹8,000, complete business corporate websites from ₹18,000 to ₹30,000, and comprehensive monthly SEO packages starting from ₹5,000/month. We also build custom tailored packages based on your exact enterprise requirements."
  },
  {
    question: "Do you provide post-launch website maintenance and technical support?",
    answer: "Yes. We offer dedicated maintenance, uptime monitoring, security patching, Core Web Vitals checks, and ongoing content updates to ensure your web application remains secure, up-to-date, and top-performing at all times."
  }
];

export default function FAQSection() {
  return (
    <section id="faq" className="w-full py-16 md:py-24 bg-surface relative z-20" aria-labelledby="faq-title">
      <div className="max-w-[900px] mx-auto px-margin-mobile md:px-margin-desktop">

        <div className="text-center mb-10 md:mb-14 border-b border-outline-variant pb-6">
          <span className="font-label-caps text-xs text-secondary tracking-widest uppercase mb-2 block font-bold">
            Frequently Asked Questions
          </span>
          <h2 id="faq-title" className="font-headline-lg text-2xl sm:text-3xl md:text-4xl text-primary font-bold">
            Web Development &amp; SEO FAQs
          </h2>
          <p className="font-body-md text-sm sm:text-base text-on-surface-variant max-w-xl mx-auto mt-2 leading-relaxed font-medium">
            Everything you need to know about partnering with Infronix Web Agency for your website, SEO, and AI automation needs.
          </p>
        </div>

        <div className="flex flex-col gap-4" itemScope itemType="https://schema.org/FAQPage">
          {FAQS.map((faq, index) => (
            <div
              key={index}
              className="border border-outline-variant p-6 sm:p-7 bg-surface-container-lowest hover:border-champagne-light transition-all shadow-sm"
              itemScope
              itemProp="mainEntity"
              itemType="https://schema.org/Question"
            >
              <h3 className="font-headline-md text-base sm:text-lg text-primary mb-2 font-bold leading-snug" itemProp="name">
                {faq.question}
              </h3>
              <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                <p className="font-body-md text-xs sm:text-sm text-on-surface-variant leading-relaxed font-medium" itemProp="text">
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
