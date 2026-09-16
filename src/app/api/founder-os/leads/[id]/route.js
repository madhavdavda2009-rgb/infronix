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

    const leadRes = await query('SELECT * FROM founder_os_leads WHERE id = $1', [id]);
    if (leadRes.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Lead not found' }, { status: 404 });
    }

    const lead = leadRes.rows[0];

    // Fetch related calls
    const callsRes = await query('SELECT * FROM founder_os_calls WHERE lead_id = $1 ORDER BY call_date DESC', [id]);
    // Fetch related proposals
    const proposalsRes = await query('SELECT * FROM founder_os_proposals WHERE lead_id = $1 ORDER BY created_at DESC', [id]);

    return NextResponse.json({
      success: true,
      lead,
      calls: callsRes.rows,
      proposals: proposalsRes.rows
    });
  } catch (err) {
    console.error('Lead GET by ID error:', err);
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

    const { name, company, phone, email, source, industry, status, estimated_value, notes, next_followup } = body;

    const updateRes = await query(`
      UPDATE founder_os_leads
      SET 
        name = COALESCE($1, name),
        company = $2,
        phone = $3,
        email = $4,
        source = COALESCE($5, source),
        industry = $6,
        status = COALESCE($7, status),
        estimated_value = COALESCE($8, estimated_value),
        notes = $9,
        next_followup = $10,
        updated_at = NOW()
      WHERE id = $11
      RETURNING *
    `, [
      name ? name.trim() : null,
      company ? company.trim() : null,
      phone ? phone.trim() : null,
      email ? email.trim() : null,
      source,
      industry ? industry.trim() : null,
      status,
      estimated_value !== undefined ? parseFloat(estimated_value) : null,
      notes,
      next_followup || null,
      id
    ]);

    if (updateRes.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Lead not found' }, { status: 404 });
    }

    const updatedLead = updateRes.rows[0];
    await logActivity(auth.username, 'Lead', id, 'Updated', `Updated lead: ${updatedLead.name} (Status: ${updatedLead.status})`);

    return NextResponse.json({ success: true, lead: updatedLead });
  } catch (err) {
    console.error('Lead PUT error:', err);
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

    const leadRes = await query('SELECT name, lead_id FROM founder_os_leads WHERE id = $1', [id]);
    if (leadRes.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Lead not found' }, { status: 404 });
    }
    const leadName = leadRes.rows[0].name;

    await query('DELETE FROM founder_os_leads WHERE id = $1', [id]);
    await logActivity(auth.username, 'Lead', id, 'Deleted', `Deleted lead: ${leadName}`);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Lead DELETE error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
