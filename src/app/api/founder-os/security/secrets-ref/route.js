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
    const res = await query('SELECT * FROM founder_os_secret_references ORDER BY secret_name ASC');
    return NextResponse.json({ success: true, secrets: res.rows });
  } catch (err) {
    console.error('Secret refs GET error:', err);
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
    const { secret_name, purpose, stored_in, environment, last_rotated, notes } = body;

    if (!secret_name || !purpose) {
      return NextResponse.json({ success: false, error: 'Secret identifier and purpose are required' }, { status: 400 });
    }

    const insertRes = await query(`
      INSERT INTO founder_os_secret_references
        (secret_name, purpose, stored_in, environment, last_rotated, notes, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, NOW())
      RETURNING *
    `, [
      secret_name.trim(),
      purpose.trim(),
      stored_in || 'Password Manager',
      environment || 'Production',
      last_rotated || null,
      notes || null
    ]);

    const item = insertRes.rows[0];
    await logActivity(auth.username, 'Secrets Reference', item.id, 'Created', `Added reference mapping for: ${item.secret_name}`);

    return NextResponse.json({ success: true, secret: item });
  } catch (err) {
    console.error('Secret refs POST error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
