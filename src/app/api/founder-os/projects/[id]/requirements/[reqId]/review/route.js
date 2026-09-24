import { NextResponse } from 'next/server';
import { verifyAdminAuth } from '@/lib/auth';
import { query, initFounderOSDb } from '@/lib/founder_os_db';
import { logActivity } from '@/lib/audit_logger';
import { notifyClient } from '@/lib/portal_notifications';

export async function PUT(request, { params }) {
  const auth = verifyAdminAuth(request);
  if (!auth) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await initFounderOSDb();
    const resolvedParams = await params;
    const { id, reqId } = resolvedParams;
    const projectId = parseInt(id, 10);
    const requirementId = parseInt(reqId, 10);

    const projRes = await query('SELECT client_id, project_name FROM founder_os_projects WHERE id = $1', [projectId]);
    if (projRes.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Project not found' }, { status: 404 });
    }
    const project = projRes.rows[0];

    const body = await request.json();
    const status = body.status; // 'Received' (Approved) | 'Pending' (Rejected / Resubmit requested)
    const reviewNote = typeof body.review_note === 'string' ? body.review_note.trim() : '';

    if (!status || !['Received', 'Pending', 'Submitted'].includes(status)) {
      return NextResponse.json({ success: false, error: 'Valid status is required' }, { status: 400 });
    }

    const updateRes = await query(`
      UPDATE founder_os_client_requirements
      SET status = $1,
          admin_review_note = $2,
          received_date = CASE WHEN $1 = 'Received' THEN CURRENT_DATE ELSE received_date END,
          updated_at = NOW()
      WHERE id = $3 AND project_id = $4
      RETURNING *
    `, [status, reviewNote, requirementId, projectId]);

    if (updateRes.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Requirement not found' }, { status: 404 });
    }

    const reqItem = updateRes.rows[0];

    await logActivity(
      auth.username || 'Admin',
      'Client Requirement Review',
      projectId,
      `Requirement ${status}: ${reqItem.item_name}`,
      `Marked requirement "${reqItem.item_name}" as ${status}. Review note: "${reviewNote}"`
    );

    // Notify Client
    if (project.client_id) {
      const isApproved = status === 'Received';
      await notifyClient({
        clientId: project.client_id,
        projectId: projectId,
        title: isApproved ? `Requirement Approved: ${reqItem.item_name}` : `Requirement Update: ${reqItem.item_name}`,
        message: isApproved 
          ? `The InfronixWeb team accepted and verified your submission for "${reqItem.item_name}".`
          : `Note from project manager regarding "${reqItem.item_name}": ${reviewNote || 'Please review and resubmit requested files.'}`,
        actionUrl: `/client/projects/${projectId}?tab=requirements`,
        category: 'Requirement'
      });
    }

    return NextResponse.json({
      success: true,
      message: `Requirement marked as ${status}.`,
      requirement: reqItem
    });
  } catch (err) {
    console.error('Requirement review error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
