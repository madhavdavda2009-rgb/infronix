import { NextResponse } from 'next/server';
import { query } from '@/lib/founder_os_db';
import { verifyAdminAuth } from '@/lib/auth';
import { logActivity } from '@/lib/audit_logger';
import { initWebsiteTrustDb, sanitizeReview } from '@/lib/website_trust';

export async function GET(request) {
  const auth = verifyAdminAuth(request);
  if (!auth) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await initWebsiteTrustDb();
    const res = await query('SELECT * FROM founder_os_reviews ORDER BY is_featured DESC, display_order ASC, review_date DESC NULLS LAST, id DESC');
    return NextResponse.json({ success: true, reviews: res.rows });
  } catch (err) {
    console.error('Reviews GET error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  const auth = verifyAdminAuth(request);
  if (!auth) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await initWebsiteTrustDb();
    const r = sanitizeReview(await request.json());
    if (!r.reviewer_name || r.review_text.length < 5) {
      return NextResponse.json({ success: false, error: 'Reviewer name and review text are required' }, { status: 400 });
    }
    const res = await query(`
      INSERT INTO founder_os_reviews
        (reviewer_name, reviewer_role, business_name, rating, review_text, source, source_url, review_date, is_published, is_featured, display_order)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
    `, [r.reviewer_name, r.reviewer_role, r.business_name, r.rating, r.review_text, r.source, r.source_url, r.review_date, r.is_published, r.is_featured, r.display_order]);
    await logActivity(auth.username, 'Review', res.rows[0].id, 'Created', `Added ${r.rating}★ review from ${r.reviewer_name} (${r.source})`);
    return NextResponse.json({ success: true, review: res.rows[0] });
  } catch (err) {
    console.error('Reviews POST error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
