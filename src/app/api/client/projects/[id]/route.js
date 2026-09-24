import { NextResponse } from 'next/server';
import { 
  verifyClientAuth, 
  verifyClientProjectAccess, 
  getPortalSecurityHeaders 
} from '@/lib/client_auth';
import { query, initFounderOSDb } from '@/lib/founder_os_db';

export async function GET(request, { params }) {
  try {
    const auth = await verifyClientAuth(request);
    if (!auth) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized.' },
        { status: 401, headers: getPortalSecurityHeaders() }
      );
    }

    await initFounderOSDb();
    const resolvedParams = await params;
    const { id } = resolvedParams;
    const projectId = parseInt(id, 10);

    const accessCheck = await verifyClientProjectAccess(auth.client.id, auth.user.id, projectId);
    if (!accessCheck.authorized) {
      return NextResponse.json(
        { success: false, error: accessCheck.reason || 'Project not found.' },
        { status: 404, headers: getPortalSecurityHeaders() }
      );
    }

    const { project } = accessCheck;

    const url = new URL(request.url);
    const includeAll = url.searchParams.get('include') === 'all' || url.searchParams.get('full') === 'true';

    // Parallel fetch of project data
    const fetchPromises = [
      // 1. Client-visible stages
      query(`
        SELECT 
          id, stage_name, stage_order, status,
          COALESCE(client_title, stage_name) as client_title,
          client_description, client_status, client_note,
          COALESCE(stage_weight, 1) as stage_weight,
          target_date, completed_at, created_at
        FROM founder_os_project_stages
        WHERE project_id = $1 AND (visible_to_client IS NULL OR visible_to_client = TRUE)
        ORDER BY stage_order ASC
      `, [projectId]),
      // 2. Team
      query(`
        SELECT person_name, role 
        FROM founder_os_project_team 
        WHERE project_id = $1
      `, [projectId])
    ];

    if (includeAll) {
      // 3. Tasks
      fetchPromises.push(
        query(`
          SELECT 
            id, 
            COALESCE(client_title, title) as title,
            COALESCE(client_description, description) as description,
            stage_id, stage_name, status, deadline, created_at
          FROM founder_os_tasks
          WHERE project_id = $1 AND visible_to_client = TRUE
          ORDER BY deadline ASC, id ASC
        `, [projectId])
      );
      // 4. Requirements
      fetchPromises.push(
        query(`
          SELECT 
            id, project_id, item_name, status, notes,
            uploaded_file_url, uploaded_file_name, uploaded_file_size, uploaded_file_type,
            client_message, uploaded_at, admin_review_note, received_date, created_at, updated_at
          FROM founder_os_client_requirements
          WHERE project_id = $1
          ORDER BY CASE WHEN status = 'Pending' THEN 1 WHEN status = 'Submitted' THEN 2 ELSE 3 END, id ASC
        `, [projectId])
      );
      // 5. Payment schedules
      fetchPromises.push(
        query(`
          SELECT 
            s.id, s.name, s.amount, s.due_date, s.status, s.paid_date,
            r.invoice_number, r.payment_method
          FROM founder_os_payment_schedules s
          LEFT JOIN founder_os_revenue r ON r.id = s.revenue_id
          WHERE s.project_id = $1
          ORDER BY s.due_date ASC NULLS LAST, s.id ASC
        `, [projectId])
      );
      // 6. Paid receipts
      fetchPromises.push(
        query(`
          SELECT id, amount, payment_date, payment_status, payment_method, invoice_number, notes
          FROM founder_os_revenue 
          WHERE project_id = $1 AND payment_status = 'Paid'
          ORDER BY payment_date DESC
        `, [projectId])
      );
      // 7. Documents
      fetchPromises.push(
        query(`
          SELECT 
            id, title, category, description, file_url, file_name, file_size,
            version, is_download_allowed, published_date, created_at
          FROM founder_os_portal_documents
          WHERE project_id = $1 AND is_visible_to_client = TRUE
          ORDER BY published_date DESC, created_at DESC
        `, [projectId])
      );
      // 8. Change requests
      fetchPromises.push(
        query(`
          SELECT 
            cr.*,
            s.client_title as stage_title,
            COUNT(c.id) as comment_count
          FROM founder_os_client_change_requests cr
          LEFT JOIN founder_os_project_stages s ON s.id = cr.stage_id
          LEFT JOIN founder_os_change_request_comments c ON (c.change_request_id = cr.id AND c.is_internal_note = FALSE)
          WHERE cr.project_id = $1 AND cr.client_id = $2
          GROUP BY cr.id, s.client_title
          ORDER BY cr.created_at DESC
        `, [projectId, auth.client.id])
      );
    }

    const results = await Promise.all(fetchPromises);
    const stagesRes = results[0];
    const teamRes = results[1];
    const tasksRes = includeAll ? results[2] : null;
    const reqsRes = includeAll ? results[3] : null;
    const schedulesRes = includeAll ? results[4] : null;
    const revRes = includeAll ? results[5] : null;
    const docsRes = includeAll ? results[6] : null;
    const crsRes = includeAll ? results[7] : null;

    const stages = stagesRes.rows;
    let totalWeight = 0;
    let completedWeight = 0;
    for (const s of stages) {
      const w = s.stage_weight || 1;
      totalWeight += w;
      if (s.status === 'Completed') completedWeight += w;
    }

    const progressPercent = totalWeight > 0 
      ? Math.min(100, Math.round((completedWeight / totalWeight) * 100))
      : (project.status === 'Completed' ? 100 : (project.status === 'Development' ? 50 : 15));

    // Next milestone
    const upcomingStage = stages.find(s => s.status !== 'Completed');
    const nextMilestone = upcomingStage 
      ? (upcomingStage.client_title || upcomingStage.stage_name) 
      : 'Final Handover';

    const projectPayload = {
      id: project.id,
      name: project.portal_display_name || project.project_name,
      original_name: project.project_name,
      type: project.project_type,
      status: project.status,
      priority: project.priority,
      start_date: project.start_date,
      deadline: project.deadline,
      assigned_person: project.assigned_person || 'InfronixWeb Lead Engineer',
      client_summary: project.client_summary || '',
      client_announcement: project.client_announcement || '',
      preview_enabled: Boolean(project.preview_enabled),
      preview_url: project.preview_enabled ? project.preview_url : null,
      preview_label: project.preview_label || 'Live Staging Preview',
      preview_status: project.preview_status || 'Preparing',
      preview_instructions: project.preview_instructions || '',
      change_requests_enabled: project.change_requests_enabled !== false,
      change_request_policy: project.change_request_policy || '',
      visible_financials: project.visible_financials !== false,
      progress_percentage: progressPercent,
      total_stages: stages.length,
      completed_stages: stages.filter(s => s.status === 'Completed').length,
      current_stage: upcomingStage ? (upcomingStage.client_title || upcomingStage.stage_name) : 'Completed',
      next_milestone: nextMilestone,
      public_team: teamRes.rows,
      created_at: project.created_at,
      updated_at: project.updated_at
    };

    const responseData = {
      success: true,
      project: projectPayload,
      stages: stagesRes.rows
    };

    if (includeAll) {
      const contractValue = parseFloat(project.project_value || 0);
      let totalPaid = 0;
      for (const r of (revRes?.rows || [])) {
        totalPaid += parseFloat(r.amount || 0);
      }
      const outstanding = Math.max(0, contractValue - totalPaid);

      responseData.tasks = tasksRes?.rows || [];
      responseData.requirements = reqsRes?.rows || [];
      responseData.payments = {
        financials_enabled: project.visible_financials !== false,
        summary: {
          contract_value: contractValue,
          total_paid: totalPaid,
          outstanding: outstanding,
          payment_structure: project.payment_structure || 'Advance + Final'
        },
        schedules: schedulesRes?.rows || [],
        paid_receipts: (revRes?.rows || []).map(r => ({
          id: r.id,
          amount: parseFloat(r.amount || 0),
          payment_date: r.payment_date,
          payment_method: r.payment_method,
          invoice_number: r.invoice_number
        }))
      };
      responseData.documents = docsRes?.rows || [];
      responseData.change_requests = crsRes?.rows || [];
    }

    return NextResponse.json(responseData, { headers: getPortalSecurityHeaders() });
  } catch (err) {
    console.error('Client project get error:', err);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve project details.' },
      { status: 500, headers: getPortalSecurityHeaders() }
    );
  }
}
