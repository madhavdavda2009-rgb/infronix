import fs from 'node:fs';
const edit = (p, fn) => fs.writeFileSync(p, fn(fs.readFileSync(p, 'utf8')));
fs.writeFileSync('src/lib/sitemap_generator.js', `import { query } from './founder_os_db.js';
import { services } from './services.js';
import { SITE_URL } from './site-seo.js';
export const STATIC_PAGES = ['', '/services', ...services.map(service => '/' + service.slug), '/projects', '/about', '/contact', '/blog', '/start-project', '/privacy-policy', '/terms-and-conditions'];
export async function getDynamicSitemapEntries() {
  const staticEntries = STATIC_PAGES.map(path => ({ url: SITE_URL + path }));
  try {
    const res = await query(\`SELECT slug, COALESCE(updated_at, published_at, scheduled_for) AS last_modified
      FROM founder_os_blogs WHERE status = 'Published' OR (status = 'Scheduled' AND scheduled_for <= NOW())\`);
    return [...staticEntries, ...res.rows.map(post => ({ url: SITE_URL + '/blog/' + encodeURIComponent(post.slug),
      ...(post.last_modified ? { lastModified: new Date(post.last_modified) } : {}) }))];
  } catch (error) {
    console.error('Sitemap article lookup failed:', error.message);
    return staticEntries;
  }
}
`);
// These three exact callers already revalidate the dynamic sitemap.
for (const p of ['src/app/api/founder-os/blogs/route.js', 'src/app/api/founder-os/blogs/[id]/route.js']) edit(p, s => s.replace(/import \{ syncPublicSitemapXml \}[^\n]*\n/, '').replaceAll('await syncPublicSitemapXml();', "revalidatePath('/sitemap.xml');"));
fs.unlinkSync('public/sitemap.xml');
edit('src/app/layout.jsx', s => `import MotionPreferences from '@/components/MotionPreferences';\n` + s.replace('<IntroProvider>', '<MotionPreferences><IntroProvider>').replace('</IntroProvider>', '</IntroProvider></MotionPreferences>'));
edit('src/context/IntroContext.jsx', s => s.replace('useState("loading")', 'useState("completed")').replace('    // If not on homepage, complete immediately', '    // Keep essential content available immediately. Offer the existing intro only when explicitly requested.').replace('    if (!isHome) {', '    if (!isHome || window.matchMedia("(prefers-reduced-motion: reduce)").matches || new URLSearchParams(window.location.search).get("intro") !== "1") {'));
edit('src/components/AboutSection.jsx', s => s.replace('export default function AboutSection() {', 'export default function AboutSection({ asH1 = false }) {\n  const Heading = asH1 ? "h1" : "h2";').replace('<h2 ', '<Heading ').replace('</h2>', '</Heading>').replace('Most agencies do one thing well. You hire them for a website, then need another for SEO, and a completely different consultant for automation.', 'Your website, marketing and customer workflows need to work together. InfronixWeb brings web development, SEO, digital marketing and automation into one coordinated plan.'));
edit('src/components/ServicesSection.jsx', s => s.replace('                onClick={() => setActiveService(index)}', '                onClick={() => setActiveService(index)}\n                onFocus={() => setActiveService(index)}').replace('{service.title}\n                    </h3>', '<button type="button" aria-expanded={activeService === index} onClick={() => setActiveService(index)} className="text-left">{service.title}</button>\n                    </h3>'));
edit('src/app/start-project/page.jsx', s => s.replace("id: 'SEO Optimization', label: 'SEO Optimization'", "id: 'SEO', label: 'SEO'").replace("              ].map((svc) => {", "                ...services.filter(service => !['Website Development', 'SEO', 'Digital Marketing', 'AI Automation', 'Paid Advertising'].includes(service.name)).map(service => ({ id: service.name, label: service.name, desc: service.pillar, icon: service.pillar === 'Automate' ? Robot : Megaphone })),\n              ].map((svc) => {").replace('                    onClick={() => toggleService(svc.id)}', '                    onClick={() => toggleService(svc.id)}\n                    aria-pressed={isSelected}'));
edit('src/components/FAQSection.jsx', s => {
  const start = s.indexOf('const FAQS = [');
  const end = s.indexOf('\n];', start);
  const faqs = [
    { question: 'What can InfronixWeb help our business with?', answer: 'We help businesses build their online presence through websites, grow through SEO, content and advertising, and automate repeated tasks such as lead capture and follow-ups.' },
    { question: 'Can we start with just one service?', answer: 'Yes. We can scope a website, an SEO audit, a campaign or one automation workflow around your immediate priority.' },
    { question: 'Do you work with businesses in Ahmedabad?', answer: 'InfronixWeb is based in Ahmedabad, Gujarat. Share your audience, service area and requirements so we can plan work around your business.' },
    { question: 'How are costs and timelines decided?', answer: 'We review the deliverables, content, integrations and access required before preparing a proposal. Advertising spend and third-party software costs are identified separately.' },
    { question: 'Do you guarantee rankings or advertising results?', answer: 'No. We agree useful measures and review progress, but competition, customer demand, budget and follow-up affect results.' },
    { question: 'Can you connect our existing software?', answer: 'We check API availability, permissions, data quality and platform limits before confirming an automation scope. Important exceptions need a clear human handoff.' },
  ];
  return s.slice(0,start) + 'const FAQS = ' + JSON.stringify(faqs,null,2) + ';' + s.slice(end+3).replace('Web Development &amp; SEO FAQs', 'Working with InfronixWeb').replace('for your website, SEO, and AI automation needs.', 'for your website, marketing and automation needs.');
});
edit('src/components/Header.jsx', s => {
  s = s.replace("useState, useEffect", "useState, useEffect, useRef");
  s = s.replace('  const [menuOpen', '  const drawerRef = useRef(null);\n  const menuButtonRef = useRef(null);\n  const [menuOpen');
  const marker = '  // Prevent body scroll when menu open';
  s = s.replace(marker, `  useEffect(() => {
    if (!menuOpen) return;
    const previousFocus = document.activeElement;
    const drawer = drawerRef.current;
    const controls = () => [...drawer.querySelectorAll('a[href], button:not([disabled])')].filter(el => el.getClientRects().length);
    controls()[0]?.focus();
    const handleKey = event => {
      if (event.key === 'Escape') { setMenuOpen(false); return; }
      if (event.key !== 'Tab') return;
      const items = controls();
      const first = items[0], last = items.at(-1);
      if (event.shiftKey && (document.activeElement === first || !drawer.contains(document.activeElement))) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && (document.activeElement === last || !drawer.contains(document.activeElement))) { event.preventDefault(); first?.focus(); }
    };
    document.addEventListener('keydown', handleKey);
    return () => { document.removeEventListener('keydown', handleKey); previousFocus?.focus(); };
  }, [menuOpen]);

` + marker);
  s = s.replace('                aria-expanded={menuOpen}', '                ref={menuButtonRef}\n                aria-controls="navigation-drawer"\n                aria-expanded={menuOpen}');
  s = s.replace('            initial={{ x: "100%" }}', '            ref={drawerRef}\n            id="navigation-drawer"\n            role="dialog"\n            aria-modal="true"\n            aria-label="Navigation"\n            initial={{ x: "100%" }}');
  s = s.replace('              {/* Services Header / Accordion */}', '              <Link href="/services" onClick={() => setMenuOpen(false)} className="py-3 px-3 text-slate-200 hover:text-white">All services: Build, Grow &amp; Automate</Link>\n              {/* Services Header / Accordion */}');
  s = s.replace('                  onClick={() => setServicesOpen(!servicesOpen)}', '                  onClick={() => setServicesOpen(!servicesOpen)}\n                  aria-expanded={servicesOpen}');
  return s;
});
edit('src/app/globals.css', s => s + `
/* Public interaction quality: preserve the established palette and spacing. */
:where(a, button, input, select, textarea, summary):focus-visible { outline: 3px solid #8b5cf6; outline-offset: 4px; }
.skip-link { position: fixed; top: 8px; left: 8px; z-index: 1000; padding: 12px 20px; background: #fff; color: #0b0d12; transform: translateY(-160%); }
.skip-link:focus { transform: translateY(0); }
main { scroll-margin-top: 120px; }
@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto !important; }
  *, *::before, *::after { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition-duration: 0.01ms !important; }
}
`);
// Sole legacy SEO consumer is private admin. Server metadata now owns this route.
edit('src/app/admin/page.jsx', s => s.replace(/import SEO[^\n]*\n/, '').replace(/      <SEO[\s\S]*?\/>\s*/, ''));
fs.unlinkSync('src/components/SEO.jsx');
