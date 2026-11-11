import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { execute } from '@/lib/db';
import { getServerSecret } from '@/lib/auth';
import { encrypt, decrypt } from '@/lib/crypto';
import { verifyTotp, currentStep, hashBackupCode, normaliseBackupCode } from '@/lib/totp';

// Google Authenticator (TOTP) two-step login for Founder OS admins.
// The authenticator secret is stored encrypted with ENCRYPTION_KEY; backup codes
// are stored only as SHA-256 hashes and each one works once.

export const MFA_COOKIE = 'admin_mfa';
const MFA_TOKEN_MINUTES = 5;
const LOCK_EVERY = 5; // wrong codes before a pause
const SHORT_LOCK_MS = 2 * 60 * 1000;
const LONG_LOCK_MS = 60 * 60 * 1000; // after 20 wrong codes in a row

let columnsReady = Boolean(globalThis._admin_2fa_columns_ready);

export async function ensureAdmin2faColumns() {
  if (columnsReady) return;
  await execute(`
    ALTER TABLE admins
      ADD COLUMN IF NOT EXISTS totp_secret TEXT,
      ADD COLUMN IF NOT EXISTS totp_pending_secret TEXT,
      ADD COLUMN IF NOT EXISTS totp_enabled BOOLEAN NOT NULL DEFAULT FALSE,
      ADD COLUMN IF NOT EXISTS totp_backup_codes TEXT,
      ADD COLUMN IF NOT EXISTS totp_last_step BIGINT NOT NULL DEFAULT 0,
      ADD COLUMN IF NOT EXISTS totp_failed_count INTEGER NOT NULL DEFAULT 0,
      ADD COLUMN IF NOT EXISTS totp_locked_until TIMESTAMP WITH TIME ZONE,
      ADD COLUMN IF NOT EXISTS totp_enabled_at TIMESTAMP WITH TIME ZONE
  `);
  columnsReady = true;
  globalThis._admin_2fa_columns_ready = true;
}

export async function getAdminById(adminId) {
  await ensureAdmin2faColumns();
  const [rows] = await execute('SELECT * FROM admins WHERE id = ? LIMIT 1', [adminId]);
  return rows[0] || null;
}

export function readSecret(stored) {
  if (!stored) return null;
  const value = decrypt(stored);
  return /^[A-Z2-7]{16,}$/.test(value || '') ? value : null;
}

export function sealSecret(secret) {
  return encrypt(secret);
}

export function backupCodesLeft(admin) {
  try {
    return JSON.parse(admin?.totp_backup_codes || '[]').length;
  } catch {
    return 0;
  }
}

// ── Short-lived "password OK, waiting for the code" token ─────────────────────

function mfaSecret() {
  const secret = getServerSecret();
  return secret ? `${secret}:admin-mfa` : null;
}

export function signMfaToken(adminId) {
  const secret = mfaSecret();
  if (!secret) return null;
  return jwt.sign({ id: adminId, purpose: 'admin_mfa' }, secret, { expiresIn: `${MFA_TOKEN_MINUTES}m`, algorithm: 'HS256' });
}

export function verifyMfaToken(token) {
  const secret = mfaSecret();
  if (!token || !secret) return null;
  try {
    const payload = jwt.verify(token, secret, { algorithms: ['HS256'] });
    return payload.purpose === 'admin_mfa' ? payload : null;
  } catch {
    return null;
  }
}

export async function setMfaCookie(adminId) {
  const token = signMfaToken(adminId);
  if (!token) return false;
  const cookieStore = await cookies();
  cookieStore.set(MFA_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/api/admin',
    maxAge: MFA_TOKEN_MINUTES * 60,
  });
  return true;
}

export async function clearMfaCookie() {
  const cookieStore = await cookies();
  cookieStore.set(MFA_COOKIE, '', { httpOnly: true, sameSite: 'strict', path: '/api/admin', maxAge: 0 });
}

/** The full admin session cookie, issued only after every login step passed. */
export async function issueAdminSession(admin) {
  const secret = getServerSecret();
  if (!secret) return false;
  const token = jwt.sign({ id: admin.id, username: admin.username }, secret, { expiresIn: '8h', algorithm: 'HS256' });
  const cookieStore = await cookies();
  cookieStore.set('admin_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 8 * 60 * 60,
  });
  return true;
}

// ── Checking a code ──────────────────────────────────────────────────────────

function lockMessage(until) {
  const seconds = Math.max(1, Math.ceil((new Date(until).getTime() - Date.now()) / 1000));
  const minutes = Math.ceil(seconds / 60);
  return `Too many wrong codes. Try again in ${minutes} minute${minutes !== 1 ? 's' : ''}.`;
}

async function recordWrongCode(admin) {
  const failed = Number(admin.totp_failed_count || 0) + 1;
  let lockedUntil = null;
  if (failed % LOCK_EVERY === 0) {
    lockedUntil = new Date(Date.now() + (failed >= 20 ? LONG_LOCK_MS : SHORT_LOCK_MS));
  }
  await execute('UPDATE admins SET totp_failed_count = ?, totp_locked_until = ? WHERE id = ?', [failed, lockedUntil, admin.id]);
  if (lockedUntil) return { ok: false, locked: true, error: lockMessage(lockedUntil) };
  const left = LOCK_EVERY - (failed % LOCK_EVERY);
  return { ok: false, error: `Incorrect code. ${left} attempt${left !== 1 ? 's' : ''} left before a short pause.` };
}

/**
 * Checks an authenticator code or a backup code for an admin with 2FA on.
 * `secretOverride` lets setup check a code against the not-yet-enabled secret.
 */
export async function checkAdminCode(admin, rawCode, { secretOverride = null, allowBackup = true } = {}) {
  if (admin.totp_locked_until && new Date(admin.totp_locked_until) > new Date()) {
    return { ok: false, locked: true, error: lockMessage(admin.totp_locked_until) };
  }
  const code = String(rawCode || '').trim();
  const secret = secretOverride || readSecret(admin.totp_secret);
  if (!secret) return { ok: false, error: 'Two-step login is not set up correctly. Contact the site owner.' };

  if (/^\d{6}$/.test(code.replace(/\s/g, ''))) {
    const step = verifyTotp(secret, code, admin.totp_last_step);
    if (step !== null) {
      // Saving the step only if it is newer stops the same code being used twice.
      const [res] = await execute(
        'UPDATE admins SET totp_last_step = ?, totp_failed_count = 0, totp_locked_until = NULL WHERE id = ? AND totp_last_step < ?',
        [step, admin.id, step]
      );
      if (res.affectedRows === 1) return { ok: true, step };
    }
    return recordWrongCode(admin);
  }

  if (allowBackup && normaliseBackupCode(code).length === 8) {
    let hashes = [];
    try { hashes = JSON.parse(admin.totp_backup_codes || '[]'); } catch { hashes = []; }
    const hash = hashBackupCode(code);
    if (hashes.includes(hash)) {
      const remaining = JSON.stringify(hashes.filter(h => h !== hash));
      // Only succeeds if nobody used this code in the meantime.
      const [res] = await execute(
        'UPDATE admins SET totp_backup_codes = ?, totp_failed_count = 0, totp_locked_until = NULL WHERE id = ? AND totp_backup_codes = ?',
        [remaining, admin.id, admin.totp_backup_codes]
      );
      if (res.affectedRows === 1) return { ok: true, usedBackup: true, backupLeft: hashes.length - 1 };
    }
    return recordWrongCode(admin);
  }

  return { ok: false, error: 'Enter the 6-digit code from Google Authenticator, or a backup code.' };
}

export { currentStep };
