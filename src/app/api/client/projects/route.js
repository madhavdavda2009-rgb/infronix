import { NextResponse } from 'next/server';
import { verifyClientAuth, getPortalSecurityHeaders } from '@/lib/client_auth';
import { query, initFounderOSDb } from '@/lib/founder_os_db';

export async function GET(request) {
  try {
    const auth = await verifyClientAuth(request);
    if (!auth) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized.' },
        { status: 401, headers: getPortalSecurityHeaders() }
      );
    }

    await initFounderOSDb();
    const { client } = auth;

    // Fetch client projects with portal settings
    const projectsRes = await query(`
      SELECT 
        p.id,
        p.project_name,
        p.project_type,
        p.status,
        p.priority,
        p.start_date,
        p.deadline,
        p.assigned_person,
        p.created_at,
        p.updated_at,
        COALESCE(s.portal_enabled, TRUE) as portal_enabled,
        s.portal_display_name,
        s.client_summary,
        s.client_announcement,
        s.preview_enabled,
        s.preview_url,
        s.preview_label,
        s.preview_status,
        COALESCE(s.change_requests_enabled, TRUE) as change_requests_enabled,
        COALESCE(s.visible_financials, TRUE) as visible_financials
      FROM founder_os_projects p
      LEFT JOIN founder_os_project_portal_settings s ON s.project_id = p.id
      WHERE p.client_id = $1 AND (s.portal_enabled IS NULL OR s.portal_enabled = TRUE)
      ORDER BY 
        CASE WHEN p.status NOT IN ('Completed', 'Cancelled') THEN 1 ELSE 2 END,
        p.created_at DESC
    `, [client.id]);

    const projectIds = projectsRes.rows.map(p => p.id);

    if (projectIds.length === 0) {
      return NextResponse.json({ success: true, projects: [] }, { headers: getPortalSecurityHeaders() });
    }

    // Fetch client-visible stages for progress computation
    const stagesRes = await query(`
      SELECT 
        id, project_id, stage_name, stage_order, status,
        COALESCE(visible_to_client, TRUE) as visible_to_client,
        client_title, client_description, client_note,
        COALESCE(stage_weight, 1) as stage_weight
      FROM founder_os_project_stages
      WHERE project_id = ANY($1::int[]) AND (visible_to_client IS NULL OR visible_to_client = TRUE)
      ORDER BY project_id, stage_order ASC
    `, [projectIds]);

    // Fetch counts for pending requirements & open change requests
    const countsRes = await query(`
      SELECT 
        p.id as project_id,
        COUNT(DISTINCT CASE WHEN req.status = 'Pending' THEN req.id END) as pending_reqs,
        COUNT(DISTINCT CASE WHEN cr.status NOT IN ('Completed', 'Cancelled', 'Rejected') THEN cr.id END) as open_crs
      FROM founder_os_projects p
      LEFT JOIN founder_os_client_requirements req ON req.project_id = p.id
      LEFT JOIN founder_os_client_change_requests cr ON cr.project_id = p.id
      WHERE p.id = ANY($1::int[])
      GROUP BY p.id
    `, [projectIds]);

    const countsMap = {};
    for (const row of countsRes.rows) {
      countsMap[row.project_id] = {
        pending_reqs: parseInt(row.pending_reqs || 0, 10),
        open_crs: parseInt(row.open_crs || 0, 10)
      };
    }

    const stagesByProject = {};
    for (const stage of stagesRes.rows) {
      if (!stagesByProject[stage.project_id]) stagesByProject[stage.project_id] = [];
      stagesByProject[stage.project_id].push(stage);
    }

    // Map projects with authentic progress calculation
    const projects = projectsRes.rows.map(p => {
      const pStages = stagesByProject[p.id] || [];
      const totalStages = pStages.length;
      const completedStages = pStages.filter(s => s.status === 'Completed').length;

      // Weighted or equal progress calculation
      let totalWeight = 0;
      let completedWeight = 0;
      for (const s of pStages) {
        const w = s.stage_weight || 1;
        totalWeight += w;
        if (s.status === 'Completed') completedWeight += w;
      }

      const progressPercent = totalWeight > 0 
        ? Math.min(100, Math.round((completedWeight / totalWeight) * 100))
        : (p.status === 'Completed' ? 100 : (p.status === 'Development' ? 50 : 15));

      // Determine current stage
      const currentStageObj = pStages.find(s => s.status !== 'Completed') || pStages[pStages.length - 1];
      const currentStage = currentStageObj ? (currentStageObj.client_title || currentStageObj.stage_name) : p.status;

      const pCounts = countsMap[p.id] || { pending_reqs: 0, open_crs: 0 };

      return {
        id: p.id,
        name: p.portal_display_name || p.project_name,
        original_name: p.project_name,
        type: p.project_type,
        status: p.status,
        priority: p.priority,
        start_date: p.start_date,
        deadline: p.deadline,
        assigned_person: p.assigned_person || 'InfronixWeb Lead Engineer',
        client_summary: p.client_summary || '',
        client_announcement: p.client_announcement || '',
        preview_enabled: Boolean(p.preview_enabled),
        preview_url: p.preview_enabled ? p.preview_url : null,
        preview_status: p.preview_status || 'Preparing',
        change_requests_enabled: p.change_requests_enabled !== false,
        visible_financials: p.visible_financials !== false,
        total_stages: totalStages,
        completed_stages: completedStages,
        progress_percentage: progressPercent,
        current_stage: currentStage,
        pending_requirements: pCounts.pending_reqs,
        open_change_requests: pCounts.open_crs,
        updated_at: p.updated_at
      };
    });

    return NextResponse.json({ success: true, projects }, { headers: getPortalSecurityHeaders() });
  } catch (err) {
    console.error('Client projects list error:', err);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve project list.' },
      { status: 500, headers: getPortalSecurityHeaders() }
    );
  }
}
