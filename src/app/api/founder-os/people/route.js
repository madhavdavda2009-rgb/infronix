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
    const status = searchParams.get('status');
    const type = searchParams.get('type');

    let sql = 'SELECT * FROM founder_os_people WHERE 1=1';
    const params = [];

    if (status && status !== 'ALL') {
      params.push(status);
      sql += ` AND status = $${params.length}`;
    }

    if (type && type !== 'ALL') {
      params.push(type);
      sql += ` AND employment_type = $${params.length}`;
    }

    sql += ' ORDER BY created_at DESC';
    const res = await query(sql, params);
    return NextResponse.json({ success: true, people: res.rows });
  } catch (err) {
    console.error('People GET error:', err);
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
    const { name, role, email, phone, joining_date, employment_type, responsibilities_json, status, notes } = body;

    if (!name || !role) {
      return NextResponse.json({ success: false, error: 'Name and role are required' }, { status: 400 });
    }

    const insertRes = await query(`
      INSERT INTO founder_os_people
        (name, role, email, phone, joining_date, employment_type, responsibilities_json, status, notes, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW())
      RETURNING *
    `, [
      name.trim(),
      role.trim(),
      email ? email.trim() : null,
      phone ? phone.trim() : null,
      joining_date || null,
      employment_type || 'Employee',
      JSON.stringify(responsibilities_json || []),
      status || 'Active',
      notes || null
    ]);

    const person = insertRes.rows[0];
    await logActivity(auth.username, 'Person', person.id, 'Created', `Added team member: ${person.name} (${person.role})`);

    return NextResponse.json({ success: true, person });
  } catch (err) {
    console.error('People POST error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
