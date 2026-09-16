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
    const { id: project_id } = resolvedParams;
    const body = await request.json();

    const { qaId, is_checked, notes } = body;
    if (!qaId) {
      return NextResponse.json({ success: false, error: 'QA Item ID is required' }, { status: 400 });
    }

    const updateRes = await query(`
      UPDATE founder_os_qa_checklist
      SET 
        is_checked = COALESCE($1, is_checked),
        notes = $2,
        updated_at = NOW()
      WHERE id = $3 AND project_id = $4
      RETURNING *
    `, [
      is_checked !== undefined ? is_checked : null,
      notes,
      qaId,
      project_id
    ]);

    if (updateRes.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'QA Item not found' }, { status: 404 });
    }

    const item = updateRes.rows[0];
    await logActivity(auth.username, 'QA Checklist', item.id, 'Updated', `${item.is_checked ? 'Checked' : 'Unchecked'} QA item "${item.item_label}" for project #${project_id}`);

    return NextResponse.json({ success: true, item });
  } catch (err) {
    console.error('QA PUT error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request, { params }) {
  const auth = verifyAdminAuth(request);
  if (!auth) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await initFounderOSDb();
    const resolvedParams = await params;
    const { id: project_id } = resolvedParams;
    const body = await request.json();

    const { item_label, notes } = body;
    if (!item_label || item_label.trim() === '') {
      return NextResponse.json({ success: false, error: 'Checklist label is required' }, { status: 400 });
    }

    const item_key = 'custom_' + Date.now();
    const insertRes = await query(`
      INSERT INTO founder_os_qa_checklist
        (project_id, item_key, item_label, is_checked, notes, updated_at)
      VALUES ($1, $2, $3, false, $4, NOW())
      RETURNING *
    `, [
      project_id,
      item_key,
      item_label.trim(),
      notes || null
    ]);

    const item = insertRes.rows[0];
    await logActivity(auth.username, 'QA Checklist', item.id, 'Created', `Added custom QA checklist item "${item.item_label}" to project #${project_id}`);

    return NextResponse.json({ success: true, item });
  } catch (err) {
    console.error('QA POST error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
