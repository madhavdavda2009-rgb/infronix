import sharp from 'sharp';
import { randomUUID } from 'node:crypto';
import { NextResponse } from 'next/server';
import { verifyAdminAuth } from './auth.js';

export async function uploadContentImage(request, kind, maxWidth) {
  if (!verifyAdminAuth(request)) {
    return NextResponse.json({ success: false, error: 'Unauthorized. Please login again.' }, { status: 401 });
  }
  try {
    const form = await request.formData();
    const file = form.get('image') || form.get('file');
    if (!file || typeof file === 'string' || !file.size) {
      return NextResponse.json({ success: false, error: 'Please select an image.' }, { status: 400 });
    }
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ success: false, error: 'Image must be under 10 MB.' }, { status: 400 });
    }
    const bytes = await sharp(Buffer.from(await file.arrayBuffer()), { limitInputPixels: 40000000 })
      .rotate().resize({ width: maxWidth, height: maxWidth, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 82 }).toBuffer();
    // Saving the profile/article persists the optimized image in its existing DB field.
    // No deployment-local filesystem path that disappears after a restart.
    return NextResponse.json({ success: true, imageUrl: `data:image/webp;base64,${bytes.toString('base64')}`,
      filename: `${kind}-${randomUUID()}.webp` });
  } catch {
    return NextResponse.json({ success: false, error: 'Unable to read this image. Try JPG, PNG, WebP or AVIF.' }, { status: 400 });
  }
}
