import fs from 'fs/promises';
import path from 'path';
import { verifyAdminAuth } from '@/lib/auth';
import { verifyClientAuth } from '@/lib/client_auth';
import { query } from '@/lib/founder_os_db';
import { PORTAL_UPLOAD_DIR, LEGACY_PORTAL_DIR, PORTAL_FILE_TYPES, isSafePortalFileName, portalFileUrl } from '@/lib/portal_files';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const PRIVATE_HEADERS = {
  'Cache-Control': 'private, no-store',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'no-referrer',
  'Content-Security-Policy': "default-src 'none'; img-src 'self'; style-src 'unsafe-inline'",
};

function notFound() {
  return new Response('Not found', { status: 404, headers: PRIVATE_HEADERS });
}

/** A client may open a file only if it is attached to one of their own projects. */
async function clientOwnsFile(clientId, name) {
  const urls = [portalFileUrl(name), `/uploads/portal/${name}`];
  const res = await query(`
    SELECT 1 FROM founder_os_client_requirements r
      JOIN founder_os_projects p ON p.id = r.project_id
     WHERE p.client_id = $1 AND r.uploaded_file_url = ANY($2)
    UNION ALL
    SELECT 1 FROM founder_os_client_change_requests cr
     WHERE cr.client_id = $1 AND cr.attachment_url = ANY($2)
    UNION ALL
    SELECT 1 FROM founder_os_change_request_comments c
      JOIN founder_os_client_change_requests cr ON cr.id = c.change_request_id
     WHERE cr.client_id = $1 AND c.attachment_url = ANY($2) AND c.is_internal_note IS NOT TRUE
    LIMIT 1
  `, [clientId, urls]);
  return res.rows.length > 0;
}

export async function GET(request, { params }) {
  const { name } = await params;
  if (!isSafePortalFileName(name)) return notFound();

  let allowed = Boolean(verifyAdminAuth(request));
  if (!allowed) {
    const auth = await verifyClientAuth(request);
    if (!auth) return new Response('Please log in to view this file.', { status: 401, headers: PRIVATE_HEADERS });
    try {
      allowed = await clientOwnsFile(auth.client.id, name);
    } catch (err) {
      console.error('Portal file access check failed:', err.message);
      return new Response('Unable to check access right now.', { status: 503, headers: PRIVATE_HEADERS });
    }
  }
  if (!allowed) return notFound();

  let buffer = null;
  for (const dir of [PORTAL_UPLOAD_DIR, LEGACY_PORTAL_DIR]) {
    try {
      buffer = await fs.readFile(path.join(dir, name));
      break;
    } catch {
      // try the next folder
    }
  }
  if (!buffer) return notFound();

  const ext = path.extname(name).toLowerCase();
  const type = PORTAL_FILE_TYPES[ext];
  const inline = /^(image\/|application\/pdf$)/.test(type) && new URL(request.url).searchParams.get('download') !== '1';
  return new Response(buffer, {
    headers: {
      ...PRIVATE_HEADERS,
      'Content-Type': inline ? type : 'application/octet-stream',
      'Content-Disposition': `${inline ? 'inline' : 'attachment'}; filename="${name}"`,
      'Content-Length': String(buffer.length),
    },
  });
}
