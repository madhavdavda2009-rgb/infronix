export const seoSOPs = [
  {
    name: 'SEO – Client Qualification',
    category: 'Sales',
    owner: 'Sales Manager',
    version: '1.0',
    description: 'Assessing prospect website viability, business model, realistic organic growth expectations, penalty history, and budget before signing an SEO retainer.',
    steps_json: [
      {
        title: 'Evaluate Prospect Domain & Indexing Status',
        details: 'Perform quick site:domain.com search and domain age check in Ahrefs/Semrush. Verify whether the domain is indexed, deindexed, or suffering from past manual/algorithmic Google penalties.'
      },
      {
        title: 'Assess Market Competitiveness & Search Demand',
        details: 'Check search volume for primary commercial keywords in the client target geography (e.g., Ahmedabad, Gujarat, India, or International). Determine if search intent aligns with their service offerings.'
      },
      {
        title: 'Set Realistic Expectations & Ban Result Guarantees',
        details: 'Explicitly explain to the client that organic SEO is an iterative 3 to 6-month compounding process. Strictly refuse any contract guaranteeing "#1 ranking in 30 days" as Google search algorithms cannot be guaranteed by any legitimate agency.'
      },
      {
        title: 'Determine Technical Access Requirements',
        details: 'Confirm whether the client can provide Google Search Console, Google Analytics, CMS/codebase access, and domain DNS access. If the client platform is completely locked (e.g. rigid legacy proprietary ERP with no meta tag control), evaluate technical feasibility before signing.'
      },
      {
        title: 'Qualification Sign-off & Retainer Proposal',
        details: 'If qualified, formulate custom SEO Retainer Proposal based on required scope (Technical, On-Page, Content, Local, Digital PR). If unqualified (e.g., black-hat requests or zero budget), document decline reason.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when lead is qualified with documented domain baseline and realistic expectations, and moved to contract stage.'
      }
    ]
  },
  {
    name: 'SEO – Client Onboarding',
    category: 'Client Onboarding',
    owner: 'Account Manager',
    version: '1.0',
    description: 'Setting up client communication, project tracking in Founder OS, baseline metric capture, and initial SEO kickoff call.',
    steps_json: [
      {
        title: 'Confirm Advance Retainer Payment',
        details: 'Verify with Finance that monthly retainer advance has cleared before initiating research and optimization tasks.'
      },
      {
        title: 'Create SEO Project & Milestone Board',
        details: 'Set up SEO Project workspace in Founder OS. Define Month 1 Deliverables: Technical Audit, Keyword Research & Mapping, GSC/GA4 Configuration, On-Page Core Optimizations.'
      },
      {
        title: 'Issue SEO Intake Questionnaire',
        details: 'Send client intake questionnaire to capture: Top 3 priority services/products, Target geographies, Top 3-5 recognized competitors, Brand positioning guidelines, and Negative keywords to avoid.'
      },
      {
        title: 'Schedule & Conduct Kickoff Call',
        details: 'Host 30-minute kickoff meeting with SEO Specialist and Client. Align on primary KPI goals (organic lead growth, non-brand impressions, target keyword movements) and monthly reporting schedule.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when onboarding questionnaire is completed, kickoff minutes are shared, and technical access collection is underway.'
      }
    ]
  },
  {
    name: 'SEO – Website Access Collection',
    category: 'Client Onboarding',
    owner: 'SEO Specialist',
    version: '1.0',
    description: 'Gathering and verifying delegated user permissions for Google Search Console, Google Analytics 4, Tag Manager, CMS, and hosting.',
    steps_json: [
      {
        title: 'Request Google Search Console Delegated Access',
        details: 'Request "Full" or "Owner" delegated user permissions in Google Search Console for InfronixWeb agency Google account.'
      },
      {
        title: 'Request Google Analytics 4 & Tag Manager Access',
        details: 'Request "Editor" or "Administrator" access to GA4 property and GTM container.'
      },
      {
        title: 'Request CMS / Website Backend Access',
        details: 'Obtain dedicated developer/admin login credentials for WordPress, Next.js repository, Shopify, or custom CMS. Store credentials immediately in encrypted password manager.'
      },
      {
        title: 'Request Google Business Profile Access (Local SEO)',
        details: 'For local businesses, request "Manager" access to client Google Business Profile via agency Business Manager.'
      },
      {
        title: 'Verify Access & Permissions Functionality',
        details: 'Log into each tool and verify active read/write permissions. If access is restricted or pending 2FA authorization, coordinate with client to resolve within 24 hours.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when all required SEO platform accesses are tested, verified, and vaulted securely.'
      }
    ]
  },
  {
    name: 'SEO – Analytics & Search Console Setup',
    category: 'Development',
    owner: 'SEO Specialist',
    version: '1.0',
    description: 'Setting up, auditing, and linking Google Search Console and GA4 properties, configuring conversion goals, and excluding internal IP traffic.',
    steps_json: [
      {
        title: 'Link GSC Property to GA4',
        details: 'In GA4 Admin, configure Search Console Link to import Search Queries and Organic Landing Pages reports directly into GA4 analytics view.'
      },
      {
        title: 'Configure Internal IP Traffic Filters',
        details: 'Add IP exclusion filters in GA4 for client office IPs and InfronixWeb agency IPs to prevent staff browsing from polluting organic analytics data.'
      },
      {
        title: 'Define Organic Conversion Key Events',
        details: 'Ensure key conversion events (form_submit, phone_click, whatsapp_chat, contact_inquiry) are marked as Key Events in GA4 to accurately attribute organic conversions.'
      },
      {
        title: 'Submit XML Sitemap in Google Search Console',
        details: 'Verify primary sitemap URL (e.g. /sitemap.xml) is submitted in GSC and inspect indexed page count against total published URL count.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when GSC and GA4 are linked, internal traffic is filtered, organic conversions are tracking, and sitemap returns Success.'
      }
    ]
  },
  {
    name: 'SEO – Initial Website Audit',
    category: 'QA',
    owner: 'SEO Specialist',
    version: '1.0',
    description: 'High-level preliminary audit capturing domain metrics, organic visibility, site architecture, and identifying immediate quick-win opportunities.',
    steps_json: [
      {
        title: 'Record Baseline Visibility & Organic Traffic',
        details: 'Record historical 12-month organic traffic, current ranking keywords count (Top 3, Top 10, Top 50), and domain rating/authority score in audit spreadsheet.'
      },
      {
        title: 'Evaluate Site Architecture & URL Hierarchy',
        details: 'Inspect navigation structure, depth of service pages (all key pages must be within 3 clicks of homepage), and logical siloing of topic clusters.'
      },
      {
        title: 'Scan for High-Impact Quick Wins',
        details: 'Identify pages ranking on Page 2 (Positions 11-20) with high search volume, missing title tags on core landing pages, or orphaned high-value content.'
      },
      {
        title: 'Compile Initial Audit Deck',
        details: 'Synthesize findings into an executive summary deck outlining current strengths, critical bottlenecks, and 90-day strategic roadmap.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when Initial Audit summary is documented, reviewed with Project Manager, and ready to guide deep technical and keyword workflows.'
      }
    ]
  },
  {
    name: 'SEO – Technical SEO Audit',
    category: 'QA',
    owner: 'SEO Specialist',
    version: '1.0',
    description: 'Comprehensive crawl and deep technical audit using Screaming Frog / Sitebulb covering HTTP status codes, indexing, redirects, canonicals, and Core Web Vitals.',
    steps_json: [
      {
        title: 'Perform Full Screaming Frog Site Crawl',
        details: 'Execute comprehensive crawl with JS rendering enabled if Next.js/React site. Export complete crawl dataset for analysis.'
      },
      {
        title: 'Audit HTTP Response Codes & Broken Links',
        details: 'Identify all 4xx client errors, 5xx server errors, broken internal links, and broken external links. Check for redirect chains (A -> B -> C) and update internal links directly to final destination (A -> C).'
      },
      {
        title: 'Audit Indexability & Meta Robots Directives',
        details: 'Check for accidental noindex tags on live money pages, unindexed orphaned pages, or robots.txt rules blocking critical CSS/JS assets or service routes.'
      },
      {
        title: 'Audit Canonical Tags & Duplicate Content',
        details: 'Verify every indexable URL has a self-referential canonical tag or points to the master version. Check for HTTP/HTTPS or www/non-www duplicate versions.'
      },
      {
        title: 'Inspect XML Sitemap & Robots.txt Integrity',
        details: 'Ensure XML sitemap contains only 200 OK indexable canonical URLs. Zero 404, 301, or noindexed URLs allowed in sitemap. Confirm sitemap URL is referenced in robots.txt.'
      },
      {
        title: 'Prioritize Technical Fixes in Action Matrix',
        details: 'Group technical issues by impact: Critical (Blocker), High (Direct SEO impact), Medium (Best practice). Assign developer tickets in Founder OS.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when Technical SEO Audit report is completed with prioritized developer action tickets created and assigned.'
      }
    ]
  },
  {
    name: 'SEO – Keyword Research',
    category: 'Development',
    owner: 'SEO Specialist',
    version: '1.0',
    description: 'Identifying high-intent commercial, transactional, and informational keywords matching client service offerings and target buyer personas.',
    steps_json: [
      {
        title: 'Seed Keyword Brainstorming & Taxonomy',
        details: 'List all core services, product lines, and sub-categories. Brainstorm variations including problem-aware searches, localized searches ("in Ahmedabad", "near me"), and industry-specific modifiers.'
      },
      {
        title: 'Extract Keyword Data via Professional Tools',
        details: 'Query Google Keyword Planner, Ahrefs, and Semrush for search volumes, Keyword Difficulty (KD), Cost-Per-Click (CPC), and historical trend patterns.'
      },
      {
        title: 'Filter & Categorize by Search Intent',
        details: 'Classify keywords into intent buckets: Transactional/Commercial (Buy/Hire intent), Informational (How-to/Guides), and Navigational. Discard irrelevant, excessively broad, or out-of-market search terms.'
      },
      {
        title: 'Identify Long-Tail & Low-Difficulty Opportunities',
        details: 'Uncover low-KD long-tail keyword clusters capable of driving targeted organic leads within the first 60-90 days while higher difficulty head terms compound.'
      },
      {
        title: 'Compile Master Keyword Repository',
        details: 'Organize selected keywords in Master SEO Spreadsheet with metrics: Monthly Volume, KD, Current Rank, Target URL, and Intent Classification.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when Master Keyword List is reviewed and approved by Project Manager, ready for intent mapping.'
      }
    ]
  },
  {
    name: 'SEO – Search Intent Analysis',
    category: 'Development',
    owner: 'SEO Specialist',
    version: '1.0',
    description: 'Analyzing live Google SERP layouts and top-ranking competitors to ensure target page formats match search engine and user expectations.',
    steps_json: [
      {
        title: 'Inspect Live Google SERP for Target Keywords',
        details: 'Search priority keywords in incognito browser with targeted location set. Observe SERP features: Local 3-Pack, Featured Snippets, People Also Ask (PAA), Image Pack, Video carousel.'
      },
      {
        title: 'Analyze Top 3 Ranking Page Formats',
        details: 'Examine top 3 organic competitors: Are they service landing pages, long-form comparison guides, product catalogs, or directory listings? Do not build an informational blog post for a query where Google exclusively ranks transactional service pages.'
      },
      {
        title: 'Identify Content Depth & Structural Patterns',
        details: 'Note common heading structures, FAQ questions answered, pricing tables, interactive tools, and media formats used by top rankers.'
      },
      {
        title: 'Document Required Page Type & Content Elements',
        details: 'Specify exact required page template (Service Page vs Long-form Guide vs Comparison Table) for each target keyword group in the keyword map.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when search intent classification is documented for all target keyword groups with explicit page format guidelines.'
      }
    ]
  },
  {
    name: 'SEO – Competitor Research',
    category: 'Development',
    owner: 'SEO Specialist',
    version: '1.0',
    description: 'Reverse-engineering top 3-5 organic search competitors to uncover high-ranking content topics, backlink profiles, and SERP strategies.',
    steps_json: [
      {
        title: 'Identify True Organic Search Competitors',
        details: 'Distinguish direct business competitors from organic SERP competitors (domains consistently ranking for client target keywords in Google).'
      },
      {
        title: 'Analyze Competitor Top Pages & Keyword Share',
        details: 'Run competitor domains in Ahrefs/Semrush. Export top traffic-driving pages, estimated monthly traffic value, and primary keyword rankings.'
      },
      {
        title: 'Perform Content & Feature Gap Analysis',
        details: 'Compare client sitemap against competitor top pages. Identify high-value service pages, tools, calculators, or case studies present on competitor sites but missing from client site.'
      },
      {
        title: 'Analyze Competitor Backlink Acquisition Strategies',
        details: 'Inspect competitor referring domains: Uncover directory citations, editorial features, industry associations, and guest articles contributing to their domain authority.'
      },
      {
        title: 'Formulate Competitive Counter-Strategy',
        details: 'Document actionable tactics to outrank competitors through superior content depth, faster page speed, cleaner UX, and targeted local citations.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when Competitor SEO Intelligence report is archived and insights are integrated into the content & optimization roadmap.'
      }
    ]
  },
  {
    name: 'SEO – Keyword Mapping',
    category: 'Development',
    owner: 'SEO Specialist',
    version: '1.0',
    description: 'Assigning dedicated primary, secondary, and long-tail keyword clusters to specific existing or newly planned URLs to prevent keyword cannibalization.',
    steps_json: [
      {
        title: 'Map Existing URLs to Target Keyword Clusters',
        details: 'Assign one primary keyword and 3-5 closely related secondary keywords to each existing page on the website.'
      },
      {
        title: 'Detect & Resolve Keyword Cannibalization',
        details: 'Check if multiple pages are competing for the exact same target keyword. If found: Consolidate content into one authoritative master page with 301 redirect, or re-optimize secondary page for distinct search intent.'
      },
      {
        title: 'Identify Missing Pages (New URL Opportunities)',
        details: 'For high-value keyword clusters with no relevant existing page, plan new dedicated landing pages or blog articles with recommended slug URLs.'
      },
      {
        title: 'Define On-Page Specs for Each Mapped URL',
        details: 'For every mapped URL, specify: Proposed Title Tag, Meta Description, H1 Heading, Target Word Count, and Primary Call-to-Action.'
      },
      {
        title: 'Client Review & Sign-off on Keyword Map',
        details: 'Share Keyword Mapping spreadsheet with client and Project Manager. Secure approval before implementing on-page changes.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when approved Keyword Map covers 100% of target services with zero unmapped keywords and zero cannibalization conflicts.'
      }
    ]
  },
  {
    name: 'SEO – On-Page Optimization',
    category: 'Development',
    owner: 'SEO Specialist',
    version: '1.0',
    description: 'Executing comprehensive on-page optimizations across copy, headings, media, formatting, and conversion elements based on the approved keyword map.',
    steps_json: [
      {
        title: 'Optimize Primary H1 and Heading Hierarchy',
        details: 'Ensure page has exactly one H1 featuring the primary target keyword naturally. Use H2 and H3 tags incorporating secondary semantic keywords and LSI variations.'
      },
      {
        title: 'Enhance Body Copy & Semantic Keyword Density',
        details: 'Incorporate target keywords naturally within the first 100 words, body paragraphs, and concluding sections. Avoid unnatural keyword stuffing (maintain conversational readability).'
      },
      {
        title: 'Add FAQs with Structured Accordion / JSON-LD',
        details: 'Add 4-6 frequently asked questions answering common customer queries directly from Google "People Also Ask" data. Implement FAQPage schema.'
      },
      {
        title: 'Optimize Call-to-Action Placement',
        details: 'Ensure clear, compelling lead conversion elements (quote button, consultation form, WhatsApp widget) appear above the fold and at logical intervals throughout the content.'
      },
      {
        title: 'Review Page Usability & Readability',
        details: 'Use short paragraphs, bullet points, bold key phrases, and high-contrast typography to maximize dwell time and reduce bounce rate.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when on-page optimizations are implemented on target page, verified against keyword map, and published.'
      }
    ]
  },
  {
    name: 'SEO – Title & Meta Optimization',
    category: 'Development',
    owner: 'SEO Specialist',
    version: '1.0',
    description: 'Crafting and deploying click-through-rate (CTR) optimized title tags and compelling meta descriptions for all indexable pages.',
    steps_json: [
      {
        title: 'Audit Existing Page Metadata',
        details: 'Review the title tag and meta description of every indexable page. Check for missing, duplicated, irrelevant, excessively long, or outdated metadata. Record affected URLs and prepare corrected metadata based on the approved keyword mapping before making production changes.'
      },
      {
        title: 'Write High-CTR Title Tags',
        details: 'Format title tags: [Primary Keyword] - [Secondary Modifier / Value Prop] | [Brand Name]. Keep character count between 50-60 characters (max 580px width) to avoid truncation in Google SERPs.'
      },
      {
        title: 'Write Compelling Meta Descriptions',
        details: 'Craft meta descriptions between 140-155 characters summarizing page value proposition with secondary keywords and a clear call to action (e.g., "Get a free quote today.").'
      },
      {
        title: 'Avoid Keyword Stuffing & Duplication',
        details: 'Ensure every page on the domain has a 100% unique title tag and meta description. Never repeat identical boilerplate text across multiple URLs.'
      },
      {
        title: 'Deploy to Codebase / CMS & Request Indexing',
        details: 'Update Next.js page metadata / CMS fields. Inspect updated live HTML <head>. Submit modified URLs to Google Search Console URL Inspection tool for re-crawling.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when all indexable pages have unique, optimized metadata verified in live source code with zero truncation issues.'
      }
    ]
  },
  {
    name: 'SEO – Heading Structure Optimization',
    category: 'Development',
    owner: 'SEO Specialist',
    version: '1.0',
    description: 'Structuring logical semantic heading hierarchy (H1 -> H2 -> H3) across all page templates for accessibility and search engine readability.',
    steps_json: [
      {
        title: 'Audit Existing Headings via Screaming Frog / DOM',
        details: 'Inspect all pages for common heading defects: Multiple H1 tags on a single page, missing H1 tags, skipped heading levels (H1 directly to H3), or decorative text wrapped in heading tags.'
      },
      {
        title: 'Enforce Single Meaningful H1 Rule',
        details: 'Ensure every page contains exactly one H1 clearly communicating the core topic and primary target keyword.'
      },
      {
        title: 'Structure H2 Section Headers with Semantic Topics',
        details: 'Divide page content into distinct logical subsections using H2 tags covering sub-services, features, benefits, process steps, and FAQs.'
      },
      {
        title: 'Nest H3 & H4 Sub-items Correctly',
        details: 'Use H3 tags exclusively inside parent H2 containers (e.g., individual service cards under an H2 "Our Services"). Never use heading tags purely for visual styling.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when heading hierarchy validator confirms clean logical outline (H1 > H2 > H3) with zero skipped levels on all audited pages.'
      }
    ]
  },
  {
    name: 'SEO – Internal Linking',
    category: 'Development',
    owner: 'SEO Specialist',
    version: '1.0',
    description: 'Designing and implementing strategic internal link architecture, topic clusters, and contextual anchor text to distribute PageRank effectively.',
    steps_json: [
      {
        title: 'Map Topic Clusters & Parent-Child Relationships',
        details: 'Group related pages into topic clusters: Pillar page (e.g. /web-development) linked bidirectionally to supporting cluster articles (e.g. Next.js, E-commerce, Performance optimization).'
      },
      {
        title: 'Add Contextual In-Body Internal Links',
        details: 'Insert 2-4 relevant contextual internal links within body copy connecting related services and informational guides.'
      },
      {
        title: 'Optimize Anchor Text Variety',
        details: 'Use descriptive, relevant anchor text reflecting the target page topic. Avoid generic anchors like "click here", "read more", or over-optimized identical exact-match anchors repeatedly.'
      },
      {
        title: 'Eliminate Orphaned Pages',
        details: 'Identify pages with zero incoming internal links in Screaming Frog. Link all valid indexable pages from at least one contextual or navigational parent page.'
      },
      {
        title: 'Audit Breadcrumb Navigation Links',
        details: 'Ensure hierarchical breadcrumb trails exist on all sub-pages with valid BreadcrumbList JSON-LD schema.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when zero orphaned indexable pages remain and contextual internal links are active across all target topic clusters.'
      }
    ]
  },
  {
    name: 'SEO – Image SEO',
    category: 'Development',
    owner: 'SEO Specialist',
    version: '1.0',
    description: 'Optimizing image filenames, descriptive alt text, modern AVIF/WebP formats, responsive dimensions, and image sitemaps.',
    steps_json: [
      {
        title: 'Optimize Image Filenames Before Upload',
        details: 'Rename image files using descriptive, hyphen-separated keywords (e.g., indev-web-development-team.avif instead of IMG_29482.jpg).'
      },
      {
        title: 'Write Accurate, Descriptive Alt Text',
        details: 'Add meaningful alt attributes describing the image content and visual context. Include relevant keywords naturally. Never leave alt text empty on informative images; use alt="" only on purely decorative graphics.'
      },
      {
        title: 'Convert to Modern AVIF / WebP Formats',
        details: 'Ensure all photographic and graphical assets are compressed into AVIF or WebP with appropriate quality settings to keep file sizes under 150KB.'
      },
      {
        title: 'Specify Explicit Width & Height Attributes',
        details: 'Ensure images have explicit width/height or use Next.js Image component with layout fill to eliminate Cumulative Layout Shift.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when 100% of website images have descriptive alt text, optimized AVIF/WebP formats, and pass Screaming Frog image audit.'
      }
    ]
  },
  {
    name: 'SEO – URL Optimization',
    category: 'Development',
    owner: 'SEO Specialist',
    version: '1.0',
    description: 'Designing clean, SEO-friendly, lowercase URL slug structures, managing 301 redirects, and avoiding URL parameters.',
    steps_json: [
      {
        title: 'Design Short, Descriptive URL Slugs',
        details: 'Structure URL slugs: Use lowercase letters, alphanumeric characters, and hyphens only (e.g., /services/web-development). Keep URLs short, eliminating unnecessary stop words.'
      },
      {
        title: 'Enforce Consistent Trailing Slash Policy',
        details: 'Configure server to consistently enforce either trailing slash (/about/) or non-trailing slash (/about) across all routes with 301 redirects to avoid duplicate URLs.'
      },
      {
        title: 'Implement 301 Permanent Redirects for Changed URLs',
        details: 'If an existing URL slug must be changed, create an immediate 301 permanent redirect from old URL to new URL. Update all internal links across the website to point directly to the new URL.'
      },
      {
        title: 'Prevent URL Parameter Indexing',
        details: 'Ensure faceted navigation or tracking parameters (e.g., ?sort=price, ?utm_source=) use canonical tags pointing to the clean canonical root URL.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when all site URLs follow clean naming standards with 301 redirects tested and verified in HTTP header inspector.'
      }
    ]
  },
  {
    name: 'SEO – Schema / Structured Data',
    category: 'Development',
    owner: 'SEO Specialist',
    version: '1.0',
    description: 'Generating, validating, and implementing JSON-LD structured data schemas to win rich snippets in Google search results.',
    steps_json: [
      {
        title: 'Implement Organization & LocalBusiness Schema',
        details: 'Embed Organization and LocalBusiness JSON-LD on homepage/footer: Legal business name, logo URL, address, geo coordinates, phone number, opening hours, sameAs social links.'
      },
      {
        title: 'Implement WebSite with SearchAction Schema',
        details: 'Add WebSite schema with potentialAction SearchAction pointing to site search or blog search endpoint.'
      },
      {
        title: 'Implement Service & ProfessionalService Schema',
        details: 'Add Service schemas on individual service landing pages detailing service name, description, provider, and areaServed.'
      },
      {
        title: 'Implement Article / BlogPosting Schema',
        details: 'Embed BlogPosting JSON-LD on all blog articles: headline, image, datePublished, dateModified, author (Person/Organization), and publisher.'
      },
      {
        title: 'Implement FAQPage & BreadcrumbList Schema',
        details: 'Add FAQPage schema on pages with FAQ accordions. Implement BreadcrumbList schema on all sub-pages.'
      },
      {
        title: 'Validate in Google Rich Results Test & Schema Validator',
        details: 'Test all modified URLs in Google Rich Results Test (search.google.com/test/rich-results) and Schema.org Validator. Ensure zero errors and zero critical warnings.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when all required JSON-LD schemas pass Google Rich Results Test with 100% valid syntax.'
      }
    ]
  },
  {
    name: 'SEO – Sitemap & Robots Review',
    category: 'QA',
    owner: 'SEO Specialist',
    version: '1.0',
    description: 'Auditing XML sitemaps, robots.txt directives, disallow rules, crawl delays, and search engine crawler accessibility.',
    steps_json: [
      {
        title: 'Inspect Robots.txt Directives',
        details: 'Check https://domain.com/robots.txt. Confirm User-agent: * is allowed on public routes, sensitive /admin and /api endpoints are disallowed, and Sitemap: https://domain.com/sitemap.xml is declared.'
      },
      {
        title: 'Verify XML Sitemap Content & Freshness',
        details: 'Open https://domain.com/sitemap.xml. Ensure it dynamically updates with new published pages and blogs. Verify all listed URLs return HTTP 200 and have valid lastmod dates.'
      },
      {
        title: 'Check for Erroneous Noindex in Sitemap',
        details: 'Cross-check sitemap URLs against page meta robots tags. Ensure zero noindexed, redirected (301), or broken (404) URLs exist within the sitemap.'
      },
      {
        title: 'Test Crawl Accessibility via Search Console',
        details: 'Use GSC URL Inspection tool to "Test Live URL" and confirm Googlebot can fetch and render public pages without robots.txt blocks.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when robots.txt and sitemap.xml pass validation with zero conflicting directives or erroneous URL inclusions.'
      }
    ]
  },
  {
    name: 'SEO – Crawl & Indexation Review',
    category: 'QA',
    owner: 'SEO Specialist',
    version: '1.0',
    description: 'Monitoring Google Search Console Page Indexing reports, troubleshooting indexing exclusions, and resolving crawl errors.',
    steps_json: [
      {
        title: 'Review GSC Page Indexing Report',
        details: 'Examine Google Search Console Indexing dashboard. Note total "Indexed" vs "Not Indexed" pages.'
      },
      {
        title: 'Analyze Indexing Exclusion Reasons',
        details: 'Audit common GSC exclusion categories: "Discovered - currently not indexed", "Crawled - currently not indexed", "Duplicate without user-selected canonical", "Page with redirect".'
      },
      {
        title: 'Fix "Crawled - Currently Not Indexed" Issues',
        details: 'For valuable pages stuck in crawled-not-indexed: Improve content depth, add unique value/insights, build internal links from high-authority pages, and ensure search intent matches SERP.'
      },
      {
        title: 'Submit Resolved URLs for Validation in GSC',
        details: 'Once underlying technical or content issues are fixed, click "Validate Fix" in Google Search Console to initiate automated re-crawl.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when GSC indexation report shows all valuable money pages successfully indexed with zero valid crawl errors.'
      }
    ]
  },
  {
    name: 'SEO – Core Web Vitals Review',
    category: 'QA',
    owner: 'SEO Specialist',
    version: '1.0',
    description: 'Auditing and optimizing field and lab Core Web Vitals metrics (LCP, CLS, INP) in Google Search Console and PageSpeed Insights.',
    steps_json: [
      {
        title: 'Audit GSC Core Web Vitals Report',
        details: 'Inspect Search Console Core Web Vitals tab for mobile and desktop URLs grouped under "Poor", "Need Improvement", or "Good".'
      },
      {
        title: 'Diagnose Largest Contentful Paint (LCP < 2.5s)',
        details: 'Identify the LCP element (hero image, heading text, banner video) using PageSpeed Insights. Optimize by converting hero images to AVIF/WebP, preloading hero assets (priority={true}), and eliminating render-blocking CSS.'
      },
      {
        title: 'Diagnose Cumulative Layout Shift (CLS < 0.1)',
        details: 'Identify shifting elements during page load. Fix missing width/height attributes on images, reserve space for dynamic ads/banners, and use font-display: swap with matched fallback metrics.'
      },
      {
        title: 'Diagnose Interaction to Next Paint (INP < 200ms)',
        details: 'Identify heavy JavaScript execution blocking the main thread during user interactions (menu clicks, form typing). Break long tasks and debounce input handlers.'
      },
      {
        title: 'Coordinate Developer Fixes & Validate in GSC',
        details: 'Assign optimization tickets to Web Developer. Once deployed to production, trigger "Validate Fix" in GSC Core Web Vitals report.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when core landing pages achieve green scores across LCP, CLS, and INP in PageSpeed Insights.'
      }
    ]
  },
  {
    name: 'SEO – Content Gap Analysis',
    category: 'Design',
    owner: 'SEO Specialist',
    version: '1.0',
    description: 'Comparing client keyword rankings against top 3 competitors to uncover missing topics, sub-services, and content opportunities.',
    steps_json: [
      {
        title: 'Execute Content Gap Query in SEO Tool',
        details: 'Input client domain and top 3 competitor domains into Ahrefs / Semrush Content Gap tool. Filter for keywords where at least 2 competitors rank in Top 10 but client does not rank.'
      },
      {
        title: 'Filter High-Opportunity Commercial Topics',
        details: 'Filter gap keywords by search volume (>= 100/mo) and commercial/transactional intent. Discard competitor brand names and irrelevant queries.'
      },
      {
        title: 'Categorize Gaps by Content Type',
        details: 'Group missing keywords into: 1) New dedicated Service Pages, 2) Supporting In-depth Blog Articles, 3) Comparison / Versus Pages, 4) Location-specific Landing Pages.'
      },
      {
        title: 'Prioritize Content Production Roadmap',
        details: 'Rank content gap opportunities by potential business revenue impact and keyword difficulty. Add top 5 priorities to monthly editorial calendar.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when Content Gap Analysis document is finalized with prioritized topics added to content sprint plan.'
      }
    ]
  },
  {
    name: 'SEO – Content Brief Creation',
    category: 'Design',
    owner: 'SEO Specialist',
    version: '1.0',
    description: 'Writing comprehensive editorial briefs for copywriters with target keywords, word count, heading outlines, and internal link directives.',
    steps_json: [
      {
        title: 'Define Primary Keyword & Target Search Intent',
        details: 'Specify the primary target keyword, estimated search volume, target audience persona, and explicit search intent (Informational vs Commercial).'
      },
      {
        title: 'Determine Recommended Word Count & Structure',
        details: 'Calculate target word count based on top 3 ranking competitors average length plus 20% additional depth.'
      },
      {
        title: 'Draft Complete Heading Outline (H1, H2, H3)',
        details: 'Build detailed outline specifying exact H2 and H3 topics to cover, incorporating secondary keywords and semantic questions naturally.'
      },
      {
        title: 'Specify Secondary Keywords & LSI Terms List',
        details: 'Provide list of 10-15 secondary keywords, entities, and related phrases that must be naturally integrated into the draft.'
      },
      {
        title: 'Define Mandatory Internal & External Link Targets',
        details: 'List exact URLs on the client website that the copywriter must link to within the article body, along with recommended anchor text.'
      },
      {
        title: 'Specify Primary Call-to-Action (CTA)',
        details: 'Define the conversion action readers should take at the end of the article (e.g. "Book a Free Consultation", "Contact Our Team").'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when Content Brief is approved by SEO Specialist and handed off to content writer.'
      }
    ]
  },
  {
    name: 'SEO – Blog Optimization',
    category: 'Development',
    owner: 'SEO Specialist',
    version: '1.0',
    description: 'Reviewing, formatting, optimizing, and publishing blog articles for maximum search visibility and user engagement.',
    steps_json: [
      {
        title: 'Review Draft Against Content Brief',
        details: 'Audit writer draft against the Content Brief: Verify primary keyword inclusion in H1, first paragraph, headings, and conclusion. Check for originality and factual accuracy (zero plagiarized text).'
      },
      {
        title: 'Optimize Blog Formatting & Visuals',
        details: 'Format content with short scannable paragraphs (2-3 sentences), bullet points, bold key insights, and high-quality AVIF/WebP illustrations with descriptive alt text.'
      },
      {
        title: 'Add Related Reading & Internal Links',
        details: 'Embed 3-5 contextual internal links to relevant service pages and supporting articles to circulate topical authority.'
      },
      {
        title: 'Configure Article Schema & Metadata',
        details: 'Set optimized Title tag (under 60 chars), Meta description (140-155 chars), Open Graph banner image, canonical URL, and BlogPosting JSON-LD schema.'
      },
      {
        title: 'Publish & Submit for Indexing',
        details: 'Publish article on live website. Verify rendering in browser. Submit live blog URL to Google Search Console for immediate crawling.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when blog post is live, formatted, schema-validated, internally linked, and submitted in Search Console.'
      }
    ]
  },
  {
    name: 'SEO – Local SEO',
    category: 'Development',
    owner: 'SEO Specialist',
    version: '1.0',
    description: 'Optimizing local geo-targeted search visibility, NAP consistency, local citation directories, and localized landing pages.',
    steps_json: [
      {
        title: 'Audit NAP (Name, Address, Phone) Consistency',
        details: 'Verify that business Name, physical Address, and Phone number are 100% identically formatted across website footer, contact page, Google Business Profile, and directories.'
      },
      {
        title: 'Build & Optimize Localized Service Landing Pages',
        details: 'Create dedicated city/area landing pages (e.g., /web-development-company-ahmedabad) featuring localized testimonials, case studies, local landmark mentions, and LocalBusiness schema.'
      },
      {
        title: 'Embed Responsive Google Map on Contact Page',
        details: 'Embed official Google Maps iframe linking to verified Google Business Profile location on contact and location pages.'
      },
      {
        title: 'Acquire Top Local Business Directory Citations',
        details: 'Submit consistent NAP details to reputable local directories: Justdial, IndiaMART, Sulekha, YellowPages, Crunchbase, Bing Places.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when NAP consistency is verified across core directories, LocalBusiness schema is validated, and local landing pages are live.'
      }
    ]
  },
  {
    name: 'SEO – Google Business Profile Optimization',
    category: 'Development',
    owner: 'SEO Specialist',
    version: '1.0',
    description: 'Setting up, verifying, optimizing, and maintaining Google Business Profile (GBP) to capture local Google Maps 3-Pack rankings.',
    steps_json: [
      {
        title: 'Verify GBP Primary & Secondary Categories',
        details: 'Select the exact most relevant Primary Category (e.g., "Website Designer", "Marketing Agency", "Internet Marketing Service") and add up to 5 accurate Secondary Categories.'
      },
      {
        title: 'Complete 100% Profile Information Fields',
        details: 'Populate business description (750 chars with primary keywords), business hours, service areas, website URL with UTM tracking parameter, appointment link, and holiday hours.'
      },
      {
        title: 'Add High-Resolution Office & Team Photos',
        details: 'Upload high-quality photos of exterior building, interior workspace, team members, and branded logo. Geotag photos if applicable.'
      },
      {
        title: 'Configure Direct Messaging & FAQ Q&A Section',
        details: 'Enable GBP messaging. Pre-populate 3-5 common customer questions with clear, helpful answers in the Q&A section.'
      },
      {
        title: 'Establish Review Generation & Response Protocol',
        details: 'Create direct GBP short review link. Provide client with email/WhatsApp review request template to collect genuine 5-star customer reviews. Respond to all reviews within 48 hours.'
      },
      {
        title: 'Publish Weekly GBP Updates / Posts',
        details: 'Post weekly updates featuring recent case studies, agency insights, or offers with a direct call-to-action button linking to the website.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when Google Business Profile is 100% complete, verified, actively posting, and review generation workflow is established.'
      }
    ]
  },
  {
    name: 'SEO – Off-Page SEO',
    category: 'Development',
    owner: 'SEO Specialist',
    version: '1.0',
    description: 'Executing white-hat link acquisition, digital PR, industry outreach, guest contributions, and unlinked brand mention claims.',
    steps_json: [
      {
        title: 'Enforce Strict White-Hat Policy (Zero Spam)',
        details: 'Strictly prohibit buying bulk spam backlinks, PBNs (Private Blog Networks), automated forum spam, or link farm networks. All link acquisition must be editorially earned and relevant.'
      },
      {
        title: 'Conduct Unlinked Brand Mention Outreach',
        details: 'Search for online mentions of client brand name without a hyperlink. Contact site editors politely requesting a link to the official client domain.'
      },
      {
        title: 'Pitch High-Authority Industry Guest Contributions',
        details: 'Identify reputable industry blogs and publications in client niche. Pitch original thought leadership articles, case studies, or original data surveys.'
      },
      {
        title: 'Leverage Supplier, Partner, and Client Ecosystems',
        details: 'Secure legitimate backlinks from client certified technology partners, industry associations, vendors, and featured client case studies.'
      },
      {
        title: 'Track Acquired Backlinks in Link Repository',
        details: 'Log all acquired referring domains in SEO Link Tracker with metrics: Source URL, Target URL, Anchor Text, Domain Rating, and Indexation Status.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when monthly link building targets are achieved via verified white-hat editorial placements and logged in tracker.'
      }
    ]
  },
  {
    name: 'SEO – Backlink Quality Review',
    category: 'QA',
    owner: 'SEO Specialist',
    version: '1.0',
    description: 'Auditing backlink profile health, monitoring toxic links, tracking domain rating trajectory, and maintaining link hygiene.',
    steps_json: [
      {
        title: 'Audit Inbound Backlink Profile in Ahrefs / Semrush',
        details: 'Review all newly acquired and lost referring domains over the past 30-60 days. Monitor overall Domain Rating (DR) / Authority Score.'
      },
      {
        title: 'Screen for Negative SEO or Toxic Link Injections',
        details: 'Identify suspicious link spikes from foreign adult/gambling spam networks, auto-generated scraper sites, or compromised domains.'
      },
      {
        title: 'Evaluate Need for Google Disavow Tool',
        details: 'Note: Google Penguin algorithm ignores most automated spam links automatically. Use Google Disavow Tool only if client receives a manual action notification in GSC or there is overwhelming malicious link evidence.'
      },
      {
        title: 'Audit Anchor Text Distribution',
        details: 'Ensure anchor text profile remains natural: ~60-70% branded / URL anchors, ~20% partial match / topic anchors, and < 10% exact match commercial anchors.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when monthly backlink audit confirms clean profile health, zero manual penalties, and natural anchor distribution.'
      }
    ]
  },
  {
    name: 'SEO – Monthly Monitoring',
    category: 'QA',
    owner: 'SEO Specialist',
    version: '1.0',
    description: 'Weekly and monthly tracking of keyword rankings, organic impression trends, click-through rates, and algorithmic volatility.',
    steps_json: [
      {
        title: 'Track Core Keyword Ranking Movements',
        details: 'Check rank tracking tool (Ahrefs / Rank Tracker) for primary keyword positions. Note positive jumps, stable rankings, and any declining trends.'
      },
      {
        title: 'Analyze Google Search Console Performance Trends',
        details: 'Compare last 28 days vs previous period in GSC: Total Clicks, Total Impressions, Average CTR, and Average Position. Filter by Top Queries and Top Pages.'
      },
      {
        title: 'Investigate Any Sudden Traffic Drops',
        details: 'If sudden drop > 15% occurs: 1) Check Search Console for manual actions or security issues, 2) Check for major Google core algorithm updates, 3) Check if recent site updates broke meta robots tags or server responses.'
      },
      {
        title: 'Document Monthly Organic Performance Insights',
        details: 'Compile monthly findings, highlighting key wins, top performing content pieces, and areas requiring strategic adjustment in the upcoming month.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when monthly rank tracking and GSC data are analyzed and synthesized into the monthly reporting deck.'
      }
    ]
  },
  {
    name: 'SEO – Monthly Reporting',
    category: 'Client Onboarding',
    owner: 'SEO Specialist',
    version: '1.0',
    description: 'Compiling and delivering transparent monthly SEO performance reports, lead attribution, and next-month strategic priorities to the client.',
    steps_json: [
      {
        title: 'Aggregate Verified Analytics & Search Data',
        details: 'Export data from GA4 and GSC: Organic Sessions, Organic Leads/Conversions, Keyword Ranking Shifts, Top Landing Pages, and New Backlinks Earned.'
      },
      {
        title: 'Build Executive Summary Slide & Visual Charts',
        details: 'Create executive summary highlighting Month-over-Month (MoM) and Year-over-Year (YoY) organic growth, tangible leads generated, and milestones achieved.'
      },
      {
        title: 'Document Completed Tasks & Next Month Action Plan',
        details: 'Detail all technical fixes, new articles published, on-page optimizations deployed in the current month, and present proposed priorities for the upcoming month.'
      },
      {
        title: 'Deliver Report & Schedule Client Review Call',
        details: 'Send PDF report to client via email/portal and host 20-minute review call to answer questions, discuss insights, and confirm next month sprint focus.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when monthly report is delivered, client walkthrough is completed, and next month sprint tasks are scheduled in Founder OS.'
      }
    ]
  },
  {
    name: 'SEO – SEO QA',
    category: 'QA',
    owner: 'QA Specialist',
    version: '1.0',
    description: 'Internal quality assurance audit ensuring all published content, metadata, schema, and technical changes comply with agency standards.',
    steps_json: [
      {
        title: 'Verify Live Published Changes in Production',
        details: 'Inspect recently deployed SEO changes directly on live URLs. Confirm metadata, schema JSON-LD, internal links, and headings render correctly in production HTML.'
      },
      {
        title: 'Check Indexation & Canonical Response',
        details: 'Verify HTTP headers (no x-robots-tag: noindex on public pages) and ensure canonical URL matches browser address bar.'
      },
      {
        title: 'Verify Structured Data Validity',
        details: 'Run live URLs through Google Rich Results Test to ensure zero schema errors introduced by recent code updates.'
      },
      {
        title: 'Sign-off on Monthly SEO Deliverables',
        details: 'Validate that all deliverables promised in the monthly sprint (technical fixes, content pieces, optimizations) are completed and pass QA before report delivery.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when QA Specialist signs off on monthly SEO deliverables with zero defects.'
      }
    ]
  },
  {
    name: 'SEO – Client Offboarding',
    category: 'Offboarding',
    owner: 'Account Manager',
    version: '1.0',
    description: 'Orderly conclusion of SEO retainer, delivering final cumulative performance report, asset archive, and revoking tool access.',
    steps_json: [
      {
        title: 'Reconcile Final Invoice with Finance',
        details: 'Ensure all monthly retainer invoices through contract termination date are fully paid.'
      },
      {
        title: 'Generate Cumulative Lifetime Performance Report',
        details: 'Compile full-campaign performance summary showcasing baseline vs final keyword rankings, organic traffic growth, and cumulative leads generated during the engagement.'
      },
      {
        title: 'Deliver All Content Assets & Keyword Maps',
        details: 'Package all keyword mapping files, technical audit documentation, content briefs, and graphics in a shared cloud archive for client retention.'
      },
      {
        title: 'Revoke Agency Delegated Access to Tools',
        details: 'Remove InfronixWeb team user access from client Google Search Console, GA4, Tag Manager, CMS, and hosting.'
      },
      {
        title: 'Request Client Testimonial / Exit Feedback',
        details: 'Send friendly request for client review or testimonial. Record feedback in Founder OS client history.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when final report is delivered, tool permissions are revoked, and client record is archived in Founder OS.'
      }
    ]
  }
];
