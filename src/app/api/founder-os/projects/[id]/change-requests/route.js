import { NextResponse } from 'next/server';
import { verifyAdminAuth } from '@/lib/auth';
import { query, initFounderOSDb } from '@/lib/founder_os_db';

export async function GET(request, { params }) {
  const auth = verifyAdminAuth(request);
  if (!auth) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await initFounderOSDb();
    const resolvedParams = await params;
    const { id } = resolvedParams;
    const projectId = parseInt(id, 10);

    const crsRes = await query(`
      SELECT 
        cr.*,
        u.full_name as author_name,
        u.email as author_email,
        u.public_client_id,
        s.stage_name,
        s.client_title as stage_client_title,
        COUNT(c.id) as total_comments,
        COUNT(CASE WHEN c.is_internal_note = TRUE THEN 1 END) as internal_notes_count
      FROM founder_os_client_change_requests cr
      LEFT JOIN founder_os_portal_users u ON u.id = cr.portal_user_id
      LEFT JOIN founder_os_project_stages s ON s.id = cr.stage_id
      LEFT JOIN founder_os_change_request_comments c ON c.change_request_id = cr.id
      WHERE cr.project_id = $1
      GROUP BY cr.id, u.full_name, u.email, u.public_client_id, s.stage_name, s.client_title
      ORDER BY cr.created_at DESC
    `, [projectId]);

    return NextResponse.json({
      success: true,
      change_requests: crsRes.rows
    });
  } catch (err) {
    console.error('Admin project change requests get error:', err);
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
    const projectId = parseInt(id, 10);
    const body = await request.json();

    const {
      change_request_id,
      status,
      admin_priority,
      scope_decision,
      impact_cost,
      timeline_impact,
      estimated_completion_date,
      admin_notes
    } = body;

    if (!change_request_id) {
      return NextResponse.json({ success: false, error: 'Change request ID is required' }, { status: 400 });
    }

    const updatedRes = await query(`
      UPDATE founder_os_client_change_requests
      SET 
        status = COALESCE($1, status),
        admin_priority = COALESCE($2, admin_priority),
        scope_decision = COALESCE($3, scope_decision),
        impact_cost = COALESCE($4, impact_cost),
        timeline_impact = COALESCE($5, timeline_impact),
        estimated_completion_date = COALESCE($6, estimated_completion_date),
        admin_notes = COALESCE($7, admin_notes),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $8 AND project_id = $9
      RETURNING *
    `, [
      status || null,
      admin_priority || null,
      scope_decision || null,
      impact_cost !== undefined ? parseFloat(impact_cost || 0) : null,
      timeline_impact || null,
      estimated_completion_date || null,
      admin_notes || null,
      change_request_id,
      projectId
    ]);

    if (updatedRes.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Change request not found' }, { status: 404 });
    }

    const cr = updatedRes.rows[0];

    // Log public or status comment if status changed
    if (body.status_comment) {
      await query(`
        INSERT INTO founder_os_change_request_comments (
          change_request_id,
          sender_type,
          sender_name,
          message,
          is_internal_note
        ) VALUES ($1, 'admin', 'InfronixWeb Team', $2, $3)
      `, [change_request_id, body.status_comment, Boolean(body.is_internal_note)]);
    }

    return NextResponse.json({
      success: true,
      changeRequest: cr
    });
  } catch (err) {
    console.error('Admin update change request error:', err);
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
    const projectId = parseInt(id, 10);
    const body = await request.json();

    const { change_request_id, message, is_internal_note, sender_name } = body;

    if (!change_request_id || !message) {
      return NextResponse.json({ success: false, error: 'Missing change request ID or message' }, { status: 400 });
    }

    const crCheck = await query('SELECT id FROM founder_os_client_change_requests WHERE id = $1 AND project_id = $2', [change_request_id, projectId]);
    if (crCheck.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Change request not found for this project' }, { status: 404 });
    }

    const commentRes = await query(`
      INSERT INTO founder_os_change_request_comments (
        change_request_id,
        sender_type,
        sender_name,
        message,
        is_internal_note
      ) VALUES ($1, 'admin', $2, $3, $4)
      RETURNING *
    `, [
      change_request_id,
      sender_name || 'InfronixWeb Lead',
      message.trim(),
      Boolean(is_internal_note)
    ]);

    return NextResponse.json({
      success: true,
      comment: commentRes.rows[0]
    });
  } catch (err) {
    console.error('Admin add change request comment error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
