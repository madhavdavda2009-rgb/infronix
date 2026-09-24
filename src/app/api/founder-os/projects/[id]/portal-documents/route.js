import { NextResponse } from 'next/server';
import { verifyAdminAuth } from '@/lib/auth';
import { query, initFounderOSDb } from '@/lib/founder_os_db';
import { logActivity } from '@/lib/audit_logger';
import { notifyClient } from '@/lib/portal_notifications';

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

    const docsRes = await query(`
      SELECT * FROM founder_os_portal_documents
      WHERE project_id = $1
      ORDER BY published_date DESC, created_at DESC
    `, [projectId]);

    return NextResponse.json({
      success: true,
      documents: docsRes.rows
    });
  } catch (err) {
    console.error('Admin get portal docs error:', err);
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

    const projRes = await query('SELECT id, client_id, project_name FROM founder_os_projects WHERE id = $1', [projectId]);
    if (projRes.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Project not found' }, { status: 404 });
    }
    const project = projRes.rows[0];

    const body = await request.json();
    const title = typeof body.title === 'string' ? body.title.trim() : '';
    const category = typeof body.category === 'string' ? body.category.trim() : 'Project Brief';
    const description = typeof body.description === 'string' ? body.description.trim() : '';
    const fileUrl = typeof body.file_url === 'string' ? body.file_url.trim() : '';
    const fileName = typeof body.file_name === 'string' ? body.file_name.trim() : title;
    const fileSize = typeof body.file_size === 'string' ? body.file_size.trim() : '1.0 MB';
    const version = typeof body.version === 'string' ? body.version.trim() : '1.0';
    const isVisibleToClient = body.is_visible_to_client !== undefined ? Boolean(body.is_visible_to_client) : true;
    const isDownloadAllowed = body.is_download_allowed !== undefined ? Boolean(body.is_download_allowed) : true;

    if (!title || !fileUrl) {
      return NextResponse.json({ success: false, error: 'Title and File URL are required.' }, { status: 400 });
    }

    const insertRes = await query(`
      INSERT INTO founder_os_portal_documents (
        project_id, client_id, title, category, description, file_url, file_name, file_size,
        version, is_visible_to_client, is_download_allowed, published_date, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, CURRENT_DATE, NOW(), NOW())
      RETURNING *
    `, [
      projectId,
      project.client_id,
      title,
      category,
      description,
      fileUrl,
      fileName,
      fileSize,
      version,
      isVisibleToClient,
      isDownloadAllowed
    ]);

    const newDoc = insertRes.rows[0];

    await logActivity(
      auth.username || 'Admin',
      'Client Portal Document',
      projectId,
      `Published Document: ${title}`,
      `Published "${title}" (${category}) for project "${project.project_name}"`
    );

    if (isVisibleToClient && project.client_id) {
      await notifyClient({
        clientId: project.client_id,
        projectId: projectId,
        title: `New Deliverable Published: ${title}`,
        message: `A new document (${category}) "${title}" is now available to review/download in your portal documents.`,
        actionUrl: `/client/projects/${projectId}?tab=documents`,
        category: 'Document'
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Document published to client portal.',
      document: newDoc
    });
  } catch (err) {
    console.error('Admin create portal doc error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
