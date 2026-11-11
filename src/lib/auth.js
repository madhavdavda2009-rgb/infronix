import jwt from 'jsonwebtoken';

// Local development keeps working without a .env file, but a live server must
// have its own secrets: a fallback written in the source code is public, and
// anyone who reads it could sign their own admin login.
const DEV_FALLBACK_SECRET = 'infronix-local-dev-only-secret';

/**
 * Returns the server secret named by `name` (falling back to JWT_SECRET).
 * In production a missing or short secret returns null so callers fail closed.
 */
// Secrets that were once written in this repository. They are public, so never accept them.
const LEAKED_SECRETS = new Set([
  'infronix_sec_jwt_key_2026_v99a7b2c',
  'infronix_blog_preview_secret_salt_2026',
  'infronix_ip_salt_2026',
  'infronix_sign_otp',
]);

export function getServerSecret(name = 'JWT_SECRET') {
  const value = (process.env[name] || process.env.JWT_SECRET || '').trim();
  if (value && !LEAKED_SECRETS.has(value)) {
    if (value.length < 32) console.warn(`[security] ${name} is short. Use 32+ random characters.`);
    return value;
  }
  if (process.env.NODE_ENV !== 'production') return DEV_FALLBACK_SECRET;
  console.error(`[security] ${name} is missing or is a leaked default. Set a new one on the server.`);
  return null;
}

export function verifyJwtToken(token) {
  if (!token) return null;
  const secret = getServerSecret();
  if (!secret) return null;
  try {
    const payload = jwt.verify(token, secret, { algorithms: ['HS256'] });
    // Step tokens (e.g. "password OK, waiting for the 2FA code") are never a full login.
    if (payload?.purpose) return null;
    return payload;
  } catch (error) {
    return null;
  }
}

export function verifyAdminAuth(request) {
  try {
    let token = null;

    if (request?.cookies?.get) {
      token = request.cookies.get('admin_token')?.value;
    }

    if (!token && request?.headers) {
      const authHeader = request.headers.get('authorization') || request.headers.get('Authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7).trim();
      }
      if (!token) {
        const cookieHeader = request.headers.get('cookie') || '';
        const match = cookieHeader.match(/(?:^|;\s*)admin_token=([^;]+)/);
        if (match) {
          token = decodeURIComponent(match[1]);
        }
      }
    }

    if (!token) {
      return null;
    }

    return verifyJwtToken(token);
  } catch (error) {
    return null;
  }
}
