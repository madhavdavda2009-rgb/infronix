import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { execute } from '../config/db.js';
import { encrypt, decrypt } from '../utils/crypto.js';
import { requireAdminAuth } from '../middleware/auth.js';

const router = express.Router();

// Helper to seed initial Admin account if none exists
export async function seedAdminAccount() {
  try {
    const username = process.env.ADMIN_USERNAME || 'admin';
    const rawPassword = process.env.ADMIN_PASSWORD || 'Admin@Infronix2026!';
    const [rows] = await execute('SELECT * FROM admins WHERE username = ? LIMIT 1', [username]);

    if (rows.length === 0) {
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(rawPassword, salt);
      
      await execute(
        'INSERT INTO admins (username, password_hash) VALUES (?, ?)',
        [username, passwordHash]
      );
      console.log(`🔐 Initial Admin account seeded successfully (Username: ${username})`);
    }
  } catch (err) {
    console.error('Failed to seed admin account:', err.message);
  }
}

// ----------------------------------------------------
// PUBLIC ENDPOINTS
// ----------------------------------------------------

/**
 * POST /api/consultations
 * Public endpoint to submit a client consultation form.
 * Encrypts sensitive fields (PII) using AES-256-GCM before DB insertion.
 */
router.post('/consultations', async (req, res) => {
  try {
    const { firstName, lastName, email, company, projectDetails } = req.body;

    if (!firstName || !lastName || !email || !projectDetails) {
      return res.status(400).json({ 
        success: false, 
        error: 'Please fill in all required fields (First Name, Last Name, Email, Project Details).' 
      });
    }

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Please provide a valid work email address.' 
      });
    }

    // AES-256-GCM Encryption at rest
    const encFirstName = encrypt(firstName.trim());
    const encLastName = encrypt(lastName.trim());
    const encEmail = encrypt(email.trim().toLowerCase());
    const encCompany = encrypt(company ? company.trim() : '');
    const encProjectDetails = encrypt(projectDetails.trim());

    await execute(
      `INSERT INTO consultations (first_name, last_name, email, company, project_details)
       VALUES (?, ?, ?, ?, ?)`,
      [encFirstName, encLastName, encEmail, encCompany, encProjectDetails]
    );

    return res.status(201).json({
      success: true,
      message: 'Thank you! Your consultation request has been securely submitted. Our team will contact you within 24 hours.'
    });

  } catch (error) {
    console.error('Error submitting consultation:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'An internal server error occurred while processing your request.' 
    });
  }
});

/**
 * POST /api/admin/login
 * Authenticates admin credentials and returns HTTP-only JWT cookie.
 */
router.post('/admin/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ 
        success: false, 
        error: 'Please provide both username and password.' 
      });
    }

    const [rows] = await execute('SELECT * FROM admins WHERE username = ? LIMIT 1', [username.trim()]);
    
    if (rows.length === 0) {
      return res.status(401).json({ 
        success: false, 
        error: 'Invalid username or password.' 
      });
    }

    const admin = rows[0];
    const isPasswordValid = await bcrypt.compare(password, admin.password_hash);

    if (!isPasswordValid) {
      return res.status(401).json({ 
        success: false, 
        error: 'Invalid username or password.' 
      });
    }

    const secret = process.env.JWT_SECRET || 'infronix_sec_jwt_key_2026_v99a7b2c';
    const token = jwt.sign(
      { id: admin.id, username: admin.username },
      secret,
      { expiresIn: '8h' }
    );

    // Set secure HTTP-Only cookie
    res.cookie('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 8 * 60 * 60 * 1000 // 8 hours
    });

    return res.json({
      success: true,
      message: 'Authentication successful.',
      admin: { id: admin.id, username: admin.username }
    });

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'An error occurred during authentication.' 
    });
  }
});

// ----------------------------------------------------
// PROTECTED ADMIN ENDPOINTS
// ----------------------------------------------------

/**
 * POST /api/admin/logout
 */
router.post('/admin/logout', requireAdminAuth, (req, res) => {
  res.clearCookie('admin_token');
  return res.json({ success: true, message: 'Logged out successfully.' });
});

/**
 * GET /api/admin/me
 * Checks if current admin session is valid.
 */
router.get('/admin/me', requireAdminAuth, (req, res) => {
  return res.json({ success: true, admin: req.admin });
});

/**
 * POST /api/admin/change-password
 * Changes password for logged-in admin.
 */
router.post('/admin/change-password', requireAdminAuth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, error: 'Please provide both current and new passwords.' });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ success: false, error: 'New password must be at least 8 characters long.' });
    }

    const [rows] = await execute('SELECT * FROM admins WHERE id = ? LIMIT 1', [req.admin.id]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Admin account not found.' });
    }

    const admin = rows[0];
    const isPasswordValid = await bcrypt.compare(currentPassword, admin.password_hash);
    if (!isPasswordValid) {
      return res.status(400).json({ success: false, error: 'Incorrect current password.' });
    }

    const salt = await bcrypt.genSalt(10);
    const newPasswordHash = await bcrypt.hash(newPassword, salt);

    await execute('UPDATE admins SET password_hash = ? WHERE id = ?', [newPasswordHash, req.admin.id]);

    return res.json({ success: true, message: 'Password updated successfully!' });
  } catch (error) {
    console.error('Error changing password:', error);
    return res.status(500).json({ success: false, error: 'Failed to update password.' });
  }
});

/**
 * GET /api/admin/consultations
 * Returns decrypted consultation list for authorized admins.
 */
router.get('/admin/consultations', requireAdminAuth, async (req, res) => {
  try {
    const [rows] = await execute('SELECT * FROM consultations ORDER BY created_at DESC');

    const decryptedRows = rows.map((row) => ({
      id: row.id,
      firstName: decrypt(row.first_name),
      lastName: decrypt(row.last_name),
      email: decrypt(row.email),
      company: decrypt(row.company),
      projectDetails: decrypt(row.project_details),
      status: row.status,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    }));

    return res.json({
      success: true,
      count: decryptedRows.length,
      data: decryptedRows
    });

  } catch (error) {
    console.error('Error fetching consultations:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch consultations list.' 
    });
  }
});

/**
 * PUT /api/admin/consultations/:id
 * Updates status or details of a consultation entry.
 */
router.put('/admin/consultations/:id', requireAdminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, email, company, projectDetails, status } = req.body;

    const encFirstName = encrypt(firstName);
    const encLastName = encrypt(lastName);
    const encEmail = encrypt(email);
    const encCompany = encrypt(company || '');
    const encProjectDetails = encrypt(projectDetails);

    const [result] = await execute(
      `UPDATE consultations 
       SET first_name = ?, last_name = ?, email = ?, company = ?, project_details = ?, status = ?
       WHERE id = ?`,
      [encFirstName, encLastName, encEmail, encCompany, encProjectDetails, status, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, error: 'Consultation entry not found.' });
    }

    return res.json({
      success: true,
      message: 'Consultation entry updated successfully.'
    });

  } catch (error) {
    console.error('Error updating consultation:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Failed to update consultation record.' 
    });
  }
});

/**
 * DELETE /api/admin/consultations/:id
 * Removes a consultation entry.
 */
router.delete('/admin/consultations/:id', requireAdminAuth, async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await execute('DELETE FROM consultations WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, error: 'Consultation entry not found.' });
    }

    return res.json({
      success: true,
      message: 'Consultation entry deleted successfully.'
    });

  } catch (error) {
    console.error('Error deleting consultation:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Failed to delete consultation record.' 
    });
  }
});

export default router;
