import fs from 'node:fs';
import { services } from '../src/lib/services.js';
const base = process.env.QA_BASE_URL || 'http://localhost:3000';
const routes = ['/', '/services', ...services.map(s => '/' + s.slug), '/about', '/contact', '/projects', '/blog', '/start-project', '/privacy-policy', '/terms-and-conditions'];
const results = [], links = new Set();
for (const path of routes) {
  const response = await fetch(base + path);
  const html = await response.text();
  const title = html.match(/<title>(.*?)<\/title>/s)?.[1];
  const canonicals = [...html.matchAll(/<link[^>]+rel="canonical"[^>]+href="([^"]+)"/g)].map(m => m[1]);
  const h1 = (html.match(/<h1(?:\s|>)/g) || []).length;
  for (const match of html.matchAll(/href="(\/[^"?#]*)(?:[?#][^"]*)?"/g)) if (!match[1].startsWith('/_next') && !/\.[a-z0-9]+$/i.test(match[1])) links.add(match[1]);
  const scripts = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  let schemaValid = true;
  for (const [, json] of scripts) { try { JSON.parse(json); } catch { schemaValid = false; } }
  results.push({ path, status: response.status, title, h1, canonical: canonicals, schemaValid, pass: response.ok && !!title && h1 === 1 && canonicals.length === 1 && schemaValid });
}
const broken = [];
for (const path of links) {
  const response = await fetch(base + path);
  if (response.status >= 400) broken.push({ path, status: response.status });
}
const invalidForms = [];
for (const body of ['{', 'null', '{}', '{"additionalNotes":"No project description"}']) {
  const response = await fetch(base + '/api/enquiries/submit', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body });
  invalidForms.push({ status: response.status, pass: response.status === 400 });
}
const sitemapResponse = await fetch(base + '/sitemap.xml');
const sitemap = await sitemapResponse.text();
const sitemapMissing = routes.filter(path => !sitemap.includes('https://www.infronixweb.in' + (path === '/' ? '</loc>' : path + '</loc>')));
const unknown = await fetch(base + '/not-a-real-route-refurbishment-check');
const privateResponse = await fetch(base + '/admin/login');
const privateHtml = await privateResponse.text();
const publicBlog = await fetch(base + '/api/public/blogs').then(r => r.json());
const report = { pages: results, brokenLinks: broken, invalidForms, sitemapStatus: sitemapResponse.status, sitemapMissing, unknownStatus: unknown.status, adminNoindex: /name="robots"[^>]+content="[^"]*noindex/.test(privateHtml), blog: { success: publicBlog.success, publishedCount: publicBlog.posts?.length, categories: publicBlog.categories?.map(c => c.name), sampleSlug: publicBlog.posts?.[0]?.slug } };
fs.writeFileSync('docs/route-verification.json', JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
if (results.some(r => !r.pass) || broken.length || invalidForms.some(r => !r.pass) || sitemapMissing.length || unknown.status !== 404) process.exitCode = 1;
