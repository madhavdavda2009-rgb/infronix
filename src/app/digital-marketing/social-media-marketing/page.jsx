import ServiceDetails from '@/components/ServiceDetails';
import { getService } from '@/lib/services';
import { pageMetadata } from '@/lib/site-seo';
import Breadcrumb from '@/components/Breadcrumb';
import Link from 'next/link';
import { InstagramLogo, FacebookLogo, LinkedinLogo, CheckCircle, ArrowRight, Sparkle, ShieldCheck, Lightning, Buildings, Storefront, RocketLaunch, Briefcase, User, ShoppingBag } from '@phosphor-icons/react/dist/ssr';

const service = getService('digital-marketing/social-media-marketing');
export const metadata = pageMetadata(service.title, service.description, '/digital-marketing/social-media-marketing');

const whatWeDo = [
  {
    number: '01',
    title: 'Social Media Management',
    subtitle: 'Keep your social media active, consistent, and professionally managed.',
    desc: 'We handle the day-to-day management of your social platforms, ensuring your brand maintains a strong and recognizable online presence.',
    items: [
      'Instagram, Facebook & LinkedIn Management',
      'Social Media Profile Optimization',
      'Content Planning & Scheduling',
      'Post Publishing & Management',
      'Captions, Hashtags & Content Organization',
      'Basic Community Engagement',
      'Monthly Performance Reporting'
    ]
  },
  {
    number: '02',
    title: 'Social Media Content Creation',
    subtitle: 'Make your brand stand out with creative content that captures attention.',
    desc: 'From promotional graphics to educational carousels, we create content that communicates your brand message and keeps your audience engaged.',
    items: [
      'Social Media Posts',
      'Carousel Designs',
      'Promotional Creatives',
      'Product Showcase Content',
      'Brand Awareness Content',
      'Educational & Informative Posts',
      'Seasonal & Campaign Creatives'
    ]
  },
  {
    number: '03',
    title: 'Reels & Short-Form Videos',
    subtitle: 'Turn ideas into engaging short-form content.',
    desc: 'Short-form videos help businesses communicate their products, services, and stories in a format that is easy to consume and share.',
    items: [
      'Instagram Reels',
      'Short-Form Video Editing',
      'Product Showcase Videos',
      'Promotional Videos',
      'Educational Short Videos',
      'Video Captions & Text Overlays',
      'Social Media Video Formatting'
    ],
    note: 'Video footage and brand assets can be provided by the client, or content creation can be discussed based on project requirements.'
  },
  {
    number: '04',
    title: 'Content Strategy & Planning',
    subtitle: 'Every successful social media presence starts with a clear plan.',
    desc: 'We help businesses organize their content around their audience, brand identity, and marketing objectives.',
    items: [
      'Monthly Content Calendars',
      'Content Theme Planning',
      'Audience & Competitor Research',
      'Brand Voice & Messaging',
      'Content Ideas & Creative Direction',
      'Campaign Planning',
      'Platform-Specific Content Planning'
    ]
  },
  {
    number: '05',
    title: 'Brand Awareness & Engagement',
    subtitle: 'Build recognition and meaningful connections with your audience.',
    desc: 'We create and manage content that helps your business communicate its value, showcase its personality, and stay connected with potential customers.',
    items: [
      'Brand Awareness Campaigns',
      'Audience Engagement Content',
      'Product & Service Highlights',
      'Community-Focused Content',
      'Promotional Campaigns',
      'Consistent Brand Communication'
    ]
  }
];

const platforms = [
  {
    name: 'Instagram',
    desc: 'Build a visually engaging brand presence with creative posts, reels, and engaging content.',
    icon: InstagramLogo,
    gradient: 'from-[#833AB4] via-[#FD1D1D] to-[#FCB045]'
  },
  {
    name: 'Facebook',
    desc: 'Connect with your audience through business updates, promotional content, and community engagement.',
    icon: FacebookLogo,
    gradient: 'from-[#1877F2] to-[#0D65D9]'
  },
  {
    name: 'LinkedIn',
    desc: 'Build professional credibility and communicate your business expertise through valuable content.',
    icon: LinkedinLogo,
    gradient: 'from-[#0A66C2] to-[#004182]'
  }
];

const approachSteps = [
  {
    step: '01',
    title: 'Understand',
    desc: 'We learn about your business, audience, competitors, and goals.'
  },
  {
    step: '02',
    title: 'Plan',
    desc: 'We create a content direction and publishing plan aligned with your brand.'
  },
  {
    step: '03',
    title: 'Create',
    desc: 'We develop engaging visuals, videos, captions, and campaign content.'
  },
  {
    step: '04',
    title: 'Publish',
    desc: 'We manage your content across the selected social media platforms.'
  },
  {
    step: '05',
    title: 'Improve',
    desc: 'We review performance and identify opportunities to improve your social media presence.'
  }
];

const whyChooseUs = [
  {
    title: 'Creative That Represents Your Brand',
    desc: 'We create content that reflects your brand identity instead of relying on generic templates.'
  },
  {
    title: 'Strategy Before Execution',
    desc: 'Every business is different. We plan content around your audience and business objectives.'
  },
  {
    title: 'Consistent Digital Presence',
    desc: 'Stay active and professional across your social media platforms with organized content and regular management.'
  },
  {
    title: 'Business-Focused Marketing',
    desc: 'Our goal is to help your business communicate its value, build trust, and create opportunities through digital channels.'
  },
  {
    title: 'One Agency. Multiple Solutions.',
    desc: 'From websites and SEO to social media marketing and AI automation, InfronixWeb brings your digital needs together.'
  }
];

const whoWeHelp = [
  { title: 'Small & Local Businesses', icon: Storefront },
  { title: 'Startups & New Brands', icon: RocketLaunch },
  { title: 'Product-Based Businesses', icon: ShoppingBag },
  { title: 'Service-Based Businesses', icon: Briefcase },
  { title: 'Personal Brands', icon: User },
  { title: 'Growing Companies', icon: Buildings },
  { title: 'E-commerce Businesses', icon: Lightning },
  { title: 'Professional Service Providers', icon: ShieldCheck }
];

const expectations = [
  'Build stronger brand recognition',
  'Maintain a professional online presence',
  'Communicate products and services clearly',
  'Connect with your target audience',
  'Share valuable and engaging content',
  'Support marketing campaigns',
  'Create opportunities for customer enquiries'
];

const faqs = [
  {
    question: 'Do you manage Instagram and Facebook accounts?',
    answer: 'Yes. We offer social media management for Instagram, Facebook, and LinkedIn based on your business requirements.'
  },
  {
    question: 'Do you create social media posts and reels?',
    answer: 'Yes. We provide creative post designs, carousels, and short-form video editing. The exact content scope depends on the project.'
  },
  {
    question: 'Do I need to provide photos and videos?',
    answer: 'You can provide your own brand photos, product images, and video footage. We can also discuss creative content production based on your requirements.'
  },
  {
    question: 'Can you manage our social media accounts?',
    answer: 'Yes. We can help with content planning, publishing, and basic social media management.'
  },
  {
    question: 'Do you guarantee followers or viral reels?',
    answer: 'No. We do not guarantee viral content or a specific number of followers. Our focus is on quality content, strategic planning, and consistent execution.'
  },
  {
    question: 'Can you manage social media along with our website?',
    answer: 'Yes. InfronixWeb also offers Website Development, SEO Optimization, and AI Automation, allowing us to support multiple parts of your digital presence.'
  }
];

export default function SocialMediaMarketingPage() {
  return (
    <>
      <main className="w-full pt-20 sm:pt-28 md:pt-32 bg-surface" id="main-content">
        
        {/* ═══ 1. HERO SECTION ═══ */}
        <section className="relative w-full min-h-[480px] sm:min-h-[580px] md:min-h-[660px] flex items-center bg-surface-container-lowest overflow-hidden pt-16 sm:pt-20 pb-12 sm:pb-16 border-b border-outline-variant/30" aria-label="Social Media Marketing Hero">
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 right-1/4 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-soft-violet rounded-full blur-[80px] sm:blur-[120px] opacity-30 mix-blend-multiply" />
            <div className="absolute bottom-1/3 left-1/3 w-[250px] sm:w-[400px] h-[250px] sm:h-[400px] bg-[#00F5D4]/20 rounded-full blur-[60px] sm:blur-[80px] opacity-40 mix-blend-multiply" />
          </div>

          <div className="relative z-10 max-w-[1280px] w-full mx-auto px-4 sm:px-6 md:px-12 flex flex-col gap-5 sm:gap-6">
            <Breadcrumb />

            <div className="flex flex-col gap-3 sm:gap-5 max-w-3xl">
              <span className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-primary">
                <span className="w-8 sm:w-12 h-[2px] bg-primary" /> Social Media Marketing
              </span>
              <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-heading font-bold text-on-surface leading-tight tracking-tight">
                Build Your Brand. <br className="hidden sm:block" />
                Grow Your Audience.
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-main-text font-medium leading-relaxed">
                Your brand deserves more than just a social media presence. At InfronixWeb, based in Ahmedabad, we help businesses build meaningful connections, create engaging content, and grow their digital presence through strategic social media marketing.
              </p>
              <p className="text-sm sm:text-base md:text-lg text-text-light font-medium leading-relaxed">
                From creative content to consistent management, we bring your brand closer to the people who matter most.
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
                Overview &amp; Philosophy
              </span>
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-heading font-bold text-on-surface mb-6 sm:mb-8 leading-tight">
                Your Brand, Everywhere Your Audience Is.
              </h2>
              <div className="space-y-5 text-base md:text-lg text-main-text leading-relaxed">
                <p>
                  Social media is more than posting content. It is where people discover businesses, explore products, build trust, and make decisions.
                </p>
                <p>
                  We help businesses turn their social media platforms into a powerful part of their digital growth strategy. Whether you are launching a new brand, growing an existing business, or looking to improve your online presence, our social media marketing solutions are designed around your goals.
                </p>
                <p>
                  We combine creative storytelling, strategic planning, and consistent execution to help your business communicate better and stay connected with its audience.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ 3. WHAT WE DO SECTION ═══ */}
        <section className="w-full py-12 sm:py-20 md:py-28 bg-surface-container-lowest border-b border-outline-variant/30">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 md:px-12">
            <div className="mb-10 sm:mb-16 max-w-3xl">
              <span className="text-xs font-bold tracking-widest uppercase text-primary mb-2 sm:mb-3 block">
                Our Capabilities
              </span>
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-heading font-bold text-on-surface mb-3 sm:mb-4 leading-tight">
                Everything Your Brand Needs to Grow on Social Media.
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-main-text">
                We provide end-to-end social media marketing services designed to build your brand, engage your audience, and support your business goals.
              </p>
            </div>

            <div className="flex flex-col gap-8 sm:gap-12">
              {whatWeDo.map((service, index) => (
                <div
                  key={service.number}
                  className="bg-surface border border-outline-variant/60 rounded-2xl p-5 sm:p-8 md:p-12 hover:border-primary/50 transition-all hover:shadow-xl"
                >
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 sm:gap-8 mb-6 sm:mb-8 pb-6 sm:pb-8 border-b border-outline-variant/40">
                    <div className="max-w-2xl">
                      <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                        <span className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold text-primary">
                          {service.number}
                        </span>
                        <span className="w-8 sm:w-10 h-[1px] bg-outline-variant" />
                        <h3 className="text-xl sm:text-2xl md:text-3xl font-heading font-bold text-on-surface">
                          {service.title}
                        </h3>
                      </div>
                      <h4 className="text-base sm:text-lg font-semibold text-on-surface mb-2 sm:mb-3">
                        {service.subtitle}
                      </h4>
                      <p className="text-sm sm:text-base text-main-text leading-relaxed">
                        {service.desc}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h5 className="text-xs font-bold uppercase tracking-widest text-primary mb-3 sm:mb-4">
                      Our services include:
                    </h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3">
                      {service.items.map((item, i) => (
                        <div key={i} className="flex items-start gap-2.5 bg-surface-container-lowest p-3 sm:p-3.5 rounded-lg border border-outline-variant/30 text-xs sm:text-sm font-medium text-on-surface">
                          <CheckCircle size={16} className="text-primary shrink-0 mt-0.5" weight="fill" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>

                    {service.note && (
                      <p className="mt-4 sm:mt-6 text-xs text-text-light italic">
                        *{service.note}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ 4. PLATFORMS WE WORK WITH ═══ */}
        <section className="w-full py-16 md:py-24 bg-surface border-b border-outline-variant/30">
          <div className="max-w-[1280px] mx-auto px-6 md:px-12">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-xs font-bold tracking-widest uppercase text-primary mb-3 block">
                Targeted Channels
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-on-surface mb-4">
                Connect With Your Audience Across the Right Platforms.
              </h2>
              <p className="text-main-text text-base md:text-lg">
                We help businesses build a consistent digital presence across the platforms where their audience spends time.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {platforms.map((platform) => {
                const IconComponent = platform.icon;
                return (
                  <div
                    key={platform.name}
                    className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-8 flex flex-col items-center text-center hover:border-primary/50 transition-all hover:shadow-xl group"
                  >
                    <div className="w-16 h-16 rounded-2xl bg-surface border border-outline-variant flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                      <IconComponent size={36} weight="fill" className="text-primary" />
                    </div>
                    <h3 className="text-2xl font-heading font-bold text-on-surface mb-3">
                      {platform.name}
                    </h3>
                    <p className="text-main-text text-sm leading-relaxed">
                      {platform.desc}
                    </p>
                  </div>
                );
              })}
            </div>

            <p className="text-center text-xs text-text-light italic mt-8">
              *Platform selection depends on your business type, audience, and marketing objectives.
            </p>
          </div>
        </section>

        {/* ═══ 5. OUR APPROACH ═══ */}
        <section className="w-full py-20 md:py-28 bg-surface-container-lowest border-b border-outline-variant/30">
          <div className="max-w-[1280px] mx-auto px-6 md:px-12">
            <div className="max-w-3xl mb-16">
              <span className="text-xs font-bold tracking-widest uppercase text-primary mb-3 block">
                Strategic Process
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-on-surface mb-4">
                Social Media That Works With Your Brand.
              </h2>
              <p className="text-main-text text-lg leading-relaxed">
                We believe your social media should look, feel, and sound like your business. Our approach combines creative design with strategic content planning to ensure every post has a purpose.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
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

        {/* ═══ 6. WHY INFRONIXWEB? ═══ */}
        <section className="w-full py-20 md:py-28 bg-surface border-b border-outline-variant/30">
          <div className="max-w-[1280px] mx-auto px-6 md:px-12">
            <div className="max-w-3xl mb-16">
              <span className="text-xs font-bold tracking-widest uppercase text-primary mb-3 block">
                The InfronixWeb Advantage
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-on-surface mb-4">
                More Than Content. A Digital Growth Partner.
              </h2>
              <p className="text-main-text text-lg">
                We combine design, development, marketing, and automation to help businesses build a stronger digital presence.
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

        {/* ═══ 7. WHO WE HELP ═══ */}
        <section className="w-full py-16 md:py-24 bg-surface-container-lowest border-b border-outline-variant/30">
          <div className="max-w-[1280px] mx-auto px-6 md:px-12">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-xs font-bold tracking-widest uppercase text-primary mb-3 block">
                Tailored Solutions
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-on-surface mb-4">
                Social Media Solutions for Businesses of All Sizes.
              </h2>
              <p className="text-main-text text-base md:text-lg">
                Our social media marketing services are designed for businesses looking to improve their online presence and connect with their audience.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {whoWeHelp.map((item, idx) => {
                const IconComponent = item.icon;
                return (
                  <div
                    key={idx}
                    className="bg-surface border border-outline-variant/50 rounded-xl p-6 flex flex-col items-center text-center gap-3 hover:border-primary transition-all hover:shadow-md"
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
              Whether you are starting from scratch or looking to improve your existing social media presence, we can help you build a strategy that fits your business.
            </p>
          </div>
        </section>

        {/* ═══ 8. WHAT YOU CAN EXPECT ═══ */}
        <section className="w-full py-20 md:py-28 bg-surface border-b border-outline-variant/30">
          <div className="max-w-[1280px] mx-auto px-6 md:px-12">
            <div className="max-w-3xl mb-16">
              <span className="text-xs font-bold tracking-widest uppercase text-primary mb-3 block">
                Measurable Impact
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-on-surface mb-4">
                A Better Way to Manage Your Social Media.
              </h2>
              <p className="text-main-text text-lg">
                With the right strategy and consistent execution, social media can help your business:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl">
              {expectations.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 bg-surface-container-lowest border border-outline-variant/50 p-5 rounded-xl text-base font-medium text-on-surface"
                >
                  <CheckCircle size={22} className="text-primary shrink-0" weight="fill" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <p className="text-xs text-text-light italic mt-8">
              *Results vary depending on your industry, audience, content quality, consistency, and other marketing factors.
            </p>
          </div>
        </section>

        {/* ═══ 9. FREQUENTLY ASKED QUESTIONS ═══ */}
        <section className="w-full py-20 md:py-28 bg-surface-container-lowest border-b border-outline-variant/30" itemScope itemType="https://schema.org/FAQPage">
          <div className="max-w-[900px] mx-auto px-6 md:px-12">
            <div className="text-center mb-14">
              <span className="text-xs font-bold tracking-widest uppercase text-primary mb-3 block">
                Got Questions?
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-on-surface mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-main-text text-base">
                Everything you need to know about our social media management and content production services.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="border border-outline-variant p-6 sm:p-7 bg-surface rounded-xl hover:border-primary/50 transition-all shadow-sm"
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

        {/* ═══ 10. FINAL CTA ═══ */}
        <section className="w-full py-20 md:py-28 bg-ink-black text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[140px] pointer-events-none" />
          <div className="max-w-[1280px] mx-auto px-6 md:px-12 relative z-10 text-center flex flex-col items-center">
            <span className="text-xs font-bold tracking-widest uppercase text-primary mb-4 block">
              Get Started Today
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-white mb-6 max-w-3xl leading-tight">
              Ready to Build a Stronger Social Media Presence?
            </h2>
            <p className="text-lg md:text-xl text-[#A0AEC0] max-w-2xl mb-10 leading-relaxed">
              Let&apos;s turn your social media into a place where your brand gets noticed, builds trust, and connects with the right audience.
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

        <ServiceDetails slug="digital-marketing/social-media-marketing" />
      </main>
    </>
  );
}
