import dotenv from 'dotenv';
import fs from 'node:fs';
import { createHash } from 'node:crypto';
import sharp from 'sharp';
import { query, getPool } from '../src/lib/founder_os_db.js';
dotenv.config({ quiet: true });
const { rows } = await query('SELECT cover_image_url, og_image_url, author_avatar_url FROM founder_os_blogs WHERE status = $1', ['Published']);
const images = new Map();
for (const post of rows) for (const key of ['cover_image_url','og_image_url','author_avatar_url']) {
  const value = post[key];
  if (value?.startsWith('data:image/')) images.set(value, Math.max(images.get(value) || 0, key === 'author_avatar_url' ? 160 : 1600));
}
const team = await query("SELECT profile_image_url FROM founder_os_people WHERE (LOWER(status) = 'active' OR status IS NULL) AND show_on_website = TRUE AND is_archived IS NOT TRUE");
for (const person of team.rows) if (person.profile_image_url?.startsWith('data:image/')) images.set(person.profile_image_url, Math.max(images.get(person.profile_image_url) || 0, 800));
const assets = {};
fs.mkdirSync('public/blog-images', {recursive:true});
for (const [value, width] of images) {
  const hash = createHash('sha256').update(value).digest('hex');
  const bytes = Buffer.from(value.split(',')[1], 'base64');
  const optimized = await sharp(bytes).rotate().resize({width, withoutEnlargement:true}).webp({quality:85}).toBuffer({resolveWithObject:true});
  const originalInfo = await sharp(bytes).metadata();
  const {data, info} = optimized.data.length >= bytes.length && originalInfo.format === 'webp' ? {data:bytes, info:originalInfo} : optimized;
  const url = `/blog-images/${hash.slice(0,20)}.webp`;
  fs.writeFileSync('public' + url, data);
  assets[hash] = {url, width:info.width, height:info.height, originalBytes:bytes.length, outputBytes:data.length};
}
fs.writeFileSync('src/lib/blog-image-assets.json', JSON.stringify(assets, null, 2));
console.log(JSON.stringify({images:images.size, originalBytes:Object.values(assets).reduce((n,a)=>n+a.originalBytes,0), outputBytes:Object.values(assets).reduce((n,a)=>n+a.outputBytes,0)}));
await getPool().end();
