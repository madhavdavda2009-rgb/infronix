import { NextResponse } from 'next/server';
import { execute } from '@/lib/db';
import { verifyAdminAuth } from '@/lib/auth';
import { initEmailAutomationDb } from '@/lib/email-automation/db-init';

export async function GET(request) {
  try {
    const admin = verifyAdminAuth(request);
    if (!admin) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await initEmailAutomationDb();

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '100', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);

    const [sentRows] = await execute(`
      SELECT 
        s.*,
        COALESCE(l.company_name, l.business_name, '') as company_name,
        COALESCE(l.name, '') as contact_name
      FROM sent_emails s
      LEFT JOIN leads l ON s.lead_id = l.id
      ORDER BY s.sent_at DESC
      LIMIT ? OFFSET ?
    `, [limit, offset]);

    return NextResponse.json({
      success: true,
      data: sentRows || []
    });
  } catch (err) {
    console.error('Error fetching sent emails:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to fetch sent emails history' },
      { status: 500 }
    );
  }
}
