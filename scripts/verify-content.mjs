import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { enquiryDescription } from '../src/lib/enquiry-input.js';
import { services } from '../src/lib/services.js';
import { pageMetadata, serializeJsonLd, SITE_URL } from '../src/lib/site-seo.js';

test('both existing form payloads retain their descriptions', () => {
  assert.equal(enquiryDescription({ projectDetails: 'Consultation details' }), 'Consultation details');
  assert.equal(enquiryDescription({ projectDescription: 'A website redesign', websiteUrl: ' https://example.com ', additionalNotes: 'Keep existing URLs' }), 'A website redesign\n\nCurrent website: https://example.com\n\nAdditional notes: Keep existing URLs');
});
test('optional notes cannot bypass required project details', () => {
  for (const projectDescription of ['', 'tiny', {}, []]) assert.throws(() => enquiryDescription({ projectDescription, additionalNotes: 'Only notes' }), /brief message/);
});
test('every service has a distinct route and valid related-service destinations', () => {
  assert.equal(new Set(services.map(s => s.slug)).size, services.length);
  assert.equal(new Set(services.map(s => s.description)).size, services.length);
  for (const service of services) {
    assert.ok(fs.existsSync(`src/app/${service.slug}/page.jsx`));
    for (const related of service.related) assert.ok(services.some(s => s.slug === related));
    const metadata = pageMetadata(service.title, service.description, `/${service.slug}`);
    assert.equal(metadata.alternates.canonical, `${SITE_URL}/${service.slug}`);
    assert.equal(metadata.openGraph.url, metadata.alternates.canonical);
  }
});
test('structured data cannot close a script element', () => {
  const data = { text: '</script><script>alert(1)</script>' };
  assert.ok(!serializeJsonLd(data).includes('<'));
  assert.deepEqual(JSON.parse(serializeJsonLd(data)), data);
});
