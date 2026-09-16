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
    const res = await query('SELECT * FROM founder_os_project_stages WHERE project_id = $1 ORDER BY stage_order ASC, id ASC', [id]);
    return NextResponse.json({ success: true, stages: res.rows });
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
    const { stage_name, stage_order } = body;

    if (!stage_name) {
      return NextResponse.json({ success: false, error: 'Stage name is required' }, { status: 400 });
    }

    const maxOrderRes = await query('SELECT COALESCE(MAX(stage_order), 0) + 1 as next_order FROM founder_os_project_stages WHERE project_id = $1', [id]);
    const order = stage_order !== undefined ? parseInt(stage_order, 10) : maxOrderRes.rows[0].next_order;

    const res = await query(`
      INSERT INTO founder_os_project_stages (project_id, stage_name, stage_order, status, created_at)
      VALUES ($1, $2, $3, 'Pending', NOW())
      RETURNING *
    `, [id, stage_name.trim(), order]);

    return NextResponse.json({ success: true, stage: res.rows[0] });
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
    const { stage_id, status, stage_name, stage_order } = body;

    if (!stage_id) {
      return NextResponse.json({ success: false, error: 'Stage ID is required' }, { status: 400 });
    }

    const completedAt = status === 'Completed' ? 'NOW()' : 'NULL';

    const res = await query(`
      UPDATE founder_os_project_stages
      SET 
        status = COALESCE($1, status),
        stage_name = COALESCE($2, stage_name),
        stage_order = COALESCE($3, stage_order),
        completed_at = CASE WHEN $1 = 'Completed' THEN NOW() WHEN $1 IS NOT NULL THEN NULL ELSE completed_at END
      WHERE id = $4 AND project_id = $5
      RETURNING *
    `, [status || null, stage_name || null, stage_order || null, stage_id, id]);

    return NextResponse.json({ success: true, stage: res.rows[0] });
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
    const stageId = searchParams.get('stageId');

    if (!stageId) {
      return NextResponse.json({ success: false, error: 'Stage ID is required' }, { status: 400 });
    }

    await query('DELETE FROM founder_os_project_stages WHERE id = $1 AND project_id = $2', [stageId, id]);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
