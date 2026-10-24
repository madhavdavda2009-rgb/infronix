import ServiceDirectory from '@/components/ServiceDirectory';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import HeroSection from '@/components/HeroSection';
import ServicesSection from '@/components/ServicesSection';
import PortfolioSection from '@/components/PortfolioSection';
import AboutSection from '@/components/AboutSection';
import { getInitialPublicTeam } from '@/lib/public-team';
import { getPublicTrust } from '@/lib/website_trust';
import TrustBar from '@/components/TrustBar';
import { ArrowRight, BookOpen } from '@phosphor-icons/react/dist/ssr';

const ProcessSection = dynamic(() => import('@/components/ProcessSection'));
const TeamSection = dynamic(() => import('@/components/TeamSection'));
const FAQSection = dynamic(() => import('@/components/FAQSection'));
const CTASection = dynamic(() => import('@/components/CTASection'));
const ReviewsSection = dynamic(() => import('@/components/ReviewsSection'));

export const revalidate = 0;

export default async function Home() {
  const [team, trust] = await Promise.all([getInitialPublicTeam('home'), getPublicTrust()]);
  return (
    <>
      <main className="w-full pt-20 sm:pt-24 md:pt-28 lg:pt-32" id="main-content">
        <HeroSection rating={trust.show_rating_strip ? trust.rating : null} />
        <TrustBar rating={trust.rating} stats={trust.stats} showRating={trust.show_rating_strip} />

        <section className="py-14 sm:py-18 bg-surface border-y border-outline/50" aria-label="Website Development, Digital Marketing and SEO services">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12">
            <ServiceDirectory compact />
          </div>
        </section>

        <ServicesSection />
        <PortfolioSection />
        <ReviewsSection reviews={trust.reviews} rating={trust.rating} badges={trust.badges} />
        <AboutSection />
        <ProcessSection />
        <TeamSection initialTeam={team} />

        {/* Executive Blog / Insights Teaser Banner */}
        <section className="py-16 sm:py-20 bg-surface-container-lowest">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 md:px-12">
            <div className="bg-gradient-to-br from-surface via-surface-container-lowest to-surface p-8 sm:p-12 rounded-3xl border border-outline shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="max-w-2xl">
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-primary mb-3">
                  <BookOpen size={16} weight="bold" /> Strategic Insights
                </span>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold text-on-surface mb-3">
                  A clearer next step for your business.
                </h2>
                <p className="text-main-text text-sm sm:text-base leading-relaxed">
                  Practical advice on websites, Google search and online advertising—so you can decide where to invest.
                </p>
              </div>
              <Link 
                href="/blog" 
                className="inline-flex items-center justify-center gap-2 bg-primary text-white font-semibold text-sm px-6 py-3.5 rounded-xl hover:bg-primary-dark transition-all shadow-sm hover:shadow-md hover:shadow-primary/25 whitespace-nowrap self-start md:self-center"
              >
                <span>Read Agency Insights</span>
                <ArrowRight size={14} weight="bold" />
              </Link>
            </div>
          </div>
        </section>

        <FAQSection />
        <CTASection />
      </main>
    </>
  );
}
