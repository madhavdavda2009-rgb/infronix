// Shared (server + browser) definitions for the 5 post-deal client documents.
// A document is { doc_type, doc_number, title, data } where data holds the
// structured fields plus an editable list of `sections` ({ id, title, body }).
// Rendering is a pure function of that, so Founder OS, the client portal,
// emails and PDFs all show the same thing.

// Links inside documents and emails always point at the live site, never the server that sent them.
export const SITE_URL = 'https://www.infronixweb.in';

export const DEFAULT_PROFILE = {
  agency_name: 'InfronixWeb Digital Marketing',
  agency_address: 'Sanand, Ahmedabad, Gujarat, India',
  agency_email: 'support@infronixweb.in',
  agency_phone: '',
  agency_website: 'www.infronixweb.in',
  agency_signer_name: 'Madhav Davda',
  agency_signer_title: 'Founder, InfronixWeb',
  agency_signature: '',
  upi_id: 'infronixweb@oksbi',
  bank_name: '',
  bank_account_name: 'InfronixWeb Digital Marketing',
  bank_account_number: '',
  bank_ifsc: '',
};

export const PROFILE_FIELDS = [
  { key: 'agency_name', label: 'Business Name', type: 'text' },
  { key: 'agency_address', label: 'Address', type: 'textarea' },
  { key: 'agency_email', label: 'Email', type: 'text' },
  { key: 'agency_phone', label: 'Phone', type: 'text' },
  { key: 'agency_website', label: 'Website', type: 'text' },
  { key: 'agency_signer_name', label: 'Authorised Signatory', type: 'text' },
  { key: 'agency_signer_title', label: 'Signatory Title', type: 'text' },
  { key: 'agency_signature', label: 'Your Signature', type: 'signature' },
  { key: 'upi_id', label: 'UPI ID', type: 'text' },
  { key: 'bank_name', label: 'Bank Name', type: 'text' },
  { key: 'bank_account_name', label: 'Account Name', type: 'text' },
  { key: 'bank_account_number', label: 'Account Number', type: 'text' },
  { key: 'bank_ifsc', label: 'IFSC', type: 'text' },
];

export const DOC_TYPES = {
  welcome: { label: 'Welcome Letter & Onboarding Kit', short: 'Welcome Kit', prefix: 'WEL', requiresSignature: false, order: 1 },
  agreement: { label: 'Service Agreement', short: 'Agreement', prefix: 'AGR', requiresSignature: true, order: 2 },
  sow: { label: 'Scope of Work & Timeline', short: 'Scope of Work', prefix: 'SOW', requiresSignature: true, order: 3 },
  invoice: { label: 'Invoice', short: 'Invoice', prefix: 'INV', requiresSignature: false, order: 4 },
  nda: { label: 'Non-Disclosure Agreement', short: 'NDA', prefix: 'NDA', requiresSignature: true, order: 5 },
};

export const DOC_TYPE_KEYS = Object.keys(DOC_TYPES).sort((a, b) => DOC_TYPES[a].order - DOC_TYPES[b].order);

export const DOC_STATUSES = ['Draft', 'Sent', 'Viewed', 'Changes Requested', 'Signed'];

/* ----------------------------- fields ----------------------------- */

const CLIENT_FIELDS = [
  { key: 'client_name', label: 'Contact Name', type: 'text', group: 'Client' },
  { key: 'client_company', label: 'Company', type: 'text', group: 'Client' },
  { key: 'client_email', label: 'Email', type: 'text', group: 'Client' },
  { key: 'client_phone', label: 'Phone', type: 'text', group: 'Client' },
  { key: 'client_address', label: 'Address', type: 'textarea', group: 'Client' },
];

const AGENCY_FIELDS = [
  { key: 'agency_name', label: 'Business Name', type: 'text', group: 'InfronixWeb' },
  { key: 'agency_address', label: 'Address', type: 'textarea', group: 'InfronixWeb' },
  { key: 'agency_email', label: 'Email', type: 'text', group: 'InfronixWeb' },
  { key: 'agency_phone', label: 'Phone', type: 'text', group: 'InfronixWeb' },
  { key: 'agency_website', label: 'Website', type: 'text', group: 'InfronixWeb' },
  { key: 'agency_signer_name', label: 'Signed by', type: 'text', group: 'InfronixWeb' },
  { key: 'agency_signer_title', label: 'Signer Title', type: 'text', group: 'InfronixWeb' },
  { key: 'agency_signature', label: 'Signature', type: 'signature', group: 'InfronixWeb' },
];

const FIELD_SCHEMAS = {
  welcome: [
    { key: 'project_name', label: 'Project Name', type: 'text', group: 'Project' },
    { key: 'issue_date', label: 'Letter Date', type: 'date', group: 'Project' },
    { key: 'kickoff_date', label: 'Kickoff Date', type: 'date', group: 'Project' },
    { key: 'target_launch', label: 'Target Launch', type: 'date', group: 'Project' },
    { key: 'portal_url', label: 'Client Portal Link', type: 'text', group: 'Project' },
    { key: 'pm_name', label: 'Project Manager', type: 'text', group: 'Team' },
    { key: 'pm_email', label: 'PM Email', type: 'text', group: 'Team' },
    { key: 'pm_phone', label: 'PM Phone / WhatsApp', type: 'text', group: 'Team' },
    { key: 'communication_channel', label: 'Main Channel', type: 'text', group: 'Team' },
    { key: 'working_hours', label: 'Working Hours', type: 'text', group: 'Team' },
    { key: 'response_time', label: 'Response Time', type: 'text', group: 'Team' },
    ...CLIENT_FIELDS.slice(0, 3),
    ...AGENCY_FIELDS,
  ],
  agreement: [
    { key: 'project_name', label: 'Project Name', type: 'text', group: 'Project' },
    { key: 'effective_date', label: 'Effective Date', type: 'date', group: 'Project' },
    { key: 'start_date', label: 'Start Date', type: 'date', group: 'Project' },
    { key: 'end_date', label: 'Estimated Completion', type: 'date', group: 'Project' },
    { key: 'total_fee', label: 'Total Fee (₹)', type: 'money', group: 'Fees' },
    { key: 'payment_milestones', label: 'Payment Milestones', type: 'pairs', group: 'Fees', hint: 'One per line: Milestone | Amount (₹)' },
    { key: 'payment_due_days', label: 'Invoice Due (days)', type: 'number', group: 'Fees' },
    { key: 'revision_rounds', label: 'Revision Rounds', type: 'number', group: 'Terms' },
    { key: 'support_days', label: 'Free Support (days)', type: 'number', group: 'Terms' },
    { key: 'termination_notice_days', label: 'Termination Notice (days)', type: 'number', group: 'Terms' },
    { key: 'jurisdiction', label: 'Jurisdiction', type: 'text', group: 'Terms' },
    ...CLIENT_FIELDS,
    ...AGENCY_FIELDS,
  ],
  sow: [
    { key: 'project_name', label: 'Project Name', type: 'text', group: 'Project' },
    { key: 'project_type', label: 'Project Type', type: 'text', group: 'Project' },
    { key: 'issue_date', label: 'Issue Date', type: 'date', group: 'Project' },
    { key: 'revision_rounds', label: 'Revision Rounds', type: 'number', group: 'Project' },
    { key: 'milestones', label: 'Milestones', type: 'pairs', group: 'Timeline', hint: 'One per line: Milestone | Date (YYYY-MM-DD)' },
    ...CLIENT_FIELDS.slice(0, 2),
    ...AGENCY_FIELDS,
  ],
  invoice: [
    { key: 'invoice_kind', label: 'Invoice Type', type: 'select', options: ['Invoice', 'Proforma Invoice'], group: 'Invoice' },
    { key: 'project_name', label: 'Project Name', type: 'text', group: 'Invoice' },
    { key: 'issue_date', label: 'Issue Date', type: 'date', group: 'Invoice' },
    { key: 'due_date', label: 'Due Date', type: 'date', group: 'Invoice' },
    { key: 'items', label: 'Line Items', type: 'pairs', group: 'Invoice', hint: 'One per line: Description | Amount (₹)' },
    { key: 'amount_paid', label: 'Already Paid (₹)', type: 'money', group: 'Invoice' },
    { key: 'upi_id', label: 'UPI ID', type: 'text', group: 'Payment' },
    { key: 'bank_name', label: 'Bank Name', type: 'text', group: 'Payment' },
    { key: 'bank_account_name', label: 'Account Name', type: 'text', group: 'Payment' },
    { key: 'bank_account_number', label: 'Account Number', type: 'text', group: 'Payment' },
    { key: 'bank_ifsc', label: 'IFSC', type: 'text', group: 'Payment' },
    ...CLIENT_FIELDS,
    ...AGENCY_FIELDS.filter(f => f.key !== 'agency_signature'),
  ],
  nda: [
    { key: 'project_name', label: 'Project Name', type: 'text', group: 'Terms' },
    { key: 'effective_date', label: 'Effective Date', type: 'date', group: 'Terms' },
    { key: 'mutual', label: 'Mutual NDA (protects both sides)', type: 'checkbox', group: 'Terms' },
    { key: 'term_years', label: 'Confidentiality Period (years)', type: 'number', group: 'Terms' },
    { key: 'jurisdiction', label: 'Jurisdiction', type: 'text', group: 'Terms' },
    ...CLIENT_FIELDS,
    ...AGENCY_FIELDS,
  ],
};

export function getFieldSchema(docType) {
  return FIELD_SCHEMAS[docType] || [];
}

/** Placeholders that render a whole block (table, cards) when placed on their own line. */
export const BLOCK_PLACEHOLDERS = {
  welcome: [{ key: 'team_cards', label: 'Team cards' }],
  agreement: [{ key: 'payment_table', label: 'Payment table' }, { key: 'parties', label: 'Parties' }],
  sow: [{ key: 'milestones_table', label: 'Milestones table' }],
  invoice: [{ key: 'payment_details', label: 'Bank & UPI details' }],
  nda: [{ key: 'parties', label: 'Parties' }],
};

/* ------------------------- default sections ------------------------- */

const DEFAULT_SECTIONS = {
  welcome: [
    { title: 'A quick hello', body: "Hi {{client_name}},\n\nThank you for choosing InfronixWeb. We're genuinely excited to work on **{{project_name}}** with you. Our goal is simple: a website that looks great and actually brings you business.\n\nThis kit has everything you need to get started: who you will be working with, how we communicate, and what we need from you to begin." },
    { title: 'Your team & how we stay in touch', body: '{{team_cards}}' },
    { title: 'What we need from you', body: '- Logo files (PNG/SVG) and brand colours\n- Business content: about us, services, contact details\n- Photos of your work, team or products\n- Domain & hosting login (if you already have them)\n- Two or three websites you like, for reference\n\nYou can upload all of these in your client portal under **Requirements**.' },
    { title: 'How we will work together', body: '1. Kickoff call – we align on goals, pages and timeline\n2. Design – you review and approve the homepage design\n3. Development – we build all pages while you track progress in the portal\n4. Review – you test the preview site and share changes\n5. Launch – we go live, then hand over access and training' },
    { title: 'Your client portal', body: 'Track progress, approve designs, raise change requests and download documents anytime at {{portal_url}}.\n\nIf anything is unclear, just reply to this email or message us. We are here to make this smooth for you.' },
  ],
  agreement: [
    { title: 'Parties', body: 'This Service Agreement (the "Agreement") is made on **{{effective_date}}** between {{agency_name}} ("InfronixWeb", "we") and {{client_company}} ("the Client", "you").\n\n{{parties}}' },
    { title: 'Scope of Services', body: 'InfronixWeb will provide the following services for **{{project_name}}**:\n\n- Website design and development\n- Mobile-responsive layout and basic on-page SEO setup\n- Deployment and launch support\n\nDetailed deliverables, exclusions and milestones are set out in the Scope of Work (SOW), which forms part of this Agreement. Anything not listed in the SOW is outside the scope.' },
    { title: 'Fees & Payment', body: 'The total fee is **{{total_fee}}**, payable as follows:\n\n{{payment_table}}\n\nInvoices are payable within {{payment_due_days}} days. Work starts after the advance is received. If a payment is overdue by more than 7 days, InfronixWeb may pause work until it is cleared, and the timeline will shift accordingly.' },
    { title: 'Timeline', body: "Work is planned to start on **{{start_date}}** with estimated completion by **{{end_date}}**. The timeline depends on the Client providing content, feedback and approvals on time; delays on the Client's side extend the timeline by the same period." },
    { title: 'Revisions & Change Requests', body: 'The fee includes **{{revision_rounds}} round(s)** of revisions at each design and review stage. Additional revisions or new features are treated as change requests and quoted separately before any work begins.' },
    { title: 'Client Responsibilities', body: 'The Client will provide accurate content, brand assets and access credentials, nominate one decision-maker, and give consolidated feedback within the agreed review windows. The Client confirms they own or have the right to use all material they provide.' },
    { title: 'Intellectual Property', body: 'On receipt of full payment, ownership of the final deliverables created for the Client transfers to the Client. Until then, all work remains the property of InfronixWeb. Third-party items (fonts, plugins, stock images, frameworks) remain under their own licences.\n\nInfronixWeb may show the completed work in its portfolio and marketing, unless the Client asks otherwise in writing.' },
    { title: 'Confidentiality', body: "Both parties will keep each other's confidential information (business data, credentials, pricing, customer details) private and use it only for this project. This obligation continues after the Agreement ends." },
    { title: 'Domain, Hosting & Third-Party Services', body: "Unless stated in the SOW, domain, hosting, paid plugins, email and other third-party services are billed separately and are the Client's responsibility to renew. InfronixWeb is not liable for outages or changes made by third-party providers." },
    { title: 'Warranty & Support', body: 'InfronixWeb will fix bugs in the delivered work free of charge for **{{support_days}} days** after launch. This does not cover new features, content updates, or issues caused by changes made by the Client or third parties.' },
    { title: 'Limitation of Liability', body: "InfronixWeb's total liability under this Agreement is limited to the fees actually paid by the Client. Neither party is liable for indirect or consequential losses such as lost profits or business interruption." },
    { title: 'Termination', body: "Either party may end this Agreement with {{termination_notice_days}} days' written notice. The Client will pay for all work completed up to the termination date. The advance payment is non-refundable once work has started." },
    { title: 'Governing Law', body: 'This Agreement is governed by the laws of India. Any dispute will first be discussed in good faith; if unresolved, the courts at {{jurisdiction}} will have exclusive jurisdiction.' },
    { title: 'Entire Agreement', body: 'This Agreement, together with the SOW and invoices issued under it, is the complete agreement between the parties. Changes are valid only when agreed in writing (including email or the client portal). Electronic signatures on this Agreement are valid and binding.' },
  ],
  sow: [
    { title: 'Project Objective', body: 'Build a fast, mobile-friendly {{project_type}} for {{client_company}} that clearly presents their services and turns visitors into enquiries.' },
    { title: 'Deliverables (In Scope)', body: '- Up to 5 pages: Home, About, Services, Gallery, Contact\n- Mobile-responsive design approved by the client\n- Contact form and WhatsApp click-to-chat\n- Basic on-page SEO (titles, meta descriptions, sitemap)\n- Google Analytics setup' },
    { title: 'Not Included', body: '- Content writing beyond the material provided\n- Paid stock photos or premium plugins\n- Ongoing SEO, ads or social media management\n- Domain and hosting charges\n\nAnything not listed in scope can be added through a change request with a separate quote.' },
    { title: 'Milestones & Timeline', body: '{{milestones_table}}\n\nDates assume timely content and feedback from the Client.' },
    { title: 'Revisions', body: 'Includes **{{revision_rounds}} round(s)** of revisions per review stage. A "round" is one consolidated list of changes.' },
    { title: 'Client Responsibilities', body: '- Share all content and assets within 5 working days of kickoff\n- Give consolidated feedback within 3 working days of each review\n- Nominate one person to approve designs and content' },
    { title: 'Acceptance', body: 'A milestone is accepted when the client approves it in writing (email, WhatsApp or the client portal), or when no feedback is received within 5 working days of delivery.' },
    { title: 'Change Requests', body: 'New requirements are raised through the client portal. We confirm whether each request is in scope; if not, we share a quote and the timeline impact for your approval before starting.' },
  ],
  invoice: [
    { title: 'Payment Details', body: '{{payment_details}}' },
    { title: 'Notes', body: 'Work begins once the advance payment is received. Please share the payment reference after transfer.\n\nThank you for your business!' },
  ],
  nda: [
    { title: 'Parties', body: 'This Non-Disclosure Agreement is made on **{{effective_date}}** between:\n\n{{parties}}' },
    { title: 'Purpose', body: 'Discussing, planning and delivering **{{project_name}}**, including access to business information, customer data and system credentials.' },
    { title: 'Confidential Information', body: '"Confidential Information" means any non-public information shared by one party (the "Disclosing Party") with the other (the "Receiving Party"), in any form, including business plans, pricing, customer and lead data, financial details, designs, source code, passwords, server and account credentials, and anything marked or reasonably understood to be confidential.' },
    { title: 'Obligations', body: "- Use the Confidential Information only for the Purpose above\n- Share it only with team members or contractors who need it and are bound by similar confidentiality\n- Protect it with at least the care used for one's own confidential information\n- Store credentials securely and never share them over public channels\n- Promptly report any unauthorised access or disclosure" },
    { title: 'Exclusions', body: 'These obligations do not apply to information that is or becomes public through no fault of the Receiving Party, was already lawfully known to it, is independently developed, or must be disclosed by law (with prompt notice where allowed).' },
    { title: 'Term', body: 'Confidentiality obligations last for **{{term_years}} year(s)** after the project ends. Obligations for passwords, credentials and personal data continue for as long as that information remains confidential.' },
    { title: 'Return or Deletion', body: 'On request or at the end of the project, the Receiving Party will return or securely delete the Confidential Information, including credentials, except copies required by law.' },
    { title: 'Remedies & Governing Law', body: 'Unauthorised disclosure may cause irreparable harm, and the Disclosing Party may seek injunctive relief in addition to other remedies. This Agreement is governed by the laws of India, and the courts at {{jurisdiction}} have exclusive jurisdiction. Electronic signatures are valid and binding.' },
  ],
};

let sectionCounter = 0;
export function newSectionId() {
  sectionCounter += 1;
  return `s${Date.now().toString(36)}${sectionCounter}`;
}

export function getDefaultSections(docType) {
  return (DEFAULT_SECTIONS[docType] || []).map(s => ({ id: newSectionId(), title: s.title, body: s.body }));
}

/* ----------------------------- defaults ----------------------------- */

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function addDays(iso, days) {
  const d = iso ? new Date(`${iso}T00:00:00Z`) : new Date();
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

function toIsoDate(value) {
  if (!value) return '';
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return String(value).slice(0, 10);
}

/**
 * Build pre-filled data for a new document.
 * ctx = { client, project, payments, profile, sections }
 */
export function buildDefaultData(docType, ctx = {}) {
  const client = ctx.client || {};
  const project = ctx.project || {};
  const payments = ctx.payments || [];
  const profile = { ...DEFAULT_PROFILE, ...(ctx.profile || {}) };
  const today = todayIso();
  const value = Number(project.project_value) || 0;
  const startDate = toIsoDate(project.start_date) || today;
  const endDate = toIsoDate(project.deadline) || addDays(startDate, 30);
  const firstPayment = payments[0];

  const milestonePairs = payments.length
    ? payments.map(p => `${p.name} | ${Number(p.amount) || 0}`).join('\n')
    : [
        `Advance on signing (50%) | ${Math.round(value * 0.5)}`,
        `Design approval (30%) | ${Math.round(value * 0.3)}`,
        `Before launch (20%) | ${value - Math.round(value * 0.5) - Math.round(value * 0.3)}`,
      ].join('\n');

  const common = {
    client_name: client.name || project.client_name || '',
    client_company: client.company || client.name || project.client_name || '',
    client_email: client.email || '',
    client_phone: client.phone || '',
    client_address: '',
    project_name: project.project_name || '',
    agency_name: profile.agency_name,
    agency_address: profile.agency_address,
    agency_email: profile.agency_email,
    agency_phone: profile.agency_phone,
    agency_website: profile.agency_website,
    agency_signer_name: profile.agency_signer_name,
    agency_signer_title: profile.agency_signer_title,
    agency_signature: profile.agency_signature,
    sections: ctx.sections?.length ? ctx.sections.map(s => ({ ...s, id: newSectionId() })) : getDefaultSections(docType),
  };

  switch (docType) {
    case 'welcome':
      return {
        ...common,
        issue_date: today,
        kickoff_date: startDate,
        target_launch: endDate,
        portal_url: `${SITE_URL}/client/login`,
        pm_name: project.assigned_person || profile.agency_signer_name,
        pm_email: profile.agency_email,
        pm_phone: profile.agency_phone,
        communication_channel: 'WhatsApp for quick updates, email for approvals',
        working_hours: 'Mon–Sat, 10 AM – 7 PM IST',
        response_time: 'Same business day',
      };
    case 'agreement':
      return {
        ...common,
        effective_date: today,
        start_date: startDate,
        end_date: endDate,
        total_fee: value,
        payment_milestones: milestonePairs,
        payment_due_days: 7,
        revision_rounds: 2,
        support_days: 30,
        termination_notice_days: 15,
        jurisdiction: 'Ahmedabad, Gujarat',
      };
    case 'sow':
      return {
        ...common,
        issue_date: today,
        project_type: project.project_type || 'Business Website',
        revision_rounds: 2,
        milestones: [
          `Kickoff & content collection | ${startDate}`,
          `Homepage design approval | ${addDays(startDate, 7)}`,
          `Full development complete | ${addDays(startDate, 21)}`,
          `Review & launch | ${endDate}`,
        ].join('\n'),
      };
    case 'invoice':
      return {
        ...common,
        invoice_kind: 'Invoice',
        issue_date: today,
        due_date: toIsoDate(firstPayment?.due_date) || addDays(today, 7),
        items: `${firstPayment?.name || 'Advance payment'} – ${common.project_name || 'Project'} | ${firstPayment ? Number(firstPayment.amount) || 0 : Math.round(value * 0.5)}`,
        amount_paid: 0,
        upi_id: profile.upi_id,
        bank_name: profile.bank_name,
        bank_account_name: profile.bank_account_name,
        bank_account_number: profile.bank_account_number,
        bank_ifsc: profile.bank_ifsc,
      };
    case 'nda':
      return {
        ...common,
        effective_date: today,
        mutual: true,
        term_years: 2,
        jurisdiction: 'Ahmedabad, Gujarat',
      };
    default:
      return common;
  }
}

/* ----------------------------- helpers ----------------------------- */

export function esc(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function parseLines(value) {
  return String(value || '').split('\n').map(l => l.trim()).filter(Boolean);
}

export function parsePairs(value) {
  return parseLines(value).map(line => {
    const idx = line.lastIndexOf('|');
    if (idx === -1) return { label: line, value: '' };
    return { label: line.slice(0, idx).trim(), value: line.slice(idx + 1).trim() };
  });
}

function toAmount(value) {
  return Number(String(value ?? '').replace(/[^0-9.]/g, '')) || 0;
}

export function inr(amount) {
  const n = Number(amount) || 0;
  return `₹${n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function formatDate(iso) {
  if (!iso) return '—';
  const d = new Date(`${String(iso).slice(0, 10)}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return esc(iso);
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
}

function formatDateTime(value) {
  if (!value) return '';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Kolkata' }) + ' IST';
}

export function computeInvoiceTotals(data = {}) {
  const items = parsePairs(data.items).map(i => ({ description: i.label, amount: toAmount(i.value) }));
  const total = items.reduce((sum, i) => sum + i.amount, 0);
  const paid = Number(data.amount_paid) || 0;
  return { items, total, paid, balance: Math.max(total - paid, 0) };
}

export function isSignatureImage(value) {
  return typeof value === 'string' && /^data:image\/(png|jpeg);base64,[A-Za-z0-9+/=]+$/.test(value) && value.length < 400000;
}

/** Stable string used for the tamper-evidence hash of a document's content. */
export function canonicalContent(doc) {
  const data = doc.data || {};
  const sorted = {};
  for (const key of Object.keys(data).sort()) sorted[key] = data[key];
  return JSON.stringify({ doc_type: doc.doc_type, doc_number: doc.doc_number, title: doc.title, data: sorted });
}

/* ---------------------------- rendering ---------------------------- */

// Website tokens (src/app/globals.css): violet primary, soft violet, deep space ink.
const C = {
  violet: '#6D28D9',
  violetDark: '#5B21B6',
  violetSoft: '#E7DFFF',
  violetWash: '#F6F2FF',
  ink: '#0B0D12',
  text: '#1E293B',
  muted: '#64748B',
  line: '#E2E8F0',
};

const FONT_STACKS = {
  app: {
    body: "var(--font-general), 'General Sans', Arial, sans-serif",
    heading: "var(--font-cabinet), 'Cabinet Grotesk', Arial, sans-serif",
  },
  email: {
    body: "'General Sans', Arial, Helvetica, sans-serif",
    heading: "'Cabinet Grotesk', 'General Sans', Arial, Helvetica, sans-serif",
  },
};

// Fontshare serves one family per request.
export const EMAIL_FONT_LINKS = [
  'https://api.fontshare.com/v2/css?f[]=general-sans@400,500,600,700&display=swap',
  'https://api.fontshare.com/v2/css?f[]=cabinet-grotesk@500,700,800&display=swap',
];

const SCRIPT = "'Brush Script MT','Segoe Script','Lucida Handwriting',cursive";

// Type scale (px): 34 title / 19 section / 15 card title / 13.5 body / 11-12 meta / 10 label.
function styles(F) {
  return {
    F,
    p: `font-family:${F.body};font-size:13.5px;line-height:1.75;color:${C.text};margin:0 0 14px;`,
    label: `font-family:${F.body};font-size:10px;font-weight:600;letter-spacing:1.6px;text-transform:uppercase;color:${C.muted};margin:0 0 6px;`,
    th: `font-family:${F.body};text-align:left;font-size:10px;font-weight:600;letter-spacing:1.2px;text-transform:uppercase;color:${C.violetDark};padding:11px 14px;background:${C.violetWash};border-bottom:1px solid ${C.violetSoft};`,
    td: `font-family:${F.body};font-size:13.5px;color:${C.text};padding:12px 14px;border-bottom:1px solid ${C.line};vertical-align:top;`,
  };
}

const DATE_KEYS = new Set(['issue_date', 'due_date', 'effective_date', 'start_date', 'end_date', 'kickoff_date', 'target_launch']);
const MONEY_KEYS = new Set(['total_fee', 'amount_paid']);

function formatValue(key, data) {
  const v = data[key];
  if (DATE_KEYS.has(key)) return formatDate(v);
  if (MONEY_KEYS.has(key)) return inr(v);
  if (key === 'portal_url' && v) return `<a href="${esc(v)}" style="color:${C.violet};font-weight:600;text-decoration:none;">${esc(v)}</a>`;
  return esc(v);
}

function inline(text, data) {
  return esc(text)
    .replace(/\*\*(.+?)\*\*/g, `<strong style="font-weight:600;color:${C.ink};">$1</strong>`)
    .replace(/\{\{\s*([a-z_]+)\s*\}\}/g, (match, key) => (key in data && typeof data[key] !== 'object' ? formatValue(key, data) : match));
}

function cards(items, columns = items.length) {
  const width = `${Math.floor(100 / columns)}%`;
  const rows = [];
  for (let i = 0; i < items.length; i += columns) rows.push(items.slice(i, i + columns));
  return rows.map(row => `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 14px;table-layout:fixed;"><tr>
    ${row.map((html, i) => `<td style="width:${width};vertical-align:top;padding:0 ${i === row.length - 1 ? 0 : 12}px 0 0;">${html}</td>`).join('')}
  </tr></table>`).join('');
}

function infoCard(label, lines, S, accent = false) {
  return `<div style="border:1px solid ${accent ? C.violetSoft : C.line};background:${accent ? C.violetWash : '#ffffff'};border-radius:10px;padding:16px 18px;">
    <p style="${S.label}${accent ? `color:${C.violet};` : ''}">${label}</p>
    ${lines.filter(Boolean).map((l, i) => `<p style="font-family:${i === 0 ? S.F.heading : S.F.body};font-size:${i === 0 ? '15px' : '12.5px'};font-weight:${i === 0 ? 700 : 400};color:${i === 0 ? C.ink : C.muted};margin:${i === 0 ? '0 0 6px' : '0 0 2px'};line-height:1.5;">${l}</p>`).join('')}
  </div>`;
}

function dataTable(headers, rows, S) {
  const last = headers.length - 1;
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:4px 0 16px;border:1px solid ${C.line};border-radius:10px;border-collapse:separate;border-spacing:0;overflow:hidden;">
    <tr>${headers.map((h, i) => `<th style="${S.th}${i === last ? 'text-align:right;' : ''}">${h}</th>`).join('')}</tr>
    ${rows.map((r, ri) => `<tr>${r.map((c, i) => `<td style="${S.td}${ri === rows.length - 1 ? 'border-bottom:none;' : ''}${i === last ? 'text-align:right;white-space:nowrap;' : ''}${i === 0 && headers[0] === '#' ? `width:36px;color:${C.muted};` : ''}">${c}</td>`).join('')}</tr>`).join('')}
  </table>`;
}

function partyLines(d, side) {
  if (side === 'agency') {
    return [esc(d.agency_name), esc(d.agency_address).replace(/\n/g, '<br/>'), esc(d.agency_email), esc(d.agency_phone), esc(d.agency_website)];
  }
  return [
    esc(d.client_company || d.client_name),
    d.client_company && d.client_name && d.client_company !== d.client_name ? `Attn: ${esc(d.client_name)}` : '',
    esc(d.client_address).replace(/\n/g, '<br/>'),
    esc(d.client_email),
    esc(d.client_phone),
  ];
}

function renderBlock(key, doc, S) {
  const d = doc.data || {};
  switch (key) {
    case 'parties':
      return cards([infoCard('Service Provider', partyLines(d, 'agency'), S, true), infoCard('Client', partyLines(d, 'client'), S)]);
    case 'payment_table': {
      const pairs = parsePairs(d.payment_milestones);
      const rows = pairs.map(m => [esc(m.label), inr(toAmount(m.value))]);
      const total = pairs.reduce((s, m) => s + toAmount(m.value), 0);
      rows.push([`<strong style="color:${C.ink};">Total</strong>`, `<strong style="color:${C.ink};">${inr(total)}</strong>`]);
      return dataTable(['Milestone', 'Amount'], rows, S);
    }
    case 'milestones_table':
      return dataTable(['#', 'Milestone', 'Target date'], parsePairs(d.milestones).map((m, i) => [String(i + 1), esc(m.label), /^\d{4}-\d{2}-\d{2}$/.test(m.value) ? formatDate(m.value) : esc(m.value)]), S);
    case 'team_cards':
      return cards([
        infoCard('Project Manager', [esc(d.pm_name || '—'), esc(d.pm_email), esc(d.pm_phone)], S, true),
        infoCard('Main Channel', [esc(d.communication_channel || '—')], S),
        infoCard('Working Hours', [esc(d.working_hours || '—')], S),
        infoCard('Response Time', [esc(d.response_time || '—')], S),
      ], 2);
    case 'payment_details': {
      const rows = [
        ['UPI', d.upi_id], ['Bank', d.bank_name], ['Account name', d.bank_account_name],
        ['Account number', d.bank_account_number], ['IFSC', d.bank_ifsc],
      ].filter(([, v]) => v);
      if (!rows.length) return '';
      return `<div style="border:1px solid ${C.violetSoft};background:${C.violetWash};border-radius:10px;padding:16px 18px;margin:0 0 14px;">
        <table role="presentation" cellpadding="0" cellspacing="0">${rows.map(([k, v]) => `<tr><td style="font-family:${S.F.body};font-size:12px;color:${C.muted};padding:4px 28px 4px 0;">${k}</td><td style="font-family:${S.F.body};font-size:13.5px;font-weight:600;color:${C.ink};padding:4px 0;">${esc(v)}</td></tr>`).join('')}</table>
      </div>`;
    }
    default:
      return '';
  }
}

/** Renders a section body written in the simple editor markup. */
function renderBody(body, doc, S) {
  const data = doc.data || {};
  const blocks = String(body || '').replace(/\r/g, '').split(/\n\s*\n/).map(b => b.trim()).filter(Boolean);
  return blocks.map(block => {
    const blockMatch = block.match(/^\{\{\s*([a-z_]+)\s*\}\}$/);
    if (blockMatch && !(blockMatch[1] in data)) return renderBlock(blockMatch[1], doc, S);

    const lines = block.split('\n').map(l => l.trim());
    if (lines.every(l => /^[-•*]\s+/.test(l))) {
      return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 14px;">${lines.map(l => `
        <tr>
          <td style="width:22px;vertical-align:top;padding:9px 0 0 2px;"><div style="width:6px;height:6px;border-radius:3px;background:${C.violet};"></div></td>
          <td style="font-family:${S.F.body};font-size:13.5px;line-height:1.7;color:${C.text};padding:0 0 6px;">${inline(l.replace(/^[-•*]\s+/, ''), data)}</td>
        </tr>`).join('')}</table>`;
    }
    if (lines.every(l => /^\d+[.)]\s+/.test(l))) {
      return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 14px;">${lines.map((l, i) => {
        const text = l.replace(/^\d+[.)]\s+/, '');
        const [head, ...rest] = text.split(/\s[–—-]\s/);
        const tail = rest.join(' – ');
        const pad = i === lines.length - 1 ? 0 : 16;
        return `<tr>
          <td style="width:46px;vertical-align:top;padding:0 0 ${pad}px;">
            <div style="width:30px;height:30px;border-radius:15px;background:${C.violetWash};border:1px solid ${C.violetSoft};color:${C.violet};font-family:${S.F.heading};font-size:13px;font-weight:700;line-height:30px;text-align:center;">${i + 1}</div>
          </td>
          <td style="vertical-align:top;padding:5px 0 ${pad}px;">
            <div style="font-family:${S.F.heading};font-size:14px;font-weight:700;color:${C.ink};">${inline(head, data)}</div>
            ${tail ? `<div style="font-family:${S.F.body};font-size:12.5px;line-height:1.6;color:${C.muted};margin-top:2px;">${inline(tail.charAt(0).toUpperCase() + tail.slice(1), data)}</div>` : ''}
          </td>
        </tr>`;
      }).join('')}</table>`;
    }
    return `<p style="${S.p}">${lines.map(l => inline(l, data)).join('<br/>')}</p>`;
  }).join('');
}

function sectionHtml(num, section, doc, S) {
  return `<div style="margin:0 0 34px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 14px;"><tr>
      <td style="width:44px;vertical-align:baseline;padding:0;font-family:${S.F.heading};font-size:13px;font-weight:700;color:${C.violet};letter-spacing:.5px;">${String(num).padStart(2, '0')}</td>
      <td style="vertical-align:baseline;padding:0;"><h2 style="font-family:${S.F.heading};font-size:19px;font-weight:700;color:${C.ink};margin:0;letter-spacing:-.2px;line-height:1.3;">${esc(section.title)}</h2></td>
    </tr></table>
    <div style="padding-left:44px;">${renderBody(section.body, doc, S)}</div>
  </div>`;
}

function heroMeta(doc) {
  const d = doc.data || {};
  const client = esc(d.client_company || d.client_name);
  switch (doc.doc_type) {
    case 'welcome':
      return { eyebrow: 'Welcome Kit', title: `Welcome aboard${d.client_name ? `, ${esc(d.client_name.split(' ')[0])}` : ''}!`, subtitle: `Everything you need to kick off ${esc(d.project_name || 'your project')} with InfronixWeb.`, meta: [['Project', esc(d.project_name || '—')], ['Kickoff', formatDate(d.kickoff_date)], ['Target launch', formatDate(d.target_launch)]] };
    case 'agreement':
      return { eyebrow: 'Service Agreement', title: esc(d.project_name || 'Service Agreement'), subtitle: `Between ${esc(d.agency_name)} and ${client}`, meta: [['Effective', formatDate(d.effective_date)], ['Total fee', inr(d.total_fee)], ['Completion', formatDate(d.end_date)]] };
    case 'sow':
      return { eyebrow: 'Scope of Work', title: esc(d.project_name || 'Scope of Work'), subtitle: `${esc(d.project_type)} for ${client}`, meta: [['Issued', formatDate(d.issue_date)], ['Revisions', `${esc(d.revision_rounds ?? 2)} rounds`], ['Milestones', String(parsePairs(d.milestones).length)]] };
    case 'invoice': {
      const t = computeInvoiceTotals(d);
      return { eyebrow: esc(d.invoice_kind || 'Invoice'), title: inr(t.balance), subtitle: `Amount due for ${esc(d.project_name || 'your project')}`, meta: [['Issued', formatDate(d.issue_date)], ['Due date', formatDate(d.due_date)], ['Billed to', client]] };
    }
    case 'nda': {
      const mutual = d.mutual !== false && d.mutual !== 'false';
      return { eyebrow: mutual ? 'Mutual NDA' : 'Non-Disclosure Agreement', title: 'Non-Disclosure Agreement', subtitle: `Between ${esc(d.agency_name)} and ${client}`, meta: [['Effective', formatDate(d.effective_date)], ['Term', `${esc(d.term_years ?? 2)} year(s)`], ['Type', mutual ? 'Mutual' : 'One-way']] };
    }
    default:
      return { eyebrow: 'Document', title: esc(doc.title), meta: [] };
  }
}

function hero(doc, S) {
  const h = heroMeta(doc);
  return `<div style="margin:0 0 44px;">
    <p style="font-family:${S.F.body};font-size:11px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:${C.violet};margin:0 0 12px;">${h.eyebrow}<span style="color:${C.muted};font-weight:500;letter-spacing:1px;">&nbsp;&nbsp;·&nbsp;&nbsp;${esc(doc.doc_number || 'Draft')}</span></p>
    <h1 style="font-family:${S.F.heading};font-size:34px;font-weight:800;color:${C.ink};letter-spacing:-.8px;line-height:1.15;margin:0;">${h.title}</h1>
    ${h.subtitle ? `<p style="font-family:${S.F.body};font-size:15px;line-height:1.6;color:${C.muted};margin:10px 0 0;">${h.subtitle}</p>` : ''}
    ${h.meta.length ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:26px 0 0;background:${C.violetWash};border:1px solid ${C.violetSoft};border-radius:12px;table-layout:fixed;"><tr>
      ${h.meta.map(([k, v], i) => `<td style="vertical-align:top;padding:16px 20px;${i ? `border-left:1px solid ${C.violetSoft};` : ''}">
        <p style="${S.label}">${k}</p>
        <p style="font-family:${S.F.heading};font-size:15px;font-weight:700;color:${C.ink};margin:0;line-height:1.35;">${v}</p>
      </td>`).join('')}
    </tr></table>` : ''}
  </div>`;
}

function header(doc, logoUrl, S) {
  const d = doc.data || {};
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 40px;border-bottom:1px solid ${C.line};"><tr>
    <td style="vertical-align:middle;padding:0 0 22px;">
      <img src="${esc(logoUrl)}" alt="InfronixWeb" width="176" style="display:block;width:176px;height:auto;border:0;" />
    </td>
    <td style="vertical-align:middle;text-align:right;padding:0 0 22px;font-family:${S.F.body};font-size:11px;line-height:1.7;color:${C.muted};">
      ${[d.agency_website, d.agency_email, d.agency_phone].filter(Boolean).map(esc).join('<br/>')}
    </td>
  </tr></table>`;
}

function footer(doc, S) {
  const d = doc.data || {};
  return `<div style="margin-top:48px;padding-top:18px;border-top:1px solid ${C.line};">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
      <td style="font-family:${S.F.heading};font-size:12px;font-weight:700;color:${C.ink};">Infronix<span style="color:${C.violet};">Web</span></td>
      <td style="text-align:right;font-family:${S.F.body};font-size:10.5px;color:${C.muted};">${[d.agency_name, d.agency_address].filter(Boolean).map(esc).join(' · ')}</td>
    </tr></table>
  </div>`;
}

function invoiceSummary(doc, S) {
  const d = doc.data || {};
  const t = computeInvoiceTotals(d);
  const totals = [['Total', inr(t.total)], ...(t.paid ? [['Paid', `− ${inr(t.paid)}`]] : [])];
  return `${cards([infoCard('Billed to', partyLines(d, 'client'), S), infoCard('From', partyLines(d, 'agency'), S, true)])}
    <div style="height:10px;"></div>
    ${dataTable(['#', 'Description', 'Amount'], t.items.map((it, i) => [String(i + 1), esc(it.description), inr(it.amount)]), S)}
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 44px auto;width:300px;">
      ${totals.map(([k, v]) => `<tr><td style="font-family:${S.F.body};font-size:13px;color:${C.muted};padding:6px 14px;">${k}</td><td style="font-family:${S.F.body};font-size:13.5px;color:${C.text};padding:6px 14px;text-align:right;">${v}</td></tr>`).join('')}
      <tr><td colspan="2" style="padding:8px 0 0;">
        <div style="background:${C.violet};border-radius:10px;padding:14px 16px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
            <td style="font-family:${S.F.body};font-size:10.5px;font-weight:600;letter-spacing:1.4px;text-transform:uppercase;color:${C.violetSoft};">Balance due</td>
            <td style="font-family:${S.F.heading};text-align:right;font-size:20px;font-weight:800;color:#ffffff;">${inr(t.balance)}</td>
          </tr></table>
        </div>
      </td></tr>
    </table>`;
}

function signatureMark(image, fallbackName, imageUrl) {
  if (isSignatureImage(image)) {
    return `<img src="${esc(imageUrl || image)}" alt="Signature" style="display:block;height:54px;max-width:220px;width:auto;" />`;
  }
  if (fallbackName) {
    return `<div style="font-family:${SCRIPT};font-size:30px;color:${C.ink};line-height:54px;height:54px;">${esc(fallbackName)}</div>`;
  }
  return '<div style="height:54px;"></div>';
}

function signatureBlock(doc, S, agencySignatureUrl) {
  const d = doc.data || {};
  const signed = doc.status === 'Signed' && doc.signer_name;

  const box = (label, mark, name, title, note, done) => `
    <div style="border:1px solid ${done ? C.violetSoft : C.line};background:${done ? C.violetWash : '#ffffff'};border-radius:12px;padding:18px 20px;">
      <p style="${S.label}${done ? `color:${C.violet};` : ''}">${label}</p>
      ${mark}
      <div style="border-top:1px solid ${C.text};margin-top:10px;padding-top:10px;">
        <p style="font-family:${S.F.heading};font-size:14px;font-weight:700;color:${C.ink};margin:0;">${name || '&nbsp;'}</p>
        ${title ? `<p style="font-family:${S.F.body};font-size:12px;color:${C.muted};margin:2px 0 0;">${title}</p>` : ''}
        <p style="font-family:${S.F.body};font-size:11px;color:${C.muted};margin:6px 0 0;">${note}</p>
      </div>
    </div>`;

  const agencyBox = box(`For ${esc(d.agency_name)}`, signatureMark(d.agency_signature, d.agency_signer_name, agencySignatureUrl), esc(d.agency_signer_name), esc(d.agency_signer_title), `Issued ${esc(doc.sent_at ? formatDateTime(doc.sent_at) : 'on sending')}`, true);
  const clientBox = signed
    ? box(`For ${esc(d.client_company || d.client_name)}`, signatureMark(doc.signature_image, doc.signature_text || doc.signer_name), esc(doc.signer_name), esc(doc.signer_title), `Signed electronically ${esc(formatDateTime(doc.signed_at))}`, true)
    : box(`For ${esc(d.client_company || d.client_name || 'the Client')}`, '<div style="height:54px;"></div>', '', '', 'Awaiting signature', false);

  return `<div style="margin:8px 0 0;page-break-inside:avoid;">
    <h2 style="font-family:${S.F.heading};font-size:19px;font-weight:700;color:${C.ink};margin:0 0 16px;">Signatures</h2>
    ${cards([agencyBox, clientBox])}
    ${signed && doc.content_hash ? `<p style="font-family:Menlo,Consolas,monospace;font-size:9.5px;color:${C.muted};margin:4px 0 0;word-break:break-all;">Document fingerprint (SHA-256): ${esc(doc.content_hash)}</p>` : ''}
  </div>`;
}

export const DEFAULT_LOGO_PATH = '/brand-doc.png';

/**
 * Returns a self-contained HTML fragment (inline styles only) for the document.
 * Pass an absolute logoUrl, forEmail and agencySignatureUrl when the HTML leaves the site.
 */
export function renderDocumentHtml(doc, { logoUrl = DEFAULT_LOGO_PATH, forEmail = false, agencySignatureUrl = null } = {}) {
  const S = styles(forEmail ? FONT_STACKS.email : FONT_STACKS.app);
  const sections = Array.isArray(doc.data?.sections) ? doc.data.sections : [];
  const body = sections.map((s, i) => sectionHtml(i + 1, s, doc, S)).join('');
  const meta = DOC_TYPES[doc.doc_type];

  return `<div style="font-family:${S.F.body};color:${C.text};background:#ffffff;max-width:794px;margin:0 auto;box-sizing:border-box;">
    <div style="height:5px;background:${C.violet};"></div>
    <div style="padding:44px 56px 40px;">
      ${header(doc, logoUrl, S)}
      ${hero(doc, S)}
      ${doc.doc_type === 'invoice' ? invoiceSummary(doc, S) : ''}
      ${body}
      ${meta?.requiresSignature ? signatureBlock(doc, S, agencySignatureUrl) : ''}
      ${footer(doc, S)}
    </div>
  </div>`;
}
