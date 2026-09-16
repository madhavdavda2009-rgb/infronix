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
    const res = await query('SELECT * FROM founder_os_security_checklist ORDER BY id ASC');
    return NextResponse.json({ success: true, items: res.rows });
  } catch (err) {
    console.error('Security checklist GET error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PUT(request) {
  const auth = verifyAdminAuth(request);
  if (!auth) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await initFounderOSDb();
    const body = await request.json();
    const { id, status, last_verified, notes } = body;

    if (!id || !status) {
      return NextResponse.json({ success: false, error: 'Item ID and status are required' }, { status: 400 });
    }

    const updateRes = await query(`
      UPDATE founder_os_security_checklist
      SET 
        status = $1,
        last_verified = COALESCE($2, CURRENT_DATE),
        notes = $3,
        updated_at = NOW()
      WHERE id = $4
      RETURNING *
    `, [
      status, // 'Not Checked' | 'Compliant' | 'Action Required'
      last_verified || null,
      notes || null,
      id
    ]);

    if (updateRes.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Checklist item not found' }, { status: 404 });
    }

    const item = updateRes.rows[0];
    await logActivity(auth.username, 'Security Checklist', id, 'Updated', `Updated checklist "${item.title}" to ${item.status}`);

    return NextResponse.json({ success: true, item });
  } catch (err) {
    console.error('Security checklist PUT error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
