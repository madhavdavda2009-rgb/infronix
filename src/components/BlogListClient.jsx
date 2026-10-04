"use client";
import React, { useState, useMemo } from 'react';
import { usePublicData } from '@/hooks/usePublicData';
import Link from 'next/link';
import Image from 'next/image';
import { 
  MagnifyingGlass, 
  CalendarBlank, 
  Clock, 
  ArrowRight, 
  Sparkle, 
  Article,
  X
} from '@phosphor-icons/react';

export default function BlogListClient({ 
  initialPosts = [], 
  initialCategories = [], 
  initialTags = [], 
  initialError = false 
}) {
  const initialData = useMemo(() => ({ success: !initialError, posts: initialPosts, categories: initialCategories, tags: initialTags }), [initialError, initialPosts, initialCategories, initialTags]);
  const data = usePublicData('/api/public/blogs', initialData);
  const posts = data?.posts || initialPosts;
  const categories = data?.categories || initialCategories;
  const loadError = !data?.success;
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTag, setSelectedTag] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Instant 0ms In-Memory Filter for 60fps real-time search without network roundtrip
  const filteredPosts = React.useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return posts.filter((post) => {
      // Category filter
      if (selectedCategory !== 'all' && post.category_slug !== selectedCategory) {
        return false;
      }
      // Tag filter
      if (selectedTag !== 'all' && !(Array.isArray(post.tags) && post.tags.some(t => t.slug === selectedTag))) {
        return false;
      }
      // Text search match across title, excerpt, category, author, and tags
      if (q) {
        const titleMatch = post.title?.toLowerCase().includes(q);
        const excerptMatch = post.excerpt?.toLowerCase().includes(q);
        const categoryMatch = post.category_name?.toLowerCase().includes(q);
        const authorMatch = post.author_name?.toLowerCase().includes(q);
        const tagMatch = Array.isArray(post.tags) && post.tags.some(t => 
          (t.name && t.name.toLowerCase().includes(q)) || 
          (t.slug && t.slug.toLowerCase().includes(q))
        );
        return titleMatch || excerptMatch || categoryMatch || authorMatch || tagMatch;
      }
      return true;
    });
  }, [posts, selectedCategory, selectedTag, searchQuery]);

  // Featured post (if any in the current result set)
  const featuredPost = selectedCategory === 'all' && selectedTag === 'all' && !searchQuery.trim()
    ? filteredPosts.find(p => p.featured)
    : null;

  // Regular grid posts (exclude featured hero post if shown in hero)
  const gridPosts = featuredPost 
    ? filteredPosts.filter(p => p.id !== featuredPost.id)
    : filteredPosts;

  return (
    <div className="w-full">
      {/* Filtering & Search Bar */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 md:px-12 mb-10 sm:mb-14">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-3 sm:p-4 bg-surface-container-lowest rounded-2xl border border-outline-variant/60 shadow-xs">
          
          {/* Category Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            <button
              onClick={() => { setSelectedCategory('all'); setSelectedTag('all'); }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                selectedCategory === 'all' && selectedTag === 'all'
                  ? 'bg-primary text-white shadow-xs'
                  : 'text-text-light hover:text-on-surface hover:bg-surface'
              }`}
            >
              All Topics
            </button>
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => { setSelectedCategory(c.slug); setSelectedTag('all'); }}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  selectedCategory === c.slug
                    ? 'bg-primary text-white shadow-xs'
                    : 'text-text-light hover:text-on-surface hover:bg-surface'
                }`}
              >
                {c.name} {c.post_count ? `(${c.post_count})` : ''}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative min-w-[240px] sm:min-w-[280px]">
            <MagnifyingGlass size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-light" />
            <input
              type="text"
              placeholder="Search insights..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2 bg-surface rounded-xl border border-outline-variant/50 text-xs text-on-surface placeholder:text-text-light focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-light hover:text-on-surface p-0.5 cursor-pointer"
                aria-label="Clear search"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Active Tag Filter Indicator */}
        {selectedTag !== 'all' && (
          <div className="mt-3 flex items-center gap-2 text-xs">
            <span className="text-text-light">Filtered by tag:</span>
            <span className="px-2.5 py-1 rounded-lg bg-primary/10 text-primary font-bold flex items-center gap-1">
              #{selectedTag}
              <button onClick={() => setSelectedTag('all')} className="hover:text-rose-600 ml-1 cursor-pointer" aria-label="Remove tag filter">
                <X size={12} />
              </button>
            </span>
          </div>
        )}
      </div>

      {/* Featured Post Spotlight Hero */}
      {featuredPost && (
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 md:px-12 mb-12 sm:mb-16">
          <Link
            href={`/blog/${featuredPost.slug}`}
            className="group block bg-surface-container-lowest border border-outline-variant/70 rounded-2xl sm:rounded-3xl overflow-hidden hover:shadow-xl hover:border-primary/40 transition-all"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center p-6 sm:p-8 md:p-10">
              
              {/* Cover Image */}
              <div className="lg:col-span-6 overflow-hidden rounded-xl sm:rounded-2xl aspect-[16/10] bg-surface relative">
                {featuredPost.cover_image_url ? (
                  <Image
                    src={featuredPost.cover_image_url}
                    fill
                    sizes="(min-width: 1024px) 600px, 100vw"
                    loading="eager"
                    alt={featuredPost.cover_image_alt || featuredPost.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    decoding="async"
                    fetchPriority="high"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-surface">
                    <Article size={48} className="text-primary/40" />
                  </div>
                )}
                <div className="absolute top-3 left-3 bg-amber-500 text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-xs">
                  <Sparkle size={12} weight="fill" /> Featured Article
                </div>
              </div>

              {/* Content */}
              <div className="lg:col-span-6 flex flex-col justify-center">
                <div className="flex items-center gap-3 text-xs text-text-light mb-3">
                  <span className="font-bold text-primary uppercase tracking-widest text-[11px]">
                    {featuredPost.category_name || 'Insights'}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock size={14} /> {featuredPost.reading_time_minutes || 1} min read
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold text-on-surface group-hover:text-primary transition-colors leading-tight mb-4">
                  {featuredPost.title}
                </h2>

                <p className="text-sm sm:text-base text-main-text leading-relaxed line-clamp-3 mb-6">
                  {featuredPost.excerpt}
                </p>

                {/* Author & Read More */}
                <div className="flex items-center justify-between pt-4 border-t border-outline-variant/40 mt-auto">
                  <div className="flex items-center gap-2.5">
                    {featuredPost.author_avatar_url ? (
                      <Image
                        src={featuredPost.author_avatar_url} 
                        style={{ objectPosition: featuredPost.author_avatar_position || 'center' }}
                        width={32} height={32}
                        alt="" 
                        className="w-8 h-8 rounded-full object-cover border border-outline-variant"
                        loading="lazy"
                        decoding="async" 
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                        {featuredPost.author_name ? featuredPost.author_name[0] : 'I'}
                      </div>
                    )}
                    <div>
                      <div className="text-xs font-bold text-on-surface">{featuredPost.author_name}</div>
                      <div className="text-[10px] text-text-light">
                        {featuredPost.published_at ? new Date(featuredPost.published_at).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata', month: 'short', day: 'numeric', year: 'numeric' }) : ''}
                      </div>
                    </div>
                  </div>

                  <span className="inline-flex items-center gap-1 text-xs font-bold text-primary group-hover:translate-x-1 transition-transform">
                    Read Article <ArrowRight size={14} weight="bold" />
                  </span>
                </div>
              </div>

            </div>
          </Link>
        </div>
      )}

      {/* Main Grid Section */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 md:px-12 pb-16">
        {gridPosts.length === 0 ? (
          <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-3xl p-10 sm:p-16 text-center max-w-2xl mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
              <Article size={32} />
            </div>
            <h3 className="text-xl sm:text-2xl font-heading font-bold text-on-surface mb-2">
              {loadError ? 'Articles are temporarily unavailable' : 'No articles found'}
            </h3>
            <p className="text-sm text-main-text leading-relaxed mb-6">
              {loadError ? 'Please try reloading this page. You can still contact us to discuss your project.' : searchQuery || selectedCategory !== 'all' || selectedTag !== 'all'
                ? 'No published articles matched your search query or topic filters. Try clearing your filters.'
                : 'Our digital insights, engineering guides, and automation strategies are being written. Check back soon!'}
            </p>
            {(searchQuery || selectedCategory !== 'all' || selectedTag !== 'all') && (
              <button
                onClick={() => { setSelectedCategory('all'); setSelectedTag('all'); setSearchQuery(''); }}
                className="px-5 py-2.5 bg-primary text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-sm hover:opacity-90 transition-opacity cursor-pointer"
              >
                Reset All Filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {gridPosts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group bg-surface-container-lowest border border-outline-variant/70 hover:border-primary/40 rounded-2xl p-5 hover:shadow-lg transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Article Thumbnail */}
                  <div className="aspect-[16/10] w-full rounded-xl overflow-hidden bg-surface mb-4 relative">
                    {post.cover_image_url ? (
                      <Image
                        src={post.cover_image_url}
                        fill
                        sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw"
                        alt={post.cover_image_alt || post.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                        decoding="async"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-surface to-surface-container-lowest">
                        <Article size={32} className="text-text-light/50" />
                      </div>
                    )}
                    {post.category_name && (
                      <span className="absolute top-2.5 left-2.5 bg-surface-container-lowest/90 backdrop-blur-xs px-2.5 py-1 rounded-full text-[10px] font-bold text-primary uppercase tracking-wider shadow-xs">
                        {post.category_name}
                      </span>
                    )}
                  </div>

                  {/* Reading Time & Date */}
                  <div className="flex items-center gap-2 text-[11px] text-text-light mb-2">
                    <span className="flex items-center gap-1">
                      <CalendarBlank size={13} />
                      {post.published_at ? new Date(post.published_at).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata', month: 'short', day: 'numeric', year: 'numeric' }) : ''}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock size={13} /> {post.reading_time_minutes || 1} min read
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg sm:text-xl font-heading font-bold text-on-surface group-hover:text-primary transition-colors leading-snug mb-2 line-clamp-2">
                    {post.title}
                  </h3>

                  {/* Excerpt */}
                  <p className="text-xs sm:text-sm text-main-text leading-relaxed line-clamp-3 mb-4">
                    {post.excerpt}
                  </p>
                </div>

                {/* Footer Author & Read link */}
                <div className="pt-3.5 border-t border-outline-variant/40 flex items-center justify-between text-xs mt-auto">
                  <div className="flex items-center gap-2">
                    {post.author_avatar_url ? (
                      <Image
                        src={post.author_avatar_url} 
                        style={{ objectPosition: post.author_avatar_position || 'center' }}
                        width={24} height={24}
                        alt="" 
                        className="w-6 h-6 rounded-full object-cover border border-outline-variant"
                        loading="lazy"
                        decoding="async"
                      />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-[10px]">
                        {post.author_name ? post.author_name[0] : 'I'}
                      </div>
                    )}
                    <span className="text-[11px] font-semibold text-text-light line-clamp-1">
                      {post.author_name}
                    </span>
                  </div>

                  <span className="inline-flex items-center gap-1 font-bold text-primary group-hover:translate-x-1 transition-transform text-[11px]">
                    Read <ArrowRight size={13} weight="bold" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
