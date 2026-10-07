import { createHash, randomUUID } from 'node:crypto';

export function imageStorageStatus() {
  const values = [process.env.CLOUDINARY_CLOUD_NAME, process.env.CLOUDINARY_API_KEY, process.env.CLOUDINARY_API_SECRET];
  return { configured: values.every(Boolean), incomplete: values.some(Boolean) && !values.every(Boolean) };
}

export async function storeContentImage(bytes, kind) {
  const status = imageStorageStatus();
  if (status.incomplete) throw new Error('Image storage configuration is incomplete.');
  if (!status.configured) return { imageUrl: `data:image/webp;base64,${bytes.toString('base64')}`, storage: 'database' };

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  if (!/^[a-z0-9_-]+$/i.test(cloudName)) throw new Error('Image storage configuration is invalid.');
  const parameters = { folder: `infronixweb/${kind}`, overwrite: 'false', public_id: `${kind}-${randomUUID()}`, timestamp: String(Math.floor(Date.now() / 1000)) };
  const signed = Object.keys(parameters).sort().map(key => `${key}=${parameters[key]}`).join('&');
  const signature = createHash('sha256').update(signed + process.env.CLOUDINARY_API_SECRET).digest('hex');
  const form = new FormData();
  for (const [key, value] of Object.entries(parameters)) form.set(key, value);
  form.set('api_key', process.env.CLOUDINARY_API_KEY);
  form.set('signature', signature);
  form.set('file', new Blob([bytes], { type: 'image/webp' }), `${parameters.public_id}.webp`);
  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: 'POST', body: form, signal: AbortSignal.timeout(25000),
  });
  if (!response.ok) throw new Error('Image storage upload failed.');
  const result = await response.json();
  const url = new URL(result.secure_url);
  if (url.protocol !== 'https:' || url.hostname !== 'res.cloudinary.com' || !url.pathname.startsWith(`/${cloudName}/`)) {
    throw new Error('Image storage returned an invalid URL.');
  }
  return { imageUrl: url.href, storage: 'cloudinary' };
}
