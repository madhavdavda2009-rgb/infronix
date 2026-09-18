import { NextResponse } from 'next/server';
import { verifyAdminAuth } from '@/lib/auth';
import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';

const ALLOWED_MIME_TYPES = new Map([
  ['image/jpeg', 'jpg'],
  ['image/png', 'png'],
  ['image/webp', 'webp'],
  ['image/avif', 'avif']
]);

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

export async function POST(request) {
  const auth = verifyAdminAuth(request);
  if (!auth) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('image') || formData.get('file');

    if (!file || typeof file === 'string') {
      return NextResponse.json({ success: false, error: 'No image file uploaded.' }, { status: 400 });
    }

    // Size validation
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, error: 'Image size exceeds maximum allowed limit (5 MB).' },
        { status: 400 }
      );
    }

    // MIME type validation
    const mimeType = file.type?.toLowerCase();
    if (!ALLOWED_MIME_TYPES.has(mimeType)) {
      return NextResponse.json(
        { success: false, error: 'Unsupported image format. Allowed formats: JPEG, PNG, WebP, AVIF.' },
        { status: 400 }
      );
    }

    const ext = ALLOWED_MIME_TYPES.get(mimeType);
    const randomSuffix = crypto.randomBytes(8).toString('hex');
    const filename = `blog_${Date.now()}_${randomSuffix}.${ext}`;

    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'blog');
    await fs.mkdir(uploadDir, { recursive: true });

    const filePath = path.join(uploadDir, filename);
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    await fs.writeFile(filePath, buffer);

    const publicUrl = `/uploads/blog/${filename}`;

    return NextResponse.json({
      success: true,
      imageUrl: publicUrl,
      filename
    });
  } catch (err) {
    console.error('Blog image upload error:', err);
    return NextResponse.json(
      { success: false, error: 'Failed to upload and store blog image.' },
      { status: 500 }
    );
  }
}
