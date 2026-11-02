import Link from 'next/link';
import Breadcrumb from '@/components/Breadcrumb';
import { locationGroups } from '@/lib/locations';
import { pageMetadata } from '@/lib/site-seo';

export const metadata = pageMetadata(
  'Digital Marketing Agency in Ahmedabad & Gujarat',
  'InfronixWeb provides website development, SEO and digital marketing across Ahmedabad and Gujarat from our office in Sanand. Find your area.',
  '/digital-marketing-agency',
);

export default function LocationsPage() {
  return <main id="main-content" className="w-full pt-20 sm:pt-28 md:pt-32">
    <section className="bg-surface-container-lowest py-12 sm:py-20 border-b border-outline-variant/30">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 md:px-12">
        <Breadcrumb />
        <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-heading font-bold text-on-surface leading-tight tracking-tight max-w-4xl">Digital Marketing Agency in Ahmedabad and Gujarat</h1>
        <p className="text-base sm:text-lg md:text-xl text-main-text font-medium max-w-2xl leading-relaxed mt-5">InfronixWeb is a digital marketing agency in Ahmedabad and Gujarat, working from our office in Sanand. Find your area below.</p>
        <Link href="/digital-marketing-agency/sanand" className="inline-flex mt-6 min-h-11 items-center text-primary underline underline-offset-4">Our Sanand office area</Link>
      </div>
    </section>
    {locationGroups.map(({ zone, items }) => <section key={zone} className="py-10 sm:py-14 bg-surface border-b border-outline-variant/30">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 md:px-12">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold text-on-surface mb-6">{zone}</h2>
        <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-x-6 gap-y-3">
          {items.map(item => <li key={item.slug}><Link href={`/digital-marketing-agency/${item.slug}`} className="text-main-text hover:text-primary transition-colors">{item.name}</Link></li>)}
        </ul>
      </div>
    </section>)}
  </main>;
}
