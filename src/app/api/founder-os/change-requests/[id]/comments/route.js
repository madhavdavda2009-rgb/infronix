import { NextResponse } from 'next/server';
import { verifyAdminAuth } from '@/lib/auth';
import { query, initFounderOSDb } from '@/lib/founder_os_db';
import { notifyClient } from '@/lib/portal_notifications';

export async function POST(request, { params }) {
  const auth = verifyAdminAuth(request);
  if (!auth) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await initFounderOSDb();
    const resolvedParams = await params;
    const { id } = resolvedParams;
    const crId = parseInt(id, 10);

    const crRes = await query(`
      SELECT cr.*, p.project_name, c.name as client_name 
      FROM founder_os_client_change_requests cr
      JOIN founder_os_projects p ON p.id = cr.project_id
      JOIN founder_os_clients c ON c.id = cr.client_id
      WHERE cr.id = $1
    `, [crId]);

    if (crRes.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Change request not found' }, { status: 404 });
    }
    const changeRequest = crRes.rows[0];

    const body = await request.json();
    const message = typeof body.message === 'string' ? body.message.trim() : '';
    const isInternalNote = Boolean(body.is_internal_note);
    const attachmentUrl = typeof body.attachment_url === 'string' ? body.attachment_url.trim() : null;
    const attachmentName = typeof body.attachment_name === 'string' ? body.attachment_name.trim() : null;

    if (!message && !attachmentUrl) {
      return NextResponse.json({ success: false, error: 'Message cannot be empty' }, { status: 400 });
    }

    const commentRes = await query(`
      INSERT INTO founder_os_change_request_comments (
        change_request_id, sender_type, sender_name, sender_id, message, attachment_url, attachment_name, is_internal_note
      ) VALUES ($1, 'Admin', $2, 0, $3, $4, $5, $6)
      RETURNING *
    `, [
      crId,
      `InfronixWeb Team (${auth.username || 'Admin'})`,
      message,
      attachmentUrl,
      attachmentName,
      isInternalNote
    ]);

    await query('UPDATE founder_os_client_change_requests SET updated_at = NOW() WHERE id = $1', [crId]);

    // If public client reply, notify client
    if (!isInternalNote) {
      await notifyClient({
        clientId: changeRequest.client_id,
        portalUserId: changeRequest.portal_user_id,
        projectId: changeRequest.project_id,
        title: `New Reply on Change Request [${changeRequest.reference_id}]`,
        message: `InfronixWeb team replied: "${message.substring(0, 150)}${message.length > 150 ? '...' : ''}"`,
        actionUrl: `/client/projects/${changeRequest.project_id}?tab=change-requests&crId=${changeRequest.id}`,
        category: 'Change Request'
      });
    }

    return NextResponse.json({
      success: true,
      comment: commentRes.rows[0]
    });
  } catch (err) {
    console.error('Admin add CR comment error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
