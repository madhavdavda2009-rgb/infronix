import jwt from 'jsonwebtoken';

export function requireAdminAuth(req, res, next) {
  try {
    const token = req.cookies?.admin_token;

    if (!token) {
      return res.status(401).json({ 
        success: false, 
        error: 'Unauthorized access. Authentication token missing.' 
      });
    }

    const secret = process.env.JWT_SECRET || 'infronix_sec_jwt_key_2026_v99a7b2c';
    const decoded = jwt.verify(token, secret);
    
    req.admin = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ 
      success: false, 
      error: 'Invalid or expired authentication session. Please log in again.' 
    });
  }
}
