import FAQSection from '@/components/FAQSection';
import CTASection from '@/components/CTASection';
import Breadcrumb from '@/components/Breadcrumb';
import Link from 'next/link';
import { Robot, WhatsappLogo, UsersFour, Headset, EnvelopeSimple, ArrowsClockwise, Plugs, Database } from '@phosphor-icons/react/dist/ssr';

export const metadata = {
  title: 'AI Automation Agency in Ahmedabad | InfronixWeb',
  description: 'InfronixWeb helps businesses use AI automation to simplify repetitive tasks, improve customer communication, and streamline operations. AI chatbots, WhatsApp automation, lead management, and workflow integrations in Ahmedabad.',
  keywords: [
    'AI Automation Agency',
    'AI Automation Services',
    'AI Solutions for Businesses',
    'AI Chatbot Development',
    'WhatsApp Automation Services',
    'Business Process Automation',
    'Workflow Automation',
    'CRM Automation',
    'AI Integration Services',
    'Customer Support Automation',
    'Lead Automation',
    'AI Automation Agency in Ahmedabad',
    'AI Automation Company in Gujarat',
    'Digital Marketing Agency in Ahmedabad'
  ],
  alternates: {
    canonical: 'https://www.infronixweb.in/ai-automation'
  }
};

const services = [
  {
    icon: Robot,
    title: 'AI Chatbot Development',
    desc: 'AI-powered chatbots that help businesses answer customer questions and provide support.'
  },
  {
    icon: WhatsappLogo,
    title: 'WhatsApp Automation',
    desc: 'Streamline customer communication, notifications, and relevant business workflows.'
  },
  {
    icon: UsersFour,
    title: 'Lead Capture & Qualification',
    desc: 'Collect incoming leads, organize customer information, and support faster follow-ups.'
  },
  {
    icon: Headset,
    title: 'Customer Support Automation',
    desc: 'Automate common customer queries and improve the support experience.'
  },
  {
    icon: EnvelopeSimple,
    title: 'Email Automation',
    desc: 'Create workflows for notifications, follow-ups, and repetitive email tasks.'
  },
  {
    icon: ArrowsClockwise,
    title: 'CRM & Workflow Automation',
    desc: 'Connect business tools and simplify repetitive processes through automation.'
  },
  {
    icon: Plugs,
    title: 'AI Tool Integration',
    desc: 'Integrate AI capabilities with the tools your business already uses.'
  },
  {
    icon: Database,
    title: 'Data Processing Automation',
    desc: 'Reduce repetitive manual data work through structured automated workflows.'
  }
];

export default function AIAutomationPage() {
  return (
    <>
      <main className="w-full pt-20 sm:pt-28 md:pt-32" id="main-content">
        {/* Hero */}
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
                Work Smarter. Automate the Busywork.
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-main-text font-medium max-w-2xl leading-relaxed">
                InfronixWeb is a digital marketing agency based in Ahmedabad that helps businesses use AI automation to simplify repetitive tasks, improve customer communication, and streamline everyday operations.
              </p>
              <p className="text-sm sm:text-base text-text-light font-medium max-w-2xl leading-relaxed">
                From AI chatbots and WhatsApp automation to lead management and workflow integrations, we build practical solutions around your business needs.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-2 w-full sm:w-auto">
              <Link
                href="/start-project"
                className="bg-primary text-white font-bold text-xs sm:text-sm px-6 py-3.5 sm:px-8 sm:py-4 rounded-md hover:bg-primary-dark transition-all hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_15px_rgba(139,92,246,0.3)] text-center w-full sm:w-auto"
              >
                Get a Quote
              </Link>
            </div>
          </div>
        </section>

        {/* Our AI Automation Services — Services Grid */}
        <section className="w-full py-12 sm:py-16 md:py-24 bg-surface border-b border-outline-variant/30">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 md:px-12">
            <div className="mb-10 sm:mb-14 max-w-2xl">
              <span className="text-xs sm:text-sm font-bold tracking-widest uppercase text-primary mb-2 sm:mb-3 flex items-center gap-3">
                <span className="w-8 sm:w-12 h-[2px] bg-primary" /> What We Do
              </span>
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-heading font-bold text-on-surface leading-tight">
                Our AI Automation Services
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
              {services.map((service, idx) => {
                const IconComponent = service.icon;
                return (
                  <div
                    key={idx}
                    className="group bg-surface-container-lowest border border-outline-variant/60 hover:border-primary/50 rounded-2xl p-6 sm:p-8 transition-all duration-300 hover:shadow-xl flex flex-col gap-4"
                  >
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-surface border border-outline-variant flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                      <IconComponent size={24} weight="duotone" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-heading font-bold text-on-surface group-hover:text-primary transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-sm sm:text-base text-main-text leading-relaxed">
                      {service.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Why AI Automation Matters */}
        <section className="w-full py-12 sm:py-16 md:py-24 bg-surface-container-lowest border-b border-outline-variant/30">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 md:px-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold text-on-surface mb-6 sm:mb-8">
              Why AI Automation Matters
            </h2>
            <div className="prose max-w-4xl text-main-text space-y-6">
              <p>
                AI automation can help businesses reduce repetitive work, improve response times, and give their teams more time to focus on important tasks. Whether you are a growing startup or an established business in Ahmedabad and beyond, automation is the key to working smarter.
              </p>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="w-full py-12 sm:py-16 md:py-24 bg-surface border-b border-outline-variant/30">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 md:px-12 text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold text-on-surface mb-4 sm:mb-6">
              Ready to Automate Your Business?
            </h2>
            <p className="text-base sm:text-lg text-main-text font-medium max-w-2xl mx-auto mb-6 sm:mb-8 leading-relaxed">
              Let&apos;s explore how AI automation can simplify your workflow and help your business work smarter.
            </p>
            <Link
              href="/start-project"
              className="inline-block bg-primary text-white font-bold text-xs sm:text-sm px-8 py-4 rounded-md hover:bg-primary-dark transition-all hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_15px_rgba(139,92,246,0.3)]"
            >
              Get a Quote
            </Link>
          </div>
        </section>

        <CTASection />
        <FAQSection />
      </main>
    </>
  );
}
