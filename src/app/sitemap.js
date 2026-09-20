import { getDynamicSitemapEntries } from '@/lib/sitemap_generator';

export const revalidate = 60; // Revalidate every 60 seconds

export default async function sitemap() {
  return await getDynamicSitemapEntries();
}
