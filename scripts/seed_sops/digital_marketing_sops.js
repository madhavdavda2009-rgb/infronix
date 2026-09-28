export const digitalMarketingSOPs = [
  {
    name: 'Digital Marketing – Lead Qualification',
    category: 'Sales',
    owner: 'Sales Manager',
    version: '1.0',
    description: 'Qualifying digital marketing prospects on business model, commercial unit economics, marketing budget, customer lifetime value, and growth goals.',
    steps_json: [
      {
        title: 'Review Prospect Business Model & Offering',
        details: 'Inspect prospect company profile, target product/service pricing, target customer type (B2B vs B2C), and current digital channels.'
      },
      {
        title: 'Assess Marketing Budget & Unit Economics',
        details: 'Verify that prospect has viable monthly advertising/marketing budget sufficient for multi-channel traction. Determine Customer Lifetime Value (LTV) and target Cost-per-Acquisition (CPA).'
      },
      {
        title: 'Conduct Initial Qualification Conversation',
        details: 'Call prospect within 4 hours. Clarify primary growth goals (revenue, qualified sales leads, e-commerce transactions, brand awareness) and historical marketing performance.'
      },
      {
        title: 'Determine Realistic Fit & Service Allocation',
        details: 'Evaluate whether prospect requires full-funnel marketing (SEO + Paid Ads + Content) or targeted single-channel approach. If unit economics are negative or prospect expects unrealistic instant viral outcomes, set proper expectations or decline.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when prospect is qualified with documented goals and unit economics, and scheduled for Strategy Discovery call.'
      }
    ]
  },
  {
    name: 'Digital Marketing – Client Onboarding',
    category: 'Client Onboarding',
    owner: 'Account Manager',
    version: '1.0',
    description: 'Setting up client portal, communication channels, marketing roadmap, and holding strategic kickoff.',
    steps_json: [
      {
        title: 'Verify Retainer Agreement & Advance Payment',
        details: 'Confirm countersigned Master Services Agreement and receipt of initial month marketing retainer with Finance.'
      },
      {
        title: 'Set Up Project Workspace in Founder OS',
        details: 'Create Digital Marketing workspace, client portal access, and define Month 1 milestone roadmap (Audit, Strategy, Setup, Launch).'
      },
      {
        title: 'Issue Marketing Strategy Intake Questionnaire',
        details: 'Send comprehensive questionnaire covering: Value propositions, Top buyer personas, Main competitors, Brand voice guidelines, Key offers/discounts, and Historical campaign data.'
      },
      {
        title: 'Establish Dedicated Communication Hub',
        details: 'Create dedicated WhatsApp client group or Slack channel. Introduce Account Manager and Digital Marketing Manager with standard SLA response hours.'
      },
      {
        title: 'Conduct Strategic Kickoff Meeting',
        details: 'Host 45-minute kickoff call with client stakeholders to review questionnaire responses, clarify marketing priorities, and confirm deliverable deadlines.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when kickoff meeting is concluded, meeting minutes shared, and business audit phase is initiated.'
      }
    ]
  },
  {
    name: 'Digital Marketing – Business Audit',
    category: 'Design',
    owner: 'Digital Marketing Manager',
    version: '1.0',
    description: 'Comprehensive audit of client current digital presence, website conversion rate, brand reputation, and past marketing campaigns.',
    steps_json: [
      {
        title: 'Audit Website Conversion Architecture',
        details: 'Inspect current website speed, mobile responsiveness, clarity of value propositions, lead form friction, CTA visibility, and proof elements (testimonials, case studies).'
      },
      {
        title: 'Audit Existing Paid & Organic Channels',
        details: 'Review historical Google Ads, Meta Ads, social media accounts, and organic search performance. Identify past winning hooks, wasteful ad spend, and missed opportunities.'
      },
      {
        title: 'Audit Brand Reputation & Customer Sentiment',
        details: 'Analyze Google Reviews, social media comments, Trustpilot, and customer feedback to identify brand perception strengths and weaknesses.'
      },
      {
        title: 'Synthesize Findings into Comprehensive Audit Report',
        details: 'Compile findings into SWOT analysis (Strengths, Weaknesses, Opportunities, Threats) with actionable recommendations.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when Business Audit report is reviewed internally and ready to guide marketing strategy formulation.'
      }
    ]
  },
  {
    name: 'Digital Marketing – Goal Definition',
    category: 'Sales',
    owner: 'Digital Marketing Manager',
    version: '1.0',
    description: 'Defining concrete, measurable, time-bound KPIs (Leads, MQLs, SQLs, CAC, ROAS, Revenue) aligned with client business objectives.',
    steps_json: [
      {
        title: 'Define Primary Commercial Objective',
        details: 'Clarify core business priority: E.g., Generate 50 qualified B2B sales enquiries/month at < ₹800 CPL, or achieve 3.5x blended ROAS for e-commerce store.'
      },
      {
        title: 'Establish Secondary Diagnostic Metrics',
        details: 'Define supporting metrics: Click-Through Rate (CTR), Landing Page Conversion Rate (CVR), Cost Per Click (CPC), Organic Traffic Growth, and Email Open/Click Rates.'
      },
      {
        title: 'Model Revenue & ROI Projections',
        details: 'Calculate funnel conversion stages: Traffic -> Leads -> Qualified Leads -> Closed Deals -> Revenue. Validate that target KPIs produce positive agency and client ROI.'
      },
      {
        title: 'Document Agreed KPI Framework in SOW',
        details: 'Present KPI framework to client and secure written agreement on baseline targets and reporting frequency.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when explicit numerical KPIs are documented and signed off by client and Project Manager.'
      }
    ]
  },
  {
    name: 'Digital Marketing – Target Audience Research',
    category: 'Design',
    owner: 'Digital Marketing Manager',
    version: '1.0',
    description: 'Conducting deep demographic, psychographic, behavioral, and pain-point research to build actionable buyer personas.',
    steps_json: [
      {
        title: 'Interview Client Sales & Support Teams',
        details: 'Extract real customer insights: Top customer objections, primary buying triggers, common FAQs, and the profile of high-value vs problematic clients.'
      },
      {
        title: 'Analyze Customer Demographics & Firmographics',
        details: 'Identify primary age brackets, gender distribution, location clusters, household income / company size, job titles, and industry sectors.'
      },
      {
        title: 'Map Psychographics, Pain Points & Desires',
        details: 'Document target audience deepest fears, urgent problems, frustrations with existing market alternatives, and desired emotional/business transformations.'
      },
      {
        title: 'Construct 2-3 Actionable Buyer Persona Profiles',
        details: 'Create visual Buyer Persona cards detailing: Persona Name, Demographics, Primary Goals, Pain Points, Media Consumption Habits, and High-Converting Value Hooks.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when Buyer Persona documentation is finalized and shared with copywriters, designers, and ad specialists.'
      }
    ]
  },
  {
    name: 'Digital Marketing – Competitor Analysis',
    category: 'Design',
    owner: 'Digital Marketing Manager',
    version: '1.0',
    description: 'Analyzing competitor marketing funnels, paid ad creatives, messaging angles, pricing, and promotional offers.',
    steps_json: [
      {
        title: 'Identify Top 3-5 Direct Competitors',
        details: 'Select direct competitors actively spending marketing budget and competing for the same market share in target regions.'
      },
      {
        title: 'Audit Competitor Meta Ad Library & Google Ads',
        details: 'Inspect competitor active ads in Meta Ad Library and Google Ads Transparency Center. Document their top creative formats (Video, Carousel, Static), copywriting hooks, and promotional offers.'
      },
      {
        title: 'Analyze Competitor Funnels & Landing Pages',
        details: 'Click competitor ads to analyze their landing pages: Headline clarity, social proof, pricing transparency, form fields, and post-submission thank you flows.'
      },
      {
        title: 'Identify Market Gaps & Differentiators',
        details: 'Uncover what competitors are ignoring (e.g. poor mobile speed, weak guarantees, lack of transparent pricing, slow response time) and position InfronixWeb client as the superior alternative.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when Competitor Intelligence Matrix is documented with clear differentiation strategies.'
      }
    ]
  },
  {
    name: 'Digital Marketing – Funnel Planning',
    category: 'Design',
    owner: 'Digital Marketing Manager',
    version: '1.0',
    description: 'Designing full-funnel customer acquisition journeys across Top-of-Funnel (TOFU), Middle-of-Funnel (MOFU), and Bottom-of-Funnel (BOFU).',
    steps_json: [
      {
        title: 'Map Top-of-Funnel (TOFU) Awareness Stage',
        details: 'Design cold audience awareness campaigns: Problem-aware video ads, educational guides, high-value social content, and SEO informational blogs.'
      },
      {
        title: 'Map Middle-of-Funnel (MOFU) Consideration Stage',
        details: 'Design lead capture and consideration mechanics: Case studies, comparison landing pages, free consultations, downloadable lead magnets, and retargeting ads.'
      },
      {
        title: 'Map Bottom-of-Funnel (BOFU) Conversion Stage',
        details: 'Design high-intent conversion mechanisms: Direct consultation booking forms, limited-time promotional offers, WhatsApp direct chat, and automated email follow-up sequences.'
      },
      {
        title: 'Create Visual Funnel Architecture Diagram',
        details: 'Construct visual flowchart mapping traffic sources -> landing pages -> CRM lead capture -> automated follow-ups -> sales handoff.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when Full-Funnel Architecture Diagram is approved by client and ready for channel implementation.'
      }
    ]
  },
  {
    name: 'Digital Marketing – Channel Selection',
    category: 'Design',
    owner: 'Digital Marketing Manager',
    version: '1.0',
    description: 'Selecting optimal marketing channels (Google Search, Meta Ads, LinkedIn, SEO, Social, Email) based on target audience persona and budget.',
    steps_json: [
      {
        title: 'Evaluate Channel Intent vs Audience Behavior',
        details: 'Match client offering to channel dynamics: High-intent problem search -> Google Search Ads & SEO. Visual impulse / lifestyle B2C -> Meta Ads (Instagram/Facebook). B2B Enterprise -> LinkedIn & Google Search. Nurture & Retention -> WhatsApp & Email Automation.'
      },
      {
        title: 'Allocate Marketing Budget by Channel',
        details: 'Distribute monthly budget across selected channels based on ROI expectations (e.g., 60% Core High-Intent Channel, 30% Retargeting/Nurture, 10% Creative Testing).'
      },
      {
        title: 'Document Channel Strategy & Rationales',
        details: 'Present channel selection rationale and budget distribution to client for approval.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when Channel Selection matrix and budget breakdown are finalized and signed off.'
      }
    ]
  },
  {
    name: 'Digital Marketing – Campaign Planning',
    category: 'Design',
    owner: 'Digital Marketing Manager',
    version: '1.0',
    description: 'Formulating detailed campaign blueprints, messaging themes, creative assets requirements, and launch schedules.',
    steps_json: [
      {
        title: 'Define Campaign Core Theme & Irresistible Offer',
        details: 'Formulate compelling campaign offer (e.g. "Free 30-Min Technical Audit", "Flat 20% Launch Discount", "Free Discovery Blueprint"). Ensure offer has clear perceived value and low friction.'
      },
      {
        title: 'Draft Campaign Creative & Copywriting Briefs',
        details: 'Write creative briefs for designers and copywriters specifying ad angles, hooks, headlines, visual layouts, and video script storyboards.'
      },
      {
        title: 'Plan Landing Page Variations for A/B Testing',
        details: 'Define primary and challenger landing page variants to test headline hooks, form lengths, and social proof elements.'
      },
      {
        title: 'Establish Campaign Launch Timeline & Milestones',
        details: 'Schedule production deadlines: Creative Delivery -> Tracking Setup -> Internal QA -> Client Approval -> Live Launch.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when Campaign Plan Blueprint is approved by Project Manager and delegated to creative/media teams.'
      }
    ]
  },
  {
    name: 'Digital Marketing – Content Strategy',
    category: 'Design',
    owner: 'Digital Marketing Manager',
    version: '1.0',
    description: 'Developing content pillars, storytelling frameworks, distribution schedules, and editorial guidelines across organic and paid channels.',
    steps_json: [
      {
        title: 'Establish 4-5 Core Content Pillars',
        details: 'Define foundational brand pillars: 1) Industry Expertise & How-To, 2) Client Case Studies & Proof, 3) Behind-the-Scenes & Culture, 4) Product/Service Deep Dives, 5) Overcoming Common Objections.'
      },
      {
        title: 'Define Content Formats & Repurposing Engine',
        details: 'Design multi-channel repurposing workflow: 1 Long-form pillar piece (blog or case study) -> 3 Short-form social posts -> 1 Reel/Video script -> 1 Email newsletter snippet.'
      },
      {
        title: 'Establish Brand Voice, Tone & Visual Guidelines',
        details: 'Document tone rules: Professional, authoritative, actionable, approachable. Ban generic corporate jargon and buzzwords.'
      },
      {
        title: 'Create 30-Day Master Editorial Calendar',
        details: 'Schedule planned content pieces with publication dates, target channels, visual formats, and assigned creators in Founder OS.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when 30-Day Content Strategy and Editorial Calendar are approved by client.'
      }
    ]
  },
  {
    name: 'Digital Marketing – Tracking Setup',
    category: 'Development',
    owner: 'Digital Marketing Manager',
    version: '1.0',
    description: 'Implementing cross-channel tracking via Google Tag Manager, GA4, Meta Pixel, Conversion API, and UTM standard conventions.',
    steps_json: [
      {
        title: 'Deploy Google Tag Manager (GTM) Container',
        details: 'Install GTM container across all website pages. Verify container triggers properly without console errors.'
      },
      {
        title: 'Configure Standard Conversion Events in GTM',
        details: 'Create custom event triggers for form submissions, phone call clicks, WhatsApp chat clicks, and button interactions.'
      },
      {
        title: 'Deploy Meta Pixel & Conversion API (CAPI)',
        details: 'Configure Meta Pixel in GTM and deploy server-side CAPI for resilient conversion tracking bypassing browser ad-blockers.'
      },
      {
        title: 'Establish Standardized UTM Parameter Convention',
        details: 'Create Master UTM Builder spreadsheet. Enforce naming convention: utm_source (google/facebook/linkedin), utm_medium (cpc/social/email), utm_campaign (campaign_name), utm_content (ad_hook_format).'
      },
      {
        title: 'Conduct End-to-End Tracking Test',
        details: 'Perform live test submission using GTM Preview Mode, Meta Pixel Helper, and GA4 DebugView. Confirm conversion events fire with 100% accuracy.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when all tracking tags pass QA, conversions record in GA4 and Ad accounts, and UTM builder is distributed to media buyers.'
      }
    ]
  },
  {
    name: 'Digital Marketing – Campaign Execution',
    category: 'Deployment',
    owner: 'Digital Marketing Manager',
    version: '1.0',
    description: 'Deploying campaigns across ad platforms and social channels, verifying budget parameters, ad copy, creative assets, and live URLs.',
    steps_json: [
      {
        title: 'Build Campaigns in Ad Managers',
        details: 'Assemble campaigns in Google Ads, Meta Ads Manager, or LinkedIn Ads: Set campaign objectives, bidding strategies, daily budget caps, geographic targeting, and language constraints.'
      },
      {
        title: 'Upload Approved Creatives & Copy',
        details: 'Upload high-resolution graphics, video creatives, primary text, headlines, and descriptions matching approved campaign blueprints.'
      },
      {
        title: 'Verify Landing Page URLs & UTM Strings',
        details: 'Click destination URL of every single ad in preview mode to confirm landing page loads fast with correct UTM parameters attached.'
      },
      {
        title: 'Conduct Pre-Launch Checklist Audit',
        details: 'Verify campaign end dates, payment method billing threshold, location targeting exclusions, and demographic parameters.'
      },
      {
        title: 'Publish Campaigns to Live Status',
        details: 'Set campaigns from Draft to Active. Verify ads pass platform policy review without rejection.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when all planned campaigns are live, delivering impressions, tracking conversions, and compliant with platform policies.'
      }
    ]
  },
  {
    name: 'Digital Marketing – Weekly Review',
    category: 'QA',
    owner: 'Digital Marketing Manager',
    version: '1.0',
    description: 'Weekly performance health check, reviewing spend pacing, lead quality, CPL trends, and implementing tactical adjustments.',
    steps_json: [
      {
        title: 'Audit Spend Pacing & Budget Utilization',
        details: 'Compare actual spend against monthly budget allocation. Ensure campaigns are pacing evenly across the month without under-spending or over-spending.'
      },
      {
        title: 'Evaluate Weekly Lead Volume & CPL',
        details: 'Review total leads generated, Cost Per Lead (CPL), and compare against target KPI benchmarks.'
      },
      {
        title: 'Cross-Check Lead Quality with Client Sales Team',
        details: 'Review incoming leads with client: Confirm percentage of qualified vs disqualified leads. Identify any recurring unqualified lead patterns.'
      },
      {
        title: 'Perform Weekly Tactical Adjustments',
        details: 'Pause underperforming ads (high CPL, low CTR), shift budget to top performing creatives, and add newly discovered negative search queries.'
      },
      {
        title: 'Send Brief Weekly Performance Summary',
        details: 'Post concise 4-bullet update in client WhatsApp/Slack channel: Total Spend, Leads Generated, Average CPL, Key Optimizations for next week.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when weekly review is documented in Founder OS and client receives weekly summary update.'
      }
    ]
  },
  {
    name: 'Digital Marketing – Monthly Optimization',
    category: 'Development',
    owner: 'Digital Marketing Manager',
    version: '1.0',
    description: 'Deep monthly optimization covering audience pruning, creative refresh, landing page CRO experiments, and bid strategy adjustments.',
    steps_json: [
      {
        title: 'Perform 30-Day Performance Breakdown',
        details: 'Analyze aggregate performance across demographics, placements, devices, locations, and time-of-day. Identify pockets of wasted budget.'
      },
      {
        title: 'Rotate Ad Creatives to Combat Ad Fatigue',
        details: 'Identify ads with rising frequency (> 3.5) and declining CTR. Introduce 2-4 fresh creative concepts, new video hooks, or new testimonial graphics.'
      },
      {
        title: 'Optimize Landing Page Conversion Rates (CRO)',
        details: 'Review heatmap recordings (Hotjar/Clarity). Test improvements to headline clarity, mobile form layout, or CTA button contrast.'
      },
      {
        title: 'Refine Audience Targeting & Exclusions',
        details: 'Exclude converted users, prune underperforming interest groups, and update Lookalike audiences with fresh customer list uploads.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when monthly optimizations are deployed, documented in changelog, and set for next cycle monitoring.'
      }
    ]
  },
  {
    name: 'Digital Marketing – Monthly Reporting',
    category: 'Client Onboarding',
    owner: 'Digital Marketing Manager',
    version: '1.0',
    description: 'Compiling comprehensive multi-channel performance deck with executive summaries, ROI analysis, and strategic roadmap.',
    steps_json: [
      {
        title: 'Consolidate Cross-Channel Analytics Data',
        details: 'Export verified metrics: Total Ad Spend, Total Impressions, Clicks, Blended CTR, Total Leads/Conversions, Blended CPL, Customer Acquisition Cost (CAC), and Revenue/ROAS.'
      },
      {
        title: 'Build Executive Performance Deck',
        details: 'Create clean, visual reporting deck highlighting: Month-over-Month growth, actual vs target KPI performance, winning creative showcases, and key insights.'
      },
      {
        title: 'Outline Next Month Strategic Focus',
        details: 'Present 3 clear strategic initiatives for the upcoming month (e.g. launching new service campaign, scaling winning ad angles, CRO test on pricing page).'
      },
      {
        title: 'Deliver Report & Conduct Client Walkthrough',
        details: 'Send report PDF via email/portal and host 30-minute monthly strategy call with client leadership.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when monthly report is presented, client questions are resolved, and next month action plan is approved.'
      }
    ]
  },
  {
    name: 'Digital Marketing – Client Review',
    category: 'QA',
    owner: 'Account Manager',
    version: '1.0',
    description: 'Quarterly business review (QBR), evaluating long-term ROI, client relationship health, contract renewal, and account expansion.',
    steps_json: [
      {
        title: 'Prepare Quarterly Business Review (QBR) Deck',
        details: 'Compile 90-day macro performance trends: Revenue generated, cumulative qualified leads, brand market share growth, and efficiency gains.'
      },
      {
        title: 'Conduct Strategic Alignment Meeting',
        details: 'Meet with senior client executives to review business goals for the upcoming quarter (new product launches, regional expansion, increased hiring).'
      },
      {
        title: 'Identify Expansion & Upsell Opportunities',
        details: 'Evaluate if client would benefit from adding complementary services (e.g., adding WhatsApp Automation to convert leads faster, or custom Web revamp).'
      },
      {
        title: 'Secure Retainer Renewal or Contract Expansion',
        details: 'Draft renewal contract or expanded SOW with updated scope, budget, and deliverables.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when QBR meeting is concluded, meeting minutes recorded, and contract renewal is processed.'
      }
    ]
  },
  {
    name: 'Digital Marketing – Offboarding',
    category: 'Offboarding',
    owner: 'Account Manager',
    version: '1.0',
    description: 'Professional wind-down of marketing retainer, delivering asset archives, final accounting reconciliation, and access revocation.',
    steps_json: [
      {
        title: 'Reconcile Final Financial Obligations',
        details: 'Ensure all agency retainer fees and any third-party ad spend bills are fully settled with Finance.'
      },
      {
        title: 'Pause Active Campaigns or Handover to In-House Team',
        details: 'Coordinate with client: Pause agency-managed ad campaigns, or conduct formal handover session with client in-house marketing manager.'
      },
      {
        title: 'Deliver Creative Assets & Strategy Documentation',
        details: 'Package all high-res ad creatives, video files, copywriting repositories, audience research decks, and performance reports in a shared cloud archive.'
      },
      {
        title: 'Revoke Agency Access to Client Ad Accounts & Tools',
        details: 'Remove InfronixWeb team members from client Meta Business Manager, Google Ads, GA4, GTM, and social media channels.'
      },
      {
        title: 'Archive Client Workspace in Founder OS',
        details: 'Mark client status as "Completed/Offboarded" in Founder OS with exit notes and final feedback.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when all assets are delivered, access permissions are revoked, and client offboarding checklist is 100% completed.'
      }
    ]
  }
];
