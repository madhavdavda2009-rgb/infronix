import { NextResponse } from 'next/server';
import { query, initFounderOSDb } from '@/lib/founder_os_db';
import { verifyAdminAuth } from '@/lib/auth';
import { logActivity } from '@/lib/audit_logger';

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

    const { author, feedback_text, feedback_date, status, action_plan } = body;
    if (!author || !feedback_text) {
      return NextResponse.json({ success: false, error: 'Author and feedback text are required' }, { status: 400 });
    }

    const insertRes = await query(`
      INSERT INTO founder_os_feedback
        (project_id, author, feedback_text, feedback_date, status, action_plan, created_at)
      VALUES ($1, $2, $3, COALESCE($4, CURRENT_DATE), $5, $6, NOW())
      RETURNING *
    `, [
      project_id,
      author.trim(),
      feedback_text.trim(),
      feedback_date || null,
      status || 'Open',
      action_plan || null
    ]);

    const feedback = insertRes.rows[0];
    await logActivity(auth.username, 'Feedback', feedback.id, 'Created', `Recorded feedback from ${feedback.author} for project #${project_id}`);

    return NextResponse.json({ success: true, feedback });
  } catch (err) {
    console.error('Feedback POST error:', err);
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
    const { searchParams } = new URL(request.url);
    const feedbackId = searchParams.get('feedbackId');

    if (!feedbackId) {
      return NextResponse.json({ success: false, error: 'Feedback ID is required' }, { status: 400 });
    }

    await query('DELETE FROM founder_os_feedback WHERE id = $1', [feedbackId]);
    await logActivity(auth.username, 'Feedback', feedbackId, 'Deleted', `Deleted feedback item #${feedbackId}`);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Feedback DELETE error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
