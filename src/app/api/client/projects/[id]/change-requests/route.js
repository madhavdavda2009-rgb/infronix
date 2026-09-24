import { NextResponse } from 'next/server';
import { 
  verifyClientAuth, 
  verifyClientProjectAccess, 
  getPortalSecurityHeaders 
} from '@/lib/client_auth';
import { query, initFounderOSDb } from '@/lib/founder_os_db';
import { notifyAdminAboutClientAction } from '@/lib/portal_notifications';
import crypto from 'crypto';

export async function GET(request, { params }) {
  try {
    const auth = await verifyClientAuth(request);
    if (!auth) {
      return NextResponse.json({ success: false, error: 'Unauthorized.' }, { status: 401, headers: getPortalSecurityHeaders() });
    }

    await initFounderOSDb();
    const resolvedParams = await params;
    const { id } = resolvedParams;
    const projectId = parseInt(id, 10);

    const accessCheck = await verifyClientProjectAccess(auth.client.id, auth.user.id, projectId);
    if (!accessCheck.authorized) {
      return NextResponse.json({ success: false, error: 'Project not found.' }, { status: 404, headers: getPortalSecurityHeaders() });
    }

    const crsRes = await query(`
      SELECT 
        cr.*,
        s.client_title as stage_title,
        COUNT(c.id) as comment_count
      FROM founder_os_client_change_requests cr
      LEFT JOIN founder_os_project_stages s ON s.id = cr.stage_id
      LEFT JOIN founder_os_change_request_comments c ON (c.change_request_id = cr.id AND c.is_internal_note = FALSE)
      WHERE cr.project_id = $1 AND cr.client_id = $2
      GROUP BY cr.id, s.client_title
      ORDER BY cr.created_at DESC
    `, [projectId, auth.client.id]);

    return NextResponse.json({
      success: true,
      change_requests: crsRes.rows
    }, { headers: getPortalSecurityHeaders() });
  } catch (err) {
    console.error('Client change requests get error:', err);
    return NextResponse.json({ success: false, error: 'Failed to retrieve change requests.' }, { status: 500, headers: getPortalSecurityHeaders() });
  }
}

export async function POST(request, { params }) {
  try {
    const auth = await verifyClientAuth(request);
    if (!auth) {
      return NextResponse.json({ success: false, error: 'Unauthorized.' }, { status: 401, headers: getPortalSecurityHeaders() });
    }

    if (auth.isAdminPreview) {
      return NextResponse.json({ success: false, error: 'Change request submission is disabled in Admin Preview mode.' }, { status: 403, headers: getPortalSecurityHeaders() });
    }

    await initFounderOSDb();
    const resolvedParams = await params;
    const { id } = resolvedParams;
    const projectId = parseInt(id, 10);

    const accessCheck = await verifyClientProjectAccess(auth.client.id, auth.user.id, projectId);
    if (!accessCheck.authorized) {
      return NextResponse.json({ success: false, error: 'Project not found.' }, { status: 404, headers: getPortalSecurityHeaders() });
    }

    if (accessCheck.project.change_requests_enabled === false) {
      return NextResponse.json({ success: false, error: 'Change requests are currently disabled for this project.' }, { status: 403, headers: getPortalSecurityHeaders() });
    }

    const body = await request.json();
    const title = typeof body.title === 'string' ? body.title.trim() : '';
    const description = typeof body.description === 'string' ? body.description.trim() : '';
    const category = typeof body.category === 'string' ? body.category.trim() : 'Content Change';
    const clientPriority = typeof body.priority === 'string' ? body.priority.trim() : 'Medium';
    const stageId = body.stage_id ? parseInt(body.stage_id, 10) : null;
    const pageRoute = typeof body.page_route === 'string' ? body.page_route.trim() : null;
    const attachmentUrl = typeof body.attachment_url === 'string' ? body.attachment_url.trim() : null;
    const attachmentName = typeof body.attachment_name === 'string' ? body.attachment_name.trim() : null;

    if (!title || !description) {
      return NextResponse.json({ success: false, error: 'Title and detailed description are required.' }, { status: 400, headers: getPortalSecurityHeaders() });
    }

    // Generate unique reference ID (e.g. CR-8F42A)
    const refSuffix = crypto.randomBytes(3).toString('hex').toUpperCase();
    const referenceId = `CR-${refSuffix}`;

    const insertRes = await query(`
      INSERT INTO founder_os_client_change_requests (
        reference_id, project_id, client_id, portal_user_id, stage_id,
        title, description, category, client_priority, admin_priority,
        page_route, attachment_url, attachment_name, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $9, $10, $11, $12, 'Submitted')
      RETURNING *
    `, [
      referenceId,
      projectId,
      auth.client.id,
      auth.user.id,
      stageId,
      title,
      description,
      category,
      clientPriority,
      pageRoute,
      attachmentUrl,
      attachmentName
    ]);

    const newCr = insertRes.rows[0];

    // Create initial comment record for the request
    await query(`
      INSERT INTO founder_os_change_request_comments (
        change_request_id, sender_type, sender_name, sender_id, message, attachment_url, attachment_name, is_internal_note
      ) VALUES ($1, 'Client', $2, $3, $4, $5, $6, FALSE)
    `, [
      newCr.id,
      auth.user.full_name,
      auth.user.id,
      `Change request created: ${description}`,
      attachmentUrl,
      attachmentName
    ]);

    // Notify Admin & Founder OS
    await notifyAdminAboutClientAction({
      clientId: auth.client.id,
      clientName: auth.client.name,
      portalUserId: auth.user.id,
      projectId: projectId,
      projectName: accessCheck.project.project_name,
      actionTitle: `New Change Request [${referenceId}]: ${title}`,
      details: `${auth.user.full_name} submitted a new ${category} change request (${clientPriority} priority): "${title}".`,
      category: 'Change Request'
    });

    return NextResponse.json({
      success: true,
      message: 'Change request submitted successfully. The InfronixWeb team will review scope and respond promptly.',
      change_request: newCr
    }, { headers: getPortalSecurityHeaders() });
  } catch (err) {
    console.error('Client change request submit error:', err);
    return NextResponse.json({ success: false, error: 'Failed to submit change request.' }, { status: 500, headers: getPortalSecurityHeaders() });
  }
}
