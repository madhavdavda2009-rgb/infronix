import sharp from 'sharp';
import { randomUUID } from 'node:crypto';
import { NextResponse } from 'next/server';
import { verifyAdminAuth } from './auth.js';
import { storeContentImage } from './cloudinary-upload.js';

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
    // The CMS saves one image URL. Every cloud upload has a new ID, so replacing
    // a photo never overwrites another profile or returns an old cached image.
    let stored;
    try { stored = await storeContentImage(bytes, kind); }
    catch { return NextResponse.json({ success: false, error: 'Image storage is unavailable. Check the Cloudinary settings or try again.' }, { status: 502 }); }
    return NextResponse.json({ success: true, ...stored,
      filename: `${kind}-${randomUUID()}.webp` });
  } catch {
    return NextResponse.json({ success: false, error: 'Unable to read this image. Try JPG, PNG, WebP or AVIF.' }, { status: 400 });
  }
}
