import Breadcrumb from '@/components/Breadcrumb';
import Link from 'next/link';
import { 
  GoogleLogo, 
  MetaLogo, 
  YoutubeLogo, 
  CheckCircle, 
  ArrowRight, 
  Sparkle, 
  Target, 
  Users, 
  ChartLineUp, 
  ShieldCheck, 
  Lightning,
  Buildings,
  Storefront,
  RocketLaunch,
  Briefcase,
  User,
  ShoppingBag,
  Globe,
  MagnifyingGlass,
  Robot,
  Megaphone,
  ArrowsClockwise,
  PencilSimple,
  ChartBar
} from '@phosphor-icons/react/dist/ssr';

export const metadata = {
  title: 'Paid Advertising Agency in Ahmedabad | Google & Meta Ads | Infronix',
  description: 'Turn your ad budget into business opportunities. Expert Google Ads, Meta Ads (Facebook & Instagram), YouTube Ads, lead generation funnels, and remarketing.',
  alternates: {
    canonical: 'https://www.infronixweb.in/digital-marketing/paid-advertising'
  }
};

const whatWeDo = [
  {
    number: '01',
    title: 'Google Ads Management',
    subtitle: 'Get discovered when potential customers search for products and services like yours.',
    desc: 'Google Ads allows businesses to promote their offerings to people actively looking for relevant solutions. We help plan and manage campaigns with a focus on relevant targeting, clear messaging, and measurable outcomes.',
    items: [
      'Google Search Ads',
      'Google Display Ads',
      'Google Performance Max Campaigns',
      'Google Shopping Ads',
      'YouTube Advertising',
      'Keyword Research & Campaign Planning',
      'Ad Copy Creation',
      'Campaign Setup & Management',
      'Conversion Tracking',
      'Performance Monitoring'
    ],
    note: 'Campaign types depend on your business, advertising goals, and platform eligibility.'
  },
  {
    number: '02',
    title: 'Meta Ads Management',
    subtitle: 'Reach your audience across Instagram and Facebook with engaging, targeted advertising.',
    desc: 'Meta Ads help businesses introduce their products, services, and offers to relevant audiences through visual and engaging content. We help create and manage campaigns that support brand awareness, customer enquiries, and business growth.',
    items: [
      'Facebook Advertising',
      'Instagram Advertising',
      'Lead Generation Campaigns',
      'Product & Service Promotion',
      'Audience Research & Targeting',
      'Ad Creative Planning',
      'Ad Copy & Messaging',
      'Campaign Setup & Management',
      'Retargeting Campaigns',
      'Performance Monitoring'
    ]
  },
  {
    number: '03',
    title: 'Lead Generation Advertising',
    subtitle: 'Turn digital attention into meaningful customer enquiries.',
    desc: 'For businesses that depend on enquiries, bookings, consultations, or service requests, paid advertising can help connect your business with potential customers. We help create campaigns that direct users toward relevant actions and make it easier for interested customers to get in touch.',
    items: [
      'Lead Generation Campaigns',
      'Google Lead Generation Ads',
      'Meta Lead Forms',
      'Website Enquiry Campaigns',
      'WhatsApp Enquiry Campaigns',
      'Landing Page Recommendations',
      'Lead Capture Forms',
      'Conversion Tracking',
      'Campaign Performance Analysis'
    ],
    note: 'Lead quality depends on your offer, audience, targeting, landing page, and follow-up process.'
  },
  {
    number: '04',
    title: 'Retargeting & Remarketing',
    subtitle: 'Reconnect with people who have already interacted with your business.',
    desc: 'Not every visitor is ready to take action the first time they see your brand. Retargeting helps businesses reach eligible previous website visitors or people who have interacted with their content, where platform policies and tracking permissions allow. We help plan remarketing campaigns to support customer consideration and encourage relevant next steps.',
    items: [
      'Website Visitor Retargeting',
      'Social Media Engagement Retargeting',
      'Product Interest Campaigns',
      'Remarketing Audience Planning',
      'Follow-Up Ad Campaigns',
      'Campaign Performance Tracking'
    ]
  },
  {
    number: '05',
    title: 'Ad Creative & Copywriting',
    subtitle: 'Make every advertisement communicate your value clearly.',
    desc: 'A successful advertising campaign needs more than targeting. The visual, headline, message, and call to action all work together to communicate why someone should pay attention to your business. We help create advertising content that aligns with your brand and campaign objectives.',
    items: [
      'Static Ad Creatives',
      'Carousel Ad Designs',
      'Short-Form Video Ad Concepts',
      'Promotional Graphics',
      'Ad Headlines & Descriptions',
      'Call-to-Action Copy',
      'Product & Service Messaging',
      'Creative Testing Ideas'
    ]
  },
  {
    number: '06',
    title: 'Campaign Tracking & Optimization',
    subtitle: 'Understand how your campaigns are performing and where improvements may be needed.',
    desc: 'We help businesses monitor relevant advertising metrics and identify opportunities to improve campaign performance through continuous measurement and actionable optimization.',
    items: [
      'Campaign Performance Monitoring',
      'Conversion Tracking Setup',
      'Google Analytics Integration',
      'Meta Pixel Setup',
      'Google Tag Manager Support',
      'Ad Performance Analysis',
      'Budget & Audience Review',
      'Campaign Optimization',
      'Monthly Performance Reporting'
    ]
  }
];

const platforms = [
  {
    name: 'Google Ads',
    desc: 'Reach potential customers who are actively searching for products and services relevant to your business.',
    icon: GoogleLogo,
    bestSuited: [
      'Service-based businesses',
      'Local businesses',
      'Customer enquiries',
      'Product searches',
      'Search-driven demand'
    ]
  },
  {
    name: 'Meta Ads',
    desc: 'Promote your products and services through engaging advertising on Facebook and Instagram.',
    icon: MetaLogo,
    bestSuited: [
      'Brand awareness',
      'Product promotion',
      'Audience discovery',
      'Lead generation',
      'Visual campaigns'
    ]
  },
  {
    name: 'YouTube Ads',
    desc: 'Use video advertising to introduce your brand, explain your offering, and reach relevant audiences.',
    icon: YoutubeLogo,
    bestSuited: [
      'Brand storytelling',
      'Product demonstrations',
      'Awareness campaigns',
      'Video-based promotion'
    ]
  }
];

const approachSteps = [
  {
    step: '01',
    title: 'Discover',
    desc: 'We understand your business, target audience, products, services, and advertising objectives.'
  },
  {
    step: '02',
    title: 'Strategize',
    desc: 'We develop a campaign direction based on your audience, selected platforms, budget, and desired outcomes.'
  },
  {
    step: '03',
    title: 'Create',
    desc: 'We prepare advertising creatives, messaging, and campaign assets that communicate your brand effectively.'
  },
  {
    step: '04',
    title: 'Launch',
    desc: 'We set up and launch the selected advertising campaigns with appropriate targeting and tracking.'
  },
  {
    step: '05',
    title: 'Optimize',
    desc: 'We review campaign performance and identify opportunities to improve targeting, messaging, and budget allocation.'
  },
  {
    step: '06',
    title: 'Report',
    desc: 'We provide clear performance insights and recommendations for future campaigns.'
  }
];

const whyChooseUs = [
  {
    title: 'Strategy Before Spending',
    desc: 'We help businesses understand where their advertising budget may be best utilized before launching campaigns.'
  },
  {
    title: 'Relevant Audience Targeting',
    desc: 'We plan campaigns around your business goals and the people you want to reach.'
  },
  {
    title: 'Creative That Communicates',
    desc: 'We create advertising content designed to communicate your products, services, and value clearly.'
  },
  {
    title: 'Transparent Performance Tracking',
    desc: 'We help you understand important campaign metrics and identify opportunities for improvement.'
  },
  {
    title: 'Connected Digital Solutions',
    desc: 'With Website Development, SEO Optimization, Social Media Marketing, and AI Automation, Infronix can support different parts of your digital marketing journey.'
  }
];

const achievements = [
  'Reach relevant potential customers',
  'Increase brand visibility',
  'Promote products and services',
  'Generate customer enquiries',
  'Drive relevant website traffic',
  'Support product launches',
  'Test marketing offers',
  'Measure campaign performance',
  'Identify opportunities for improvement'
];

const whoWeHelp = [
  { title: 'Small & Local Businesses', icon: Storefront },
  { title: 'Startups & New Brands', icon: RocketLaunch },
  { title: 'Service-Based Businesses', icon: Briefcase },
  { title: 'Product-Based Businesses', icon: ShoppingBag },
  { title: 'E-commerce Businesses', icon: Lightning },
  { title: 'Professional Service Providers', icon: ShieldCheck },
  { title: 'Growing Companies', icon: Buildings },
  { title: 'Businesses Launching New Products', icon: Sparkle }
];

const ecosystemServices = [
  {
    title: 'Website Development',
    desc: 'Create a professional website or landing page that communicates your offering and supports customer enquiries.',
    icon: Globe,
    link: '/web-development'
  },
  {
    title: 'SEO Optimization',
    desc: 'Build long-term organic visibility alongside your paid advertising efforts.',
    icon: MagnifyingGlass,
    link: '/seo'
  },
  {
    title: 'Social Media Marketing',
    desc: 'Maintain a consistent brand presence and create content that supports your advertising campaigns.',
    icon: Megaphone,
    link: '/digital-marketing/social-media-marketing'
  },
  {
    title: 'AI Automation',
    desc: 'Connect lead capture and follow-up workflows to help manage enquiries more efficiently.',
    icon: Robot,
    link: '/ai-automation'
  }
];

const faqs = [
  {
    question: 'What is Paid Advertising?',
    answer: 'Paid advertising is a digital marketing method where businesses pay platforms such as Google or Meta to display advertisements to selected audiences.'
  },
  {
    question: 'Do you manage Google Ads and Meta Ads?',
    answer: 'Yes. We offer Google Ads and Meta Ads campaign management based on your business requirements and advertising objectives.'
  },
  {
    question: 'Do you provide advertising creatives?',
    answer: 'Yes. We can help with static ad creatives, carousel designs, video ad concepts, and advertising copy. The exact scope depends on your project.'
  },
  {
    question: 'Do I need to provide a website?',
    answer: 'Not always. Some campaigns can use platform lead forms, while others benefit from a website or dedicated landing page. We can recommend an approach based on your campaign goals.'
  },
  {
    question: 'Is the advertising budget included in your service?',
    answer: 'Advertising spend paid to Google, Meta, or other platforms is separate from Infronix\'s service charges. Your advertising budget and management scope will be discussed before the campaign begins.'
  },
  {
    question: 'Can you guarantee leads or sales?',
    answer: 'No. We do not guarantee a specific number of leads, sales, or return on ad spend. Campaign performance depends on several factors, including the offer, audience, competition, budget, and execution.'
  },
  {
    question: 'Can you track where our enquiries come from?',
    answer: 'We can help set up relevant conversion tracking and reporting so businesses can better understand campaign performance, subject to platform capabilities and tracking permissions.'
  },
  {
    question: 'Can you manage our ads along with our website and SEO?',
    answer: 'Yes. Infronix offers Website Development, SEO Optimization, Social Media Marketing, and AI Automation to support your wider digital marketing requirements.'
  }
];

export default function PaidAdvertisingPage() {
  return (
    <>
      <main className="w-full pt-20 sm:pt-28 md:pt-32 bg-surface" id="main-content">
        
        {/* ═══ 1. HERO SECTION ═══ */}
        <section className="relative w-full min-h-[480px] sm:min-h-[580px] md:min-h-[660px] flex items-center bg-surface-container-lowest overflow-hidden pt-16 sm:pt-20 pb-12 sm:pb-16 border-b border-outline-variant/30" aria-label="Paid Advertising Hero">
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 right-1/4 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-soft-violet rounded-full blur-[80px] sm:blur-[120px] opacity-30 mix-blend-multiply" />
            <div className="absolute bottom-1/3 left-1/3 w-[250px] sm:w-[400px] h-[250px] sm:h-[400px] bg-[#00F5D4]/20 rounded-full blur-[60px] sm:blur-[80px] opacity-40 mix-blend-multiply" />
          </div>

          <div className="relative z-10 max-w-[1280px] w-full mx-auto px-4 sm:px-6 md:px-12 flex flex-col gap-5 sm:gap-6">
            <Breadcrumb />

            <div className="flex flex-col gap-3 sm:gap-5 max-w-3xl">
              <span className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-primary">
                <span className="w-8 sm:w-12 h-[2px] bg-primary" /> Paid Advertising
              </span>
              <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-heading font-bold text-on-surface leading-tight tracking-tight">
                Turn Your Ad Budget Into Business Opportunities.
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-main-text font-medium leading-relaxed">
                Reach the right audience, promote your business, and create meaningful opportunities with strategic paid advertising.
              </p>
              <p className="text-sm sm:text-base md:text-lg text-text-light font-medium leading-relaxed">
                At Infronix, we help businesses plan, launch, and manage digital advertising campaigns across Google and Meta. From increasing brand visibility to generating customer enquiries, we build campaigns designed around your business goals.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-2 sm:mt-4 w-full sm:w-auto">
              <Link
                href="/start-project"
                className="bg-primary text-white font-bold text-xs sm:text-sm px-6 py-3.5 sm:px-8 sm:py-4 rounded-md hover:bg-primary-dark transition-all hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_20px_rgba(139, 92, 246,0.3)] text-center flex items-center justify-center gap-2 w-full sm:w-auto"
              >
                Get a Quote <ArrowRight size={16} weight="bold" />
              </Link>
              <Link
                href="/digital-marketing"
                className="bg-surface text-on-surface border border-outline-variant hover:border-primary font-bold text-xs sm:text-sm px-6 py-3.5 sm:px-8 sm:py-4 rounded-md transition-all text-center w-full sm:w-auto"
              >
                Explore Our Services
              </Link>
            </div>
          </div>
        </section>

        {/* ═══ 2. INTRODUCTION SECTION ═══ */}
        <section className="w-full py-12 sm:py-16 md:py-24 bg-surface border-b border-outline-variant/30">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 md:px-12">
            <div className="max-w-3xl">
              <span className="text-xs font-bold tracking-widest uppercase text-primary mb-2 sm:mb-3 block">
                Targeted Performance
              </span>
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-heading font-bold text-on-surface mb-6 sm:mb-8 leading-tight">
                Advertising That Reaches the Right People.
              </h2>
              <div className="space-y-5 text-base md:text-lg text-main-text leading-relaxed">
                <p>
                  Your business deserves more than random clicks and impressions.
                </p>
                <p>
                  Paid advertising helps your business reach potential customers when they are searching for a solution or discovering new products and services. With the right strategy, creative messaging, and campaign management, digital ads can become a valuable part of your marketing efforts.
                </p>
                <p>
                  At Infronix, we combine audience research, campaign planning, creative content, and performance tracking to help businesses make better use of their advertising budget.
                </p>
                <p>
                  Whether you are launching a new product, promoting a service, or looking to increase customer enquiries, we help you build a paid advertising strategy that fits your business.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ 3. WHAT WE DO SECTION ═══ */}
        <section className="w-full py-20 md:py-28 bg-surface-container-lowest border-b border-outline-variant/30">
          <div className="max-w-[1280px] mx-auto px-6 md:px-12">
            <div className="mb-16 max-w-3xl">
              <span className="text-xs font-bold tracking-widest uppercase text-primary mb-3 block">
                Full-Funnel Capabilities
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-on-surface mb-4 leading-tight">
                Digital Advertising Built Around Your Business Goals.
              </h2>
              <p className="text-lg text-main-text">
                We offer paid advertising solutions designed to help businesses reach their audience, generate enquiries, and support growth across digital platforms.
              </p>
            </div>

            <div className="flex flex-col gap-12">
              {whatWeDo.map((service) => (
                <div
                  key={service.number}
                  className="bg-surface border border-outline-variant/60 rounded-2xl p-8 md:p-12 hover:border-primary/50 transition-all hover:shadow-xl"
                >
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-8 mb-8 pb-8 border-b border-outline-variant/40">
                    <div className="max-w-2xl">
                      <div className="flex items-center gap-4 mb-4">
                        <span className="text-3xl md:text-4xl font-heading font-bold text-primary">
                          {service.number}
                        </span>
                        <span className="w-10 h-[1px] bg-outline-variant" />
                        <h3 className="text-2xl md:text-3xl font-heading font-bold text-on-surface">
                          {service.title}
                        </h3>
                      </div>
                      <h4 className="text-lg font-semibold text-on-surface mb-3">
                        {service.subtitle}
                      </h4>
                      <p className="text-main-text leading-relaxed">
                        {service.desc}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h5 className="text-xs font-bold uppercase tracking-widest text-primary mb-4">
                      Our services include:
                    </h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {service.items.map((item, i) => (
                        <div key={i} className="flex items-start gap-2.5 bg-surface-container-lowest p-3.5 rounded-lg border border-outline-variant/30 text-sm font-medium text-on-surface">
                          <CheckCircle size={18} className="text-primary shrink-0 mt-0.5" weight="fill" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>

                    {service.note && (
                      <p className="mt-6 text-xs text-text-light italic">
                        *{service.note}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ 4. ADVERTISING PLATFORMS ═══ */}
        <section className="w-full py-16 md:py-24 bg-surface border-b border-outline-variant/30">
          <div className="max-w-[1280px] mx-auto px-6 md:px-12">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-xs font-bold tracking-widest uppercase text-primary mb-3 block">
                Platform Expertise
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-on-surface mb-4">
                Reach Your Audience Across the Right Channels.
              </h2>
              <p className="text-main-text text-base md:text-lg">
                We help businesses choose advertising platforms based on their goals, audience, and business model.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {platforms.map((platform) => {
                const IconComponent = platform.icon;
                return (
                  <div
                    key={platform.name}
                    className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-8 flex flex-col justify-between hover:border-primary/50 transition-all hover:shadow-xl group"
                  >
                    <div>
                      <div className="w-16 h-16 rounded-2xl bg-surface border border-outline-variant flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <IconComponent size={36} weight="fill" className="text-primary" />
                      </div>
                      <h3 className="text-2xl font-heading font-bold text-on-surface mb-3">
                        {platform.name}
                      </h3>
                      <p className="text-main-text text-sm leading-relaxed mb-6">
                        {platform.desc}
                      </p>
                    </div>

                    <div className="pt-6 border-t border-outline-variant/40">
                      <span className="text-xs font-bold uppercase tracking-wider text-primary block mb-3">
                        Best suited for:
                      </span>
                      <ul className="space-y-2">
                        {platform.bestSuited.map((point, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-xs font-medium text-on-surface">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                );
              })}
            </div>

            <p className="text-center text-xs text-text-light italic mt-8">
              *The advertising channels we recommend depend on your business requirements and campaign objectives.
            </p>
          </div>
        </section>

        {/* ═══ 5. OUR APPROACH ═══ */}
        <section className="w-full py-20 md:py-28 bg-surface-container-lowest border-b border-outline-variant/30">
          <div className="max-w-[1280px] mx-auto px-6 md:px-12">
            <div className="max-w-3xl mb-16">
              <span className="text-xs font-bold tracking-widest uppercase text-primary mb-3 block">
                Structured Execution
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-on-surface mb-4">
                A Smarter Way to Manage Paid Advertising.
              </h2>
              <p className="text-main-text text-lg leading-relaxed">
                We believe paid advertising should be planned carefully, monitored consistently, and evaluated against meaningful business goals.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {approachSteps.map((step) => (
                <div
                  key={step.step}
                  className="bg-surface border border-outline-variant/60 rounded-xl p-6 flex flex-col justify-between hover:border-primary/50 transition-all"
                >
                  <div>
                    <span className="text-2xl font-heading font-bold text-primary block mb-3">
                      {step.step}
                    </span>
                    <h3 className="text-xl font-heading font-bold text-on-surface mb-2">
                      {step.title}
                    </h3>
                  </div>
                  <p className="text-sm text-main-text leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ 6. WHY INFRONIX? ═══ */}
        <section className="w-full py-20 md:py-28 bg-surface border-b border-outline-variant/30">
          <div className="max-w-[1280px] mx-auto px-6 md:px-12">
            <div className="max-w-3xl mb-16">
              <span className="text-xs font-bold tracking-widest uppercase text-primary mb-3 block">
                The Infronix Advantage
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-on-surface mb-4">
                Advertising With a Business-First Mindset.
              </h2>
              <p className="text-main-text text-lg">
                We focus on helping businesses make informed marketing decisions through creative execution, strategic planning, and measurable performance.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {whyChooseUs.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-surface-container-lowest border border-outline-variant/60 rounded-xl p-8 hover:border-primary/50 transition-all hover:shadow-lg"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-6">
                    <Sparkle size={24} weight="duotone" />
                  </div>
                  <h3 className="text-xl font-heading font-bold text-on-surface mb-3">
                    {item.title}
                  </h3>
                  <p className="text-main-text text-sm leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ 7. WHAT YOU CAN ACHIEVE ═══ */}
        <section className="w-full py-20 md:py-28 bg-surface-container-lowest border-b border-outline-variant/30">
          <div className="max-w-[1280px] mx-auto px-6 md:px-12">
            <div className="max-w-3xl mb-16">
              <span className="text-xs font-bold tracking-widest uppercase text-primary mb-3 block">
                Business Outcomes
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-on-surface mb-4">
                Make Your Advertising More Purposeful.
              </h2>
              <p className="text-main-text text-lg">
                A well-planned paid advertising strategy can help your business:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl">
              {achievements.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 bg-surface border border-outline-variant/50 p-5 rounded-xl text-sm font-medium text-on-surface hover:border-primary/50 transition-all"
                >
                  <CheckCircle size={20} className="text-primary shrink-0" weight="fill" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <p className="text-xs text-text-light italic mt-8 max-w-3xl">
              *Advertising results vary depending on your industry, offer, audience, campaign setup, competition, budget, and other factors. We do not guarantee specific sales, leads, ROAS, or campaign results.
            </p>
          </div>
        </section>

        {/* ═══ 8. WHO WE HELP ═══ */}
        <section className="w-full py-16 md:py-24 bg-surface border-b border-outline-variant/30">
          <div className="max-w-[1280px] mx-auto px-6 md:px-12">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-xs font-bold tracking-widest uppercase text-primary mb-3 block">
                Target Industries
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-on-surface mb-4">
                Paid Advertising Solutions for Growing Businesses.
              </h2>
              <p className="text-main-text text-base md:text-lg">
                Our paid advertising services are designed for businesses looking to reach new audiences and support their marketing goals.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {whoWeHelp.map((item, idx) => {
                const IconComponent = item.icon;
                return (
                  <div
                    key={idx}
                    className="bg-surface-container-lowest border border-outline-variant/50 rounded-xl p-6 flex flex-col items-center text-center gap-3 hover:border-primary transition-all hover:shadow-md"
                  >
                    <IconComponent size={28} className="text-primary" weight="duotone" />
                    <span className="font-heading font-bold text-sm text-on-surface">
                      {item.title}
                    </span>
                  </div>
                );
              })}
            </div>

            <p className="text-center text-sm text-main-text mt-12 max-w-2xl mx-auto">
              Whether you are advertising for the first time or looking to improve your existing campaigns, we help you explore a strategy that fits your business.
            </p>
          </div>
        </section>

        {/* ═══ 9. ECOSYSTEM INTEGRATION ═══ */}
        <section className="w-full py-20 md:py-28 bg-surface-container-lowest border-b border-outline-variant/30">
          <div className="max-w-[1280px] mx-auto px-6 md:px-12">
            <div className="max-w-3xl mb-16">
              <span className="text-xs font-bold tracking-widest uppercase text-primary mb-3 block">
                Connected Growth
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-on-surface mb-4">
                Our Advertising Services Work With Your Digital Presence
              </h2>
              <p className="text-main-text text-lg">
                Paid advertising works best when your entire digital presence supports the customer journey.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {ecosystemServices.map((item) => {
                const IconComponent = item.icon;
                return (
                  <Link
                    key={item.title}
                    href={item.link}
                    className="bg-surface border border-outline-variant/60 rounded-xl p-6 flex flex-col justify-between hover:border-primary hover:shadow-lg transition-all group"
                  >
                    <div>
                      <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-5 group-hover:scale-110 transition-transform">
                        <IconComponent size={24} weight="duotone" />
                      </div>
                      <h3 className="text-xl font-heading font-bold text-on-surface mb-2 group-hover:text-primary transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-sm text-main-text leading-relaxed mb-6">
                        {item.desc}
                      </p>
                    </div>

                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-primary group-hover:translate-x-1 transition-transform">
                      Learn More <ArrowRight size={14} weight="bold" />
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* ═══ 10. FREQUENTLY ASKED QUESTIONS ═══ */}
        <section className="w-full py-20 md:py-28 bg-surface border-b border-outline-variant/30" itemScope itemType="https://schema.org/FAQPage">
          <div className="max-w-[900px] mx-auto px-6 md:px-12">
            <div className="text-center mb-14">
              <span className="text-xs font-bold tracking-widest uppercase text-primary mb-3 block">
                Got Questions?
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-on-surface mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-main-text text-base">
                Everything you need to know about our Google Ads and Meta Ads management services.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="border border-outline-variant p-6 sm:p-7 bg-surface-container-lowest rounded-xl hover:border-primary/50 transition-all shadow-sm"
                  itemScope
                  itemProp="mainEntity"
                  itemType="https://schema.org/Question"
                >
                  <h3 className="font-heading text-lg text-on-surface mb-2.5 font-bold leading-snug" itemProp="name">
                    {faq.question}
                  </h3>
                  <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                    <p className="text-sm text-main-text leading-relaxed" itemProp="text">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ 11. FINAL CTA ═══ */}
        <section className="w-full py-20 md:py-28 bg-ink-black text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[140px] pointer-events-none" />
          <div className="max-w-[1280px] mx-auto px-6 md:px-12 relative z-10 text-center flex flex-col items-center">
            <span className="text-xs font-bold tracking-widest uppercase text-primary mb-4 block">
              Maximize Your Ad ROI
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-white mb-6 max-w-3xl leading-tight">
              Ready to Reach the Right Audience?
            </h2>
            <p className="text-lg md:text-xl text-[#A0AEC0] max-w-2xl mb-10 leading-relaxed">
              Let&apos;s create a paid advertising strategy that helps your business get noticed, connect with potential customers, and move toward its marketing goals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Link
                href="/start-project"
                className="bg-primary text-white font-bold text-base px-9 py-4 rounded-lg hover:bg-primary-dark transition-all hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_25px_rgba(139, 92, 246,0.35)] text-center flex items-center justify-center gap-2"
              >
                Get a Quote <ArrowRight size={18} weight="bold" />
              </Link>
              <Link
                href="/digital-marketing"
                className="bg-transparent text-white border border-[#2D3748] hover:border-primary font-bold text-base px-9 py-4 rounded-lg transition-all text-center"
              >
                Explore Digital Marketing
              </Link>
            </div>
          </div>
        </section>

      </main>
    </>
  );
}
