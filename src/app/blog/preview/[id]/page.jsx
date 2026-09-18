import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';
import crypto from 'node:crypto';
import { 
  CalendarBlank, 
  Clock, 
  ArrowLeft, 
  Tag as TagIcon, 
  WarningCircle,
  Eye
} from '@phosphor-icons/react/dist/ssr';
import { query, initFounderOSDb } from '@/lib/founder_os_db';
import { SafeMarkdownRenderer } from '@/lib/markdown_parser';
import { verifyJwtToken } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: '[PREVIEW] Blog Post Draft | InfronixWeb',
  robots: {
    index: false,
    follow: false
  }
};

function verifyPreviewToken(token, blogId) {
  if (!token) return false;
  try {
    const decoded = JSON.parse(Buffer.from(token, 'base64url').toString('utf8'));
    if (String(decoded.blogId) !== String(blogId)) return false;
    if (Date.now() > decoded.expiresAt) return false;

    const secret = process.env.ADMIN_JWT_SECRET || 'infronix_blog_preview_secret_salt_2026';
    const payload = `${blogId}:${decoded.expiresAt}`;
    const expectedHmac = crypto.createHmac('sha256', secret).update(payload).digest('hex');
    return expectedHmac === decoded.hmac;
  } catch (err) {
    return false;
  }
}

async function isAuthorized(blogId, token) {
  // 1. Check valid signed preview token
  if (verifyPreviewToken(token, blogId)) return true;

  // 2. Check admin auth cookie
  try {
    const cookieStore = await cookies();
    const adminToken = cookieStore.get('admin_token')?.value;
    if (adminToken && verifyJwtToken(adminToken)) return true;
  } catch (e) {
    // ignore
  }

  return false;
}

export default async function BlogPreviewPage({ params, searchParams }) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const { id } = resolvedParams;
  const token = resolvedSearchParams?.token;

  const authOk = await isAuthorized(id, token);
  if (!authOk) {
    return (
      <main className="min-h-screen bg-surface flex items-center justify-center p-6 text-center">
        <div className="max-w-md p-8 bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-lg">
          <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-3">
            <WarningCircle size={28} weight="bold" />
          </div>
          <h1 className="text-xl font-bold font-heading text-on-surface mb-2">Unauthorized Preview</h1>
          <p className="text-xs text-main-text mb-6 leading-relaxed">
            This article draft is private. You must be logged into Founder OS or hold a valid preview access token to view it.
          </p>
          <Link
            href="/admin/login"
            className="px-5 py-2.5 bg-primary text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-sm hover:opacity-90 inline-block"
          >
            Log in to Founder OS
          </Link>
        </div>
      </main>
    );
  }

  await initFounderOSDb();
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
    WHERE b.id = $1
    GROUP BY b.id, c.name, c.slug
  `, [id]);

  if (res.rows.length === 0) {
    notFound();
  }

  const post = res.rows[0];

  return (
    <>
      {/* Sticky Preview Header Banner */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-amber-500 text-slate-950 font-bold px-4 py-2.5 shadow-md flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 max-w-[1280px] mx-auto w-full">
          <Eye size={18} weight="bold" />
          <span>PREVIEW MODE — Status: <strong className="uppercase underline">{post.status}</strong></span>
          <span className="hidden sm:inline font-normal text-slate-900">• This article is not visible on the public website.</span>
          <Link 
            href="/admin?tab=blog" 
            className="ml-auto bg-slate-950 text-white px-3 py-1 rounded-lg hover:bg-slate-900 transition-colors text-[11px]"
          >
            Back to Founder OS
          </Link>
        </div>
      </div>

      <main className="w-full pt-28 sm:pt-32 min-h-screen bg-surface" id="main-content">
        <article className="max-w-[880px] mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-12">
          
          {/* Category */}
          {post.category_name && (
            <div className="mb-4">
              <span className="px-3 py-1 bg-primary/10 text-primary font-bold text-xs uppercase tracking-wider rounded-full border border-primary/20">
                {post.category_name}
              </span>
            </div>
          )}

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-on-surface leading-tight mb-6">
            {post.title}
          </h1>

          {/* Excerpt */}
          <p className="text-base sm:text-lg md:text-xl text-main-text font-normal leading-relaxed mb-8 pb-8 border-b border-outline-variant/50">
            {post.excerpt}
          </p>

          {/* Author */}
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
                <div className="text-sm sm:text-base font-bold text-on-surface">
                  {post.author_name}
                </div>
                <div className="text-xs text-text-light">{post.author_role || 'Digital Specialist'}</div>
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs text-text-light">
              <span className="flex items-center gap-1">
                <CalendarBlank size={15} /> Draft Preview
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
            </div>
          )}

          {/* Safe Markdown Content Body */}
          <div className="pt-2 pb-10 border-b border-outline-variant/40">
            <SafeMarkdownRenderer content={post.content_markdown} />
          </div>

          {/* Tags */}
          {Array.isArray(post.tags) && post.tags.length > 0 && (
            <div className="py-6 flex items-center gap-2 flex-wrap">
              {post.tags.map((t, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-surface-container-lowest border border-outline-variant/60 rounded-xl text-xs font-semibold text-text-light"
                >
                  <TagIcon size={12} /> {t.name}
                </span>
              ))}
            </div>
          )}

        </article>
      </main>
    </>
  );
}
