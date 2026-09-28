export const googleAdsSOPs = [
  {
    name: 'Google Ads – Client Qualification',
    category: 'Sales',
    owner: 'Sales Manager',
    version: '1.0',
    description: 'Qualifying prospect business model, average order value/deal size, target ad budget, CPC economics, and conversion feasibility before onboarding.',
    steps_json: [
      {
        title: 'Estimate Industry Cost-Per-Click (CPC) & Search Demand',
        details: 'Check Google Keyword Planner for estimated top-of-page CPCs in client target industry and geographic location. Determine if client budget can support at least 15-20 clicks per day.'
      },
      {
        title: 'Evaluate Commercial Unit Economics',
        details: 'Calculate target customer lifetime value (LTV), deal margin, and allowable Cost Per Lead (CPL) / Cost Per Acquisition (CPA). If average deal size is ₹500 and industry CPC is ₹150, flag unprofitable unit economics before proceeding.'
      },
      {
        title: 'Audit Landing Page Conversion Readiness',
        details: 'Inspect prospect website or proposed landing page. Verify fast loading speed, clear offer, visible phone/form, and mobile usability. If page is broken, mandate landing page creation in the scope.'
      },
      {
        title: 'Set Strict Expectation Rules (Zero Guarantees)',
        details: 'Clearly state to client that ad platforms fluctuate based on auction dynamics and competition. Never guarantee specific lead quantities or sales revenue.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when commercial viability and budget economics are verified, expectations set, and proposal issued.'
      }
    ]
  },
  {
    name: 'Google Ads – Client Onboarding',
    category: 'Client Onboarding',
    owner: 'Account Manager',
    version: '1.0',
    description: 'Setting up Google Ads management workspace, client billing arrangements, campaign timeline, and kickoff alignment.',
    steps_json: [
      {
        title: 'Verify Retainer Management Advance Payment',
        details: 'Confirm receipt of agency ad management fee with Finance before account configuration.'
      },
      {
        title: 'Establish Direct Client Ad Spend Billing',
        details: 'Ensure client links their own credit card / net banking directly inside their Google Ads billing settings. Agency does not finance client ad spend.'
      },
      {
        title: 'Issue Google Ads Strategic Intake Questionnaire',
        details: 'Gather: Priority services, high-margin products, target geographic cities/radius, negative service lines to exclude, and primary competitor names.'
      },
      {
        title: 'Conduct Campaign Kickoff Call',
        details: 'Host 30-minute kickoff meeting to confirm campaign launch schedule, daily budget limits, and lead notification workflow.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when onboarding questionnaire is completed, billing confirmed, and account access requested.'
      }
    ]
  },
  {
    name: 'Google Ads – Account Access',
    category: 'Security',
    owner: 'Google Ads Specialist',
    version: '1.0',
    description: 'Linking client Google Ads account to InfronixWeb Manager Account (MCC) with delegated administrative access.',
    steps_json: [
      {
        title: 'Send Link Request via InfronixWeb MCC',
        details: 'Obtain client 10-digit Google Ads Customer ID. Send administrative link request from InfronixWeb Google Ads MCC.'
      },
      {
        title: 'Guide Client Through Acceptance in Ad Account',
        details: 'Provide step-by-step instructions for client to accept MCC link request in Google Ads -> Tools & Settings -> Access and Security -> Managers.'
      },
      {
        title: 'Verify Account Permissions & Billing Status',
        details: 'Confirm active management access in MCC dashboard. Verify billing status is "Active" with valid payment method attached.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when client account is linked under InfronixWeb MCC with verified active billing.'
      }
    ]
  },
  {
    name: 'Google Ads – Business & Offer Analysis',
    category: 'Design',
    owner: 'Google Ads Specialist',
    version: '1.0',
    description: 'Analyzing unique selling propositions (USPs), guarantees, pricing, and promotional hooks to craft high-converting ad copy.',
    steps_json: [
      {
        title: 'Extract Unique Value Propositions (USPs)',
        details: 'Identify 3-5 distinct competitive advantages: E.g., "Same-Day Service", "Certified Engineers", "Transparent Fixed Pricing", "10+ Years Experience in Ahmedabad".'
      },
      {
        title: 'Formulate High-Converting Promotional Offer',
        details: 'Define primary campaign hook: Free Initial Consultation, Instant Estimate Calculator, or Limited-Time Discount.'
      },
      {
        title: 'Identify Customer Objections & Counter-Arguments',
        details: 'Address common doubts (cost, turnaround time, trust) directly in planned ad copy and landing page headlines.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when USP and Offer matrix is documented for ad copywriting.'
      }
    ]
  },
  {
    name: 'Google Ads – Conversion Tracking',
    category: 'Development',
    owner: 'Google Ads Specialist',
    version: '1.0',
    description: 'Setting up Google Ads conversion actions, enhanced conversions, Google Tag Manager tags, and call tracking.',
    steps_json: [
      {
        title: 'Create Conversion Actions in Google Ads',
        details: 'Create Primary Conversion Actions: 1) Form Submission (Submit lead form), 2) WhatsApp Chat Click, 3) Phone Number Click / Call from Ads, 4) Quote Request.'
      },
      {
        title: 'Configure GTM Google Ads Conversion Tracking Tag',
        details: 'Set up Google Ads Conversion Tracking tag and Conversion Linker tag in Google Tag Manager using exact Conversion ID and Conversion Label.'
      },
      {
        title: 'Configure Enhanced Conversions for Leads',
        details: 'Enable Enhanced Conversions in Google Ads and GTM to pass hashed email/phone parameters for resilient attribution.'
      },
      {
        title: 'Test Conversion Tag Firing in GTM Preview',
        details: 'Submit test enquiry on landing page in GTM Preview mode. Verify Google Ads Conversion tag fires with Status: Succeeded.'
      },
      {
        title: 'Verify Conversion Status in Google Ads',
        details: 'Check Google Ads -> Goals -> Conversions. Confirm status changes from "Unverified" to "Active / No recent conversions".'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when conversion tracking is verified active and firing correctly. Never launch paid ads without verified conversion tracking.'
      }
    ]
  },
  {
    name: 'Google Ads – Keyword Research',
    category: 'Design',
    owner: 'Google Ads Specialist',
    version: '1.0',
    description: 'Selecting high-commercial intent search keywords, organizing into tightly themed ad groups (STAGs), and defining match types.',
    steps_json: [
      {
        title: 'Extract High-Intent Commercial Keywords',
        details: 'Research keywords in Google Keyword Planner. Focus on high-intent transactional search terms (e.g. "hire web development agency", "best seo company in ahmedabad", "emergency ac repair service").'
      },
      {
        title: 'Structure into Single-Theme Ad Groups (STAGs)',
        details: 'Group closely related keywords into tight ad groups containing 3-7 keywords sharing the exact same intent (e.g., Ad Group: "Web Development Company", Ad Group: "E-commerce Website Developers").'
      },
      {
        title: 'Assign Exact & Phrase Match Types',
        details: 'Apply [Exact Match] and "Phrase Match" syntax. Strictly avoid broad match keywords on new campaign launches with limited budgets to prevent budget waste on irrelevant searches.'
      },
      {
        title: 'Calculate Estimated Traffic & CPC Budget Matrix',
        details: 'Forecast daily click volume and average CPC across ad groups to ensure budget aligns with keyword volume.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when STAG keyword architecture is documented in campaign plan.'
      }
    ]
  },
  {
    name: 'Google Ads – Negative Keyword Planning',
    category: 'Design',
    owner: 'Google Ads Specialist',
    version: '1.0',
    description: 'Building extensive master negative keyword lists to prevent wasted ad spend on non-commercial or irrelevant search queries.',
    steps_json: [
      {
        title: 'Build Master Negative Keyword List',
        details: 'Add universal negative terms: free, cheap, pdf, jobs, careers, vacancy, salary, course, tutorial, training, login, diy, wholesale, open source, meaning, definition.'
      },
      {
        title: 'Add Competitor & Out-of-Scope Negative Terms',
        details: 'Add negative keywords for services client does not offer (e.g. if client only builds custom web apps, add negative: "wordpress plugins", "free templates").'
      },
      {
        title: 'Apply Negative Keyword List at Campaign / Account Level',
        details: 'Attach master negative list to all active and planned search campaigns.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when negative keyword list (>= 50 negative terms) is applied to the campaign.'
      }
    ]
  },
  {
    name: 'Google Ads – Competitor Research',
    category: 'Design',
    owner: 'Google Ads Specialist',
    version: '1.0',
    description: 'Analyzing competitor auction bids, ad copy angles, extensions, and landing page offers via Google Ads Transparency Center.',
    steps_json: [
      {
        title: 'Search Target Keywords & Inspect SERP Ads',
        details: 'Observe live ads on Google SERP for target keywords. Note top 3 competitors in auction, their headlines, and extensions.'
      },
      {
        title: 'Audit Competitor Ads in Google Ads Transparency Center',
        details: 'Review all active ads run by primary competitors. Identify recurring value propositions, price points, and promotional guarantees.'
      },
      {
        title: 'Craft Superior Differentiated Value Hooks',
        details: 'Write ad copy angles that directly outperform competitor claims (e.g. if competitors promise "7-day turnaround", highlight "24-hour rapid deployment").'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when competitor ad analysis is documented with differentiation points.'
      }
    ]
  },
  {
    name: 'Google Ads – Campaign Structure',
    category: 'Design',
    owner: 'Google Ads Specialist',
    version: '1.0',
    description: 'Designing campaign hierarchy, bidding strategy selection, location targeting boundaries, and budget allocations.',
    steps_json: [
      {
        title: 'Define Campaign Hierarchy',
        details: 'Separate campaigns by: 1) Core Services (Search), 2) High-Intent Geo/City (Search), 3) Brand Protection (Search), 4) Retargeting / Display.'
      },
      {
        title: 'Configure Strict Geographic Location Targeting',
        details: 'Set Location options to "Presence: People in or regularly in your targeted locations" (do NOT use "Presence or Interest" to avoid spending budget on users outside target region).'
      },
      {
        title: 'Select Initial Bidding Strategy',
        details: 'For new campaigns without historical conversion data: Start with "Maximize Clicks" with a reasonable Max CPC bid cap. Once 30+ conversions are recorded, transition to "Maximize Conversions" or Target CPA.'
      },
      {
        title: 'Configure Ad Schedule & Device Bid Adjustments',
        details: 'Set ad schedule matching client sales team response hours (e.g., Mon-Sat 9 AM - 7 PM). Set device adjustments if desktop converts significantly higher than mobile.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when campaign structural blueprint is documented and approved for setup.'
      }
    ]
  },
  {
    name: 'Google Ads – Campaign Setup',
    category: 'Development',
    owner: 'Google Ads Specialist',
    version: '1.0',
    description: 'Building campaigns in Google Ads interface, configuring ad groups, match types, budget caps, and network settings.',
    steps_json: [
      {
        title: 'Create Search Campaign with Explicit Settings',
        details: 'Create new Campaign -> Objective: Leads -> Type: Search. Uncheck "Include Google Search Partners" and uncheck "Include Google Display Network" on Search campaigns to prevent low-quality clicks.'
      },
      {
        title: 'Input Daily Budget & Bidding Caps',
        details: 'Set daily budget based on monthly allocation / 30.4. Configure Max CPC bid limit.'
      },
      {
        title: 'Build Single-Theme Ad Groups & Input Keywords',
        details: 'Create planned ad groups and paste [Exact] and "Phrase" keywords.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when campaign structure, ad groups, and keyword match types are built in Google Ads in draft status.'
      }
    ]
  },
  {
    name: 'Google Ads – Ad Copy Creation',
    category: 'Design',
    owner: 'Google Ads Specialist',
    version: '1.0',
    description: 'Writing high-relevance Responsive Search Ads (RSAs) with 15 headlines and 4 descriptions matching keyword themes.',
    steps_json: [
      {
        title: 'Write 15 Diverse Headlines for RSA',
        details: 'Include: 5 Keyword-rich headlines matching ad group theme, 3 Benefit/Value headlines, 3 Social proof / Trust headlines (e.g., "500+ Projects Delivered"), 2 Offer / Urgency headlines, and 2 Call-to-action headlines.'
      },
      {
        title: 'Write 4 Compelling Descriptions (90 chars each)',
        details: 'Draft descriptions elaborating on client service benefits, addressing key pain points, and including a strong call to action.'
      },
      {
        title: 'Pin High-Priority Brand / Value Headlines',
        details: 'Pin position 1 or 2 headlines strategically if mandatory for brand compliance, while allowing Google algorithmic asset combination testing.'
      },
      {
        title: 'Achieve "Good" or "Excellent" Ad Strength Score',
        details: 'Verify that Google Ad Strength score is at least "Good" or "Excellent" for every Responsive Search Ad.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when all RSAs have 15 headlines, 4 descriptions, Excellent ad strength, and approved copy.'
      }
    ]
  },
  {
    name: 'Google Ads – Assets Setup',
    category: 'Development',
    owner: 'Google Ads Specialist',
    version: '1.0',
    description: 'Configuring sitelinks, callouts, structured snippets, call assets, and lead form assets to maximize ad real estate and CTR.',
    steps_json: [
      {
        title: 'Create 4+ High-Value Sitelink Assets',
        details: 'Add sitelinks with 2 description lines each: About Us, Pricing / Packages, Portfolio / Case Studies, Contact / Quote Request.'
      },
      {
        title: 'Add 6-8 Callout Assets',
        details: 'Add concise benefit callouts (e.g. "Free Consultation", "Fast Turnaround", "Certified Experts", "Transparent Pricing", "24/7 Support").'
      },
      {
        title: 'Add Structured Snippet Assets',
        details: 'Add structured snippets (Types / Services header) listing key sub-services offered.'
      },
      {
        title: 'Add Call Asset & Location Asset',
        details: 'Attach client verified phone number and link Google Business Profile location asset for local map pack ads.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when all assets are configured, approved by Google policy review, and active.'
      }
    ]
  },
  {
    name: 'Google Ads – Landing Page Review',
    category: 'QA',
    owner: 'Google Ads Specialist',
    version: '1.0',
    description: 'Auditing dedicated landing page message match, mobile speed, form friction, tracking scripts, and conversion triggers.',
    steps_json: [
      {
        title: 'Verify Headline Message Match',
        details: 'Ensure landing page headline directly mirrors the ad copy promise and primary keyword theme. Prevent user confusion.'
      },
      {
        title: 'Test Mobile Loading Speed (< 2.5s)',
        details: 'Audit landing page on PageSpeed Insights. Mobile page load must be under 2.5 seconds to minimize bounce rates.'
      },
      {
        title: 'Test Form Submissions & Click-to-Call Buttons',
        details: 'Submit live test form on mobile device. Verify phone call button initiates dialer and WhatsApp button opens chat with pre-filled message.'
      },
      {
        title: 'Verify Tracking Script Firing',
        details: 'Confirm Google Ads conversion tag triggers upon successful form submission.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when landing page is verified fast, fully functioning, and aligned with ad message.'
      }
    ]
  },
  {
    name: 'Google Ads – Pre-Launch QA',
    category: 'QA',
    owner: 'QA Specialist',
    version: '1.0',
    description: 'Pre-flight quality checklist verifying campaign settings, budgets, negative lists, URLs, and tracking before activating spend.',
    steps_json: [
      {
        title: 'Verify Daily Budget & Currency Caps',
        details: 'Confirm daily budget amount and account currency. Ensure no accidental extra zeros (e.g. ₹500/day vs ₹5000/day).'
      },
      {
        title: 'Verify Location Targeting Exclusions',
        details: 'Ensure location is set to "Presence" only and target cities/regions are accurately included with outside regions excluded.'
      },
      {
        title: 'Verify All Ad URLs and Tracking Templates',
        details: 'Click every ad final URL to ensure no 404 errors, proper HTTPS, and UTM parameters appended.'
      },
      {
        title: 'Verify Conversion Actions & Negative Keywords',
        details: 'Confirm primary conversion action is assigned to campaign and Master Negative Keyword list is attached.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when QA Specialist signs off on pre-launch checklist with zero errors.'
      }
    ]
  },
  {
    name: 'Google Ads – Campaign Launch',
    category: 'Deployment',
    owner: 'Google Ads Specialist',
    version: '1.0',
    description: 'Enabling campaigns in Google Ads, monitoring initial impressions, ad policy approvals, and click delivery.',
    steps_json: [
      {
        title: 'Enable Campaign & Ad Groups',
        details: 'Switch Campaign, Ad Groups, and Ads status from Paused to Enabled.'
      },
      {
        title: 'Monitor Policy Review Status',
        details: 'Check Ads and Assets status. If any ad is marked "Disapproved" or "Eligible (Limited)", immediately review policy reason and submit appeal or revise copy.'
      },
      {
        title: 'Verify Initial Impressions & Clicks Delivery (Hour 2-4)',
        details: 'Check campaign within 4 hours of activation to confirm ads are entering auctions and serving impressions.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when campaign is actively serving impressions with policy approvals confirmed.'
      }
    ]
  },
  {
    name: 'Google Ads – Search Term Review',
    category: 'QA',
    owner: 'Google Ads Specialist',
    version: '1.0',
    description: 'Regularly auditing the Search Terms report to identify irrelevant queries, wasted spend, and high-converting keyword additions.',
    steps_json: [
      {
        title: 'Open Search Terms Report in Google Ads',
        details: 'Navigate to Insights & Reports -> Search Terms. Filter by cost > 0.'
      },
      {
        title: 'Identify & Negate Irrelevant Search Terms',
        details: 'Flag any queries that do not represent buying intent (e.g. competitors client cannot service, DIY queries, irrelevant job searches). Add as [Exact] or Phrase negative keywords immediately.'
      },
      {
        title: 'Discover High-Converting Keyword Opportunities',
        details: 'Identify profitable user search phrases that generated conversions. Add them as targeted exact match keywords into relevant ad groups.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when Search Term review is executed, wasted spend terms negated, and report logged in Founder OS.'
      }
    ]
  },
  {
    name: 'Google Ads – Negative Keyword Management',
    category: 'Development',
    owner: 'Google Ads Specialist',
    version: '1.0',
    description: 'Ongoing expansion, categorization, and maintenance of campaign-level and account-level negative keyword libraries.',
    steps_json: [
      {
        title: 'Audit Search Query Waste Weekly',
        details: 'Review all search queries with >= 3 clicks and 0 conversions. Evaluate relevance to business offerings.'
      },
      {
        title: 'Categorize Negatives into Themed Lists',
        details: 'Maintain distinct negative lists: Universal Negatives, Geo/City Negatives, Competitor Negatives, Service Exclusions.'
      },
      {
        title: 'Prevent Negative Keyword Conflicts',
        details: 'Ensure newly added negative keywords do not accidentally block target high-intent keywords.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when negative keyword lists are updated and verified conflict-free.'
      }
    ]
  },
  {
    name: 'Google Ads – Budget Monitoring',
    category: 'Finance',
    owner: 'Google Ads Specialist',
    version: '1.0',
    description: 'Tracking daily spend pacing, preventing over/under-delivery, and monitoring client payment method health.',
    steps_json: [
      {
        title: 'Calculate Monthly Spend Pacing',
        details: 'Compare Month-to-Date (MTD) actual spend against projected monthly budget (Daily Budget x Elapsed Days). Adjust daily caps if pacing exceeds +/- 10% variance.'
      },
      {
        title: 'Check Client Payment Method & Billing Alerts',
        details: 'Inspect Google Ads Billing tab for failed payment warnings, card expiration alerts, or billing threshold holds.'
      },
      {
        title: 'Alert Account Manager on Billing Issues',
        details: 'If client payment fails, notify Account Manager immediately to coordinate payment update before Google halts ads.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when budget pacing is verified on target with zero billing disruptions.'
      }
    ]
  },
  {
    name: 'Google Ads – Bid Optimization',
    category: 'Development',
    owner: 'Google Ads Specialist',
    version: '1.0',
    description: 'Adjusting keyword bids, Target CPA thresholds, device bid adjustments, and location bid modifiers.',
    steps_json: [
      {
        title: 'Analyze Performance by Device',
        details: 'Compare Mobile vs Desktop conversion rates and CPA. Apply negative or positive bid adjustments (e.g. +20% on desktop if conversion rate is 2x higher).'
      },
      {
        title: 'Analyze Performance by Location / City',
        details: 'Review performance by targeted cities/radii. Increase bids in top-converting zip codes/cities and reduce bids in low-converting areas.'
      },
      {
        title: 'Adjust Smart Bidding Target CPA / ROAS',
        details: 'For campaigns on Target CPA, adjust target by no more than 15-20% at a time to prevent sending the algorithm back into learning mode.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when bid adjustments are applied based on statistical performance data.'
      }
    ]
  },
  {
    name: 'Google Ads – Conversion Analysis',
    category: 'QA',
    owner: 'Google Ads Specialist',
    version: '1.0',
    description: 'Evaluating lead quality, conversion rate trends, cost per acquisition (CPA), and verifying conversion accuracy.',
    steps_json: [
      {
        title: 'Audit Conversion Attribution in Google Ads',
        details: 'Review conversion count, conversion rate (CVR), and Cost Per Conversion across campaigns and ad groups.'
      },
      {
        title: 'Reconcile Leads with Client CRM Data',
        details: 'Cross-reference Google Ads reported conversions with actual client CRM lead entries. Confirm lead quality and sales stage progression.'
      },
      {
        title: 'Identify Conversion Bottlenecks',
        details: 'Investigate if high-click ad groups suffer from low CVR: Check landing page relevance, page load speed, and form field count.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when conversion data is reconciled, lead quality validated, and optimization recommendations logged.'
      }
    ]
  },
  {
    name: 'Google Ads – A/B Testing',
    category: 'Development',
    owner: 'Google Ads Specialist',
    version: '1.0',
    description: 'Running systematic experiments on ad copy headlines, landing pages, and bidding strategies using Google Ads Experiments.',
    steps_json: [
      {
        title: 'Define Clear Test Hypothesis',
        details: 'Formulate single-variable experiment (e.g. "Testing specific price in headline vs broad value proposition will increase CTR and reduce CPL").'
      },
      {
        title: 'Set Up Google Ads Campaign Experiment',
        details: 'Create custom Experiment with 50/50 split traffic allocation between Control and Trial campaigns.'
      },
      {
        title: 'Run Experiment for Statistical Significance',
        details: 'Allow experiment to run until reaching at least 100 conversions or 95% statistical confidence (typically 2-4 weeks).'
      },
      {
        title: 'Apply Winner & Document Learnings',
        details: 'If Trial wins with lower CPA, apply trial changes to base campaign. Document winning insights in agency knowledge base.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when experiment concludes with statistically verified winner deployed.'
      }
    ]
  },
  {
    name: 'Google Ads – Performance Optimization',
    category: 'Development',
    owner: 'Google Ads Specialist',
    version: '1.0',
    description: 'Comprehensive monthly optimization sprint restructuring low-performing ad groups, refreshing RSAs, and pruning wasteful keywords.',
    steps_json: [
      {
        title: 'Prune Zero-Conversion High-Cost Keywords',
        details: 'Pause keywords that have spent > 2x target CPA with zero conversions.'
      },
      {
        title: 'Refresh RSA Asset Performance',
        details: 'Replace "Low" performing headlines and descriptions with new compelling hooks and value propositions.'
      },
      {
        title: 'Reallocate Budget to Top Performing Campaigns',
        details: 'Shift daily budget from constrained or low-ROI campaigns into top-performing, high-ROAS ad groups.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when monthly optimization cycle is completed and logged in changelog.'
      }
    ]
  },
  {
    name: 'Google Ads – Monthly Reporting',
    category: 'Client Onboarding',
    owner: 'Google Ads Specialist',
    version: '1.0',
    description: 'Compiling transparent Google Ads monthly performance report detailing spend, clicks, CTR, leads, CPL, and ROI.',
    steps_json: [
      {
        title: 'Consolidate Verified Ad Performance Data',
        details: 'Export metrics: Total Spend, Impressions, Clicks, Average CPC, CTR, Total Conversions, Cost Per Conversion (CPL), and Conversion Rate.'
      },
      {
        title: 'Build Executive Visual Report Deck',
        details: 'Create slide deck showcasing MoM performance trends, top-performing search queries, winning ad creatives, and lead volume.'
      },
      {
        title: 'Outline Next Month Optimization Plan',
        details: 'Present 3 strategic action items for next month (e.g., scaling winning ad groups, launching Performance Max experiment, landing page CRO).'
      },
      {
        title: 'Deliver Report & Host Client Strategy Call',
        details: 'Send report PDF to client and conduct 20-minute monthly review meeting.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when report is delivered and client approves next month strategy.'
      }
    ]
  },
  {
    name: 'Google Ads – Client Review',
    category: 'QA',
    owner: 'Account Manager',
    version: '1.0',
    description: 'Quarterly strategic review evaluating campaign profitability, scaling opportunities, and budget expansion.',
    steps_json: [
      {
        title: 'Prepare 90-Day ROI Performance Summary',
        details: 'Synthesize 3-month ad spend vs revenue generated, customer acquisition trends, and market share capture.'
      },
      {
        title: 'Present Strategic Scaling Plan',
        details: 'If campaigns are highly profitable at target CPA, present data-backed proposal to increase ad spend budget to capture additional market search demand.'
      },
      {
        title: 'Obtain SOW / Budget Renewal Sign-off',
        details: 'Secure client approval on renewed quarterly budget and retainer terms.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when quarterly review concludes and updated budget plan is active.'
      }
    ]
  },
  {
    name: 'Google Ads – Offboarding',
    category: 'Offboarding',
    owner: 'Account Manager',
    version: '1.0',
    description: 'Orderly conclusion of Google Ads management, pausing or handing over active campaigns, and unlinking MCC access.',
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
        title: 'Unlink Account from InfronixWeb MCC',
        details: 'Unlink client Google Ads account from InfronixWeb Manager Account (MCC). Client retains 100% full ownership of their account and historical data.'
      },
      {
        title: 'Deliver Final Campaign Performance Archive',
        details: 'Send lifetime performance summary and campaign structure documentation to client.'
      },
      {
        title: 'Archive Project in Founder OS',
        details: 'Mark project status as "Completed/Offboarded" in Founder OS.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when MCC unlinking is confirmed, documentation delivered, and client offboarded.'
      }
    ]
  }
];
