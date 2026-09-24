import { NextResponse } from 'next/server';
import { query, initFounderOSDb } from '@/lib/founder_os_db';
import { verifyAdminAuth } from '@/lib/auth';
import { logActivity } from '@/lib/audit_logger';

export async function GET(request) {
  const auth = verifyAdminAuth(request);
  if (!auth) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await initFounderOSDb();
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';

    let sql = `
      SELECT 
        c.*,
        COALESCE(proj.total_projects, 0) as total_projects,
        COALESCE(proj.total_contract_value, 0) as total_contract_value,
        COALESCE(rev.total_cash_received, 0) as total_cash_received,
        COALESCE(leads.total_leads, 0) as total_leads
      FROM founder_os_clients c
      LEFT JOIN (
        SELECT 
          COALESCE(p.client_id, c_inner.id) as client_id,
          COUNT(DISTINCT p.id) as total_projects, 
          COALESCE(SUM(p.project_value), 0) as total_contract_value
        FROM founder_os_projects p
        LEFT JOIN founder_os_clients c_inner ON (p.client_id IS NULL AND LOWER(p.client_name) = LOWER(c_inner.name))
        GROUP BY COALESCE(p.client_id, c_inner.id)
      ) proj ON proj.client_id = c.id
      LEFT JOIN (
        SELECT 
          COALESCE(r.client_id, c_inner.id) as client_id,
          COALESCE(SUM(r.amount), 0) as total_cash_received
        FROM founder_os_revenue r
        LEFT JOIN founder_os_clients c_inner ON (r.client_id IS NULL AND LOWER(r.client_name) = LOWER(c_inner.name))
        WHERE r.payment_status = 'Paid'
        GROUP BY COALESCE(r.client_id, c_inner.id)
      ) rev ON rev.client_id = c.id
      LEFT JOIN (
        SELECT 
          COALESCE(l.client_id, c_inner.id) as client_id,
          COUNT(DISTINCT l.id) as total_leads
        FROM founder_os_leads l
        LEFT JOIN founder_os_clients c_inner ON (l.client_id IS NULL AND LOWER(l.name) = LOWER(c_inner.name))
        GROUP BY COALESCE(l.client_id, c_inner.id)
      ) leads ON leads.client_id = c.id
      WHERE 1=1
    `;
    const params = [];

    if (search) {
      params.push(`%${search.toLowerCase()}%`);
      sql += ` AND (LOWER(c.name) LIKE $1 OR LOWER(COALESCE(c.company, '')) LIKE $1 OR LOWER(COALESCE(c.email, '')) LIKE $1)`;
    }

    sql += ' ORDER BY c.created_at DESC';

    const res = await query(sql, params);

    const clients = res.rows.map(row => {
      const contractVal = parseFloat(row.total_contract_value || 0);
      const receivedVal = parseFloat(row.total_cash_received || 0);
      const outstandingVal = Math.max(0, contractVal - receivedVal);
      return {
        ...row,
        total_projects: parseInt(row.total_projects || 0, 10),
        total_leads: parseInt(row.total_leads || 0, 10),
        total_contract_value: contractVal,
        total_cash_received: receivedVal,
        total_outstanding: outstandingVal
      };
    });

    return NextResponse.json({ success: true, clients });
  } catch (err) {
    console.error('Clients GET error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  const auth = verifyAdminAuth(request);
  if (!auth) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await initFounderOSDb();
    const body = await request.json();
    const { name, company, phone, email, industry, notes, lead_id } = body;

    if (!name) {
      return NextResponse.json({ success: false, error: 'Client name is required' }, { status: 400 });
    }

    const res = await query(`
      INSERT INTO founder_os_clients
        (name, company, phone, email, industry, notes, lead_id, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
      RETURNING *
    `, [
      name.trim(),
      company?.trim() || null,
      phone?.trim() || null,
      email?.trim() || null,
      industry?.trim() || null,
      notes || null,
      lead_id ? parseInt(lead_id, 10) : null
    ]);

    const client = res.rows[0];
    await logActivity(auth.username, 'Client', client.id, 'Created', `Created client: ${client.name} (${client.company || 'Individual'})`);

    return NextResponse.json({ success: true, client });
  } catch (err) {
    console.error('Clients POST error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
