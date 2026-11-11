import path from 'path';

// Client uploads are private project files, so they live outside /public and are only
// served through /api/portal-files after a login check.
export const PORTAL_UPLOAD_DIR = path.join(process.cwd(), 'storage', 'portal-uploads');
// Files uploaded before this change sit in public/uploads/portal. next.config redirects
// those URLs to the protected route, so they are no longer open to everyone either.
export const LEGACY_PORTAL_DIR = path.join(process.cwd(), 'public', 'uploads', 'portal');

export const PORTAL_FILE_TYPES = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.pdf': 'application/pdf',
  '.doc': 'application/msword',
  '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  '.xls': 'application/vnd.ms-excel',
  '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  '.zip': 'application/zip',
  '.txt': 'text/plain',
  '.csv': 'text/csv',
};

const SAFE_NAME = /^[A-Za-z0-9_-]{1,80}\.[a-z0-9]{2,5}$/;

export function isSafePortalFileName(name) {
  return typeof name === 'string' && SAFE_NAME.test(name) && Object.hasOwn(PORTAL_FILE_TYPES, path.extname(name).toLowerCase());
}

export function portalFileUrl(name) {
  return `/api/portal-files/${name}`;
}

/**
 * Attachment links sent by the portal may only point to our own portal files or to a
 * normal https:// page. Anything else (javascript:, data:, other schemes) is dropped.
 */
export function safeAttachmentUrl(raw) {
  if (typeof raw !== 'string') return null;
  const value = raw.trim();
  if (!value || value.length > 2000) return null;
  const local = value.match(/^\/(?:api\/portal-files|uploads\/portal)\/([^/?#]+)$/);
  if (local) return isSafePortalFileName(local[1]) ? value : null;
  try {
    const parsed = new URL(value);
    return parsed.protocol === 'https:' && !parsed.username && !parsed.password ? parsed.toString() : null;
  } catch {
    return null;
  }
}
