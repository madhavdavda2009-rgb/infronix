import fs from 'node:fs';
import { services, newServiceSlugs } from '../src/lib/services.js';
const read = p => fs.readFileSync(p, 'utf8');
const write = (p, s) => fs.writeFileSync(p, s);
const edit = (p, fn) => write(p, fn(read(p)));

for (const slug of newServiceSlugs) {
  fs.mkdirSync(`src/app/${slug}`, { recursive: true });
  write(`src/app/${slug}/page.jsx`, `import ServiceLanding from '@/components/ServiceLanding';
import { getService } from '@/lib/services';
import { pageMetadata } from '@/lib/site-seo';
const service = getService('${slug}');
export const metadata = pageMetadata(service.title, service.description, '/${slug}');
export default function Page() { return <ServiceLanding slug="${slug}" />; }
`);
}
for (const service of services.filter(s => !newServiceSlugs.includes(s.slug))) {
  const p = `src/app/${service.slug}/page.jsx`;
  edit(p, s => {
    s = `import ServiceDetails from '@/components/ServiceDetails';\nimport { getService } from '@/lib/services';\nimport { pageMetadata } from '@/lib/site-seo';\n` + s;
    s = s.replace(/export const metadata = \{[\s\S]*?\n\};/, `const service = getService('${service.slug}');\nexport const metadata = pageMetadata(service.title, service.description, '/${service.slug}');`);
    if (['web-development','seo','ai-automation'].includes(service.slug)) {
      s = s.replace(/import FAQSection[^\n]*\n/, '').replace(/import CTASection[^\n]*\n/, '');
      s = s.replace(/        \{\/\* Final CTA \*\/\}[\s\S]*?<FAQSection \/>/, `        <ServiceDetails slug="${service.slug}" />`);
    } else {
      s = s.replace(/      <\/main>/, `        <ServiceDetails slug="${service.slug}" />\n      </main>`);
    }
    if (service.slug === 'seo') s = s.replace('Get Found. Get Noticed. Grow Online.', service.heading);
    return s;
  });
}
edit('src/app/layout.jsx', s => {
  s = `import { pageMetadata, SITE_URL, serializeJsonLd } from '@/lib/site-seo';\n` + s;
  s = s.replace(/export const metadata = \{[\s\S]*?\n\};/, `export const metadata = {
  ...pageMetadata('Digital Marketing, Websites & AI Automation Agency in Ahmedabad', 'InfronixWeb is a digital agency in Ahmedabad helping businesses with website development, SEO, digital marketing, advertising and AI automation solutions.'),
  metadataBase: new URL(SITE_URL),
  robots: { index: true, follow: true },
  icons: { icon: '/favicon.ico', apple: '/apple-touch-icon.png' },
};`);
  const begin = s.indexOf('            __html: JSON.stringify(');
  const end = s.indexOf('\n          }}', begin);
  s = s.slice(0, begin) + `            __html: serializeJsonLd({
              '@context': 'https://schema.org',
              '@graph': [
                { '@type': 'Organization', '@id': SITE_URL + '/#organization', name: 'InfronixWeb', url: SITE_URL,
                  logo: SITE_URL + '/web-logo.webp', description: 'An Ahmedabad-based digital agency helping businesses build, grow and automate their digital presence.',
                  telephone: '+91-6355792936', email: 'support@infronixweb.in',
                  areaServed: { '@type': 'City', name: 'Ahmedabad' },
                  sameAs: ['https://www.instagram.com/infronixwebagency2026', 'https://github.com/madhavdavda2009-rgb'] },
                { '@type': 'WebSite', '@id': SITE_URL + '/#website', url: SITE_URL, name: 'InfronixWeb', publisher: { '@id': SITE_URL + '/#organization' } }
              ]
            })` + s.slice(end);
  s = s.replace('        <IntroProvider>', '        <a href="#main-content" className="skip-link">Skip to main content</a>\n        <IntroProvider>');
  return s;
});
edit('src/components/HeroSection.jsx', s => s.replace('Websites. SEO.<br />\r\n              AI Automation.<br />\r\n              <span className="text-text-light">Built to move your</span><br />', 'Build, Grow &amp;<br />\n              Automate.<br />\n              <span className="text-text-light">Your business with</span><br />').replace('business forward.', 'InfronixWeb.').replace('We build custom, fast-loading websites, help more customers find you on Google, and automate repetitive tasks to grow your business.', 'Your digital agency in Ahmedabad for websites, SEO, digital marketing and AI automation. We help businesses build their online presence, reach customers and simplify everyday work.').replace('Google Search Growth', 'SEO & Digital Marketing'));
edit('src/app/page.jsx', s => `import ServiceDirectory from '@/components/ServiceDirectory';\nimport Link from 'next/link';\n` + s.replace('        <ServicesSection />', `        <section className="py-12 sm:py-16 bg-surface" aria-label="Build, Grow and Automate services"><div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12"><ServiceDirectory compact /></div></section>
        <ServicesSection />`).replace('        <TeamSection />', `        <TeamSection />
        <section className="py-12 bg-surface-container-lowest"><div className="max-w-[1280px] mx-auto px-4 sm:px-6 md:px-12"><h2 className="text-2xl sm:text-3xl mb-4">A clearer next step for your business</h2><p className="max-w-2xl leading-relaxed mb-4">Explore our insights on websites, search visibility, marketing and automation before deciding what to invest in.</p><Link href="/blog" className="inline-flex min-h-11 items-center text-primary underline underline-offset-4">Read our insights</Link></div></section>`));
edit('src/components/ServicesSection.jsx', s => s.replace('turn visitors into real paying customers.', 'make it easier for interested visitors to enquire or buy.').replace('so potential clients find you before your competitors.', 'so relevant customers can discover your services.').replace('Save hours every week by automating routine inquiries and customer communication with smart, 24/7 instant response tools.', 'Connect supported tools to reduce repeated data entry, route enquiries and help your team follow up.').replace('high-converting advertisements that bring real inquiries.', 'advertising built around your audience, offer and enquiry journey.').replace('hover:text-ink-black', 'hover:text-white'));
edit('src/components/Footer.jsx', s => s.replace('Ahmedabad&apos;s premium digital agency. We build high-converting websites, execute technical SEO, and implement AI automation.', 'Build, grow and automate with InfronixWeb, your Ahmedabad digital agency for websites, SEO, digital marketing, advertising and business automation.').replace('<Link href="/seo"', '<Link href="/seo"'));
edit('src/components/PortfolioSection.jsx', s => s.replace('export default function PortfolioSection() {', 'export default function PortfolioSection({ asH1 = false }) {\n  const Heading = asH1 ? "h1" : "h2";').replace('<h2 ', '<Heading ').replace('</h2>', '</Heading>').replace('link: "#"', 'link: "/start-project"'));
// Route-specific metadata for existing non-service pages and client-page layouts.
for (const [route, file, title, desc] of [
  ['about','page.jsx','About Our Ahmedabad Digital Agency','Meet InfronixWeb, an Ahmedabad-based agency helping businesses with websites, SEO, digital marketing, advertising and automation.'],
  ['contact','page.jsx','Contact Our Digital Agency in Ahmedabad','Discuss websites, SEO, digital marketing, ads or automation with InfronixWeb in Ahmedabad. Tell us what your business needs.'],
  ['projects','page.jsx','Selected Website Projects','Explore selected website work from InfronixWeb and discuss a project for your business.'],
  ['blog','page.jsx','Insights on Websites, SEO, Marketing & Automation','Practical insights on websites, SEO, digital marketing and business automation for Ahmedabad businesses.'],
  ['start-project','layout.jsx','Discuss Your Project','Tell InfronixWeb about your website, marketing or automation project. Share your requirements and request a scoped proposal.'],
  ['privacy-policy','layout.jsx','Privacy Policy','How InfronixWeb handles personal information and website enquiries.'],
  ['terms-and-conditions','layout.jsx','Terms & Conditions','Read the terms that apply to the InfronixWeb website and services.'],
]) edit(`src/app/${route}/${file}`, s => `import { pageMetadata } from '@/lib/site-seo';\n` + s.replace(/export const metadata = \{[\s\S]*?\n\};/, `export const metadata = pageMetadata(${JSON.stringify(title)}, ${JSON.stringify(desc)}, '/${route}');`));
for (const route of ['admin', 'founder-os', 'verify-enquiry', 'blog/preview']) {
  fs.mkdirSync(`src/app/${route}`, { recursive: true });
  write(`src/app/${route}/layout.jsx`, `export const metadata = { title: 'Private | InfronixWeb', robots: { index: false, follow: false }, alternates: { canonical: null } };\nexport default function PrivateLayout({ children }) { return children; }\n`);
}
edit('public/robots.txt', s => s.replace('Disallow: /admin/', 'Disallow: /admin\nDisallow: /founder-os\nDisallow: /blog/preview/\nDisallow: /verify-enquiry'));
edit('src/components/Breadcrumb.jsx', s => s.replace("  'seo':", "  'services': 'Services',\n  'ai-chatbot': 'AI Chatbots',\n  'crm-automation': 'CRM Automation',\n  'whatsapp-automation': 'WhatsApp Automation',\n  'google-ads': 'Google Ads',\n  'meta-ads': 'Meta Ads',\n  'performance-marketing': 'Performance Marketing',\n  'seo':"));
edit('src/app/start-project/page.jsx', s => {
  s = s.replace("import Breadcrumb", "import { services } from '@/lib/services';\nimport Breadcrumb");
  s = s.replace("    const savedRef = localStorage.getItem", "    const requestedService = new URLSearchParams(window.location.search).get('service');\n    if (services.some(service => service.name === requestedService)) setSelectedServices([requestedService]);\n    const savedRef = localStorage.getItem");
  s = s.replace('    gsap.fromTo(".fade-up",', '    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;\n    gsap.fromTo(".fade-up",');
  s = s.replace('Let&apos;s build something that matters.', 'Let&apos;s plan your next step.');
  s = s.replace("desc: 'Google Search & Local Maps Ranking'", "desc: 'Search Visibility & Local Discovery'");
  // Preserve the existing selector; specialty links preselect and display their chosen scope.
  s = s.replace('          {/*', '          {/*');
  s = s.replace('<form ', '<form ');
  s = s.replace('          selectedServices: selectedServices.length', '          selectedServices: selectedServices.length');
  s = s.replace('      <main', '      <main');
  s = s.replace('                <label htmlFor="sp-notes"', '                <label htmlFor="sp-notes"');
  s = s.replace('            {/* Service', '            {/* Service');
  s = s.replace('            <form', '            <form');
  return s;
});
edit('src/app/api/enquiries/submit/route.js', s => s.replace('      projectDetails,', '      projectDetails,\n      websiteUrl,\n      additionalNotes,').replace("    const resolvedDescription = projectDescription || projectDetails || message || '';", "    const primaryDescription = projectDescription || projectDetails || message || '';\n    const resolvedDescription = [primaryDescription,\n      typeof websiteUrl === 'string' && websiteUrl.trim() ? `Current website: ${websiteUrl.trim().slice(0, 2000)}` : '',\n      typeof additionalNotes === 'string' && additionalNotes.trim() ? `Additional notes: ${additionalNotes.trim().slice(0, 5000)}` : '',\n    ].filter(Boolean).join('\\n\\n');").replace('    const body = await request.json();', "    let body;\n    try { body = await request.json(); } catch { return NextResponse.json({ success: false, error: 'Please send a valid form submission.' }, { status: 400 }); }\n    if (!body || typeof body !== 'object' || Array.isArray(body)) return NextResponse.json({ success: false, error: 'Please send a valid form submission.' }, { status: 400 });"));
edit('src/app/blog/[slug]/page.jsx', s => s.replace("import React from 'react';", "import React, { cache } from 'react';\nimport { serializeJsonLd } from '@/lib/site-seo';\nimport { RelatedServices } from '@/components/ServiceDetails';").replace('async function getBlogPost(slug) {', 'const getBlogPost = cache(async function getBlogPost(slug) {').replace("  return { post: null, redirected: false };\n}", "  return { post: null, redirected: false };\n});").replace("  return { post: null, redirected: false };\r\n}", "  return { post: null, redirected: false };\r\n});").replaceAll('opengraph-image.png', 'opengraph-image.webp').replace('    title: pageTitle,', '    title: { absolute: pageTitle },').replace('      title: { absolute: pageTitle },', '      title: pageTitle,').replace("      '@type': 'Person',", "      '@type': post.author_name ? 'Person' : 'Organization',").replace("      jobTitle: post.author_role || 'Digital Specialist'", "      ...(post.author_role ? { jobTitle: post.author_role } : {})").replaceAll('JSON.stringify(jsonLd)', 'serializeJsonLd(jsonLd)').replaceAll('JSON.stringify(breadcrumbJsonLd)', 'serializeJsonLd(breadcrumbJsonLd)').replace("{post.author_role || 'Digital Specialist'}", "{post.author_role || ''}").replace('        </article>', `          <aside className="py-8"><h2 className="text-xl mb-3">Put these ideas into practice</h2><RelatedServices slugs={/seo/i.test(post.category_name || '') ? ['seo', 'web-development'] : /automat|ai|crm/i.test(post.category_name || '') ? ['ai-automation', 'crm-automation'] : /google|ads/i.test(post.category_name || '') ? ['google-ads', 'performance-marketing'] : /social/i.test(post.category_name || '') ? ['digital-marketing/social-media-marketing', 'meta-ads'] : /web/i.test(post.category_name || '') ? ['web-development', 'seo'] : ['digital-marketing', 'ai-automation']} /></aside>
        </article>`));
