import { NextResponse } from 'next/server';
import { query, initFounderOSDb, DEFAULT_QA_CHECKLIST_TEMPLATES } from '@/lib/founder_os_db';
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
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    const priority = searchParams.get('priority') || '';

    let sql = `
      SELECT 
        p.*,
        COUNT(DISTINCT t.id) as total_tasks,
        COUNT(DISTINCT CASE WHEN t.status = 'Completed' THEN t.id END) as completed_tasks,
        COUNT(DISTINCT qa.id) as total_qa,
        COUNT(DISTINCT CASE WHEN qa.is_checked = true THEN qa.id END) as passed_qa
      FROM founder_os_projects p
      LEFT JOIN founder_os_tasks t ON t.project_id = p.id
      LEFT JOIN founder_os_qa_checklist qa ON qa.project_id = p.id
      WHERE 1=1
    `;
    const params = [];

    if (search) {
      params.push(`%${search.toLowerCase()}%`);
      const pIndex = params.length;
      sql += ` AND (LOWER(p.project_name) LIKE $${pIndex} OR LOWER(p.client_name) LIKE $${pIndex})`;
    }

    if (status && status !== 'ALL') {
      params.push(status);
      sql += ` AND p.status = $${params.length}`;
    }

    if (priority && priority !== 'ALL') {
      params.push(priority);
      sql += ` AND p.priority = $${params.length}`;
    }

    sql += ' GROUP BY p.id ORDER BY p.created_at DESC';
    const res = await query(sql, params);
    return NextResponse.json({ success: true, projects: res.rows });
  } catch (err) {
    console.error('Projects GET error:', err);
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
    const { project_name, client_name, project_value, start_date, deadline, status, priority, assigned_person, notes } = body;

    if (!project_name || !client_name) {
      return NextResponse.json({ success: false, error: 'Project name and Client name are required' }, { status: 400 });
    }

    const insertRes = await query(`
      INSERT INTO founder_os_projects
        (project_name, client_name, project_value, start_date, deadline, status, priority, assigned_person, notes, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW())
      RETURNING *
    `, [
      project_name.trim(),
      client_name.trim(),
      parseFloat(project_value || 0),
      start_date || null,
      deadline || null,
      status || 'Planning',
      priority || 'Medium',
      assigned_person || null,
      notes || null
    ]);

    const project = insertRes.rows[0];

    // Automatically initialize 11 QA Checklist Templates for this project
    for (const qa of DEFAULT_QA_CHECKLIST_TEMPLATES) {
      await query(`
        INSERT INTO founder_os_qa_checklist (project_id, item_key, item_label, is_checked, updated_at)
        VALUES ($1, $2, $3, false, NOW())
      `, [project.id, qa.item_key, qa.item_label]);
    }

    await logActivity(auth.username, 'Project', project.id, 'Created', `Created project: ${project.project_name} for ${project.client_name} (₹${project.project_value})`);

    return NextResponse.json({ success: true, project });
  } catch (err) {
    console.error('Projects POST error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
