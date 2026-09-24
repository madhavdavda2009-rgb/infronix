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
    const projectId = parseInt(id, 10);

    const projectRes = await query(`
      SELECT p.*, c.name as client_contact_name, c.company as client_company, c.phone as client_phone, c.email as client_email, c.industry as client_industry
      FROM founder_os_projects p
      LEFT JOIN founder_os_clients c ON c.id = p.client_id
      WHERE p.id = $1
    `, [projectId]);

    if (projectRes.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Project not found' }, { status: 404 });
    }
    const project = projectRes.rows[0];

    // Tasks
    const tasksRes = await query('SELECT * FROM founder_os_tasks WHERE project_id = $1 ORDER BY stage_id ASC NULLS LAST, id ASC', [projectId]);
    // Stages
    const stagesRes = await query('SELECT * FROM founder_os_project_stages WHERE project_id = $1 ORDER BY stage_order ASC, id ASC', [projectId]);
    // Payment Schedules
    const paymentSchedulesRes = await query('SELECT * FROM founder_os_payment_schedules WHERE project_id = $1 ORDER BY due_date ASC NULLS LAST, id ASC', [projectId]);
    // Planned Costs
    const plannedCostsRes = await query('SELECT * FROM founder_os_planned_costs WHERE project_id = $1 ORDER BY id ASC', [projectId]);
    // Revenue linked
    const revenueRes = await query('SELECT * FROM founder_os_revenue WHERE project_id = $1 ORDER BY payment_date DESC, created_at DESC', [projectId]);
    // Expenses linked
    const expensesRes = await query('SELECT * FROM founder_os_expenses WHERE project_id = $1 ORDER BY expense_date DESC, created_at DESC', [projectId]);
    // Client Requirements
    const reqRes = await query('SELECT * FROM founder_os_client_requirements WHERE project_id = $1 ORDER BY id ASC', [projectId]);
    // Team
    const teamRes = await query('SELECT t.*, p.name AS person_name FROM founder_os_project_team t JOIN founder_os_people p ON p.id = t.person_id WHERE t.project_id = $1 ORDER BY t.id ASC', [projectId]);
    project.assigned_person = teamRes.rows.map(member => member.person_name).join(', ');
    // QA Checklist
    const qaRes = await query('SELECT * FROM founder_os_qa_checklist WHERE project_id = $1 ORDER BY id ASC', [projectId]);
    // Client Feedback
    const feedbackRes = await query('SELECT * FROM founder_os_feedback WHERE project_id = $1 ORDER BY created_at DESC', [projectId]);
    // Activity Logs
    const activityRes = await query(`
      SELECT * FROM founder_os_activity_logs 
      WHERE entity_type = 'Project' AND entity_id = $1 
      ORDER BY created_at DESC LIMIT 15
    `, [projectId]);

    // Portal Settings
    const portalSettingsRes = await query('SELECT * FROM founder_os_project_portal_settings WHERE project_id = $1', [projectId]);
    const pRow = portalSettingsRes.rows[0] || {};
    const portalSettings = {
      id: pRow.id,
      project_id: projectId,
      portal_enabled: pRow.portal_enabled !== undefined ? Boolean(pRow.portal_enabled) : true,
      is_portal_enabled: pRow.portal_enabled !== undefined ? Boolean(pRow.portal_enabled) : true,
      portal_display_name: pRow.portal_display_name || project.project_name,
      client_summary: pRow.client_summary || '',
      client_announcement: pRow.client_announcement || '',
      preview_enabled: Boolean(pRow.preview_enabled),
      allow_live_preview: Boolean(pRow.preview_enabled),
      preview_url: pRow.preview_url || '',
      staging_preview_url: pRow.preview_url || '',
      preview_label: pRow.preview_label || 'Live Staging Preview',
      preview_status: pRow.preview_status || 'Preparing',
      preview_instructions: pRow.preview_instructions || '',
      change_requests_enabled: pRow.change_requests_enabled !== undefined ? Boolean(pRow.change_requests_enabled) : true,
      allow_change_requests: pRow.change_requests_enabled !== undefined ? Boolean(pRow.change_requests_enabled) : true,
      change_request_policy: pRow.change_request_policy || 'Change requests will be reviewed and scheduled by the delivery team.',
      visible_financials: pRow.visible_financials !== undefined ? Boolean(pRow.visible_financials) : true
    };

    // Client Change Requests with comments
    const changeRequestsRes = await query(`
      SELECT 
        cr.*,
        u.full_name as author_name,
        u.email as author_email,
        u.public_client_id,
        s.stage_name,
        s.client_title as stage_client_title,
        COUNT(c.id) as total_comments,
        COUNT(CASE WHEN c.is_internal_note = TRUE THEN 1 END) as internal_notes_count
      FROM founder_os_client_change_requests cr
      LEFT JOIN founder_os_portal_users u ON u.id = cr.portal_user_id
      LEFT JOIN founder_os_project_stages s ON s.id = cr.stage_id
      LEFT JOIN founder_os_change_request_comments c ON c.change_request_id = cr.id
      WHERE cr.project_id = $1
      GROUP BY cr.id, u.full_name, u.email, u.public_client_id, s.stage_name, s.client_title
      ORDER BY cr.created_at DESC
    `, [projectId]);

    // Approvals Audit
    const approvalsRes = await query(`
      SELECT 
        a.*,
        u.full_name as client_user_name,
        u.email as client_user_email,
        u.public_client_id
      FROM founder_os_client_approvals a
      LEFT JOIN founder_os_portal_users u ON u.id = a.portal_user_id
      WHERE a.project_id = $1
      ORDER BY a.created_at DESC
    `, [projectId]);

    // Portal Documents
    const portalDocsRes = await query(`
      SELECT * FROM founder_os_portal_documents
      WHERE project_id = $1
      ORDER BY created_at DESC
    `, [projectId]);

    // Financial Metrics Calculation
    const contractValue = parseFloat(project.project_value || 0);

    let cashReceived = 0;
    for (const r of revenueRes.rows) {
      if (r.payment_status === 'Paid') {
        cashReceived += parseFloat(r.amount || 0);
      }
    }

    const outstanding = Math.max(0, contractValue - cashReceived);

    let actualExpenses = 0;
    for (const e of expensesRes.rows) {
      actualExpenses += parseFloat(e.amount || 0);
    }

    let plannedCosts = 0;
    for (const pc of plannedCostsRes.rows) {
      if (pc.status === 'Planned') {
        plannedCosts += parseFloat(pc.expected_amount || 0);
      }
    }

    const realizedCashPosition = cashReceived - actualExpenses;
    const projectedProfit = contractValue - (actualExpenses + plannedCosts);

    // Setup Progress Calculation
    const setupChecklist = {
      client: Boolean(project.client_name),
      finance: contractValue > 0,
      paymentPlan: paymentSchedulesRes.rows.length > 0,
      delivery: stagesRes.rows.length > 0,
      team: teamRes.rows.length > 0,
      requirements: reqRes.rows.length > 0
    };

    const setupItems = Object.values(setupChecklist);
    const setupPassedCount = setupItems.filter(Boolean).length;
    const setupPercentage = Math.round((setupPassedCount / setupItems.length) * 100);

    // Missing Setup Action Items (derived strictly from real data)
    const missingSetupItems = [];
    if (!setupChecklist.team) {
      missingSetupItems.push({ key: 'team', text: 'No team members assigned to this project' });
    }
    if (project.hosting_manager === 'Not decided' || !project.hosting_manager) {
      missingSetupItems.push({ key: 'hosting', text: 'Hosting responsibility has not been decided' });
    }
    if (project.domain_manager === 'Not decided' || !project.domain_manager) {
      missingSetupItems.push({ key: 'domain', text: 'Domain management responsibility is not specified' });
    }
    const hasUnscheduledMilestone = paymentSchedulesRes.rows.some(m => !m.due_date && m.status !== 'Received');
    if (hasUnscheduledMilestone) {
      missingSetupItems.push({ key: 'milestone_date', text: 'Final payment milestone due date is missing' });
    }
    const pendingReqCount = reqRes.rows.filter(r => r.status === 'Pending').length;
    if (pendingReqCount > 0) {
      missingSetupItems.push({ key: 'requirements', text: `${pendingReqCount} client requirements are still pending` });
    }

    return NextResponse.json({
      success: true,
      project,
      tasks: tasksRes.rows,
      stages: stagesRes.rows,
      paymentSchedules: paymentSchedulesRes.rows,
      plannedCosts: plannedCostsRes.rows,
      revenue: revenueRes.rows,
      expenses: expensesRes.rows,
      requirements: reqRes.rows,
      team: teamRes.rows,
      qaChecklist: qaRes.rows,
      feedback: feedbackRes.rows,
      activity: activityRes.rows,
      portalSettings,
      changeRequests: changeRequestsRes.rows,
      approvals: approvalsRes.rows,
      portalDocuments: portalDocsRes.rows,
      financials: {
        contractValue,
        cashReceived,
        outstanding,
        actualExpenses,
        plannedCosts,
        realizedCashPosition,
        projectedProfit
      },
      setup: {
        checklist: setupChecklist,
        percentage: setupPercentage,
        missingItems: missingSetupItems
      }
    });
  } catch (err) {
    console.error('Project GET by ID error:', err);
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
    const body = await request.json();

    const allowed = ['project_name', 'client_name', 'client_id', 'project_value', 'project_type',
      'start_date', 'deadline', 'status', 'priority', 'assigned_person', 'domain_manager',
      'hosting_manager', 'hosting_provider', 'hosting_renewal_date', 'hosting_cost', 'hosting_billing', 'notes'];
    const values = [];
    const assignments = [];
    for (const key of allowed) {
      if (!Object.hasOwn(body, key)) continue;
      let value = typeof body[key] === 'string' ? body[key].trim() : body[key];
      if (['project_name', 'client_name'].includes(key) && !value) {
        return NextResponse.json({ success: false, error: 'Project and client names cannot be empty' }, { status: 400 });
      }
      if (['project_value', 'hosting_cost'].includes(key)) {
        value = Number(value);
        if (!Number.isFinite(value) || value < 0) return NextResponse.json({ success: false, error: 'Amounts must be non-negative numbers' }, { status: 400 });
      }
      values.push(value === '' ? null : value);
      assignments.push(`${key} = $${values.length}`);
    }
    if (!assignments.length) return NextResponse.json({ success: false, error: 'No project changes supplied' }, { status: 400 });
    values.push(id);
    const updateRes = await query(`UPDATE founder_os_projects SET ${assignments.join(', ')}, updated_at = NOW() WHERE id = $${values.length} RETURNING *`, values);

    if (updateRes.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Project not found' }, { status: 404 });
    }

    const project = updateRes.rows[0];
    await logActivity(auth.username, 'Project', id, 'Updated', `Updated project: ${project.project_name} (Status: ${project.status})`);

    return NextResponse.json({ success: true, project });
  } catch (err) {
    console.error('Project PUT error:', err);
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

    const pRes = await query('SELECT project_name FROM founder_os_projects WHERE id = $1', [id]);
    const name = pRes.rows[0]?.project_name || id;

    await query('DELETE FROM founder_os_projects WHERE id = $1', [id]);
    await logActivity(auth.username, 'Project', id, 'Deleted', `Deleted project: ${name}`);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Project DELETE error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
