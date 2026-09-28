export const crmAutomationSOPs = [
  {
    name: 'CRM Automation – Client Discovery',
    category: 'Sales',
    owner: 'CRM Specialist',
    version: '1.0',
    description: 'Discovery session assessing client current sales process, lead sources, team structure, sales cycle duration, and CRM objectives.',
    steps_json: [
      {
        title: 'Review Current Lead Tracking Tools',
        details: 'Audit client existing setup: Spreadsheets, WhatsApp chats, email inboxes, legacy CRMs (HubSpot, Zoho, LeadSquared, or Founder OS).'
      },
      {
        title: 'Understand Sales Team Structure & Roles',
        details: 'Document team hierarchy: Inbound lead qualifiers (SDRs), account executives (closers), account managers, and sales leadership.'
      },
      {
        title: 'Identify Sales Pipeline Bottlenecks',
        details: 'Identify primary pain points: Slow response to new leads (> 2 hours), dropped follow-ups, lack of pipeline visibility, manual proposal creation, or inaccurate sales forecasting.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when CRM Discovery Document is approved by client.'
      }
    ]
  },
  {
    name: 'CRM Automation – Existing Sales Process Audit',
    category: 'QA',
    owner: 'CRM Specialist',
    version: '1.0',
    description: 'Detailed operational audit recording every step from initial lead inquiry to deal closing and customer onboarding.',
    steps_json: [
      {
        title: 'Map Current Lead Journey Step-by-Step',
        details: 'Record current process: Where does lead arrive? How is it assigned? When is initial call made? How are quotes delivered? How are payments collected?'
      },
      {
        title: 'Audit Historical Deal Velocity & Close Rates',
        details: 'Measure average sales cycle duration (days from inquiry to close) and current close rate percentage.'
      },
      {
        title: 'Identify Unrecorded Data Points',
        details: 'Flag missing data: E.g., Lead source attribution not captured, lost reason not documented, follow-up dates not scheduled.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when Sales Process Audit Report is finalized.'
      }
    ]
  },
  {
    name: 'CRM Automation – Pipeline Design',
    category: 'Design',
    owner: 'CRM Specialist',
    version: '1.0',
    description: 'Designing clean, linear deal pipelines tailored to client sales cycles (Inbound Sales, Enterprise B2B, Retainer Renewals).',
    steps_json: [
      {
        title: 'Design Pipeline Structure',
        details: 'Create separate pipelines if sales cycles differ fundamentally (e.g. Pipeline 1: "Standard Inbound Web/Marketing", Pipeline 2: "Enterprise AI Solutions").'
      },
      {
        title: 'Establish Clear Forward Movement Rules',
        details: 'Ensure stages progress logically forward without confusing backwards jumping.'
      },
      {
        title: 'Review Pipeline Architecture with Sales Head',
        details: 'Present pipeline layout to client sales leadership for approval.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when Pipeline Blueprint is signed off.'
      }
    ]
  },
  {
    name: 'CRM Automation – Lead Stage Definition',
    category: 'Design',
    owner: 'CRM Specialist',
    version: '1.0',
    description: 'Defining unambiguous entry criteria, mandatory fields, and required actions for every sales stage.',
    steps_json: [
      {
        title: 'Define Standard Stage Taxonomy',
        details: 'Establish standard stages: 1) New / Uncontacted, 2) Contact Attempted, 3) Discovery / Qualified, 4) Proposal / Quote Sent, 5) Negotiation / Review, 6) Closed Won, 7) Closed Lost.'
      },
      {
        title: 'Define Mandatory Entry Criteria per Stage',
        details: 'Specify requirements: Moving to "Discovery" requires documenting Budget & Timeline; moving to "Closed Lost" mandates selecting a "Lost Reason" dropdown.'
      },
      {
        title: 'Define Probability Weights per Stage',
        details: 'Assign realistic win probabilities for accurate revenue forecasting (e.g. New: 10%, Qualified: 30%, Proposal: 60%, Negotiation: 80%).'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when Stage Criteria & Probability Matrix is approved.'
      }
    ]
  },
  {
    name: 'CRM Automation – Data Field Planning',
    category: 'Design',
    owner: 'CRM Specialist',
    version: '1.0',
    description: 'Designing custom contact, company, and deal properties, dropdowns, and data validation rules in CRM.',
    steps_json: [
      {
        title: 'Define Contact Properties',
        details: 'Create fields: Full Name, Clean Email, Mobile Phone, Job Title, Preferred Language, City/State, WhatsApp Opt-in.'
      },
      {
        title: 'Define Deal & Project Properties',
        details: 'Create fields: Service Category, Estimated Deal Value, Target Launch Date, Lead Source, Campaign UTM, Tech Stack, Payment Milestone Terms.'
      },
      {
        title: 'Enforce Dropdown / Controlled Vocabularies',
        details: 'Use dropdown select fields for Service, Industry, and Lost Reason to prevent free-text misspellings and ensure clean reporting.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when CRM Data Dictionary is approved.'
      }
    ]
  },
  {
    name: 'CRM Automation – Lead Source Setup',
    category: 'Development',
    owner: 'CRM Specialist',
    version: '1.0',
    description: 'Configuring automated lead source categorization and UTM capture across website forms, Google Ads, Meta Ads, WhatsApp, and referrals.',
    steps_json: [
      {
        title: 'Configure Lead Source Taxonomies',
        details: 'Set standard categories: Website Form, Google Search Ads, Meta Ads, WhatsApp Inbound, Organic SEO, Cold Outreach, Referral, Direct.'
      },
      {
        title: 'Implement Hidden UTM Field Capture',
        details: 'Ensure website forms capture utm_source, utm_medium, utm_campaign, and page_url and pass directly into CRM lead properties.'
      },
      {
        title: 'Test Source Attribution on Inbound Leads',
        details: 'Submit test leads with various UTM parameters. Confirm CRM assigns exact source without default "Unknown".'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when 100% of lead sources attribute automatically in CRM.'
      }
    ]
  },
  {
    name: 'CRM Automation – User & Permission Setup',
    category: 'Security',
    owner: 'CRM Specialist',
    version: '1.0',
    description: 'Provisioning team accounts, role-based access control (RBAC), restricting lead export permissions, and enforcing 2FA.',
    steps_json: [
      {
        title: 'Create User Profiles & Role Groups',
        details: 'Assign roles: Sales Rep (access assigned leads only), Sales Manager (access full pipeline), Finance (access won deals & invoices), Admin (full settings).'
      },
      {
        title: 'Restrict Bulk Data Export Permissions',
        details: 'Disable bulk contact/lead export permissions for standard sales reps to protect client database IP.'
      },
      {
        title: 'Enforce Two-Factor Authentication (2FA)',
        details: 'Require 2FA on all CRM user logins.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when all users are provisioned with least-privilege security roles.'
      }
    ]
  },
  {
    name: 'CRM Automation – Lead Assignment Rules',
    category: 'Development',
    owner: 'CRM Specialist',
    version: '1.0',
    description: 'Configuring automated round-robin lead routing, geographic territory assignment, and high-value lead prioritization.',
    steps_json: [
      {
        title: 'Configure Round-Robin Routing Algorithm',
        details: 'Set automated round-robin distributing incoming inbound leads evenly among active sales reps.'
      },
      {
        title: 'Configure Territory / Service Specialization Rules',
        details: 'Route high-ticket Enterprise/AI leads directly to Senior Sales Manager or Founder.'
      },
      {
        title: 'Implement Immediate Rep Notifications',
        details: 'Dispatch instant SMS / WhatsApp / Push alert to the assigned sales rep within 10 seconds of lead creation.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when lead assignment rules route test leads accurately.'
      }
    ]
  },
  {
    name: 'CRM Automation – Follow-Up Automation',
    category: 'Development',
    owner: 'CRM Specialist',
    version: '1.0',
    description: 'Building automated multi-channel follow-up sequences (Email + WhatsApp + Task reminders) for uncontacted and stale leads.',
    steps_json: [
      {
        title: 'Build Day 1 "Speed-to-Lead" Sequence',
        details: 'Trigger instant auto-confirmation email & WhatsApp to lead + instant task reminder for rep to call within 15 minutes.'
      },
      {
        title: 'Build Multi-Touch Follow-Up Drip (Day 2, 4, 7, 14)',
        details: 'Schedule automated nurture emails and value-packed WhatsApp messages if lead remains in "Contact Attempted" stage.'
      },
      {
        title: 'Implement Auto-Pause on Lead Response',
        details: 'Automatically stop follow-up sequence when lead replies or stage moves to "Discovery / Qualified".'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when follow-up sequences execute and pause automatically upon reply.'
      }
    ]
  },
  {
    name: 'CRM Automation – Task Automation',
    category: 'Development',
    owner: 'CRM Specialist',
    version: '1.0',
    description: 'Automating task generation, due dates, follow-up reminders, and manager escalation on overdue leads.',
    steps_json: [
      {
        title: 'Configure Stage-Triggered Task Creation',
        details: 'E.g., Moving deal to "Proposal Sent" automatically generates task: "Follow up on proposal review" due in 48 hours.'
      },
      {
        title: 'Configure Inactivity Escalation Alerts',
        details: 'If an active deal has no logged activity for 5 business days, trigger notification to Sales Manager.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when automated task generation rules are active.'
      }
    ]
  },
  {
    name: 'CRM Automation – Email Integration',
    category: 'Development',
    owner: 'CRM Specialist',
    version: '1.0',
    description: 'Connecting Google Workspace / Microsoft 365 / SMTP email accounts, automated email logging, and tracking email opens/clicks.',
    steps_json: [
      {
        title: 'Connect Sales Rep Email Inboxes',
        details: 'Link individual sales rep corporate email accounts to CRM via OAuth / IMAP.'
      },
      {
        title: 'Enable Automated Email Activity Logging',
        details: 'Automatically log all inbound and outbound client email threads onto the CRM deal timeline.'
      },
      {
        title: 'Configure Email Templates & Snippets',
        details: 'Create standardized email templates for: Discovery invite, Proposal delivery, Contract review, and Post-meeting summary.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when two-way email sync logs conversations on CRM contact records.'
      }
    ]
  },
  {
    name: 'CRM Automation – WhatsApp Integration',
    category: 'Development',
    owner: 'CRM Specialist',
    version: '1.0',
    description: 'Integrating WhatsApp Business messaging into CRM contact timelines, automated message triggers, and 1-click chat.',
    steps_json: [
      {
        title: 'Connect WhatsApp API to CRM Gateway',
        details: 'Integrate WhatsApp messaging module into CRM contact records.'
      },
      {
        title: 'Enable 1-Click WhatsApp Chat from CRM',
        details: 'Add direct "Chat on WhatsApp" button on contact cards opening live chat with pre-filled message.'
      },
      {
        title: 'Log WhatsApp Conversation Transcripts in CRM Timeline',
        details: 'Automatically persist incoming and outgoing WhatsApp messages on the contact timeline.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when WhatsApp interactions sync cleanly with CRM records.'
      }
    ]
  },
  {
    name: 'CRM Automation – Form Integration',
    category: 'Development',
    owner: 'Web Developer',
    version: '1.0',
    description: 'Connecting website contact forms, popups, and landing pages directly into CRM via API / Webhook with zero lead loss.',
    steps_json: [
      {
        title: 'Build Next.js Form to CRM Webhook Handler',
        details: 'In Next.js API endpoint, send structured payload to CRM lead creation API upon form submission.'
      },
      {
        title: 'Implement Fail-Safe Database Queue',
        details: 'Always store lead in local PostgreSQL database first; then dispatch to CRM. If CRM API is down, retry in background so no leads are lost.'
      },
      {
        title: 'Map Form Fields to Custom CRM Properties',
        details: 'Ensure all form fields (Service, Budget, Message, Consent) map into correct CRM deal fields.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when website form submissions reliably create enriched CRM leads in real time.'
      }
    ]
  },
  {
    name: 'CRM Automation – API Integration',
    category: 'Development',
    owner: 'Automation Developer',
    version: '1.0',
    description: 'Building custom webhook integrations connecting CRM to payment gateways, accounting tools, and project management portals.',
    steps_json: [
      {
        title: 'Build "Deal Won" Project Creation Webhook',
        details: 'When deal moves to "Closed Won": Automatically create new client and delivery project in Founder OS Project Management module.'
      },
      {
        title: 'Build Invoice Generation Webhook',
        details: 'Trigger invoice creation in Finance module with agreed payment milestone terms upon deal closing.'
      },
      {
        title: 'Test Webhook Payload Transformations',
        details: 'Verify data formats match target API schemas.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when closed deals automatically trigger project and invoice creation.'
      }
    ]
  },
  {
    name: 'CRM Automation – Duplicate Management',
    category: 'Development',
    owner: 'CRM Specialist',
    version: '1.0',
    description: 'Configuring automated deduplication rules based on clean email and normalized phone numbers.',
    steps_json: [
      {
        title: 'Define Primary Unique Identifiers',
        details: 'Set normalized Email and E.164 Phone Number as primary deduplication keys.'
      },
      {
        title: 'Configure Auto-Merge & Append Logic',
        details: 'If an existing contact submits a new form: Append new inquiry as an Activity Note or create a new Deal under the existing Contact rather than creating duplicate contacts.'
      },
      {
        title: 'Run Weekly Duplicate Scan',
        details: 'Schedule weekly automated duplicate audit to merge legacy records.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when deduplication rules prevent duplicate contact creation on re-submissions.'
      }
    ]
  },
  {
    name: 'CRM Automation – Data Import',
    category: 'Development',
    owner: 'CRM Specialist',
    version: '1.0',
    description: 'Cleaning, normalizing, and importing legacy customer data, past deals, and contact lists into CRM without data corruption.',
    steps_json: [
      {
        title: 'Clean & Normalize Legacy CSV Data',
        details: 'Format phone numbers into E.164, lowercase emails, remove special characters, and eliminate duplicate rows in Excel/Python before import.'
      },
      {
        title: 'Map CSV Columns to CRM Properties',
        details: 'Perform field mapping in CRM import wizard. Verify data types match.'
      },
      {
        title: 'Execute Sample Batch Import (50 Rows)',
        details: 'Import sample batch. Verify contact records, deal stages, and owner assignments render perfectly.'
      },
      {
        title: 'Execute Full Database Import',
        details: 'Import complete dataset and verify total imported count matches source file.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when all legacy contacts are imported cleanly with zero data loss.'
      }
    ]
  },
  {
    name: 'CRM Automation – Testing',
    category: 'QA',
    owner: 'QA Specialist',
    version: '1.0',
    description: 'Comprehensive end-to-end testing of lead routing, stage changes, automated emails, task triggers, and notification alerts.',
    steps_json: [
      {
        title: 'Submit 15 Test Leads from Web, WhatsApp, Ads',
        details: 'Verify all test submissions create CRM contacts with correct source attribution, round-robin owner, and initial notification.'
      },
      {
        title: 'Test Stage Transitions & Mandatory Fields',
        details: 'Drag deal through all stages: confirm mandatory fields are enforced, tasks generate with correct due dates, and stage change emails trigger.'
      },
      {
        title: 'Test Closed Won / Lost Actions',
        details: 'Close deal as Won: verify project and invoice trigger. Close deal as Lost: verify lost reason is captured.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when QA Specialist signs off on CRM test matrix.'
      }
    ]
  },
  {
    name: 'CRM Automation – User Acceptance Testing',
    category: 'QA',
    owner: 'Project Manager',
    version: '1.0',
    description: 'Conducting UAT with client sales team, validating daily usability, and gathering user feedback.',
    steps_json: [
      {
        title: 'Conduct Interactive Walkthrough with Sales Reps',
        details: 'Guide sales reps through daily workflows: Reviewing new leads, logging calls, sending proposals, moving stages.'
      },
      {
        title: 'Facilitate 3-Day Live Pilot Period',
        details: 'Observe sales reps working in CRM. Collect feedback on field usability and notification frequency.'
      },
      {
        title: 'Apply Minor Field & Workflow Adjustments',
        details: 'Fine-tune UI views, default filters, and notification settings.'
      },
      {
        title: 'Obtain Formal Written UAT Sign-off',
        details: 'Secure written approval from Sales Head authorizing live go-live.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when client signs UAT acceptance certificate.'
      }
    ]
  },
  {
    name: 'CRM Automation – Production Deployment',
    category: 'Deployment',
    owner: 'CRM Specialist',
    version: '1.0',
    description: 'Switching CRM to live production status, activating live lead forms, and launching live sales tracking.',
    steps_json: [
      {
        title: 'Purge Test Data from Production CRM',
        details: 'Delete all test contacts, deals, and sample tasks to ensure clean baseline database.'
      },
      {
        title: 'Enable Live Webhooks on Production Forms',
        details: 'Point live website and ad lead webhooks to production CRM.'
      },
      {
        title: 'Verify Live Inbound Lead Capture',
        details: 'Verify first incoming live real customer lead captures cleanly, assigns rep, and triggers notification.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when CRM is live in production with verified real-time lead capture.'
      }
    ]
  },
  {
    name: 'CRM Automation – Team Training',
    category: 'Client Onboarding',
    owner: 'CRM Specialist',
    version: '1.0',
    description: 'Conducting comprehensive training sessions for sales reps and sales managers, providing visual SOPs and video guides.',
    steps_json: [
      {
        title: 'Conduct Sales Rep Training Session (60 Mins)',
        details: 'Train reps on: Mobile app usage, quick lead response, logging calls/WhatsApp notes, booking meetings, and updating deal stages.'
      },
      {
        title: 'Conduct Sales Manager Training Session (45 Mins)',
        details: 'Train managers on: Pipeline inspection, lead re-assignment, activity tracking, and revenue forecasting.'
      },
      {
        title: 'Deliver Video Recordings & 1-Page Cheatsheets',
        details: 'Provide quick-reference PDF guides and video recordings in client portal.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when team training is conducted and resources delivered.'
      }
    ]
  },
  {
    name: 'CRM Automation – Reporting Dashboard',
    category: 'Development',
    owner: 'CRM Specialist',
    version: '1.0',
    description: 'Building executive dashboards, revenue forecasting charts, rep activity scorecards, and lead source ROI reports.',
    steps_json: [
      {
        title: 'Build Executive Pipeline & Revenue Dashboard',
        details: 'Configure real-time widgets: Total Pipeline Value, Weighted Forecast, Deals Closed MTD, Average Deal Size, Average Sales Cycle (Days).'
      },
      {
        title: 'Build Lead Source & Conversion Efficiency Report',
        details: 'Create visual charts comparing Lead Source vs Deals Won vs Revenue Generated.'
      },
      {
        title: 'Build Sales Rep Activity & Response Time Scorecard',
        details: 'Track rep performance: Average Speed to First Lead Contact (minutes), Calls Logged, Deals Won, Win Rate %.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when executive dashboards are active and verified against underlying database records.'
      }
    ]
  },
  {
    name: 'CRM Automation – Maintenance',
    category: 'Development',
    owner: 'CRM Specialist',
    version: '1.0',
    description: 'Routine monthly maintenance, database hygiene, updating dropdown properties, user deprovisioning, and workflow audits.',
    steps_json: [
      {
        title: 'Audit User Access & Deprovision Exited Staff',
        details: 'Remove CRM access for former employees and re-assign their open deals to active reps.'
      },
      {
        title: 'Perform Monthly Database Hygiene & Deduplication',
        details: 'Merge orphaned duplicate contacts and clean incomplete records.'
      },
      {
        title: 'Audit Automation Workflows & Webhooks',
        details: 'Verify all automation triggers and third-party API tokens are functioning smoothly.'
      },
      {
        title: 'Send Monthly CRM Health Summary to Leadership',
        details: 'Deliver summary detailing system health, lead volume processed, and pipeline velocity.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when monthly CRM maintenance is completed.'
      }
    ]
  },
  {
    name: 'CRM Automation – Offboarding',
    category: 'Offboarding',
    owner: 'Account Manager',
    version: '1.0',
    description: 'Orderly conclusion of CRM management retainer, transferring master administrative ownership, and offboarding.',
    steps_json: [
      {
        title: 'Reconcile Final Invoices with Finance',
        details: 'Confirm all CRM implementation and retainer fees are settled.'
      },
      {
        title: 'Transfer Master Administrator Role to Client',
        details: 'Promote client executive to Master Super Admin and remove InfronixWeb administrative accounts.'
      },
      {
        title: 'Deliver Complete Data Export & Automation Documentation',
        details: 'Provide full SQL / CSV database backup and technical architecture documentation.'
      },
      {
        title: 'Archive Project in Founder OS',
        details: 'Mark project status as "Completed/Offboarded" in Founder OS.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when master ownership is transferred and client offboarded.'
      }
    ]
  }
];
