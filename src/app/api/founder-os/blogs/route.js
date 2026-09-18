import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { query, initFounderOSDb } from '@/lib/founder_os_db';
import { verifyAdminAuth } from '@/lib/auth';
import { logActivity } from '@/lib/audit_logger';
import { calculateReadingTime } from '@/lib/markdown_parser';

function generateSlug(text) {
  if (!text) return `post-${Date.now()}`;
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '') || `post-${Date.now()}`;
}

const RESERVED_SLUGS = new Set([
  'admin', 'api', 'blog', 'about', 'contact', 'projects', 'services', 'seo',
  'web-development', 'ai-automation', 'digital-marketing', 'start-project',
  'privacy-policy', 'terms-and-conditions', 'founder-os', 'preview', 'new', 'edit'
]);

export async function GET(request) {
  const auth = verifyAdminAuth(request);
  if (!auth) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await initFounderOSDb();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'ALL';
    const categoryId = searchParams.get('category_id');
    const search = searchParams.get('search');

    let sql = `
      SELECT 
        b.id,
        b.title,
        b.slug,
        b.excerpt,
        b.cover_image_url,
        b.cover_image_alt,
        b.author_person_id,
        b.author_name,
        b.author_role,
        b.author_avatar_url,
        b.category_id,
        c.name AS category_name,
        c.slug AS category_slug,
        b.status,
        b.featured,
        b.published_at,
        b.scheduled_for,
        b.reading_time_minutes,
        b.seo_title,
        b.seo_description,
        b.canonical_url,
        b.og_image_url,
        b.created_by,
        b.updated_by,
        b.created_at,
        b.updated_at,
        b.archived_at,
        COALESCE(
          json_agg(json_build_object('id', t.id, 'name', t.name, 'slug', t.slug)) 
          FILTER (WHERE t.id IS NOT NULL), '[]'
        ) AS tags
      FROM founder_os_blogs b
      LEFT JOIN founder_os_blog_categories c ON c.id = b.category_id
      LEFT JOIN founder_os_blog_posts_tags pt ON pt.post_id = b.id
      LEFT JOIN founder_os_blog_tags t ON t.id = pt.tag_id
      WHERE 1=1
    `;

    const params = [];

    if (status !== 'ALL') {
      params.push(status);
      sql += ` AND b.status = $${params.length}`;
    }

    if (categoryId) {
      params.push(parseInt(categoryId, 10));
      sql += ` AND b.category_id = $${params.length}`;
    }

    if (search && search.trim()) {
      params.push(`%${search.trim().toLowerCase()}%`);
      sql += ` AND (LOWER(b.title) LIKE $${params.length} OR LOWER(b.slug) LIKE $${params.length} OR LOWER(b.excerpt) LIKE $${params.length})`;
    }

    sql += `
      GROUP BY b.id, c.name, c.slug
      ORDER BY 
        CASE 
          WHEN b.status = 'Published' THEN 1 
          WHEN b.status = 'Draft' THEN 2 
          WHEN b.status = 'Scheduled' THEN 3 
          ELSE 4 
        END,
        COALESCE(b.published_at, b.updated_at) DESC
    `;

    const postsRes = await query(sql, params);

    // Fetch counts summary
    const countsRes = await query(`
      SELECT 
        COUNT(*)::int AS total,
        COUNT(*) FILTER (WHERE status = 'Draft')::int AS drafts,
        COUNT(*) FILTER (WHERE status = 'Published')::int AS published,
        COUNT(*) FILTER (WHERE status = 'Scheduled')::int AS scheduled,
        COUNT(*) FILTER (WHERE status = 'Archived')::int AS archived
      FROM founder_os_blogs
    `);

    // Fetch categories and tags lookups
    const [catsRes, tagsRes, peopleRes] = await Promise.all([
      query('SELECT * FROM founder_os_blog_categories ORDER BY display_order ASC, name ASC'),
      query('SELECT * FROM founder_os_blog_tags ORDER BY name ASC'),
      query("SELECT id, name, role, public_role, profile_image_url, is_founder, employment_type FROM founder_os_people WHERE status = 'Active' ORDER BY is_founder DESC, name ASC")
    ]);

    return NextResponse.json({
      success: true,
      posts: postsRes.rows,
      counts: countsRes.rows[0] || { total: 0, drafts: 0, published: 0, scheduled: 0, archived: 0 },
      categories: catsRes.rows,
      tags: tagsRes.rows,
      authors: peopleRes.rows
    });
  } catch (err) {
    console.error('Blogs GET error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  const auth = verifyAdminAuth(request);
  if (!auth) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await initFounderOSDb();
    const body = await request.json();
    const {
      title,
      slug,
      excerpt,
      content_markdown,
      cover_image_url,
      cover_image_alt,
      author_person_id,
      author_name,
      author_role,
      author_avatar_url,
      category_id,
      tag_ids,
      status = 'Draft',
      featured = false,
      scheduled_for,
      seo_title,
      seo_description,
      canonical_url,
      og_image_url
    } = body;

    if (!title || !title.trim()) {
      return NextResponse.json({ success: false, error: 'Article title is required' }, { status: 400 });
    }

    if (!excerpt || !excerpt.trim()) {
      return NextResponse.json({ success: false, error: 'Article excerpt is required' }, { status: 400 });
    }

    let cleanSlug = generateSlug(slug || title);
    if (RESERVED_SLUGS.has(cleanSlug)) {
      return NextResponse.json({ success: false, error: `The slug "${cleanSlug}" is reserved for system routes. Please choose a different slug.` }, { status: 400 });
    }

    // Check slug collision
    const existing = await query('SELECT id FROM founder_os_blogs WHERE slug = $1', [cleanSlug]);
    if (existing.rows.length > 0) {
      return NextResponse.json({ success: false, error: `The slug "${cleanSlug}" already exists. Please customize the slug.` }, { status: 400 });
    }

    // Validate Author Snapshot
    let finalAuthorName = author_name || 'InfronixWeb Editorial Team';
    let finalAuthorRole = author_role || 'Digital Specialists';
    let finalAuthorAvatar = author_avatar_url || null;
    let finalAuthorPersonId = author_person_id ? parseInt(author_person_id, 10) : null;

    if (finalAuthorPersonId) {
      const pRes = await query('SELECT name, role, public_role, profile_image_url FROM founder_os_people WHERE id = $1', [finalAuthorPersonId]);
      if (pRes.rows[0]) {
        const p = pRes.rows[0];
        finalAuthorName = p.name;
        finalAuthorRole = p.public_role || p.role || finalAuthorRole;
        finalAuthorAvatar = p.profile_image_url || finalAuthorAvatar;
      }
    }

    const readingTime = calculateReadingTime(content_markdown || '');
    const isPublished = status === 'Published';
    const publishedAt = isPublished ? new Date().toISOString() : null;

    const res = await query(
      `INSERT INTO founder_os_blogs (
        title, slug, excerpt, content_markdown, cover_image_url, cover_image_alt,
        author_person_id, author_name, author_role, author_avatar_url,
        category_id, status, featured, published_at, scheduled_for, reading_time_minutes,
        seo_title, seo_description, canonical_url, og_image_url,
        created_by, updated_by, created_at, updated_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6,
        $7, $8, $9, $10,
        $11, $12, $13, $14, $15, $16,
        $17, $18, $19, $20,
        $21, $21, NOW(), NOW()
      ) RETURNING *`,
      [
        title.trim(),
        cleanSlug,
        excerpt.trim(),
        content_markdown || '',
        cover_image_url || null,
        cover_image_alt || null,
        finalAuthorPersonId,
        finalAuthorName,
        finalAuthorRole,
        finalAuthorAvatar,
        category_id ? parseInt(category_id, 10) : null,
        status,
        Boolean(featured),
        publishedAt,
        scheduled_for ? new Date(scheduled_for).toISOString() : null,
        readingTime,
        seo_title ? seo_title.trim() : null,
        seo_description ? seo_description.trim() : null,
        canonical_url ? canonical_url.trim() : null,
        og_image_url ? og_image_url.trim() : null,
        auth.username || 'Founder'
      ]
    );

    const post = res.rows[0];

    // Insert Tag relationships
    if (Array.isArray(tag_ids) && tag_ids.length > 0) {
      for (const tagId of tag_ids) {
        await query(
          'INSERT INTO founder_os_blog_posts_tags (post_id, tag_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
          [post.id, parseInt(tagId, 10)]
        );
      }
    }

    await logActivity(
      auth.username,
      'BlogPost',
      post.id,
      isPublished ? 'Published' : 'Created',
      `${isPublished ? 'Published article' : 'Created draft'}: "${post.title}" (/blog/${post.slug})`
    );

    if (isPublished) {
      try {
        revalidatePath('/blog');
        revalidatePath(`/blog/${post.slug}`);
        revalidatePath('/sitemap.xml');
      } catch (e) {
        console.warn('Revalidation note:', e.message);
      }
    }

    return NextResponse.json({ success: true, post });
  } catch (err) {
    console.error('Blogs POST error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
