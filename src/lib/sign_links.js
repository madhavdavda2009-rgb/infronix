import crypto from 'crypto';
import { query } from '@/lib/founder_os_db';
import { initClientDocumentsDb, hashDocumentContent } from '@/lib/client_documents';
import { SITE_URL } from '@/lib/document_templates';

// Login-free signing links. Security model:
// - the URL carries a 256-bit random token; only its SHA-256 is stored
// - opening the link shows nothing confidential until a 6-digit code emailed to
//   the client is verified (so a leaked link alone cannot be used)
// - links expire, can be revoked, lock after repeated wrong codes, and die once signed

export const LINK_TTL_DAYS = 7;
export const OTP_TTL_MINUTES = 10;
export const OTP_MAX_ATTEMPTS = 5;
export const OTP_MAX_SENDS = 5;
export const OTP_RESEND_SECONDS = 60;
export const SESSION_TTL_MINUTES = 30;

let ensured = Boolean(globalThis._sign_links_table_ready);

export async function initSignLinksDb() {
  await initClientDocumentsDb();
  if (ensured) return;
  await query(`
    CREATE TABLE IF NOT EXISTS founder_os_document_sign_links (
      id SERIAL PRIMARY KEY,
      document_id INTEGER NOT NULL REFERENCES founder_os_client_documents(id) ON DELETE CASCADE,
      token_hash VARCHAR(64) UNIQUE NOT NULL,
      email VARCHAR(255) NOT NULL,
      expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
      revoked_at TIMESTAMP WITH TIME ZONE,
      revoked_reason VARCHAR(100),
      used_at TIMESTAMP WITH TIME ZONE,
      otp_hash VARCHAR(64),
      otp_expires_at TIMESTAMP WITH TIME ZONE,
      otp_attempts INTEGER NOT NULL DEFAULT 0,
      otp_sent_count INTEGER NOT NULL DEFAULT 0,
      otp_last_sent_at TIMESTAMP WITH TIME ZONE,
      session_hash VARCHAR(64),
      session_expires_at TIMESTAMP WITH TIME ZONE,
      verified_at TIMESTAMP WITH TIME ZONE,
      created_by VARCHAR(255),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
    CREATE INDEX IF NOT EXISTS idx_sign_links_document ON founder_os_document_sign_links(document_id);
  `);
  ensured = true;
  globalThis._sign_links_table_ready = true;
}

export function sha256(value) {
  return crypto.createHash('sha256').update(String(value)).digest('hex');
}

function otpHash(linkId, code) {
  const secret = process.env.JWT_SECRET || 'infronix_sign_otp';
  return crypto.createHmac('sha256', secret).update(`${linkId}:${code}`).digest('hex');
}

export function maskEmail(email) {
  const [user, domain] = String(email || '').split('@');
  if (!domain) return '';
  return `${user[0] || ''}${'•'.repeat(Math.max(user.length - 1, 3))}@${domain}`;
}

export function signUrl(token) {
  return `${SITE_URL}/sign/${token}`;
}

/**
 * Creates a fresh signing link for a document (revoking older ones) and returns the raw
 * token once. Draft documents are issued (hash + Sent) so the client signs a fixed version.
 */
export async function createSignLink(doc, { email, createdBy }) {
  await initSignLinksDb();
  const target = String(email || '').trim();
  if (!target.includes('@')) throw new Error('A client email is needed for the verification code');

  if (doc.status === 'Draft') {
    await query(`
      UPDATE founder_os_client_documents
      SET status = 'Sent', sent_at = COALESCE(sent_at, NOW()), content_hash = $1, updated_at = NOW()
      WHERE id = $2
    `, [hashDocumentContent(doc), doc.id]);
  }

  await query(`
    UPDATE founder_os_document_sign_links SET revoked_at = NOW(), revoked_reason = 'Replaced'
    WHERE document_id = $1 AND revoked_at IS NULL AND used_at IS NULL
  `, [doc.id]);

  const token = crypto.randomBytes(32).toString('hex');
  await query(`
    INSERT INTO founder_os_document_sign_links (document_id, token_hash, email, expires_at, created_by)
    VALUES ($1, $2, $3, NOW() + ($4 || ' days')::interval, $5)
  `, [doc.id, sha256(token), target.toLowerCase(), String(LINK_TTL_DAYS), createdBy || 'admin']);
  return token;
}

export async function revokeSignLinks(documentId, reason = 'Revoked by InfronixWeb') {
  await initSignLinksDb();
  const res = await query(`
    UPDATE founder_os_document_sign_links SET revoked_at = NOW(), revoked_reason = $2
    WHERE document_id = $1 AND revoked_at IS NULL AND used_at IS NULL
    RETURNING id
  `, [documentId, reason]);
  return res.rowCount;
}

export async function getActiveLinkStatus(documentId) {
  await initSignLinksDb();
  const res = await query(`
    SELECT id, email, expires_at, verified_at, used_at, revoked_at, revoked_reason, otp_attempts, created_at
    FROM founder_os_document_sign_links
    WHERE document_id = $1
    ORDER BY id DESC LIMIT 1
  `, [documentId]);
  const link = res.rows[0];
  if (!link) return null;
  const expired = new Date(link.expires_at) < new Date();
  return {
    email: link.email,
    created_at: link.created_at,
    expires_at: link.expires_at,
    verified_at: link.verified_at,
    used_at: link.used_at,
    state: link.used_at ? 'Used' : link.revoked_at ? (link.revoked_reason === 'Too many wrong codes' ? 'Locked' : 'Revoked') : expired ? 'Expired' : 'Active',
  };
}

/** Resolves a raw token to its link + document, with the reason it can't be used (if any). */
export async function loadLink(token) {
  await initSignLinksDb();
  if (!/^[a-f0-9]{64}$/.test(String(token || ''))) return { error: 'invalid' };
  const res = await query(`
    SELECT l.*, d.id AS doc_id, d.doc_number, d.doc_type, d.title, d.data, d.status AS doc_status,
           d.content_hash, d.client_id, d.project_id, d.requires_signature, d.signer_name, d.signed_at
    FROM founder_os_document_sign_links l
    JOIN founder_os_client_documents d ON d.id = l.document_id
    WHERE l.token_hash = $1
  `, [sha256(token)]);
  const link = res.rows[0];
  if (!link) return { error: 'invalid' };
  if (link.doc_status === 'Signed') return { link, error: 'signed' };
  if (link.revoked_at) return { link, error: link.revoked_reason === 'Too many wrong codes' ? 'locked' : 'revoked' };
  if (new Date(link.expires_at) < new Date()) return { link, error: 'expired' };
  if (link.doc_status === 'Draft') return { link, error: 'revoked' };
  return { link };
}

export async function issueOtp(link) {
  if (link.otp_sent_count >= OTP_MAX_SENDS) {
    return { error: 'Too many codes requested. Please ask InfronixWeb for a new link.' };
  }
  if (link.otp_last_sent_at && Date.now() - new Date(link.otp_last_sent_at).getTime() < OTP_RESEND_SECONDS * 1000) {
    return { error: `Please wait a minute before requesting another code.` };
  }
  const code = String(crypto.randomInt(0, 1000000)).padStart(6, '0');
  await query(`
    UPDATE founder_os_document_sign_links
    SET otp_hash = $1, otp_expires_at = NOW() + ($2 || ' minutes')::interval, otp_attempts = 0,
        otp_sent_count = otp_sent_count + 1, otp_last_sent_at = NOW()
    WHERE id = $3
  `, [otpHash(link.id, code), String(OTP_TTL_MINUTES), link.id]);
  return { code };
}

/** Checks a code; on success returns a short-lived session token for viewing and signing. */
export async function verifyOtp(link, code) {
  if (!link.otp_hash || !link.otp_expires_at || new Date(link.otp_expires_at) < new Date()) {
    return { error: 'This code has expired. Please request a new one.' };
  }
  const expected = Buffer.from(link.otp_hash, 'hex');
  const actual = Buffer.from(otpHash(link.id, String(code || '').trim()), 'hex');
  if (expected.length !== actual.length || !crypto.timingSafeEqual(expected, actual)) {
    const attempts = link.otp_attempts + 1;
    if (attempts >= OTP_MAX_ATTEMPTS) {
      await query(`
        UPDATE founder_os_document_sign_links
        SET otp_attempts = $1, revoked_at = NOW(), revoked_reason = 'Too many wrong codes', otp_hash = NULL
        WHERE id = $2
      `, [attempts, link.id]);
      return { error: 'Too many wrong codes. This link is now locked – please ask InfronixWeb for a new one.', locked: true };
    }
    await query('UPDATE founder_os_document_sign_links SET otp_attempts = $1 WHERE id = $2', [attempts, link.id]);
    return { error: `Incorrect code. ${OTP_MAX_ATTEMPTS - attempts} attempt(s) left.` };
  }
  const session = crypto.randomBytes(32).toString('hex');
  await query(`
    UPDATE founder_os_document_sign_links
    SET otp_hash = NULL, verified_at = COALESCE(verified_at, NOW()), session_hash = $1,
        session_expires_at = NOW() + ($2 || ' minutes')::interval
    WHERE id = $3
  `, [sha256(session), String(SESSION_TTL_MINUTES), link.id]);
  return { session };
}

export function sessionValid(link, session) {
  if (!link.session_hash || !link.session_expires_at || !/^[a-f0-9]{64}$/.test(String(session || ''))) return false;
  if (new Date(link.session_expires_at) < new Date()) return false;
  const a = Buffer.from(link.session_hash, 'hex');
  const b = Buffer.from(sha256(session), 'hex');
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}
