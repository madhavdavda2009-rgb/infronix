import { NextResponse } from 'next/server';
import { verifyAdminAuth } from '@/lib/auth';
import crypto from 'node:crypto';

export async function POST(request) {
  const auth = verifyAdminAuth(request);
  if (!auth) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { blogId } = await request.json();
    if (!blogId) {
      return NextResponse.json({ success: false, error: 'Blog ID is required' }, { status: 400 });
    }

    const secret = process.env.ADMIN_JWT_SECRET || 'infronix_blog_preview_secret_salt_2026';
    const expiresAt = Date.now() + 1000 * 60 * 60 * 2; // 2 hours validity

    const payload = `${blogId}:${expiresAt}`;
    const hmac = crypto.createHmac('sha256', secret).update(payload).digest('hex');
    const token = Buffer.from(JSON.stringify({ blogId, expiresAt, hmac })).toString('base64url');

    return NextResponse.json({
      success: true,
      token,
      previewUrl: `/blog/preview/${blogId}?token=${token}`
    });
  } catch (err) {
    console.error('Preview token error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
