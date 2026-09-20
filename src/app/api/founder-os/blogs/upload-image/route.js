import { NextResponse } from 'next/server';
import { verifyAdminAuth } from '@/lib/auth';
import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';

const ALLOWED_MIME_TYPES = new Map([
  ['image/jpeg', 'jpg'],
  ['image/jpg', 'jpg'],
  ['image/pjpeg', 'jpg'],
  ['image/jfif', 'jpg'],
  ['image/png', 'png'],
  ['image/x-png', 'png'],
  ['image/webp', 'webp'],
  ['image/avif', 'avif'],
  ['image/gif', 'gif'],
  ['image/svg+xml', 'svg'],
  ['image/bmp', 'bmp'],
  ['image/x-ms-bmp', 'bmp'],
  ['image/tiff', 'tiff'],
  ['image/x-icon', 'ico'],
  ['image/vnd.microsoft.icon', 'ico']
]);

const ALLOWED_EXTENSIONS = new Set(['jpg', 'jpeg', 'png', 'webp', 'avif', 'gif', 'svg', 'bmp', 'tiff', 'ico']);
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

export async function POST(request) {
  const auth = verifyAdminAuth(request);
  if (!auth) {
    return NextResponse.json({ success: false, error: 'Unauthorized. Please login again.' }, { status: 401 });
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
        { success: false, error: 'Image size exceeds the 10 MB maximum limit.' },
        { status: 400 }
      );
    }

    // Determine extension from MIME type or file name
    const mimeType = (file.type || '').toLowerCase().trim();
    let ext = ALLOWED_MIME_TYPES.get(mimeType);

    if (!ext && file.name) {
      const parts = file.name.split('.');
      const fileExt = parts.length > 1 ? parts.pop().toLowerCase().trim() : '';
      if (ALLOWED_EXTENSIONS.has(fileExt)) {
        ext = fileExt === 'jpeg' ? 'jpg' : fileExt;
      }
    }

    if (!ext) {
      return NextResponse.json(
        { success: false, error: 'Unsupported image format. Allowed formats: JPG, PNG, WebP, AVIF, GIF, SVG.' },
        { status: 400 }
      );
    }

    const randomSuffix = crypto.randomBytes(8).toString('hex');
    const filename = `blog_${Date.now()}_${randomSuffix}.${ext}`;
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let publicUrl = `/uploads/blog/${filename}`;

    try {
      const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'blog');
      await fs.mkdir(uploadDir, { recursive: true });
      const filePath = path.join(uploadDir, filename);
      await fs.writeFile(filePath, buffer);
    } catch (fsError) {
      console.warn('Filesystem write warning, falling back to data URL:', fsError?.message);
      const effectiveMime = mimeType && mimeType !== 'application/octet-stream' ? mimeType : `image/${ext}`;
      publicUrl = `data:${effectiveMime};base64,${buffer.toString('base64')}`;
    }

    return NextResponse.json({
      success: true,
      imageUrl: publicUrl,
      filename
    });
  } catch (err) {
    console.error('Blog image upload error:', err);
    return NextResponse.json(
      { success: false, error: err?.message || 'Failed to upload and store blog image.' },
      { status: 500 }
    );
  }
}
