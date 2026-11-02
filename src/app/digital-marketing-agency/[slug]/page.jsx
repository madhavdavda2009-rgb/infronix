import { notFound } from 'next/navigation';
import LocationLanding, { locationLabel } from '@/components/LocationLanding';
import { getLocation, locations } from '@/lib/locations';
import { pageMetadata } from '@/lib/site-seo';

export const dynamicParams = false;
export function generateStaticParams() {
  return locations.map(location => ({ slug: location.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const location = getLocation(slug);
  if (!location) return {};
  return pageMetadata(
    `Digital Marketing Agency in ${location.name}`,
    `Digital marketing agency in ${locationLabel(location)}: websites, SEO, Google Ads and social media for local businesses. Get a clear plan and written quote from InfronixWeb.`,
    `/digital-marketing-agency/${slug}`,
  );
}

export default async function Page({ params }) {
  const { slug } = await params;
  const location = getLocation(slug);
  if (!location) notFound();
  return <LocationLanding location={location} />;
}
