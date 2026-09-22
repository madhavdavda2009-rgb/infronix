import { query } from '@/lib/founder_os_db';
import { pageMetadata } from '@/lib/site-seo';
import CTASection from '@/components/CTASection';
import Breadcrumb from '@/components/Breadcrumb';
import BlogListClient from '@/components/BlogListClient';

export const revalidate = 300; // 5-minute ISR cache for fast page delivery

export const metadata = pageMetadata(
  "Insights on Websites, SEO, Marketing & Automation",
  "Practical insights on websites, SEO, digital marketing and business automation for Ahmedabad businesses.",
  '/blog'
);

export default async function BlogPage() {
  let initialPosts = [];
  let initialCategories = [];
  let initialTags = [];
  let initialError = false;

  try {
    const [postsRes, catsRes, tagsRes] = await Promise.all([
      query(`
        SELECT 
          b.id, 
          b.title, 
          b.slug, 
          b.excerpt, 
          b.cover_image_url, 
          b.cover_image_alt, 
          b.author_name, 
          b.author_avatar_url, 
          b.reading_time_minutes, 
          b.featured, 
          COALESCE(b.published_at, b.scheduled_for, b.created_at) AS published_at, 
          c.name AS category_name,
          c.slug AS category_slug
        FROM founder_os_blogs b 
        LEFT JOIN founder_os_blog_categories c ON c.id = b.category_id
        WHERE b.status = 'Published' OR (b.status = 'Scheduled' AND b.scheduled_for <= NOW())
        ORDER BY b.featured DESC, COALESCE(b.published_at, b.scheduled_for, b.created_at) DESC 
        LIMIT 30
      `),
      query(`
        SELECT c.id, c.name, c.slug, c.description, COUNT(b.id)::int AS post_count
        FROM founder_os_blog_categories c
        JOIN founder_os_blogs b ON b.category_id = c.id
        WHERE (b.status = 'Published' OR (b.status = 'Scheduled' AND b.scheduled_for <= NOW()))
        GROUP BY c.id
        ORDER BY c.display_order ASC, c.name ASC
      `),
      query(`
        SELECT t.id, t.name, t.slug, COUNT(pt.post_id)::int AS post_count
        FROM founder_os_blog_tags t
        JOIN founder_os_blog_posts_tags pt ON pt.tag_id = t.id
        JOIN founder_os_blogs b ON b.id = pt.post_id
        WHERE (b.status = 'Published' OR (b.status = 'Scheduled' AND b.scheduled_for <= NOW()))
        GROUP BY t.id
        ORDER BY t.name ASC
      `)
    ]);

    initialPosts = JSON.parse(JSON.stringify(postsRes.rows || []));
    initialCategories = JSON.parse(JSON.stringify(catsRes.rows || []));
    initialTags = JSON.parse(JSON.stringify(tagsRes.rows || []));
  } catch (err) {
    console.error('Failed to load initial blog data:', err?.message);
    initialError = true;
  }

  return (
    <>
      <main className="w-full pt-20 sm:pt-28 md:pt-32 min-h-screen bg-surface" id="main-content">
        {/* Header Section */}
        <section className="relative w-full py-10 sm:py-14 md:py-20" aria-label="Blog Header">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 md:px-12">
            <Breadcrumb className="justify-center mb-4" />
            <div className="text-center max-w-3xl mx-auto">
              <span className="flex items-center justify-center gap-2 text-xs font-bold tracking-widest uppercase text-primary mb-3 sm:mb-4">
                <span className="w-6 sm:w-8 h-[2px] bg-primary" /> Digital Insights <span className="w-6 sm:w-8 h-[2px] bg-primary" />
              </span>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-on-surface mb-4 sm:mb-6 leading-tight">
                Strategies & Insights for Modern Digital Growth
              </h1>
              <p className="text-sm sm:text-base md:text-lg text-main-text leading-relaxed">
                Practical guides, architecture breakdowns, and actionable blueprints for high-performing web platforms, search rankings, and business automation.
              </p>
            </div>
          </div>
        </section>

        {/* Dynamic Database-Driven Articles Section */}
        <BlogListClient 
          initialPosts={initialPosts} 
          initialCategories={initialCategories}
          initialTags={initialTags}
          initialError={initialError} 
        />

        <CTASection />
      </main>
    </>
  );
}
