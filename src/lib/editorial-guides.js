import { calculateReadingTime } from './blog_utils.js';
import { madhavBlogProfile } from './blog-authors.js';

// Repository-authored guides share the existing blog renderer and URL family.
// CMS posts take precedence if an editor later publishes the same slug.
const entries = [
  {
    slug: 'ai-seo-generative-search',
    cover_image_alt: 'Glass lens over connected content tiles on a light desk, illustrating AI search discovery',
    title: 'AI SEO & Generative Search: A Guide for Ahmedabad Businesses',
    excerpt: 'Understand AI search, useful content and technical accessibility, and decide what to improve without promises of guaranteed AI citations.',
    category_name: 'Local SEO', category_slug: 'local-seo',
    content_markdown: `## What is AI SEO?

AI SEO can mean using AI tools to assist SEO work, or improving content for search experiences that generate answers. These are different activities. A tool may help group queries or draft an outline, but a person still needs to verify the facts, intent and final content.

For a business in Ahmedabad, begin with the questions a potential customer asks: what you do, where you work, what the service includes and how to contact you. Answer them on accessible pages before experimenting with a new label for search optimization.

## Traditional SEO and generative search

Traditional search often presents links for a visitor to compare. Generative search can synthesize information and include supporting links. In both cases, public pages need to be discoverable and useful. Inclusion or citation is a platform decision; no agency can guarantee visibility in ChatGPT, Gemini or Google AI answers.

[Google's guidance on AI features](https://developers.google.com/search/docs/appearance/ai-features) says established SEO practices remain relevant and no special optimization is required for AI Overviews or AI Mode. That guidance concerns Google; other systems have their own access and selection behaviour.

## Make content easy to understand

Use descriptive headings, direct answers and examples with enough context to be useful. Explain terms before using them. A page about a service should state the deliverables, constraints and next step, rather than repeat a list of related phrases.

Consistent names help identify entities such as your business, services and locations. Keep the organization name and contact details accurate across your website and genuine profiles. Schema can describe visible information, but it does not create authority or replace the content.

## Content optimization with human review

AI can assist with an outline or identify unanswered questions. Check every generated statement against real business information or an appropriate primary source. Remove invented results, outdated advice and examples presented as client achievements. Do not publish many near-identical pages just because a tool makes them easy to generate.

An FAQ format helps when visitors actually have those questions. It is not a requirement to rewrite every page as questions and answers. Build topical depth by connecting distinct guides to the service they support, rather than repeating the same material across articles.

## Technical accessibility still matters

Check that key content appears in rendered HTML, important pages return successful responses, internal links are crawlable and canonicals point to the intended URL. Review robots directives and indexing restrictions deliberately. A fast mobile page with stable layouts benefits visitors regardless of the search interface.

Use the [technical SEO guide](/blog/technical-seo) to check crawling, indexing and page performance before adding more content.

## Brand mentions and citations

Accurate profiles, useful original resources and legitimate industry relationships can help people discover a business. A mention or backlink is not a guaranteed AI citation. Avoid buying spam mentions or creating fake reviews to manufacture authority.

## How to measure progress

Track relevant landing pages, non-branded search clicks and qualified enquiries. Record the date, query and interface when observing an AI answer; one screenshot is not a stable ranking. Separate measured website traffic from anecdotal citations, and do not label every organic visit as an AI referral.

## A practical starting plan

- Review the existing pages and Search Console queries before choosing new topics.
- Correct access, indexing and content gaps on the pages that already matter.
- Publish only guides that answer a distinct customer question and connect them to relevant services.
- Review enquiries and useful organic traffic over time without guaranteeing a result.

For help applying these foundations, explore [InfronixWeb's SEO services](/seo). If the need is an internal workflow rather than search visibility, see [AI automation](/ai-automation).`,
  },
  {
    slug: 'google-ads-management-guide',
    cover_image_alt: 'Laptop, magnifying glass and campaign planning cards on a desk',
    title: 'Google Ads Management: A Planning Guide for Ahmedabad Businesses',
    excerpt: 'Plan a search campaign, separate media spend from management fees, check conversion tracking and evaluate the quality of enquiries.',
    category_name: 'Digital Marketing', category_slug: 'digital-marketing',
    content_markdown: `## Start with the business decision

Before launching Google Ads, choose the service or product you want to promote, the customer it suits and the area you can serve. A local business should not buy traffic from places it cannot support. Check that somebody can respond to enquiries and that the destination page explains the offer.

Google AdWords is the former name of Google Ads. When reviewing an older account, keep the existing history and access arrangements instead of assuming a new account is required.

## What should campaign management include?

A useful proposal explains who handles keyword research, campaign structure, ad copy, negative keywords, conversion tracking, reporting and optimization. Ask whether landing-page changes are included or require a separate development scope.

Search Ads reach people expressing demand through a query. Display or remarketing may support a different objective, but should be considered against audience availability, consent and platform rules. Adding more formats is not automatically a better plan.

## How should you choose a test budget?

There is no single starting budget for every Ahmedabad business. Consider likely click costs, available search demand, the value of a suitable enquiry and the time needed to gather useful data. Agree a spend limit and review milestones before launch.

Separate the advertising budget paid to the platform from management fees, creative work, landing-page development and software costs. A proposal should state ownership and billing arrangements clearly.

## Check conversion tracking before bidding decisions

Define the outcome you want to measure: a completed enquiry, booked appointment or purchase. Test the whole journey and avoid counting the same event twice. A click on a phone or WhatsApp button signals interest; it does not prove that a conversation or sale took place.

When reliable sales feedback is available, review qualified leads and customer outcomes alongside the platform's conversion count. Keep consent and data access requirements in scope.

## Evaluate an existing account

Review location targeting, search terms, excluded keywords, ad relevance, budgets and destination pages. Check which conversions are used for optimization and whether old events still represent the current business. Record the reason for material changes so future reviews can distinguish a test from a tracking problem.

## What should an ongoing report explain?

- Spend and the agreed budget limit.
- Search terms and the reasons for exclusions or new tests.
- Conversion counts, cost per enquiry and any tracking limitations.
- Lead quality and sales feedback where the business can supply it.
- Actions proposed for the next review period.

Clicks and impressions alone do not establish profitability. A low cost per lead may still be poor value if enquiries are unsuitable. Optimization depends on sufficient reliable data; nobody can promise a fixed date for profitable performance.

## Prepare the landing page and follow-up

Keep the ad message and destination page consistent. Explain the service, give a clear next step and test the mobile form. Agree who owns each incoming lead and how quickly the team aims to respond. [CRM automation](/crm-automation) can support routing and reminders when the integrations are feasible.

If you need help with an audit or campaign scope, review [Google Ads management at InfronixWeb](/google-ads). For the broader channel plan, see [digital marketing services](/digital-marketing).`,
  },
  {
    slug: 'seo-packages-guide',
    cover_image_alt: 'SEO proposal folders with magnifying-glass details on a light desk',
    title: 'SEO Packages: What Ahmedabad Businesses Should Look For',
    excerpt: 'Compare SEO proposals by scope, access, deliverables and reporting rather than keyword counts or promises of first-place rankings.',
    category_name: 'Local SEO', category_slug: 'local-seo',
    content_markdown: `## Compare the work, not just the package name

Two SEO packages can share a name while covering different work. Before comparing prices, establish whether you need a diagnosis, implementation, content support or ongoing monitoring. A site with indexing problems needs a different first step from a healthy site missing useful service information.

InfronixWeb scopes engagements after reviewing the site and requirements. This guide does not publish a fixed price list or promise that every deliverable belongs in every proposal.

## What can an audit engagement include?

An audit should identify the pages reviewed, the evidence behind each issue, its likely impact and the proposed fix. Ask who implements the recommendations. A report alone will not correct a broken redirect or improve a form.

The [technical SEO guide](/blog/technical-seo) explains checks for crawling, indexing, mobile layouts and performance. Search Console access helps distinguish a genuine search issue from a generic tool warning.

## What does ongoing support mean?

An ongoing engagement can review Search Console, improve existing pages, maintain technical health and plan a small number of useful articles. The proposal should state review frequency, implementation capacity, content responsibilities and how work is prioritized.

For a local business, check whether Google Business Profile review and consistent business information are in scope. Only real eligible locations should be represented. Reviews must come from genuine customers, not a package supplier.

## Questions to ask before agreeing a proposal

- Which pages and problems will be addressed first, and why?
- Who supplies business facts, approvals and images?
- Does the fee include implementation, or only advice?
- Which access permissions are needed, and who retains account ownership?
- How are migrations, new pages and redirects approved and checked?
- What reporting connects relevant traffic with qualified enquiries?
- What happens when a platform changes or a technical problem appears?

## Avoid misleading comparisons

A keyword count or fixed number of monthly articles does not establish value. The same search intent may appear in many query variations, while one useful page can answer several related questions. Do not pay for dozens of thin city pages, fake reviews or links created solely to manipulate rankings.

A promise of first-place rankings ignores competition and search-system changes. Ask for an evidence-based plan and review milestones instead. Organic visibility can take sustained work; an agency should explain uncertainty rather than hide it.

## Agree how progress will be measured

Use relevant landing pages, non-branded clicks and qualified enquiries. Average position and impressions provide context but do not prove a lead increase. Keep a record of changes and compare appropriate periods, allowing for seasonality and differences in query mix.

## Choose the next step

An audit and implementation plan suits an unclear problem. Ongoing support suits a site that needs regular improvements and review. A defined technical or content project suits a specific migration, indexing issue or topic gap.

See [SEO engagement options at InfronixWeb](/seo), then [request a scoped proposal](/start-project?service=seo) with your website, goals and current concerns.`,
  },
];

export const editorialGuides = entries.map(entry => ({
  ...entry, id: `guide-${entry.slug}`, author_name: 'Madhav Davda', author_type: 'Person',
  author_role: 'Founder & Lead Engineer',
  ...madhavBlogProfile,
  cover_image_url: `/blog-images/${entry.slug}.webp`,
  published_at: '2026-10-04T00:00:00+05:30', updated_at: '2026-10-04T00:00:00+05:30',
  reading_time_minutes: calculateReadingTime(entry.content_markdown), tags: [], featured: false,
}));
export function getEditorialGuide(slug) { return editorialGuides.find(p => p.slug === slug); }
