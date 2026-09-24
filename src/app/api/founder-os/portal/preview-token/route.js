import { NextResponse } from 'next/server';
import { verifyAdminAuth } from '@/lib/auth';
import { query, initFounderOSDb } from '@/lib/founder_os_db';
import { logActivity } from '@/lib/audit_logger';

export async function GET(request) {
  const auth = verifyAdminAuth(request);
  if (!auth) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await initFounderOSDb();
    const { searchParams } = new URL(request.url);
    const clientId = parseInt(searchParams.get('clientId'), 10);
    const projectId = searchParams.get('projectId') ? parseInt(searchParams.get('projectId'), 10) : null;

    if (isNaN(clientId) || clientId <= 0) {
      return NextResponse.json({ success: false, error: 'Valid client ID is required' }, { status: 400 });
    }

    const clientRes = await query('SELECT * FROM founder_os_clients WHERE id = $1', [clientId]);
    if (clientRes.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Client not found' }, { status: 404 });
    }
    const client = clientRes.rows[0];

    await logActivity(
      auth.username || 'Admin',
      'Client Portal Preview',
      clientId,
      'Launched Admin Preview',
      `Admin ${auth.username || 'admin'} launched read-only client portal preview for "${client.name}"`
    );

    const targetUrl = projectId 
      ? `/client/projects/${projectId}?admin_preview_client_id=${clientId}`
      : `/client/dashboard?admin_preview_client_id=${clientId}`;

    return NextResponse.json({
      success: true,
      previewUrl: targetUrl,
      clientId: client.id,
      clientName: client.name
    });
  } catch (err) {
    console.error('Preview token error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
