import { query } from './founder_os_db.js';
import { services } from './services.js';
import { SITE_URL } from './site-seo.js';

export const STATIC_PAGES = [
  '',
  '/services',
  ...services.map(service => '/' + service.slug),
  '/projects',
  '/about',
  '/contact',
  '/blog',
  '/start-project',
  '/privacy-policy',
  '/terms-and-conditions'
];

export async function getDynamicSitemapEntries() {
  const staticEntries = STATIC_PAGES.map(path => {
    let priority = 0.8;
    let changeFrequency = 'weekly';

    if (path === '') {
      priority = 1.0;
      changeFrequency = 'daily';
    } else if (path === '/blog') {
      priority = 0.9;
      changeFrequency = 'daily';
    } else if (path === '/services' || services.some(s => '/' + s.slug === path)) {
      priority = 0.9;
      changeFrequency = 'weekly';
    } else if (path === '/privacy-policy' || path === '/terms-and-conditions') {
      priority = 0.5;
      changeFrequency = 'yearly';
    }

    return {
      url: SITE_URL + path,
      lastModified: new Date(),
      changeFrequency,
      priority
    };
  });

  try {
    const res = await query(`
      SELECT slug, COALESCE(updated_at, published_at, scheduled_for, created_at) AS last_modified
      FROM founder_os_blogs 
      WHERE status = 'Published' OR (status = 'Scheduled' AND scheduled_for <= NOW())
      ORDER BY COALESCE(published_at, created_at) DESC
    `);

    const blogEntries = (res.rows || []).map(post => ({
      url: SITE_URL + '/blog/' + encodeURIComponent(post.slug),
      lastModified: post.last_modified ? new Date(post.last_modified) : new Date(),
      changeFrequency: 'weekly',
      priority: 0.8
    }));

    return [...staticEntries, ...blogEntries];
  } catch (error) {
    console.error('Sitemap article lookup failed:', error.message);
    return staticEntries;
  }
}
