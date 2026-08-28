import jwt from 'jsonwebtoken';

export function verifyAdminAuth(request) {
  try {
    const token = request.cookies.get('admin_token')?.value;

    if (!token) {
      return null;
    }

    const secret = process.env.JWT_SECRET || 'infronix_sec_jwt_key_2026_v99a7b2c';
    const decoded = jwt.verify(token, secret);
    
    return decoded;
  } catch (error) {
    return null;
  }
}
