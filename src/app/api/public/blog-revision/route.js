import { NextResponse } from 'next/server';
import { query } from '@/lib/founder_os_db';
import { getPublicEditorialGuide } from '@/lib/editorial-guide-author';
import { blogRevision } from '@/lib/blog-revision';

export const dynamic = 'force-dynamic';
export async function GET(request) {
  const slug = new URL(request.url).searchParams.get('slug')?.trim().toLowerCase();
  if (!slug || slug.length > 255) return NextResponse.json({ success: false }, { status: 400 });
  try {
    const { rows } = await query(`SELECT b.updated_at, b.published_at, c.name AS category_name, c.slug AS category_slug,
      COALESCE(json_agg(json_build_object('name', t.name, 'slug', t.slug)) FILTER (WHERE t.id IS NOT NULL), '[]') AS tags
      FROM founder_os_blogs b LEFT JOIN founder_os_blog_categories c ON c.id = b.category_id
      LEFT JOIN founder_os_blog_posts_tags pt ON pt.post_id = b.id LEFT JOIN founder_os_blog_tags t ON t.id = pt.tag_id
      WHERE LOWER(b.slug) = $1 AND (b.status = 'Published' OR (b.status = 'Scheduled' AND b.scheduled_for <= NOW()))
      GROUP BY b.id, c.name, c.slug`, [slug]);
    return NextResponse.json({ success: true, revision: blogRevision(rows[0] || await getPublicEditorialGuide(slug)) }, {
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch (error) {
    console.error('Blog revision lookup failed:', error.message);
    return NextResponse.json({ success: false }, { status: 503 });
  }
}
