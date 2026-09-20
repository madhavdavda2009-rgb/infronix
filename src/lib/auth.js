import jwt from 'jsonwebtoken';

export function verifyJwtToken(token) {
  if (!token) return null;
  try {
    const secret = process.env.JWT_SECRET || 'infronix_sec_jwt_key_2026_v99a7b2c';
    return jwt.verify(token, secret);
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
