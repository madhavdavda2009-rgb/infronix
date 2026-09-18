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
    const token = request.cookies?.get ? request.cookies.get('admin_token')?.value : null;

    if (!token) {
      return null;
    }

    return verifyJwtToken(token);
  } catch (error) {
    return null;
  }
}
