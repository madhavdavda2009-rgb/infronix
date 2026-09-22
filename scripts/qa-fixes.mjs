import fs from 'node:fs';
const edit = (p, fn) => fs.writeFileSync(p, fn(fs.readFileSync(p, 'utf8')));
edit('src/components/ServicesSection.jsx', s => s.replace('{service.title}\r\n                    </h3>', '<button type="button" aria-expanded={activeService === index} onClick={() => setActiveService(index)} className="text-left">{service.title}</button>\r\n                    </h3>'));
edit('src/components/PortfolioSection.jsx', s => s.replace(/\s*\{\/\* Floating View Project Button \*\/\}[\s\S]*?<\/div>/, '').replace('    link: "/start-project"', '    category: "Website development"'));
edit('src/components/HeroSection.jsx', s => s.replace('order-2 lg:order-1', 'order-1').replace('order-1 lg:order-2', 'order-2'));
// Public content reads do not need to run schema migrations.
for (const p of ['src/app/blog/[slug]/page.jsx', 'src/app/api/public/blogs/route.js', 'src/app/api/public/team/route.js']) edit(p, s => s.replace('query, initFounderOSDb', 'query').replace(/  await initFounderOSDb\(\);\r?\n/, ''));
// Keep the blog index useful to crawlers before hydration while retaining its filters.
edit('src/app/blog/page.jsx', s => `import { query } from '@/lib/founder_os_db';\nexport const revalidate = 60;\n` + s.replace('export default function BlogPage() {', `export default async function BlogPage() {
  let initialPosts = [];
  let initialError = false;
  try {
    const result = await query(\`SELECT b.id, b.title, b.slug, b.excerpt, b.cover_image_url, b.cover_image_alt, b.author_name, b.author_avatar_url, b.reading_time_minutes, b.featured, COALESCE(b.published_at, b.scheduled_for) AS published_at, c.name AS category_name
      FROM founder_os_blogs b LEFT JOIN founder_os_blog_categories c ON c.id = b.category_id
      WHERE b.status = 'Published' OR (b.status = 'Scheduled' AND b.scheduled_for <= NOW())
      ORDER BY b.featured DESC, COALESCE(b.published_at, b.scheduled_for) DESC LIMIT 24\`);
    initialPosts = JSON.parse(JSON.stringify(result.rows));
  } catch { initialError = true; }
`).replace('<BlogListClient />', '<BlogListClient initialPosts={initialPosts} initialError={initialError} />'));
edit('src/components/BlogListClient.jsx', s => s.replace('export default function BlogListClient() {', 'export default function BlogListClient({ initialPosts = [], initialError = false }) {').replace('const [posts, setPosts] = useState([])', 'const [posts, setPosts] = useState(initialPosts)').replace('  const [loading, setLoading] = useState(true);', '  const [loading, setLoading] = useState(false);\n  const [loadError, setLoadError] = useState(initialError);').replace('        if (!res.ok) return;', "        if (!res.ok) throw new Error('Articles are temporarily unavailable.');").replace('          setPosts(data.posts || []);', '          setLoadError(false);\n          setPosts(data.posts || []);').replace("        console.warn('Failed to load published blogs:', err.message);", "        if (isMounted) setLoadError(true);\n        console.warn('Failed to load published blogs:', err.message);").replace('No articles found', "{loadError ? 'Articles are temporarily unavailable' : 'No articles found'}"));
for (const p of ['src/app/api/founder-os/blogs/route.js','src/app/api/founder-os/blogs/[id]/route.js']) edit(p, s => s.replace(/revalidatePath\('\/sitemap.xml'\);\s*revalidatePath\('\/sitemap.xml'\);/g, "revalidatePath('/sitemap.xml');"));
edit('src/components/Footer.jsx', s => s.replace('<Link href="/seo"', '<Link href="/seo"').replace('              <ul', '              <ul'));
