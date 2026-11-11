import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import {
  MFA_COOKIE, verifyMfaToken, getAdminById, checkAdminCode, issueAdminSession, clearMfaCookie
} from '@/lib/admin_2fa';
import { checkAndRecord, getIp } from '@/lib/rate_limiter';

// Second login step: the password was already checked and left a 5-minute
// "admin_mfa" cookie. Here the Google Authenticator code (or a backup code) is checked.
export async function POST(request) {
  try {
    // Light per-network brake on top of the per-account lock stored in the database.
    const ipCheck = checkAndRecord(`admin_2fa:ip:${getIp(request)}`, { maxAttempts: 15, lockMs: 2 * 60 * 1000, windowMs: 2 * 60 * 1000 });
    if (!ipCheck.allowed) {
      return NextResponse.json({ success: false, error: ipCheck.message }, { status: 429 });
    }

    const cookieStore = await cookies();
    const pending = verifyMfaToken(cookieStore.get(MFA_COOKIE)?.value);
    if (!pending) {
      return NextResponse.json(
        { success: false, expired: true, error: 'Your sign-in step expired. Please enter your password again.' },
        { status: 401 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const admin = await getAdminById(pending.id);
    if (!admin || !admin.totp_enabled) {
      await clearMfaCookie();
      return NextResponse.json({ success: false, expired: true, error: 'Please sign in again.' }, { status: 401 });
    }

    const result = await checkAdminCode(admin, body.code);
    if (!result.ok) {
      return NextResponse.json({ success: false, locked: Boolean(result.locked), error: result.error }, { status: result.locked ? 429 : 401 });
    }

    await clearMfaCookie();
    if (!(await issueAdminSession(admin))) {
      return NextResponse.json({ success: false, error: 'Login is not configured on the server. Contact the site owner.' }, { status: 503 });
    }

    return NextResponse.json({
      success: true,
      message: 'Authentication successful.',
      used_backup_code: Boolean(result.usedBackup),
      backup_codes_left: result.usedBackup ? result.backupLeft : undefined,
      admin: { id: admin.id, username: admin.username }
    });
  } catch (error) {
    console.error('Admin 2FA login error:', error);
    return NextResponse.json({ success: false, error: 'An error occurred during authentication.' }, { status: 500 });
  }
}
