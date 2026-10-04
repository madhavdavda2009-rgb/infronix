import React, { cache } from 'react';
import { serializeJsonLd, SITE_URL } from '@/lib/site-seo';
import { RelatedServices } from '@/components/ServiceDetails';
import Link from 'next/link';
import Image from 'next/image';
import { notFound, permanentRedirect } from 'next/navigation';
import { 
  CalendarBlank, 
  Clock, 
  ArrowLeft, 
  Tag as TagIcon, 
  Article,
  ArrowRight
} from '@phosphor-icons/react/dist/ssr';
import { query } from '@/lib/founder_os_db';
import { SafeMarkdownRenderer } from '@/lib/markdown_parser';
import CTASection from '@/components/CTASection';
import ShareButtons from '@/components/ShareButtons';
import { getPublicEditorialGuide } from '@/lib/editorial-guide-author';
import { blogEnhancements, enhanceBlogPost } from '@/lib/blog-enhancements';
import { normalizeBlogImages } from '@/lib/blog-images';
import { blogRevision } from '@/lib/blog-revision';
import PublicArticleRefresh from '@/components/PublicArticleRefresh';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateStaticParams() {
  try {
    const res = await query(`
      SELECT slug FROM founder_os_blogs 
      WHERE status = 'Published' OR (status = 'Scheduled' AND scheduled_for <= NOW())
      ORDER BY COALESCE(published_at, created_at) DESC 
      LIMIT 50
    `);
    return (res.rows || []).map((row) => ({ slug: row.slug }));
  } catch {
    return [];
  }
}

const getBlogPost = cache(async function getBlogPost(slug) {
  const cleanSlug = slug.toLowerCase().trim();

  try {
    // 1. Direct match on current slug
    let res = await query(`
      SELECT 
        b.*,
        c.name as category_name,
        c.slug as category_slug,
        b.author_name,
        b.author_role,
        b.author_avatar_url,
        COALESCE(
          json_agg(
            json_build_object('id', t.id, 'name', t.name, 'slug', t.slug)
          ) FILTER (WHERE t.id IS NOT NULL), '[]'
        ) as tags
      FROM founder_os_blogs b
      LEFT JOIN founder_os_blog_categories c ON b.category_id = c.id
      LEFT JOIN founder_os_blog_posts_tags pt ON pt.post_id = b.id
      LEFT JOIN founder_os_blog_tags t ON pt.tag_id = t.id
      WHERE LOWER(b.slug) = $1 
        AND (b.status = 'Published' OR (b.status = 'Scheduled' AND b.scheduled_for <= NOW()))
      GROUP BY b.id, c.name, c.slug
      LIMIT 1
    `, [cleanSlug]);

    if (res.rows.length > 0) {
      return { post: normalizeBlogImages(enhanceBlogPost(res.rows[0])), redirected: false, targetSlug: null };
    }

    // 2. Check previous_slugs_json for old slugs (redirect)
    const redirRes = await query(`
      SELECT slug FROM founder_os_blogs
      WHERE previous_slugs_json @> $1::jsonb
        AND (status = 'Published' OR (status = 'Scheduled' AND scheduled_for <= NOW()))
      LIMIT 1
    `, [JSON.stringify([cleanSlug])]);

    if (redirRes.rows.length > 0) {
      return { post: null, redirected: true, targetSlug: redirRes.rows[0].slug };
    }

    return { post: await getPublicEditorialGuide(cleanSlug), redirected: false, targetSlug: null };
  } catch (err) {
    console.error('Error fetching blog post:', err);
    return { post: await getPublicEditorialGuide(cleanSlug), redirected: false, targetSlug: null };
  }
});

async function getRelatedPosts(postId, categoryId, limit = 3, categorySlug = null) {
  try {
    const res = await query(`
      SELECT 
        b.id, b.title, b.slug, b.excerpt, b.cover_image_url, b.cover_image_alt,
        b.reading_time_minutes, b.published_at,
        c.name as category_name, c.slug as category_slug
      FROM founder_os_blogs b
      LEFT JOIN founder_os_blog_categories c ON b.category_id = c.id
      WHERE ($1::int IS NULL OR b.id != $1)
        AND ($2::int IS NULL OR b.category_id = $2)
        AND ($4::text IS NULL OR c.slug = $4)
        AND (b.status = 'Published' OR (b.status = 'Scheduled' AND b.scheduled_for <= NOW()))
      ORDER BY b.published_at DESC
      LIMIT $3
    `, [postId, categoryId || null, limit, categorySlug]);
    return res.rows;
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;
  const { post, redirected, targetSlug } = await getBlogPost(slug);

  if (redirected && targetSlug) {
    return {
      title: 'Redirecting... | InfronixWeb Blog'
    };
  }

  if (!post) {
    return {
      title: 'Article Not Found | InfronixWeb Blog',
      robots: { index: false, follow: false }
    };
  }

  const pageTitle = post.seo_title || `${post.title} | InfronixWeb Insights`;
  const pageDescription = post.seo_description || post.excerpt;
  const canonical = post.canonical_url || `https://www.infronixweb.in/blog/${post.slug}`;
  const ogImage = post.og_image_url || post.cover_image_url || 'https://www.infronixweb.in/opengraph-image.webp';

  return {
    title: { absolute: pageTitle },
    description: pageDescription,
    alternates: {
      canonical
    },
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      url: canonical,
      siteName: 'InfronixWeb',
      type: 'article',
      publishedTime: post.published_at,
      modifiedTime: post.editorial_enhancement ? '2026-10-04T00:00:00+05:30' : post.updated_at,
      authors: [post.author_name || 'InfronixWeb Editorial Team'],
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: post.cover_image_alt || post.title
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description: pageDescription,
      images: [ogImage]
    }
  };
}

export default async function BlogPostPage({ params }) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;
  const { post, redirected, targetSlug } = await getBlogPost(slug);

  if (redirected && targetSlug) {
    permanentRedirect(`/blog/${targetSlug}`);
  }

  if (!post) {
    notFound();
  }

  const isRepositoryGuide = String(post.id).startsWith('guide-');
  const relatedPosts = (await getRelatedPosts(isRepositoryGuide ? null : post.id, post.category_id, 3, isRepositoryGuide ? post.category_slug : null)).map(p => normalizeBlogImages(enhanceBlogPost(p)));
  const enhancement = post.editorial_enhancement ? blogEnhancements[post.slug] : null;
  const articleUrl = post.canonical_url || `https://www.infronixweb.in/blog/${post.slug}`;

  // Structured Data Schema
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    image: [new URL(post.cover_image_url || '/opengraph-image.webp', SITE_URL).href],
    datePublished: post.published_at,
    dateModified: enhancement ? '2026-10-04T00:00:00+05:30' : post.updated_at,
    author: {
      '@type': post.author_type || (post.author_name ? 'Person' : 'Organization'),
      name: post.author_name || 'InfronixWeb',
      ...(post.author_role ? { jobTitle: post.author_role } : {})
    },
    publisher: {
      '@type': 'Organization',
      name: 'InfronixWeb',
      url: 'https://www.infronixweb.in',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.infronixweb.in/light-web-logo.png'
      }
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': articleUrl
    }
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://www.infronixweb.in'
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Blog',
        item: 'https://www.infronixweb.in/blog'
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: post.title,
        item: articleUrl
      }
    ]
  };

  return (
    <>
      <PublicArticleRefresh slug={post.slug} revision={blogRevision(post)} />
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbJsonLd) }}
      />

      <main className="w-full pt-20 sm:pt-28 md:pt-32 min-h-screen bg-surface" id="main-content">
        
        {/* Article Header Container */}
        <article className="max-w-[880px] mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-12">
          
          {/* Breadcrumbs & Back Link */}
          <div className="flex items-center justify-between gap-4 mb-6">
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-text-light hover:text-primary transition-colors"
            >
              <ArrowLeft size={14} weight="bold" /> Back to Insights
            </Link>

            {post.category_name && (
              <span className="px-3 py-1 bg-primary/10 text-primary font-bold text-xs uppercase tracking-wider rounded-full border border-primary/20">
                {post.category_name}
              </span>
            )}
          </div>

          {/* Article Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-on-surface leading-tight sm:leading-tight md:leading-tight mb-6">
            {post.title}
          </h1>

          {/* Excerpt / Lead */}
          <p className="text-base sm:text-lg md:text-xl text-main-text font-normal leading-relaxed mb-8 pb-8 border-b border-outline/50">
            {post.excerpt}
          </p>
          {enhancement && <p className="mb-6 leading-relaxed"><Link href={`/${enhancement.service}`} className="text-primary underline underline-offset-4">{enhancement.serviceLabel}</Link></p>}

          {/* Author & Meta Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-3">
              {post.author_avatar_url ? (
                <Image
                  src={post.author_avatar_url}
                  style={{ objectPosition: post.author_avatar_position || 'center' }}
                  alt={post.author_name || ''}
                  width={48} height={48}
                  className="w-12 h-12 rounded-full object-cover border-2 border-outline"
                  loading="lazy"
                  decoding="async"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-base border border-primary/20">
                  {post.author_name ? post.author_name[0] : 'I'}
                </div>
              )}
              <div>
                <div className="text-sm sm:text-base font-bold text-on-surface flex items-center gap-1.5">
                  <span>{post.author_name}</span>
                </div>
                <div className="text-xs text-text-light">{post.author_role || ''}</div>
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs text-text-light">
              <span className="flex items-center gap-1">
                <CalendarBlank size={15} />
                {new Date(post.published_at).toLocaleDateString('en-IN', {
                  timeZone: 'Asia/Kolkata',
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock size={15} /> {post.reading_time_minutes || 1} min read
              </span>
            </div>
          </div>
          {enhancement && <p className="text-xs text-text-light mb-6">Guide updated on 4 October 2026.</p>}

          {/* Cover Photo */}
          {post.cover_image_url && (
            <div className="mb-10 sm:mb-12 rounded-2xl overflow-hidden border border-outline shadow-md bg-surface">
              <Image
                src={post.cover_image_url}
                width={1600} height={900}
                sizes="(min-width: 880px) 880px, 100vw"
                loading="eager"
                alt={post.cover_image_alt || post.title}
                className="w-full aspect-[16/9] object-cover"
                decoding="async"
                fetchPriority="high"
              />
              {post.cover_image_alt && (
                <div className="p-2.5 bg-surface-container-lowest text-center text-xs text-text-light italic border-t border-outline/40">
                  {post.cover_image_alt}
                </div>
              )}
            </div>
          )}

          {/* Safe Markdown Content Body */}
          <div className="pt-2 pb-10 border-b border-outline/40">
            <SafeMarkdownRenderer content={post.content_markdown?.replace(/^\s*#\s+[^\n]+\n/, '')} fallbackExcerpt={post.excerpt} />
            {enhancement && !enhancement.replacementMarkdown && <SafeMarkdownRenderer content={enhancement.content} />}
          </div>

          {/* Tags & Social Share Footer */}
          <div className="py-8 border-b border-outline/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            {/* Tags */}
            <div className="flex items-center gap-2 flex-wrap">
              {Array.isArray(post.tags) && post.tags.length > 0 && post.tags.map((t, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-surface-container-lowest border border-outline rounded-xl text-xs font-semibold text-text-light hover:text-primary transition-colors"
                >
                  <TagIcon size={12} /> {t.name}
                </span>
              ))}
            </div>

            {/* Share Buttons */}
            <ShareButtons title={post.title} slug={post.slug} />
          </div>

          <aside className="py-8">
            <h2 className="text-xl font-heading font-bold mb-3 text-on-surface">Put these ideas into practice</h2>
            <RelatedServices slugs={/seo/i.test(post.category_name || '') ? ['seo', 'web-development'] : /automat|ai|crm/i.test(post.category_name || '') ? ['ai-automation', 'crm-automation'] : /google|ads/i.test(post.category_name || '') ? ['google-ads', 'performance-marketing'] : /social/i.test(post.category_name || '') ? ['digital-marketing/social-media-marketing', 'meta-ads'] : /web/i.test(post.category_name || '') ? ['web-development', 'seo'] : ['digital-marketing', 'ai-automation']} />
          </aside>
        </article>

        {/* Related Articles Section */}
        {relatedPosts.length > 0 && (
          <section className="w-full py-12 sm:py-16 bg-surface-container-lowest border-t border-outline/40">
            <div className="max-w-[1280px] mx-auto px-4 sm:px-6 md:px-12">
              <div className="mb-8">
                <span className="text-xs font-bold uppercase tracking-widest text-primary mb-2 block">Keep Exploring</span>
                <h2 className="text-2xl sm:text-3xl font-heading font-bold text-on-surface">
                  Related Insights & Guides
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {relatedPosts.map((rel) => (
                  <Link
                    key={rel.id}
                    href={`/blog/${rel.slug}`}
                    className="group bg-surface border border-outline hover:border-primary/40 rounded-2xl p-5 hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      {rel.cover_image_url ? (
                        <div className="aspect-[16/10] rounded-xl overflow-hidden mb-4">
                          <Image
                            src={rel.cover_image_url}
                            width={640} height={400}
                            sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw"
                            alt={rel.cover_image_alt || rel.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            loading="lazy"
                            decoding="async"
                          />
                        </div>
                      ) : (
                        <div className="aspect-[16/10] rounded-xl bg-surface-container-highest flex items-center justify-center mb-4">
                          <Article size={28} className="text-text-light/50" />
                        </div>
                      )}

                      <span className="text-[10px] font-bold text-primary uppercase tracking-wider mb-2 block">
                        {rel.category_name || 'Insights'}
                      </span>

                      <h3 className="text-base sm:text-lg font-heading font-bold text-on-surface group-hover:text-primary transition-colors leading-snug line-clamp-2 mb-2">
                        {rel.title}
                      </h3>

                      <p className="text-xs text-main-text line-clamp-2 leading-relaxed mb-4">
                        {rel.excerpt}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-outline/40 flex items-center justify-between text-xs text-text-light">
                      <span>{rel.reading_time_minutes || 1} min read</span>
                      <span className="font-bold text-primary flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        Read <ArrowRight size={13} weight="bold" />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        <CTASection />
      </main>
    </>
  );
}
