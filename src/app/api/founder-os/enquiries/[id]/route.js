import { NextResponse } from 'next/server';
import { query, initFounderOSDb } from '@/lib/founder_os_db';
import { verifyAdminAuth } from '@/lib/auth';
import { logActivity } from '@/lib/audit_logger';

export async function DELETE(request, { params }) {
  const auth = verifyAdminAuth(request);
  if (!auth) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  if (!id) {
    return NextResponse.json({ success: false, error: 'Enquiry ID is required' }, { status: 400 });
  }

  try {
    await initFounderOSDb();

    // Check if enquiry exists
    const enquiryRes = await query('SELECT * FROM founder_os_enquiries WHERE id = $1', [id]);
    if (enquiryRes.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Enquiry not found' }, { status: 404 });
    }

    const enquiry = enquiryRes.rows[0];

    // Delete enquiry record
    await query('DELETE FROM founder_os_enquiries WHERE id = $1', [id]);

    await logActivity(
      auth.username || 'Founder',
      'Enquiry',
      enquiry.id,
      'Deleted',
      `Deleted website enquiry ${enquiry.reference_id} (${enquiry.full_name})`
    );

    return NextResponse.json({
      success: true,
      message: `Enquiry ${enquiry.reference_id} deleted successfully. Reference number is now freed for reuse.`
    });
  } catch (err) {
    console.error('Delete enquiry error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
