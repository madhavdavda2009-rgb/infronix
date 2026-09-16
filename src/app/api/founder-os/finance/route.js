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
    const view = searchParams.get('view') || 'overview'; // 'overview' | 'revenue' | 'expenses'

    // Fetch Revenue Records
    const revenueRes = await query(`
      SELECT r.*, p.project_name as linked_project_name
      FROM founder_os_revenue r
      LEFT JOIN founder_os_projects p ON p.id = r.project_id
      ORDER BY r.payment_date DESC, r.created_at DESC
    `);

    // Fetch Expense Records
    const expensesRes = await query(`
      SELECT e.*, p.project_name as linked_project_name
      FROM founder_os_expenses e
      LEFT JOIN founder_os_projects p ON p.id = e.project_id
      ORDER BY e.expense_date DESC, e.created_at DESC
    `);

    // Calculate Summary Metrics
    let totalRevenue = 0;
    let paidRevenue = 0;
    let pendingRevenue = 0;
    for (const r of revenueRes.rows) {
      const amt = parseFloat(r.amount || 0);
      totalRevenue += amt;
      if (r.payment_status === 'Paid') paidRevenue += amt;
      else if (r.payment_status === 'Pending' || r.payment_status === 'Overdue') pendingRevenue += amt;
    }

    let totalExpenses = 0;
    let recurringExpenses = 0;
    for (const e of expensesRes.rows) {
      const amt = parseFloat(e.amount || 0);
      totalExpenses += amt;
      if (e.is_recurring) recurringExpenses += amt;
    }

    const netProfit = paidRevenue - totalExpenses;

    // Monthly breakdown
    const monthlyMap = {};
    for (const r of revenueRes.rows) {
      if (r.payment_status === 'Paid') {
        const m = r.payment_date ? String(r.payment_date).substring(0, 7) : 'Unknown';
        if (!monthlyMap[m]) monthlyMap[m] = { month: m, revenue: 0, expenses: 0 };
        monthlyMap[m].revenue += parseFloat(r.amount || 0);
      }
    }
    for (const e of expensesRes.rows) {
      const m = e.expense_date ? String(e.expense_date).substring(0, 7) : 'Unknown';
      if (!monthlyMap[m]) monthlyMap[m] = { month: m, revenue: 0, expenses: 0 };
      monthlyMap[m].expenses += parseFloat(e.amount || 0);
    }
    const monthlyBreakdown = Object.values(monthlyMap)
      .map(item => ({
        ...item,
        profit: item.revenue - item.expenses
      }))
      .sort((a, b) => b.month.localeCompare(a.month));

    // Project Profitability (Calculated by revenue earned per project minus attributed expenses)
    const projectProfitMap = {};
    for (const r of revenueRes.rows) {
      if (r.project_id && r.payment_status === 'Paid') {
        const pid = r.project_id;
        if (!projectProfitMap[pid]) {
          projectProfitMap[pid] = {
            projectId: pid,
            projectName: r.project_name || r.linked_project_name || `Project #${pid}`,
            clientName: r.client_name,
            revenue: 0,
            expenses: 0
          };
        }
        projectProfitMap[pid].revenue += parseFloat(r.amount || 0);
      }
    }
    for (const e of expensesRes.rows) {
      if (e.project_id) {
        const pid = e.project_id;
        if (!projectProfitMap[pid]) {
          projectProfitMap[pid] = {
            projectId: pid,
            projectName: e.linked_project_name || `Project #${pid}`,
            clientName: 'Client Project',
            revenue: 0,
            expenses: 0
          };
        }
        projectProfitMap[pid].expenses += parseFloat(e.amount || 0);
      }
    }
    const projectProfitability = Object.values(projectProfitMap).map(p => ({
      ...p,
      profit: p.revenue - p.expenses,
      marginPercent: p.revenue > 0 ? Math.round(((p.revenue - p.expenses) / p.revenue) * 100) : 0
    }));

    return NextResponse.json({
      success: true,
      summary: {
        totalRevenue,
        paidRevenue,
        pendingRevenue,
        totalExpenses,
        recurringExpenses,
        netProfit
      },
      revenue: revenueRes.rows,
      expenses: expensesRes.rows,
      monthlyBreakdown,
      projectProfitability
    });
  } catch (err) {
    console.error('Finance GET error:', err);
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
    const { type } = body; // 'revenue' | 'expense'

    if (type === 'revenue') {
      const { client_name, project_id, project_name, amount, payment_date, payment_status, payment_method, invoice_number, notes } = body;
      if (!client_name || amount === undefined) {
        return NextResponse.json({ success: false, error: 'Client name and amount are required' }, { status: 400 });
      }

      const insertRes = await query(`
        INSERT INTO founder_os_revenue
          (client_name, project_id, project_name, amount, payment_date, payment_status, payment_method, invoice_number, notes, created_at, updated_at)
        VALUES ($1, $2, $3, $4, COALESCE($5, CURRENT_DATE), $6, $7, $8, $9, NOW(), NOW())
        RETURNING *
      `, [
        client_name.trim(),
        project_id || null,
        project_name || null,
        parseFloat(amount || 0),
        payment_date || null,
        payment_status || 'Paid',
        payment_method || 'Bank Transfer',
        invoice_number || null,
        notes || null
      ]);

      const rev = insertRes.rows[0];
      await logActivity(auth.username, 'Revenue', rev.id, 'Recorded', `Recorded revenue: ₹${rev.amount} from ${rev.client_name} (${rev.payment_status})`);

      return NextResponse.json({ success: true, record: rev });
    } else if (type === 'expense') {
      const { category, description, amount, expense_date, payment_method, is_recurring, recurring_frequency, project_id, notes } = body;
      if (!category || !description || amount === undefined) {
        return NextResponse.json({ success: false, error: 'Category, description, and amount are required' }, { status: 400 });
      }

      const insertRes = await query(`
        INSERT INTO founder_os_expenses
          (category, description, amount, expense_date, payment_method, is_recurring, recurring_frequency, project_id, notes, created_at, updated_at)
        VALUES ($1, $2, $3, COALESCE($4, CURRENT_DATE), $5, $6, $7, $8, $9, NOW(), NOW())
        RETURNING *
      `, [
        category.trim(),
        description.trim(),
        parseFloat(amount || 0),
        expense_date || null,
        payment_method || 'UPI',
        Boolean(is_recurring),
        recurring_frequency || null,
        project_id || null,
        notes || null
      ]);

      const exp = insertRes.rows[0];
      await logActivity(auth.username, 'Expense', exp.id, 'Recorded', `Recorded expense: ₹${exp.amount} for ${exp.description} (${exp.category})`);

      return NextResponse.json({ success: true, record: exp });
    } else {
      return NextResponse.json({ success: false, error: 'Invalid financial record type' }, { status: 400 });
    }
  } catch (err) {
    console.error('Finance POST error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  const auth = verifyAdminAuth(request);
  if (!auth) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await initFounderOSDb();
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); // 'revenue' | 'expense'
    const id = searchParams.get('id');

    if (!type || !id) {
      return NextResponse.json({ success: false, error: 'Type and ID are required' }, { status: 400 });
    }

    if (type === 'revenue') {
      await query('DELETE FROM founder_os_revenue WHERE id = $1', [id]);
      await logActivity(auth.username, 'Revenue', id, 'Deleted', `Deleted revenue record #${id}`);
    } else if (type === 'expense') {
      await query('DELETE FROM founder_os_expenses WHERE id = $1', [id]);
      await logActivity(auth.username, 'Expense', id, 'Deleted', `Deleted expense record #${id}`);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Finance DELETE error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
