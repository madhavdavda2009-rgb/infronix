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
    const { planned_cost_id, actual_amount, expense_date, payment_method, notes } = body;

    if (!planned_cost_id) {
      return NextResponse.json({ success: false, error: 'Planned cost ID is required' }, { status: 400 });
    }

    await client.query('BEGIN');

    // Fetch Planned Cost
    const costRes = await client.query('SELECT * FROM founder_os_planned_costs WHERE id = $1 AND project_id = $2 FOR UPDATE', [planned_cost_id, projectId]);
    if (costRes.rows.length === 0) {
      await client.query('ROLLBACK');
      return NextResponse.json({ success: false, error: 'Planned cost item not found' }, { status: 404 });
    }
    const plannedCost = costRes.rows[0];
    if (plannedCost.converted_expense_id || plannedCost.status !== 'Planned') {
      await client.query('ROLLBACK');
      return NextResponse.json({ success: false, error: 'This cost has already been converted' }, { status: 409 });
    }

    // Fetch Project
    const pRes = await client.query('SELECT project_name FROM founder_os_projects WHERE id = $1', [projectId]);
    const projectName = pRes.rows[0]?.project_name || `Project #${projectId}`;

    const spentAmount = actual_amount !== undefined ? parseFloat(actual_amount) : parseFloat(plannedCost.expected_amount);

    if (!Number.isFinite(spentAmount) || spentAmount <= 0) {
      await client.query('ROLLBACK');
      return NextResponse.json({ success: false, error: 'Enter a positive expense amount' }, { status: 400 });
    }

    // 1. Create Actual Expense Record
    const expRes = await client.query(`
      INSERT INTO founder_os_expenses
        (category, description, amount, expense_date, payment_method, project_id, notes, created_at, updated_at)
      VALUES ($1, $2, $3, COALESCE($4, CURRENT_DATE), $5, $6, $7, NOW(), NOW())
      RETURNING *
    `, [
      plannedCost.cost_type || 'Freelancer',
      plannedCost.description,
      spentAmount,
      expense_date || null,
      payment_method || 'UPI',
      projectId,
      notes || `Converted from planned cost: ${plannedCost.description} for project "${projectName}"`
    ]);

    const expenseRecord = expRes.rows[0];

    // 2. Update Planned Cost status
    await client.query(`
      UPDATE founder_os_planned_costs
      SET status = 'Converted to Expense', converted_expense_id = $1
      WHERE id = $2
    `, [expenseRecord.id, planned_cost_id]);

    // 3. Log Activity
    await client.query(`
      INSERT INTO founder_os_activity_logs
        (user_name, entity_type, entity_id, action, details, created_at)
      VALUES ($1, 'Expense', $2, 'Converted from Planned Cost', $3, NOW())
    `, [
      auth.username || 'Founder',
      projectId,
      `Converted planned cost "${plannedCost.description}" into actual expense of ₹${spentAmount.toLocaleString('en-IN')} for project "${projectName}".`
    ]);

    await client.query('COMMIT');

    return NextResponse.json({
      success: true,
      expenseRecord
    });
  } catch (err) {
    if (client) await client.query('ROLLBACK');
    console.error('Convert cost error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  } finally {
    client?.release();
  }
}
