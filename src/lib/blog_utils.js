/**
 * Calculates reading time in minutes based on ~200 words per minute average.
 */
export function calculateReadingTime(text) {
  if (!text || typeof text !== 'string') return 1;
  const words = text.trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  return Math.max(1, Math.ceil(wordCount / 200));
}

/**
 * Strips markdown to pure plain text for excerpts or SEO summaries.
 */
export function stripMarkdown(markdown) {
  if (!markdown) return '';
  return markdown
    .replace(/<[^>]*>/g, '') // remove HTML tags
    .replace(/^#{1,6}\s+/gm, '') // headings
    .replace(/!\[(.*?)\]\(.*?\)/g, '$1') // images
    .replace(/\[(.*?)\]\(.*?\)/g, '$1') // links
    .replace(/(\*\*\*|___)(.*?)\1/g, '$2') // bold italic
    .replace(/(\*\*|__)(.*?)\1/g, '$2') // bold
    .replace(/(\*|_)(.*?)\1/g, '$2') // italic
    .replace(/~~(.*?)~~/g, '$1') // strikethrough
    .replace(/==(.*?)==/g, '$1') // highlight
    .replace(/`{3}[\s\S]*?`{3}/g, '') // code blocks
    .replace(/`(.+?)`/g, '$1') // inline code
    .replace(/^>\s+/gm, '') // quotes
    .replace(/^[-*+]\s+/gm, '') // lists
    .replace(/^\d+\.\s+/gm, '') // numbered lists
    .replace(/\|.*?\|/g, ' ') // tables
    .replace(/\n+/g, ' ') // whitespace
    .trim();
}

/**
 * Generates clean URL-safe slug from title text.
 */
export function generateSlug(text) {
  if (!text) return '';
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}
