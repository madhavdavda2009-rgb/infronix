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

    // 1. Core Financial Aggregates
    const revenueRes = await query(`
      SELECT 
        COALESCE(SUM(CASE WHEN payment_status = 'Paid' THEN amount ELSE 0 END), 0) as total_revenue,
        COALESCE(SUM(CASE WHEN payment_status IN ('Pending', 'Overdue') THEN amount ELSE 0 END), 0) as outstanding_payments,
        COUNT(*) as total_revenue_records
      FROM founder_os_revenue
    `);

    const expensesRes = await query(`
      SELECT 
        COALESCE(SUM(amount), 0) as total_expenses,
        COUNT(*) as total_expense_records
      FROM founder_os_expenses
    `);

    const totalRevenue = parseFloat(revenueRes.rows[0]?.total_revenue || 0);
    const outstandingPayments = parseFloat(revenueRes.rows[0]?.outstanding_payments || 0);
    const totalExpenses = parseFloat(expensesRes.rows[0]?.total_expenses || 0);
    const netProfit = totalRevenue - totalExpenses;

    // 2. Operational Counts
    const projectsRes = await query(`
      SELECT 
        COUNT(*) as total_projects,
        COUNT(CASE WHEN status NOT IN ('Completed', 'On Hold') THEN 1 END) as active_projects,
        status, COUNT(*) as status_count
      FROM founder_os_projects
      GROUP BY status
    `);

    let totalProjects = 0;
    let activeProjects = 0;
    const projectStatusMap = {};
    for (const row of projectsRes.rows) {
      totalProjects += parseInt(row.status_count, 10);
      if (row.status !== 'Completed' && row.status !== 'On Hold') {
        activeProjects += parseInt(row.status_count, 10);
      }
      projectStatusMap[row.status] = parseInt(row.status_count, 10);
    }

    const leadsRes = await query(`
      SELECT 
        status, COUNT(*) as status_count
      FROM founder_os_leads
      GROUP BY status
    `);

    let totalLeads = 0;
    let openLeads = 0;
    const leadStatusMap = {};
    for (const row of leadsRes.rows) {
      totalLeads += parseInt(row.status_count, 10);
      if (row.status !== 'Won' && row.status !== 'Lost') {
        openLeads += parseInt(row.status_count, 10);
      }
      leadStatusMap[row.status] = parseInt(row.status_count, 10);
    }

    const proposalsRes = await query(`
      SELECT 
        COUNT(CASE WHEN status IN ('Draft', 'Sent', 'Viewed', 'Negotiation') THEN 1 END) as pending_proposals,
        COUNT(*) as total_proposals
      FROM founder_os_proposals
    `);
    const pendingProposals = parseInt(proposalsRes.rows[0]?.pending_proposals || 0, 10);

    // 3. Monthly Financial Chart Data (Real data aggregation by month)
    const monthlyRevRes = await query(`
      SELECT 
        TO_CHAR(payment_date, 'YYYY-MM') as month,
        SUM(CASE WHEN payment_status = 'Paid' THEN amount ELSE 0 END) as revenue
      FROM founder_os_revenue
      WHERE payment_date >= CURRENT_DATE - INTERVAL '12 months'
      GROUP BY TO_CHAR(payment_date, 'YYYY-MM')
      ORDER BY month ASC
    `);

    const monthlyExpRes = await query(`
      SELECT 
        TO_CHAR(expense_date, 'YYYY-MM') as month,
        SUM(amount) as expenses
      FROM founder_os_expenses
      WHERE expense_date >= CURRENT_DATE - INTERVAL '12 months'
      GROUP BY TO_CHAR(expense_date, 'YYYY-MM')
      ORDER BY month ASC
    `);

    const monthlyMap = {};
    for (const row of monthlyRevRes.rows) {
      monthlyMap[row.month] = { month: row.month, revenue: parseFloat(row.revenue || 0), expenses: 0, profit: 0 };
    }
    for (const row of monthlyExpRes.rows) {
      if (!monthlyMap[row.month]) {
        monthlyMap[row.month] = { month: row.month, revenue: 0, expenses: parseFloat(row.expenses || 0), profit: 0 };
      } else {
        monthlyMap[row.month].expenses = parseFloat(row.expenses || 0);
      }
    }

    const monthlyChartData = Object.values(monthlyMap)
      .map(item => ({
        ...item,
        profit: item.revenue - item.expenses
      }))
      .sort((a, b) => a.month.localeCompare(b.month));

    // 4. Live Actionable Notifications / Alerts (Computed dynamically from real database records)
    const alerts = [];

    // Follow-ups due or overdue
    const followupsRes = await query(`
      SELECT id, name, company, next_followup, status
      FROM founder_os_leads
      WHERE next_followup IS NOT NULL 
        AND next_followup <= CURRENT_DATE 
        AND status NOT IN ('Won', 'Lost')
      ORDER BY next_followup ASC
      LIMIT 5
    `);
    for (const f of followupsRes.rows) {
      const isOverdue = new Date(f.next_followup) < new Date(new Date().setHours(0,0,0,0));
      alerts.push({
        id: `followup-${f.id}`,
        type: isOverdue ? 'danger' : 'warning',
        category: 'Sales',
        title: isOverdue ? `Overdue Follow-up: ${f.name}` : `Follow-up Due Today: ${f.name}`,
        description: `${f.company ? f.company + ' — ' : ''}Scheduled for ${new Date(f.next_followup).toLocaleDateString()}`,
        link: `/admin?tab=sales&sub=leads&leadId=${f.id}`
      });
    }

    // Projects with approaching deadlines (within next 7 days) or overdue
    const deadlinesRes = await query(`
      SELECT id, project_name, client_name, deadline, status
      FROM founder_os_projects
      WHERE deadline IS NOT NULL 
        AND deadline <= CURRENT_DATE + INTERVAL '7 days'
        AND status NOT IN ('Completed', 'On Hold')
      ORDER BY deadline ASC
      LIMIT 5
    `);
    for (const d of deadlinesRes.rows) {
      const isOverdue = new Date(d.deadline) < new Date(new Date().setHours(0,0,0,0));
      alerts.push({
        id: `deadline-${d.id}`,
        type: isOverdue ? 'danger' : 'info',
        category: 'Delivery',
        title: isOverdue ? `Overdue Deadline: ${d.project_name}` : `Upcoming Deadline: ${d.project_name}`,
        description: `Client: ${d.client_name} • Due ${new Date(d.deadline).toLocaleDateString()}`,
        link: `/admin?tab=delivery&projectId=${d.id}`
      });
    }

    // Outstanding / Pending payments
    if (outstandingPayments > 0) {
      alerts.push({
        id: 'finance-pending',
        type: 'warning',
        category: 'Finance',
        title: 'Outstanding Client Payments',
        description: `Total ₹${outstandingPayments.toLocaleString('en-IN')} pending or overdue in receivables.`,
        link: '/admin?tab=finance&sub=revenue'
      });
    }

    // 5. Recent Activity Logs (Actual events only)
    const activityRes = await query(`
      SELECT id, user_name, entity_type, entity_id, action, details, created_at
      FROM founder_os_activity_logs
      ORDER BY created_at DESC
      LIMIT 8
    `);

    // 6. Settings
    const settingsRes = await query('SELECT key, value FROM founder_os_settings');
    const settings = {};
    for (const s of settingsRes.rows) {
      settings[s.key] = s.value;
    }

    return NextResponse.json({
      success: true,
      metrics: {
        totalRevenue,
        totalExpenses,
        netProfit,
        activeProjects,
        totalProjects,
        openLeads,
        totalLeads,
        pendingProposals,
        outstandingPayments
      },
      charts: {
        monthlyChartData,
        leadStatusMap,
        projectStatusMap
      },
      alerts,
      recentActivity: activityRes.rows,
      settings
    });
  } catch (err) {
    console.error('Founder OS dashboard error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
