import { NextResponse } from 'next/server';
import { query, initFounderOSDb } from '@/lib/founder_os_db';
import { verifyAdminAuth } from '@/lib/auth';

export async function GET(request) {
  const auth = verifyAdminAuth(request);
  if (!auth) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await initFounderOSDb();
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    const emailStatus = searchParams.get('emailStatus') || '';
    const formType = searchParams.get('formType') || '';
    const sortBy = searchParams.get('sortBy') || 'created_at';
    const sortOrder = searchParams.get('sortOrder') === 'asc' ? 'ASC' : 'DESC';

    let sql = `
      SELECT e.*, l.lead_id as crm_lead_code, l.status as crm_lead_status
      FROM founder_os_enquiries e
      LEFT JOIN founder_os_leads l ON e.lead_id = l.id
      WHERE 1=1
    `;
    const params = [];

    if (search) {
      params.push(`%${search.toLowerCase()}%`);
      const pIdx = params.length;
      sql += ` AND (
        LOWER(e.full_name) LIKE $${pIdx} OR 
        LOWER(e.email) LIKE $${pIdx} OR 
        LOWER(e.company) LIKE $${pIdx} OR 
        LOWER(e.reference_id) LIKE $${pIdx} OR 
        LOWER(e.phone) LIKE $${pIdx} OR
        LOWER(e.selected_service) LIKE $${pIdx}
      )`;
    }

    if (status && status !== 'ALL') {
      params.push(status);
      sql += ` AND e.status = $${params.length}`;
    }

    if (emailStatus && emailStatus !== 'ALL') {
      params.push(emailStatus);
      const pIdx = params.length;
      if (emailStatus === 'Failed') {
        sql += ` AND (e.customer_email_status = 'Failed' OR e.admin_email_status = 'Failed')`;
      } else if (emailStatus === 'Sent') {
        sql += ` AND e.customer_email_status = 'Sent' AND e.admin_email_status = 'Sent'`;
      } else if (emailStatus === 'Configuration Missing') {
        sql += ` AND (e.customer_email_status = 'Configuration Missing' OR e.admin_email_status = 'Configuration Missing')`;
      } else {
        sql += ` AND (e.customer_email_status = $${pIdx} OR e.admin_email_status = $${pIdx})`;
      }
    }

    if (formType && formType !== 'ALL') {
      params.push(formType);
      sql += ` AND e.form_type = $${params.length}`;
    }

    const validSortCols = ['created_at', 'full_name', 'reference_id', 'status'];
    const orderCol = validSortCols.includes(sortBy) ? `e.${sortBy}` : 'e.created_at';
    sql += ` ORDER BY ${orderCol} ${sortOrder}`;

    const res = await query(sql, params);
    return NextResponse.json({ success: true, enquiries: res.rows });
  } catch (err) {
    console.error('Founder OS Enquiries GET error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
