import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from '@phosphor-icons/react/dist/ssr';
import Breadcrumb from '@/components/Breadcrumb';
import { toyonProject } from '@/lib/projects';
import { pageMetadata, serializeJsonLd, SITE_URL } from '@/lib/site-seo';

const path = `/projects/${toyonProject.slug}`;
const url = `${SITE_URL}${path}`;
const title = 'Toyon Industry Website by InfronixWeb';
const description = 'Explore the Toyon Industry Pvt Ltd website created by InfronixWeb, Ahmedabad: an interactive product catalogue, collection browsing and business enquiries.';
const baseMetadata = pageMetadata(title, description, path);

export const metadata = {
  ...baseMetadata,
  title: { absolute: title },
  openGraph: { ...baseMetadata.openGraph, title, images: [{ url: `${SITE_URL}${toyonProject.image}`, width: 1200, height: 630, alt: toyonProject.imageAlt }] },
  twitter: { ...baseMetadata.twitter, title, images: [`${SITE_URL}${toyonProject.image}`] },
};

const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage', '@id': `${url}#webpage`, url, name: title, description,
      isPartOf: { '@id': `${SITE_URL}/#website` },
      mainEntity: { '@id': `${url}#project` },
    },
    {
      '@type': 'WebSite', '@id': `${url}#project`, name: 'Toy-On website',
      url: toyonProject.liveUrl, description: toyonProject.desc,
      creator: { '@id': `${SITE_URL}/#organization` },
      publisher: { '@id': `${url}#client` },
      about: { '@id': `${url}#client` },
      image: `${SITE_URL}${toyonProject.image}`,
    },
    {
      '@type': 'Organization', '@id': `${url}#client`,
      name: toyonProject.title, alternateName: 'Toy-On', url: toyonProject.liveUrl,
    },
  ],
};

export default function ToyonIndustryProjectPage() {
  return (
    <main id="main-content" className="bg-surface-container-lowest pt-28 sm:pt-32 md:pt-40 pb-16 sm:pb-24">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(schema) }} />
      <article className="max-w-[1280px] mx-auto px-4 sm:px-6 md:px-12">
        <Breadcrumb />
        <header className="grid lg:grid-cols-[minmax(0,1.7fr)_minmax(240px,1fr)] gap-8 lg:gap-16 pt-5 sm:pt-8 pb-9 sm:pb-14">
          <div>
            <h1 className="font-heading font-bold text-on-surface text-4xl sm:text-5xl lg:text-6xl leading-[1.12] tracking-[-0.025em] text-balance">
              Toyon Industry website <span className="block mt-2">by InfronixWeb.</span>
            </h1>
            <p className="text-main-text text-base sm:text-lg leading-relaxed max-w-[65ch] mt-6">
              A product website for Toyon Industry Pvt Ltd in Ahmedabad. InfronixWeb created the website to bring the Toy-On foil balloon collection online and give business buyers a clear way to explore designs and enquire.
            </p>
            <a href={toyonProject.liveUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center gap-3 bg-primary text-white px-5 py-3 rounded-xl font-semibold mt-7 hover:opacity-85 transition-opacity focus-visible:outline-primary focus-visible:outline-offset-4">
              Visit Toyon Industry <ArrowUpRight size={20} aria-hidden="true" />
            </a>
          </div>
          <dl className="self-end divide-y divide-outline/40 border-y border-outline/40 text-sm sm:text-base">
            {[
              ['Client', toyonProject.title],
              ['Website created by', 'InfronixWeb'],
              ['Project', 'Website design and development'],
              ['Location', 'Ahmedabad, Gujarat'],
            ].map(([label, value]) => (
              <div key={label} className="py-4">
                <dt className="text-main-text mb-1">{label}</dt>
                <dd className="text-on-surface font-semibold">{value}</dd>
              </div>
            ))}
          </dl>
        </header>

        <figure>
          <a href={`${toyonProject.liveUrl}products`} target="_blank" rel="noopener noreferrer" aria-label="Explore the live Toy-On product catalogue (opens in a new tab)" className="block overflow-hidden rounded-2xl border border-outline/40 focus-visible:outline-primary focus-visible:outline-offset-4">
            <Image src={toyonProject.image} alt={toyonProject.imageAlt} width={1200} height={630} sizes="(max-width: 1280px) 100vw, 1184px" className="w-full h-auto" />
          </a>
          <figcaption className="text-main-text text-sm leading-relaxed mt-3">A view of the live Toy-On product catalogue. The preview opens the actual website.</figcaption>
        </figure>

        <div className="grid lg:grid-cols-[minmax(0,1.6fr)_minmax(240px,1fr)] gap-10 lg:gap-20 mt-12 sm:mt-16">
          <div className="space-y-10 sm:space-y-12 text-main-text leading-relaxed text-base sm:text-lg">
            <section aria-labelledby="project-brief">
              <h2 id="project-brief" className="text-on-surface font-heading font-bold text-2xl sm:text-3xl mb-4">A website built around the collection</h2>
              <p>Toyon Industry presents foil balloon designs for manufacturers and business buyers. The website brings 96 designs into 10 collections, so visitors can browse by theme or search for a particular design.</p>
              <p className="mt-4">Each design has its own page with a product visual and a route to a business enquiry. The website also includes company information, a manufacturing overview and contact details, giving buyers useful context alongside the catalogue.</p>
            </section>
            <section aria-labelledby="our-work">
              <h2 id="our-work" className="text-on-surface font-heading font-bold text-2xl sm:text-3xl mb-4">What InfronixWeb created</h2>
              <ul className="list-disc pl-5 space-y-3">
                <li>A branded opening and interactive journey through the product collections.</li>
                <li>A searchable catalogue, collection pages and individual product pages.</li>
                <li>Layouts for browsing on phones and larger screens.</li>
                <li>A contact flow that prepares an enquiry copy for the visitor to review and send.</li>
              </ul>
            </section>
            <section aria-labelledby="website-creator">
              <h2 id="website-creator" className="text-on-surface font-heading font-bold text-2xl sm:text-3xl mb-4">Who created the Toyon Industry website?</h2>
              <p>InfronixWeb created the website for Toyon Industry Pvt Ltd. The live Toy-On website also names InfronixWeb in its footer. Toyon Industry is the client business; InfronixWeb is the agency behind the website.</p>
              <p className="mt-4">Explore the finished work on <a href={toyonProject.liveUrl} target="_blank" rel="noopener noreferrer" className="font-semibold text-on-surface underline underline-offset-4">toyonindustry.com</a>, or learn about our <Link href="/web-development" className="font-semibold text-on-surface underline underline-offset-4">website development service in Ahmedabad</Link>.</p>
            </section>
          </div>
          <aside className="lg:self-start border-t border-outline/40 pt-6">
            <h2 className="font-heading font-bold text-on-surface text-2xl mb-3">Explore the live work</h2>
            <p className="text-main-text leading-relaxed mb-5">See the product browsing and enquiry flow on Toyon Industry&apos;s own website.</p>
            <ul className="space-y-1">
              {[
                ['products', 'Browse the product catalogue'],
                ['categories', 'Explore the collections'],
                ['contact', 'View the business enquiry page'],
              ].map(([route, label]) => <li key={route}><a href={`${toyonProject.liveUrl}${route}`} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 text-on-surface font-semibold hover:underline underline-offset-4">{label}<ArrowUpRight size={16} aria-hidden="true" /></a></li>)}
            </ul>
          </aside>
        </div>
        <section className="mt-14 sm:mt-20 pt-8 sm:pt-12 border-t border-outline/40">
          <h2 className="font-heading font-bold text-on-surface text-2xl sm:text-4xl mb-4">A product website for your business?</h2>
          <p className="text-main-text leading-relaxed max-w-[65ch]">Tell us about your range, your customers and the information they need. We can plan the website around how they browse and enquire.</p>
          <Link href="/start-project?service=web-development" className="inline-flex min-h-12 items-center gap-3 font-semibold text-on-surface underline underline-offset-4 mt-5">Discuss your website <ArrowUpRight size={18} aria-hidden="true" /></Link>
        </section>
      </article>
    </main>
  );
}
