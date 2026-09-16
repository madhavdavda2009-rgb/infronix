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
    const status = searchParams.get('status');

    let sql = 'SELECT * FROM founder_os_proposals WHERE 1=1';
    const params = [];

    if (status && status !== 'ALL') {
      params.push(status);
      sql += ` AND status = $${params.length}`;
    }

    sql += ' ORDER BY created_at DESC';
    const res = await query(sql, params);
    return NextResponse.json({ success: true, proposals: res.rows });
  } catch (err) {
    console.error('Proposals GET error:', err);
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
    const { client_name, lead_id, project_title, proposal_value, status, sent_date, followup_date, scope_summary, notes } = body;

    if (!client_name || !project_title) {
      return NextResponse.json({ success: false, error: 'Client name and Project title are required' }, { status: 400 });
    }

    const insertRes = await query(`
      INSERT INTO founder_os_proposals 
        (client_name, lead_id, project_title, proposal_value, status, sent_date, followup_date, scope_summary, notes, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW())
      RETURNING *
    `, [
      client_name.trim(),
      lead_id || null,
      project_title.trim(),
      parseFloat(proposal_value || 0),
      status || 'Draft',
      sent_date || null,
      followup_date || null,
      scope_summary || null,
      notes || null
    ]);

    const proposal = insertRes.rows[0];
    await logActivity(auth.username, 'Proposal', proposal.id, 'Created', `Created proposal: ${proposal.project_title} for ${proposal.client_name} (₹${proposal.proposal_value})`);

    return NextResponse.json({ success: true, proposal });
  } catch (err) {
    console.error('Proposals POST error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
