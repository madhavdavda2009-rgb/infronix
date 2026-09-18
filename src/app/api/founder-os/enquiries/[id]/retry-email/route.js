import { NextResponse } from 'next/server';
import { query, initFounderOSDb } from '@/lib/founder_os_db';
import { verifyAdminAuth } from '@/lib/auth';
import { logActivity } from '@/lib/audit_logger';
import { sendCustomerConfirmationEmail, sendAdminNotificationEmail } from '@/lib/mailer';

export async function POST(request, { params }) {
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
    const body = await request.json().catch(() => ({}));
    const emailType = body.emailType || 'both'; // 'customer' | 'admin' | 'both'

    // Fetch existing enquiry
    const enquiryRes = await query('SELECT * FROM founder_os_enquiries WHERE id = $1', [id]);
    if (enquiryRes.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Enquiry not found' }, { status: 404 });
    }

    const enquiry = enquiryRes.rows[0];

    const origin = request.headers.get('origin') ||
                   request.headers.get('host') ||
                   'https://infronixweb.in';
    const baseUrl = origin.startsWith('http') ? origin : `https://${origin}`;

    let custRes = null;
    let adminRes = null;

    if (emailType === 'customer' || emailType === 'both') {
      custRes = await sendCustomerConfirmationEmail(enquiry);
    }

    if (emailType === 'admin' || emailType === 'both') {
      adminRes = await sendAdminNotificationEmail(enquiry, baseUrl);
    }

    const updates = [];
    const updateParams = [];

    if (custRes) {
      updateParams.push(custRes.status);
      updates.push(`customer_email_status = $${updateParams.length}`);
      if (custRes.messageId) {
        updateParams.push(custRes.messageId);
        updates.push(`customer_email_message_id = $${updateParams.length}`);
      }
    }

    if (adminRes) {
      updateParams.push(adminRes.status);
      updates.push(`admin_email_status = $${updateParams.length}`);
      if (adminRes.messageId) {
        updateParams.push(adminRes.messageId);
        updates.push(`admin_email_message_id = $${updateParams.length}`);
      }
    }

    // Set errors and attempt count
    const errorArr = [];
    if (custRes && custRes.error) errorArr.push(`Customer: ${custRes.error}`);
    if (adminRes && adminRes.error) errorArr.push(`Admin: ${adminRes.error}`);

    updateParams.push(errorArr.length > 0 ? errorArr.join(' | ') : null);
    updates.push(`last_email_error = $${updateParams.length}`);
    updates.push(`email_attempt_count = email_attempt_count + 1`);
    updates.push(`updated_at = NOW()`);

    updateParams.push(id);
    const updateSql = `
      UPDATE founder_os_enquiries
      SET ${updates.join(', ')}
      WHERE id = $${updateParams.length}
      RETURNING *
    `;

    const updatedEnquiryRes = await query(updateSql, updateParams);
    const updated = updatedEnquiryRes.rows[0];

    await logActivity(
      auth.username,
      'Enquiry',
      enquiry.id,
      'Email Retry',
      `Manual retry of ${emailType} email for enquiry ${enquiry.reference_id}`
    );

    return NextResponse.json({
      success: true,
      enquiry: updated,
      results: {
        customer: custRes,
        admin: adminRes
      }
    });
  } catch (err) {
    console.error('Email retry error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
