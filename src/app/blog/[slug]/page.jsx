import React from 'react';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { 
  CalendarBlank, 
  Clock, 
  ArrowLeft, 
  Tag as TagIcon, 
  Sparkle, 
  Article,
  ArrowRight,
  ShieldCheck
} from '@phosphor-icons/react/dist/ssr';
import { query, initFounderOSDb } from '@/lib/founder_os_db';
import { SafeMarkdownRenderer } from '@/lib/markdown_parser';
import Breadcrumb from '@/components/Breadcrumb';
import CTASection from '@/components/CTASection';
import ShareButtons from '@/components/ShareButtons';

export const revalidate = 60; // ISR revalidation every 60 seconds

async function getBlogPost(slug) {
  await initFounderOSDb();
  const cleanSlug = slug.toLowerCase().trim();

  // 1. Check exact published slug
  const res = await query(`
    SELECT 
      b.*,
      c.name AS category_name,
      c.slug AS category_slug,
      COALESCE(
        json_agg(json_build_object('name', t.name, 'slug', t.slug)) 
        FILTER (WHERE t.id IS NOT NULL), '[]'
      ) AS tags
    FROM founder_os_blogs b
    LEFT JOIN founder_os_blog_categories c ON c.id = b.category_id
    LEFT JOIN founder_os_blog_posts_tags pt ON pt.post_id = b.id
    LEFT JOIN founder_os_blog_tags t ON t.id = pt.tag_id
    WHERE LOWER(b.slug) = $1 
      AND (b.status = 'Published' OR (b.status = 'Scheduled' AND b.scheduled_for <= NOW()))
    GROUP BY b.id, c.name, c.slug
  `, [cleanSlug]);

  if (res.rows.length > 0) {
    return { post: res.rows[0], redirected: false };
  }

  // 2. Check previous slugs for redirect
  const legacyRes = await query(`
    SELECT slug FROM founder_os_blogs 
    WHERE previous_slugs_json @> $1::jsonb 
      AND (status = 'Published' OR (status = 'Scheduled' AND scheduled_for <= NOW()))
    LIMIT 1
  `, [JSON.stringify([cleanSlug])]);

  if (legacyRes.rows.length > 0) {
    return { post: null, redirected: true, targetSlug: legacyRes.rows[0].slug };
  }

  return { post: null, redirected: false };
}

async function getRelatedPosts(postId, categoryId, limit = 3) {
  try {
    const res = await query(`
      SELECT 
        b.id, b.title, b.slug, b.excerpt, b.cover_image_url, b.cover_image_alt,
        b.author_name, b.reading_time_minutes, b.published_at,
        c.name AS category_name
      FROM founder_os_blogs b
      LEFT JOIN founder_os_blog_categories c ON c.id = b.category_id
      WHERE b.id != $1
        AND (b.category_id = $2 OR $2 IS NULL)
        AND (b.status = 'Published' OR (b.status = 'Scheduled' AND b.scheduled_for <= NOW()))
      ORDER BY b.published_at DESC
      LIMIT $3
    `, [postId, categoryId || null, limit]);
    return res.rows;
  } catch (err) {
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
  const ogImage = post.og_image_url || post.cover_image_url || 'https://www.infronixweb.in/opengraph-image.png';

  return {
    title: pageTitle,
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
      modifiedTime: post.updated_at,
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
    redirect(`/blog/${targetSlug}`);
  }

  if (!post) {
    notFound();
  }

  const relatedPosts = await getRelatedPosts(post.id, post.category_id, 3);
  const articleUrl = post.canonical_url || `https://www.infronixweb.in/blog/${post.slug}`;

  // Structured Data Schema
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    image: post.cover_image_url ? [post.cover_image_url] : ['https://www.infronixweb.in/opengraph-image.png'],
    datePublished: post.published_at,
    dateModified: post.updated_at,
    author: {
      '@type': 'Person',
      name: post.author_name || 'InfronixWeb Editorial Team',
      jobTitle: post.author_role || 'Digital Specialist'
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
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
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
          <p className="text-base sm:text-lg md:text-xl text-main-text font-normal leading-relaxed mb-8 pb-8 border-b border-outline-variant/50">
            {post.excerpt}
          </p>

          {/* Author & Meta Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-3">
              {post.author_avatar_url ? (
                <img
                  src={post.author_avatar_url}
                  alt={post.author_name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-outline-variant"
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
                <div className="text-xs text-text-light">{post.author_role || 'Digital Specialist'}</div>
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs text-text-light">
              <span className="flex items-center gap-1">
                <CalendarBlank size={15} />
                {new Date(post.published_at).toLocaleDateString(undefined, {
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

          {/* Cover Photo */}
          {post.cover_image_url && (
            <div className="mb-10 sm:mb-12 rounded-2xl overflow-hidden border border-outline-variant/60 shadow-md bg-surface">
              <img
                src={post.cover_image_url}
                alt={post.cover_image_alt || post.title}
                className="w-full aspect-[16/9] object-cover"
              />
              {post.cover_image_alt && (
                <div className="p-2.5 bg-surface-container-lowest text-center text-xs text-text-light italic border-t border-outline-variant/40">
                  {post.cover_image_alt}
                </div>
              )}
            </div>
          )}

          {/* Safe Markdown Content Body */}
          <div className="pt-2 pb-10 border-b border-outline-variant/40">
            <SafeMarkdownRenderer content={post.content_markdown} />
          </div>

          {/* Tags & Social Share Footer */}
          <div className="py-8 border-b border-outline-variant/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            {/* Tags */}
            <div className="flex items-center gap-2 flex-wrap">
              {Array.isArray(post.tags) && post.tags.length > 0 && post.tags.map((t, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-surface-container-lowest border border-outline-variant/60 rounded-xl text-xs font-semibold text-text-light hover:text-primary transition-colors"
                >
                  <TagIcon size={12} /> {t.name}
                </span>
              ))}
            </div>

            {/* Share Buttons */}
            <ShareButtons title={post.title} slug={post.slug} />
          </div>

        </article>

        {/* Related Articles Section */}
        {relatedPosts.length > 0 && (
          <section className="w-full py-12 sm:py-16 bg-surface-container-lowest border-t border-outline-variant/40">
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
                    className="group bg-surface border border-outline-variant/60 hover:border-primary/40 rounded-2xl p-5 hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      {rel.cover_image_url ? (
                        <div className="aspect-[16/10] rounded-xl overflow-hidden mb-4">
                          <img
                            src={rel.cover_image_url}
                            alt={rel.cover_image_alt || rel.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            loading="lazy"
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

                    <div className="pt-3 border-t border-outline-variant/40 flex items-center justify-between text-xs text-text-light">
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
