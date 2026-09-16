import { NextResponse } from 'next/server';
import { query, initFounderOSDb } from '@/lib/founder_os_db';
import { verifyAdminAuth } from '@/lib/auth';

export async function GET(request, { params }) {
  const auth = verifyAdminAuth(request);
  if (!auth) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await initFounderOSDb();
    const resolvedParams = await params;
    const { id } = resolvedParams;
    const res = await query('SELECT t.*, p.name AS person_name FROM founder_os_project_team t JOIN founder_os_people p ON p.id = t.person_id WHERE t.project_id = $1 ORDER BY t.id ASC', [id]);
    return NextResponse.json({ success: true, team: res.rows });
  } catch (err) {
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
    const { id } = resolvedParams;
    const body = await request.json();
    const { person_id, role } = body;
    const person = await query("SELECT name FROM founder_os_people WHERE id = $1 AND status = 'Active'", [person_id]);
    const person_name = person.rows[0]?.name;
    const duplicate = await query('SELECT id FROM founder_os_project_team WHERE project_id = $1 AND person_id = $2', [id, person_id]);
    if (duplicate.rows.length) return NextResponse.json({ success: false, error: 'This person is already assigned' }, { status: 409 });

    if (!person_name) {
      return NextResponse.json({ success: false, error: 'Person name is required' }, { status: 400 });
    }

    const res = await query(`
      INSERT INTO founder_os_project_team (project_id, person_id, person_name, role, created_at)
      VALUES ($1, $2, $3, $4, NOW())
      RETURNING *
    `, [id, person_id ? parseInt(person_id, 10) : null, person_name.trim(), role || 'Member']);

    return NextResponse.json({ success: true, teamMember: res.rows[0] });
  } catch (err) {
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
    const { searchParams } = new URL(request.url);
    const teamMemberId = searchParams.get('teamMemberId');

    if (!teamMemberId) {
      return NextResponse.json({ success: false, error: 'Team member ID is required' }, { status: 400 });
    }

    await query('DELETE FROM founder_os_project_team WHERE id = $1 AND project_id = $2', [teamMemberId, id]);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
