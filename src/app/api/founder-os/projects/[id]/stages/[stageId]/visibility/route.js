import { NextResponse } from 'next/server';
import { verifyAdminAuth } from '@/lib/auth';
import { query, initFounderOSDb } from '@/lib/founder_os_db';

export async function PUT(request, { params }) {
  const auth = verifyAdminAuth(request);
  if (!auth) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await initFounderOSDb();
    const resolvedParams = await params;
    const { id, stageId } = resolvedParams;
    const projectId = parseInt(id, 10);
    const sId = parseInt(stageId, 10);

    const body = await request.json();
    const visibleToClient = body.is_visible_to_client !== undefined
      ? Boolean(body.is_visible_to_client)
      : (body.visible_to_client !== undefined ? Boolean(body.visible_to_client) : true);
    const clientTitle = typeof body.client_title === 'string' ? body.client_title.trim() : null;
    const clientDescription = typeof body.client_description === 'string' ? body.client_description.trim() : null;
    const clientNote = typeof body.client_note === 'string' ? body.client_note.trim() : null;
    const stageWeight = body.stage_weight !== undefined ? parseInt(body.stage_weight, 10) : 1;

    const updateRes = await query(`
      UPDATE founder_os_project_stages
      SET visible_to_client = $1,
          client_title = COALESCE($2, client_title, stage_name),
          client_description = $3,
          client_note = $4,
          stage_weight = $5
      WHERE id = $6 AND project_id = $7
      RETURNING *
    `, [
      visibleToClient,
      clientTitle,
      clientDescription,
      clientNote,
      stageWeight,
      sId,
      projectId
    ]);

    if (updateRes.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Stage not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      stage: updateRes.rows[0]
    });
  } catch (err) {
    console.error('Stage visibility update error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
