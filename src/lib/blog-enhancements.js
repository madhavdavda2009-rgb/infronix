import { publicRole } from './public-copy.js';
import { calculateReadingTime } from './blog_utils.js';

const websiteHealthGuide = `## Help Google find your useful pages

Start with the pages customers need: your services, products, contact information and useful advice. In Google Search Console, check which of these pages appear in search. If an important page is missing, investigate why before adding more content.

Some pages do not need a separate search listing. Filtered product views, duplicate pages and different versions of the same enquiry form may be better kept together. The goal is to make the right page easy to find.

## Keep page addresses and links clear

Give each important page one main address. If you move or rename a page, make sure its old link sends visitors to the new location. Check links in your menu, service pages and articles so customers do not reach a dead end.

For a redesign, record the useful existing pages before making changes. A new design should preserve helpful content and keep established links working wherever possible.

## Check the experience on a phone

Open your website on a small screen. Can you read the text, use the menu and complete an enquiry without zooming or sideways scrolling? Check that buttons are easy to tap and that images do not hide important information.

Watch for content that jumps as the page loads. A steady layout helps visitors read and use the page comfortably.

## Find what makes pages slow

Large images, extra effects and tools loaded in the background can delay a page. Test important pages more than once on a phone and investigate the causes of slow loading.

A single speed test is only a snapshot. Reports based on real visitor experiences build up over time. Use both to understand the problem; do not treat one good test as proof that every visitor has a fast experience.

## Keep business information accurate

Your service descriptions, contact details and business profiles should agree. Any extra information provided for Google should describe the real business and content visible on the page. Avoid invented ratings, locations or claims.

## Agree a practical improvement plan

Ask for a review that explains which pages were checked, what the problem is, how it affects people and who will fix it. Start with issues that block important pages or prevent customers from getting in touch.

After a change, check the page again and review Search Console over time. Better website health supports visitors and search discovery, but nobody can guarantee a ranking.

Explore [InfronixWeb's SEO services](/seo), or read the [AI search guide](/blog/ai-seo-generative-search) for advice on making your content useful across search experiences.`;

export const blogEnhancements = {
  'web-development-in-ahmedabad': {
    originalTitle: 'Web Development in Ahmedabad: A Complete Guide For Businesses in 2026',
    title: 'Planning a Business Website in Ahmedabad: A Practical Guide',
    excerpt: 'Prepare a website brief, compare development proposals and plan content, mobile usability, launch checks and maintenance.',
    service: 'web-development', serviceLabel: 'Explore our website development services',
    content: `## Prepare a brief before comparing developers

List the customers the website needs to serve, the questions they ask and the actions they should be able to complete. Inventory existing URLs, content and assets so a redesign preserves useful material. State whether you need a brochure site, ecommerce features or a custom business application.

## Compare deliverables and responsibilities

Ask who supplies copy and images, who owns hosting and accounts, which integrations are included and how future updates are handled. A proposal should explain mobile testing, accessibility, forms, search metadata and redirects. Price comparisons are meaningful only when the scope is comparable.

## Define the launch checks

Test a real visitor journey from a service page to an enquiry. Check mobile navigation, required fields, success messages, important redirects and the sitemap. Establish a maintenance owner and a way to report issues after launch.

For implementation rather than planning advice, see [website development at InfronixWeb](/web-development).`,
  },
  'technical-seo': {
    originalTitle: 'Technical SEO: A Complete Guide to Improve Your Website Performance in 2026',
    title: 'Website Health Checklist for Ahmedabad Businesses',
    excerpt: 'Check that Google can find your important pages, links work correctly and customers can use your website comfortably on a phone.',
    replacementMarkdown: websiteHealthGuide,
    service: 'seo', serviceLabel: 'Discuss a website health review',
  },
  'seo-company-in-ahmedabad': {
    originalTitle: 'SEO Company in Ahmedabad: SEO Guide for Businesses in 2026',
    title: 'Local SEO Planning for Ahmedabad Businesses',
    excerpt: 'Understand local search, review genuine business information and choose a useful SEO scope for your business.',
    service: 'seo', serviceLabel: 'Explore SEO services and engagement options',
    content: `## A practical local SEO review

Check the business name, address, phone number, services and hours against real operating information. Review the categories and details of an eligible Google Business Profile with owner access. Keep location information accurate across the website and genuine profiles; a service area does not justify a fake office.

## Connect local questions to useful pages

Service pages should explain what the business actually does and how a customer can enquire. Articles should answer research questions and link to the relevant service. Avoid a separate nearly identical page for every neighbourhood or every spelling of a search phrase.

## Evaluate the proposed work

Ask how website fixes, content improvements and reporting will be prioritized. Compare scope and responsibilities before price. Read [what to look for in SEO packages](/blog/seo-packages-guide), then explore [InfronixWeb's SEO services](/seo).`,
  },
};

export function enhanceBlogPost(post) {
  post = { ...post, author_role: publicRole(post.author_role) };
  const enhancement = blogEnhancements[post.slug];
  // Preserve future CMS title edits and any explicit SEO overrides.
  if (!enhancement || post.title !== enhancement.originalTitle) return post;
  return { ...post, title: enhancement.title, excerpt: enhancement.excerpt || post.excerpt,
    ...(enhancement.replacementMarkdown ? { content_markdown: enhancement.replacementMarkdown,
      reading_time_minutes: calculateReadingTime(enhancement.replacementMarkdown) } : {}),
    editorial_enhancement: true,
    seo_title: post.seo_title || `${enhancement.title} | InfronixWeb Insights`, seo_description: post.seo_description || enhancement.excerpt || post.excerpt };
}
