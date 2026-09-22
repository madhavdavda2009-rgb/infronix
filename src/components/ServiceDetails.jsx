import Link from 'next/link';
import { getService } from '@/lib/services';
import { SITE_URL, serializeJsonLd } from '@/lib/site-seo';

export function RelatedServices({ slugs }) {
  return <nav aria-label="Related services" className="flex flex-wrap gap-3 mt-8">{slugs.map(slug => {
    const service = getService(slug);
    return service ? <Link key={slug} href={`/${slug}`} className="inline-flex items-center min-h-11 px-4 py-2 border border-outline-variant rounded-lg text-primary hover:bg-soft-violet">{service.name}</Link> : null;
  })}</nav>;
}

export default function ServiceDetails({ slug }) {
  const service = getService(slug);
  const schema = {
    '@context': 'https://schema.org', '@type': 'Service', name: service.name,
    description: service.description, url: `${SITE_URL}/${slug}`,
    provider: { '@id': `${SITE_URL}/#organization` }, areaServed: { '@type': 'City', name: 'Ahmedabad' },
  };
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(schema) }} />
    {service.process && <>
      <section className="py-12 sm:py-20 bg-surface border-b border-outline-variant/40">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 md:px-12 grid md:grid-cols-2 gap-10 md:gap-16">
          <div><h2 className="text-2xl sm:text-3xl mb-5">Where this service helps</h2><p className="leading-relaxed mb-5">{service.problems}</p><p className="leading-relaxed">{service.fit}</p></div>
          <div><h2 className="text-2xl sm:text-3xl mb-5">How the work happens</h2><ol className="list-decimal pl-5 space-y-4 text-main-text">{service.process.map(step => <li key={step} className="pl-2 leading-relaxed">{step}</li>)}</ol></div>
        </div>
      </section>
      <section className="py-12 sm:py-16 bg-surface-container-lowest">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 md:px-12 grid md:grid-cols-2 gap-10 md:gap-16">
          <div><h2 className="text-2xl sm:text-3xl mb-5">What this could look like</h2><p className="leading-relaxed">{service.example}</p>{service.proof && <Link href="/projects" className="inline-flex mt-5 min-h-11 items-center text-primary underline underline-offset-4">Explore our selected website work</Link>}</div>
          <div><h2 className="text-2xl sm:text-3xl mb-5">What we review together</h2><p className="leading-relaxed">{service.measure}</p></div>
        </div>
      </section>
      <section className="py-12 sm:py-16 bg-surface">
        <div className="max-w-[900px] mx-auto px-4 sm:px-6 md:px-8">
          <h2 className="text-2xl sm:text-3xl mb-6">Questions about {service.name}</h2>
          {service.faqs.map(([question, answer]) => <details key={question} className="border-b border-outline-variant py-4"><summary className="cursor-pointer text-lg py-2 text-on-surface">{question}</summary><p className="leading-relaxed pt-3 pb-2">{answer}</p></details>)}
        </div>
      </section>
    </>}
    <section className="py-12 sm:py-16 bg-surface-container-lowest border-t border-outline-variant/40">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 md:px-12">
        <h2 className="text-2xl sm:text-3xl mb-4">Connect the next part of your plan</h2>
        <p className="max-w-2xl leading-relaxed">Choose the support your business needs now. We can scope one service or coordinate related work.</p>
        <RelatedServices slugs={service.related} />
        <Link href={`/start-project?service=${encodeURIComponent(service.name)}`} className="inline-flex mt-8 px-6 py-3.5 bg-primary text-white rounded-md hover:bg-primary-dark">Discuss your project</Link>
      </div>
    </section>
  </>;
}
