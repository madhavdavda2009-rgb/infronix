import { NextResponse } from 'next/server';
import { verifyClientAuth, getPortalSecurityHeaders } from '@/lib/client_auth';
import { query, initFounderOSDb } from '@/lib/founder_os_db';

export async function PUT(request) {
  try {
    const auth = await verifyClientAuth(request);
    if (!auth) {
      return NextResponse.json({ success: false, error: 'Unauthorized.' }, { status: 401, headers: getPortalSecurityHeaders() });
    }

    if (auth.isAdminPreview) {
      return NextResponse.json({ success: false, error: 'Profile modification is disabled in Admin Preview mode.' }, { status: 403, headers: getPortalSecurityHeaders() });
    }

    await initFounderOSDb();
    const body = await request.json();
    const fullName = typeof body.full_name === 'string' ? body.full_name.trim() : null;
    const phone = typeof body.phone === 'string' ? body.phone.trim() : null;
    const roleTitle = typeof body.role_title === 'string' ? body.role_title.trim() : null;

    if (!fullName) {
      return NextResponse.json({ success: false, error: 'Full name is required.' }, { status: 400, headers: getPortalSecurityHeaders() });
    }

    const updateRes = await query(`
      UPDATE founder_os_portal_users
      SET full_name = COALESCE($1, full_name),
          phone = $2,
          role_title = COALESCE($3, role_title),
          updated_at = NOW()
      WHERE id = $4
      RETURNING id, public_client_id, full_name, email, phone, role_title, status, email_verified
    `, [fullName, phone, roleTitle, auth.user.id]);

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully.',
      user: updateRes.rows[0]
    }, { headers: getPortalSecurityHeaders() });
  } catch (err) {
    console.error('Client profile update error:', err);
    return NextResponse.json({ success: false, error: 'Failed to update profile.' }, { status: 500, headers: getPortalSecurityHeaders() });
  }
}
