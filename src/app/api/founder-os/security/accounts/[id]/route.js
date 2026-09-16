import { NextResponse } from 'next/server';
import { query, initFounderOSDb } from '@/lib/founder_os_db';
import { verifyAdminAuth } from '@/lib/auth';
import { logActivity } from '@/lib/audit_logger';

export async function PUT(request, { params }) {
  const auth = verifyAdminAuth(request);
  if (!auth) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await initFounderOSDb();
    const resolvedParams = await params;
    const { id } = resolvedParams;
    const body = await request.json();

    const { service_name, category, owner, security_status, mfa_enabled, recovery_configured, last_reviewed, url_reference, notes } = body;

    const updateRes = await query(`
      UPDATE founder_os_security_accounts
      SET 
        service_name = COALESCE($1, service_name),
        category = COALESCE($2, category),
        owner = COALESCE($3, owner),
        security_status = COALESCE($4, security_status),
        mfa_enabled = COALESCE($5, mfa_enabled),
        recovery_configured = COALESCE($6, recovery_configured),
        last_reviewed = $7,
        url_reference = $8,
        notes = $9,
        updated_at = NOW()
      WHERE id = $10
      RETURNING *
    `, [
      service_name ? service_name.trim() : null,
      category,
      owner,
      security_status,
      mfa_enabled !== undefined ? Boolean(mfa_enabled) : null,
      recovery_configured !== undefined ? Boolean(recovery_configured) : null,
      last_reviewed || null,
      url_reference,
      notes,
      id
    ]);

    if (updateRes.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Security account not found' }, { status: 404 });
    }

    const acc = updateRes.rows[0];
    await logActivity(auth.username, 'Security', id, 'Updated', `Updated security account: ${acc.service_name}`);

    return NextResponse.json({ success: true, account: acc });
  } catch (err) {
    console.error('Security account PUT error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const auth = verifyAdminAuth(request);
  if (!auth) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await initFounderOSDb();
    const resolvedParams = await params;
    const { id } = resolvedParams;

    const res = await query('SELECT service_name FROM founder_os_security_accounts WHERE id = $1', [id]);
    const name = res.rows[0]?.service_name || id;

    await query('DELETE FROM founder_os_security_accounts WHERE id = $1', [id]);
    await logActivity(auth.username, 'Security', id, 'Deleted', `Deleted security account: ${name}`);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Security account DELETE error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
