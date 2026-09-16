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
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    const source = searchParams.get('source') || '';
    const sortBy = searchParams.get('sortBy') || 'created_at';
    const sortOrder = searchParams.get('sortOrder') === 'asc' ? 'ASC' : 'DESC';

    let sql = 'SELECT * FROM founder_os_leads WHERE 1=1';
    const params = [];

    if (search) {
      params.push(`%${search.toLowerCase()}%`);
      const pIndex = params.length;
      sql += ` AND (LOWER(name) LIKE $${pIndex} OR LOWER(company) LIKE $${pIndex} OR LOWER(email) LIKE $${pIndex} OR LOWER(lead_id) LIKE $${pIndex} OR LOWER(phone) LIKE $${pIndex})`;
    }

    if (status && status !== 'ALL') {
      params.push(status);
      sql += ` AND status = $${params.length}`;
    }

    if (source && source !== 'ALL') {
      params.push(source);
      sql += ` AND source = $${params.length}`;
    }

    const validSortCols = ['created_at', 'name', 'estimated_value', 'next_followup', 'status'];
    const orderCol = validSortCols.includes(sortBy) ? sortBy : 'created_at';
    sql += ` ORDER BY ${orderCol} ${sortOrder}`;

    const res = await query(sql, params);
    return NextResponse.json({ success: true, leads: res.rows });
  } catch (err) {
    console.error('Leads GET error:', err);
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
    const { name, company, phone, email, source, industry, status, estimated_value, notes, next_followup } = body;

    if (!name || name.trim() === '') {
      return NextResponse.json({ success: false, error: 'Lead name is required' }, { status: 400 });
    }

    // Generate unique Lead ID (e.g., LD-1001)
    const countRes = await query('SELECT COUNT(*) as count FROM founder_os_leads');
    const nextNum = parseInt(countRes.rows[0].count, 10) + 1001;
    const leadId = `LD-${nextNum}`;

    const insertRes = await query(`
      INSERT INTO founder_os_leads 
        (lead_id, name, company, phone, email, source, industry, status, estimated_value, notes, next_followup, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW(), NOW())
      RETURNING *
    `, [
      leadId,
      name.trim(),
      company ? company.trim() : null,
      phone ? phone.trim() : null,
      email ? email.trim() : null,
      source || 'Website',
      industry ? industry.trim() : null,
      status || 'New',
      parseFloat(estimated_value || 0),
      notes || null,
      next_followup || null
    ]);

    const newLead = insertRes.rows[0];
    await logActivity(auth.username, 'Lead', newLead.id, 'Created', `Added new lead: ${newLead.name} (${newLead.lead_id})`);

    return NextResponse.json({ success: true, lead: newLead });
  } catch (err) {
    console.error('Leads POST error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
