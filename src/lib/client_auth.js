import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { query, initFounderOSDb } from '@/lib/founder_os_db';
import { verifyAdminAuth } from '@/lib/auth';

/**
 * Generate a cryptographically secure, non-sequential Client ID.
 * Example format: IW-CL-7K9P2D
 */
export function generatePublicClientId() {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ'; // Excludes confusing characters like 0, 1, I, O
  let randomPart = '';
  const bytes = crypto.randomBytes(6);
  for (let i = 0; i < 6; i++) {
    randomPart += chars[bytes[i] % chars.length];
  }
  return `IW-CL-${randomPart}`;
}

/**
 * Resolves the accurate base URL for client portal links and emails based on request headers or env.
 */
export function getRequestBaseUrl(request) {
  if (process.env.APP_BASE_URL) return process.env.APP_BASE_URL.replace(/\/$/, '');
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '');
  
  if (request) {
    const host = request.headers?.get?.('x-forwarded-host') || request.headers?.get?.('host');
    if (host) {
      const proto = request.headers?.get?.('x-forwarded-proto') || (host.includes('localhost') || host.includes('127.0.0.1') ? 'http' : 'https');
      return `${proto}://${host}`;
    }
  }
  return 'http://localhost:3000';
}

/**
 * Generate a cryptographically secure random token (for setup/reset/sessions).
 */
export function generateSecureToken(byteLength = 32) {
  return crypto.randomBytes(byteLength).toString('hex');
}

/**
 * Generate a user-friendly secure temporary password.
 */
export function generateSecureTempPassword() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%';
  let pass = '';
  const bytes = crypto.randomBytes(12);
  for (let i = 0; i < 12; i++) {
    pass += chars[bytes[i] % chars.length];
  }
  return pass;
}

/**
 * Hash a token using SHA-256 (for single-use setup/reset tokens and session storage).
 */
export function hashToken(token) {
  if (!token) return null;
  return crypto.createHash('sha256').update(String(token).trim()).digest('hex');
}

/**
 * Hash a password using bcrypt.
 */
export async function hashPassword(plainPassword) {
  if (!plainPassword || typeof plainPassword !== 'string') {
    throw new Error('Invalid password provided for hashing');
  }
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(plainPassword, salt);
}

/**
 * Verify a plain password against a bcrypt hash.
 */
export async function verifyPassword(plainPassword, passwordHash) {
  if (!plainPassword || !passwordHash) return false;
  try {
    return await bcrypt.compare(plainPassword, passwordHash);
  } catch (err) {
    return false;
  }
}

/**
 * Hash an IP address for privacy-compliant rate limiting and approval logs.
 */
export function hashIp(ip) {
  if (!ip) return 'unknown';
  const secret = process.env.JWT_SECRET || 'infronix_ip_salt_2026';
  return crypto.createHmac('sha256', secret).update(String(ip)).digest('hex').substring(0, 32);
}

/**
 * Extract Client IP from Next.js request.
 */
export function getClientIp(request) {
  if (!request) return 'unknown';
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  const realIp = request.headers.get('x-real-ip');
  if (realIp) return realIp.trim();
  return '127.0.0.1';
}

/**
 * In-memory / DB Rate Limiting for Client Portal Logins.
 */
export async function checkRateLimit(identifier, ip) {
  try {
    await initFounderOSDb();
    const ipHash = hashIp(ip);

    // Check if account is locked
    const userRes = await query(`
      SELECT id, failed_login_count, locked_until, status 
      FROM founder_os_portal_users 
      WHERE (LOWER(public_client_id) = LOWER($1) OR LOWER(email) = LOWER($1))
    `, [identifier]);

    if (userRes.rows.length > 0) {
      const user = userRes.rows[0];
      if (user.status === 'Suspended' || user.status === 'Disabled') {
        return { allowed: false, reason: 'Account is not active. Please contact InfronixWeb support.' };
      }
      if (user.locked_until && new Date(user.locked_until) > new Date()) {
        const remainingMinutes = Math.ceil((new Date(user.locked_until).getTime() - Date.now()) / 60000);
        return { 
          allowed: false, 
          reason: `Account temporarily locked due to multiple failed attempts. Please try again in ${remainingMinutes} minute(s).` 
        };
      }
    }

    // Check IP rate limit in founder_os_ip_rate_limits
    const limitRes = await query(`
      SELECT failed_count, frozen_until 
      FROM founder_os_ip_rate_limits 
      WHERE ip = $1 AND context = 'client_portal_login'
    `, [ipHash]);

    if (limitRes.rows.length > 0) {
      const { failed_count, frozen_until } = limitRes.rows[0];
      if (frozen_until && new Date(frozen_until) > new Date()) {
        return { allowed: false, reason: 'Too many failed login attempts from this network. Please try again later.' };
      }
      if (failed_count >= 10) {
        return { allowed: false, reason: 'Too many requests. Please wait a few minutes before trying again.' };
      }
    }

    return { allowed: true };
  } catch (err) {
    console.warn('Rate limit check fallback:', err.message);
    return { allowed: true };
  }
}

/**
 * Record a failed login attempt.
 */
export async function recordFailedLogin(identifier, ip) {
  try {
    await initFounderOSDb();
    const ipHash = hashIp(ip);

    // Increment user failed count & apply temporary lockout if >= 5 attempts
    const userRes = await query(`
      SELECT id, failed_login_count 
      FROM founder_os_portal_users 
      WHERE (LOWER(public_client_id) = LOWER($1) OR LOWER(email) = LOWER($1))
    `, [identifier]);

    if (userRes.rows.length > 0) {
      const user = userRes.rows[0];
      const newCount = (user.failed_login_count || 0) + 1;
      let lockUntil = null;
      if (newCount >= 5) {
        lockUntil = new Date(Date.now() + 15 * 60 * 1000); // 15-minute lockout
      }

      await query(`
        UPDATE founder_os_portal_users 
        SET failed_login_count = $1, locked_until = $2, updated_at = NOW() 
        WHERE id = $3
      `, [newCount, lockUntil, user.id]);
    }

    // Increment IP failed count
    await query(`
      INSERT INTO founder_os_ip_rate_limits (ip, context, failed_count, last_attempt_at, updated_at)
      VALUES ($1, 'client_portal_login', 1, NOW(), NOW())
      ON CONFLICT (ip, context) DO UPDATE
      SET failed_count = founder_os_ip_rate_limits.failed_count + 1,
          last_attempt_at = NOW(),
          frozen_until = CASE WHEN founder_os_ip_rate_limits.failed_count >= 10 THEN NOW() + INTERVAL '15 minutes' ELSE founder_os_ip_rate_limits.frozen_until END,
          updated_at = NOW()
    `, [ipHash]);
  } catch (err) {
    console.warn('Could not record failed login:', err.message);
  }
}

/**
 * Reset failed login counters on successful authentication.
 */
export async function recordSuccessfulLogin(portalUserId, ip) {
  try {
    await initFounderOSDb();
    const ipHash = hashIp(ip);

    await query(`
      UPDATE founder_os_portal_users 
      SET failed_login_count = 0, locked_until = NULL, last_login = NOW(), updated_at = NOW() 
      WHERE id = $1
    `, [portalUserId]);

    await query(`
      DELETE FROM founder_os_ip_rate_limits 
      WHERE ip = $1 AND context = 'client_portal_login'
    `, [ipHash]);
  } catch (err) {
    console.warn('Could not record successful login:', err.message);
  }
}

/**
 * Create a new server-side session for an authenticated portal user.
 */
export async function createPortalSession(portalUserId, request, maxAgeSeconds = 86400 * 7) {
  await initFounderOSDb();
  const rawToken = generateSecureToken(32);
  const tokenHash = hashToken(rawToken);
  const ip = getClientIp(request);
  const ipHash = hashIp(ip);
  const userAgent = request?.headers?.get('user-agent') || 'Unknown';
  const expiresAt = new Date(Date.now() + maxAgeSeconds * 1000);

  await query(`
    INSERT INTO founder_os_portal_sessions (portal_user_id, session_token_hash, ip_hash, user_agent, expires_at)
    VALUES ($1, $2, $3, $4, $5)
  `, [portalUserId, tokenHash, ipHash, userAgent, expiresAt]);

  return { rawToken, expiresAt };
}

/**
 * Revoke a specific portal session.
 */
export async function revokePortalSession(rawToken) {
  if (!rawToken) return;
  try {
    await initFounderOSDb();
    const tokenHash = hashToken(rawToken);
    await query(`
      UPDATE founder_os_portal_sessions 
      SET is_revoked = TRUE 
      WHERE session_token_hash = $1
    `, [tokenHash]);
  } catch (err) {
    console.warn('Error revoking session:', err.message);
  }
}

/**
 * Revoke ALL active sessions for a given portal user (e.g. after password reset or suspension).
 */
export async function revokeAllUserSessions(portalUserId) {
  try {
    await initFounderOSDb();
    await query(`
      UPDATE founder_os_portal_sessions 
      SET is_revoked = TRUE 
      WHERE portal_user_id = $1 AND is_revoked = FALSE
    `, [portalUserId]);
  } catch (err) {
    console.warn('Error revoking all user sessions:', err.message);
  }
}

/**
 * Primary Authentication Middleware for Client Portal APIs.
 * Supports:
 * 1. Standard Client Session Cookie / Bearer Token
 * 2. Admin "View as Client" Preview Mode (read-only)
 */
export async function verifyClientAuth(request) {
  try {
    await initFounderOSDb();

    // 1. Check for Admin Preview Mode
    const adminAuth = verifyAdminAuth(request);
    const adminPreviewClientId = request?.headers?.get('x-admin-preview-client-id') || 
                                request?.nextUrl?.searchParams?.get('admin_preview_client_id');

    if (adminAuth && adminPreviewClientId) {
      const clientId = parseInt(adminPreviewClientId, 10);
      if (!isNaN(clientId) && clientId > 0) {
        const clientRes = await query('SELECT * FROM founder_os_clients WHERE id = $1', [clientId]);
        if (clientRes.rows.length > 0) {
          const client = clientRes.rows[0];
          // Mock a safe portal user structure for admin preview
          return {
            isAdminPreview: true,
            adminUser: adminAuth.username || 'admin',
            user: {
              id: -999,
              client_id: client.id,
              public_client_id: `ADMIN-PREVIEW-${client.id}`,
              full_name: `${client.name} (Admin Preview)`,
              email: client.email || 'preview@infronixweb.in',
              phone: client.phone || '',
              role_title: 'Client (Preview Mode)',
              status: 'Active',
              email_verified: true,
              must_change_password: false
            },
            client
          };
        }
      }
    }

    // 2. Extract Client Session Token
    let rawToken = null;

    if (request?.cookies?.get) {
      rawToken = request.cookies.get('client_session')?.value;
    }

    if (!rawToken && request?.headers) {
      const authHeader = request.headers.get('authorization') || request.headers.get('Authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        rawToken = authHeader.substring(7).trim();
      }
      if (!rawToken) {
        const cookieHeader = request.headers.get('cookie') || '';
        const match = cookieHeader.match(/(?:^|;\s*)client_session=([^;]+)/);
        if (match) {
          rawToken = decodeURIComponent(match[1]);
        }
      }
    }

    if (!rawToken) {
      return null;
    }

    const tokenHash = hashToken(rawToken);

    // Verify session in database
    const sessionRes = await query(`
      SELECT s.*, u.id as user_id, u.client_id, u.public_client_id, u.full_name, u.email, u.phone, 
             u.role_title, u.status, u.email_verified, u.must_change_password, u.password_changed_at,
             c.name as client_name, c.company as client_company, c.phone as client_phone, c.email as client_email
      FROM founder_os_portal_sessions s
      JOIN founder_os_portal_users u ON u.id = s.portal_user_id
      JOIN founder_os_clients c ON c.id = u.client_id
      WHERE s.session_token_hash = $1 
        AND s.is_revoked = FALSE 
        AND s.expires_at > NOW()
    `, [tokenHash]);

    if (sessionRes.rows.length === 0) {
      return null;
    }

    const row = sessionRes.rows[0];

    // Check account status
    if (row.status === 'Suspended' || row.status === 'Disabled') {
      return null;
    }

    const user = {
      id: row.user_id,
      client_id: row.client_id,
      public_client_id: row.public_client_id,
      full_name: row.full_name,
      email: row.email,
      phone: row.phone,
      role_title: row.role_title,
      status: row.status,
      email_verified: row.email_verified,
      must_change_password: row.must_change_password,
      password_changed_at: row.password_changed_at
    };

    const client = {
      id: row.client_id,
      name: row.client_name,
      company: row.client_company,
      phone: row.client_phone,
      email: row.client_email
    };

    return {
      isAdminPreview: false,
      rawToken,
      user,
      client
    };
  } catch (err) {
    console.error('verifyClientAuth error:', err);
    return null;
  }
}

/**
 * Strict Project Authorization Helper.
 * Prevents IDOR/BOLA: Ensures the requested project belongs to the authenticated client
 * and is enabled in the Client Portal.
 */
export async function verifyClientProjectAccess(clientId, portalUserId, projectId) {
  try {
    await initFounderOSDb();
    const pid = parseInt(projectId, 10);
    if (isNaN(pid) || pid <= 0) return { authorized: false, reason: 'Invalid project identifier' };

    const res = await query(`
      SELECT p.*,
             COALESCE(s.portal_enabled, TRUE) as portal_enabled,
             s.portal_display_name,
             s.client_summary,
             s.client_announcement,
             s.preview_enabled,
             s.preview_url,
             s.preview_label,
             s.preview_status,
             s.preview_instructions,
             COALESCE(s.change_requests_enabled, TRUE) as change_requests_enabled,
             s.change_request_policy,
             COALESCE(s.visible_financials, TRUE) as visible_financials,
             pa.can_view_payments,
             pa.can_submit_change_requests,
             pa.can_upload_files,
             pa.can_approve_deliverables
      FROM founder_os_projects p
      LEFT JOIN founder_os_project_portal_settings s ON s.project_id = p.id
      LEFT JOIN founder_os_portal_project_access pa ON (pa.project_id = p.id AND pa.portal_user_id = $2)
      WHERE p.id = $1 AND p.client_id = $3
    `, [pid, portalUserId || 0, clientId]);

    if (res.rows.length === 0) {
      return { authorized: false, reason: 'Project not found or not assigned to your account' };
    }

    const project = res.rows[0];

    // Check if project is enabled in portal
    if (project.portal_enabled === false) {
      return { authorized: false, reason: 'Portal access for this project is currently unavailable' };
    }

    return {
      authorized: true,
      project
    };
  } catch (err) {
    console.error('verifyClientProjectAccess error:', err);
    return { authorized: false, reason: 'Authorization verification failed' };
  }
}

/**
 * Standard Security Headers for Client Portal API responses.
 */
export function getPortalSecurityHeaders() {
  return {
    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'Referrer-Policy': 'no-referrer'
  };
}
