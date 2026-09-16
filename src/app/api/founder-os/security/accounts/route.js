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
    const mfa = searchParams.get('mfa');

    let sql = 'SELECT * FROM founder_os_security_accounts WHERE 1=1';
    const params = [];

    if (category && category !== 'ALL') {
      params.push(category);
      sql += ` AND category = $${params.length}`;
    }

    if (mfa === 'yes') {
      sql += ' AND mfa_enabled = true';
    } else if (mfa === 'no') {
      sql += ' AND mfa_enabled = false';
    }

    sql += ' ORDER BY service_name ASC';
    const res = await query(sql, params);
    return NextResponse.json({ success: true, accounts: res.rows });
  } catch (err) {
    console.error('Security accounts GET error:', err);
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
    const { service_name, category, owner, security_status, mfa_enabled, recovery_configured, last_reviewed, url_reference, notes } = body;

    if (!service_name || !category) {
      return NextResponse.json({ success: false, error: 'Service name and category are required' }, { status: 400 });
    }

    const insertRes = await query(`
      INSERT INTO founder_os_security_accounts
        (service_name, category, owner, security_status, mfa_enabled, recovery_configured, last_reviewed, url_reference, notes, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW())
      RETURNING *
    `, [
      service_name.trim(),
      category,
      owner || 'Founder',
      security_status || 'Secured',
      Boolean(mfa_enabled),
      Boolean(recovery_configured),
      last_reviewed || null,
      url_reference || null,
      notes || null
    ]);

    const acc = insertRes.rows[0];
    await logActivity(auth.username, 'Security', acc.id, 'Created', `Added security inventory account: ${acc.service_name} (${acc.category})`);

    return NextResponse.json({ success: true, account: acc });
  } catch (err) {
    console.error('Security accounts POST error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
