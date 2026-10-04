import { editorialGuides } from './editorial-guides.js';

// Use the same public listing for CMS articles and repository guides.
export function buildBlogCatalog(posts, categories, filters = {}, publishedSlugs = posts.map(p => p.slug), guideAuthor = null) {
  const existing = new Set(publishedSlugs);
  const guides = editorialGuides.filter(p => !existing.has(p.slug)).map(p => ({ ...p, ...guideAuthor }));
  const mergedCategories = categories.map(c => ({ ...c, post_count: Number(c.post_count || 0) + guides.filter(p => p.category_slug === c.slug).length }));
  for (const guide of guides) if (!mergedCategories.some(c => c.slug === guide.category_slug)) {
    mergedCategories.push({id: `guide-${guide.category_slug}`, name: guide.category_name, slug: guide.category_slug, post_count: guides.filter(p => p.category_slug === guide.category_slug).length});
  }
  const search = filters.search?.trim().toLowerCase();
  const filteredGuides = guides.filter(p =>
    (!filters.category || filters.category === 'all' || p.category_slug === filters.category) &&
    (!filters.tag || filters.tag === 'all' || p.tags.some(t => t.slug === filters.tag)) &&
    (filters.featured !== 'true' || p.featured) &&
    (!search || [p.title,p.excerpt,p.content_markdown].some(value => value.toLowerCase().includes(search)))
  );
  // Keep the article body on the server; cards need only summary fields.
  const summaries = filteredGuides.map(({content_markdown: _content, ...summary}) => summary);
  const merged = [...posts, ...summaries].sort((a,b) => Number(Boolean(b.featured))-Number(Boolean(a.featured)) || new Date(b.published_at)-new Date(a.published_at));
  return {posts:merged, categories:mergedCategories};
}
