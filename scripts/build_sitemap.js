import dotenv from 'dotenv';
dotenv.config();

import { getDynamicSitemapEntries } from '../src/lib/sitemap_generator.js';

async function build() {
  try {
    const entries = await getDynamicSitemapEntries();
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
    for (const e of entries) {
      const lastmod = e.lastModified ? `    <lastmod>${new Date(e.lastModified).toISOString()}</lastmod>\n` : '';
      xml += `  <url>\n    <loc>${e.url}</loc>\n${lastmod}  </url>\n`;
    }
    xml += '</urlset>\n';

    // Print a diagnostic snapshot; the production sitemap is src/app/sitemap.js.
    console.log(xml);
    process.exit(0);
  } catch (err) {
    console.error('Failed to generate sitemap.xml:', err);
    process.exit(1);
  }
}

build();
