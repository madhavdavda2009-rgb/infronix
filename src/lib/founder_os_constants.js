// System Template & Workflow Constants (Client & Server Safe)

export const PROJECT_TYPES = [
  'Business Website',
  'E-commerce',
  'Landing Page',
  'Portfolio',
  'Web Application',
  'Website Redesign',
  'Maintenance',
  'SEO',
  'Custom'
];

export const PAYMENT_METHODS = [
  'UPI',
  'Bank Transfer',
  'Cash',
  'Card',
  'Other'
];

export const COST_TYPES = [
  'Freelancer',
  'Designer',
  'Developer',
  'Hosting',
  'Domain',
  'Software',
  'Assets',
  'Marketing',
  'Other'
];

export const DEFAULT_STAGE_TEMPLATES = [
  'Requirements',
  'Content Collection',
  'Design',
  'Development',
  'Internal Review',
  'Client Review',
  'Revisions',
  'QA',
  'Deployment',
  'Handover'
];

export const DEFAULT_STAGE_TASKS = {
  'Requirements': [
    { title: 'Gather project brief & scope documentation', priority: 'High' },
    { title: 'Review competitor websites & design inspiration', priority: 'Medium' }
  ],
  'Content Collection': [
    { title: 'Collect client brand assets, logos & typography', priority: 'High' },
    { title: 'Collect page copy, images & product catalogs', priority: 'Medium' }
  ],
  'Design': [
    { title: 'Create Figma wireframes & layout concepts', priority: 'High' },
    { title: 'Design high-fidelity desktop & mobile UI mockups', priority: 'High' },
    { title: 'Get client sign-off on visual design system', priority: 'Urgent' }
  ],
  'Development': [
    { title: 'Setup web app codebase & component structure', priority: 'High' },
    { title: 'Build core pages & layout components', priority: 'High' },
    { title: 'Implement responsive mobile navigation & styling', priority: 'High' },
    { title: 'Integrate forms, interactive widgets & dynamic features', priority: 'Medium' }
  ],
  'Internal Review': [
    { title: 'Internal code audit & UI polish check', priority: 'Medium' },
    { title: 'Cross-device layout verification', priority: 'Medium' }
  ],
  'Client Review': [
    { title: 'Deploy staging preview for client demonstration', priority: 'High' },
    { title: 'Conduct live walkthrough review with client', priority: 'Medium' }
  ],
  'Revisions': [
    { title: 'Implement client feedback round 1 changes', priority: 'High' },
    { title: 'Verify final revision adjustments', priority: 'Medium' }
  ],
  'QA': [
    { title: 'Test responsive design across mobile/tablet/desktop', priority: 'Urgent' },
    { title: 'Test all contact forms, validations & alerts', priority: 'Urgent' },
    { title: 'Test all internal & external links (0 broken links)', priority: 'High' },
    { title: 'Run Google Lighthouse audit & verify Core Web Vitals', priority: 'High' },
    { title: 'Test cross-browser compatibility (Chrome, Safari, Firefox, Edge)', priority: 'Medium' }
  ],
  'Deployment': [
    { title: 'Configure production DNS records & SSL certificate', priority: 'Urgent' },
    { title: 'Deploy production build to Vercel/Hosting', priority: 'Urgent' },
    { title: 'Verify live domain & production routing', priority: 'Urgent' }
  ],
  'Handover': [
    { title: 'Handover client credentials & admin documentation', priority: 'High' },
    { title: 'Final invoice clearance & project sign-off', priority: 'Urgent' }
  ]
};

export const DEFAULT_REQUIREMENT_TEMPLATES = [
  'Logo (Vector/SVG/High-res PNG)',
  'Brand colors & style guide',
  'Product images & media assets',
  'Company information & About text',
  'Contact details, location & phone numbers',
  'Social media links',
  'Website copy & page content',
  'Domain registrar access / DNS records',
  'Hosting access',
  'Payment gateway credentials'
];

export const DEFAULT_QA_CHECKLIST_TEMPLATES = [
  { item_key: 'responsive_design', item_label: 'Responsive design & mobile layout verified' },
  { item_key: 'mobile_testing', item_label: 'Tested on actual iOS & Android physical devices' },
  { item_key: 'forms_tested', item_label: 'All contact forms, validation & lead notifications tested' },
  { item_key: 'links_tested', item_label: 'Internal & external links verified (0 broken 404 links)' },
  { item_key: 'images_optimized', item_label: 'Images compressed, WebP converted & dimensions specified' },
  { item_key: 'seo_basics', item_label: 'Page title tags, meta descriptions & H1 hierarchy verified' },
  { item_key: 'metadata_checked', item_label: 'OpenGraph, Twitter cards & favicon icons verified' },
  { item_key: 'performance_checked', item_label: 'Google Lighthouse score > 90 & Core Web Vitals passed' },
  { item_key: 'accessibility_checked', item_label: 'WCAG color contrast & ARIA accessibility verified' },
  { item_key: 'browser_testing', item_label: 'Cross-browser compatibility verified (Chrome, Safari, Firefox, Edge)' },
  { item_key: 'client_approval', item_label: 'Final client walkthrough & sign-off approval received' },
];
