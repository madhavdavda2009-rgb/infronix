import { NextResponse } from 'next/server';
import { verifyAdminAuth } from '@/lib/auth';
import { query, initFounderOSDb } from '@/lib/founder_os_db';
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
    const docId = parseInt(id, 10);

    const docRes = await query('SELECT * FROM founder_os_portal_documents WHERE id = $1', [docId]);
    if (docRes.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Document not found' }, { status: 404 });
    }
    const doc = docRes.rows[0];

    await query('DELETE FROM founder_os_portal_documents WHERE id = $1', [docId]);

    await logActivity(
      auth.username || 'Admin',
      'Client Portal Document',
      doc.project_id,
      'Deleted Document',
      `Deleted document "${doc.title}" from project ID ${doc.project_id}`
    );

    return NextResponse.json({ success: true, message: 'Document removed from portal.' });
  } catch (err) {
    console.error('Delete portal doc error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
