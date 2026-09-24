import { NextResponse } from 'next/server';
import { verifyAdminAuth } from '@/lib/auth';
import { query, initFounderOSDb } from '@/lib/founder_os_db';
import { validatePreviewUrl } from '@/lib/preview_validator';
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

    const projRes = await query('SELECT * FROM founder_os_projects WHERE id = $1', [projectId]);
    if (projRes.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Project not found' }, { status: 404 });
    }
    const project = projRes.rows[0];

    const settingsRes = await query('SELECT * FROM founder_os_project_portal_settings WHERE project_id = $1', [projectId]);
    const row = settingsRes.rows[0] || {};
    
    const settings = {
      id: row.id,
      project_id: projectId,
      portal_enabled: row.portal_enabled !== undefined ? Boolean(row.portal_enabled) : true,
      is_portal_enabled: row.portal_enabled !== undefined ? Boolean(row.portal_enabled) : true,
      portal_display_name: row.portal_display_name || project.project_name,
      client_summary: row.client_summary || '',
      client_announcement: row.client_announcement || '',
      preview_enabled: Boolean(row.preview_enabled),
      allow_live_preview: Boolean(row.preview_enabled),
      preview_url: row.preview_url || '',
      staging_preview_url: row.preview_url || '',
      preview_label: row.preview_label || 'Live Staging Preview',
      preview_status: row.preview_status || 'Preparing',
      preview_instructions: row.preview_instructions || '',
      change_requests_enabled: row.change_requests_enabled !== undefined ? Boolean(row.change_requests_enabled) : true,
      allow_change_requests: row.change_requests_enabled !== undefined ? Boolean(row.change_requests_enabled) : true,
      change_request_policy: row.change_request_policy || 'Change requests will be reviewed and scheduled by the delivery team.',
      visible_financials: row.visible_financials !== undefined ? Boolean(row.visible_financials) : true
    };

    return NextResponse.json({
      success: true,
      project,
      settings
    });
  } catch (err) {
    console.error('Get project portal settings error:', err);
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
    const projectId = parseInt(id, 10);

    const projRes = await query('SELECT * FROM founder_os_projects WHERE id = $1', [projectId]);
    if (projRes.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Project not found' }, { status: 404 });
    }
    const project = projRes.rows[0];

    const body = await request.json();
    const portalEnabled = body.is_portal_enabled !== undefined
      ? Boolean(body.is_portal_enabled)
      : (body.portal_enabled !== undefined ? Boolean(body.portal_enabled) : true);

    const portalDisplayName = typeof body.portal_display_name === 'string' && body.portal_display_name.trim() !== ''
      ? body.portal_display_name.trim()
      : project.project_name;

    const clientSummary = typeof body.client_summary === 'string' ? body.client_summary.trim() : '';
    const clientAnnouncement = typeof body.client_announcement === 'string' ? body.client_announcement.trim() : '';
    
    const previewEnabled = body.allow_live_preview !== undefined
      ? Boolean(body.allow_live_preview)
      : Boolean(body.preview_enabled);

    let previewUrl = (typeof body.staging_preview_url === 'string' ? body.staging_preview_url : (typeof body.preview_url === 'string' ? body.preview_url : '')).trim();

    const previewLabel = typeof body.preview_label === 'string' && body.preview_label.trim() !== ''
      ? body.preview_label.trim()
      : 'Live Staging Preview';

    const previewStatus = body.preview_status || (previewEnabled && previewUrl ? 'Available' : 'Preparing');
    const previewInstructions = typeof body.preview_instructions === 'string' ? body.preview_instructions.trim() : '';
    
    const changeRequestsEnabled = body.allow_change_requests !== undefined
      ? Boolean(body.allow_change_requests)
      : (body.change_requests_enabled !== undefined ? Boolean(body.change_requests_enabled) : true);

    const changeRequestPolicy = typeof body.change_request_policy === 'string'
      ? body.change_request_policy.trim()
      : 'Change requests will be reviewed and scheduled by the delivery team.';

    const visibleFinancials = body.visible_financials !== undefined ? Boolean(body.visible_financials) : true;

    // Validate preview URL if enabled and URL provided
    if (previewEnabled && previewUrl) {
      const validation = validatePreviewUrl(previewUrl);
      if (!validation.valid) {
        return NextResponse.json({ success: false, error: `Invalid preview URL: ${validation.error}` }, { status: 400 });
      }
      previewUrl = validation.sanitizedUrl || previewUrl;
    }

    const upsertRes = await query(`
      INSERT INTO founder_os_project_portal_settings (
        project_id, portal_enabled, portal_display_name, client_summary, client_announcement,
        preview_enabled, preview_url, preview_label, preview_status, preview_instructions,
        change_requests_enabled, change_request_policy, visible_financials, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, NOW())
      ON CONFLICT (project_id) DO UPDATE
      SET portal_enabled = EXCLUDED.portal_enabled,
          portal_display_name = EXCLUDED.portal_display_name,
          client_summary = EXCLUDED.client_summary,
          client_announcement = EXCLUDED.client_announcement,
          preview_enabled = EXCLUDED.preview_enabled,
          preview_url = EXCLUDED.preview_url,
          preview_label = EXCLUDED.preview_label,
          preview_status = EXCLUDED.preview_status,
          preview_instructions = EXCLUDED.preview_instructions,
          change_requests_enabled = EXCLUDED.change_requests_enabled,
          change_request_policy = EXCLUDED.change_request_policy,
          visible_financials = EXCLUDED.visible_financials,
          updated_at = NOW()
      RETURNING *
    `, [
      projectId,
      portalEnabled,
      portalDisplayName,
      clientSummary,
      clientAnnouncement,
      previewEnabled,
      previewUrl,
      previewLabel,
      previewStatus,
      previewInstructions,
      changeRequestsEnabled,
      changeRequestPolicy,
      visibleFinancials
    ]);

    const updatedRow = upsertRes.rows[0];
    const formattedSettings = {
      ...updatedRow,
      is_portal_enabled: updatedRow.portal_enabled,
      allow_live_preview: updatedRow.preview_enabled,
      staging_preview_url: updatedRow.preview_url || '',
      allow_change_requests: updatedRow.change_requests_enabled
    };

    await logActivity(
      auth.username || 'Admin',
      'Project Portal Settings',
      projectId,
      'Updated Portal Settings',
      `Updated client portal configuration for project "${project.project_name}"`
    );

    return NextResponse.json({
      success: true,
      message: 'Client portal settings updated successfully.',
      settings: formattedSettings
    });
  } catch (err) {
    console.error('Update project portal settings error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
