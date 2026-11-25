// Public website pricing. Edit prices here; the /pricing page reads everything from this file.
// Monthly marketing packages (ads, social media, SEO, ChatGPT Ads) are below; the chatbot reads them too.

export const WEBSITE_PACKAGES = [
  {
    id: 'starter',
    name: 'Starter',
    price: 10000,
    priceNote: 'one-time',
    tagline: 'A clean, professional website to get your business online.',
    popular: false,
    features: [
      'Up to 5 pages (Home, About, Services, Gallery, Contact)',
      'Mobile-friendly design',
      'Contact form, WhatsApp button and Google Map',
      'Basic SEO setup (titles, meta, sitemap, Search Console)',
      '2 rounds of revisions',
      'Delivery in 7–10 working days',
    ],
  },
  {
    id: 'business',
    name: 'Business',
    price: 18000,
    priceNote: 'one-time',
    tagline: 'For growing businesses that want more pages and more enquiries.',
    popular: true,
    features: [
      'Up to 10 pages',
      'Custom design for your brand',
      'Blog section',
      'Help with content for key pages',
      'Google Business Profile setup',
      'Basic SEO setup and Google Analytics',
      '3 rounds of revisions',
      'Delivery in 2–3 weeks',
    ],
  },
  {
    id: 'premium',
    name: 'Premium / E-commerce',
    price: 35000,
    priceNote: 'starting',
    tagline: 'Online store or a fully custom website with advanced features.',
    popular: false,
    features: [
      'Fully custom design',
      'Online store with products, cart and orders',
      'Online payments (Razorpay)',
      'Booking, enquiry or lead workflows as needed',
      'Speed and SEO optimisation',
      'Training to manage your website',
      'Timeline agreed after scoping',
    ],
  },
];

// Google Ads + Meta Ads management, billed monthly. Ad spend is always extra and paid to the platform.
export const ADS_PACKAGES = [
  {
    id: 'ads-starter',
    name: 'Ads Starter',
    price: 6000,
    tagline: 'For businesses starting with paid ads on Google and Meta.',
    popular: false,
    features: [
      'Google Ads and Meta Ads (Facebook & Instagram)',
      'Up to 2 campaigns',
      'Campaign setup and audience targeting',
      'Ad copy for your campaigns',
      'Monthly performance report',
    ],
  },
  {
    id: 'ads-growth',
    name: 'Ads Growth',
    price: 10000,
    tagline: 'More campaigns and closer tracking for steady lead flow.',
    popular: true,
    features: [
      'Everything in Ads Starter',
      'Up to 5 campaigns',
      'Conversion tracking for calls, forms and WhatsApp',
      'Retargeting campaigns for past visitors',
      'Static ad creatives for Meta Ads',
      'Optimisation every two weeks',
      'Monthly report and review call',
    ],
  },
  {
    id: 'ads-pro',
    name: 'Ads Pro',
    price: 18000,
    tagline: 'For larger budgets running several products, offers or locations.',
    popular: false,
    features: [
      'Everything in Ads Growth',
      'Up to 10 campaigns',
      'Weekly optimisation and budget changes',
      'A/B testing of ads and audiences',
      'Landing page improvement suggestions',
      'Lead quality review with your sales team',
      'Priority support on WhatsApp',
    ],
  },
];

export const ADS_NOTES = [
  'Ad spend is not included. You pay Google and Meta directly from your own ad accounts.',
  'Monthly management fee. Your written proposal confirms the campaigns and deliverables before we start.',
  'Results depend on your offer, budget and competition, so no lead number is guaranteed.',
];

// Social media management (Instagram, Facebook…), billed monthly.
export const SOCIAL_PACKAGES = [
  {
    id: 'social-starter',
    name: 'Social Starter',
    price: 5000,
    tagline: 'We handle your accounts and design your posts every month.',
    popular: false,
    features: [
      'Instagram and Facebook account handling',
      '12 static post creatives per month',
      'Captions and hashtags',
      'Posting and scheduling',
      'Monthly performance report',
      'Video shooting and reel editing charged separately',
    ],
  },
  {
    id: 'social-growth',
    name: 'Social Growth',
    price: 9000,
    tagline: 'More content, reels and replies for a steadily growing page.',
    popular: true,
    features: [
      'Everything in Social Starter',
      'Up to 3 platforms, including LinkedIn',
      '20 static post creatives per month',
      '4 reels edited from your footage',
      'Monthly content calendar for approval',
      'Replies to comments and messages on working days',
    ],
  },
  {
    id: 'social-pro',
    name: 'Social Pro',
    price: 15000,
    tagline: 'For brands that post often and want a planned content strategy.',
    popular: false,
    features: [
      'Everything in Social Growth',
      '30 static post creatives per month',
      '8 reels edited from your footage',
      'Stories and highlight covers',
      'Competitor and content review every month',
      'Monthly strategy call',
    ],
  },
];

export const SOCIAL_NOTES = [
  'Paid promotion (boosting or Meta Ads) is not included; see the ads packages above.',
  'Video shoots are charged separately. Reels in Growth and Pro are edited from footage you provide.',
];

// SEO retainers, billed monthly. Indian agencies commonly charge ₹8,000–25,000/month for basic SEO,
// so the entry plan is deliberately limited to audits and monitoring.
export const SEO_PACKAGES = [
  {
    id: 'seo-basic',
    name: 'SEO Basic',
    price: 2000,
    tagline: 'Know what is holding your website back, every month.',
    popular: false,
    features: [
      'Monthly technical SEO audit',
      'Google Search Console setup and monitoring',
      'Speed, mobile and indexing checks',
      'Broken link and error report',
      'Tracking for up to 5 keywords',
      'Monthly report with a prioritised fix list',
    ],
  },
  {
    id: 'seo-growth',
    name: 'SEO Growth',
    price: 6000,
    tagline: 'Audits plus hands-on work to grow local visibility.',
    popular: true,
    features: [
      'Everything in SEO Basic',
      'Tracking for up to 15 keywords',
      'On-page optimisation of up to 5 pages per month',
      'Google Business Profile optimisation and posts',
      'Local citations and business listings',
      '2 SEO blog articles per month',
    ],
  },
  {
    id: 'seo-pro',
    name: 'SEO Pro',
    price: 12000,
    tagline: 'For businesses competing for a wider set of searches.',
    popular: false,
    features: [
      'Everything in SEO Growth',
      'Tracking for up to 30 keywords',
      'On-page optimisation of up to 10 pages per month',
      '4 SEO blog articles per month',
      'Quality backlink building every month',
      'Competitor analysis and monthly review call',
    ],
  },
];

export const SEO_NOTES = [
  'SEO takes time. Most websites need several months of steady work before rankings move.',
  'Rankings cannot be guaranteed. We report on clicks, calls and enquiries as well as positions.',
];

// ChatGPT Ads: setup only.
export const CHATGPT_PACKAGES = [
  {
    id: 'chatgpt-setup',
    name: 'ChatGPT Ads Setup',
    price: 2000,
    tagline: 'We set up your ChatGPT Ads account and campaign, ready to run.',
    popular: false,
    features: [
      'Ad account setup',
      'Campaign and targeting setup',
      'Ad copy for your offer',
      'Conversion tracking setup',
    ],
  },
];

export const CHATGPT_NOTES = [
  'Setup only. Ongoing optimisation and reporting are not included.',
  'Ad spend is extra and paid directly to the platform.',
];

// Monthly marketing plans shown on /pricing (tabs, in this order) and on each service page.
// `label` names the tab; `answer` is the quotable one-line price summary used on service pages and in schema.
export const MARKETING_PRICING = [
  { id: 'ads', label: 'Google & Meta Ads', answer: 'Google Ads and Meta Ads management at InfronixWeb starts at ₹6,000 per month for up to 2 campaigns, with ad spend paid separately to Google and Meta.', eyebrow: 'Ads Management', title: 'Google & Meta Ads from', intro: 'One monthly fee to plan, run and report on your campaigns. Your ad budget stays in your own accounts.', suffix: '+ ad spend', service: 'performance-marketing', packages: ADS_PACKAGES, notes: ADS_NOTES },
  { id: 'social', label: 'Social Media', answer: 'Social media management at InfronixWeb starts at ₹5,000 per month, covering Instagram and Facebook account handling and 12 designed posts; video and reel editing are charged separately.', eyebrow: 'Social Media Management', title: 'Social media handling from', intro: 'We manage your accounts and create the posts, so your pages stay active and on-brand every month.', suffix: '', service: 'digital-marketing/social-media-marketing', packages: SOCIAL_PACKAGES, notes: SOCIAL_NOTES },
  { id: 'seo', label: 'SEO', answer: 'SEO plans at InfronixWeb start at ₹2,000 per month with a monthly technical audit, Search Console monitoring and a prioritised fix list; hands-on SEO plans start at ₹6,000 per month.', eyebrow: 'SEO', title: 'SEO plans from', intro: 'Start with monthly audits and grow into hands-on SEO as your business is ready.', suffix: '', service: 'seo', packages: SEO_PACKAGES, notes: SEO_NOTES },
  { id: 'chatgpt', label: 'ChatGPT Ads', answer: 'ChatGPT Ads setup at InfronixWeb costs ₹2,000 per month and covers account, campaign, targeting and tracking setup; ad spend is paid separately to the platform.', eyebrow: 'ChatGPT Ads', title: 'ChatGPT Ads setup at', intro: 'Get your business set up on ChatGPT Ads with a campaign ready to go.', suffix: '+ ad spend', service: 'chatgpt-ads', packages: CHATGPT_PACKAGES, notes: CHATGPT_NOTES },
];

export const getMarketingGroup = (id) => MARKETING_PRICING.find(group => group.id === id);

// Which price plans appear near the top of each service page.
export const SERVICE_PRICING = {
  'google-ads': ['ads'],
  'meta-ads': ['ads'],
  'performance-marketing': ['ads'],
  'digital-marketing/paid-advertising': ['ads'],
  'chatgpt-ads': ['chatgpt'],
  seo: ['seo'],
  'seo/local-seo-services-ahmedabad': ['seo'],
  'digital-marketing/social-media-marketing': ['social'],
  'digital-marketing': ['social', 'ads', 'seo', 'chatgpt'],
};

export const PRICING_ADDONS = [
  { name: 'Extra page (simple)', price: '₹1,000 / page' },
  { name: 'Extra page (complex: product listing, filters)', price: '₹2,000–3,000 / page' },
  { name: 'Blog setup', price: '₹2,000' },
  { name: 'Online booking / appointments', price: '₹3,000–5,000' },
  { name: 'Payment gateway (Razorpay)', price: '₹3,000–5,000' },
  { name: 'Content writing', price: '₹500–800 / page' },
  { name: 'Logo design', price: '₹2,000–5,000' },
  { name: 'Extra revision round', price: '₹1,000' },
  { name: 'Urgent delivery (about half the time)', price: '+25%' },
  { name: 'Domain + hosting (1 year)', price: 'Actual cost + setup' },
  { name: 'Website maintenance (updates, backups, fixes)', price: '₹1,000–2,000 / month' },
];

export const PRICING_NOT_INCLUDED = [
  'Domain and hosting charges',
  'Content writing (unless included in your package)',
  'Logo and brand design',
  'Paid plugins, stock photos or third-party subscriptions',
];

export const PAYMENT_TERMS = [
  { label: '50%', text: 'Advance to start the project' },
  { label: '30%', text: 'After you approve the design' },
  { label: '20%', text: 'Before the website goes live' },
];

export function formatInr(amount) {
  return `₹${Number(amount).toLocaleString('en-IN')}`;
}

// Quote form: pages included per package and the add-ons a visitor can pick.
// Estimates use the lowest listed price; the written quote is always final.
export const PACKAGE_PAGES = { starter: 5, business: 10, premium: null };

export const QUOTE_ADDONS = [
  { id: 'blog', label: 'Blog section', note: '₹2,000', kind: 'fixed', amount: 2000 },
  { id: 'booking', label: 'Online booking / appointments', note: 'from ₹3,000', kind: 'fixed', amount: 3000 },
  { id: 'payments', label: 'Online payments (Razorpay)', note: 'from ₹3,000', kind: 'fixed', amount: 3000 },
  { id: 'content', label: 'Content writing for my pages', note: 'from ₹500 / page', kind: 'perPage', amount: 500 },
  { id: 'logo', label: 'Logo design', note: 'from ₹2,000', kind: 'fixed', amount: 2000 },
  { id: 'hosting', label: 'Domain + hosting', note: 'actual cost + setup', kind: 'actual', amount: 0 },
  { id: 'maintenance', label: 'Monthly maintenance', note: 'from ₹1,000 / month', kind: 'monthly', amount: 1000 },
  { id: 'urgent', label: 'Urgent delivery', note: '+25%', kind: 'percent', amount: 25 },
];

export const EXTRA_PAGE_PRICE = 1000;

/** Rough starting estimate for a website package with add-ons; null when it can't be estimated. */
export function estimateWebsiteQuote({ packageId, addons = [], extraPages = 0 }) {
  const pkg = WEBSITE_PACKAGES.find(p => p.id === packageId);
  if (!pkg) return null;
  const pages = (PACKAGE_PAGES[packageId] || 0) + extraPages;
  let oneTime = pkg.price + extraPages * EXTRA_PAGE_PRICE;
  let monthly = 0;
  for (const id of addons) {
    const addon = QUOTE_ADDONS.find(a => a.id === id);
    if (!addon) continue;
    if (addon.kind === 'fixed') oneTime += addon.amount;
    if (addon.kind === 'perPage' && pages) oneTime += addon.amount * pages;
    if (addon.kind === 'monthly') monthly += addon.amount;
  }
  if (addons.includes('urgent')) oneTime = Math.round(oneTime * 1.25);
  return { oneTime, monthly, isStarting: pkg.priceNote === 'starting' || addons.some(id => ['booking', 'payments', 'logo', 'content', 'maintenance'].includes(id)) };
}
