import { NextResponse } from 'next/server';
import { query, initFounderOSDb } from '@/lib/founder_os_db';
import { verifyAdminAuth } from '@/lib/auth';
import { logActivity } from '@/lib/audit_logger';

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

    const { name, role, email, phone, joining_date, employment_type, responsibilities_json, status, notes } = body;

    const updateRes = await query(`
      UPDATE founder_os_people
      SET 
        name = COALESCE($1, name),
        role = COALESCE($2, role),
        email = $3,
        phone = $4,
        joining_date = $5,
        employment_type = COALESCE($6, employment_type),
        responsibilities_json = COALESCE($7, responsibilities_json),
        status = COALESCE($8, status),
        notes = $9,
        updated_at = NOW()
      WHERE id = $10
      RETURNING *
    `, [
      name ? name.trim() : null,
      role ? role.trim() : null,
      email ? email.trim() : null,
      phone ? phone.trim() : null,
      joining_date || null,
      employment_type,
      responsibilities_json ? JSON.stringify(responsibilities_json) : null,
      status,
      notes,
      id
    ]);

    if (updateRes.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Team member not found' }, { status: 404 });
    }

    const person = updateRes.rows[0];
    await logActivity(auth.username, 'Person', id, 'Updated', `Updated team member: ${person.name} (${person.role})`);

    return NextResponse.json({ success: true, person });
  } catch (err) {
    console.error('People PUT error:', err);
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

    const res = await query('SELECT name FROM founder_os_people WHERE id = $1', [id]);
    const name = res.rows[0]?.name || id;

    await query('DELETE FROM founder_os_people WHERE id = $1', [id]);
    await logActivity(auth.username, 'Person', id, 'Deleted', `Deleted team member: ${name}`);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('People DELETE error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
