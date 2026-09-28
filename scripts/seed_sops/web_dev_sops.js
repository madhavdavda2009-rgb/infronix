export const webDevelopmentSOPs = [
  {
    name: 'Web Development – Lead Qualification',
    category: 'Sales',
    owner: 'Sales Manager',
    version: '1.0',
    description: 'Standard procedure for qualifying inbound web development leads, assessing project fit, technical feasibility, timeline expectations, and budget alignment before scheduling discovery.',
    steps_json: [
      {
        title: 'Review Initial Inbound Submission',
        details: 'Inspect contact form data, project briefs, or consultation submissions. Record company name, industry, current website URL, requested tech stack, estimated timeline, and stated budget tier in Founder OS.'
      },
      {
        title: 'Evaluate Technical & Agency Fit',
        details: 'Verify if the requested scope matches InfronixWeb core competencies (Next.js, Node.js, Custom Web Apps, High-converting Landing Pages, CMS solutions). If the prospect requires legacy platforms (e.g., Magento 1, Drupal 7) or unsupported tech stacks, evaluate if migration to modern web architecture is feasible. If client strictly refuses modern stack, politely decline or refer out.'
      },
      {
        title: 'Conduct Initial Pre-Qualification Call / Email',
        details: 'Contact the prospect within 4 business hours. Clarify primary business goals (lead gen, e-commerce, brand authority, operational portal), decision-maker involvement, hard launch deadlines, and budget range.'
      },
      {
        title: 'Assess Budget & Scope Realism',
        details: 'Compare requested features (custom animations, user auth, payment gateways, CRM integrations) against stated budget. If budget is insufficient for full custom development, formulate phased delivery options (MVP first) before disqualifying.'
      },
      {
        title: 'Qualification Decision & Next Steps',
        details: 'If qualified, schedule a formal 30-minute Discovery Call and send calendar invite with pre-call questionnaire. If unqualified, log reason in CRM (Budget, Tech Mismatch, Unrealistic Timeline) and send professional polite referral/decline response.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark this SOP complete when lead record is updated in CRM with qualification status, discovery call is confirmed on calendar with agenda sent, or formal rejection notice is documented.'
      }
    ]
  },
  {
    name: 'Web Development – Discovery',
    category: 'Sales',
    owner: 'Project Manager',
    version: '1.0',
    description: 'Deep-dive discovery session to extract full business objectives, target audience requirements, user journeys, technical constraints, and integrations for web projects.',
    steps_json: [
      {
        title: 'Prepare Discovery Agenda & Research',
        details: 'Audit prospect current digital presence, analyze top 3 competitors in their market, review current site performance, mobile responsiveness, and SEO baseline prior to the call.'
      },
      {
        title: 'Facilitate Structured Discovery Call',
        details: 'Lead discovery call covering: 1) Business value proposition & revenue model, 2) Primary/secondary user personas, 3) Desired user actions & conversion funnels, 4) Technical requirements (auth, third-party APIs, CMS, CRM), 5) Visual aesthetic preferences & brand guidelines.'
      },
      {
        title: 'Identify Technical Constraints & Dependencies',
        details: 'Document third-party API availability, legacy database migration needs, domain registrar access, third-party licensing costs, and compliance/legal restrictions (GDPR, HIPAA, DPDP).'
      },
      {
        title: 'Synthesize Findings into Discovery Brief',
        details: 'Compile discovery call notes into structured Project Discovery Document including feature matrix, user stories, technical architecture recommendations, and project risks.'
      },
      {
        title: 'Review Discovery Brief with Technical Lead',
        details: 'Review proposed feature set with Lead Developer to validate architectural feasibility, hosting requirements, and delivery timeline estimates.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when Discovery Brief is approved internally by Project Manager and Technical Lead, and ready for Scope Confirmation and Proposal creation.'
      }
    ]
  },
  {
    name: 'Web Development – Requirement Collection',
    category: 'Client Onboarding',
    owner: 'Project Manager',
    version: '1.0',
    description: 'Detailed gathering and categorization of functional and non-functional website specifications, user flows, and integrations.',
    steps_json: [
      {
        title: 'Issue Requirement Questionnaire to Client',
        details: 'Send structured requirement intake questionnaire covering sitemap hierarchy, page-by-page functionality, forms, third-party tools, payment gateways, and multilingual needs.'
      },
      {
        title: 'Document Functional Specifications',
        details: 'Write clear functional specifications for every interactive feature: form validation rules, user authentication flows, notification triggers, search filters, and API webhooks.'
      },
      {
        title: 'Document Non-Functional Specifications',
        details: 'Specify target performance benchmarks (Lighthouse >= 90), maximum initial bundle size, mobile viewport compatibility (320px to 4K), browser support tier, and security requirements.'
      },
      {
        title: 'Compile Site Architecture & Sitemap',
        details: 'Construct visual sitemap diagram identifying all top-level routes, dynamic sub-routes, utility pages (404, privacy, terms), and navigation menus (header, footer, drawer).'
      },
      {
        title: 'Client Review & Sign-off on Requirements',
        details: 'Present Requirement Specification Document to client in a dedicated walkthrough call. Capture feedback, refine ambiguities, and secure formal written approval. If client introduces new feature requests outside preliminary discussions, flag as out-of-scope.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when client provides written sign-off on the Requirement Specification Document and sitemap, and requirements are locked for sprint planning.'
      }
    ]
  },
  {
    name: 'Web Development – Scope Confirmation',
    category: 'Sales',
    owner: 'Project Manager',
    version: '1.0',
    description: 'Formalizing project deliverables, exclusions, milestones, change-request procedures, and commercial terms in Statement of Work (SOW).',
    steps_json: [
      {
        title: 'Draft Detailed Statement of Work (SOW)',
        details: 'Create comprehensive SOW explicitly listing: Included Deliverables, Explicit Exclusions (e.g. copywriting, custom photography, third-party API subscription costs), Milestone Schedule, Revision Round Limits (standard 2 rounds per phase), and Acceptance Criteria.'
      },
      {
        title: 'Define Change Management Terms',
        details: 'Include standard Change Request clause: Any request modifying approved sitemap, design layouts after sign-off, or additional custom features will be estimated separately in cost and timeline.'
      },
      {
        title: 'Internal Commercial Review',
        details: 'Review SOW and pricing structure with Founder/Sales Manager to confirm profit margin, realistic developer resource allocation, and milestone cash flow milestones.'
      },
      {
        title: 'Send SOW and Master Services Agreement (MSA)',
        details: 'Transmit SOW and MSA to client for legal review and digital signature. Answer queries promptly and document any agreed contract revisions.'
      },
      {
        title: 'Execute Contract & Trigger Advance Invoice',
        details: 'Ensure both parties have countersigned. Notify Finance to issue Advance Payment Invoice. Do not commence design or development work until advance is verified.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when signed SOW/MSA is securely archived in client repository and Finance confirms advance payment requirement has been triggered.'
      }
    ]
  },
  {
    name: 'Web Development – Client Onboarding',
    category: 'Client Onboarding',
    owner: 'Account Manager',
    version: '1.0',
    description: 'Setting up client portal, communication channels, project workspace, and conducting kickoff meeting.',
    steps_json: [
      {
        title: 'Verify Advance Payment Received',
        details: 'Confirm with Finance/Admin that agreed deposit payment is credited in bank. If payment is unconfirmed, hold kickoff scheduling.'
      },
      {
        title: 'Provision Client in Founder OS & Project Workspace',
        details: 'Create Client profile and Project entry in Founder OS. Generate Client Portal credentials and configure delivery milestones according to approved SOW.'
      },
      {
        title: 'Establish Dedicated Communication Channel',
        details: 'Create dedicated WhatsApp client group or Slack channel with client stakeholders and InfronixWeb Account Manager/Project Manager. Post welcome message outlining office hours, response time SLA (within 4 hours), and primary communication protocol.'
      },
      {
        title: 'Send Onboarding Welcome Kit & Asset Checklist',
        details: 'Send welcome email containing: Portal login details, Project Roadmap overview, Asset Collection checklist (logos, brand guidelines, fonts, copy), and Kickoff Meeting invite.'
      },
      {
        title: 'Conduct Project Kickoff Meeting',
        details: 'Host 30-minute kickoff call to introduce team members, review project milestones, clarify asset delivery deadlines, and explain the review & approval workflow.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when kickoff meeting is concluded, meeting minutes are sent to client, and asset collection checklist is actively in progress.'
      }
    ]
  },
  {
    name: 'Web Development – Content & Asset Collection',
    category: 'Client Onboarding',
    owner: 'Account Manager',
    version: '1.0',
    description: 'Gathering, organizing, auditing, and validating client brand assets, copywriting, photography, and third-party media.',
    steps_json: [
      {
        title: 'Create Structured Asset Storage Folder',
        details: 'Set up secured cloud storage folder with subfolders: Brand Assets (SVG logos, vectors), Typography/Fonts, Page Copywriting, High-res Photography, Team Photos, Legal/Policy Documents.'
      },
      {
        title: 'Audit Brand Assets for Production Readiness',
        details: 'Verify logo vectors (.svg, .ai, .eps, or transparent high-res .png). Verify exact brand color hex codes and primary/secondary font licenses. If client supplies blurry low-res graphics, immediately request high-resolution vector assets.'
      },
      {
        title: 'Audit Page Copywriting & Content Matrix',
        details: 'Map supplied copy against approved sitemap pages. Check for missing headlines, value propositions, call-to-actions, testimonials, and legal policies (Privacy Policy, Terms of Service).'
      },
      {
        title: 'Flag Incomplete Assets & Issue Reminder',
        details: 'If assets are incomplete by agreed milestone date, issue written reminder specifying exact missing assets and impact on overall delivery timeline. Do not finalize UI design with dummy lorem ipsum if real content is vital for layout.'
      },
      {
        title: 'Final Asset Clearance for Design & Development',
        details: 'Organize approved assets in project repository and notify UI/UX Designer and Web Developer that asset intake is cleared.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when all critical assets (logo vectors, brand colors, page copy, photography) are verified, organized in storage, and passed to design team.'
      }
    ]
  },
  {
    name: 'Web Development – UI/UX Planning',
    category: 'Design',
    owner: 'UI/UX Designer',
    version: '1.0',
    description: 'Wireframing, user experience mapping, information architecture layout, and conversion funnel optimization.',
    steps_json: [
      {
        title: 'Analyze Target Audience & Conversion Funnel',
        details: 'Define key conversion actions per page (Form fill, WhatsApp chat, Call click, Purchase). Position primary CTA prominently in above-the-fold real estate across mobile and desktop.'
      },
      {
        title: 'Create Low-Fidelity Wireframes',
        details: 'Develop wireframes in Figma for all core templates: Homepage, Service Landing Pages, Case Study/Portfolio, About, Contact, Blog/Article layout.'
      },
      {
        title: 'Map Mobile UX Navigation & Layout',
        details: 'Design intuitive mobile navigation patterns (sticky header, hamburger menu with quick contact actions, thumb-friendly tap targets of at least 48x48px).'
      },
      {
        title: 'Internal UX Review with Project Manager',
        details: 'Walk through wireframes with Project Manager to verify alignment with functional specifications and conversion requirements before high-fidelity visual design.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when low-fidelity wireframes and user flows are approved internally by Project Manager and ready for high-fidelity UI design.'
      }
    ]
  },
  {
    name: 'Web Development – UI/UX Design',
    category: 'Design',
    owner: 'UI/UX Designer',
    version: '1.0',
    description: 'Creating high-fidelity, pixel-perfect, responsive UI designs following InfronixWeb premium aesthetic standards.',
    steps_json: [
      {
        title: 'Establish Design System & Tokens in Figma',
        details: 'Define typography scale, color palette (primary, secondary, surface, outline, status colors), elevation/shadows, border-radius tokens, and reusable component library (buttons, inputs, cards, badges).'
      },
      {
        title: 'Design Desktop High-Fidelity Mockups',
        details: 'Craft high-fidelity screens for all approved pages. Ensure strong visual hierarchy, generous whitespace, high-contrast readable typography, subtle micro-interaction states (hover, active, focus), and realistic imagery.'
      },
      {
        title: 'Design Mobile & Tablet Responsive Mockups',
        details: 'Create corresponding mobile viewports (390px iPhone width and 768px tablet width) for key pages to ensure responsive behavior is unambiguous for developers.'
      },
      {
        title: 'Design Interactive States & Micro-interactions',
        details: 'Document interactive states: Button hovers, mobile drawer opening, modal dialogs, form success/error alerts, accordion toggles, and preloader animation.'
      },
      {
        title: 'Internal Creative QA',
        details: 'Review design file with Project Manager against brand guidelines and SOW. Ensure zero placeholder text, correct client branding, and accessibility contrast ratios (WCAG AA >= 4.5:1).'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when complete high-fidelity Figma prototype is finalized and ready for client presentation.'
      }
    ]
  },
  {
    name: 'Web Development – Client Design Approval',
    category: 'Design',
    owner: 'Project Manager',
    version: '1.0',
    description: 'Presenting UI design prototypes to client, collecting consolidated feedback, managing revisions, and securing formal sign-off.',
    steps_json: [
      {
        title: 'Prepare Interactive Design Presentation',
        details: 'Configure Figma clickable prototype with defined starting points for desktop and mobile walkthrough. Test links to ensure smooth navigation.'
      },
      {
        title: 'Conduct Design Walkthrough Meeting',
        details: 'Present designs to client key decision-makers. Explain rationale behind layout choices, user conversion paths, responsive behavior, and visual branding.'
      },
      {
        title: 'Collect & Consolidate Client Feedback',
        details: 'Instruct client to submit consolidated feedback within agreed review window (standard 3-5 business days). Collate feedback in structured tracking sheet.'
      },
      {
        title: 'Execute Design Revisions (Round 1 & Round 2)',
        details: 'UI/UX Designer implements legitimate feedback within SOW scope. If client feedback contradicts earlier approved requirements or requests out-of-scope features, Project Manager clarifies impact and raises Change Request if necessary.'
      },
      {
        title: 'Obtain Formal Written Design Sign-off',
        details: 'Present revised designs for final approval. Secure explicit written sign-off (email or client portal approval) stating UI design is locked for frontend development.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when written design approval is received. Under no circumstances should frontend coding commence without written design approval.'
      }
    ]
  },
  {
    name: 'Web Development – Project Setup',
    category: 'Development',
    owner: 'Web Developer',
    version: '1.0',
    description: 'Initializing Git repository, configuring Next.js framework, environment variables, Tailwind CSS design system, and code quality linters.',
    steps_json: [
      {
        title: 'Initialize GitHub Repository & Branch Protections',
        details: 'Create private GitHub repository under InfronixWeb organization. Set up branch protection on main branch (require PR reviews, passing CI checks). Clone locally.'
      },
      {
        title: 'Initialize Next.js App Router Structure',
        details: 'Scaffold project with latest Next.js App Router, React 19, Tailwind CSS, and Phosphor Icons / Lucide. Clean boilerplate files and establish modular folder structure (src/app, src/components, src/lib, src/context, src/assets).'
      },
      {
        title: 'Configure Design System Tokens in CSS / Tailwind',
        details: 'Implement CSS variables in globals.css for colors, typography font families (Inter, Outfit), container max-widths, and shadows matching the approved Figma design system.'
      },
      {
        title: 'Set Up Environment Variable Management',
        details: 'Create .env.example documenting all required environment keys (DATABASE_URL, NEXT_PUBLIC_SITE_URL, SMTP_*, GA_ID). Ensure .env is strictly ignored in .gitignore.'
      },
      {
        title: 'Configure Linter and Quality Tools',
        details: 'Configure oxlint or ESLint with standard Next.js / React rules to prevent syntax and dependency errors.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when clean baseline build succeeds (npm run build), initial repository commit is pushed, and developer workspace is ready for component development.'
      }
    ]
  },
  {
    name: 'Web Development – Frontend Development',
    category: 'Development',
    owner: 'Web Developer',
    version: '1.0',
    description: 'Building responsive, accessible, high-performance UI components and page layouts matching approved Figma designs.',
    steps_json: [
      {
        title: 'Build Global Shell & Layout Components',
        details: 'Implement RootLayout, Header/Navbar with desktop navigation and mobile drawer, Footer, ToastProvider, and ErrorBoundary components.'
      },
      {
        title: 'Develop Reusable UI Component Library',
        details: 'Build core UI primitives: Button, Input, Select, Modal, Badge, Card, SectionHeader, Breadcrumb, and Accordion with clean functional React patterns.'
      },
      {
        title: 'Construct Page Templates & Content Sections',
        details: 'Code all approved page templates (Hero, Services, Portfolio, About, Team, FAQ, CTA, Contact, Blog). Ensure semantic HTML tags (header, nav, main, section, article, footer, h1-h6).'
      },
      {
        title: 'Implement Micro-Interactions & Animations',
        details: 'Add subtle Framer Motion transitions (fade-in, stagger, hover micro-interactions). Ensure all animations respect prefers-reduced-motion media query.'
      },
      {
        title: 'Conduct Continuous Local Testing',
        details: 'Verify that zero console errors or hydration warnings appear in browser DevTools. Test responsive layout across 320px, 768px, 1024px, 1440px.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when all frontend screens are built, pixel-accurate to Figma, free of console warnings, and pushed to development feature branch.'
      }
    ]
  },
  {
    name: 'Web Development – Backend / CMS Development',
    category: 'Development',
    owner: 'Web Developer',
    version: '1.0',
    description: 'Implementing database models, API route handlers, authentication, and content management endpoints.',
    steps_json: [
      {
        title: 'Design Database Schema & Relations',
        details: 'Create relational PostgreSQL tables with proper data types, primary keys, foreign key constraints, indexes on query fields, and updated_at triggers.'
      },
      {
        title: 'Implement Database Connection Pool & Error Handling',
        details: 'Configure PostgreSQL pool with connection timeout, retry logic for transient network disconnections, and connection string fallback.'
      },
      {
        title: 'Develop REST API Route Handlers',
        details: 'Write Next.js App Router API handlers (/api/...) with explicit HTTP method support (GET, POST, PUT, DELETE), JSON payload validation, and standard HTTP response status codes.'
      },
      {
        title: 'Implement Authentication & Authorization Safeguards',
        details: 'Enforce JWT or session verification on all protected admin/client routes. Validate admin privileges before executing sensitive mutations. Never trust client-supplied user IDs without session validation.'
      },
      {
        title: 'Implement Rate Limiting & Input Sanitization',
        details: 'Add rate limiting to public endpoints (contact forms, auth, enquiry submissions) to prevent bot spam and DoS attempts. Sanitize user inputs against SQL injection and XSS.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when all backend API routes pass automated or manual endpoint testing with valid and invalid payloads, and security checks pass.'
      }
    ]
  },
  {
    name: 'Web Development – Responsive Implementation',
    category: 'Development',
    owner: 'Web Developer',
    version: '1.0',
    description: 'Ensuring flawless responsive adaptability across small mobile screens, large tablets, laptops, and ultra-wide desktop monitors.',
    steps_json: [
      {
        title: 'Mobile-First Breakpoint Audit',
        details: 'Audit every section starting at 320px width (iPhone SE). Ensure no horizontal overflow, no clipped text, proper margin padding (px-4 to px-6), and readable font sizes.'
      },
      {
        title: 'Tablet & Medium Viewport Testing',
        details: 'Test grid layouts at 640px - 1024px (iPad portrait and landscape). Verify that multi-column grids collapse gracefully into 2 columns without overlapping.'
      },
      {
        title: 'Desktop & Ultra-wide Viewport Constraints',
        details: 'Wrap layouts in standard max-w-[1440px] or max-w-[1280px] containers with mx-auto to prevent stretched awkward layouts on 2K/4K displays.'
      },
      {
        title: 'Touch Target & Interaction Verification',
        details: 'Verify all clickable buttons, form fields, and navigation links have a minimum touch target size of 44x44px on mobile touchscreens.'
      },
      {
        title: 'Image & Media Responsiveness',
        details: 'Ensure all Next.js Image components use appropriate sizes attribute, responsive aspect ratios, and object-cover/object-contain styling.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when all pages render seamlessly across Chrome DevTools responsive presets (Mobile S, Mobile L, Tablet, Laptop, 4K) without horizontal scrollbars or layout breakage.'
      }
    ]
  },
  {
    name: 'Web Development – Forms & Integration Setup',
    category: 'Development',
    owner: 'Web Developer',
    version: '1.0',
    description: 'Configuring lead capture forms, validation, mandatory privacy consent checkboxes, email notifications, and CRM webhooks.',
    steps_json: [
      {
        title: 'Implement Form Field Validation',
        details: 'Add client-side and server-side validation for required fields: Name, Email (RFC regex), Phone (E.164 / 10-digit validation), Service selection, Message.'
      },
      {
        title: 'Embed Mandatory Legal Privacy Consent Checkbox',
        details: 'Include mandatory checkbox on all public forms: "I agree to the Privacy Policy and consent to InfronixWeb processing my information." Link directly to /privacy-policy. Prevent submission if unchecked.'
      },
      {
        title: 'Configure Email Notification Delivery',
        details: 'Set up transactional email delivery (Nodemailer / Hostinger Mail / Resend). Send instant notification email to agency inbox and friendly confirmation email to lead.'
      },
      {
        title: 'Implement Spam Protection & Rate Limiting',
        details: 'Add honeypot hidden field and IP-based rate limiting on form submission routes to block automated bots without deteriorating UX.'
      },
      {
        title: 'Connect CRM / Database Storage',
        details: 'Persist every form submission into database with timestamp, IP, source page URL, and UTM parameters for tracking.'
      },
      {
        title: 'Test Form Submission & Error States',
        details: 'Perform live test submissions: verify loading spinner state, successful toast alert / redirect to thank-you page, field reset, email delivery, and error toast on invalid payload.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when all website forms submit reliably, trigger verified emails, record database entries, and enforce mandatory privacy consent.'
      }
    ]
  },
  {
    name: 'Web Development – Basic Technical SEO Setup',
    category: 'Development',
    owner: 'SEO Specialist',
    version: '1.0',
    description: 'Implementing foundational on-page technical SEO, metadata, Open Graph tags, canonical URLs, sitemap.xml, robots.txt, and structured data.',
    steps_json: [
      {
        title: 'Configure Dynamic Page Metadata & Titles',
        details: 'Set unique, compelling <title> and <meta name="description"> tags for every route using Next.js Metadata API. Titles must stay under 60 chars, descriptions between 140-160 chars.'
      },
      {
        title: 'Implement Open Graph and Twitter Card Tags',
        details: 'Set og:title, og:description, og:image (1200x630px high-res webp/png), og:url, og:type, and twitter:card="summary_large_image".'
      },
      {
        title: 'Configure Canonical URLs',
        details: 'Set canonical link tags pointing to preferred HTTPS non-www (or www) domain URL on every page to prevent duplicate content indexing.'
      },
      {
        title: 'Generate Dynamic Sitemap.xml & Robots.txt',
        details: 'Create automated sitemap.xml listing all public indexable routes with lastmod timestamps. Configure robots.txt allowing search engines and disallowing private /admin, /api routes.'
      },
      {
        title: 'Implement Schema.org Structured Data (JSON-LD)',
        details: 'Embed valid JSON-LD schemas: Organization, LocalBusiness (address, geo coordinates, opening hours, phone), WebSite with SearchAction, and BreadcrumbList.'
      },
      {
        title: 'Verify Semantic Heading Hierarchy',
        details: 'Ensure exactly one <h1> tag per page, followed by logical <h2>, <h3> hierarchy without skipped levels.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when Google Rich Results Test passes with zero schema errors, sitemap.xml and robots.txt are accessible, and metadata audits clean.'
      }
    ]
  },
  {
    name: 'Web Development – Performance Optimization',
    category: 'Development',
    owner: 'Web Developer',
    version: '1.0',
    description: 'Optimizing Core Web Vitals, asset compression, font loading, bundle splitting, and server-side caching.',
    steps_json: [
      {
        title: 'Convert & Optimize Images (AVIF / WebP)',
        details: 'Convert all raster assets to modern AVIF or WebP format. Ensure images have explicit width/height or aspect ratios to eliminate Cumulative Layout Shift (CLS).'
      },
      {
        title: 'Optimize Web Fonts Loading',
        details: 'Use next/font/google with display="swap" and subsets=["latin"] to eliminate Flash of Invisible Text (FOIT) and eliminate external render-blocking CSS requests.'
      },
      {
        title: 'Implement Dynamic Imports & Code Splitting',
        details: 'Lazy load heavy non-critical below-the-fold components (e.g., Modals, Calendars, Heavy Animation libraries) using next/dynamic with ssr: false where appropriate.'
      },
      {
        title: 'Optimize Third-Party Scripts',
        details: 'Load analytics and tracking scripts (Google Analytics, Meta Pixel) using @next/third-parties or next/script with strategy="lazyOnload" or "afterInteractive".'
      },
      {
        title: 'Audit Lighthouse / Core Web Vitals Score',
        details: 'Run Google Lighthouse in Chrome Incognito mode. Target scores: Performance >= 90, Accessibility >= 95, Best Practices >= 95, SEO >= 95. Target LCP < 2.5s, CLS < 0.1, INP < 200ms.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when Lighthouse audit achieves target green metrics across desktop and mobile on staging environment.'
      }
    ]
  },
  {
    name: 'Web Development – Developer QA',
    category: 'QA',
    owner: 'Web Developer',
    version: '1.0',
    description: 'Internal developer self-testing, code quality audit, build verification, and zero-error validation before QA handoff.',
    steps_json: [
      {
        title: 'Execute Clean Production Build Test',
        details: 'Run npm run build locally. Ensure the build compiles successfully with zero TypeScript or ESLint errors, zero route generation failures, and optimal static/dynamic page distribution.'
      },
      {
        title: 'Console & Network Inspection',
        details: 'Open browser DevTools on all primary routes. Verify that zero 404 resource errors, zero uncaught JS exceptions, and zero hydration errors occur in the console.'
      },
      {
        title: 'Internal Links & Navigation Audit',
        details: 'Click every header link, footer link, breadcrumb, CTA button, and internal cross-link. Verify no broken links or unintended external redirects.'
      },
      {
        title: 'Check 404 Page & Favicon Implementation',
        details: 'Navigate to invalid URL (e.g. /non-existent-page). Confirm custom branded 404 page renders with helpful navigation back to homepage. Verify favicon.ico and apple-touch-icon display in browser tab.'
      },
      {
        title: 'Submit Code for Peer Review / QA',
        details: 'Create clean Pull Request with descriptive summary of features implemented and request QA Specialist review.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when production build passes cleanly, console is free of errors, and PR is assigned to QA Specialist.'
      }
    ]
  },
  {
    name: 'Web Development – Cross Browser & Device QA',
    category: 'QA',
    owner: 'QA Specialist',
    version: '1.0',
    description: 'Systematic testing across physical devices, operating systems, and browsers to ensure visual and functional consistency.',
    steps_json: [
      {
        title: 'Test Primary Modern Browsers',
        details: 'Test all website routes on latest versions of: Google Chrome, Mozilla Firefox, Apple Safari (macOS & iOS), and Microsoft Edge.'
      },
      {
        title: 'Physical Device Testing (iOS & Android)',
        details: 'Test on physical iOS (iPhone Safari) and Android (Chrome) devices. Verify touch responsiveness, form keyboard behavior, modal dismissals, and sticky navigation.'
      },
      {
        title: 'Test Form & Interactive Submissions Across Devices',
        details: 'Submit all forms from Safari iOS and Android Chrome. Confirm touch keyboards display correct types (numeric keypad for phone, email keyboard for email) and success toast displays correctly.'
      },
      {
        title: 'Log Defects in QA Bug Tracker',
        details: 'Log any layout clipping, font rendering differences, or interaction glitches in Founder OS / issue tracker with device model, OS version, screenshot, and reproduction steps.'
      },
      {
        title: 'Retest Resolved Defects',
        details: 'Verify developer bug fixes on original failing device/browser before closing the ticket.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when zero Critical or High severity visual or functional bugs remain across all supported browser/device combinations.'
      }
    ]
  },
  {
    name: 'Web Development – Client Review',
    category: 'QA',
    owner: 'Project Manager',
    version: '1.0',
    description: 'Deploying staging preview link to client, guiding user acceptance review, and collecting consolidated feedback.',
    steps_json: [
      {
        title: 'Deploy Staging Environment & Lock Password',
        details: 'Deploy build to preview/staging URL (e.g. staging.clientdomain.com or Vercel preview). If sensitive or unreleased, enable HTTP basic auth / password protection.'
      },
      {
        title: 'Prepare Client Staging Handover Email',
        details: 'Send email to client containing: Staging URL, credentials (if protected), Review Guide, and feedback submission deadline (standard 5 business days).'
      },
      {
        title: 'Conduct Interactive Staging Walkthrough Call',
        details: 'Host 30-minute walkthrough call demonstrating key pages, mobile navigation, and form workflows. Clarify how client should document feedback.'
      },
      {
        title: 'Manage Client Review Window',
        details: 'Send friendly reminder 48 hours prior to review deadline. Follow up to ensure client is actively testing and capturing notes.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when client submits consolidated feedback document or confirms in writing that staging review is finished.'
      }
    ]
  },
  {
    name: 'Web Development – Revision Management',
    category: 'Development',
    owner: 'Project Manager',
    version: '1.0',
    description: 'Evaluating client feedback against approved SOW, prioritizing tasks, delegating fixes, and managing scope boundaries.',
    steps_json: [
      {
        title: 'Audit Client Feedback Against SOW Scope',
        details: 'Categorize every item in client feedback sheet: 1) Legitimate bug/tweak within scope, 2) Design refinement within 2-round allowance, 3) Out-of-scope feature request.'
      },
      {
        title: 'Handle Scope Creep Items',
        details: 'If client requests new pages, complex new integrations, or unapproved architecture changes: Do not reject aggressively; instead document the request, calculate additional time and cost estimate, and issue Change Request for client approval before coding.'
      },
      {
        title: 'Create Revision Tasks for Development Team',
        details: 'Break approved in-scope revision items into clear developer tasks with screenshots and acceptance criteria.'
      },
      {
        title: 'Implement Revisions & Internal QA',
        details: 'Web developer implements fixes. QA Specialist verifies each item on staging environment before client re-presentation.'
      },
      {
        title: 'Present Revised Staging & Obtain Final Approval',
        details: 'Share updated staging URL with client, cross-referencing completed feedback items. Obtain formal written sign-off for production deployment.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when all approved revision items are verified and client provides written sign-off authorizing production launch.'
      }
    ]
  },
  {
    name: 'Web Development – Pre-Deployment Checklist',
    category: 'QA',
    owner: 'QA Specialist',
    version: '1.0',
    description: 'Comprehensive pre-launch quality checklist covering forms, SEO, analytics, legal links, security, and credentials before DNS switch.',
    steps_json: [
      {
        title: 'Verify Form Deliverability & Notifications',
        details: 'Submit test message on every contact form and lead capture widget on staging. Verify that live client email addresses receive notifications and records store in DB.'
      },
      {
        title: 'Check Legal & Compliance Requirements',
        details: 'Verify that Privacy Policy, Terms of Service, and Cookie Consent banner (if required) are populated with client legal business details and valid contact info.'
      },
      {
        title: 'Verify SEO Metadata, Robots, & Favicons',
        details: 'Confirm all pages have non-placeholder titles, meta descriptions, Open Graph preview images, valid canonical URLs, and favicon assets across all devices.'
      },
      {
        title: 'Verify Analytics & Pixel Snippets',
        details: 'Verify Google Tag Manager, GA4 ID, or Meta Pixel are configured with production measurement IDs.'
      },
      {
        title: 'Check SSL / HTTPS Readiness & Environment Secrets',
        details: 'Confirm all production API keys, database credentials, and SMTP secrets are populated in production hosting provider (Vercel/Hostinger/Cloudflare). Ensure no development credentials leak to production.'
      },
      {
        title: 'Verify Final Payment Status',
        details: 'Confirm with Finance that milestone payment required prior to production deployment has been received or approved by Founder.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when all items on pre-deployment checklist are marked PASSED with zero pending critical blockers.'
      }
    ]
  },
  {
    name: 'Web Development – Production Deployment',
    category: 'Deployment',
    owner: 'Web Developer',
    version: '1.0',
    description: 'Executing production build deployment, environment configuration, database migrations, and health check verification.',
    steps_json: [
      {
        title: 'Trigger Production Build Deployment',
        details: 'Merge approved staging/development PR into main branch. Trigger production deployment on hosting platform (Vercel, Hostinger, AWS).'
      },
      {
        title: 'Execute Database Migrations',
        details: 'Run any required production PostgreSQL migrations. Verify table schemas, indexes, and initial configuration rows.'
      },
      {
        title: 'Verify Production Environment Variables',
        details: 'Double check that all production environment variables (NEXT_PUBLIC_SITE_URL, DATABASE_URL, SMTP_PASSWORD, API_KEYS) are loaded properly by the container / serverless runtime.'
      },
      {
        title: 'Conduct Live Post-Deployment Smoke Test',
        details: 'Open live production URL immediately: 1) Test navigation through all pages, 2) Submit live test enquiry form, 3) Check browser console for runtime JS errors, 4) Verify SSL padlock in address bar.'
      },
      {
        title: 'Monitor Server Logs & Error Rates',
        details: 'Monitor deployment runtime logs for 15 minutes post-launch to catch any 500 server errors or uncaught exceptions.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when production website is live, responsive, submitting forms, and exhibiting zero server or client-side runtime errors.'
      }
    ]
  },
  {
    name: 'Web Development – Domain & DNS Configuration',
    category: 'Deployment',
    owner: 'Web Developer',
    version: '1.0',
    description: 'Configuring domain registrar DNS records, A records, CNAME, TXT verification, SSL/TLS certificates, and www redirection.',
    steps_json: [
      {
        title: 'Collect Domain Registrar Access or Provide Records',
        details: 'Obtain temporary delegated access to client domain registrar (Hostinger, GoDaddy, Namecheap, Cloudflare) or prepare exact DNS record instructions for client IT team.'
      },
      {
        title: 'Configure Primary A and CNAME Records',
        details: 'Point apex domain (@) and www subdomain to production hosting IP / CNAME target (e.g. 76.76.21.21 or cname.vercel-dns.com).'
      },
      {
        title: 'Configure Canonical www vs non-www Redirection',
        details: 'Set 301 permanent redirect from www to non-www (or vice versa according to client preference) to prevent split SEO link equity.'
      },
      {
        title: 'Provision & Verify SSL/TLS Certificate',
        details: 'Confirm SSL/TLS certificate is provisioned and valid with automatic HTTPS redirect and HSTS header.'
      },
      {
        title: 'Verify Global DNS Propagation',
        details: 'Use whatsmydns.net or dig command to verify DNS propagation across major global nameservers.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when domain resolves securely via HTTPS across global nameservers with valid SSL certificate and clean www redirect.'
      }
    ]
  },
  {
    name: 'Web Development – Analytics Setup',
    category: 'Deployment',
    owner: 'Digital Marketing Manager',
    version: '1.0',
    description: 'Configuring Google Analytics 4 (GA4), Google Search Console, event conversion tracking, and Search Console sitemap submission.',
    steps_json: [
      {
        title: 'Create & Configure GA4 Property',
        details: 'Set up Google Analytics 4 property for client domain. Configure Enhanced Measurement (page views, scrolls, outbound clicks, site search, form interactions).'
      },
      {
        title: 'Configure Custom Conversion Events in GA4',
        details: 'Create custom conversion events for: form_submit, whatsapp_click, phone_call_click, get_quote_click. Mark as key events.'
      },
      {
        title: 'Verify Google Search Console Ownership',
        details: 'Verify property ownership in Google Search Console via DNS TXT record or HTML meta tag.'
      },
      {
        title: 'Submit XML Sitemap in Search Console',
        details: 'Submit live sitemap URL (https://domain.com/sitemap.xml) in Google Search Console. Verify status is "Success".'
      },
      {
        title: 'Test Live Realtime Tracking',
        details: 'Open website from test device and verify active user session, page views, and event triggers in GA4 Realtime dashboard.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when GA4 and Search Console are verified, events fire in realtime, and sitemap is successfully submitted.'
      }
    ]
  },
  {
    name: 'Web Development – Security Review',
    category: 'Security',
    owner: 'Web Developer',
    version: '1.0',
    description: 'Auditing security headers, database credentials, API protection, XSS/CORS configuration, and least-privilege access.',
    steps_json: [
      {
        title: 'Audit HTTP Security Headers',
        details: 'Verify presence of security headers in next.config.mjs / server response: X-Content-Type-Options: nosniff, X-Frame-Options: DENY, Referrer-Policy: strict-origin-when-cross-origin, Permissions-Policy.'
      },
      {
        title: 'Audit Source Code for Hardcoded Secrets',
        details: 'Scan repository for hardcoded passwords, private keys, database connection strings, or SMTP tokens. Ensure all credentials are exclusively retrieved from process.env.'
      },
      {
        title: 'Verify API Rate Limiting & Input Validation',
        details: 'Ensure public API endpoints have rate limiters active and reject oversized or malicious payloads.'
      },
      {
        title: 'Test Authentication & Route Protection',
        details: 'Attempt unauthenticated access to /admin, /api/founder-os, and client portal routes. Confirm instant 401 Unauthorized or redirect to login.'
      },
      {
        title: 'Review Database Connection Security',
        details: 'Confirm database pool uses SSL with encrypted transport. Verify least-privilege database user permissions.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when security audit passes with zero exposed secrets, verified security headers, and robust route protections.'
      }
    ]
  },
  {
    name: 'Web Development – Credential Management',
    category: 'Security',
    owner: 'Project Manager',
    version: '1.0',
    description: 'Securing, documenting, and managing client and infrastructure access keys in agency encrypted vault.',
    steps_json: [
      {
        title: 'Store Credentials in Secure Password Manager',
        details: 'Record all client credentials (domain registrar, hosting, SMTP, analytics, CMS) inside agency encrypted password vault (1Password / Bitwarden / Founder OS Key Vault). Never store passwords in plain text notes or chat channels.'
      },
      {
        title: 'Apply Least Privilege Team Access',
        details: 'Grant access only to team members actively assigned to the project. Use individual team accounts rather than sharing master credentials wherever supported.'
      },
      {
        title: 'Rotate Temporary Passwords Post-Launch',
        details: 'If temporary passwords were created during development, change them to permanent high-entropy passwords (>= 16 characters).'
      },
      {
        title: 'Prepare Secure Credential Handover Document',
        details: 'Generate encrypted credential handover sheet for client with master administrator login details and instructions on how to change them.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when all project credentials are securely vaulted, redundant access is revoked, and client receives secure handover.'
      }
    ]
  },
  {
    name: 'Web Development – Backup Setup',
    category: 'Deployment',
    owner: 'Web Developer',
    version: '1.0',
    description: 'Configuring automated database and code backups, retention schedules, and testing restore procedures.',
    steps_json: [
      {
        title: 'Configure Automated Database Backups',
        details: 'Set up daily automated PostgreSQL backups with 30-day retention schedule on Supabase / cloud provider.'
      },
      {
        title: 'Verify Git Repository Redundancy',
        details: 'Ensure all production code is tagged with release version (e.g. v1.0.0) on GitHub main branch with clean commit history.'
      },
      {
        title: 'Test Backup Restoration Procedure',
        details: 'Perform a test restore from backup database snapshot to a development/staging database to verify data integrity and recovery procedure.'
      },
      {
        title: 'Document Disaster Recovery Steps',
        details: 'Write brief disaster recovery note in project documentation explaining exact steps to restore site in case of server failure.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when automated daily backups are verified active and restoration procedure has been successfully tested.'
      }
    ]
  },
  {
    name: 'Web Development – Final Handover',
    category: 'Offboarding',
    owner: 'Project Manager',
    version: '1.0',
    description: 'Conducting final handover training session, delivering documentation, and transferring administrative ownership.',
    steps_json: [
      {
        title: 'Prepare Handover Documentation & User Manual',
        details: 'Compile comprehensive Project Handover Guide covering: CMS content updates, lead form management, analytics access, and support escalation contacts.'
      },
      {
        title: 'Schedule & Conduct Client Handover / Training Call',
        details: 'Host 45-minute live training session showing client team how to edit content, review leads, and check analytics. Record the session and provide video link.'
      },
      {
        title: 'Transfer Master Administrative Access',
        details: 'Transfer primary ownership of domain, hosting, analytics, and CMS to client designated administrator. Retain secondary agency access if maintenance contract is active.'
      },
      {
        title: 'Issue Final Acceptance Certificate',
        details: 'Send Project Acceptance Form for client signature confirming all deliverables under SOW have been received in good order.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when client signs Project Acceptance Form and training recording and documentation are delivered.'
      }
    ]
  },
  {
    name: 'Web Development – Project Closure',
    category: 'Offboarding',
    owner: 'Account Manager',
    version: '1.0',
    description: 'Final invoice reconciliation, team debrief, customer satisfaction review, and archiving project workspace.',
    steps_json: [
      {
        title: 'Reconcile Final Payment with Finance',
        details: 'Confirm all milestone payments and approved change request fees are 100% cleared in bank account.'
      },
      {
        title: 'Request Client Review / Testimonial',
        details: 'Send friendly request for Google Business Review / Clutch review and video or written testimonial highlighting project results.'
      },
      {
        title: 'Conduct Internal Team Post-Mortem',
        details: 'Hold brief internal debrief with developer, designer, and PM: evaluate estimated vs actual hours, margin profitability, and lessons learned.'
      },
      {
        title: 'Pitch Maintenance / Retainer Package',
        details: 'Present InfronixWeb Website Care & Maintenance Retainer or SEO / Digital Marketing expansion proposal to client.'
      },
      {
        title: 'Archive Project Workspace',
        details: 'Update project status to "Completed" in Founder OS. Archive temporary staging branches in Git.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when final payment is reconciled, review is requested, internal post-mortem is documented, and project status is marked Completed.'
      }
    ]
  },
  {
    name: 'Web Development – Maintenance Workflow',
    category: 'Development',
    owner: 'Web Developer',
    version: '1.0',
    description: 'Routine monthly maintenance, dependency updates, security patches, uptime monitoring, and backup health checks.',
    steps_json: [
      {
        title: 'Perform Monthly Dependency & Security Audit',
        details: 'Run npm audit and update outdated packages in development environment. Test for breaking changes before deploying to production.'
      },
      {
        title: 'Verify Uptime & Performance Monitoring',
        details: 'Check uptime logs (Better Uptime / UptimeRobot). Investigate any recorded downtime incidents or slow response spikes.'
      },
      {
        title: 'Test Live Forms & Key User Flows',
        details: 'Perform monthly test submission on live website forms to confirm ongoing SMTP deliverability and CRM webhook functionality.'
      },
      {
        title: 'Check Backup Storage Integrity',
        details: 'Verify that daily database backups are executing without failure and storage quotas are within safe thresholds.'
      },
      {
        title: 'Send Monthly Maintenance Summary to Client',
        details: 'Generate concise monthly maintenance report detailing uptime percentage, security updates applied, and backup status.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when all maintenance checks are executed, dependencies updated, forms verified, and monthly summary sent to retainer client.'
      }
    ]
  }
];
