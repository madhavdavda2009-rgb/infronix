import { NextResponse } from 'next/server';
import { query, initFounderOSDb } from '@/lib/founder_os_db';
import { verifyAdminAuth } from '@/lib/auth';
import { logActivity } from '@/lib/audit_logger';

export async function GET(request) {
  const auth = verifyAdminAuth(request);
  if (!auth) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await initFounderOSDb();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search') || '';

    let sql = 'SELECT * FROM founder_os_sops WHERE 1=1';
    const params = [];

    if (category && category !== 'ALL') {
      params.push(category);
      sql += ` AND category = $${params.length}`;
    }

    if (search) {
      params.push(`%${search.toLowerCase()}%`);
      const pIndex = params.length;
      sql += ` AND (LOWER(name) LIKE $${pIndex} OR LOWER(description) LIKE $${pIndex})`;
    }

    sql += ' ORDER BY category ASC, name ASC';
    const res = await query(sql, params);
    return NextResponse.json({ success: true, sops: res.rows });
  } catch (err) {
    console.error('SOPs GET error:', err);
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
    const { name, category, description, steps_json, owner, version } = body;

    if (!name || !category) {
      return NextResponse.json({ success: false, error: 'SOP name and category are required' }, { status: 400 });
    }

    const insertRes = await query(`
      INSERT INTO founder_os_sops
        (name, category, description, steps_json, owner, version, last_updated, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, CURRENT_DATE, NOW())
      RETURNING *
    `, [
      name.trim(),
      category,
      description || null,
      JSON.stringify(steps_json || []),
      owner || 'Founder',
      version || '1.0'
    ]);

    const sop = insertRes.rows[0];
    await logActivity(auth.username, 'SOP', sop.id, 'Created', `Created SOP: "${sop.name}" (${sop.category} v${sop.version})`);

    return NextResponse.json({ success: true, sop });
  } catch (err) {
    console.error('SOPs POST error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
