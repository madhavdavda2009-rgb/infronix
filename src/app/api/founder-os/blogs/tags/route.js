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
      SELECT t.*, COUNT(pt.post_id)::int AS post_count
      FROM founder_os_blog_tags t
      LEFT JOIN founder_os_blog_posts_tags pt ON pt.tag_id = t.id
      GROUP BY t.id
      ORDER BY t.name ASC
    `);

    return NextResponse.json({ success: true, tags: res.rows });
  } catch (err) {
    console.error('Tags GET error:', err);
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
    const { name, slug } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ success: false, error: 'Tag name is required' }, { status: 400 });
    }

    const cleanSlug = generateSlug(slug || name);
    if (!cleanSlug) {
      return NextResponse.json({ success: false, error: 'A valid tag slug is required' }, { status: 400 });
    }

    const existing = await query('SELECT id FROM founder_os_blog_tags WHERE slug = $1', [cleanSlug]);
    if (existing.rows.length > 0) {
      return NextResponse.json({ success: false, error: 'Tag slug already exists.' }, { status: 400 });
    }

    const res = await query(
      `INSERT INTO founder_os_blog_tags (name, slug, created_at)
       VALUES ($1, $2, NOW())
       RETURNING *`,
      [name.trim(), cleanSlug]
    );

    const tag = res.rows[0];
    await logActivity(auth.username, 'BlogTag', tag.id, 'Created', `Created blog tag: ${tag.name}`);

    return NextResponse.json({ success: true, tag });
  } catch (err) {
    console.error('Tags POST error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
