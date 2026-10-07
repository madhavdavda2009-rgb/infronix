import Breadcrumb from '@/components/Breadcrumb';
import ServiceDirectory from '@/components/ServiceDirectory';
import Link from 'next/link';
import { ArrowRight, Sparkle } from '@phosphor-icons/react/dist/ssr';
import { pageMetadata } from '@/lib/site-seo';

export const metadata = pageMetadata(
  'Website Development, Digital Marketing & SEO Services in Ahmedabad',
  'Explore InfronixWeb website development, digital marketing and SEO services, including online stores, social media and Google and Meta Ads.',
  '/services'
);

export default function ServicesPage() {
  return (
    <main id="main-content" className="pt-24 sm:pt-32 md:pt-36 pb-20 bg-surface-container-lowest">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 md:px-12">
        <Breadcrumb />
        
        {/* Header */}
        <div className="mt-6 mb-12 sm:mb-16">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-primary mb-3">
            <Sparkle size={15} weight="bold" /> Our services
          </span>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-heading font-bold text-on-surface max-w-3xl leading-tight mb-5">
            Website Development. Digital Marketing. SEO.
          </h1>
          <p className="text-base sm:text-lg text-main-text max-w-2xl leading-relaxed">
            Based in Ahmedabad, we build business websites, help you reach customers through Google and social media, and improve your visibility in search.
          </p>
        </div>

        {/* Directory Grid */}
        <div className="bg-surface p-6 sm:p-10 rounded-3xl border border-outline shadow-xs mb-14">
          <ServiceDirectory />
        </div>

        {/* Scoping CTA Card */}
        <div className="bg-gradient-to-br from-surface via-surface-container-lowest to-surface p-8 sm:p-12 rounded-3xl border border-outline shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-on-surface mb-2.5">
              Not sure where to begin?
            </h2>
            <p className="text-main-text text-sm sm:text-base leading-relaxed">
              Tell us what you want to achieve and which tools you already use. We will suggest a practical plan with clear steps, costs and responsibilities.
            </p>
          </div>
          <Link 
            href="/start-project" 
            className="inline-flex items-center justify-center gap-2 bg-primary text-white font-semibold text-sm sm:text-base px-7 py-3.5 sm:px-8 sm:py-4 rounded-xl hover:bg-primary-dark transition-all shadow-md hover:shadow-primary/25 whitespace-nowrap self-start md:self-center"
          >
            <span>Discuss Your Project</span>
            <ArrowRight size={16} weight="bold" />
          </Link>
        </div>
      </div>
    </main>
  );
}
