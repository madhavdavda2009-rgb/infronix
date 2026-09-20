import fs from 'node:fs/promises';
import path from 'node:path';
import { query, initFounderOSDb } from './founder_os_db.js';

const BASE_URL = 'https://www.infronixweb.in';

export const STATIC_PAGES = [
  { path: '', changefreq: 'weekly', priority: '1.0' },
  { path: '/web-development', changefreq: 'weekly', priority: '0.9' },
  { path: '/seo', changefreq: 'weekly', priority: '0.9' },
  { path: '/ai-automation', changefreq: 'weekly', priority: '0.9' },
  { path: '/digital-marketing', changefreq: 'weekly', priority: '0.9' },
  { path: '/digital-marketing/social-media-marketing', changefreq: 'weekly', priority: '0.8' },
  { path: '/digital-marketing/paid-advertising', changefreq: 'weekly', priority: '0.8' },
  { path: '/projects', changefreq: 'monthly', priority: '0.8' },
  { path: '/about', changefreq: 'monthly', priority: '0.8' },
  { path: '/contact', changefreq: 'monthly', priority: '0.8' },
  { path: '/blog', changefreq: 'daily', priority: '0.9' },
  { path: '/start-project', changefreq: 'monthly', priority: '0.7' },
  { path: '/privacy-policy', changefreq: 'yearly', priority: '0.5' },
  { path: '/terms-and-conditions', changefreq: 'yearly', priority: '0.5' }
];

/**
 * Returns formatted sitemap entries for Next.js App Router sitemap.js
 */
export async function getDynamicSitemapEntries() {
  const staticEntries = STATIC_PAGES.map(p => ({
    url: `${BASE_URL}${p.path}`,
    lastModified: new Date(),
    changeFrequency: p.changefreq,
    priority: parseFloat(p.priority)
  }));

  try {
    await initFounderOSDb();
    const res = await query(`
      SELECT slug, COALESCE(updated_at, published_at, NOW()) AS last_modified
      FROM founder_os_blogs
      WHERE status = 'Published' OR (status = 'Scheduled' AND scheduled_for <= NOW())
      ORDER BY COALESCE(published_at, updated_at) DESC
    `);

    const blogEntries = res.rows.map(post => ({
      url: `${BASE_URL}/blog/${post.slug}`,
      lastModified: new Date(post.last_modified),
      changeFrequency: 'weekly',
      priority: 0.8
    }));

    return [...staticEntries, ...blogEntries];
  } catch (err) {
    console.error('getDynamicSitemapEntries error:', err.message);
    return staticEntries;
  }
}

/**
 * Synchronizes public/sitemap.xml on disk automatically whenever
 * articles are published, updated, or deleted via Founder OS admin.
 */
export async function syncPublicSitemapXml() {
  try {
    await initFounderOSDb();
    const res = await query(`
      SELECT slug, COALESCE(updated_at, published_at, NOW()) AS last_modified
      FROM founder_os_blogs
      WHERE status = 'Published' OR (status = 'Scheduled' AND scheduled_for <= NOW())
      ORDER BY COALESCE(published_at, updated_at) DESC
    `);

    const todayIso = new Date().toISOString().split('T')[0];

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    // Static pages
    for (const page of STATIC_PAGES) {
      xml += `  <url>\n`;
      xml += `    <loc>${BASE_URL}${page.path}</loc>\n`;
      xml += `    <lastmod>${todayIso}</lastmod>\n`;
      xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
      xml += `    <priority>${page.priority}</priority>\n`;
      xml += `  </url>\n`;
    }

    // Dynamic Published Blog Articles
    for (const post of res.rows) {
      const postDate = new Date(post.last_modified).toISOString().split('T')[0];
      xml += `  <url>\n`;
      xml += `    <loc>${BASE_URL}/blog/${post.slug}</loc>\n`;
      xml += `    <lastmod>${postDate}</lastmod>\n`;
      xml += `    <changefreq>weekly</changefreq>\n`;
      xml += `    <priority>0.8</priority>\n`;
      xml += `  </url>\n`;
    }

    xml += `</urlset>\n`;

    const publicFilePath = path.join(process.cwd(), 'public', 'sitemap.xml');
    await fs.writeFile(publicFilePath, xml, 'utf8');
    console.log(`✅ Automated sitemap.xml updated with ${STATIC_PAGES.length} static routes and ${res.rows.length} published blog articles.`);
    return true;
  } catch (err) {
    console.error('syncPublicSitemapXml error:', err.message);
    return false;
  }
}
