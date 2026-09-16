import { NextResponse } from 'next/server';
import { query, initFounderOSDb } from '@/lib/founder_os_db';
import { verifyAdminAuth } from '@/lib/auth';
import { logActivity } from '@/lib/audit_logger';

export async function GET(request, { params }) {
  const auth = verifyAdminAuth(request);
  if (!auth) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await initFounderOSDb();
    const resolvedParams = await params;
    const { id } = resolvedParams;

    const res = await query('SELECT * FROM founder_os_sops WHERE id = $1', [id]);
    if (res.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'SOP not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, sop: res.rows[0] });
  } catch (err) {
    console.error('SOP GET by ID error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
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

    const { name, category, description, steps_json, owner, version } = body;

    const updateRes = await query(`
      UPDATE founder_os_sops
      SET 
        name = COALESCE($1, name),
        category = COALESCE($2, category),
        description = $3,
        steps_json = COALESCE($4, steps_json),
        owner = COALESCE($5, owner),
        version = COALESCE($6, version),
        last_updated = CURRENT_DATE
      WHERE id = $7
      RETURNING *
    `, [
      name ? name.trim() : null,
      category,
      description,
      steps_json ? JSON.stringify(steps_json) : null,
      owner,
      version,
      id
    ]);

    if (updateRes.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'SOP not found' }, { status: 404 });
    }

    const sop = updateRes.rows[0];
    await logActivity(auth.username, 'SOP', id, 'Updated', `Updated SOP: "${sop.name}" (v${sop.version})`);

    return NextResponse.json({ success: true, sop });
  } catch (err) {
    console.error('SOP PUT error:', err);
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

    const res = await query('SELECT name FROM founder_os_sops WHERE id = $1', [id]);
    const name = res.rows[0]?.name || id;

    await query('DELETE FROM founder_os_sops WHERE id = $1', [id]);
    await logActivity(auth.username, 'SOP', id, 'Deleted', `Deleted SOP: "${name}"`);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('SOP DELETE error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
