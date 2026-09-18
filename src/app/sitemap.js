import { query, initFounderOSDb } from '@/lib/founder_os_db';

export const dynamic = 'force-dynamic';

const BASE_URL = 'https://www.infronixweb.in';

const STATIC_ROUTES = [
  { url: `${BASE_URL}/`, lastModified: new Date('2026-09-01'), changeFrequency: 'weekly', priority: 1.0 },
  { url: `${BASE_URL}/web-development`, lastModified: new Date('2026-09-01'), changeFrequency: 'weekly', priority: 0.9 },
  { url: `${BASE_URL}/seo`, lastModified: new Date('2026-09-01'), changeFrequency: 'weekly', priority: 0.9 },
  { url: `${BASE_URL}/ai-automation`, lastModified: new Date('2026-09-01'), changeFrequency: 'weekly', priority: 0.9 },
  { url: `${BASE_URL}/digital-marketing`, lastModified: new Date('2026-09-13'), changeFrequency: 'weekly', priority: 0.9 },
  { url: `${BASE_URL}/digital-marketing/social-media-marketing`, lastModified: new Date('2026-09-13'), changeFrequency: 'weekly', priority: 0.8 },
  { url: `${BASE_URL}/digital-marketing/paid-advertising`, lastModified: new Date('2026-09-13'), changeFrequency: 'weekly', priority: 0.8 },
  { url: `${BASE_URL}/projects`, lastModified: new Date('2026-09-01'), changeFrequency: 'monthly', priority: 0.8 },
  { url: `${BASE_URL}/about`, lastModified: new Date('2026-09-18'), changeFrequency: 'monthly', priority: 0.8 },
  { url: `${BASE_URL}/contact`, lastModified: new Date('2026-09-01'), changeFrequency: 'monthly', priority: 0.8 },
  { url: `${BASE_URL}/blog`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
  { url: `${BASE_URL}/start-project`, lastModified: new Date('2026-09-01'), changeFrequency: 'monthly', priority: 0.7 },
  { url: `${BASE_URL}/privacy-policy`, lastModified: new Date('2026-08-29'), changeFrequency: 'yearly', priority: 0.5 },
  { url: `${BASE_URL}/terms-and-conditions`, lastModified: new Date('2026-08-29'), changeFrequency: 'yearly', priority: 0.5 }
];

export default async function sitemap() {
  try {
    await initFounderOSDb();
    const res = await query(`
      SELECT slug, updated_at, published_at, created_at 
      FROM founder_os_blogs 
      WHERE status = 'Published' 
        OR (status = 'Scheduled' AND scheduled_for <= NOW())
      ORDER BY COALESCE(published_at, created_at) DESC
    `);

    const blogEntries = res.rows.map((post) => ({
      url: `${BASE_URL}/blog/${post.slug}`,
      lastModified: new Date(post.updated_at || post.published_at || post.created_at),
      changeFrequency: 'weekly',
      priority: 0.8
    }));

    return [...STATIC_ROUTES, ...blogEntries];
  } catch (err) {
    console.error('Dynamic sitemap generation error:', err.message);
    return STATIC_ROUTES;
  }
}
