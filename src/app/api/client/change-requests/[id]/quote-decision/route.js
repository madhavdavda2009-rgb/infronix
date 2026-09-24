import { NextResponse } from 'next/server';
import { 
  verifyClientAuth, 
  hashIp, 
  getClientIp, 
  getPortalSecurityHeaders 
} from '@/lib/client_auth';
import { query, initFounderOSDb } from '@/lib/founder_os_db';
import { notifyAdminAboutClientAction } from '@/lib/portal_notifications';

export async function POST(request, { params }) {
  try {
    const auth = await verifyClientAuth(request);
    if (!auth) {
      return NextResponse.json({ success: false, error: 'Unauthorized.' }, { status: 401, headers: getPortalSecurityHeaders() });
    }

    if (auth.isAdminPreview) {
      return NextResponse.json({ success: false, error: 'Quote decisions are disabled in Admin Preview mode.' }, { status: 403, headers: getPortalSecurityHeaders() });
    }

    await initFounderOSDb();
    const resolvedParams = await params;
    const { id } = resolvedParams;
    const crId = parseInt(id, 10);

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
    const decision = body.decision; // 'Approved' | 'Rejected'
    const clientNotes = typeof body.notes === 'string' ? body.notes.trim() : '';

    if (decision !== 'Approved' && decision !== 'Rejected') {
      return NextResponse.json({ success: false, error: 'Valid decision ("Approved" or "Rejected") is required.' }, { status: 400, headers: getPortalSecurityHeaders() });
    }

    const newStatus = decision === 'Approved' ? 'Scheduled' : 'Rejected';
    const ip = getClientIp(request);
    const ipHash = hashIp(ip);

    // Update Change Request Quote Decision
    const updateRes = await query(`
      UPDATE founder_os_client_change_requests
      SET client_quote_decision = $1,
          client_quote_decision_at = NOW(),
          client_quote_notes = $2,
          status = $3,
          updated_at = NOW()
      WHERE id = $4
      RETURNING *
    `, [decision, clientNotes, newStatus, crId]);

    // Record Deliverable Approval if Approved
    if (decision === 'Approved') {
      await query(`
        INSERT INTO founder_os_client_approvals (
          project_id, portal_user_id, client_id, approval_type, deliverable_title, version, client_comment, ip_hash
        ) VALUES ($1, $2, $3, 'Change Quote', $4, $5, $6, $7)
      `, [
        changeRequest.project_id,
        auth.user.id,
        auth.client.id,
        `Change Request [${changeRequest.reference_id}]: ${changeRequest.title}`,
        `Quote v${changeRequest.quote_version || 1} (₹${changeRequest.quote_amount || 0})`,
        clientNotes || 'Approved quote via Client Portal',
        ipHash
      ]);
    }

    // Add confirmation comment to thread
    const commentMsg = decision === 'Approved'
      ? `✅ Quote Approved by Client for ₹${(changeRequest.quote_amount || 0).toLocaleString('en-IN')}. ${clientNotes ? `Note: "${clientNotes}"` : ''}`
      : `❌ Quote Declined by Client. ${clientNotes ? `Reason: "${clientNotes}"` : ''}`;

    await query(`
      INSERT INTO founder_os_change_request_comments (
        change_request_id, sender_type, sender_name, sender_id, message, is_internal_note
      ) VALUES ($1, 'Client', $2, $3, $4, FALSE)
    `, [
      crId,
      auth.user.full_name,
      auth.user.id,
      commentMsg
    ]);

    // Notify Admin
    await notifyAdminAboutClientAction({
      clientId: auth.client.id,
      clientName: auth.client.name,
      portalUserId: auth.user.id,
      projectId: changeRequest.project_id,
      projectName: changeRequest.project_name,
      actionTitle: `Quote ${decision} for Change Request [${changeRequest.reference_id}]`,
      details: `${auth.user.full_name} has ${decision.toLowerCase()} the quote of ₹${(changeRequest.quote_amount || 0).toLocaleString('en-IN')}. ${clientNotes ? `Client comments: "${clientNotes}"` : ''}`,
      category: 'Quote Decision'
    });

    return NextResponse.json({
      success: true,
      message: `Quotation ${decision.toLowerCase()} successfully.`,
      change_request: updateRes.rows[0]
    }, { headers: getPortalSecurityHeaders() });
  } catch (err) {
    console.error('Quote decision error:', err);
    return NextResponse.json({ success: false, error: 'Failed to record quote decision.' }, { status: 500, headers: getPortalSecurityHeaders() });
  }
}
