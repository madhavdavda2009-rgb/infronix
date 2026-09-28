export const metaAdsSOPs = [
  {
    name: 'Meta Ads – Client Onboarding',
    category: 'Client Onboarding',
    owner: 'Account Manager',
    version: '1.0',
    description: 'Setting up Meta advertising workspace, client billing arrangements, creative pipeline, and strategic kickoff alignment.',
    steps_json: [
      {
        title: 'Verify Retainer Management Advance',
        details: 'Confirm receipt of initial monthly Meta Ads management retainer with Finance before campaign build.'
      },
      {
        title: 'Verify Direct Ad Spend Billing Method',
        details: 'Ensure client connects their own credit card / payment method directly inside their Meta Ad Account billing settings.'
      },
      {
        title: 'Issue Meta Ads Strategic Intake Questionnaire',
        details: 'Gather target buyer demographics, core value offers, brand guidelines, past winning ad creatives, and high-margin services/products.'
      },
      {
        title: 'Conduct Kickoff Alignment Meeting',
        details: 'Host 30-minute kickoff call to review target CPL/CPA benchmarks, creative delivery schedule, and lead notification workflow.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when onboarding questionnaire is completed, billing confirmed, and partner access requested.'
      }
    ]
  },
  {
    name: 'Meta Ads – Business Manager Access',
    category: 'Security',
    owner: 'Meta Ads Specialist',
    version: '1.0',
    description: 'Connecting client Meta Business Portfolio / Business Manager to InfronixWeb Business Manager via official Partner Access.',
    steps_json: [
      {
        title: 'Send Partner Access Request in Business Settings',
        details: 'From InfronixWeb Business Manager -> Users -> Partners -> Add Partner -> enter client Meta Business ID.'
      },
      {
        title: 'Request Delegated Asset Permissions',
        details: 'Request Admin/Manage permissions for: Facebook Page, Instagram Account, Meta Pixel / Dataset, and Ad Account.'
      },
      {
        title: 'Guide Client Approval & Verify Access',
        details: 'Assist client in approving partner request in their Business Settings -> Requests. Verify all assets show up in agency portfolio.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when InfronixWeb Business Manager has verified partner access to all client Meta assets.'
      }
    ]
  },
  {
    name: 'Meta Ads – Ad Account Access',
    category: 'Security',
    owner: 'Meta Ads Specialist',
    version: '1.0',
    description: 'Verifying ad account administrative roles, payment thresholds, spending limits, and ad account health.',
    steps_json: [
      {
        title: 'Verify Ad Account Role & Permissions',
        details: 'Confirm Meta Ads Specialist has "Full Control" or "Manage Campaigns" access on the client Ad Account.'
      },
      {
        title: 'Check Ad Account Status & Spending Limits',
        details: 'Verify ad account status is "Active" with zero policy restrictions or outstanding unpaid balances. Check if new account daily spend limit exists ($50/day limit on new accounts).'
      },
      {
        title: 'Configure Account Timezone & Currency',
        details: 'Ensure account timezone matches client operating timezone (e.g., IST GMT+5:30) and currency is set correctly (e.g., INR ₹).'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when ad account settings, currency, and permissions are verified healthy.'
      }
    ]
  },
  {
    name: 'Meta Ads – Pixel Setup',
    category: 'Development',
    owner: 'Meta Ads Specialist',
    version: '1.0',
    description: 'Creating, installing, and configuring Meta Pixel (Dataset) across website pages and verifying standard events.',
    steps_json: [
      {
        title: 'Create or Locate Meta Pixel (Dataset)',
        details: 'In Meta Events Manager, locate the primary Dataset / Pixel ID assigned to the client domain.'
      },
      {
        title: 'Deploy Meta Pixel Base Code via GTM',
        details: 'Install Meta Pixel base tag via Google Tag Manager triggered on "All Pages - Page View".'
      },
      {
        title: 'Configure Standard Conversion Events',
        details: 'Set up custom GTM tags triggering Meta standard events: Lead (form submission), Contact (WhatsApp/Call click), CompleteRegistration, and ViewContent.'
      },
      {
        title: 'Configure Automatic Advanced Matching',
        details: 'Enable Automatic Advanced Matching in Events Manager to match customer email, phone, and name data for higher attribution accuracy.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when Meta Pixel fires on all pages and triggers Lead events verified in Meta Pixel Helper extension.'
      }
    ]
  },
  {
    name: 'Meta Ads – Conversion API Review/Setup',
    category: 'Development',
    owner: 'Web Developer',
    version: '1.0',
    description: 'Implementing server-side Meta Conversion API (CAPI) for resilient conversion tracking bypassing ad blockers and iOS privacy restrictions.',
    steps_json: [
      {
        title: 'Generate Meta CAPI System User Token',
        details: 'In Events Manager -> Settings -> Conversions API -> Generate Access Token. Store securely in environment variables (META_CAPI_ACCESS_TOKEN).'
      },
      {
        title: 'Implement Server-Side CAPI Webhook in Codebase',
        details: 'In Next.js API form handler (/api/enquiry or /api/consultation), dispatch server-side POST request to Graph API https://graph.facebook.com/v21.0/{PIXEL_ID}/events containing hashed user data (SHA-256 email, phone) and event_id.'
      },
      {
        title: 'Implement Event Deduplication (event_id)',
        details: 'Ensure the exact same unique event_id is sent by both client-side Pixel and server-side CAPI to allow Meta to deduplicate matching events.'
      },
      {
        title: 'Test Server-Side Event Delivery in Events Manager',
        details: 'Submit test form using Meta Test Events tool. Verify events display with "Browser & Server" source and "Deduplicated" status.'
      },
      {
        title: 'Achieve High Event Quality Match Score (>= 7.5/10)',
        details: 'Review Event Quality Match score in Events Manager. Ensure score exceeds 7.5/10 with customer information parameters (em, ph, fn, ln, country).'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when Conversion API is active, deduplicating with browser Pixel, and scoring >= 7.5 Event Quality Match.'
      }
    ]
  },
  {
    name: 'Meta Ads – Event Testing',
    category: 'QA',
    owner: 'Meta Ads Specialist',
    version: '1.0',
    description: 'End-to-end testing of standard and custom conversion events across all website forms, buttons, and lead flows.',
    steps_json: [
      {
        title: 'Open Meta Test Events Tool',
        details: 'In Events Manager -> Test Events, enter website URL to initiate interactive testing session.'
      },
      {
        title: 'Test Primary Lead Form Submission',
        details: 'Submit live test form on website. Verify Lead event triggers immediately in Test Events log with valid event parameters (currency, value, content_name).'
      },
      {
        title: 'Test WhatsApp & Phone Call Clicks',
        details: 'Click WhatsApp widget and Phone Call buttons. Verify Contact event fires.'
      },
      {
        title: 'Verify Zero Duplicate Events',
        details: 'Confirm single submission does not generate multiple duplicate Lead events.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when all conversion events pass Test Events verification with zero errors.'
      }
    ]
  },
  {
    name: 'Meta Ads – Audience Research',
    category: 'Design',
    owner: 'Meta Ads Specialist',
    version: '1.0',
    description: 'Researching broad, interest, lookalike, and custom audience segments matching target buyer personas.',
    steps_json: [
      {
        title: 'Define Demographic & Geographic Boundaries',
        details: 'Specify exact age ranges (e.g. 25-54), gender targeting, and targeted cities/radii (e.g., Ahmedabad + 25km, Surat, Vadodara, Mumbai).'
      },
      {
        title: 'Research High-Affinity Interest Groups',
        details: 'Identify relevant interest clusters in Meta Ads Manager: Industry job titles, software tools used, business interests, and competitor brand pages.'
      },
      {
        title: 'Build First-Party Custom Audiences',
        details: 'Create custom audiences: 1) Website Visitors (30, 60, 180 Days), 2) Instagram Profile Engagers (365 Days), 3) Customer Email List Upload.'
      },
      {
        title: 'Generate 1%, 2%, and 5% Lookalike Audiences',
        details: 'Create Lookalike audiences based on high-value customer seed lists and verified past lead conversions.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when Audience Strategy Matrix is documented with designated Cold, Warm, and Hot segments.'
      }
    ]
  },
  {
    name: 'Meta Ads – Competitor / Creative Research',
    category: 'Design',
    owner: 'Meta Ads Specialist',
    version: '1.0',
    description: 'Analyzing competitor ad formats, video hooks, static design concepts, and copywriting angles in Meta Ad Library.',
    steps_json: [
      {
        title: 'Search Competitors in Meta Ad Library',
        details: 'Open facebook.com/ads/library. Search top 5 direct competitors and leading national brands in the client industry.'
      },
      {
        title: 'Identify Longest-Running Competitor Ads',
        details: 'Filter for ads active for > 3 months (proven winners). Analyze their core creative format (Video UGC, Problem-Solution Carousel, Static Proof Graphic).'
      },
      {
        title: 'Deconstruct Visual & Copywriting Hooks',
        details: 'Document top 5 headline hooks, opening video visuals, and emotional pain points used by competitors.'
      },
      {
        title: 'Formulate Creative Angles to Outperform Competitors',
        details: 'Design creative concepts with higher visual production value, stronger guarantees, and clearer local social proof.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when Creative Research Moodboard is compiled in Figma for creative production.'
      }
    ]
  },
  {
    name: 'Meta Ads – Offer Analysis',
    category: 'Design',
    owner: 'Meta Ads Specialist',
    version: '1.0',
    description: 'Structuring irresistible front-end promotional offers, free lead magnets, and low-friction consultation hooks for ad campaigns.',
    steps_json: [
      {
        title: 'Identify Client Core Transformation / Value',
        details: 'Clarify the exact end result the customer buys: E.g., "A modern website that generates 3x more inbound leads without technical headaches".'
      },
      {
        title: 'Structure Front-End Low-Friction Offer',
        details: 'Create compelling lead magnet: Free Strategic Audit, Instant Pricing Estimator, or Free Prototype Consultation.'
      },
      {
        title: 'Add Urgency & Risk Reversals',
        details: 'Incorporate clear risk reversals (e.g., "100% Free Consultation - No Sales Pressure", "Fixed-Price Guarantee").'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when Offer Formulation Sheet is approved by client and Project Manager.'
      }
    ]
  },
  {
    name: 'Meta Ads – Campaign Strategy',
    category: 'Design',
    owner: 'Meta Ads Specialist',
    version: '1.0',
    description: 'Designing campaign structure (Advantage+ vs Manual), budget split (TOFU/MOFU/BOFU), and creative testing matrix.',
    steps_json: [
      {
        title: 'Select Campaign Objective',
        details: 'Select "Leads" objective (for lead gen) or "Sales" objective (for e-commerce). Avoid "Traffic" or "Engagement" objectives which generate low-quality clicks without conversions.'
      },
      {
        title: 'Design Full-Funnel Budget Allocation',
        details: 'Split monthly budget: 70% Cold Audience Acquisition (TOFU), 20% Retargeting / Consideration (MOFU/BOFU), 10% Creative Testing Sandbox.'
      },
      {
        title: 'Determine Campaign Budget Optimization (CBO vs ABO)',
        details: 'Use Advantage Campaign Budget (CBO) for scaling proven ad sets; use Ad Set Budget (ABO) for controlled isolated creative testing.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when Campaign Architecture Blueprint is documented and signed off.'
      }
    ]
  },
  {
    name: 'Meta Ads – Campaign Setup',
    category: 'Development',
    owner: 'Meta Ads Specialist',
    version: '1.0',
    description: 'Building campaigns in Meta Ads Manager, configuring campaign objectives, budget limits, and bidding strategies.',
    steps_json: [
      {
        title: 'Create Campaign with Explicit Objective',
        details: 'Create Campaign in Meta Ads Manager -> Objective: Leads -> Performance Goal: Maximize number of leads.'
      },
      {
        title: 'Set Budget Caps & Scheduling',
        details: 'Set daily budget based on approved media plan. Schedule start date.'
      },
      {
        title: 'Configure Conversion Location & Pixel',
        details: 'Set Conversion Location: "Website" -> Select client Pixel (Dataset) -> Conversion Event: "Lead".'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when campaign shell is configured in Meta Ads Manager in Draft status.'
      }
    ]
  },
  {
    name: 'Meta Ads – Audience Setup',
    category: 'Development',
    owner: 'Meta Ads Specialist',
    version: '1.0',
    description: 'Configuring ad sets with defined geographic parameters, detailed targeting interests, exclusions, and custom audiences.',
    steps_json: [
      {
        title: 'Configure Strict Geographic Location Targeting',
        details: 'Set location targeting: Target specific cities / districts / radius. Exclude regions outside client service area.'
      },
      {
        title: 'Set Demographics & Language Settings',
        details: 'Set age limits (e.g. 24-55) and language settings (e.g. English, Gujarati, Hindi).'
      },
      {
        title: 'Apply Detailed Targeting & Lookalikes',
        details: 'Input planned interest clusters in Cold Ad Sets; attach Lookalike audiences (1-2%) in Lookalike Ad Sets.'
      },
      {
        title: 'Apply Critical Conversion Exclusions',
        details: 'Exclude "Past 30-day Converted Leads" custom audience from cold acquisition ad sets to prevent wasting budget showing ads to people who already submitted.'
      },
      {
        title: 'Configure Advantage+ Placements',
        details: 'Enable Advantage+ Placements to allow Meta algorithm to serve ads across Instagram Feeds, Reels, Stories, Facebook Feeds, and Messenger.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when all planned ad sets are built with correct targeting and conversion exclusions.'
      }
    ]
  },
  {
    name: 'Meta Ads – Creative Preparation',
    category: 'Design',
    owner: 'UI/UX Designer',
    version: '1.0',
    description: 'Designing high-converting ad visuals, 1:1 feed carousels, 9:16 vertical video reels, and static problem-solution banners in Figma.',
    steps_json: [
      {
        title: 'Create Multi-Format Asset Canvases',
        details: 'Set up frames: 1080x1080px (1:1 Square Feed), 1080x1350px (4:5 Portrait Feed), and 1080x1920px (9:16 Stories/Reels).'
      },
      {
        title: 'Design High-Contrast Visual Hooks',
        details: 'Use bold readable typography, prominent benefit badges, high-resolution product/service imagery, and clear brand logos.'
      },
      {
        title: 'Produce 3-5 Creative Variations',
        details: 'Create diverse creative formats: 1) Problem-Solution Static Graphic, 2) Multi-Card Case Study Carousel, 3) Short UGC Video Reel with Captions, 4) Testimonial Quote Card.'
      },
      {
        title: 'Export Assets in Lossless Format',
        details: 'Export static graphics in high-res PNG / WebP and videos in H.264 MP4 with clear audio.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when all creative assets are exported, organized in campaign folders, and approved by Creative Lead.'
      }
    ]
  },
  {
    name: 'Meta Ads – Copywriting',
    category: 'Design',
    owner: 'Meta Ads Specialist',
    version: '1.0',
    description: 'Writing compelling primary text, headlines, and descriptions using proven direct-response copywriting formulas (PAS, AIDA).',
    steps_json: [
      {
        title: 'Write 3-5 Primary Text Variations',
        details: 'Draft diverse primary copy angles: 1) Pain-Agitation-Solution (PAS), 2) Client Case Study / Transformation Story, 3) Direct Feature-Benefit List with Emojis, 4) Short Punchy 2-line Hook.'
      },
      {
        title: 'Write 3-5 High-CTR Headlines (Under 40 chars)',
        details: 'Craft clear headlines highlighting value proposition: "Get Your Custom Website in 7 Days", "Free SEO Growth Audit", "Scale Your Business With InfronixWeb".'
      },
      {
        title: 'Write Descriptions & Select CTA Button',
        details: 'Add description lines (e.g., "500+ Happy Clients | Rated 4.9/5"). Set Call-to-Action button: "Get Quote", "Contact Us", or "Book Now".'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when full copywriting matrix is approved and ready for ad assembly.'
      }
    ]
  },
  {
    name: 'Meta Ads – Landing Page Review',
    category: 'QA',
    owner: 'Meta Ads Specialist',
    version: '1.0',
    description: 'Auditing landing page mobile responsiveness, fast load speed, form conversion friction, and Meta Pixel firing.',
    steps_json: [
      {
        title: 'Verify Mobile Message & Visual Match',
        details: 'Confirm landing page headline matches ad copy promise and branding is visually seamless.'
      },
      {
        title: 'Audit Mobile Page Load Speed',
        details: 'Verify page loads in < 2.5 seconds on mobile 4G network. Eliminate heavy uncompressed video banners.'
      },
      {
        title: 'Test Form Submissions from Mobile Device',
        details: 'Submit live test form from mobile browser. Confirm confirmation toast displays and thank-you redirect triggers.'
      },
      {
        title: 'Verify Meta Pixel Lead Event Trigger',
        details: 'Confirm Lead event triggers in Meta Pixel Helper upon successful form submission.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when landing page is verified fast, fully functioning, and tracking leads.'
      }
    ]
  },
  {
    name: 'Meta Ads – Pre-Launch QA',
    category: 'QA',
    owner: 'QA Specialist',
    version: '1.0',
    description: 'Pre-flight quality checklist verifying ad creatives, destination URLs, UTM parameters, budgets, and audience exclusions before launch.',
    steps_json: [
      {
        title: 'Verify Daily Budget Caps & Account Currency',
        details: 'Ensure daily budget aligns exactly with approved media spend plan.'
      },
      {
        title: 'Verify Audience Exclusions (Past Converters Excluded)',
        details: 'Confirm past 30-day leads are excluded from all cold ad sets.'
      },
      {
        title: 'Click Every Ad Destination URL with UTM Parameters',
        details: 'Verify all ads link to correct landing page with UTM tracking parameters attached.'
      },
      {
        title: 'Check Instagram & Facebook Page Identities',
        details: 'Confirm ads run from correct verified Facebook Page and Instagram Account identities.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when QA Specialist signs off on pre-launch checklist with zero defects.'
      }
    ]
  },
  {
    name: 'Meta Ads – Campaign Launch',
    category: 'Deployment',
    owner: 'Meta Ads Specialist',
    version: '1.0',
    description: 'Publishing campaigns in Meta Ads Manager, monitoring ad policy review status, and verifying initial delivery.',
    steps_json: [
      {
        title: 'Publish Campaign & Ad Sets to Active Status',
        details: 'Click "Publish" in Meta Ads Manager. Move all assets from Draft to In Review.'
      },
      {
        title: 'Monitor Meta Ad Policy Approvals',
        details: 'Check Ads status within 2-4 hours. If any ad is rejected for policy violations (e.g., misleading claims, personal attributes), immediately revise copy or submit appeal.'
      },
      {
        title: 'Verify Delivery & Learning Phase Entry',
        details: 'Confirm ads change status from "In Review" to "Active" (Learning Phase) and begin logging impressions.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when campaign is active, delivering impressions, and approved by Meta policy.'
      }
    ]
  },
  {
    name: 'Meta Ads – Daily Monitoring',
    category: 'QA',
    owner: 'Meta Ads Specialist',
    version: '1.0',
    description: 'Daily morning routine checking spend pacing, Cost Per Lead (CPL), frequency spikes, and ad comment hygiene.',
    steps_json: [
      {
        title: 'Check Daily Spend Pacing',
        details: 'Verify ad sets are spending within daily allocated limits without sudden budget spikes.'
      },
      {
        title: 'Monitor Daily Lead Volume & Cost Per Lead (CPL)',
        details: 'Review incoming leads and calculate 24-hour CPL. If CPL exceeds 1.5x target benchmark for 3 consecutive days, flag for creative adjustment.'
      },
      {
        title: 'Monitor Ad Frequency',
        details: 'Check frequency metric in cold ad sets. If frequency rises > 2.5, audience is becoming fatigued.'
      },
      {
        title: 'Moderate Live Ad Comments',
        details: 'Check comments on live ads: Answer prospect queries promptly, delete spam, and hide abusive comments.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when daily morning monitoring routine is completed and logged in Founder OS.'
      }
    ]
  },
  {
    name: 'Meta Ads – Creative Testing',
    category: 'Development',
    owner: 'Meta Ads Specialist',
    version: '1.0',
    description: 'Running structured creative testing sandboxes (Dynamic Creative / ABO) to discover new winning visual angles and hooks.',
    steps_json: [
      {
        title: 'Build Dedicated Creative Testing Ad Set (ABO)',
        details: 'Create isolated testing ad set with broad audience. Use Dynamic Creative (DCT) with 3 Creatives + 2 Primary Texts + 2 Headlines.'
      },
      {
        title: 'Run Test Until 50 Conversions / 3x CPA Spend',
        details: 'Allow test to run for 5-7 days without editing to reach statistical significance.'
      },
      {
        title: 'Identify Winning Creative Asset (High CTR, Low CPL)',
        details: 'Review Dynamic Creative breakdown by Asset. Identify winning visual hook and copy combination.'
      },
      {
        title: 'Graduate Winning Creative to Main Scaling Campaign',
        details: 'Export winning Post ID and import as an active ad in the primary CBO scaling campaign with existing social proof (likes/comments) preserved.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when creative test concludes with winning ad graduated to scaling campaign.'
      }
    ]
  },
  {
    name: 'Meta Ads – Audience Testing',
    category: 'Development',
    owner: 'Meta Ads Specialist',
    version: '1.0',
    description: 'Testing broad targeting, interest stacks, and multi-percentage lookalikes to identify lowest-CPA audience segments.',
    steps_json: [
      {
        title: 'Test Broad vs Interest vs Lookalike Segments',
        details: 'Run parallel ad sets with identical winning creative across: 1) Broad (Age/Geo only), 2) Layered Interest Stack, 3) 1% Purchase/Lead Lookalike.'
      },
      {
        title: 'Compare CPL and Lead Quality by Audience',
        details: 'Evaluate which audience produces the lowest Cost Per Qualified Lead after 7 days.'
      },
      {
        title: 'Consolidate High-Performing Audiences',
        details: 'Merge overlapping interest groups to eliminate auction self-competition.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when winning audience segment is verified and integrated into main campaign.'
      }
    ]
  },
  {
    name: 'Meta Ads – Budget Optimization',
    category: 'Finance',
    owner: 'Meta Ads Specialist',
    version: '1.0',
    description: 'Reallocating daily spend from underperforming ad sets to winning campaigns to minimize blended acquisition costs.',
    steps_json: [
      {
        title: 'Audit Performance Across All Active Ad Sets',
        details: 'Sort ad sets by Cost Per Lead (CPL) and Return on Ad Spend (ROAS) over last 7-14 days.'
      },
      {
        title: 'Pause Underperforming Ad Sets',
        details: 'Pause ad sets that have spent > 2x target CPL with zero conversions, or where CPL is consistently > 50% above target benchmark.'
      },
      {
        title: 'Shift Budget to High-ROI Ad Sets',
        details: 'Increase budget allocation on top-performing campaigns by up to 20% every 48 hours to maintain algorithmic stability.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when budget reallocation is deployed and spend pacing is optimized.'
      }
    ]
  },
  {
    name: 'Meta Ads – Scaling',
    category: 'Development',
    owner: 'Meta Ads Specialist',
    version: '1.0',
    description: 'Executing vertical and horizontal scaling strategies on winning campaigns without breaking learning phase or inflating CPA.',
    steps_json: [
      {
        title: 'Execute Vertical Scaling (Budget Increases)',
        details: 'Increase daily budget of winning CBO campaigns by 15-20% every 48-72 hours. Avoid sudden 100% budget jumps which reset algorithmic learning.'
      },
      {
        title: 'Execute Horizontal Scaling (New Angles & Geographies)',
        details: 'Scale horizontally by launching new creative concepts, expanding geographic targeting (e.g. adding new cities/states), and targeting broader lookalike tiers (2-5%).'
      },
      {
        title: 'Monitor Pacing & Diminishing Returns',
        details: 'If CPL inflates by > 25% during scaling, stabilize budget and inject 2-3 fresh creative formats before increasing spend further.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when campaign is successfully scaled to target daily spend volume with profitable CPL.'
      }
    ]
  },
  {
    name: 'Meta Ads – Performance Reporting',
    category: 'Client Onboarding',
    owner: 'Meta Ads Specialist',
    version: '1.0',
    description: 'Compiling visual monthly Meta Ads performance deck with spend, impressions, CTR, leads, CPL, and ROAS metrics.',
    steps_json: [
      {
        title: 'Consolidate Verified Ad Performance Data',
        details: 'Export metrics: Total Spend, Total Impressions, Reach, Average Frequency, Link Clicks, CTR, Total Leads/Conversions, and Cost Per Lead (CPL).'
      },
      {
        title: 'Build Executive Monthly Performance Deck',
        details: 'Create slide deck showcasing MoM performance trends, showcase of top 3 winning ad creatives, and lead conversion volume.'
      },
      {
        title: 'Outline Next Month Creative & Scaling Roadmap',
        details: 'Present 3 strategic action items for next month (e.g., launching new UGC video angles, scaling winning CBO, testing new lookalikes).'
      },
      {
        title: 'Deliver Report & Conduct Review Call',
        details: 'Send report PDF to client and host 20-minute monthly strategy call.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when report is delivered and client approves next month strategy.'
      }
    ]
  },
  {
    name: 'Meta Ads – Client Review',
    category: 'QA',
    owner: 'Account Manager',
    version: '1.0',
    description: 'Quarterly strategic review evaluating campaign profitability, sales lead conversion rates, and retainer renewal.',
    steps_json: [
      {
        title: 'Prepare 90-Day Performance Summary',
        details: 'Synthesize 3-month ad spend vs revenue generated, customer acquisition trends, and market share capture.'
      },
      {
        title: 'Present Strategic Scaling Plan',
        details: 'If campaigns are highly profitable at target CPA, present data-backed proposal to increase ad spend budget.'
      },
      {
        title: 'Secure Retainer Renewal Sign-off',
        details: 'Confirm client approval on renewed quarterly budget and retainer terms.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when quarterly review concludes and updated budget plan is active.'
      }
    ]
  },
  {
    name: 'Meta Ads – Offboarding',
    category: 'Offboarding',
    owner: 'Account Manager',
    version: '1.0',
    description: 'Orderly conclusion of Meta Ads management, pausing or handing over active campaigns, and revoking partner access.',
    steps_json: [
      {
        title: 'Reconcile Final Management Fees',
        details: 'Confirm all agency management invoices are settled with Finance.'
      },
      {
        title: 'Coordinate Campaign Status Handover',
        details: 'Confirm whether client wants campaigns paused or left active for in-house management.'
      },
      {
        title: 'Deliver Creative Assets & Ad Copy Archives',
        details: 'Deliver all high-resolution graphic files, video reels, and copywriting matrices in a shared cloud drive for client retention.'
      },
      {
        title: 'Remove InfronixWeb Partner Permissions',
        details: 'Remove InfronixWeb Business Manager partner access from client Meta assets in Business Settings.'
      },
      {
        title: 'Archive Project in Founder OS',
        details: 'Mark project status as "Completed/Offboarded" in Founder OS.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when partner permissions are revoked, documentation delivered, and client offboarded.'
      }
    ]
  }
];
