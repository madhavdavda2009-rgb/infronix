import { query } from '@/lib/founder_os_db';
import { initClientDocumentsDb } from '@/lib/client_documents';
import { isSignatureImage } from '@/lib/document_templates';

// Serves the InfronixWeb signature stored on an issued document so emailed copies can
// show it (most mail clients block inline data: images). Client signatures are never served.
export async function GET(request, { params }) {
  try {
    await initClientDocumentsDb();
    const { id } = await params;
    const res = await query(
      "SELECT data->>'agency_signature' AS sig FROM founder_os_client_documents WHERE id = $1 AND status != 'Draft'",
      [parseInt(id, 10) || 0]
    );
    const sig = res.rows[0]?.sig;
    if (!isSignatureImage(sig)) return new Response('Not found', { status: 404 });

    const [, mime, b64] = sig.match(/^data:(image\/(?:png|jpeg));base64,(.+)$/);
    return new Response(Buffer.from(b64, 'base64'), {
      headers: { 'Content-Type': mime, 'Cache-Control': 'public, max-age=86400' }
    });
  } catch {
    return new Response('Not found', { status: 404 });
  }
}
