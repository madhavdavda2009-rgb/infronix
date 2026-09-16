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
    const leadId = searchParams.get('leadId');
    const callType = searchParams.get('callType');

    let sql = 'SELECT * FROM founder_os_calls WHERE 1=1';
    const params = [];

    if (leadId) {
      params.push(leadId);
      sql += ` AND lead_id = $${params.length}`;
    }
    if (callType && callType !== 'ALL') {
      params.push(callType);
      sql += ` AND call_type = $${params.length}`;
    }

    sql += ' ORDER BY call_date DESC';
    const res = await query(sql, params);
    return NextResponse.json({ success: true, calls: res.rows });
  } catch (err) {
    console.error('Calls GET error:', err);
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
    const { lead_id, lead_name, call_date, call_type, outcome, notes, next_action, next_action_date } = body;

    if (!lead_name || lead_name.trim() === '') {
      return NextResponse.json({ success: false, error: 'Lead name is required for logging call' }, { status: 400 });
    }

    const insertRes = await query(`
      INSERT INTO founder_os_calls 
        (lead_id, lead_name, call_date, call_type, outcome, notes, next_action, next_action_date, created_at)
      VALUES ($1, $2, COALESCE($3, NOW()), $4, $5, $6, $7, $8, NOW())
      RETURNING *
    `, [
      lead_id || null,
      lead_name.trim(),
      call_date || null,
      call_type || 'Discovery',
      outcome || 'Connected',
      notes || null,
      next_action || null,
      next_action_date || null
    ]);

    const call = insertRes.rows[0];
    await logActivity(auth.username, 'Call', call.id, 'Logged', `Logged ${call.call_type} call with ${call.lead_name} (${call.outcome})`);

    // If next_action_date was provided, also optionally update lead next_followup
    if (lead_id && next_action_date) {
      await query('UPDATE founder_os_leads SET next_followup = $1, updated_at = NOW() WHERE id = $2', [next_action_date, lead_id]);
    }

    return NextResponse.json({ success: true, call });
  } catch (err) {
    console.error('Calls POST error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
