import { NextResponse } from 'next/server';
import { query, initFounderOSDb } from '@/lib/founder_os_db';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    await initFounderOSDb();
    const { searchParams } = new URL(request.url);
    const categorySlug = searchParams.get('category');
    const tagSlug = searchParams.get('tag');
    const search = searchParams.get('search');
    const featured = searchParams.get('featured');

    // Only Published posts OR Scheduled posts whose time has arrived (scheduled_for <= NOW())
    let sql = `
      SELECT 
        b.id,
        b.title,
        b.slug,
        b.excerpt,
        b.cover_image_url,
        b.cover_image_alt,
        b.author_name,
        b.author_role,
        b.author_avatar_url,
        b.category_id,
        c.name AS category_name,
        c.slug AS category_slug,
        b.featured,
        COALESCE(b.published_at, b.created_at) AS published_at,
        b.reading_time_minutes,
        b.seo_title,
        b.seo_description,
        b.canonical_url,
        b.og_image_url,
        COALESCE(
          json_agg(json_build_object('name', t.name, 'slug', t.slug)) 
          FILTER (WHERE t.id IS NOT NULL), '[]'
        ) AS tags
      FROM founder_os_blogs b
      LEFT JOIN founder_os_blog_categories c ON c.id = b.category_id
      LEFT JOIN founder_os_blog_posts_tags pt ON pt.post_id = b.id
      LEFT JOIN founder_os_blog_tags t ON t.id = pt.tag_id
      WHERE (
        b.status = 'Published' 
        OR (b.status = 'Scheduled' AND b.scheduled_for <= NOW())
      )
    `;

    const params = [];

    if (categorySlug && categorySlug !== 'all') {
      params.push(categorySlug.toLowerCase().trim());
      sql += ` AND LOWER(c.slug) = $${params.length}`;
    }

    if (tagSlug && tagSlug !== 'all') {
      params.push(tagSlug.toLowerCase().trim());
      sql += ` AND EXISTS (
        SELECT 1 FROM founder_os_blog_posts_tags pt2 
        JOIN founder_os_blog_tags t2 ON t2.id = pt2.tag_id 
        WHERE pt2.post_id = b.id AND LOWER(t2.slug) = $${params.length}
      )`;
    }

    if (featured === 'true') {
      sql += ' AND b.featured = TRUE';
    }

    if (search && search.trim()) {
      params.push(`%${search.trim().toLowerCase()}%`);
      sql += ` AND (
        LOWER(b.title) LIKE $${params.length} 
        OR LOWER(b.excerpt) LIKE $${params.length}
        OR LOWER(b.content_markdown) LIKE $${params.length}
      )`;
    }

    sql += `
      GROUP BY b.id, c.name, c.slug
      ORDER BY 
        b.featured DESC,
        COALESCE(b.published_at, b.created_at) DESC
    `;

    const postsRes = await query(sql, params);

    // Fetch categories and tags for filtering
    const [catsRes, tagsRes] = await Promise.all([
      query(`
        SELECT c.id, c.name, c.slug, c.description, COUNT(b.id)::int AS post_count
        FROM founder_os_blog_categories c
        JOIN founder_os_blogs b ON b.category_id = c.id
        WHERE (b.status = 'Published' OR (b.status = 'Scheduled' AND b.scheduled_for <= NOW()))
        GROUP BY c.id
        ORDER BY c.display_order ASC, c.name ASC
      `),
      query(`
        SELECT t.id, t.name, t.slug, COUNT(pt.post_id)::int AS post_count
        FROM founder_os_blog_tags t
        JOIN founder_os_blog_posts_tags pt ON pt.tag_id = t.id
        JOIN founder_os_blogs b ON b.id = pt.post_id
        WHERE (b.status = 'Published' OR (b.status = 'Scheduled' AND b.scheduled_for <= NOW()))
        GROUP BY t.id
        ORDER BY t.name ASC
      `)
    ]);

    return NextResponse.json(
      {
        success: true,
        posts: postsRes.rows,
        categories: catsRes.rows,
        tags: tagsRes.rows
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300'
        }
      }
    );
  } catch (err) {
    console.error('Public blogs API error:', err);
    return NextResponse.json({ success: false, error: 'Failed to load blog posts' }, { status: 500 });
  }
}
