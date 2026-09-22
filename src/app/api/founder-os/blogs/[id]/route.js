import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { query, initFounderOSDb } from '@/lib/founder_os_db';
import { verifyAdminAuth } from '@/lib/auth';
import { logActivity } from '@/lib/audit_logger';
import { calculateReadingTime } from '@/lib/blog_utils';

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

export async function GET(request, { params }) {
  const auth = verifyAdminAuth(request);
  if (!auth) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await initFounderOSDb();
    const resolvedParams = await params;
    const { id } = resolvedParams;

    const res = await query(`
      SELECT 
        b.*,
        c.name AS category_name,
        c.slug AS category_slug,
        COALESCE(
          json_agg(json_build_object('id', t.id, 'name', t.name, 'slug', t.slug)) 
          FILTER (WHERE t.id IS NOT NULL), '[]'
        ) AS tags
      FROM founder_os_blogs b
      LEFT JOIN founder_os_blog_categories c ON c.id = b.category_id
      LEFT JOIN founder_os_blog_posts_tags pt ON pt.post_id = b.id
      LEFT JOIN founder_os_blog_tags t ON t.id = pt.tag_id
      WHERE b.id = $1
      GROUP BY b.id, c.name, c.slug
    `, [id]);

    if (res.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Blog post not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, post: res.rows[0] });
  } catch (err) {
    console.error('Blog GET by ID error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  const auth = verifyAdminAuth(request);
  if (!auth) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await initFounderOSDb();
    const resolvedParams = await params;
    const { id } = resolvedParams;
    const body = await request.json();

    const currentRes = await query('SELECT * FROM founder_os_blogs WHERE id = $1', [id]);
    if (currentRes.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Blog post not found' }, { status: 404 });
    }
    const current = currentRes.rows[0];

    const {
      title = current.title,
      slug,
      excerpt = current.excerpt,
      content_markdown = current.content_markdown,
      cover_image_url = current.cover_image_url,
      cover_image_alt = current.cover_image_alt,
      author_person_id,
      author_name = current.author_name,
      author_role = current.author_role,
      author_avatar_url = current.author_avatar_url,
      category_id,
      tag_ids,
      status = current.status,
      featured,
      scheduled_for,
      seo_title = current.seo_title,
      seo_description = current.seo_description,
      canonical_url = current.canonical_url,
      og_image_url = current.og_image_url
    } = body;

    // Validate Slug
    let targetSlug = current.slug;
    if (slug && slug.trim() !== current.slug) {
      targetSlug = generateSlug(slug);
      if (RESERVED_SLUGS.has(targetSlug)) {
        return NextResponse.json({ success: false, error: `The slug "${targetSlug}" is reserved for system routes.` }, { status: 400 });
      }

      const slugConflict = await query('SELECT id FROM founder_os_blogs WHERE slug = $1 AND id != $2', [targetSlug, id]);
      if (slugConflict.rows.length > 0) {
        return NextResponse.json({ success: false, error: `The slug "${targetSlug}" is already in use by another article.` }, { status: 400 });
      }
    }

    // Handle slug redirects tracking if slug changed on a published article
    let previousSlugs = Array.isArray(current.previous_slugs_json) ? [...current.previous_slugs_json] : [];
    if (targetSlug !== current.slug) {
      if (!previousSlugs.includes(current.slug)) {
        previousSlugs.push(current.slug);
      }
    }

    // Author snapshot resolution
    let finalAuthorName = author_name;
    let finalAuthorRole = author_role;
    let finalAuthorAvatar = author_avatar_url;
    let finalAuthorPersonId = author_person_id !== undefined ? (author_person_id ? parseInt(author_person_id, 10) : null) : current.author_person_id;

    if (finalAuthorPersonId) {
      const pRes = await query('SELECT name, role, public_role, profile_image_url FROM founder_os_people WHERE id = $1', [finalAuthorPersonId]);
      if (pRes.rows[0]) {
        const p = pRes.rows[0];
        finalAuthorName = p.name;
        finalAuthorRole = p.public_role || p.role || finalAuthorRole;
        finalAuthorAvatar = p.profile_image_url || finalAuthorAvatar;
      }
    }

    // Publication timestamps
    let publishedAt = current.published_at;
    let archivedAt = current.archived_at;

    if (status === 'Published' && current.status !== 'Published') {
      publishedAt = publishedAt || new Date().toISOString();
      archivedAt = null;
    } else if (status === 'Archived' && current.status !== 'Archived') {
      archivedAt = new Date().toISOString();
    } else if (status === 'Draft' && current.status === 'Archived') {
      archivedAt = null;
    }

    const readingTime = calculateReadingTime(content_markdown || '');
    const isFeatured = featured !== undefined ? Boolean(featured) : current.featured;

    const res = await query(
      `UPDATE founder_os_blogs SET
        title = $1,
        slug = $2,
        excerpt = $3,
        content_markdown = $4,
        cover_image_url = $5,
        cover_image_alt = $6,
        author_person_id = $7,
        author_name = $8,
        author_role = $9,
        author_avatar_url = $10,
        category_id = $11,
        status = $12,
        featured = $13,
        published_at = $14,
        scheduled_for = $15,
        reading_time_minutes = $16,
        seo_title = $17,
        seo_description = $18,
        canonical_url = $19,
        og_image_url = $20,
        previous_slugs_json = $21,
        archived_at = $22,
        updated_by = $23,
        updated_at = NOW()
      WHERE id = $24
      RETURNING *`,
      [
        title.trim(),
        targetSlug,
        excerpt.trim(),
        content_markdown || '',
        cover_image_url || null,
        cover_image_alt || null,
        finalAuthorPersonId,
        finalAuthorName,
        finalAuthorRole,
        finalAuthorAvatar,
        category_id !== undefined ? (category_id ? parseInt(category_id, 10) : null) : current.category_id,
        status,
        isFeatured,
        publishedAt,
        scheduled_for ? new Date(scheduled_for).toISOString() : (scheduled_for === null ? null : current.scheduled_for),
        readingTime,
        seo_title ? seo_title.trim() : null,
        seo_description ? seo_description.trim() : null,
        canonical_url ? canonical_url.trim() : null,
        og_image_url ? og_image_url.trim() : null,
        JSON.stringify(previousSlugs),
        archivedAt,
        auth.username || 'Founder',
        id
      ]
    );

    const updated = res.rows[0];

    // Update Tags if provided
    if (Array.isArray(tag_ids)) {
      await query('DELETE FROM founder_os_blog_posts_tags WHERE post_id = $1', [id]);
      for (const tagId of tag_ids) {
        await query(
          'INSERT INTO founder_os_blog_posts_tags (post_id, tag_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
          [id, parseInt(tagId, 10)]
        );
      }
    }

    let actionLabel = 'Updated';
    if (current.status !== status) {
      if (status === 'Published') actionLabel = 'Published';
      else if (status === 'Draft' && current.status === 'Published') actionLabel = 'Unpublished';
      else if (status === 'Archived') actionLabel = 'Archived';
      else if (status === 'Draft' && current.status === 'Archived') actionLabel = 'Restored';
      else if (status === 'Scheduled') actionLabel = 'Scheduled';
    }

    await logActivity(
      auth.username,
      'BlogPost',
      id,
      actionLabel,
      `${actionLabel} article "${updated.title}" [Status: ${status}]`
    );

    // Revalidate Public Cache & Sync Sitemap
    try {
      revalidatePath('/blog');
      revalidatePath(`/blog/${updated.slug}`);
      if (current.slug !== updated.slug) {
        revalidatePath(`/blog/${current.slug}`);
      }
      revalidatePath('/sitemap.xml');
    } catch (e) {
      console.warn('Revalidation notice:', e.message);
    }

    return NextResponse.json({ success: true, post: updated });
  } catch (err) {
    console.error('Blog PUT error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const auth = verifyAdminAuth(request);
  if (!auth) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await initFounderOSDb();
    const resolvedParams = await params;
    const { id } = resolvedParams;

    const currentRes = await query('SELECT * FROM founder_os_blogs WHERE id = $1', [id]);
    if (currentRes.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Blog post not found' }, { status: 404 });
    }
    const post = currentRes.rows[0];

    // Safely delete post (tag mapping deletes on cascade)
    await query('DELETE FROM founder_os_blogs WHERE id = $1', [id]);

    await logActivity(
      auth.username,
      'BlogPost',
      id,
      'Deleted',
      `Permanently deleted article: "${post.title}" (/blog/${post.slug})`
    );

    try {
      revalidatePath('/blog');
      revalidatePath(`/blog/${post.slug}`);
      revalidatePath('/sitemap.xml');
    } catch (e) {
      console.warn('Revalidation notice:', e.message);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Blog DELETE error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
