import { NextResponse } from 'next/server';
import { query, initFounderOSDb } from '@/lib/founder_os_db';
import { verifyAdminAuth } from '@/lib/auth';
import { logActivity } from '@/lib/audit_logger';

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

    const { client_name, project_title, proposal_value, status, sent_date, followup_date, scope_summary, notes } = body;

    const updateRes = await query(`
      UPDATE founder_os_proposals
      SET 
        client_name = COALESCE($1, client_name),
        project_title = COALESCE($2, project_title),
        proposal_value = COALESCE($3, proposal_value),
        status = COALESCE($4, status),
        sent_date = $5,
        followup_date = $6,
        scope_summary = $7,
        notes = $8,
        updated_at = NOW()
      WHERE id = $9
      RETURNING *
    `, [
      client_name ? client_name.trim() : null,
      project_title ? project_title.trim() : null,
      proposal_value !== undefined ? parseFloat(proposal_value) : null,
      status,
      sent_date || null,
      followup_date || null,
      scope_summary,
      notes,
      id
    ]);

    if (updateRes.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Proposal not found' }, { status: 404 });
    }

    const proposal = updateRes.rows[0];
    await logActivity(auth.username, 'Proposal', id, 'Updated', `Updated proposal: ${proposal.project_title} (Status: ${proposal.status})`);

    return NextResponse.json({ success: true, proposal });
  } catch (err) {
    console.error('Proposal PUT error:', err);
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

    const pRes = await query('SELECT project_title FROM founder_os_proposals WHERE id = $1', [id]);
    const title = pRes.rows[0]?.project_title || id;

    await query('DELETE FROM founder_os_proposals WHERE id = $1', [id]);
    await logActivity(auth.username, 'Proposal', id, 'Deleted', `Deleted proposal: ${title}`);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Proposal DELETE error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
