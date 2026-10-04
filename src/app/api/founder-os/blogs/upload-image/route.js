import { uploadContentImage } from '@/lib/image-upload';

export const runtime = 'nodejs';
export async function POST(request) {
  return uploadContentImage(request, 'blog', 1600);
}
