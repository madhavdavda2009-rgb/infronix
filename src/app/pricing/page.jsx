import Link from 'next/link';
import { pageMetadata, SITE_URL, serializeJsonLd } from '@/lib/site-seo';
import Breadcrumb from '@/components/Breadcrumb';
import CTASection from '@/components/CTASection';
import MarketingPricingTabs from '@/components/MarketingPricingTabs';
import { offerSchema } from '@/components/ServicePricing';
import { WEBSITE_PACKAGES, ADS_PACKAGES, SOCIAL_PACKAGES, SEO_PACKAGES, CHATGPT_PACKAGES, MARKETING_PRICING, PRICING_ADDONS, PRICING_NOT_INCLUDED, PAYMENT_TERMS, formatInr } from '@/lib/pricing';
import { ArrowRight, ArrowUpRight, XCircle, Megaphone, GoogleLogo, MetaLogo, ChartLineUp, OpenAiLogo } from '@phosphor-icons/react/dist/ssr';

export const metadata = pageMetadata(
  'Website Pricing – Starting at ₹10,000',
  'Transparent website pricing from InfronixWeb, Ahmedabad. Business websites start at ₹10,000 with clear add-on prices. SEO from ₹2,000/month, social media from ₹5,000/month and Google & Meta Ads from ₹6,000/month.',
  '/pricing'
);

const pricingSchema = {
  '@context': 'https://schema.org',
  '@type': 'OfferCatalog',
  '@id': `${SITE_URL}/pricing#marketing-plans`,
  name: 'InfronixWeb monthly marketing plans',
  url: `${SITE_URL}/pricing`,
  itemListElement: MARKETING_PRICING.map(group => ({
    '@type': 'OfferCatalog',
    name: `${group.label} plans`,
    description: group.answer,
    itemListElement: offerSchema([group], `${SITE_URL}/pricing`),
  })),
};

// Rate card in the hero: every service's entry price at a glance.
const RATE_CARD = [
  { label: 'Websites', price: WEBSITE_PACKAGES[0].price, unit: 'one-time', href: '#website-packages' },
  ...MARKETING_PRICING.map(group => ({ label: group.label, price: group.packages[0].price, unit: 'per month', href: `#${group.id}-pricing` })),
];

const PAYMENT_SHADES = ['bg-primary', 'bg-primary/60', 'bg-primary/30'];

function Eyebrow({ children, className = '' }) {
  return (
    <span className={`text-xs sm:text-sm font-semibold tracking-widest uppercase text-primary mb-3 sm:mb-4 flex items-center gap-3 ${className}`}>
      <span className="w-8 sm:w-12 h-[2px] bg-primary" /> {children}
    </span>
  );
}

export default function PricingPage() {
  return (
    <main className="w-full pt-20 sm:pt-28 md:pt-32" id="main-content">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(pricingSchema) }} />

      {/* Hero with rate card */}
      <section className="relative overflow-hidden pb-16 sm:pb-24">
        <div className="absolute top-0 right-0 w-[320px] sm:w-[620px] h-[320px] sm:h-[620px] bg-primary/[0.07] rounded-full blur-[110px] pointer-events-none translate-x-1/4 -translate-y-1/4" aria-hidden="true" />
        <div className="absolute bottom-0 left-0 w-[240px] sm:w-[420px] h-[240px] sm:h-[420px] bg-accent/[0.12] rounded-full blur-[100px] pointer-events-none -translate-x-1/3" aria-hidden="true" />

        <div className="relative max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12 pt-4 sm:pt-6">
          <Breadcrumb />
        </div>

        <div className="relative max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12 pt-8 sm:pt-12 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          <div className="lg:col-span-7">
            <Eyebrow>Pricing</Eyebrow>
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-heading font-bold text-on-surface leading-tight tracking-tight">
              Websites starting at <span className="text-primary">₹10,000.</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-main-text max-w-2xl mt-5 sm:mt-6 leading-relaxed">
              Simple, transparent pricing. Pick a package, add only what your business needs, and know the full cost before we start.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-8">
              <a href="#website-packages" className="group inline-flex items-center justify-center gap-2 bg-deep-space text-white font-semibold text-sm sm:text-base px-7 py-3.5 sm:py-4 rounded-xl hover:bg-primary transition-colors shadow-md">
                Website packages <ArrowRight size={16} weight="bold" className="group-hover:translate-x-1 transition-transform" />
              </a>
              <a href="#marketing-plans" className="inline-flex items-center justify-center gap-2 bg-surface-container-lowest text-on-surface border border-outline font-semibold text-sm sm:text-base px-7 py-3.5 sm:py-4 rounded-xl hover:border-primary/50 transition-colors">
                Monthly marketing plans
              </a>
            </div>
            <ul className="flex flex-wrap gap-x-6 gap-y-2 mt-7 text-sm text-main-text">
              {['Written quote before any work', 'Ad spend paid directly to platforms', 'Prices in Indian Rupees'].map(point => (
                <li key={point} className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />{point}</li>
              ))}
            </ul>
          </div>

          <aside aria-label="Starting prices" className="lg:col-span-5 agency-dark-card rounded-3xl p-6 sm:p-8 text-white shadow-2xl shadow-primary/10 relative overflow-hidden">
            <div className="absolute -top-20 -right-20 w-56 h-56 bg-primary/40 rounded-full blur-[80px] pointer-events-none" aria-hidden="true" />
            <div className="relative flex items-center justify-between mb-5">
              <span className="text-xs font-semibold tracking-widest uppercase text-white/60">Rate card</span>
              <span className="flex items-center gap-2 text-xs text-white/60"><span className="w-2 h-2 rounded-full bg-accent" />Starting prices</span>
            </div>
            <ol className="relative divide-y divide-white/10">
              {RATE_CARD.map((row, index) => (
                <li key={row.label}>
                  <a href={row.href} className="group flex items-center gap-4 py-3.5 sm:py-4">
                    <span className="font-heading font-bold text-sm text-white/30 group-hover:text-accent transition-colors w-6">{String(index + 1).padStart(2, '0')}</span>
                    <span className="flex-1 font-heading font-bold text-base sm:text-lg text-white">{row.label}</span>
                    <span className="text-right">
                      <span className="block font-heading font-bold text-lg sm:text-xl text-white">{formatInr(row.price)}</span>
                      <span className="block text-[11px] uppercase tracking-wider text-white/50">{row.unit}</span>
                    </span>
                    <ArrowUpRight size={16} weight="bold" className="text-white/30 group-hover:text-accent transition-colors shrink-0" aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ol>
          </aside>
        </div>
      </section>

      {/* Website packages */}
      <section id="website-packages" aria-labelledby="website-packages-heading" className="pb-16 sm:pb-24 scroll-mt-28">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12">
          <div className="mb-10 sm:mb-14 flex flex-col md:flex-row md:items-end justify-between gap-4 md:gap-8">
            <div className="max-w-2xl">
              <Eyebrow>Website Packages</Eyebrow>
              <h2 id="website-packages-heading" className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-on-surface leading-tight">One-time packages, clear from day one.</h2>
            </div>
            <p className="text-sm sm:text-base text-main-text max-w-md leading-relaxed">All prices are in Indian Rupees. Your final quote is shared in writing before any work begins.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-6 items-stretch">
            {WEBSITE_PACKAGES.map((pkg, index) => {
              const dark = pkg.popular;
              return (
                <article
                  key={pkg.id}
                  className={`relative flex flex-col rounded-3xl p-7 sm:p-9 overflow-hidden transition-shadow ${
                    dark ? 'agency-dark-card text-white shadow-2xl shadow-primary/15' : 'bg-surface-container-lowest border border-outline hover:shadow-lg hover:border-primary/30'
                  }`}
                >
                  {dark && <div className="absolute -top-24 -right-16 w-64 h-64 bg-primary/40 rounded-full blur-[90px] pointer-events-none" aria-hidden="true" />}
                  <div className="relative flex items-start justify-between gap-4">
                    <span className={`text-4xl sm:text-5xl font-heading font-bold ${dark ? 'text-accent' : 'text-text-light/30'}`}>{String(index + 1).padStart(2, '0')}</span>
                    {dark && <span className="px-3 py-1 rounded-full bg-accent-alt text-deep-space text-xs font-bold tracking-wide whitespace-nowrap">Most Popular</span>}
                  </div>
                  <h3 className={`relative text-2xl sm:text-3xl font-heading font-bold mt-6 ${dark ? 'text-white' : 'text-on-surface'}`}>{pkg.name}</h3>
                  <p className={`relative text-sm sm:text-base mt-2 leading-relaxed min-h-[3rem] ${dark ? 'text-white/70' : 'text-main-text'}`}>{pkg.tagline}</p>

                  <div className={`relative mt-7 pb-7 border-b ${dark ? 'border-white/10' : 'border-outline'}`}>
                    <span className={`block text-xs font-semibold uppercase tracking-widest mb-1.5 ${dark ? 'text-white/50' : 'text-text-light'}`}>{pkg.priceNote === 'starting' ? 'Starting at' : 'One-time'}</span>
                    <span className={`text-5xl sm:text-6xl font-heading font-bold tracking-tight ${dark ? 'text-white' : 'text-on-surface'}`}>{formatInr(pkg.price)}</span>
                  </div>

                  <ul className="relative mt-7 space-y-3.5 flex-1">
                    {pkg.features.map(feature => (
                      <li key={feature} className={`flex items-start gap-3 text-sm sm:text-[15px] leading-relaxed ${dark ? 'text-white/85' : 'text-main-text'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full shrink-0 mt-2 ${dark ? 'bg-accent' : 'bg-primary'}`} />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    href={`/start-project?package=${pkg.id}`}
                    className={`group relative mt-9 inline-flex items-center justify-center gap-2 font-semibold text-sm sm:text-base px-6 py-4 rounded-xl transition-colors ${
                      dark ? 'bg-white text-deep-space hover:bg-accent' : 'bg-deep-space text-white hover:bg-primary'
                    }`}
                  >
                    Get a Quote <ArrowRight size={16} weight="bold" className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Add-ons, payment terms, exclusions */}
      <section aria-labelledby="addons-heading" className="py-16 sm:py-24 bg-surface border-y border-outline/50">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          <div className="lg:col-span-7">
            <Eyebrow>Add-ons</Eyebrow>
            <h2 id="addons-heading" className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-on-surface leading-tight">
              Need more? <span className="text-primary">Add only what you need.</span>
            </h2>
            <p className="text-sm sm:text-base text-main-text mt-4 mb-8 sm:mb-10 max-w-xl leading-relaxed">
              Every extra has a fixed price, so your quote grows only with your requirements.
            </p>

            <table className="w-full text-sm sm:text-base">
              <caption className="sr-only">Website add-on prices</caption>
              <thead className="sr-only"><tr><th scope="col">Add-on</th><th scope="col">Price</th></tr></thead>
              <tbody>
                {PRICING_ADDONS.map(addon => (
                  <tr key={addon.name} className="group">
                    <td className="py-3 sm:py-3.5 pr-3 text-main-text group-hover:text-on-surface transition-colors">
                      <span className="flex items-baseline gap-3">
                        <span>{addon.name}</span>
                        <span className="flex-1 min-w-6 border-b border-dotted border-outline-variant translate-y-[-4px]" aria-hidden="true" />
                      </span>
                    </td>
                    <td className="py-3 sm:py-3.5 text-right font-heading font-bold text-on-surface whitespace-nowrap align-bottom">{addon.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="lg:col-span-5 space-y-6 lg:pt-16">
            <div className="rounded-3xl border border-outline bg-surface-container-lowest p-6 sm:p-8">
              <h3 className="text-xl font-heading font-bold text-on-surface">Payment terms</h3>
              <div className="flex h-3 rounded-full overflow-hidden mt-6 gap-1" aria-hidden="true">
                {PAYMENT_TERMS.map((term, index) => <span key={term.label} className={PAYMENT_SHADES[index]} style={{ width: term.label }} />)}
              </div>
              <ol className="mt-6 space-y-4">
                {PAYMENT_TERMS.map((term, index) => (
                  <li key={term.label} className="flex items-center gap-4">
                    <span className={`w-3 h-3 rounded-full shrink-0 ${PAYMENT_SHADES[index]}`} aria-hidden="true" />
                    <span className="font-heading font-bold text-2xl text-on-surface w-16 shrink-0">{term.label}</span>
                    <span className="text-sm text-main-text leading-relaxed">{term.text}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="rounded-3xl border border-outline bg-surface-container-lowest p-6 sm:p-8">
              <h3 className="text-xl font-heading font-bold text-on-surface mb-5">Not included in packages</h3>
              <ul className="space-y-3">
                {PRICING_NOT_INCLUDED.map(item => (
                  <li key={item} className="flex items-start gap-3 text-sm text-main-text leading-relaxed">
                    <XCircle size={18} className="text-text-light shrink-0 mt-0.5" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="text-xs text-text-light mt-5">These can be added from the list on the left.</p>
            </div>
          </div>
        </div>
      </section>

      <MarketingPricingTabs />

      {/* Help choosing */}
      <section aria-labelledby="marketing-pricing-heading" className="pb-16 sm:pb-24">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12">
          <div className="rounded-3xl agency-dark-card text-white p-8 sm:p-12 md:p-14 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center overflow-hidden relative">
            <div className="absolute -right-24 -top-24 w-72 h-72 rounded-full bg-primary/40 blur-3xl pointer-events-none" aria-hidden="true" />
            <div className="absolute -left-24 -bottom-24 w-64 h-64 rounded-full bg-accent/10 blur-3xl pointer-events-none" aria-hidden="true" />
            <div className="relative">
              <span className="text-xs sm:text-sm font-semibold tracking-widest uppercase text-white/60 mb-3 sm:mb-4 flex items-center gap-3"><span className="w-8 sm:w-12 h-[2px] bg-accent" /> Digital Marketing</span>
              <h2 id="marketing-pricing-heading" className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold leading-tight text-white">
                Not sure which plan fits? <span className="text-violet-300">Let&rsquo;s plan it together.</span>
              </h2>
              <p className="text-sm sm:text-base text-white/75 mt-4 leading-relaxed max-w-xl">
                Tell us about your business, budget and goals on a free call. We&rsquo;ll suggest the right mix of ads, social media and SEO packages, or build a custom plan for larger goals.
              </p>
              <Link href="/contact" className="group mt-7 inline-flex items-center gap-2 bg-white text-deep-space font-semibold text-sm sm:text-base px-7 py-4 rounded-xl hover:bg-accent transition-colors">
                Book a free call <ArrowRight size={16} weight="bold" className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            <ul className="relative divide-y divide-white/10 rounded-2xl border border-white/10 bg-white/[0.04]">
              {[
                { href: '/google-ads', label: 'Google Ads', note: `From ${formatInr(ADS_PACKAGES[0].price)}/month`, icon: GoogleLogo },
                { href: '/meta-ads', label: 'Meta Ads', note: `From ${formatInr(ADS_PACKAGES[0].price)}/month`, icon: MetaLogo },
                { href: '/chatgpt-ads', label: 'ChatGPT Ads', note: `Setup at ${formatInr(CHATGPT_PACKAGES[0].price)}/month`, icon: OpenAiLogo },
                { href: '/digital-marketing/social-media-marketing', label: 'Social Media', note: `From ${formatInr(SOCIAL_PACKAGES[0].price)}/month`, icon: Megaphone },
                { href: '/seo', label: 'SEO', note: `From ${formatInr(SEO_PACKAGES[0].price)}/month`, icon: ChartLineUp },
              ].map(item => (
                <li key={item.href}>
                  <Link href={item.href} className="group flex items-center gap-4 px-5 sm:px-6 py-4 hover:bg-white/[0.05] transition-colors">
                    <item.icon size={22} weight="duotone" className="text-violet-300 shrink-0" aria-hidden="true" />
                    <span className="flex-1 font-semibold text-sm sm:text-base text-white">{item.label}</span>
                    <span className="text-xs sm:text-sm text-white/60 group-hover:text-white transition-colors">{item.note}</span>
                    <ArrowUpRight size={15} weight="bold" className="text-white/30 group-hover:text-accent transition-colors shrink-0" aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <CTASection />
    </main>
  );
}
