// Public website pricing. Edit prices here; the /pricing page reads everything from this file.
// Digital marketing (Google Ads, Meta Ads, SEO retainers) is intentionally not priced here:
// those are quoted after a discovery call.

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
