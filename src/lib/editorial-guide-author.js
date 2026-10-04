import { query } from './founder_os_db.js';
import { publicImageUrl } from './blog-images.js';
import { madhavBlogProfile } from './blog-authors.js';
import { getEditorialGuide } from './editorial-guides.js';
import { publicRole } from './public-copy.js';

export async function getGuideAuthor() {
  try {
    const { rows } = await query(`SELECT id, name, COALESCE(public_role, role) AS role, profile_image_url, updated_at
      FROM founder_os_people WHERE (LOWER(name) = 'madhav davda' OR public_slug = 'madhav-davda')
      AND show_on_website IS TRUE AND is_archived IS NOT TRUE AND (LOWER(status) = 'active' OR status IS NULL)
      ORDER BY is_founder DESC, id ASC LIMIT 1`);
    const person = rows[0];
    if (!person) return null;
    const avatar = publicImageUrl(person.profile_image_url, 'team', person.id) || madhavBlogProfile.author_avatar_url;
    return { author_name: person.name, author_role: publicRole(person.role), author_avatar_url: avatar,
      author_avatar_position: avatar === madhavBlogProfile.author_avatar_url ? madhavBlogProfile.author_avatar_position : 'center',
      author_revision: person.updated_at ? new Date(person.updated_at).toISOString() : '' };
  } catch (error) {
    console.error('Guide author lookup failed:', error.message);
    return null;
  }
}

export async function getPublicEditorialGuide(slug) {
  const guide = getEditorialGuide(slug);
  return guide ? { ...guide, ...await getGuideAuthor() } : null;
}
