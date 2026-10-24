import { NextResponse } from 'next/server';
import { query } from '@/lib/founder_os_db';
import { verifyAdminAuth } from '@/lib/auth';
import { logActivity } from '@/lib/audit_logger';
import { initWebsiteTrustDb, sanitizeReview } from '@/lib/website_trust';

export async function PUT(request, { params }) {
  const auth = verifyAdminAuth(request);
  if (!auth) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await initWebsiteTrustDb();
    const { id } = await params;
    const r = sanitizeReview(await request.json());
    if (!r.reviewer_name || r.review_text.length < 5) {
      return NextResponse.json({ success: false, error: 'Reviewer name and review text are required' }, { status: 400 });
    }
    const res = await query(`
      UPDATE founder_os_reviews
      SET reviewer_name = $1, reviewer_role = $2, business_name = $3, rating = $4, review_text = $5, source = $6,
          source_url = $7, review_date = $8, is_published = $9, is_featured = $10, display_order = $11, updated_at = NOW()
      WHERE id = $12
      RETURNING *
    `, [r.reviewer_name, r.reviewer_role, r.business_name, r.rating, r.review_text, r.source, r.source_url, r.review_date, r.is_published, r.is_featured, r.display_order, parseInt(id, 10)]);
    if (!res.rows.length) {
      return NextResponse.json({ success: false, error: 'Review not found' }, { status: 404 });
    }
    await logActivity(auth.username, 'Review', res.rows[0].id, 'Updated', `Updated review from ${r.reviewer_name}`);
    return NextResponse.json({ success: true, review: res.rows[0] });
  } catch (err) {
    console.error('Review PUT error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const auth = verifyAdminAuth(request);
  if (!auth) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await initWebsiteTrustDb();
    const { id } = await params;
    const res = await query('DELETE FROM founder_os_reviews WHERE id = $1 RETURNING reviewer_name', [parseInt(id, 10)]);
    if (!res.rows.length) {
      return NextResponse.json({ success: false, error: 'Review not found' }, { status: 404 });
    }
    await logActivity(auth.username, 'Review', parseInt(id, 10), 'Deleted', `Deleted review from ${res.rows[0].reviewer_name}`);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Review DELETE error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
