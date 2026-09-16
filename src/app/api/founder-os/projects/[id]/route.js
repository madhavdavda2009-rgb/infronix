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

    const projectRes = await query('SELECT * FROM founder_os_projects WHERE id = $1', [id]);
    if (projectRes.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Project not found' }, { status: 404 });
    }
    const project = projectRes.rows[0];

    // Tasks
    const tasksRes = await query('SELECT * FROM founder_os_tasks WHERE project_id = $1 ORDER BY created_at ASC', [id]);
    // Client Feedback
    const feedbackRes = await query('SELECT * FROM founder_os_feedback WHERE project_id = $1 ORDER BY created_at DESC', [id]);
    // QA Checklist
    const qaRes = await query('SELECT * FROM founder_os_qa_checklist WHERE project_id = $1 ORDER BY id ASC', [id]);
    // Revenue linked
    const revenueRes = await query('SELECT * FROM founder_os_revenue WHERE project_id = $1 ORDER BY payment_date DESC', [id]);
    // Expenses linked
    const expensesRes = await query('SELECT * FROM founder_os_expenses WHERE project_id = $1 ORDER BY expense_date DESC', [id]);

    return NextResponse.json({
      success: true,
      project,
      tasks: tasksRes.rows,
      feedback: feedbackRes.rows,
      qaChecklist: qaRes.rows,
      revenue: revenueRes.rows,
      expenses: expensesRes.rows
    });
  } catch (err) {
    console.error('Project GET by ID error:', err);
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

    const { project_name, client_name, project_value, start_date, deadline, status, priority, assigned_person, notes } = body;

    const updateRes = await query(`
      UPDATE founder_os_projects
      SET 
        project_name = COALESCE($1, project_name),
        client_name = COALESCE($2, client_name),
        project_value = COALESCE($3, project_value),
        start_date = $4,
        deadline = $5,
        status = COALESCE($6, status),
        priority = COALESCE($7, priority),
        assigned_person = $8,
        notes = $9,
        updated_at = NOW()
      WHERE id = $10
      RETURNING *
    `, [
      project_name ? project_name.trim() : null,
      client_name ? client_name.trim() : null,
      project_value !== undefined ? parseFloat(project_value) : null,
      start_date || null,
      deadline || null,
      status,
      priority,
      assigned_person || null,
      notes,
      id
    ]);

    if (updateRes.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Project not found' }, { status: 404 });
    }

    const project = updateRes.rows[0];
    await logActivity(auth.username, 'Project', id, 'Updated', `Updated project: ${project.project_name} (Status: ${project.status})`);

    return NextResponse.json({ success: true, project });
  } catch (err) {
    console.error('Project PUT error:', err);
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

    const pRes = await query('SELECT project_name FROM founder_os_projects WHERE id = $1', [id]);
    const name = pRes.rows[0]?.project_name || id;

    await query('DELETE FROM founder_os_projects WHERE id = $1', [id]);
    await logActivity(auth.username, 'Project', id, 'Deleted', `Deleted project: ${name}`);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Project DELETE error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
