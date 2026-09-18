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
    const { name, slug } = body;

    const currentRes = await query('SELECT * FROM founder_os_blog_tags WHERE id = $1', [id]);
    if (currentRes.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Tag not found' }, { status: 404 });
    }

    if (!name || !name.trim()) {
      return NextResponse.json({ success: false, error: 'Tag name is required' }, { status: 400 });
    }

    const cleanSlug = generateSlug(slug || name);
    const existing = await query('SELECT id FROM founder_os_blog_tags WHERE slug = $1 AND id != $2', [cleanSlug, id]);
    if (existing.rows.length > 0) {
      return NextResponse.json({ success: false, error: 'Tag slug is already in use.' }, { status: 400 });
    }

    const res = await query(
      `UPDATE founder_os_blog_tags
       SET name = $1, slug = $2
       WHERE id = $3
       RETURNING *`,
      [name.trim(), cleanSlug, id]
    );

    const updated = res.rows[0];
    await logActivity(auth.username, 'BlogTag', id, 'Updated', `Updated tag: ${updated.name}`);

    return NextResponse.json({ success: true, tag: updated });
  } catch (err) {
    console.error('Tag PUT error:', err);
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

    const currentRes = await query('SELECT * FROM founder_os_blog_tags WHERE id = $1', [id]);
    if (currentRes.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Tag not found' }, { status: 404 });
    }
    const tag = currentRes.rows[0];

    await query('DELETE FROM founder_os_blog_tags WHERE id = $1', [id]);
    await logActivity(auth.username, 'BlogTag', id, 'Deleted', `Deleted tag: ${tag.name}`);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Tag DELETE error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
