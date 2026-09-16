import { NextResponse } from 'next/server';
import { getPool, initFounderOSDb, DEFAULT_STAGE_TASKS, DEFAULT_QA_CHECKLIST_TEMPLATES } from '@/lib/founder_os_db';
import { verifyAdminAuth } from '@/lib/auth';
import { buildPaymentPlan, money } from '@/lib/payment-plan';

export async function POST(request) {
  const auth = verifyAdminAuth(request);
  if (!auth) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  let client;

  try {
    await initFounderOSDb();
    client = await getPool().connect();
    const body = await request.json();

    const {
      client_mode, // 'existing' | 'new'
      client_id,
      new_client,
      project_name,
      project_type,
      description,
      start_date,
      deadline,
      priority,
      status,
      project_value,
      has_advance,
      advance_amount,
      advance_date,
      advance_method,
      payment_structure,
      final_amount,
      milestones,
      has_costs,
      planned_costs,
      team_members,
      stages,
      generate_tasks,
      custom_tasks,
      client_requirements,
      domain_manager,
      hosting_manager,
      hosting_provider,
      hosting_renewal_date,
      hosting_cost,
      hosting_billing,
      lead_id,
      proposal_id,
      is_quick_mode
    } = body;

    if (typeof project_name !== 'string' || !project_name.trim()) {
      return NextResponse.json({ success: false, error: 'Project name is required' }, { status: 400 });
    }

    let paymentPlan;
    try {
      paymentPlan = buildPaymentPlan(body);
      money(hosting_cost, 'Hosting cost');
      for (const cost of has_costs ? (planned_costs || []) : []) money(cost.expected_amount, 'Planned cost');
      if (start_date && deadline && deadline < start_date) throw new Error('Deadline cannot precede start date');
      if (client_mode === 'new' && !new_client?.name?.trim()) throw new Error('Client name is required');
      if (client_mode !== 'new' && !client_id) throw new Error('Select an existing client');
    } catch (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
    await client.query('BEGIN');

    // 1. Resolve or Create Client
    let resolvedClientId = client_id ? parseInt(client_id, 10) : null;
    let resolvedClientName = '';

    if (client_mode === 'new' && new_client?.name) {
      const newClientRes = await client.query(`
        INSERT INTO founder_os_clients
          (name, company, phone, email, industry, notes, lead_id, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
        RETURNING *
      `, [
        new_client.name.trim(),
        new_client.company?.trim() || null,
        new_client.phone?.trim() || null,
        new_client.email?.trim() || null,
        new_client.industry?.trim() || null,
        new_client.notes?.trim() || null,
        lead_id ? parseInt(lead_id, 10) : null
      ]);
      resolvedClientId = newClientRes.rows[0].id;
      resolvedClientName = newClientRes.rows[0].name;
    } else if (resolvedClientId) {
      const existingClientRes = await client.query('SELECT name FROM founder_os_clients WHERE id = $1', [resolvedClientId]);
      if (existingClientRes.rows.length > 0) {
        resolvedClientName = existingClientRes.rows[0].name;
      }
    }

    if (!resolvedClientName) {
      await client.query('ROLLBACK');
      return NextResponse.json({ success: false, error: 'Selected client does not exist' }, { status: 400 });
    }

    for (const member of team_members || []) {
      const person = await client.query("SELECT name FROM founder_os_people WHERE id = $1 AND status = 'Active'", [member.person_id]);
      if (!person.rows[0]) {
        await client.query('ROLLBACK');
        return NextResponse.json({ success: false, error: 'Choose active team members from the directory' }, { status: 400 });
      }
      member.person_name = person.rows[0].name;
    }

    // 2. If Lead linked, update Lead to 'Won' & link client
    if (lead_id) {
      await client.query(`
        UPDATE founder_os_leads
        SET 
          status = 'Won',
          client_id = COALESCE(client_id, $1),
          updated_at = NOW()
        WHERE id = $2
      `, [resolvedClientId, lead_id]);
    }

    // 3. If Proposal linked, update status to 'Accepted'
    if (proposal_id) {
      await client.query(`
        UPDATE founder_os_proposals
        SET 
          status = 'Accepted',
          client_id = COALESCE(client_id, $1),
          updated_at = NOW()
        WHERE id = $2
      `, [resolvedClientId, proposal_id]);
    }

    const val = parseFloat(project_value || 0);
    const adv = has_advance ? parseFloat(advance_amount || 0) : 0;
    const fin = Math.max(0, val - adv);

    // 4. Create Project Record
    const projectRes = await client.query(`
      INSERT INTO founder_os_projects
        (project_name, client_name, client_id, lead_id, proposal_id, project_type, project_value, payment_structure, advance_amount, final_amount, start_date, deadline, status, priority, assigned_person, domain_manager, hosting_manager, hosting_provider, hosting_renewal_date, hosting_cost, hosting_billing, setup_completed, notes, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, NOW(), NOW())
      RETURNING *
    `, [
      project_name.trim(),
      resolvedClientName,
      resolvedClientId,
      lead_id ? parseInt(lead_id, 10) : null,
      proposal_id ? parseInt(proposal_id, 10) : null,
      project_type || 'Business Website',
      val,
      payment_structure || 'Full Payment',
      adv,
      fin,
      start_date || null,
      deadline || null,
      status || 'Planning',
      priority || 'Medium',
      team_members && team_members.length > 0 ? team_members.map(t => t.person_name).join(', ') : (body.assigned_person || null),
      domain_manager || 'Not decided',
      hosting_manager || 'Not decided',
      hosting_provider || null,
      hosting_renewal_date || null,
      parseFloat(hosting_cost || 0),
      hosting_billing || null,
      Boolean(!is_quick_mode),
      description || body.notes || null
    ]);

    const project = projectRes.rows[0];
    const projectId = project.id;

    // 5. If Advance Payment received, create Revenue Transaction and link
    let advanceRevenueId = null;
    if (has_advance && adv > 0) {
      const revRes = await client.query(`
        INSERT INTO founder_os_revenue
          (client_name, client_id, project_id, project_name, amount, payment_date, payment_status, payment_method, notes, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, COALESCE($6, CURRENT_DATE), 'Paid', $7, $8, NOW(), NOW())
        RETURNING id
      `, [
        resolvedClientName,
        resolvedClientId,
        projectId,
        project.project_name,
        adv,
        advance_date || null,
        advance_method || 'Bank Transfer',
        `Advance payment recorded during project setup wizard`
      ]);
      advanceRevenueId = revRes.rows[0].id;
    }

    // Allocate the advance once, splitting partially paid installments.
    for (const milestone of paymentPlan) {
      await client.query(`
        INSERT INTO founder_os_payment_schedules
          (project_id, name, amount, due_date, status, paid_date, revenue_id, created_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
      `, [projectId, milestone.name, milestone.amount, milestone.due_date,
        milestone.received ? 'Received' : 'Pending',
        milestone.received ? (advance_date || new Date().toISOString().slice(0, 10)) : null,
        milestone.received ? advanceRevenueId : null]);
    }

    // 7. Create Planned Costs
    if (has_costs && Array.isArray(planned_costs)) {
      for (const cost of planned_costs) {
        if (cost.description && parseFloat(cost.expected_amount || 0) > 0) {
          await client.query(`
            INSERT INTO founder_os_planned_costs
              (project_id, cost_type, description, expected_amount, status, created_at)
            VALUES ($1, $2, $3, $4, 'Planned', NOW())
          `, [
            projectId,
            cost.cost_type || 'Freelancer',
            cost.description.trim(),
            parseFloat(cost.expected_amount)
          ]);
        }
      }
    }

    // 8. Assign Team Members
    if (Array.isArray(team_members)) {
      for (const tm of team_members) {
        if (tm.person_name) {
          await client.query(`
            INSERT INTO founder_os_project_team
              (project_id, person_id, person_name, role, created_at)
            VALUES ($1, $2, $3, $4, NOW())
          `, [
            projectId,
            tm.person_id ? parseInt(tm.person_id, 10) : null,
            tm.person_name.trim(),
            tm.role || 'Member'
          ]);
        }
      }
    }

    // 9. Create Project Stages
    const createdStageMap = {};
    if (Array.isArray(stages) && stages.length > 0) {
      let order = 1;
      for (const stageName of stages) {
        const sRes = await client.query(`
          INSERT INTO founder_os_project_stages
            (project_id, stage_name, stage_order, status, created_at)
          VALUES ($1, $2, $3, 'Pending', NOW())
          RETURNING id
        `, [projectId, stageName, order++]);
        createdStageMap[stageName] = sRes.rows[0].id;
      }
    }

    // 10. Generate Standard Tasks for selected stages
    if (generate_tasks && Array.isArray(stages)) {
      for (const stageName of stages) {
        const stageTasks = DEFAULT_STAGE_TASKS[stageName] || [];
        const stageId = createdStageMap[stageName] || null;
        for (const t of stageTasks) {
          await client.query(`
            INSERT INTO founder_os_tasks
              (project_id, stage_id, stage_name, title, description, priority, status, created_at, updated_at)
            VALUES ($1, $2, $3, $4, $5, $6, 'Todo', NOW(), NOW())
          `, [
            projectId,
            stageId,
            stageName,
            t.title,
            `Standard deliverable for ${stageName} stage`,
            t.priority || 'Medium'
          ]);
        }
      }
    } else if (Array.isArray(custom_tasks) && custom_tasks.length > 0) {
      for (const ct of custom_tasks) {
        if (ct.title) {
          await client.query(`
            INSERT INTO founder_os_tasks
              (project_id, stage_name, title, description, priority, status, assigned_to, deadline, created_at, updated_at)
            VALUES ($1, $2, $3, $4, $5, 'Todo', $6, $7, NOW(), NOW())
          `, [
            projectId,
            ct.stage_name || null,
            ct.title.trim(),
            ct.description || null,
            ct.priority || 'Medium',
            ct.assigned_to || null,
            ct.deadline || null
          ]);
        }
      }
    }

    // 11. Create Client Requirements
    if (Array.isArray(client_requirements)) {
      for (const reqItem of client_requirements) {
        if (reqItem) {
          await client.query(`
            INSERT INTO founder_os_client_requirements
              (project_id, item_name, status, created_at, updated_at)
            VALUES ($1, $2, 'Pending', NOW(), NOW())
          `, [projectId, reqItem.trim()]);
        }
      }
    }

    // 12. Initialize 11-point QA Checklist
    for (const qa of DEFAULT_QA_CHECKLIST_TEMPLATES) {
      await client.query(`
        INSERT INTO founder_os_qa_checklist
          (project_id, item_key, item_label, is_checked, updated_at)
        VALUES ($1, $2, $3, false, NOW())
      `, [projectId, qa.item_key, qa.item_label]);
    }

    // 13. Audit Log
    await client.query(`
      INSERT INTO founder_os_activity_logs
        (user_name, entity_type, entity_id, action, details, created_at)
      VALUES ($1, 'Project', $2, 'Created (Wizard)', $3, NOW())
    `, [
      auth.username || 'Founder',
      projectId,
      `Configured project ${project.project_name} for ${resolvedClientName} (₹${val.toLocaleString('en-IN')}) with interconnected workflow.`
    ]);

    await client.query('COMMIT');

    return NextResponse.json({
      success: true,
      project,
      projectId
    });
  } catch (err) {
    if (client) await client.query('ROLLBACK');
    console.error('Project Wizard Transaction error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  } finally {
    client?.release();
  }
}
