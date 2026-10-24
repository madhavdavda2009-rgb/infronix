import { createHash, randomUUID } from 'node:crypto';

export function imageStorageStatus() {
  const values = [process.env.CLOUDINARY_CLOUD_NAME, process.env.CLOUDINARY_API_KEY, process.env.CLOUDINARY_API_SECRET];
  return { configured: values.every(Boolean), incomplete: values.some(Boolean) && !values.every(Boolean) };
}

// publicId makes uploads idempotent: re-uploading the same id returns the existing image.
export async function storeContentImage(bytes, kind, { mime = 'image/webp', ext = 'webp', publicId } = {}) {
  const status = imageStorageStatus();
  if (status.incomplete) throw new Error('Image storage configuration is incomplete.');
  if (!status.configured) return { imageUrl: `data:${mime};base64,${bytes.toString('base64')}`, storage: 'database' };

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  if (!/^[a-z0-9_-]+$/i.test(cloudName)) throw new Error('Image storage configuration is invalid.');
  const parameters = { folder: `infronixweb/${kind}`, overwrite: 'false', public_id: publicId || `${kind}-${randomUUID()}`, timestamp: String(Math.floor(Date.now() / 1000)) };
  const signed = Object.keys(parameters).sort().map(key => `${key}=${parameters[key]}`).join('&');
  const signature = createHash('sha256').update(signed + process.env.CLOUDINARY_API_SECRET).digest('hex');
  const form = new FormData();
  for (const [key, value] of Object.entries(parameters)) form.set(key, value);
  form.set('api_key', process.env.CLOUDINARY_API_KEY);
  form.set('signature', signature);
  form.set('file', new Blob([bytes], { type: mime }), `${parameters.public_id}.${ext}`);
  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: 'POST', body: form, signal: AbortSignal.timeout(25000),
  });
  if (!response.ok) {
    const details = await response.json().catch(() => ({}));
    const message = details.error?.message || '';
    // Never include provider messages, credentials or signatures in logs/errors.
    const reason = /signature/i.test(message) ? 'signature rejected' : /api.?key/i.test(message) ? 'API key rejected' :
      /cloud.?name/i.test(message) ? 'cloud name rejected' : response.status === 401 ? 'credentials rejected' : 'provider rejected upload';
    throw new Error(`Cloudinary upload failed (${response.status}; ${reason}).`);
  }
  const result = await response.json();
  const url = new URL(result.secure_url);
  if (url.protocol !== 'https:' || url.hostname !== 'res.cloudinary.com' || !url.pathname.startsWith(`/${cloudName}/`)) {
    throw new Error('Image storage returned an invalid URL.');
  }
  return { imageUrl: url.href, storage: 'cloudinary' };
}
