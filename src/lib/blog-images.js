import { createHash } from 'node:crypto';
import imageAssets from './blog-image-assets.json' with { type: 'json' };
import { madhavBlogProfile } from './blog-authors.js';

// Replace only audited inline images. Future CMS uploads retain their own URLs.
export function blogImageUrl(value) {
  if (!value?.startsWith('data:image/')) return value;
  const hash = createHash('sha256').update(value).digest('hex');
  return imageAssets[hash]?.url || value;
}
export function publicImageUrl(value, kind, id) {
  const optimized = blogImageUrl(value);
  if (!optimized?.startsWith('data:image/') || !/^\d+$/.test(String(id))) return optimized;
  const version = createHash('sha256').update(value).digest('hex').slice(0, 20);
  return `/api/public/media?type=${kind}&id=${id}&v=${version}`;
}
export function normalizeBlogImages(post) {
  const useProfile = !post.author_avatar_url && post.author_name?.trim().toLowerCase() === 'madhav davda';
  return { ...post,
    ...(useProfile ? madhavBlogProfile : {}),
    cover_image_url: publicImageUrl(post.cover_image_url, 'blog-cover', post.id),
    og_image_url: publicImageUrl(post.og_image_url, 'blog-og', post.id),
    author_avatar_url: publicImageUrl(post.author_avatar_url, 'blog-avatar', post.id) || (useProfile ? madhavBlogProfile.author_avatar_url : null),
  };
}
