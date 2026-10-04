export function blogRevision(post) {
  if (!post) return null;
  return JSON.stringify([
    new Date(post.updated_at || post.published_at).toISOString(),
    post.category_name || '', post.category_slug || '',
    (post.tags || []).map(t => `${t.slug}:${t.name}`).sort(),
    post.author_revision || '',
  ]);
}
