import Link from 'next/link';
import Breadcrumb from '@/components/Breadcrumb';
import { nearbyLocations } from '@/lib/locations';
import { locationProfile } from '@/lib/location-content';
import { locationDetails } from '@/lib/location-details';
import { trades } from '@/lib/location-trades';
import { SITE_URL, serializeJsonLd } from '@/lib/site-seo';

export const locationLabel = (location) => (location.region === 'Ahmedabad' && !location.zone.endsWith('District') ? `${location.name}, Ahmedabad` : `${location.name}, Gujarat`);

export default function LocationLanding({ location }) {
  const profile = locationProfile(location);
  const [tradeKeys, localAngle] = locationDetails[location.slug];
  const focus = tradeKeys.map(key => trades[key]);
  const nearby = nearbyLocations(location);
  const label = locationLabel(location);
  const pageUrl = `${SITE_URL}/digital-marketing-agency/${location.slug}`;
  const heading = `Digital Marketing Agency in ${location.name}`;
  const faqs = [
    ['Do you have a local office here?', 'No. We work from our office at Shree Eklingji Residency 2, Sanand, Ahmedabad 382110, using calls, WhatsApp and shared documents.'],
    ['How much does this cost?', 'Website packages start from ₹10,000. Advertising and search work are quoted after a call, based on what you need.'],
    ...focus.slice(0, 4).map(item => item.faq),
  ];
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'Service', '@id': `${pageUrl}#service`, name: heading,
        serviceType: 'Website development, SEO and digital marketing', url: pageUrl,
        provider: { '@id': `${SITE_URL}/#organization` },
        areaServed: { '@type': 'Place', name: label } },
      { '@type': 'WebPage', '@id': `${pageUrl}#webpage`, url: pageUrl, name: heading, inLanguage: 'en-IN',
        isPartOf: { '@id': `${SITE_URL}/#website` }, mainEntity: { '@id': `${pageUrl}#service` } },
    ],
  };

  return <main id="main-content" className="w-full pt-20 sm:pt-28 md:pt-32">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(schema) }} />
    <section className="relative w-full min-h-[480px] sm:min-h-[560px] md:min-h-[640px] flex items-center bg-surface-container-lowest overflow-hidden border-b border-outline-variant/30">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-soft-violet rounded-full blur-[80px]" />
        <div className="absolute bottom-1/3 left-1/3 w-[250px] sm:w-[400px] h-[250px] sm:h-[400px] bg-[#00F5D4]/20 rounded-full blur-[60px]" />
      </div>
      <div className="relative z-10 max-w-[1280px] w-full mx-auto px-4 sm:px-6 md:px-12 flex flex-col gap-5 sm:gap-6">
        <Breadcrumb currentLabel={location.name} />
        <div className="flex flex-col gap-3 sm:gap-4 max-w-4xl">
          <span className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-primary">
            <span className="w-8 sm:w-12 h-[2px] bg-primary" /> {location.zone} · Gujarat
          </span>
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-heading font-bold text-on-surface leading-tight tracking-tight">{heading}</h1>
          <p className="text-base sm:text-lg md:text-xl text-main-text font-medium max-w-2xl leading-relaxed">Looking for a digital marketing agency in {location.name}? {location.note} InfronixWeb helps businesses here build a clear website, appear on Google and run advertising tied to real enquiries.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-2 w-full sm:w-auto">
          <Link href="/start-project" className="inline-flex items-center justify-center bg-primary text-white font-semibold text-sm sm:text-base md:text-lg px-7 py-3.5 sm:px-8 sm:py-4 rounded-xl hover:bg-primary-dark transition-colors">Discuss your project</Link>
        </div>
      </div>
    </section>

    <section className="py-12 sm:py-16 bg-surface">
      <div className="max-w-[900px] mx-auto px-4 sm:px-6 md:px-8">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-on-surface mb-5 leading-tight">What matters for local businesses</h2>
        <p className="leading-relaxed mb-4">{localAngle}</p>
        <p className="leading-relaxed">{profile.challenge}</p>
      </div>
    </section>

    <section className="py-12 sm:py-16 bg-surface-container-lowest">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 md:px-12">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-on-surface mb-8 leading-tight">Who we can help</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {focus.map(item => <article key={item.label} className="bg-surface border border-outline-variant/60 rounded-2xl p-6 sm:p-8">
            <h3 className="text-lg sm:text-xl font-heading font-bold text-on-surface mb-3">{item.label}</h3>
            <p className="leading-relaxed mb-4">{item.why}</p>
            <ul className="list-disc pl-5 space-y-2 text-main-text">{item.steps.map(step => <li key={step} className="leading-relaxed">{step}</li>)}</ul>
          </article>)}
        </div>
      </div>
    </section>

    <section className="py-12 sm:py-16 bg-surface">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 md:px-12">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-on-surface mb-6 leading-tight">What this could look like</h2>
        <div className="max-w-3xl space-y-4 leading-relaxed">{focus.slice(0, 2).map(item => <p key={item.label}>Illustrative scope: {item.example.charAt(0).toLowerCase() + item.example.slice(1)}</p>)}</div>
        <ul className="mt-6 flex flex-wrap gap-x-8 gap-y-4">{profile.links.map(([href, text]) => <li key={href}><Link href={href} className="text-primary underline underline-offset-4">{text}</Link></li>)}</ul>
      </div>
    </section>

    <section className="py-12 sm:py-16 bg-surface-container-lowest">
      <div className="max-w-[900px] mx-auto px-4 sm:px-6 md:px-8">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-on-surface mb-6 leading-tight">Common questions</h2>
        {faqs.map(([question, answer]) => <details key={question} className="border-b border-outline-variant py-4"><summary className="cursor-pointer text-lg font-heading font-bold py-2 text-on-surface">{question}</summary><p className="leading-relaxed pt-3 pb-2">{answer}</p></details>)}
      </div>
    </section>

    <section className="py-12 sm:py-16 bg-surface border-t border-outline-variant/40">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 md:px-12">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-on-surface mb-4 leading-tight">Nearby areas we serve</h2>
        <nav aria-label="Nearby areas" className="flex flex-wrap gap-3 mt-6">
          {nearby.map(item => <Link key={item.slug} href={`/digital-marketing-agency/${item.slug}`} className="inline-flex items-center min-h-11 px-4 py-2 border border-outline-variant rounded-xl text-primary hover:bg-soft-violet">{item.name}</Link>)}
          <Link href="/digital-marketing-agency/sanand" className="inline-flex items-center min-h-11 px-4 py-2 border border-outline-variant rounded-xl text-primary hover:bg-soft-violet">Sanand</Link>
          <Link href="/digital-marketing-agency" className="inline-flex items-center min-h-11 px-4 py-2 border border-outline-variant rounded-xl text-primary hover:bg-soft-violet">All areas</Link>
        </nav>
      </div>
    </section>
  </main>;
}
