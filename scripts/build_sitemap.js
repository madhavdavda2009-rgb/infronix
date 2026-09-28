import dotenv from 'dotenv';
dotenv.config();

import fs from 'fs';
import { getDynamicSitemapEntries } from '../src/lib/sitemap_generator.js';

async function build() {
  try {
    const entries = await getDynamicSitemapEntries();
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
    for (const e of entries) {
      const dateStr = (new Date(e.lastModified)).toISOString().split('T')[0];
      xml += `  <url>\n    <loc>${e.url}</loc>\n    <lastmod>${dateStr}</lastmod>\n    <changefreq>${e.changeFrequency}</changefreq>\n    <priority>${e.priority}</priority>\n  </url>\n`;
    }
    xml += '</urlset>\n';

    fs.writeFileSync('public/sitemap.xml', xml);
    console.log(`✓ Successfully generated permanent public/sitemap.xml with ${entries.length} URLs.`);
    process.exit(0);
  } catch (err) {
    console.error('Failed to generate sitemap.xml:', err);
    process.exit(1);
  }
}

build();
