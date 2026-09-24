import { NextResponse } from 'next/server';
import { verifyAdminAuth } from '@/lib/auth';
import { query, initFounderOSDb } from '@/lib/founder_os_db';
import { revokeAllUserSessions } from '@/lib/client_auth';
import { logActivity } from '@/lib/audit_logger';

async function handleStatusUpdate(request, { params }) {
  const auth = verifyAdminAuth(request);
  if (!auth) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await initFounderOSDb();
    const resolvedParams = await params;
    const { id } = resolvedParams;
    const clientId = parseInt(id, 10);
    const body = await request.json();
    const portalUserId = parseInt(body.portal_user_id, 10);
    const rawStatus = (body.status || '').toLowerCase().trim();

    let newStatus = 'active';
    if (rawStatus === 'suspended') newStatus = 'suspended';
    else if (rawStatus === 'disabled') newStatus = 'disabled';
    else if (rawStatus === 'invited') newStatus = 'invited';
    else if (rawStatus === 'active') newStatus = 'active';
    else {
      return NextResponse.json({ success: false, error: 'Valid status is required (active, suspended, disabled).' }, { status: 400 });
    }

    const userRes = await query(`
      SELECT u.*, c.name as client_name 
      FROM founder_os_portal_users u
      JOIN founder_os_clients c ON c.id = u.client_id
      WHERE u.id = $1 AND u.client_id = $2
    `, [portalUserId, clientId]);

    if (userRes.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Portal user not found' }, { status: 404 });
    }

    const user = userRes.rows[0];

    // If suspending or disabling, revoke all active sessions immediately
    if (newStatus === 'suspended' || newStatus === 'disabled') {
      await revokeAllUserSessions(user.id);
    }

    const updateRes = await query(`
      UPDATE founder_os_portal_users
      SET status = $1,
          updated_at = NOW()
      WHERE id = $2
      RETURNING *
    `, [newStatus, user.id]);

    await logActivity(
      auth.username || 'Admin',
      'Client Portal Access',
      clientId,
      `Status changed to ${newStatus}`,
      `Changed portal access status for ${user.public_client_id} to ${newStatus}`
    );

    return NextResponse.json({
      success: true,
      message: `Portal user status updated to ${newStatus}.`,
      user: updateRes.rows[0]
    });
  } catch (err) {
    console.error('Update portal status error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request, context) {
  return handleStatusUpdate(request, context);
}

export async function PUT(request, context) {
  return handleStatusUpdate(request, context);
}
