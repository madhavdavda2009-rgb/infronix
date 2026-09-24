import { NextResponse } from 'next/server';
import { 
  verifyClientAuth, 
  verifyClientProjectAccess, 
  getClientIp, 
  hashIp, 
  getPortalSecurityHeaders 
} from '@/lib/client_auth';
import { query, initFounderOSDb } from '@/lib/founder_os_db';
import { notifyAdminAboutClientAction } from '@/lib/portal_notifications';

export async function POST(request) {
  try {
    const auth = await verifyClientAuth(request);
    if (!auth) {
      return NextResponse.json({ success: false, error: 'Unauthorized.' }, { status: 401, headers: getPortalSecurityHeaders() });
    }

    if (auth.isAdminPreview) {
      return NextResponse.json({ success: false, error: 'Approvals are disabled in Admin Preview mode.' }, { status: 403, headers: getPortalSecurityHeaders() });
    }

    await initFounderOSDb();
    const body = await request.json();
    const projectId = parseInt(body.project_id, 10);
    const approvalType = typeof body.approval_type === 'string' ? body.approval_type.trim() : 'Deliverable';
    const deliverableTitle = typeof body.deliverable_title === 'string' ? body.deliverable_title.trim() : '';
    const version = typeof body.version === 'string' ? body.version.trim() : '1.0';
    const documentHash = typeof body.document_hash === 'string' ? body.document_hash.trim() : null;
    const clientComment = typeof body.client_comment === 'string' ? body.client_comment.trim() : '';

    if (!projectId || !deliverableTitle) {
      return NextResponse.json({ success: false, error: 'Project ID and deliverable title are required.' }, { status: 400, headers: getPortalSecurityHeaders() });
    }

    const accessCheck = await verifyClientProjectAccess(auth.client.id, auth.user.id, projectId);
    if (!accessCheck.authorized) {
      return NextResponse.json({ success: false, error: 'Project not found.' }, { status: 404, headers: getPortalSecurityHeaders() });
    }

    const ip = getClientIp(request);
    const ipHash = hashIp(ip);

    const insertRes = await query(`
      INSERT INTO founder_os_client_approvals (
        project_id, portal_user_id, client_id, approval_type, deliverable_title, version, document_hash, client_comment, ip_hash
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `, [
      projectId,
      auth.user.id,
      auth.client.id,
      approvalType,
      deliverableTitle,
      version,
      documentHash,
      clientComment,
      ipHash
    ]);

    const approval = insertRes.rows[0];

    // Notify Admin
    await notifyAdminAboutClientAction({
      clientId: auth.client.id,
      clientName: auth.client.name,
      portalUserId: auth.user.id,
      projectId: projectId,
      projectName: accessCheck.project.project_name,
      actionTitle: `Client ${approvalType} Approval: ${deliverableTitle}`,
      details: `${auth.user.full_name} confirmed formal approval for "${deliverableTitle}" (v${version}). ${clientComment ? `Comment: "${clientComment}"` : ''}`,
      category: 'Deliverable Approval'
    });

    return NextResponse.json({
      success: true,
      message: `${approvalType} approved successfully. Thank you for your confirmation.`,
      approval
    }, { headers: getPortalSecurityHeaders() });
  } catch (err) {
    console.error('Client deliverable approval error:', err);
    return NextResponse.json({ success: false, error: 'Failed to record approval.' }, { status: 500, headers: getPortalSecurityHeaders() });
  }
}
