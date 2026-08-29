import ContactSection from '@/components/ContactSection';
import FAQSection from '@/components/FAQSection';
import PricingSection from '@/components/pricing/PricingSection';

export const metadata = {
  title: 'AI Automation Agency in Ahmedabad | Workflow Automation',
  description: 'Transform your business with intelligent AI automation, chatbots, lead management, and custom LLM workflows from Infronix Web Agency.',
  alternates: {
    canonical: 'https://www.infronixweb.in/ai-automation'
  }
};

export default function AIAutomationPage() {
  return (
    <>
      <main className="w-full pt-28 md:pt-32" id="main-content">
        <section className="relative w-full min-h-[560px] md:h-[700px] flex items-center bg-navy-muted overflow-hidden pt-20 pb-12" aria-label="AI Automation Services">
          <img
            src="/hero_bg.webp"
            alt="AI Workflow Automation and Dashboards"
            className="absolute inset-0 w-full h-full object-cover object-center opacity-30 mix-blend-luminosity"
            width="1920"
            height="700"
            fetchPriority="high"
            decoding="async"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-navy-muted via-navy-muted/95 to-navy-muted/60"></div>

          <div className="relative z-10 max-w-[1280px] w-full mx-auto px-margin-mobile md:px-margin-desktop flex flex-col gap-6">
            <div className="flex flex-col gap-4 max-w-3xl border-l-2 border-champagne-light pl-4 sm:pl-gutter py-2">
              <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-[60px] text-surface font-semibold leading-tight">
                AI Automation Agency
              </h1>
              <p className="font-body-md text-sm sm:text-base md:text-lg text-slate-200 font-medium max-w-xl leading-relaxed">
                Streamline operations, scale customer support, and optimize business workflows with custom Artificial Intelligence integrations.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-2 sm:pl-gutter w-full sm:w-auto">
              <a 
                href="/start-project" 
                className="bg-champagne-light text-navy-muted font-label-caps uppercase tracking-widest text-xs px-6 py-3.5 rounded-none hover:bg-white transition-all shadow-lg border border-champagne-light text-center font-bold"
              >
                Automate Your Workflow
              </a>
            </div>
          </div>
        </section>

        <section className="w-full py-16 md:py-24 bg-surface text-slate-900 border-b border-outline-variant/30">
          <div className="max-w-[1280px] mx-auto px-margin-mobile md:px-margin-desktop">
            <h2 className="font-headline-lg text-2xl sm:text-3xl md:text-4xl text-primary font-bold mb-8">Intelligent Business Automation</h2>
            <div className="prose max-w-4xl font-body-md text-slate-700 space-y-6">
              <p>
                In a rapidly evolving digital landscape, repetitive manual tasks are the biggest bottleneck to growth. As an expert <strong>AI Automation Agency</strong>, we build intelligent systems that work 24/7 to capture leads, process data, and assist customers automatically.
              </p>
              
              <h3 className="font-bold text-xl text-primary mt-8 mb-4">Our AI Automation Solutions</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>AI Assistants & Chatbots:</strong> Provide instantaneous, accurate customer support and lead qualification directly on your website.</li>
                <li><strong>Lead & Email Automation:</strong> Automatically capture inquiries, sync them to your CRM, and deploy personalized follow-up sequences without human intervention.</li>
                <li><strong>Workflow Integrations:</strong> Connect disjointed software tools via custom API integrations to ensure seamless data flow across your organization.</li>
                <li><strong>Custom LLM Integration:</strong> Utilize modern Large Language Models to summarize reports, draft content, and process natural language requests internally.</li>
              </ul>

              <h3 className="font-bold text-xl text-primary mt-8 mb-4">The Benefit for Your Business</h3>
              <p>
                By automating routine workflows, your team is freed up to focus on high-level strategy and relationship building. Our bespoke AI solutions reduce operational overhead while drastically improving response times and customer satisfaction.
              </p>
            </div>
          </div>
        </section>

        <PricingSection serviceKey="ai-automation" />
        <ContactSection />
        <FAQSection />
      </main>
    </>
  );
}
