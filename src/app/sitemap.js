import { getDynamicSitemapEntries } from '@/lib/sitemap_generator';

// Include CMS publications without requiring a separate manual file rebuild.
export const revalidate = 300;
export default async function sitemap() {
  return getDynamicSitemapEntries();
}
