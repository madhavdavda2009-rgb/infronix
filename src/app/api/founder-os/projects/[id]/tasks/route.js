import { NextResponse } from 'next/server';
import { query, initFounderOSDb } from '@/lib/founder_os_db';
import { verifyAdminAuth } from '@/lib/auth';
import { logActivity } from '@/lib/audit_logger';

export async function POST(request, { params }) {
  const auth = verifyAdminAuth(request);
  if (!auth) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await initFounderOSDb();
    const resolvedParams = await params;
    const { id: project_id } = resolvedParams;
    const body = await request.json();

    const { title, description, assigned_to, priority, status, deadline } = body;
    if (!title || title.trim() === '') {
      return NextResponse.json({ success: false, error: 'Task title is required' }, { status: 400 });
    }

    const insertRes = await query(`
      INSERT INTO founder_os_tasks
        (project_id, title, description, assigned_to, priority, status, deadline, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
      RETURNING *
    `, [
      project_id,
      title.trim(),
      description || null,
      assigned_to || null,
      priority || 'Medium',
      status || 'Todo',
      deadline || null
    ]);

    const task = insertRes.rows[0];
    await logActivity(auth.username, 'Task', task.id, 'Created', `Added task "${task.title}" to project #${project_id}`);

    return NextResponse.json({ success: true, task });
  } catch (err) {
    console.error('Task POST error:', err);
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
    const body = await request.json();
    const { taskId, title, description, assigned_to, priority, status, deadline } = body;

    if (!taskId) {
      return NextResponse.json({ success: false, error: 'Task ID is required' }, { status: 400 });
    }

    const updateRes = await query(`
      UPDATE founder_os_tasks
      SET 
        title = COALESCE($1, title),
        description = $2,
        assigned_to = $3,
        priority = COALESCE($4, priority),
        status = COALESCE($5, status),
        deadline = $6,
        updated_at = NOW()
      WHERE id = $7
      RETURNING *
    `, [
      title ? title.trim() : null,
      description,
      assigned_to,
      priority,
      status,
      deadline || null,
      taskId
    ]);

    if (updateRes.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Task not found' }, { status: 404 });
    }

    const task = updateRes.rows[0];
    await logActivity(auth.username, 'Task', taskId, 'Updated', `Updated task "${task.title}" (${task.status})`);

    return NextResponse.json({ success: true, task });
  } catch (err) {
    console.error('Task PUT error:', err);
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
    const { searchParams } = new URL(request.url);
    const taskId = searchParams.get('taskId');

    if (!taskId) {
      return NextResponse.json({ success: false, error: 'Task ID is required' }, { status: 400 });
    }

    await query('DELETE FROM founder_os_tasks WHERE id = $1', [taskId]);
    await logActivity(auth.username, 'Task', taskId, 'Deleted', `Deleted task #${taskId}`);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Task DELETE error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
