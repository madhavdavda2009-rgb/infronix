import { query, initFounderOSDb } from './founder_os_db.js';

// Client reviews and homepage trust signals, all entered by the founder in Founder OS.
// Nothing here is invented: sections stay hidden until real data exists.

export const REVIEW_SOURCES = ['Google', 'WhatsApp', 'Email', 'LinkedIn', 'GoodFirms', 'Clutch', 'DesignRush', 'Direct'];

const TRUST_KEY = 'website_trust';
const DEFAULT_TRUST = { stats: [], badges: [], show_rating_strip: true };

let ensured = Boolean(globalThis._website_trust_ready);

export async function initWebsiteTrustDb() {
  await initFounderOSDb();
  if (ensured) return;
  await query(`
    CREATE TABLE IF NOT EXISTS founder_os_reviews (
      id SERIAL PRIMARY KEY,
      reviewer_name VARCHAR(150) NOT NULL,
      reviewer_role VARCHAR(150),
      business_name VARCHAR(150),
      rating SMALLINT NOT NULL DEFAULT 5 CHECK (rating BETWEEN 1 AND 5),
      review_text TEXT NOT NULL,
      source VARCHAR(50) NOT NULL DEFAULT 'Google',
      source_url TEXT,
      review_date DATE,
      is_published BOOLEAN NOT NULL DEFAULT TRUE,
      is_featured BOOLEAN NOT NULL DEFAULT FALSE,
      display_order INTEGER NOT NULL DEFAULT 0,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
    CREATE INDEX IF NOT EXISTS idx_reviews_published ON founder_os_reviews(is_published, display_order);
  `);
  ensured = true;
  globalThis._website_trust_ready = true;
}

function clean(value, max) {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

export function sanitizeReview(input = {}) {
  const rating = Math.round(Number(input.rating));
  const sourceUrl = clean(input.source_url, 500);
  return {
    reviewer_name: clean(input.reviewer_name, 150),
    reviewer_role: clean(input.reviewer_role, 150),
    business_name: clean(input.business_name, 150),
    rating: rating >= 1 && rating <= 5 ? rating : 5,
    review_text: clean(input.review_text, 3000),
    source: REVIEW_SOURCES.includes(input.source) ? input.source : 'Direct',
    source_url: /^https:\/\//i.test(sourceUrl) ? sourceUrl : '',
    review_date: /^\d{4}-\d{2}-\d{2}$/.test(String(input.review_date || '')) ? input.review_date : null,
    is_published: input.is_published !== false,
    is_featured: Boolean(input.is_featured),
    display_order: Number.isFinite(Number(input.display_order)) ? Math.round(Number(input.display_order)) : 0,
  };
}

export function sanitizeTrust(input = {}) {
  const stats = (Array.isArray(input.stats) ? input.stats : [])
    .map(s => ({ value: clean(s?.value, 20), label: clean(s?.label, 60) }))
    .filter(s => s.value && s.label)
    .slice(0, 4);
  const badges = (Array.isArray(input.badges) ? input.badges : [])
    .map(b => ({ title: clean(b?.title, 60), description: clean(b?.description, 160) }))
    .filter(b => b.title)
    .slice(0, 4);
  return { stats, badges, show_rating_strip: input.show_rating_strip !== false };
}

export async function getTrustSettings() {
  await initWebsiteTrustDb();
  const res = await query('SELECT value FROM founder_os_settings WHERE key = $1', [TRUST_KEY]);
  if (!res.rows.length) return { ...DEFAULT_TRUST };
  try {
    return { ...DEFAULT_TRUST, ...sanitizeTrust(JSON.parse(res.rows[0].value)) };
  } catch {
    return { ...DEFAULT_TRUST };
  }
}

export async function saveTrustSettings(input) {
  await initWebsiteTrustDb();
  const trust = sanitizeTrust(input);
  await query(`
    INSERT INTO founder_os_settings (key, value, updated_at) VALUES ($1, $2, NOW())
    ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()
  `, [TRUST_KEY, JSON.stringify(trust)]);
  return trust;
}

/** Everything the homepage needs; never throws so the page always renders. */
export async function getPublicTrust() {
  try {
    await initWebsiteTrustDb();
    const [reviewsRes, statsRes, trust] = await Promise.all([
      query(`
        SELECT id, reviewer_name, reviewer_role, business_name, rating, review_text, source, source_url, review_date
        FROM founder_os_reviews
        WHERE is_published IS TRUE
        ORDER BY is_featured DESC, display_order ASC, review_date DESC NULLS LAST, id DESC
        LIMIT 24
      `),
      query(`
        SELECT COUNT(*)::int AS count, COALESCE(ROUND(AVG(rating)::numeric, 1), 0)::float AS average,
               COALESCE(ARRAY_AGG(DISTINCT source) FILTER (WHERE source IS NOT NULL), '{}') AS sources
        FROM founder_os_reviews WHERE is_published IS TRUE
      `),
      getTrustSettings(),
    ]);
    const { count, average, sources } = statsRes.rows[0];
    return { reviews: reviewsRes.rows, rating: { average, count, sources }, ...trust };
  } catch (error) {
    console.error('Public trust lookup failed:', error.message);
    return { reviews: [], rating: { average: 0, count: 0, sources: [] }, ...DEFAULT_TRUST };
  }
}
