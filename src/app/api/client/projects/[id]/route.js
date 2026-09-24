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

    // Fetch client-visible stages
    const stagesRes = await query(`
      SELECT 
        id, stage_name, stage_order, status,
        COALESCE(visible_to_client, TRUE) as visible_to_client,
        client_title, client_description, client_note,
        COALESCE(stage_weight, 1) as stage_weight,
        target_date, completed_at
      FROM founder_os_project_stages
      WHERE project_id = $1 AND (visible_to_client IS NULL OR visible_to_client = TRUE)
      ORDER BY stage_order ASC
    `, [projectId]);

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

    // Fetch public team assignment (safe role and public name only)
    const teamRes = await query(`
      SELECT person_name, role 
      FROM founder_os_project_team 
      WHERE project_id = $1
    `, [projectId]);

    return NextResponse.json({
      success: true,
      project: {
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
      }
    }, { headers: getPortalSecurityHeaders() });
  } catch (err) {
    console.error('Client project get error:', err);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve project details.' },
      { status: 500, headers: getPortalSecurityHeaders() }
    );
  }
}
