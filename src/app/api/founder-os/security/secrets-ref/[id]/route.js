import { NextResponse } from 'next/server';
import { query, initFounderOSDb } from '@/lib/founder_os_db';
import { verifyAdminAuth } from '@/lib/auth';
import { logActivity } from '@/lib/audit_logger';

export async function DELETE(request, { params }) {
  const auth = verifyAdminAuth(request);
  if (!auth) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await initFounderOSDb();
    const resolvedParams = await params;
    const { id } = resolvedParams;

    const res = await query('SELECT secret_name FROM founder_os_secret_references WHERE id = $1', [id]);
    const name = res.rows[0]?.secret_name || id;

    await query('DELETE FROM founder_os_secret_references WHERE id = $1', [id]);
    await logActivity(auth.username, 'Secrets Reference', id, 'Deleted', `Deleted secret reference: ${name}`);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Secret ref DELETE error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
