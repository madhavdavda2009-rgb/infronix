import { NextResponse } from 'next/server';
import { query, initFounderOSDb } from '@/lib/founder_os_db';
import { verifyAdminAuth } from '@/lib/auth';

export async function GET(request) {
  const auth = verifyAdminAuth(request);
  if (!auth) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await initFounderOSDb();
    const { searchParams } = new URL(request.url);
    const entity = searchParams.get('entity');
    const limit = parseInt(searchParams.get('limit') || '50', 10);

    let sql = 'SELECT * FROM founder_os_activity_logs WHERE 1=1';
    const params = [];

    if (entity && entity !== 'ALL') {
      params.push(entity);
      sql += ` AND entity_type = $${params.length}`;
    }

    params.push(limit);
    sql += ` ORDER BY created_at DESC LIMIT $${params.length}`;

    const res = await query(sql, params);
    return NextResponse.json({ success: true, activities: res.rows });
  } catch (err) {
    console.error('Activity logs GET error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
