import { NextResponse } from 'next/server';
import { query, initFounderOSDb } from '@/lib/founder_os_db';
import { verifyAdminAuth } from '@/lib/auth';
import { logActivity } from '@/lib/audit_logger';

function generateSlug(text) {
  if (!text) return '';
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
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
    const { name, slug, description, display_order } = body;

    const currentRes = await query('SELECT * FROM founder_os_blog_categories WHERE id = $1', [id]);
    if (currentRes.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Category not found' }, { status: 404 });
    }

    if (!name || !name.trim()) {
      return NextResponse.json({ success: false, error: 'Category name is required' }, { status: 400 });
    }

    const cleanSlug = generateSlug(slug || name);
    const existing = await query('SELECT id FROM founder_os_blog_categories WHERE slug = $1 AND id != $2', [cleanSlug, id]);
    if (existing.rows.length > 0) {
      return NextResponse.json({ success: false, error: 'Category slug is already in use.' }, { status: 400 });
    }

    const res = await query(
      `UPDATE founder_os_blog_categories
       SET name = $1, slug = $2, description = $3, display_order = $4, updated_at = NOW()
       WHERE id = $5
       RETURNING *`,
      [name.trim(), cleanSlug, description ? description.trim() : null, parseInt(display_order || '0', 10), id]
    );

    const updated = res.rows[0];
    await logActivity(auth.username, 'BlogCategory', id, 'Updated', `Updated category: ${updated.name}`);

    return NextResponse.json({ success: true, category: updated });
  } catch (err) {
    console.error('Category PUT error:', err);
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

    const currentRes = await query('SELECT * FROM founder_os_blog_categories WHERE id = $1', [id]);
    if (currentRes.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Category not found' }, { status: 404 });
    }
    const cat = currentRes.rows[0];

    // Check if posts are using this category
    const countRes = await query('SELECT COUNT(*) as count FROM founder_os_blogs WHERE category_id = $1', [id]);
    const postCount = parseInt(countRes.rows[0].count, 10);
    if (postCount > 0) {
      return NextResponse.json({
        success: false,
        error: `Cannot delete category "${cat.name}" because it is currently assigned to ${postCount} blog post(s). Please reassign them first.`
      }, { status: 400 });
    }

    await query('DELETE FROM founder_os_blog_categories WHERE id = $1', [id]);
    await logActivity(auth.username, 'BlogCategory', id, 'Deleted', `Deleted category: ${cat.name}`);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Category DELETE error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
