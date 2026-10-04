import { createHash } from 'node:crypto';
import { query } from '@/lib/founder_os_db';

export const dynamic = 'force-dynamic';

const blogColumns = { 'blog-cover': 'cover_image_url', 'blog-og': 'og_image_url', 'blog-avatar': 'author_avatar_url' };
export async function GET(request) {
  const params = new URL(request.url).searchParams;
  const kind = params.get('type');
  const id = params.get('id');
  if (!/^\d+$/.test(id || '') || !(kind === 'team' || Object.hasOwn(blogColumns, kind))) return new Response(null, { status: 404 });
  try {
    const sql = kind === 'team'
      ? `SELECT profile_image_url AS image FROM founder_os_people WHERE id = $1 AND show_on_website IS TRUE
          AND is_archived IS NOT TRUE AND (LOWER(status) = 'active' OR status IS NULL)`
      : `SELECT ${blogColumns[kind]} AS image FROM founder_os_blogs WHERE id = $1
          AND (status = 'Published' OR (status = 'Scheduled' AND scheduled_for <= NOW()))`;
    const { rows } = await query(sql, [id]);
    const value = rows[0]?.image;
    const match = value?.match(/^data:(image\/(?:webp|png|jpeg|avif|gif));base64,([A-Za-z0-9+/=\s]+)$/);
    if (!match) return new Response(null, { status: 404 });
    const hash = createHash('sha256').update(value).digest('hex').slice(0, 20);
    if (params.get('v') !== hash) return new Response(null, { status: 404 });
    return new Response(Buffer.from(match[2], 'base64'), { headers: {
      'Content-Type': match[1], 'X-Content-Type-Options': 'nosniff',
      'Cache-Control': 'public, max-age=300, must-revalidate',
    } });
  } catch (error) {
    console.error('Public media lookup failed:', error.message);
    return new Response(null, { status: 503, headers: { 'Cache-Control': 'no-store' } });
  }
}
