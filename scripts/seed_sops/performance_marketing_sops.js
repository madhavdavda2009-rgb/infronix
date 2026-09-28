export const performanceMarketingSOPs = [
  {
    name: 'Performance Marketing – Client Onboarding',
    category: 'Client Onboarding',
    owner: 'Account Manager',
    version: '1.0',
    description: 'Onboarding performance marketing client, establishing baseline revenue metrics, and aligning on commercial targets.',
    steps_json: [
      {
        title: 'Verify Retainer Management Advance',
        details: 'Confirm receipt of initial monthly management fee with Finance before campaign engineering.'
      },
      {
        title: 'Set Up Performance Workspace in Founder OS',
        details: 'Provision project board, define key deliverables, and schedule weekly performance sync cadence.'
      },
      {
        title: 'Collect Full-Funnel Historical Data',
        details: 'Extract past 6-12 months of marketing data: Ad spend by platform, gross revenue, total leads/orders, average order value (AOV), refund rates, and sales close rates.'
      },
      {
        title: 'Conduct Performance Kickoff Meeting',
        details: 'Host 45-minute kickoff call with client executive team to establish target CPA/ROAS targets and sprint milestones.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when historical metrics are audited and kickoff meeting concluded.'
      }
    ]
  },
  {
    name: 'Performance Marketing – Business Economics Review',
    category: 'Finance',
    owner: 'Performance Marketer',
    version: '1.0',
    description: 'Auditing gross profit margins, customer lifetime value (LTV), payback period, and calculating maximum allowable Cost Per Acquisition (CPA).',
    steps_json: [
      {
        title: 'Calculate Gross Profit Margin by Product/Service',
        details: 'Document retail price minus Cost of Goods Sold (COGS) or delivery fulfillment costs for all priority offerings.'
      },
      {
        title: 'Determine Customer Lifetime Value (LTV)',
        details: 'Calculate average repurchase rate or retainer retention duration to determine true 6-month and 12-month customer value.'
      },
      {
        title: 'Establish Break-Even & Target CPA Thresholds',
        details: 'Calculate: 1) Break-Even CPA (Gross Margin per deal), 2) Target CPA (Gross Margin minus target net profit margin). Define hard upper CPA limit for media buyers.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when Unit Economics Model is approved by client and documented in media plan.'
      }
    ]
  },
  {
    name: 'Performance Marketing – KPI Definition',
    category: 'Sales',
    owner: 'Performance Marketer',
    version: '1.0',
    description: 'Defining concrete commercial KPIs (MQLs, SQLs, CPL, CPA, CAC, MER, ROAS, Net Revenue) and banishing vanity metrics.',
    steps_json: [
      {
        title: 'Establish Primary Revenue & Growth KPIs',
        details: 'Define core success metrics: Marketing Efficiency Ratio (MER = Total Revenue / Total Ad Spend), Blended CAC, Target Cost Per Qualified Lead (CPQL), and Return on Ad Spend (ROAS).'
      },
      {
        title: 'Define Stage-by-Stage Funnel Conversion Benchmarks',
        details: 'Set expected conversion rates: Ad Click -> Landing Page Lead (target >= 8%), Lead -> Sales Qualified (target >= 40%), SQL -> Closed Sale (target >= 25%).'
      },
      {
        title: 'Ban Blind Vanity Metric Optimization',
        details: 'Explicitly instruct team to prioritize paid conversions and qualified revenue over vanity metrics like raw impressions, video views, or page likes.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when numerical KPI scorecard is agreed upon and integrated into live tracking dashboard.'
      }
    ]
  },
  {
    name: 'Performance Marketing – Tracking Architecture',
    category: 'Development',
    owner: 'Performance Marketer',
    version: '1.0',
    description: 'Designing omni-channel tracking infrastructure across GTM, GA4, Google Ads, Meta CAPI, and CRM offline conversion imports.',
    steps_json: [
      {
        title: 'Design Master Tag Management Container',
        details: 'Deploy centralized Google Tag Manager container with standardized trigger groups for all conversion funnels.'
      },
      {
        title: 'Implement Multi-Touch Attribution Tracking',
        details: 'Configure GA4 data-driven attribution and establish UTM naming conventions across Google, Meta, LinkedIn, and Email.'
      },
      {
        title: 'Configure CRM Offline Conversion Tracking (OCT)',
        details: 'Set up GCLID (Google Click ID) and fbclid capture on lead forms to pass closed deals back to ad platforms for smart bidding optimization.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when end-to-end tracking architecture is tested and verified capturing both online leads and offline closed sales.'
      }
    ]
  },
  {
    name: 'Performance Marketing – Funnel Audit',
    category: 'QA',
    owner: 'Performance Marketer',
    version: '1.0',
    description: 'Comprehensive audit of conversion landing pages, speed, mobile usability, form drop-offs, and payment checkouts.',
    steps_json: [
      {
        title: 'Audit Funnel Drop-off Points in GA4 / Heatmaps',
        details: 'Analyze user drop-off between Landing Page View -> Form Interaction -> Form Submit -> Thank You Page.'
      },
      {
        title: 'Identify Form & Friction Bottlenecks',
        details: 'Audit field count on lead forms. Remove unnecessary fields that reduce conversion rates.'
      },
      {
        title: 'Verify Social Proof & Trust Architecture',
        details: 'Ensure customer testimonials, case study metrics, client logos, and guarantee badges are positioned near CTA buttons.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when Funnel Audit document with prioritized CRO recommendations is approved for development.'
      }
    ]
  },
  {
    name: 'Performance Marketing – Channel Strategy',
    category: 'Design',
    owner: 'Performance Marketer',
    version: '1.0',
    description: 'Selecting optimal paid acquisition channel mix (Google Search, Meta Ads, YouTube, LinkedIn) based on unit economics.',
    steps_json: [
      {
        title: 'Match Channels to Funnel Intent Levels',
        details: 'Assign channels: High-Intent Capture (Google Search) -> High-Volume Demand Generation (Meta Ads / YouTube) -> High-Trust B2B (LinkedIn) -> Bottom-Funnel Retargeting.'
      },
      {
        title: 'Determine Channel Investment Ratio',
        details: 'Allocate budget based on unit economics (e.g., 50% Meta Cold Demand, 35% Google Search High-Intent, 15% Cross-Channel Retargeting).'
      },
      {
        title: 'Document Channel Synergy Workflows',
        details: 'Map how Meta video views fuel search brand queries and retargeting audiences.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when Multi-Channel Media Strategy Blueprint is finalized.'
      }
    ]
  },
  {
    name: 'Performance Marketing – Budget Allocation',
    category: 'Finance',
    owner: 'Performance Marketer',
    version: '1.0',
    description: 'Setting monthly, weekly, and daily budget distributions across channels and reserving dedicated testing budgets.',
    steps_json: [
      {
        title: 'Calculate Platform-Specific Daily Spend Caps',
        details: 'Calculate exact daily budgets per campaign to ensure smooth spend pacing throughout the month.'
      },
      {
        title: 'Reserve 15-20% Dedicated Experimentation Sandbox',
        details: 'Protect 15-20% of monthly ad spend specifically for testing new creative concepts, landing page variants, and experimental channels.'
      },
      {
        title: 'Establish Budget Emergency Cutoff Thresholds',
        details: 'Define safety rules: E.g., if daily spend reaches 150% of target cap without conversions, trigger automated pause rule.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when Budget Allocation Spreadsheet is approved and configured across ad managers.'
      }
    ]
  },
  {
    name: 'Performance Marketing – Campaign Planning',
    category: 'Design',
    owner: 'Performance Marketer',
    version: '1.0',
    description: 'Structuring campaign hierarchies, naming conventions, UTM taxonomies, and cross-platform creative themes.',
    steps_json: [
      {
        title: 'Standardize Campaign Naming Taxonomy',
        details: 'Enforce naming convention: [Brand]_[Platform]_[Objective]_[FunnelStage]_[Audience/Theme]_[Date] (e.g., INF_META_LEADS_TOFU_BROAD_2026Q1).'
      },
      {
        title: 'Create Master Campaign Blueprint',
        details: 'Map all planned campaigns, ad sets, audience definitions, bid strategies, and creative assets into centralized campaign blueprint.'
      },
      {
        title: 'Review Blueprint with Technical & Creative Leads',
        details: 'Ensure all required landing pages and creative assets are delivered before launch date.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when Master Campaign Plan is locked and approved.'
      }
    ]
  },
  {
    name: 'Performance Marketing – Creative Testing',
    category: 'Design',
    owner: 'Performance Marketer',
    version: '1.0',
    description: 'Continuous high-velocity creative testing protocol to identify winning hooks, formats, and copywriting angles.',
    steps_json: [
      {
        title: 'Produce 5-10 New Creative Variations per Sprint',
        details: 'Test distinct creative formats: UGC Video Hooks, Static Feature Breakdowns, Founder Story, Problem-Agitation-Solution, Case Study Carousels.'
      },
      {
        title: 'Deploy in Isolated Dynamic Creative Testing Ad Sets',
        details: 'Launch test creatives with fixed daily budget and broad targeting to allow the algorithm to test resonance.'
      },
      {
        title: 'Evaluate Metrics: Hook Rate, Hold Rate, CTR, CPL',
        details: 'Analyze: 3-second Hook Rate (> 30%), Hold Rate (> 15%), Outbound CTR (> 1.5%), and Cost Per Lead.'
      },
      {
        title: 'Scale Winning Creatives to Core Campaigns',
        details: 'Graduate top 1-2 performing creatives into scaling CBO campaigns.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when bi-weekly creative testing cycle concludes with documented winners.'
      }
    ]
  },
  {
    name: 'Performance Marketing – Landing Page Testing',
    category: 'Development',
    owner: 'Performance Marketer',
    version: '1.0',
    description: 'Executing systematic A/B split tests on landing page headlines, form layouts, social proof placement, and offer framing.',
    steps_json: [
      {
        title: 'Formulate Single-Variable Hypothesis',
        details: 'Define test (e.g. "Replacing multi-step form with direct WhatsApp click will increase conversion rate by 25% on mobile").'
      },
      {
        title: 'Deploy Split URL or In-App A/B Test',
        details: 'Configure 50/50 traffic split via Google Optimize alternative / server-side Next.js middleware / Vercel Edge Config.'
      },
      {
        title: 'Collect Minimum Statistical Sample',
        details: 'Run test until achieving >= 100 conversions per variant and 95% statistical significance.'
      },
      {
        title: 'Deploy Winning Variant to Production',
        details: 'Merge winning landing page to primary URL and archive losing variant.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when split test achieves statistical significance and winning variant is deployed.'
      }
    ]
  },
  {
    name: 'Performance Marketing – Conversion Tracking QA',
    category: 'QA',
    owner: 'QA Specialist',
    version: '1.0',
    description: 'Pre-flight tracking audit verifying tag firing, event parameters, conversion deduplication, and attribution integrity.',
    steps_json: [
      {
        title: 'Perform Live Test Conversion on All Funnels',
        details: 'Submit live test conversions across all landing pages in GTM Preview mode and Meta Test Events tool.'
      },
      {
        title: 'Verify GA4 and Ad Manager Attribution',
        details: 'Confirm test conversion attributes correctly to source campaign UTM parameters in GA4 DebugView.'
      },
      {
        title: 'Verify Server-Side CAPI Deduplication',
        details: 'Confirm event_id deduplication occurs with zero duplicate counts in Meta Events Manager.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when QA Specialist marks tracking 100% verified across all platforms.'
      }
    ]
  },
  {
    name: 'Performance Marketing – Daily Monitoring',
    category: 'QA',
    owner: 'Performance Marketer',
    version: '1.0',
    description: 'Daily morning audit checking cross-channel spend pacing, blended CPL/CPA, ROAS, and lead delivery hygiene.',
    steps_json: [
      {
        title: 'Check Daily Spend & Pacing Across All Platforms',
        details: 'Inspect Google Ads, Meta Ads, and other channels. Verify total daily spend is on track.'
      },
      {
        title: 'Calculate Blended Daily CPL & CPA',
        details: 'Calculate total spend divided by total verified leads across all channels. Compare against KPI benchmark.'
      },
      {
        title: 'Spot & Fix Outlier Ad Fatigue or Budget Spikes',
        details: 'If an ad set spikes > 2x in CPA with frequency > 3.0, pause immediately.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when daily monitoring dashboard is reviewed and logged.'
      }
    ]
  },
  {
    name: 'Performance Marketing – Weekly Optimization',
    category: 'Development',
    owner: 'Performance Marketer',
    version: '1.0',
    description: 'Weekly tactical sprint reviewing keyword search terms, bid strategy adjustments, ad creative rotations, and audience pruning.',
    steps_json: [
      {
        title: 'Review 7-Day Performance Trends',
        details: 'Analyze performance by campaign, placement, device, and demographic.'
      },
      {
        title: 'Prune Underperforming Ads & Keywords',
        details: 'Pause ads with high CPA / low CTR. Negate wasteful search terms in Google Ads.'
      },
      {
        title: 'Deploy Fresh Creative Refresh Batch',
        details: 'Launch 2-3 fresh creatives in testing sandbox to replace fatigued ads.'
      },
      {
        title: 'Share 4-Bullet Weekly Performance Summary',
        details: 'Post concise performance summary to client communication channel.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when weekly optimizations are deployed and summary shared with client.'
      }
    ]
  },
  {
    name: 'Performance Marketing – Budget Reallocation',
    category: 'Finance',
    owner: 'Performance Marketer',
    version: '1.0',
    description: 'Reallocating monthly ad spend across platforms based on blended CAC and lowest marginal customer acquisition cost.',
    steps_json: [
      {
        title: 'Compare Platform Marginal Cost of Acquisition',
        details: 'Evaluate which channel (Google Search vs Meta Ads vs LinkedIn) delivers the highest quality leads at the lowest CAC.'
      },
      {
        title: 'Shift Budget to Winning Channel',
        details: 'Reallocate 10-25% of underperforming channel budget to the highest-ROI channel.'
      },
      {
        title: 'Monitor Pacing & Diminishing Returns Post-Shift',
        details: 'Ensure expanded channel maintains profitable CPA with increased budget.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when budget reallocation is executed and verified in platform spend pacing.'
      }
    ]
  },
  {
    name: 'Performance Marketing – Scaling',
    category: 'Development',
    owner: 'Performance Marketer',
    version: '1.0',
    description: 'Scaling paid marketing budgets horizontally and vertically while maintaining target CPA and high lead quality.',
    steps_json: [
      {
        title: 'Verify Scaling Readiness (Stable CPA for 14 Days)',
        details: 'Confirm campaign has maintained target CPA/ROAS for at least 14 consecutive days with healthy lead-to-close conversion rates.'
      },
      {
        title: 'Execute Controlled Budget Scaling (+20% every 48-72h)',
        details: 'Scale daily budgets incrementally by 15-20% every 2-3 days to keep smart bidding algorithms stable.'
      },
      {
        title: 'Expand Geographies & High-Intent Search Clusters',
        details: 'Scale horizontally by adding adjacent target cities, lookalike audience tiers, and broad interest clusters.'
      },
      {
        title: 'Deploy Continuous High-Volume Creative Flow',
        details: 'Ensure 3-5 fresh creative variations are launched weekly to prevent ad fatigue at higher daily spend volumes.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when campaign scales to target spend volume with profitable unit economics.'
      }
    ]
  },
  {
    name: 'Performance Marketing – Performance Analysis',
    category: 'QA',
    owner: 'Performance Marketer',
    version: '1.0',
    description: 'Conducting in-depth monthly attribution modeling, cohort analysis, customer journey mapping, and CAC vs LTV evaluation.',
    steps_json: [
      {
        title: 'Audit Multi-Touch Attribution in GA4',
        details: 'Analyze first-click vs last-click attribution models to understand true channel interaction and assisted conversions.'
      },
      {
        title: 'Perform Lead Quality Cohort Analysis',
        details: 'Cross-reference ad campaign source with actual closed revenue in client CRM to calculate exact channel ROI.'
      },
      {
        title: 'Calculate Marketing Efficiency Ratio (MER)',
        details: 'Calculate blended MER (Total Net Revenue / Total Advertising Spend). Benchmark against target (e.g. > 4.0x MER).'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when comprehensive Performance Analysis deck is completed for monthly reporting.'
      }
    ]
  },
  {
    name: 'Performance Marketing – Monthly Reporting',
    category: 'Client Onboarding',
    owner: 'Performance Marketer',
    version: '1.0',
    description: 'Delivering comprehensive monthly performance marketing report with executive summary, revenue attribution, and scaling roadmap.',
    steps_json: [
      {
        title: 'Compile Verified Omni-Channel Data',
        details: 'Aggregate data: Total Spend, Impressions, Clicks, Blended CPL, Total Qualified Leads, Closed Revenue, Blended CAC, and Blended MER/ROAS.'
      },
      {
        title: 'Build Executive Presentation Deck',
        details: 'Create slide deck showcasing MoM performance comparisons, winning creative concepts, and revenue generated.'
      },
      {
        title: 'Present 3 Strategic Scaling Priorities for Next Month',
        details: 'Detail planned creative testing angles, landing page experiments, and budget scaling recommendations.'
      },
      {
        title: 'Deliver Report & Host Client Strategy Session',
        details: 'Send report PDF to client and lead 30-minute monthly strategy call.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when report is delivered and client approves next month strategy.'
      }
    ]
  },
  {
    name: 'Performance Marketing – Client Review',
    category: 'QA',
    owner: 'Account Manager',
    version: '1.0',
    description: 'Quarterly business review (QBR) evaluating commercial profitability, customer acquisition efficiency, and budget expansion.',
    steps_json: [
      {
        title: 'Prepare 90-Day Financial Performance Summary',
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
    name: 'Performance Marketing – Offboarding',
    category: 'Offboarding',
    owner: 'Account Manager',
    version: '1.0',
    description: 'Orderly conclusion of performance marketing management, delivering asset archives, and revoking ad manager permissions.',
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
        title: 'Deliver Creative Assets & Strategy Documentation',
        details: 'Deliver all high-resolution graphic files, video reels, and copywriting matrices in a shared cloud drive for client retention.'
      },
      {
        title: 'Revoke Agency Access to Client Ad Accounts & Tools',
        details: 'Remove InfronixWeb team members from client Meta Business Manager, Google Ads, GA4, GTM, and CRM.'
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
