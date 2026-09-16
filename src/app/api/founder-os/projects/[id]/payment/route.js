import { NextResponse } from 'next/server';
import { getPool, initFounderOSDb } from '@/lib/founder_os_db';
import { verifyAdminAuth } from '@/lib/auth';

export async function POST(request, { params }) {
  const auth = verifyAdminAuth(request);
  if (!auth) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  let client;

  try {
    await initFounderOSDb();
    client = await getPool().connect();
    const resolvedParams = await params;
    const { id } = resolvedParams;
    const projectId = parseInt(id, 10);

    const body = await request.json();
    const { amount, payment_date, payment_method, invoice_number, milestone_id, notes } = body;

    const paymentAmount = parseFloat(amount || 0);
    if (!Number.isFinite(paymentAmount) || paymentAmount <= 0) {
      return NextResponse.json({ success: false, error: 'Valid payment amount is required' }, { status: 400 });
    }

    await client.query('BEGIN');

    // Fetch Project
    const pRes = await client.query('SELECT * FROM founder_os_projects WHERE id = $1 FOR UPDATE', [projectId]);
    if (pRes.rows.length === 0) {
      await client.query('ROLLBACK');
      return NextResponse.json({ success: false, error: 'Project not found' }, { status: 404 });
    }
    const project = pRes.rows[0];

    // Only explicitly selected, unpaid milestones can be settled. A general payment
    // changes project cash received without falsely completing an arbitrary milestone.
    if (milestone_id) {
      const milestone = await client.query('SELECT * FROM founder_os_payment_schedules WHERE id = $1 AND project_id = $2 FOR UPDATE', [milestone_id, projectId]);
      const row = milestone.rows[0];
      if (!row || row.status === 'Received' || row.revenue_id || Math.round(Number(row.amount) * 100) !== Math.round(paymentAmount * 100)) {
        await client.query('ROLLBACK');
        return NextResponse.json({ success: false, error: 'Select an unpaid milestone and enter its exact amount, or record an unallocated payment' }, { status: 400 });
      }
    }

    // 1. Create Revenue Record
    const revRes = await client.query(`
      INSERT INTO founder_os_revenue
        (client_name, client_id, project_id, project_name, amount, payment_date, payment_status, payment_method, invoice_number, notes, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, COALESCE($6, CURRENT_DATE), 'Paid', $7, $8, $9, NOW(), NOW())
      RETURNING *
    `, [
      project.client_name,
      project.client_id,
      projectId,
      project.project_name,
      paymentAmount,
      payment_date || null,
      payment_method || 'Bank Transfer',
      invoice_number || null,
      notes || `Project payment recorded from Project #${projectId}`
    ]);

    const revRecord = revRes.rows[0];

    // 2. Update Payment Schedule Milestone
    if (milestone_id) {
      await client.query(`
        UPDATE founder_os_payment_schedules
        SET status = 'Received', paid_date = COALESCE($1, CURRENT_DATE), revenue_id = $2
        WHERE id = $3 AND project_id = $4
      `, [payment_date || null, revRecord.id, milestone_id, projectId]);
    }

    // 3. Log Activity
    await client.query(`
      INSERT INTO founder_os_activity_logs
        (user_name, entity_type, entity_id, action, details, created_at)
      VALUES ($1, 'Payment', $2, 'Recorded', $3, NOW())
    `, [
      auth.username || 'Founder',
      projectId,
      `Recorded payment of ₹${paymentAmount.toLocaleString('en-IN')} via ${payment_method || 'Bank Transfer'} for project "${project.project_name}".`
    ]);

    await client.query('COMMIT');

    return NextResponse.json({
      success: true,
      revenueRecord: revRecord
    });
  } catch (err) {
    if (client) await client.query('ROLLBACK');
    console.error('Project record payment error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  } finally {
    client?.release();
  }
}
