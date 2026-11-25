import Link from 'next/link';
import { ArrowRight } from '@phosphor-icons/react/dist/ssr';
import { SERVICE_PRICING, getMarketingGroup, formatInr } from '@/lib/pricing';
import { SITE_URL, serializeJsonLd } from '@/lib/site-seo';

// Monthly offers as schema.org Offers, linked to the page's Service (ServiceDetails declares #service).
export function offerSchema(groups, pageUrl) {
  return groups.flatMap(group => group.packages.map(pkg => ({
    '@type': 'Offer',
    '@id': `${pageUrl}#offer-${pkg.id}`,
    name: pkg.name,
    description: pkg.tagline,
    url: `${SITE_URL}/pricing#${group.id}-pricing`,
    price: pkg.price,
    priceCurrency: 'INR',
    availability: 'https://schema.org/InStock',
    priceSpecification: {
      '@type': 'UnitPriceSpecification',
      price: pkg.price,
      priceCurrency: 'INR',
      unitCode: 'MON',
      unitText: 'month',
      valueAddedTaxIncluded: false,
    },
    seller: { '@id': `${SITE_URL}/#organization` },
  })));
}

// Short "plans and pricing" block shown near the top of a service page. Answer-first sentence,
// a plain table and Offer markup make the starting price easy to quote for search and AI answers.
export default function ServicePricing({ slug }) {
  const groups = (SERVICE_PRICING[slug] || []).map(getMarketingGroup).filter(Boolean);
  if (!groups.length) return null;
  const pageUrl = `${SITE_URL}/${slug}`;
  const single = groups.length === 1 ? groups[0] : null;
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [{
      '@type': 'OfferCatalog',
      '@id': `${pageUrl}#pricing`,
      name: single ? `${single.label} plans` : 'Digital marketing plans',
      url: `${SITE_URL}/pricing#marketing-plans`,
      itemListElement: offerSchema(groups, pageUrl),
    }, {
      '@id': `${pageUrl}#service`,
      hasOfferCatalog: { '@id': `${pageUrl}#pricing` },
    }],
  };
  const rows = single
    ? single.packages.map(pkg => ({ key: pkg.id, name: pkg.name, price: pkg.price, note: pkg.tagline, popular: pkg.popular }))
    : groups.map(group => ({ key: group.id, name: group.label, price: group.packages[0].price, note: group.answer, href: `/pricing#${group.id}-pricing` }));

  return (
    <section id="pricing" aria-labelledby="service-pricing-heading" className="py-12 sm:py-16 bg-surface border-b border-outline-variant/30 scroll-mt-24">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(schema) }} />
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 md:px-12 grid lg:grid-cols-5 gap-8 lg:gap-14 items-start">
        <div className="lg:col-span-2">
          <span className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-primary mb-4">
            <span className="w-8 sm:w-12 h-[2px] bg-primary" /> Pricing
          </span>
          <h2 id="service-pricing-heading" className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-on-surface leading-tight">
            {single ? <>Plans from <span className="text-primary">{formatInr(single.packages[0].price)}/month</span></> : <>Plans from <span className="text-primary">{formatInr(Math.min(...groups.map(g => g.packages[0].price)))}/month</span></>}
          </h2>
          {single
            ? <p className="mt-5 leading-relaxed text-main-text">{single.answer}</p>
            : <p className="mt-5 leading-relaxed text-main-text">Every service has published monthly plans, so you know the starting cost before the first call. Advertising spend, where it applies, is always paid separately to the platform.</p>}
          {single && single.notes[0] && <p className="mt-3 text-sm leading-relaxed text-text-light">{single.notes[0]}</p>}
          <div className="flex flex-col sm:flex-row gap-3 mt-7">
            <Link href={single ? `/pricing#${single.id}-pricing` : '/pricing#marketing-plans'} className="inline-flex items-center justify-center gap-2 bg-primary text-white font-semibold text-sm sm:text-base px-6 py-3.5 rounded-xl hover:bg-primary-dark transition-colors">
              Compare all plans <ArrowRight size={16} weight="bold" />
            </Link>
          </div>
        </div>

        <div className="lg:col-span-3 rounded-2xl border border-outline bg-surface-container-lowest overflow-hidden">
          <table className="w-full text-sm">
            <caption className="sr-only">{single ? `${single.label} monthly plans and prices` : 'Starting prices for digital marketing services'}</caption>
            <thead>
              <tr className="bg-primary/5 text-left">
                <th scope="col" className="px-4 sm:px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-primary">{single ? 'Plan' : 'Service'}</th>
                <th scope="col" className="px-4 sm:px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-primary text-right whitespace-nowrap">{single ? 'Per month' : 'Starts at'}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(row => (
                <tr key={row.key} className="border-t border-outline align-top">
                  <th scope="row" className="px-4 sm:px-5 py-4 text-left font-normal">
                    <span className="flex flex-wrap items-center gap-2 font-heading font-bold text-base text-on-surface">
                      {row.href ? <Link href={row.href} className="hover:text-primary">{row.name}</Link> : row.name}
                      {row.popular && <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[11px] font-semibold uppercase tracking-wide">Most popular</span>}
                    </span>
                    <span className="block mt-1 text-main-text leading-relaxed">{row.note}</span>
                  </th>
                  <td className="px-4 sm:px-5 py-4 text-right whitespace-nowrap">
                    <span className="font-heading font-bold text-lg sm:text-xl text-on-surface">{formatInr(row.price)}</span>
                    <span className="block text-xs text-text-light">per month</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
