// Keep the established canonical host; domain migrations require redirect evidence.
export const SITE_URL = 'https://www.infronixweb.in';
export function pageMetadata(title, description, path = '/') {
  const brandedTitle = `${title} | InfronixWeb`;
  return {
    title: { absolute: brandedTitle },
    description,
    alternates: { canonical: `${SITE_URL}${path}` },
    openGraph: { title: brandedTitle, description, url: `${SITE_URL}${path}`, siteName: 'InfronixWeb', locale: 'en_IN', type: 'website', images: [`${SITE_URL}/opengraph-image.webp`] },
    twitter: { card: 'summary_large_image', title: brandedTitle, description, images: [`${SITE_URL}/opengraph-image.webp`] },
  };
}
export function serializeJsonLd(value) {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}
