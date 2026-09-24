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
    const { id, taskId } = resolvedParams;
    const projectId = parseInt(id, 10);
    const tId = parseInt(taskId, 10);

    const body = await request.json();
    const visibleToClient = body.is_visible_to_client !== undefined
      ? Boolean(body.is_visible_to_client)
      : (body.visible_to_client !== undefined ? Boolean(body.visible_to_client) : false);
    const clientTitle = typeof body.client_title === 'string' ? body.client_title.trim() : null;
    const clientDescription = typeof body.client_description === 'string' ? body.client_description.trim() : null;

    const updateRes = await query(`
      UPDATE founder_os_tasks
      SET visible_to_client = $1,
          client_title = COALESCE($2, client_title, title),
          client_description = $3
      WHERE id = $4 AND project_id = $5
      RETURNING *
    `, [visibleToClient, clientTitle, clientDescription, tId, projectId]);

    if (updateRes.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Task not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      task: updateRes.rows[0]
    });
  } catch (err) {
    console.error('Task visibility update error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
