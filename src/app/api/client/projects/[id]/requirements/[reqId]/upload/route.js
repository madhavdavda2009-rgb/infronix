import { NextResponse } from 'next/server';
import { 
  verifyClientAuth, 
  verifyClientProjectAccess, 
  getPortalSecurityHeaders 
} from '@/lib/client_auth';
import { query, initFounderOSDb } from '@/lib/founder_os_db';
import { notifyAdminAboutClientAction } from '@/lib/portal_notifications';
import path from 'path';
import fs from 'fs/promises';
import crypto from 'crypto';
import { PORTAL_UPLOAD_DIR, PORTAL_FILE_TYPES, portalFileUrl } from '@/lib/portal_files';

// Allowed MIME types and extensions
const ALLOWED_MIME_TYPES = new Set([
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/webp',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/zip',
  'application/x-zip-compressed',
  'text/plain',
  'text/csv'
]);

const FORBIDDEN_EXTENSIONS = new Set([
  '.exe', '.sh', '.bat', '.cmd', '.php', '.phtml', '.js', '.mjs', '.cjs',
  '.ts', '.py', '.pl', '.rb', '.cgi', '.jar', '.vbs', '.ps1', '.html', '.htm'
]);

const ALLOWED_EXTENSIONS = new Set([
  '.png', '.jpg', '.jpeg', '.webp', '.pdf', '.doc', '.docx', '.xls', '.xlsx', '.zip', '.txt', '.csv'
]);

const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15MB

export async function POST(request, { params }) {
  try {
    const auth = await verifyClientAuth(request);
    if (!auth) {
      return NextResponse.json({ success: false, error: 'Unauthorized.' }, { status: 401, headers: getPortalSecurityHeaders() });
    }

    if (auth.isAdminPreview) {
      return NextResponse.json({ success: false, error: 'File upload is disabled in Admin Preview mode.' }, { status: 403, headers: getPortalSecurityHeaders() });
    }

    await initFounderOSDb();
    const resolvedParams = await params;
    const { id, reqId } = resolvedParams;
    const projectId = parseInt(id, 10);
    const requirementId = parseInt(reqId, 10);

    const accessCheck = await verifyClientProjectAccess(auth.client.id, auth.user.id, projectId);
    if (!accessCheck.authorized) {
      return NextResponse.json({ success: false, error: 'Project not found.' }, { status: 404, headers: getPortalSecurityHeaders() });
    }

    // Verify requirement belongs to project
    const reqRes = await query('SELECT * FROM founder_os_client_requirements WHERE id = $1 AND project_id = $2', [requirementId, projectId]);
    if (reqRes.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Requirement item not found.' }, { status: 404, headers: getPortalSecurityHeaders() });
    }

    const requirement = reqRes.rows[0];

    const formData = await request.formData();
    const file = formData.get('file');
    const clientMessage = typeof formData.get('message') === 'string' ? formData.get('message').trim() : '';

    if (!file || typeof file === 'string') {
      return NextResponse.json({ success: false, error: 'No file uploaded.' }, { status: 400, headers: getPortalSecurityHeaders() });
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ success: false, error: 'File size exceeds maximum allowed limit of 15MB.' }, { status: 400, headers: getPortalSecurityHeaders() });
    }

    // Check MIME type
    const mimeType = (file.type || '').toLowerCase();
    if (!ALLOWED_MIME_TYPES.has(mimeType)) {
      return NextResponse.json({ success: false, error: 'Unsupported file format. Please upload PDF, images (PNG, JPG, WebP), DOCX, or ZIP files.' }, { status: 400, headers: getPortalSecurityHeaders() });
    }

    // Check extension
    const originalName = file.name || 'document';
    const ext = path.extname(originalName).toLowerCase();
    // Only known document/image extensions: anything else (.svg, .xhtml, .xml...) could run
    // script when opened from our domain, because these files are served from /public.
    if (FORBIDDEN_EXTENSIONS.has(ext) || !ALLOWED_EXTENSIONS.has(ext)) {
      return NextResponse.json({ success: false, error: 'Executable and script file uploads are strictly prohibited.' }, { status: 400, headers: getPortalSecurityHeaders() });
    }

    // Generate safe randomized filename
    const safeBaseName = path.basename(originalName, ext).replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 30);
    const uniqueSuffix = `${Date.now()}_${crypto.randomBytes(6).toString('hex')}`;
    const safeFileName = `${safeBaseName}_${uniqueSuffix}${ext}`;

    // Saved outside /public: only logged-in admins and this client can open it.
    await fs.mkdir(PORTAL_UPLOAD_DIR, { recursive: true });

    const filePath = path.join(PORTAL_UPLOAD_DIR, safeFileName);
    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(filePath, buffer);

    const publicUrl = portalFileUrl(safeFileName);
    const fileSizeFormatted = `${(file.size / (1024 * 1024)).toFixed(2)} MB`;

    // Update requirement record
    const updateRes = await query(`
      UPDATE founder_os_client_requirements
      SET uploaded_file_url = $1,
          uploaded_file_name = $2,
          uploaded_file_size = $3,
          uploaded_file_type = $4,
          client_message = $5,
          uploaded_at = NOW(),
          status = 'Submitted',
          portal_user_id = $6,
          updated_at = NOW()
      WHERE id = $7 AND project_id = $8
      RETURNING *
    `, [
      publicUrl,
      originalName,
      fileSizeFormatted,
      PORTAL_FILE_TYPES[ext] || mimeType,
      clientMessage,
      auth.user.id,
      requirementId,
      projectId
    ]);

    const updatedReq = updateRes.rows[0];

    // Notify admin
    await notifyAdminAboutClientAction({
      clientId: auth.client.id,
      clientName: auth.client.name,
      portalUserId: auth.user.id,
      projectId: projectId,
      projectName: accessCheck.project.project_name,
      actionTitle: `Requirement File Uploaded: ${requirement.item_name}`,
      details: `${auth.user.full_name} submitted "${originalName}" (${fileSizeFormatted}) for requirement "${requirement.item_name}". ${clientMessage ? `Note: "${clientMessage}"` : ''}`,
      category: 'File Upload'
    });

    return NextResponse.json({
      success: true,
      message: 'File uploaded successfully.',
      requirement: updatedReq
    }, { headers: getPortalSecurityHeaders() });
  } catch (err) {
    console.error('Requirement upload error:', err);
    return NextResponse.json({ success: false, error: 'Failed to process file upload.' }, { status: 500, headers: getPortalSecurityHeaders() });
  }
}
