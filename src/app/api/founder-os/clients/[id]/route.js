import { NextResponse } from 'next/server';
import { query, initFounderOSDb } from '@/lib/founder_os_db';
import { verifyAdminAuth } from '@/lib/auth';
import { logActivity } from '@/lib/audit_logger';

export async function GET(request, { params }) {
  const auth = verifyAdminAuth(request);
  if (!auth) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await initFounderOSDb();
    const resolvedParams = await params;
    const { id } = resolvedParams;
    const clientId = parseInt(id, 10);

    const clientRes = await query('SELECT * FROM founder_os_clients WHERE id = $1', [clientId]);
    if (clientRes.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Client not found' }, { status: 404 });
    }
    const client = clientRes.rows[0];

    // Linked Projects
    const projectsRes = await query(`
      SELECT p.*,
        COUNT(DISTINCT t.id) as total_tasks,
        COUNT(DISTINCT CASE WHEN t.status = 'Completed' THEN t.id END) as completed_tasks
      FROM founder_os_projects p
      LEFT JOIN founder_os_tasks t ON t.project_id = p.id
      WHERE p.client_id = $1 OR p.client_name = $2
      GROUP BY p.id
      ORDER BY p.created_at DESC
    `, [clientId, client.name]);

    // Linked Leads
    const leadsRes = await query(`
      SELECT * FROM founder_os_leads WHERE client_id = $1 OR id = $2 ORDER BY created_at DESC
    `, [clientId, client.lead_id || 0]);

    // Linked Proposals
    const proposalsRes = await query(`
      SELECT * FROM founder_os_proposals WHERE client_id = $1 OR client_name = $2 ORDER BY created_at DESC
    `, [clientId, client.name]);

    // Linked Calls
    const callsRes = await query(`
      SELECT * FROM founder_os_calls WHERE client_id = $1 OR lead_name = $2 ORDER BY call_date DESC
    `, [clientId, client.name]);

    // Linked Revenue & Payments
    const revenueRes = await query(`
      SELECT * FROM founder_os_revenue WHERE client_id = $1 OR client_name = $2 ORDER BY payment_date DESC, created_at DESC
    `, [clientId, client.name]);

    // Calculate Totals
    let totalContractValue = 0;
    for (const p of projectsRes.rows) {
      totalContractValue += parseFloat(p.project_value || 0);
    }

    let totalCashReceived = 0;
    for (const r of revenueRes.rows) {
      if (r.payment_status === 'Paid') {
        totalCashReceived += parseFloat(r.amount || 0);
      }
    }

    const totalOutstanding = Math.max(0, totalContractValue - totalCashReceived);

    // Linked Activity Logs
    const activityRes = await query(`
      SELECT * FROM founder_os_activity_logs
      WHERE (entity_type = 'Client' AND entity_id = $1)
         OR (entity_type = 'Project' AND entity_id IN (SELECT id FROM founder_os_projects WHERE client_id = $1 OR client_name = $2))
      ORDER BY created_at DESC LIMIT 20
    `, [clientId, client.name]);

    return NextResponse.json({
      success: true,
      client,
      projects: projectsRes.rows,
      leads: leadsRes.rows,
      proposals: proposalsRes.rows,
      calls: callsRes.rows,
      revenue: revenueRes.rows,
      financials: {
        totalContractValue,
        totalCashReceived,
        totalOutstanding
      },
      activity: activityRes.rows
    });
  } catch (err) {
    console.error('Client GET by ID error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
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
    const { name, company, phone, email, industry, notes } = body;

    const res = await query(`
      UPDATE founder_os_clients
      SET 
        name = COALESCE($1, name),
        company = COALESCE($2, company),
        phone = COALESCE($3, phone),
        email = COALESCE($4, email),
        industry = COALESCE($5, industry),
        notes = $6,
        updated_at = NOW()
      WHERE id = $7
      RETURNING *
    `, [
      name ? name.trim() : null,
      company !== undefined ? company.trim() : null,
      phone !== undefined ? phone.trim() : null,
      email !== undefined ? email.trim() : null,
      industry !== undefined ? industry.trim() : null,
      notes,
      clientId
    ]);

    if (res.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Client not found' }, { status: 404 });
    }

    const client = res.rows[0];
    await logActivity(auth.username, 'Client', clientId, 'Updated', `Updated client: ${client.name}`);

    return NextResponse.json({ success: true, client });
  } catch (err) {
    console.error('Client PUT error:', err);
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
    const clientId = parseInt(id, 10);

    const cRes = await query('SELECT name FROM founder_os_clients WHERE id = $1', [clientId]);
    const name = cRes.rows[0]?.name || clientId;

    await query('DELETE FROM founder_os_clients WHERE id = $1', [clientId]);
    await logActivity(auth.username, 'Client', clientId, 'Deleted', `Deleted client: ${name}`);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Client DELETE error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
