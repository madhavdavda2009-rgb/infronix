import { NextResponse } from 'next/server';
import { verifyClientAuth, getPortalSecurityHeaders } from '@/lib/client_auth';
import { query, initFounderOSDb } from '@/lib/founder_os_db';
import { notifyAdminAboutClientAction } from '@/lib/portal_notifications';

export async function POST(request, { params }) {
  try {
    const auth = await verifyClientAuth(request);
    if (!auth) {
      return NextResponse.json({ success: false, error: 'Unauthorized.' }, { status: 401, headers: getPortalSecurityHeaders() });
    }

    if (auth.isAdminPreview) {
      return NextResponse.json({ success: false, error: 'Commenting is disabled in Admin Preview mode.' }, { status: 403, headers: getPortalSecurityHeaders() });
    }

    await initFounderOSDb();
    const resolvedParams = await params;
    const { id } = resolvedParams;
    const crId = parseInt(id, 10);

    // Verify ownership
    const crRes = await query(`
      SELECT cr.*, p.project_name 
      FROM founder_os_client_change_requests cr
      JOIN founder_os_projects p ON p.id = cr.project_id
      WHERE cr.id = $1 AND cr.client_id = $2
    `, [crId, auth.client.id]);

    if (crRes.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Change request not found.' }, { status: 404, headers: getPortalSecurityHeaders() });
    }

    const changeRequest = crRes.rows[0];

    const body = await request.json();
    const message = typeof body.message === 'string' ? body.message.trim() : '';
    const attachmentUrl = typeof body.attachment_url === 'string' ? body.attachment_url.trim() : null;
    const attachmentName = typeof body.attachment_name === 'string' ? body.attachment_name.trim() : null;

    if (!message && !attachmentUrl) {
      return NextResponse.json({ success: false, error: 'Message cannot be empty.' }, { status: 400, headers: getPortalSecurityHeaders() });
    }

    const commentRes = await query(`
      INSERT INTO founder_os_change_request_comments (
        change_request_id, sender_type, sender_name, sender_id, message, attachment_url, attachment_name, is_internal_note
      ) VALUES ($1, 'Client', $2, $3, $4, $5, $6, FALSE)
      RETURNING *
    `, [
      crId,
      auth.user.full_name,
      auth.user.id,
      message,
      attachmentUrl,
      attachmentName
    ]);

    // Update change request updated_at timestamp
    await query('UPDATE founder_os_client_change_requests SET updated_at = NOW() WHERE id = $1', [crId]);

    // Notify Admin
    await notifyAdminAboutClientAction({
      clientId: auth.client.id,
      clientName: auth.client.name,
      portalUserId: auth.user.id,
      projectId: changeRequest.project_id,
      projectName: changeRequest.project_name,
      actionTitle: `Client Replied on Change Request [${changeRequest.reference_id}]`,
      details: `${auth.user.full_name}: "${message.substring(0, 150)}${message.length > 150 ? '...' : ''}"`,
      category: 'Change Request Comment'
    });

    return NextResponse.json({
      success: true,
      comment: commentRes.rows[0]
    }, { headers: getPortalSecurityHeaders() });
  } catch (err) {
    console.error('Client change request comment error:', err);
    return NextResponse.json({ success: false, error: 'Failed to post message.' }, { status: 500, headers: getPortalSecurityHeaders() });
  }
}
