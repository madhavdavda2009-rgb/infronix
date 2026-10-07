import { query } from './founder_os_db.js';
import { publicImageUrl } from './blog-images.js';

export async function getPublicTeam(page) {
  const pageCondition = page === 'home' ? 'AND show_on_homepage IS TRUE' : page === 'about' ? 'AND show_on_about_page IS TRUE' : '';
  const { rows } = await query(`
    SELECT id, name, COALESCE(public_role, role) AS role, public_role, public_bio,
      profile_image_url, profile_image_crop, public_slug, display_order, linkedin_url, github_url,
      portfolio_url, instagram_url, is_founder, employment_type, show_on_homepage, show_on_about_page
    FROM founder_os_people
    WHERE (LOWER(status) = 'active' OR status IS NULL) AND show_on_website IS TRUE AND is_archived IS NOT TRUE
      ${pageCondition}
    ORDER BY CASE WHEN is_founder IS TRUE OR employment_type = 'Founder' THEN 0 WHEN employment_type = 'Co-Founder' THEN 1 ELSE 2 END,
      display_order ASC, id ASC
  `);
  return rows.map(person => ({ ...person, profile_image_url: publicImageUrl(person.profile_image_url, 'team', person.id) }));
}

export async function getInitialPublicTeam(page) {
  try { return await getPublicTeam(page); }
  catch (error) { console.error('Public team lookup failed:', error.message); return null; }
}
