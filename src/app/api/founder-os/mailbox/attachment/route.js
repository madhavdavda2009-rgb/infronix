import { NextResponse } from 'next/server';
import { verifyAdminAuth } from '@/lib/auth';
import { getAttachment, mailboxErrorMessage, mailboxErrorStatus } from '@/lib/mailbox';

// Types the browser may show inline; everything else is forced to download so
// an attachment can never run as a page on this origin.
const INLINE_TYPES = /^(image\/(png|jpe?g|gif|webp|bmp)|application\/pdf|text\/plain)$/i;

export async function GET(request) {
  const auth = verifyAdminAuth(request);
  if (!auth) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const folder = searchParams.get('folder');
    const uid = parseInt(searchParams.get('uid'), 10);
    const id = searchParams.get('id');
    if (!folder || !uid || !id) {
      return NextResponse.json({ success: false, error: 'folder, uid and id are required' }, { status: 422 });
    }

    const file = await getAttachment(folder, uid, id);
    const inline = searchParams.get('download') !== '1' && INLINE_TYPES.test(file.contentType);
    const asciiName = file.filename.replace(/[^\x20-\x7e]|["\\]/g, '_');

    return new Response(file.buffer, {
      headers: {
        'Content-Type': inline ? file.contentType : 'application/octet-stream',
        'Content-Disposition': `${inline ? 'inline' : 'attachment'}; filename="${asciiName}"; filename*=UTF-8''${encodeURIComponent(file.filename)}`,
        'Content-Length': String(file.buffer.length),
        'X-Content-Type-Options': 'nosniff',
        // Chrome's PDF viewer refuses to render under a CSP sandbox, so PDFs skip it.
        'Content-Security-Policy': `default-src 'none'; img-src 'self'; style-src 'unsafe-inline'${file.contentType === 'application/pdf' ? '' : '; sandbox'}`,
        'Cache-Control': 'private, max-age=3600',
      },
    });
  } catch (err) {
    console.error('Mailbox attachment error:', err);
    return NextResponse.json({ success: false, error: mailboxErrorMessage(err) }, { status: mailboxErrorStatus(err) });
  }
}
