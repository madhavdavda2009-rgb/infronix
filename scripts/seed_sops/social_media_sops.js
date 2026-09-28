export const socialMediaSOPs = [
  {
    name: 'Social Media – Client Onboarding',
    category: 'Client Onboarding',
    owner: 'Account Manager',
    version: '1.0',
    description: 'Welcoming new social media client, setting up workspace in Founder OS, and aligning on tone, visual style, and publishing frequency.',
    steps_json: [
      {
        title: 'Verify Advance Retainer Payment',
        details: 'Confirm receipt of initial monthly retainer payment with Finance before starting creative production.'
      },
      {
        title: 'Provision Social Media Project in Founder OS',
        details: 'Set up Social Media Management project board, monthly content delivery milestones, and client portal permissions.'
      },
      {
        title: 'Issue Social Media Brand Questionnaire',
        details: 'Send questionnaire capturing: Brand backstory, tone of voice, visual aesthetic preferences (clean, bold, vibrant, minimal), key products/services, taboo topics, and brand color hex codes.'
      },
      {
        title: 'Establish Client Communication Channel',
        details: 'Create dedicated WhatsApp client group for fast content reviews, approvals, and day-to-day coordination.'
      },
      {
        title: 'Conduct Social Media Kickoff Call',
        details: 'Host 30-minute kickoff meeting to review brand questionnaire, agree on monthly post/reel quotas, and explain the content review approval workflow.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when kickoff meeting concludes, brand guidelines are collected, and access collection begins.'
      }
    ]
  },
  {
    name: 'Social Media – Account Access Collection',
    category: 'Security',
    owner: 'Social Media Manager',
    version: '1.0',
    description: 'Securing administrative and delegated partner access to client Instagram, Facebook Page, LinkedIn Company Page, and scheduling tools.',
    steps_json: [
      {
        title: 'Request Meta Business Suite / Partner Access',
        details: 'Send partner access request from InfronixWeb Business Manager to client Facebook Page and Instagram Professional Account.'
      },
      {
        title: 'Request LinkedIn Company Page Super Admin Access',
        details: 'Request Super Admin or Content Admin role for InfronixWeb social media manager on client LinkedIn organization page.'
      },
      {
        title: 'Secure Other Social Platform Credentials',
        details: 'For platforms without delegated management (YouTube, Twitter/X, Pinterest), store encrypted credentials in 1Password / Bitwarden. Never store passwords in plain text.'
      },
      {
        title: 'Connect Accounts to Social Scheduling Platform',
        details: 'Connect social profiles to Buffer, Meta Business Suite, or Publer. Send test preview to verify active publishing token.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when all social channels are connected, permissions verified, and credentials secured in agency vault.'
      }
    ]
  },
  {
    name: 'Social Media – Brand Understanding',
    category: 'Design',
    owner: 'Social Media Manager',
    version: '1.0',
    description: 'Analyzing brand personality, core value propositions, typography, visual motifs, and customer sentiment to establish brand voice.',
    steps_json: [
      {
        title: 'Audit Past Social Media Performance',
        details: 'Review previous 6 months of client social posts: Identify highest engaging topics, best performing formats, and posts with weak engagement.'
      },
      {
        title: 'Define Social Brand Voice & Personality Matrix',
        details: 'Establish 4 brand traits (e.g. Authoritative, Inspiring, Approachable, Witty). Document "We are this, but not that" rules (e.g. "Professional but not stiff; energetic but not hype-driven").'
      },
      {
        title: 'Compile Brand Asset Kit for Social',
        details: 'Assemble vector logos, approved color palettes, font pairings, visual textures, and custom iconography in Figma.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when Social Media Brand Voice & Visual Style Guide is documented and approved by Account Manager.'
      }
    ]
  },
  {
    name: 'Social Media – Competitor Research',
    category: 'Design',
    owner: 'Social Media Manager',
    version: '1.0',
    description: 'Analyzing top direct and aspirational competitor social media channels to uncover high-performing formats, viral reels, and engagement strategies.',
    steps_json: [
      {
        title: 'Identify 5 Benchmark Competitors',
        details: 'Select 3 direct market competitors and 2 global aspirational brand accounts in the same industry.'
      },
      {
        title: 'Analyze Competitor Content Formats & Pacing',
        details: 'Audit competitor posting frequency, mix of Carousels vs Reels vs Single Images vs Stories, and engagement-to-follower ratios.'
      },
      {
        title: 'Analyze High-Performing Reels & Carousels',
        details: 'Identify viral reels and high-save carousels: Deconstruct their opening 3-second hooks, visual storytelling structure, audio selection, and call to action.'
      },
      {
        title: 'Identify Content Gaps & Whitespace',
        details: 'Find topics competitors explain poorly or ignore completely. Formulate creative angles for InfronixWeb client to own those topics.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when Competitor Social Intelligence breakdown is documented and integrated into monthly brainstorming.'
      }
    ]
  },
  {
    name: 'Social Media – Audience Research',
    category: 'Design',
    owner: 'Social Media Manager',
    version: '1.0',
    description: 'Analyzing follower demographics, peak engagement hours, comments, common queries, and content preferences.',
    steps_json: [
      {
        title: 'Extract Native Platform Demographic Insights',
        details: 'Review Instagram Insights and LinkedIn Analytics: Age distribution, top geographic cities/countries, gender ratio, and peak active hours by day.'
      },
      {
        title: 'Audit Audience Comments & DMs',
        details: 'Review common questions, complaints, praise, and objections in comment threads and direct messages to extract authentic customer language.'
      },
      {
        title: 'Define Social Persona Needs & Triggers',
        details: 'Document what the audience wants from the brand account: Practical tips, behind-the-scenes authenticity, entertainment, or industry authority.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when Audience Persona Summary is finalized and used to guide content topic creation.'
      }
    ]
  },
  {
    name: 'Social Media – Content Pillars',
    category: 'Design',
    owner: 'Social Media Manager',
    version: '1.0',
    description: 'Structuring 4-5 strategic content buckets ensuring balanced brand authority, entertainment, education, proof, and promotion.',
    steps_json: [
      {
        title: 'Establish 4-5 Core Content Buckets',
        details: 'Define core pillars: 1) Educational / How-To (saves & shares), 2) Social Proof & Case Studies (authority & trust), 3) Behind-the-Scenes & Culture (connection & authenticity), 4) Promotional & Offers (lead generation), 5) Industry Commentary & Trends (reach).'
      },
      {
        title: 'Determine Monthly Percentage Distribution',
        details: 'Set quota mix: E.g., 40% Educational/Value, 25% Proof/Case Studies, 20% Culture/Behind-Scenes, 15% Direct Promotional/Offer.'
      },
      {
        title: 'Create Content Pillar Matrix Template',
        details: 'Document sub-topics, standard visual formats, and expected audience reaction for each pillar.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when Content Pillar framework is approved by client and ready for monthly calendar planning.'
      }
    ]
  },
  {
    name: 'Social Media – Monthly Content Calendar',
    category: 'Design',
    owner: 'Social Media Manager',
    version: '1.0',
    description: 'Developing the complete 30-day social media publishing schedule with dates, formats, pillars, and draft topics.',
    steps_json: [
      {
        title: 'Review Upcoming Key Dates & Brand Milestones',
        details: 'Check calendar for festival dates, industry events, client product launches, company anniversaries, and seasonal promotions.'
      },
      {
        title: 'Map Planned Posts Across the 30-Day Grid',
        details: 'Distribute approved post quotas (e.g. 12 Feed Posts, 8 Reels, 15 Stories) across the month according to peak engagement days (Tuesday-Friday).'
      },
      {
        title: 'Assign Pillars, Formats & Objectives',
        details: 'For every slot on the calendar, define: Publish Date, Target Platform, Content Pillar, Format (Carousel, Reel, Static Graphic), Topic Headline, and Objective (Saves, Comments, Inquiries).'
      },
      {
        title: 'Internal Review with Account Manager',
        details: 'Ensure calendar aligns with active marketing campaigns and SOW deliverables.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when 30-Day Content Calendar structure is populated in Founder OS / Notion board and ready for creative asset production.'
      }
    ]
  },
  {
    name: 'Social Media – Post Ideation',
    category: 'Design',
    owner: 'Social Media Manager',
    version: '1.0',
    description: 'Brainstorming creative angles, scroll-stopping hooks, carousel slide breakdowns, and interactive post concepts.',
    steps_json: [
      {
        title: 'Brainstorm 3 Distinct Angles per Topic',
        details: 'For each planned topic, develop 3 distinct angles: 1) Contrarian / Myth-busting, 2) Step-by-Step Practical Blueprint, 3) Personal / Relatable Story.'
      },
      {
        title: 'Craft Scroll-Stopping Visual Hooks',
        details: 'Design cover slide concepts that provoke curiosity or immediate value (e.g., "Stop doing X if you want Y", "3 Mistakes costing you clients").'
      },
      {
        title: 'Outline Carousel Slide-by-Slide Structure',
        details: 'Structure carousels: Slide 1 (Hook), Slide 2 (Problem/Agitation), Slides 3-7 (Actionable Steps/Insights), Slide 8 (Summary), Slide 9 (Call to Action to Save/Follow).'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when all feed post concepts have approved slide outlines and hooks ready for graphic design.'
      }
    ]
  },
  {
    name: 'Social Media – Reel Planning',
    category: 'Design',
    owner: 'Social Media Manager',
    version: '1.0',
    description: 'Planning short-form vertical video reels, visual transitions, on-screen text overlays, and audio track selections.',
    steps_json: [
      {
        title: 'Select Reel Format & Concept',
        details: 'Choose format: Talking Head with B-Roll, Voiceover Screen Recording, Quick Visual Demonstration, Trend-adapted Skit, or Problem-Solution Breakdown.'
      },
      {
        title: 'Structure 3-Part Reel Framework',
        details: 'Plan video pacing: 0-3s (Visual & Verbal Hook), 3-25s (Fast-paced High-Value Content), 25-30s (Clear Call to Action in speech and caption).'
      },
      {
        title: 'Identify Trending or High-Energy Audio',
        details: 'Curate trending commercial-use audio tracks or select clean background instrumental music fitting the brand vibe.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when Reel concept blueprints are finalized and ready for scriptwriting.'
      }
    ]
  },
  {
    name: 'Social Media – Script Writing',
    category: 'Design',
    owner: 'Social Media Manager',
    version: '1.0',
    description: 'Writing word-for-word short-form video scripts, pacing guides, visual cues, and teleprompter copy for client reels.',
    steps_json: [
      {
        title: 'Write First 3-Second Verbal Hook',
        details: 'Write powerful, conversational opening lines that immediately stop the scroll. Avoid slow greetings like "Hey guys, welcome back". Start straight into the value hook.'
      },
      {
        title: 'Write Concise Body Content with Visual Cues',
        details: 'Keep script under 130 words for a 30-45 second reel. Include exact visual directions in brackets (e.g., [Cut to screen demo], [Text pop: 3x Revenue]).'
      },
      {
        title: 'Add Clear Closing Call-to-Action (CTA)',
        details: 'Include explicit action trigger: "Comment \'GROWTH\' to get the blueprint", or "Follow @brand for daily strategies".'
      },
      {
        title: 'Deliver Teleprompter-Ready Script to Client/Presenter',
        details: 'Format script with clean line breaks and pronunciation guides for smooth recording.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when reel script is reviewed and approved by client or ready for internal production.'
      }
    ]
  },
  {
    name: 'Social Media – Graphic Design',
    category: 'Design',
    owner: 'UI/UX Designer',
    version: '1.0',
    description: 'Designing high-resolution, branded, aesthetically striking feed graphics, carousel decks, and story layouts in Figma.',
    steps_json: [
      {
        title: 'Create Grid Layouts in 4:5 and 9:16 Aspect Ratios',
        details: 'Set up frames: 1080x1350px (4:5 vertical feed format for optimal mobile real estate) and 1080x1920px (9:16 for Stories/Reels).'
      },
      {
        title: 'Apply Strict Brand Identity Standards',
        details: 'Use approved brand typography, primary/secondary colors, consistent margin spacing (min 60px safe zone), and subtle background textures.'
      },
      {
        title: 'Design High-Impact Carousel Decks',
        details: 'Ensure visual continuity across carousel slides with seamless connecting elements, arrows, progress bars, and high-contrast bold headlines.'
      },
      {
        title: 'Export in High-Quality Lossless Formats',
        details: 'Export static graphics in high-res PNG (2x export) to prevent social platform compression degradation.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when all monthly graphic assets are exported, organized in project folders, and submitted for copy pairing.'
      }
    ]
  },
  {
    name: 'Social Media – Caption Writing',
    category: 'Design',
    owner: 'Social Media Manager',
    version: '1.0',
    description: 'Writing engaging, readable, value-packed social media captions with clear calls to action and formatting.',
    steps_json: [
      {
        title: 'Craft Compelling First-Line Caption Hook',
        details: 'Write intriguing opening line before the "...more" fold to encourage users to expand and read the full caption.'
      },
      {
        title: 'Format Body Copy for Easy Mobile Skimming',
        details: 'Use clean line breaks, bullet points, and emojis sparingly. Provide substantial context, actionable steps, or personal commentary expanding on the graphic.'
      },
      {
        title: 'Add Direct Conversion Call-to-Action',
        details: 'Prompt user engagement: "Save this post for your next project", "Tag someone who needs this", or "Link in bio to book a consultation".'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when all monthly post captions are written, proofread for grammar, and paired with graphic assets.'
      }
    ]
  },
  {
    name: 'Social Media – Hashtag / Discovery Research',
    category: 'Design',
    owner: 'Social Media Manager',
    version: '1.0',
    description: 'Researching targeted, niche-relevant hashtags, keyword search phrases, and SEO tags for discoverability on Instagram and LinkedIn.',
    steps_json: [
      {
        title: 'Research Tiered Hashtag Sets',
        details: 'Select 5-10 relevant hashtags per post categorized into: 1) Brand hashtag (#InfronixWeb), 2) Niche industry hashtags (10k - 100k posts), 3) Location-specific hashtags (#AhmedabadBusiness).'
      },
      {
        title: 'Optimize On-Platform In-Caption Keywords (Social SEO)',
        details: 'Incorporate natural search keywords in caption copy to index on Instagram Explore and TikTok/LinkedIn search engines.'
      },
      {
        title: 'Ban Banned & Over-Saturated Generic Hashtags',
        details: 'Screen out spam/banned hashtags or giant generic tags (#viral, #love, #explore) that attract bot engagement.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when curated discovery tag sets are attached to each planned post.'
      }
    ]
  },
  {
    name: 'Social Media – Internal Content QA',
    category: 'QA',
    owner: 'QA Specialist',
    version: '1.0',
    description: 'Comprehensive internal quality audit checking graphic resolution, brand alignment, spelling, grammar, and link accuracy before client review.',
    steps_json: [
      {
        title: 'Proofread Copy for Spelling & Grammar',
        details: 'Check all headline text, carousel slides, and captions using Grammarly / manual review. Verify zero typos, grammatical errors, or awkward phrasings.'
      },
      {
        title: 'Verify Brand Identity Compliance',
        details: 'Ensure logos are correct version, fonts match brand guidelines, hex colors are accurate, and images are high resolution without pixelation.'
      },
      {
        title: 'Verify Links & Bio URLs',
        details: 'Confirm link in bio / story links lead to active, fast-loading landing pages with UTM tracking.'
      },
      {
        title: 'Approve Deck for Client Presentation',
        details: 'Assemble finalized monthly creative deck into client review format (Notion / PDF / Portal).'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when QA Specialist marks monthly content deck APPROVED with zero defects.'
      }
    ]
  },
  {
    name: 'Social Media – Client Content Approval',
    category: 'Client Onboarding',
    owner: 'Account Manager',
    version: '1.0',
    description: 'Sharing monthly content deck with client, managing feedback revisions, and securing formal written sign-off before scheduling.',
    steps_json: [
      {
        title: 'Share Content Deck with Client Reviewers',
        details: 'Deliver interactive content preview board to client at least 7 days before the start of the publishing month. Set a 3-day review window.'
      },
      {
        title: 'Collect Consolidated Client Feedback',
        details: 'Guide client to add specific comments directly on post drafts. Consolidate requests in tracking sheet.'
      },
      {
        title: 'Execute Content Adjustments',
        details: 'Designer and copywriter apply approved revisions within 24-48 hours.'
      },
      {
        title: 'Obtain Final Written Approval',
        details: 'Secure formal written approval (WhatsApp confirmation or Portal sign-off) authorizing scheduled publishing.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when 100% of monthly posts are approved by client for scheduling.'
      }
    ]
  },
  {
    name: 'Social Media – Content Scheduling',
    category: 'Deployment',
    owner: 'Social Media Manager',
    version: '1.0',
    description: 'Uploading and scheduling approved content across platforms with verified timestamps, captions, tags, and covers.',
    steps_json: [
      {
        title: 'Upload Posts to Social Scheduling Tool',
        details: 'Upload approved graphics and video reels to Meta Business Suite, Buffer, or Publer.'
      },
      {
        title: 'Set Precise Target Publishing Times',
        details: 'Schedule each post for optimal audience active windows (e.g. 11:30 AM or 6:30 PM local timezone).'
      },
      {
        title: 'Configure Custom Cover Frames for Reels',
        details: 'Upload designed 9:16 cover image with centered 1:1 grid crop so the reel cover displays cleanly on the profile grid.'
      },
      {
        title: 'Add Account Collaborators & Location Tags',
        details: 'Add client partner collaboration tags and geotag location (e.g., Ahmedabad, Gujarat) where appropriate.'
      },
      {
        title: 'Double-Check Schedule Queue',
        details: 'Verify entire monthly queue is populated in scheduled status without date/time conflicts.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when all approved monthly posts are scheduled in publishing queue.'
      }
    ]
  },
  {
    name: 'Social Media – Publishing',
    category: 'Deployment',
    owner: 'Social Media Manager',
    version: '1.0',
    description: 'Real-time monitoring of live post publishing, manual Story posting, and immediate live post verification.',
    steps_json: [
      {
        title: 'Monitor Automated Post Publication',
        details: 'Verify scheduled posts publish successfully at their assigned times. Investigate any failed webhook or API token notifications immediately.'
      },
      {
        title: 'Publish Real-Time Interactive Stories',
        details: 'Manually publish daily engagement stories (Polls, Q&As, Quiz stickers, behind-the-scenes snaps) from native mobile app.'
      },
      {
        title: 'Verify Live Post Formatting on Profile',
        details: 'Inspect published post on mobile app: Confirm carousel slides swipe smoothly, video audio is synced, captions render cleanly, and link in bio works.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when live post is verified published on social feeds without errors.'
      }
    ]
  },
  {
    name: 'Social Media – Community Management',
    category: 'Client Onboarding',
    owner: 'Social Media Manager',
    version: '1.0',
    description: 'Monitoring and responding to comments, direct messages, brand mentions, and escalating sales leads to the client.',
    steps_json: [
      {
        title: 'Daily Inbox & Comment Monitoring',
        details: 'Check social inbox and comment sections twice daily (Morning 10 AM & Evening 5 PM).'
      },
      {
        title: 'Respond to Public Comments Within 4 Hours',
        details: 'Reply to genuine user comments with thoughtful, friendly brand responses to boost algorithmic engagement. Delete spam and hide abusive comments.'
      },
      {
        title: 'Handle Inbound Direct Message (DM) Inquiries',
        details: 'Answer standard service questions using approved FAQ response templates. For commercial lead inquiries, request their phone number and email address.'
      },
      {
        title: 'Escalate High-Priority Leads to Client Sales Team',
        details: 'Immediately forward warm lead details to client sales contact via WhatsApp/Email within 15 minutes of receipt.'
      },
      {
        title: 'Engage with Industry Accounts (Outbound Engagement)',
        details: 'Spend 15 minutes daily leaving genuine, insightful comments on industry partner, client, and influencer accounts to expand brand footprint.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when daily community management routine is executed with zero unread high-priority DMs.'
      }
    ]
  },
  {
    name: 'Social Media – Monthly Analytics',
    category: 'QA',
    owner: 'Social Media Manager',
    version: '1.0',
    description: 'Extracting and analyzing monthly reach, follower growth, engagement rates, top performing content, and lead conversions.',
    steps_json: [
      {
        title: 'Export Platform Analytics Data',
        details: 'Export metrics across all managed channels: Net Follower Growth, Total Impressions/Reach, Profile Visits, Website Taps, Total Saves, Total Shares, and Direct DM Inquiries.'
      },
      {
        title: 'Calculate Average Engagement Rate',
        details: 'Calculate engagement rate per post: (Likes + Comments + Saves + Shares) / Reach. Compare against industry benchmarks (target >= 3.5%).'
      },
      {
        title: 'Identify Top 3 Winning Posts & Underperformers',
        details: 'Analyze why top posts outperformed (specific hook, emotional trigger, visual format) and document lessons from lower-performing posts.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when monthly analytics data is compiled into master tracking spreadsheet.'
      }
    ]
  },
  {
    name: 'Social Media – Monthly Reporting',
    category: 'Client Onboarding',
    owner: 'Social Media Manager',
    version: '1.0',
    description: 'Compiling visual monthly social media performance deck, highlighting growth wins, and delivering to client.',
    steps_json: [
      {
        title: 'Build Visual Monthly Report Deck',
        details: 'Create executive summary deck featuring: Audience Growth charts, Reach & Impression comparisons, Showcase of Top 3 Best Performing Posts, and Total Leads Captured.'
      },
      {
        title: 'Document Strategic Learnings & Recommendations',
        details: 'Present clear insights on which content formats generated the most inquiries and propose creative adaptations for next month.'
      },
      {
        title: 'Deliver Report & Conduct Review Call',
        details: 'Send report PDF to client and host 20-minute monthly strategy alignment call.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when monthly report is presented and feedback is integrated into upcoming content calendar.'
      }
    ]
  },
  {
    name: 'Social Media – Strategy Optimization',
    category: 'Design',
    owner: 'Social Media Manager',
    version: '1.0',
    description: 'Iterating content pillars, visual styling, reel formats, and publishing cadences based on historical performance data.',
    steps_json: [
      {
        title: 'Review 90-Day Trend Data',
        details: 'Identify long-term shifts in audience preferences (e.g. rising preference for educational carousels over single quotes, or preference for short 15s reels).'
      },
      {
        title: 'Adjust Content Pillar Ratios',
        details: 'Increase percentage allocation to highest-converting content pillars and reduce underperforming buckets.'
      },
      {
        title: 'Refresh Visual Templates & Cover Art',
        details: 'Introduce refined Figma visual templates, new typography accents, or updated color schemes to keep the feed fresh.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when updated social strategy is documented and implemented in subsequent monthly sprints.'
      }
    ]
  },
  {
    name: 'Social Media – Offboarding',
    category: 'Offboarding',
    owner: 'Account Manager',
    version: '1.0',
    description: 'Orderly conclusion of social media retainer, delivering raw design files, asset archives, and revoking tool access.',
    steps_json: [
      {
        title: 'Reconcile Final Invoice with Finance',
        details: 'Confirm all monthly management fees are cleared in bank.'
      },
      {
        title: 'Deliver Master Creative Assets Archive',
        details: 'Package all editable Figma templates, high-resolution graphic PNGs, raw video footage, and caption copy sheets in a shared cloud drive for the client.'
      },
      {
        title: 'Disconnect Scheduling Tools & Revoke Access',
        details: 'Disconnect client social profiles from agency scheduling tools. Remove agency staff from Facebook Page and LinkedIn Page admin roles.'
      },
      {
        title: 'Deliver Final Cumulative Performance Summary',
        details: 'Send lifetime growth summary showcasing total audience growth, reach generated, and brand impact during the partnership.'
      },
      {
        title: 'Archive Project in Founder OS',
        details: 'Mark project status as "Completed/Offboarded" in Founder OS.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when all assets are transferred, tool access is disconnected, and offboarding checklist is signed.'
      }
    ]
  }
];
