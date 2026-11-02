import Link from 'next/link';
import { enquiryHref, getService } from '@/lib/services';
import { SITE_URL, serializeJsonLd } from '@/lib/site-seo';
import ServiceContent from '@/components/ServiceContent';

export function RelatedServices({ slugs }) {
  return <nav aria-label="Related services" className="flex flex-wrap gap-3 mt-8">{slugs.map(slug => {
    const service = getService(slug);
    return service ? <Link key={slug} href={`/${slug}`} className="inline-flex items-center min-h-11 px-4 py-2 border border-outline-variant rounded-lg text-primary hover:bg-soft-violet">{service.name}</Link> : null;
  })}</nav>;
}

export default function ServiceDetails({ slug }) {
  const service = getService(slug);
  const pageUrl = `${SITE_URL}/${slug}`;
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'Service', '@id': `${pageUrl}#service`, name: service.name,
        serviceType: service.name, description: service.description, url: pageUrl,
        provider: { '@id': `${SITE_URL}/#organization` },
        areaServed: service.areaServed || { '@type': 'City', name: 'Ahmedabad' } },
      { '@type': 'WebPage', '@id': `${pageUrl}#webpage`, url: pageUrl,
        name: service.title, description: service.description, inLanguage: 'en-IN',
        isPartOf: { '@id': `${SITE_URL}/#website` },
        mainEntity: { '@id': `${pageUrl}#service` } },
    ],
  };

  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(schema) }} />
    <ServiceContent slug={slug} />
    {service.process && <>
      <section className="py-12 sm:py-20 bg-surface border-b border-outline-variant/40">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 md:px-12 grid md:grid-cols-2 gap-10 md:gap-16">
          <div><h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-on-surface mb-5 leading-tight">Where this service helps</h2><p className="leading-relaxed mb-5">{service.problems}</p><p className="leading-relaxed">{service.fit}</p></div>
          <div><h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-on-surface mb-5 leading-tight">{slug === 'google-ads' ? 'Our Google Ads process' : 'How the work happens'}</h2><ol className="list-decimal pl-5 space-y-4 text-main-text">{service.process.map(step => <li key={step} className="pl-2 leading-relaxed">{step}</li>)}</ol></div>
        </div>
      </section>
      <section className="py-12 sm:py-16 bg-surface-container-lowest">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 md:px-12 grid md:grid-cols-2 gap-10 md:gap-16">
          <div><h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-on-surface mb-5 leading-tight">What this could look like</h2><p className="leading-relaxed">{service.example}</p>{service.proof && <Link href={service.proofHref || '/projects'} className="inline-flex mt-5 min-h-11 items-center text-primary underline underline-offset-4">{service.proofLabel || 'Explore our selected website work'}</Link>}</div>
          <div><h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-on-surface mb-5 leading-tight">What we review together</h2><p className="leading-relaxed">{service.measure}</p></div>
        </div>
      </section>
      <section className="py-12 sm:py-16 bg-surface">
        <div className="max-w-[900px] mx-auto px-4 sm:px-6 md:px-8">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-on-surface mb-6 leading-tight">Questions about {service.name}</h2>
          {service.faqs.map(([question, answer]) => <details key={question} className="border-b border-outline-variant py-4"><summary className="cursor-pointer text-lg font-heading font-bold py-2 text-on-surface">{question}</summary><p className="leading-relaxed pt-3 pb-2">{answer}</p></details>)}
        </div>
      </section>
    </>}
    <section className="py-12 sm:py-16 bg-surface-container-lowest border-t border-outline-variant/40">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 md:px-12">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-on-surface mb-4 leading-tight">Connect the next part of your plan</h2>
        <p className="max-w-2xl leading-relaxed">Choose the support your business needs now. We can scope one service or coordinate related work.</p>
        <RelatedServices slugs={service.related} />
        <Link href={enquiryHref(service)} className="inline-flex items-center justify-center mt-8 bg-primary text-white font-semibold text-sm sm:text-base md:text-lg px-7 py-3.5 sm:px-8 sm:py-4 rounded-xl hover:bg-primary-dark transition-colors">Discuss your project</Link>
      </div>
    </section>
  </>;
}
