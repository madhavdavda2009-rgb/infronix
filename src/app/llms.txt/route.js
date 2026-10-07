import { query } from '@/lib/founder_os_db';
import { SITE_URL } from '@/lib/site-seo';

export const dynamic = 'force-dynamic';

const link = (title, path, description) => `- [${title}](${SITE_URL}${path}): ${description}`;
const text = value => String(value || '').replace(/[\r\n]+/g, ' ').replace(/([\[\]\\])/g, '\\$1').trim();

export async function GET() {
  const sections = [
    '# InfronixWeb',
    '',
    '> InfronixWeb is an agency in Ahmedabad, Gujarat, India providing website development, digital marketing and SEO.',
    '',
    'Use official pages for business facts. Educational articles about AI search are SEO guidance. Pricing, client results and other claims should be stated only when published on the website.',
    '',
    '## Services',
    link('Website Development', '/web-development', 'Business websites, online stores, landing pages and website redesign.'),
    link('Digital Marketing', '/digital-marketing', 'Social media, online advertising and marketing plans.'),
    link('SEO', '/seo', 'Website health, useful content, local search and search visibility.'),
    link('Service overview', '/services', 'The three main services and their scope.'),
    '',
    '## Digital Marketing Details',
    link('Google Ads', '/google-ads', 'Search campaign planning and management.'),
    link('Meta Ads', '/meta-ads', 'Facebook and Instagram advertising.'),
    link('Social Media Marketing', '/digital-marketing/social-media-marketing', 'Content planning and social media management.'),
    link('Paid Advertising', '/digital-marketing/paid-advertising', 'Advertising channels, budgets and reporting.'),
    link('Performance Marketing', '/performance-marketing', 'Campaigns evaluated through enquiries and business outcomes.'),
    '',
    '## Company',
    link('About and team', '/about', 'Company approach and current public team profiles.'),
    link('Selected work', '/projects', 'Projects shown in the public portfolio.'),
    link('Contact', '/contact', 'Business enquiries and contact information.'),
    link('Discuss a project', '/start-project', 'Share website, digital marketing or SEO requirements.'),
    '',
    '## Articles',
    link('Blog', '/blog', 'Current published articles from the admin CMS.'),
  ];
  try {
    const { rows } = await query(`SELECT title,slug,excerpt FROM founder_os_blogs
      WHERE status='Published' OR (status='Scheduled' AND scheduled_for<=NOW())
      ORDER BY COALESCE(published_at,scheduled_for,created_at) DESC,id DESC`);
    sections.push(...rows.map(post => link(text(post.title), `/blog/${encodeURIComponent(post.slug)}`, text(post.excerpt).slice(0, 220))));
  } catch {
    // Keep the business overview available during a temporary database outage.
  }
  sections.push('', '## Contact', 'Email: support@infronixweb.in', 'Phone: +91 63557 92936; +91 91062 91540', 'Based in Sanand, Ahmedabad, Gujarat, India.', '');
  return new Response(sections.join('\n'), { headers: {
    'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store',
  } });
}
