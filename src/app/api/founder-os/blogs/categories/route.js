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

export async function GET(request) {
  const auth = verifyAdminAuth(request);
  if (!auth) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await initFounderOSDb();
    const res = await query(`
      SELECT c.*, COUNT(b.id)::int AS post_count
      FROM founder_os_blog_categories c
      LEFT JOIN founder_os_blogs b ON b.category_id = c.id
      GROUP BY c.id
      ORDER BY c.display_order ASC, c.name ASC
    `);

    return NextResponse.json({ success: true, categories: res.rows });
  } catch (err) {
    console.error('Categories GET error:', err);
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
    const { name, slug, description, display_order } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ success: false, error: 'Category name is required' }, { status: 400 });
    }

    const cleanSlug = generateSlug(slug || name);
    if (!cleanSlug) {
      return NextResponse.json({ success: false, error: 'A valid category slug is required' }, { status: 400 });
    }

    // Check slug uniqueness
    const existing = await query('SELECT id FROM founder_os_blog_categories WHERE slug = $1', [cleanSlug]);
    if (existing.rows.length > 0) {
      return NextResponse.json({ success: false, error: 'Category slug already exists. Please choose a unique slug.' }, { status: 400 });
    }

    const res = await query(
      `INSERT INTO founder_os_blog_categories (name, slug, description, display_order, created_at, updated_at)
       VALUES ($1, $2, $3, $4, NOW(), NOW())
       RETURNING *`,
      [name.trim(), cleanSlug, description ? description.trim() : null, parseInt(display_order || '0', 10)]
    );

    const category = res.rows[0];
    await logActivity(auth.username, 'BlogCategory', category.id, 'Created', `Created blog category: ${category.name}`);

    return NextResponse.json({ success: true, category });
  } catch (err) {
    console.error('Categories POST error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
