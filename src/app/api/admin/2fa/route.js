import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { execute } from '@/lib/db';
import { verifyAdminAuth } from '@/lib/auth';
import {
  getAdminById, readSecret, sealSecret, backupCodesLeft, checkAdminCode
} from '@/lib/admin_2fa';
import { generateTotpSecret, otpauthUri, generateBackupCodes, hashBackupCode, verifyTotp } from '@/lib/totp';
import { logActivity } from '@/lib/audit_logger';

const NO_STORE = { 'Cache-Control': 'no-store' };

function json(body, status = 200) {
  return NextResponse.json(body, { status, headers: NO_STORE });
}

function freshBackupCodes() {
  const codes = generateBackupCodes(10);
  return { codes, stored: JSON.stringify(codes.map(hashBackupCode)) };
}

async function audit(admin, action, details) {
  try {
    await logActivity(admin.username || 'admin', 'Security', admin.id, action, details);
  } catch {
    // the audit log is helpful but must never block a security change
  }
}

/** Status of Google Authenticator login for the signed-in admin. */
export async function GET(request) {
  const session = verifyAdminAuth(request);
  if (!session) return json({ success: false, error: 'Unauthorized' }, 401);
  try {
    const admin = await getAdminById(session.id);
    if (!admin) return json({ success: false, error: 'Admin account not found.' }, 404);
    return json({
      success: true,
      enabled: Boolean(admin.totp_enabled),
      enabled_at: admin.totp_enabled_at || null,
      backup_codes_left: admin.totp_enabled ? backupCodesLeft(admin) : 0
    });
  } catch (error) {
    console.error('2FA status error:', error);
    return json({ success: false, error: 'Could not load two-step login status.' }, 500);
  }
}

/**
 * Actions:
 *  start      -> new secret + QR link (not active until confirmed)
 *  enable     -> confirm the first code, switch 2FA on, return backup codes once
 *  regenerate -> new backup codes (needs a current code)
 *  disable    -> switch 2FA off (needs password + a current or backup code)
 */
export async function POST(request) {
  const session = verifyAdminAuth(request);
  if (!session) return json({ success: false, error: 'Unauthorized' }, 401);

  try {
    const body = await request.json().catch(() => ({}));
    const admin = await getAdminById(session.id);
    if (!admin) return json({ success: false, error: 'Admin account not found.' }, 404);

    if (body.action === 'start') {
      if (admin.totp_enabled) return json({ success: false, error: 'Two-step login is already on.' }, 400);
      const secret = generateTotpSecret();
      await execute('UPDATE admins SET totp_pending_secret = ? WHERE id = ?', [sealSecret(secret), admin.id]);
      return json({
        success: true,
        secret,
        otpauth_uri: otpauthUri(secret, `Founder OS (${admin.username})`)
      });
    }

    if (body.action === 'enable') {
      if (admin.totp_enabled) return json({ success: false, error: 'Two-step login is already on.' }, 400);
      const secret = readSecret(admin.totp_pending_secret);
      if (!secret) return json({ success: false, error: 'Setup expired. Please start again.' }, 400);
      const step = verifyTotp(secret, body.code, 0);
      if (step === null) {
        return json({ success: false, error: 'That code did not match. Check the time on your phone and try the newest code.' }, 400);
      }
      const { codes, stored } = freshBackupCodes();
      await execute(`
        UPDATE admins
        SET totp_secret = totp_pending_secret, totp_pending_secret = NULL, totp_enabled = TRUE,
            totp_backup_codes = ?, totp_last_step = ?, totp_failed_count = 0, totp_locked_until = NULL,
            totp_enabled_at = NOW()
        WHERE id = ?
      `, [stored, step, admin.id]);
      await audit(admin, 'Enabled 2FA', 'Google Authenticator two-step login switched on');
      return json({ success: true, backup_codes: codes });
    }

    if (body.action === 'regenerate') {
      if (!admin.totp_enabled) return json({ success: false, error: 'Two-step login is off.' }, 400);
      const check = await checkAdminCode(admin, body.code, { allowBackup: false });
      if (!check.ok) return json({ success: false, error: check.error }, check.locked ? 429 : 400);
      const { codes, stored } = freshBackupCodes();
      await execute('UPDATE admins SET totp_backup_codes = ? WHERE id = ?', [stored, admin.id]);
      await audit(admin, 'New 2FA backup codes', 'Old backup codes were replaced');
      return json({ success: true, backup_codes: codes });
    }

    if (body.action === 'disable') {
      if (!admin.totp_enabled) return json({ success: false, error: 'Two-step login is already off.' }, 400);
      const passwordOk = typeof body.password === 'string' && await bcrypt.compare(body.password, admin.password_hash);
      if (!passwordOk) return json({ success: false, error: 'Incorrect password.' }, 400);
      const check = await checkAdminCode(admin, body.code);
      if (!check.ok) return json({ success: false, error: check.error }, check.locked ? 429 : 400);
      await execute(`
        UPDATE admins
        SET totp_enabled = FALSE, totp_secret = NULL, totp_pending_secret = NULL, totp_backup_codes = NULL,
            totp_failed_count = 0, totp_locked_until = NULL, totp_enabled_at = NULL
        WHERE id = ?
      `, [admin.id]);
      await audit(admin, 'Disabled 2FA', 'Google Authenticator two-step login switched off');
      return json({ success: true });
    }

    return json({ success: false, error: 'Unknown action.' }, 400);
  } catch (error) {
    console.error('2FA settings error:', error);
    return json({ success: false, error: 'Could not update two-step login. Please try again.' }, 500);
  }
}
