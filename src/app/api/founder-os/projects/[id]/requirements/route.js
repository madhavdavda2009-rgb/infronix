import { NextResponse } from 'next/server';
import { query, initFounderOSDb } from '@/lib/founder_os_db';
import { verifyAdminAuth } from '@/lib/auth';

export async function GET(request, { params }) {
  const auth = verifyAdminAuth(request);
  if (!auth) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await initFounderOSDb();
    const resolvedParams = await params;
    const { id } = resolvedParams;
    const res = await query('SELECT * FROM founder_os_client_requirements WHERE project_id = $1 ORDER BY id ASC', [id]);
    return NextResponse.json({ success: true, requirements: res.rows });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request, { params }) {
  const auth = verifyAdminAuth(request);
  if (!auth) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await initFounderOSDb();
    const resolvedParams = await params;
    const { id } = resolvedParams;
    const body = await request.json();
    const { item_name, notes } = body;

    if (!item_name) {
      return NextResponse.json({ success: false, error: 'Item name is required' }, { status: 400 });
    }

    const res = await query(`
      INSERT INTO founder_os_client_requirements (project_id, item_name, status, notes, created_at, updated_at)
      VALUES ($1, $2, 'Pending', $3, NOW(), NOW())
      RETURNING *
    `, [id, item_name.trim(), notes || null]);

    return NextResponse.json({ success: true, requirement: res.rows[0] });
  } catch (err) {
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
    const { requirement_id, status, notes } = body;

    if (!requirement_id) {
      return NextResponse.json({ success: false, error: 'Requirement ID is required' }, { status: 400 });
    }

    const receivedDate = status === 'Received' ? 'CURRENT_DATE' : 'NULL';

    const res = await query(`
      UPDATE founder_os_client_requirements
      SET 
        status = COALESCE($1, status),
        notes = COALESCE($2, notes),
        received_date = CASE WHEN $1 = 'Received' THEN CURRENT_DATE WHEN $1 IS NOT NULL THEN NULL ELSE received_date END,
        updated_at = NOW()
      WHERE id = $3 AND project_id = $4
      RETURNING *
    `, [status || null, notes || null, requirement_id, id]);

    return NextResponse.json({ success: true, requirement: res.rows[0] });
  } catch (err) {
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
    const { searchParams } = new URL(request.url);
    const reqId = searchParams.get('requirementId');

    if (!reqId) {
      return NextResponse.json({ success: false, error: 'Requirement ID is required' }, { status: 400 });
    }

    await query('DELETE FROM founder_os_client_requirements WHERE id = $1 AND project_id = $2', [reqId, id]);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
