import FAQSection from '@/components/FAQSection';
import CTASection from '@/components/CTASection';
import Breadcrumb from '@/components/Breadcrumb';
import Link from 'next/link';

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
      <main className="w-full pt-20 sm:pt-28 md:pt-32" id="main-content">
        {/* Hero — matches Home page light design */}
        <section className="relative w-full min-h-[480px] sm:min-h-[560px] md:min-h-[640px] flex items-center bg-surface-container-lowest overflow-hidden pt-16 sm:pt-20 pb-12 sm:pb-16" aria-label="AI Automation Services">
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 right-1/4 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-soft-violet rounded-full blur-[80px] sm:blur-[120px] opacity-30 mix-blend-multiply" />
            <div className="absolute bottom-1/3 left-1/3 w-[250px] sm:w-[400px] h-[250px] sm:h-[400px] bg-[#00F5D4]/20 rounded-full blur-[60px] sm:blur-[80px] opacity-40 mix-blend-multiply" />
          </div>

          <div className="relative z-10 max-w-[1280px] w-full mx-auto px-4 sm:px-6 md:px-12 flex flex-col gap-5 sm:gap-6">
            <Breadcrumb />
            <div className="flex flex-col gap-3 sm:gap-4 max-w-3xl">
              <span className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-primary">
                <span className="w-8 sm:w-12 h-[2px] bg-primary" /> AI Automation
              </span>
              <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-heading font-bold text-on-surface leading-tight tracking-tight">
                AI Automation Agency
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-main-text font-medium max-w-xl leading-relaxed">
                Streamline operations, scale customer support, and optimize business workflows with custom Artificial Intelligence integrations.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-2 w-full sm:w-auto">
              <Link
                href="/start-project"
                className="bg-primary text-white font-bold text-xs sm:text-sm px-6 py-3.5 sm:px-8 sm:py-4 rounded-md hover:bg-primary-dark transition-all hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_15px_rgba(139, 92, 246,0.3)] text-center w-full sm:w-auto"
              >
                Automate Your Workflow
              </Link>
            </div>
          </div>
        </section>

        <section className="w-full py-12 sm:py-16 md:py-24 bg-surface border-b border-outline-variant/30">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 md:px-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold text-on-surface mb-6 sm:mb-8">Intelligent Business Automation</h2>
            <div className="prose max-w-4xl text-main-text space-y-6">
              <p>
                In a rapidly evolving digital landscape, repetitive manual tasks are the biggest bottleneck to growth. As an expert <strong className="text-on-surface">AI Automation Agency</strong>, we build intelligent systems that work 24/7 to capture leads, process data, and assist customers automatically.
              </p>

              <h3 className="font-bold text-xl text-on-surface mt-8 mb-4">Our AI Automation Solutions</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong className="text-on-surface">AI Assistants & Chatbots:</strong> Provide instantaneous, accurate customer support and lead qualification directly on your website.</li>
                <li><strong className="text-on-surface">Lead & Email Automation:</strong> Automatically capture inquiries, sync them to your CRM, and deploy personalized follow-up sequences without human intervention.</li>
                <li><strong className="text-on-surface">Workflow Integrations:</strong> Connect disjointed software tools via custom API integrations to ensure seamless data flow across your organization.</li>
                <li><strong className="text-on-surface">Custom LLM Integration:</strong> Utilize modern Large Language Models to summarize reports, draft content, and process natural language requests internally.</li>
              </ul>

              <h3 className="font-bold text-xl text-on-surface mt-8 mb-4">The Benefit for Your Business</h3>
              <p>
                By automating routine workflows, your team is freed up to focus on high-level strategy and relationship building. Our bespoke AI solutions reduce operational overhead while drastically improving response times and customer satisfaction.
              </p>
            </div>
          </div>
        </section>

        <CTASection />
        <FAQSection />
      </main>
    </>
  );
}
