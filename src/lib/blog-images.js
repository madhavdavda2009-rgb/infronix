import { createHash } from 'node:crypto';
export function publicImageUrl(value, kind, id) {
  if (!value?.startsWith('data:image/') || !/^\d+$/.test(String(id))) return value;
  const version = createHash('sha256').update(value).digest('hex').slice(0, 20);
  return `/api/public/media?type=${kind}&id=${id}&v=${version}`;
}
export function normalizeBlogImages(post) {
  return { ...post,
    cover_image_url: publicImageUrl(post.cover_image_url, 'blog-cover', post.id),
    og_image_url: publicImageUrl(post.og_image_url, 'blog-og', post.id),
    author_avatar_url: publicImageUrl(post.author_avatar_url, 'blog-avatar', post.id),
    author_avatar_position: 'center 25%',
  };
}
