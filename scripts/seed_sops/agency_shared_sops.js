export const agencySharedSOPs = [
  {
    name: 'Sales – New Lead Entry',
    category: 'Sales',
    owner: 'Sales Manager',
    version: '1.0',
    description: 'Standard procedure for capturing, recording, and assigning newly generated inbound or outbound leads in Founder OS CRM within 15 minutes.',
    steps_json: [
      {
        title: 'Capture Lead Details from Source',
        details: 'Extract prospect information from website consultation forms, WhatsApp, direct phone calls, email, or LinkedIn outreach. Record full name, verified company name, clean email address, phone number (E.164), city, and service requirement.'
      },
      {
        title: 'Check for Existing Records (Deduplication)',
        details: 'Search existing CRM contacts by email and phone. If an existing record exists, log the new inquiry as a new Deal on the existing contact card rather than creating a duplicate contact.'
      },
      {
        title: 'Assign Lead Owner & Priority Tier',
        details: 'Assign lead to designated Sales Representative based on round-robin routing or service specialization. Set priority tier (High, Medium, Standard) based on project budget and timeline urgency.'
      },
      {
        title: 'Trigger Initial Contact SLA (< 15 Minutes)',
        details: 'Sales representative must initiate first contact via phone or WhatsApp within 15 minutes during business hours (9 AM - 7 PM). If outside business hours, trigger automated acknowledgment message and schedule first-morning call.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when lead is accurately created in CRM with source attribution, assigned owner, and first contact task scheduled.'
      }
    ]
  },
  {
    name: 'Sales – Lead Qualification',
    category: 'Sales',
    owner: 'Sales Manager',
    version: '1.0',
    description: 'Evaluating prospective client business model, budget realism, decision-maker authority, timeline, and agency technical fit.',
    steps_json: [
      {
        title: 'Conduct Qualification Call (BANT Framework)',
        details: 'Assess: Budget (Do they have minimum budget threshold for the requested service?), Authority (Are we speaking with the key decision-maker?), Need (Is there a clear, high-value problem InfronixWeb can solve?), Timeline (Is the requested delivery date realistic?).'
      },
      {
        title: 'Evaluate Agency Competency & Resource Fit',
        details: 'Confirm requested deliverables align with InfronixWeb core services. If client demands unsupported legacy tech stacks or unethical tactics (e.g. spam SEO, scraping prohibited data), immediately decline.'
      },
      {
        title: 'Log Qualification Status & Notes in CRM',
        details: 'Update CRM lead status: Qualified (move to Discovery stage), Unqualified (log explicit reason and close), or Nurture (schedule future follow-up date).'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when lead record has documented BANT qualification notes and next stage transition confirmed.'
      }
    ]
  },
  {
    name: 'Sales – Discovery Call',
    category: 'Sales',
    owner: 'Sales Manager',
    version: '1.0',
    description: 'Facilitating structured 30-45 minute deep-dive discovery call to extract full project requirements, business context, and success metrics.',
    steps_json: [
      {
        title: 'Prepare Pre-Call Research Deck',
        details: 'Audit prospect digital presence, review direct competitors in their geography, analyze current site speed, and review qualification notes.'
      },
      {
        title: 'Lead Structured Discovery Call',
        details: 'Guide conversation: 1) Business overview & current growth bottlenecks, 2) Primary target audience & customer acquisition channels, 3) Detailed functional feature expectations, 4) Technical integrations, 5) Target commercial KPIs and ROI expectations.'
      },
      {
        title: 'Document Scope Boundaries & Potential Exclusions',
        details: 'Clarify what is strictly in-scope vs out-of-scope (e.g. copywriting, photography, custom software licensing) during the call to prevent future friction.'
      },
      {
        title: 'Synthesize Call Notes into Project Brief',
        details: 'Compile discovery call notes into structured Project Brief in Founder OS. Review with Technical Lead before drafting proposal.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when Project Brief is approved internally and proposal preparation is initiated.'
      }
    ]
  },
  {
    name: 'Sales – Proposal Creation',
    category: 'Sales',
    owner: 'Sales Manager',
    version: '1.0',
    description: 'Drafting commercial proposals, defining phased deliverables, milestone timelines, pricing structures, and terms of service.',
    steps_json: [
      {
        title: 'Select Proposal Structure & Packages',
        details: 'Formulate proposal offering 2-3 structured tiers (e.g., MVP / Core / Enterprise or Base Retainer / Growth Retainer) tailored to client budget and goals.'
      },
      {
        title: 'Detail Scope of Work & Deliverables Matrix',
        details: 'Explicitly enumerate all included deliverables (pages, features, campaigns, monthly hours, reporting cadence) and list explicit exclusions.'
      },
      {
        title: 'Define Milestone Schedule & Payment Terms',
        details: 'Establish standard payment terms (e.g., 50% Advance on SOW execution, 30% Staging Approval, 20% Production Handover, or monthly advance retainers).'
      },
      {
        title: 'Internal Commercial & Margin Review',
        details: 'Review proposal with Founder to confirm delivery margin, developer bandwidth allocation, and profitability.'
      },
      {
        title: 'Export & Send Proposal Deck',
        details: 'Generate high-resolution branded PDF proposal / digital interactive link. Send to client with calendar invite for proposal review walkthrough.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when proposal is delivered to client with scheduled review meeting confirmed on calendar.'
      }
    ]
  },
  {
    name: 'Sales – Proposal Follow-Up',
    category: 'Sales',
    owner: 'Sales Manager',
    version: '1.0',
    description: 'Systematic follow-up cadence, answering client queries, handling objections, and navigating deal negotiations.',
    steps_json: [
      {
        title: 'Conduct Proposal Walkthrough Call',
        details: 'Present proposal live on screen. Walk through scope, architecture, milestone schedule, and investment terms. Address initial questions directly.'
      },
      {
        title: 'Execute Multi-Touch Follow-Up Cadence',
        details: 'Follow up at scheduled intervals: Day 2 (Email answering specific questions + client case study), Day 4 (WhatsApp check-in with decision maker), Day 7 (Executive call to discuss contract timeline).'
      },
      {
        title: 'Handle Price & Scope Negotiations',
        details: 'If client requests price reduction: Do not discount arbitrarily. Instead, adjust deliverable scope or phase features into a later milestone while protecting agency margins.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when client decision is reached (Contract Approval or Documented Lost Reason).'
      }
    ]
  },
  {
    name: 'Sales – Deal Closure',
    category: 'Sales',
    owner: 'Sales Manager',
    version: '1.0',
    description: 'Finalizing Master Services Agreement (MSA), Statement of Work (SOW), countersignatures, and triggering advance billing.',
    steps_json: [
      {
        title: 'Prepare Final SOW and Master Services Agreement (MSA)',
        details: 'Incorporate final agreed pricing, milestone dates, revision limits (standard 2 rounds), and legal terms.'
      },
      {
        title: 'Obtain Authorized Digital Signatures',
        details: 'Send contract via digital signature tool or secure PDF exchange. Ensure both client executive and InfronixWeb Founder have countersigned.'
      },
      {
        title: 'Update CRM Deal Status to "Closed Won"',
        details: 'Update deal in Founder OS to Closed Won with exact final contract value. Notify Finance to issue Advance Payment Invoice.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when countersigned contract is vaulted in client folder and advance invoice is issued.'
      }
    ]
  },
  {
    name: 'Client Onboarding – New Client Setup',
    category: 'Client Onboarding',
    owner: 'Account Manager',
    version: '1.0',
    description: 'Provisioning client profile, client portal credentials, project workspaces, and communication channels upon deal closure.',
    steps_json: [
      {
        title: 'Verify Advance Payment Clearance',
        details: 'Confirm with Finance that contractually agreed advance deposit is credited in bank. Do not start active delivery without verified payment.'
      },
      {
        title: 'Provision Client & Project in Founder OS',
        details: 'Create Client Profile, Project Record, and assign team roles (Project Manager, Lead Developer, Account Manager).'
      },
      {
        title: 'Generate Client Portal Credentials',
        details: 'Create secure Client Portal access credentials and configure project view permissions.'
      },
      {
        title: 'Send Onboarding Welcome Email & Kickoff Invite',
        details: 'Send official welcome email containing: Portal login, Project Roadmap overview, Asset Checklist, and Kickoff Meeting calendar invite.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when client workspace is active, portal credentials delivered, and kickoff call confirmed.'
      }
    ]
  },
  {
    name: 'Client Onboarding – Requirement Collection',
    category: 'Client Onboarding',
    owner: 'Project Manager',
    version: '1.0',
    description: 'Structuring and executing comprehensive requirement intake across functional specifications, brand assets, and target objectives.',
    steps_json: [
      {
        title: 'Issue Structured Service Intake Questionnaire',
        details: 'Send service-specific intake form covering sitemap, brand voice, competitors, target audience, and integration credentials.'
      },
      {
        title: 'Facilitate Detailed Kickoff Walkthrough Call',
        details: 'Host 45-minute kickoff meeting to review client questionnaire responses, clarify ambiguous items, and lock deliverable specifications.'
      },
      {
        title: 'Compile Comprehensive Requirements Document',
        details: 'Document verified functional specifications, asset inventory, and milestone deadlines in Founder OS.'
      },
      {
        title: 'Obtain Client Written Sign-Off on Requirements',
        details: 'Present Requirements Document to client and secure formal written confirmation before technical execution begins.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when client signs off on Requirements Document with zero pending ambiguities.'
      }
    ]
  },
  {
    name: 'Client Onboarding – Access Collection',
    category: 'Client Onboarding',
    owner: 'Account Manager',
    version: '1.0',
    description: 'Collecting and verifying third-party tool permissions, domain access, hosting, analytics, and advertising managers.',
    steps_json: [
      {
        title: 'Issue Service-Specific Access Request Sheet',
        details: 'Request delegated permissions for: Domain Registrar (DNS), Hosting Server, Google Search Console, Google Analytics 4, Meta Business Manager, Google Ads, CRM, and APIs.'
      },
      {
        title: 'Verify Access & Permissions Functionality',
        details: 'Log into each tool to confirm active management permissions. If access is pending 2FA or restricted to view-only, coordinate with client to resolve.'
      },
      {
        title: 'Store Credentials in Agency Encrypted Password Vault',
        details: 'Vault all credentials immediately in 1Password / Bitwarden / Founder OS Key Vault. Never store passwords in plain text notes or chat threads.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when 100% of required accesses are verified and vaulted.'
      }
    ]
  },
  {
    name: 'Client Onboarding – Communication Setup',
    category: 'Client Onboarding',
    owner: 'Account Manager',
    version: '1.0',
    description: 'Establishing official communication channels, response time SLAs, weekly reporting cadence, and escalation protocols.',
    steps_json: [
      {
        title: 'Establish Dedicated Client Channel',
        details: 'Create dedicated WhatsApp Client Group or Slack Connect channel with client stakeholders and InfronixWeb Account & Project Managers.'
      },
      {
        title: 'Publish Agency Working Hours & Response SLA',
        details: 'Post pinned welcome message: Official working hours (Monday-Saturday, 9:00 AM - 7:00 PM IST), standard response SLA (< 4 business hours), and emergency escalation contacts.'
      },
      {
        title: 'Schedule Recurring Weekly / Monthly Sync Cadence',
        details: 'Set up recurring calendar invite for weekly milestone check-in or monthly performance review calls.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when communication channel is active with confirmed guidelines and scheduled sync meetings.'
      }
    ]
  },
  {
    name: 'Finance – Advance Payment Verification',
    category: 'Finance',
    owner: 'Finance/Admin',
    version: '1.0',
    description: 'Verifying bank receipt of contractually agreed project advance deposits or monthly retainers before work initiation.',
    steps_json: [
      {
        title: 'Cross-Reference Bank Credit with SOW / Invoice',
        details: 'Check agency bank statement (HDFC / ICICI / Razorpay) and confirm exact deposit amount received matches issued invoice.'
      },
      {
        title: 'Record Payment in Founder OS Revenue Module',
        details: 'Create Revenue record in Founder OS: Client Name, Project ID, Amount Received, Payment Date, Payment Method (Bank Transfer/UPI/Stripe), Invoice Number.'
      },
      {
        title: 'Issue Official Payment Receipt to Client',
        details: 'Generate formal stamped payment receipt and email to client accounts department.'
      },
      {
        title: 'Notify Project Manager of Project Clearance',
        details: 'Update project financial status to "Advance Verified" and notify Project Manager to begin execution.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when bank deposit is verified, revenue entry logged, and delivery team notified.'
      }
    ]
  },
  {
    name: 'Finance – Invoice Creation',
    category: 'Finance',
    owner: 'Finance/Admin',
    version: '1.0',
    description: 'Generating compliant GST invoices, milestone billing statements, and monthly recurring retainer invoices.',
    steps_json: [
      {
        title: 'Verify Client Legal & GST Details',
        details: 'Confirm client legal business name, registered address, and GSTIN (if applicable) for tax invoicing.'
      },
      {
        title: 'Draft Invoice with Milestone Details',
        details: 'Populate invoice in Founder OS Finance module: Invoice Number, Date, Due Date (Net 7 / Net 15), Itemized Deliverables, Applicable GST (18% IGST / CGST+SGST), and Bank Details (NEFT/RTGS/UPI).'
      },
      {
        title: 'Review Invoice with Account Manager',
        details: 'Confirm milestone conditions or monthly billing dates are met before dispatching.'
      },
      {
        title: 'Deliver Invoice to Client Accounts',
        details: 'Send PDF invoice via email and client portal. Log dispatch date in CRM.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when invoice is generated, verified, delivered, and logged in accounts receivable.'
      }
    ]
  },
  {
    name: 'Finance – Payment Follow-Up',
    category: 'Finance',
    owner: 'Finance/Admin',
    version: '1.0',
    description: 'Structured, polite, and escalating follow-up cadence for pending and overdue client invoices.',
    steps_json: [
      {
        title: 'Send Polite Pre-Due Date Reminder (3 Days Prior)',
        details: 'Send friendly reminder email 3 business days before invoice due date with attached invoice copy.'
      },
      {
        title: 'Send Due Date Payment Notice',
        details: 'Send polite email / WhatsApp notice on invoice due date.'
      },
      {
        title: 'First Overdue Notice (Day 3 Post-Due)',
        details: 'Send first formal overdue notification requesting confirmation of bank payment processing date.'
      },
      {
        title: 'Second Overdue Notice & Project Pause Warning (Day 7 Post-Due)',
        details: 'Notify Account Manager and client executive that active project delivery or ad spend will be temporarily paused if payment is not resolved within 48 hours.'
      },
      {
        title: 'Executive Escalation (Day 10+ Post-Due)',
        details: 'Founder / Finance Head contacts client executive directly to resolve payment blockers.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when invoice is paid or formal resolution schedule is documented.'
      }
    ]
  },
  {
    name: 'Finance – Final Payment Verification',
    category: 'Finance',
    owner: 'Finance/Admin',
    version: '1.0',
    description: 'Confirming receipt of final project milestone balance before production launch, DNS transfer, or final handover.',
    steps_json: [
      {
        title: 'Verify Final Milestone Payment in Bank Statement',
        details: 'Confirm final payment balance (e.g. 20% handover balance or approved change requests) is 100% credited in bank.'
      },
      {
        title: 'Record Final Settlement in Founder OS Revenue Module',
        details: 'Log final payment record, updating project payment status to "Fully Paid".'
      },
      {
        title: 'Issue No-Dues Clearance Certificate to Project Manager',
        details: 'Notify Project Manager that financial clearance is granted for production DNS deployment and master credential handover.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when final payment is verified in bank and financial handover clearance is issued.'
      }
    ]
  },
  {
    name: 'Finance – Expense Recording',
    category: 'Finance',
    owner: 'Finance/Admin',
    version: '1.0',
    description: 'Recording direct project expenses (hosting, third-party APIs, stock assets, contractor fees) in Founder OS.',
    steps_json: [
      {
        title: 'Collect Expense Receipts & Invoices',
        details: 'Gather vendor bills for domains, SSL, OpenAI API usage, Twilio/WhatsApp credits, and contractor invoices.'
      },
      {
        title: 'Log Expense Entry in Founder OS Expenses Module',
        details: 'Record: Category (Software/API/Contractor/Hosting), Description, Amount, Payment Date, Payment Method, Associated Project ID, Receipt Attachment.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when all project expenses are logged in Founder OS with receipts attached.'
      }
    ]
  },
  {
    name: 'Finance – Project Profitability Review',
    category: 'Finance',
    owner: 'Finance/Admin',
    version: '1.0',
    description: 'Post-project financial audit calculating gross margin, developer hours invested, contractor costs, and net profitability.',
    steps_json: [
      {
        title: 'Reconcile Total Revenue vs Total Direct Expenses',
        details: 'Calculate Gross Revenue minus direct software, hosting, and contractor costs.'
      },
      {
        title: 'Calculate Internal Labor Hours & Cost',
        details: 'Multiply total tracked developer, designer, and PM hours by internal hourly cost rates.'
      },
      {
        title: 'Calculate Net Project Profit Margin %',
        details: 'Determine Net Profit Margin (Target >= 50% for agency projects). Document reasons for any margin compression (scope creep, excessive revisions).'
      },
      {
        title: 'Archive Financial Summary in Founder OS',
        details: 'Log profitability report in project record for annual financial reporting.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when Project Profitability Report is finalized and reviewed by Founder.'
      }
    ]
  },
  {
    name: 'Security – Client Credential Management',
    category: 'Security',
    owner: 'Project Manager',
    version: '1.0',
    description: 'Securing, documenting, and managing client credentials with least-privilege permissions in encrypted vaults.',
    steps_json: [
      {
        title: 'Store Credentials in Dedicated Encrypted Vault',
        details: 'Record client logins, API tokens, SSH keys, and database passwords inside 1Password / Bitwarden / Founder OS Key Vault. Strictly ban storing passwords in plain text notes or chat channels.'
      },
      {
        title: 'Assign Least-Privilege Team Access',
        details: 'Grant access only to team members actively assigned to the project. Revoke individual access when tasks conclude.'
      },
      {
        title: 'Rotate Temporary Setup Passwords Post-Launch',
        details: 'Change all temporary development passwords to permanent high-entropy keys upon project launch.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when all project credentials are encrypted in vault with role-based access.'
      }
    ]
  },
  {
    name: 'Security – Password Sharing',
    category: 'Security',
    owner: 'Project Manager',
    version: '1.0',
    description: 'Secure transmission of passwords and credentials to clients and external partners using end-to-end encrypted tools.',
    steps_json: [
      {
        title: 'Use One-Time Encrypted Secret Links',
        details: 'Transmit sensitive passwords via 1Password Share / Bitwarden Send / Privnote with 1-view expiry and 24-hour time limit.'
      },
      {
        title: 'Transmit Usernames and Passwords Over Separate Channels',
        details: 'Send username via Email and one-time password link via WhatsApp/SMS to prevent single-channel interception.'
      },
      {
        title: 'Confirm Recipient Reception & Vaulting',
        details: 'Instruct recipient to save password in their password manager immediately.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when credentials are transmitted securely via encrypted one-time links.'
      }
    ]
  },
  {
    name: 'Security – API Key Management',
    category: 'Security',
    owner: 'Web Developer',
    version: '1.0',
    description: 'Best practices for securing API keys, restricting IP/HTTP referrers, and preventing repository secret leaks.',
    steps_json: [
      {
        title: 'Restrict Public API Keys by HTTP Referrer',
        details: 'For client-side public keys (Google Maps, Firebase), configure HTTP referrer restrictions in vendor console allowing only client domain (https://domain.com/*).'
      },
      {
        title: 'Strictly Isolate Server-Side Private Secrets',
        details: 'Ensure secret API keys (Stripe Secret Key, OpenAI Key, Database URLs) are stored exclusively in server-side process.env and never prefixed with NEXT_PUBLIC_.'
      },
      {
        title: 'Scan Git Repositories for Leaked Secrets',
        details: 'Run automated secret scanner (git-secrets / Trufflehog) before pushing code to GitHub. Ensure .env is listed in .gitignore.'
      },
      {
        title: 'Rotate Compromised Keys Immediately',
        details: 'If an API key is accidentally committed to a repository, revoke and rotate the key immediately in the provider console.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when all API keys are scoped, restricted, and verified absent from source code.'
      }
    ]
  },
  {
    name: 'Security – Employee Access Management',
    category: 'Security',
    owner: 'Project Manager',
    version: '1.0',
    description: 'Standard procedure for onboarding new employees, provisioning corporate accounts, and enforcing security policies.',
    steps_json: [
      {
        title: 'Provision Corporate Google Workspace Email',
        details: 'Create dedicated corporate email (name@infronixweb.in) with mandatory Two-Factor Authentication (2FA).'
      },
      {
        title: 'Assign Password Manager & Security Training',
        details: 'Invite employee to agency password manager vault. Conduct security training on phishing prevention and credential hygiene.'
      },
      {
        title: 'Grant Scoped Tool Permissions',
        details: 'Grant access to GitHub organization, Founder OS, and specific project boards based on employee job role.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when employee is provisioned with 2FA and least-privilege tool access.'
      }
    ]
  },
  {
    name: 'Security – Access Revocation',
    category: 'Security',
    owner: 'Project Manager',
    version: '1.0',
    description: 'Immediate deprovisioning of departed employees or contractors across all systems within 60 minutes of exit.',
    steps_json: [
      {
        title: 'Suspend Corporate Email & Reset Password',
        details: 'Immediately suspend employee corporate Google Workspace account, revoke active OAuth sessions, and reset password.'
      },
      {
        title: 'Remove from GitHub Organization & Repositories',
        details: 'Remove departed user from InfronixWeb GitHub organization, Vercel team, and cloud hosting accounts.'
      },
      {
        title: 'Revoke Password Manager Vault Access',
        details: 'Remove user from 1Password / Bitwarden team vault and rotate any shared master passwords they had access to.'
      },
      {
        title: 'Remove from Communication Channels & CRM',
        details: 'Remove user from Founder OS, Slack, and WhatsApp client groups.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when Access Revocation Checklist is 100% verified and archived.'
      }
    ]
  },
  {
    name: 'Security – Backup Verification',
    category: 'Security',
    owner: 'Web Developer',
    version: '1.0',
    description: 'Monthly routine verifying database backup automated schedules, storage health, and testing restoration integrity.',
    steps_json: [
      {
        title: 'Verify Automated Database Backup Schedules',
        details: 'Check Supabase / PostgreSQL cloud backup dashboard. Verify daily automated snapshots are executing with zero failures.'
      },
      {
        title: 'Execute Test Database Restoration in Sandbox',
        details: 'Restore latest production backup snapshot into isolated staging/sandbox database. Confirm all tables, relations, and records restore with 100% data integrity.'
      },
      {
        title: 'Verify Offsite Backup Redundancy',
        details: 'Ensure database dumps are synchronized to secondary offsite encrypted cloud storage (AWS S3 / Google Cloud Storage).'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when monthly backup restoration test passes and is logged in Founder OS.'
      }
    ]
  },
  {
    name: 'Security – Security Incident Escalation',
    category: 'Security',
    owner: 'Founder',
    version: '1.0',
    description: 'Emergency protocol for containing, investigating, mitigating, and communicating security breaches, compromised credentials, or DDoS attacks.',
    steps_json: [
      {
        title: 'Step 1: Immediate Containment & Isolation',
        details: 'Isolate compromised servers or accounts immediately. Rotate compromised API keys/passwords, revoke active sessions, and enable Cloudflare Under Attack mode if DDoS.'
      },
      {
        title: 'Step 2: Investigate Root Cause & Scope of Exposure',
        details: 'Audit server access logs, database query logs, and audit logs. Identify exact point of entry and determine if any client data was exposed.'
      },
      {
        title: 'Step 3: Deploy Technical Fix & Patch Vulnerability',
        details: 'Implement security patch, close vulnerability, update dependencies, and test in staging before deploying to production.'
      },
      {
        title: 'Step 4: Client & Stakeholder Incident Communication',
        details: 'If client data was affected, notify client leadership with transparent incident report detailing: What occurred, what data was involved, containment steps taken, and preventative measures implemented.'
      },
      {
        title: 'Step 5: Post-Incident Review & Security Hardening',
        details: 'Hold comprehensive internal post-mortem and update security SOPs to prevent recurrence.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when incident is contained, vulnerability patched, root cause documented, and post-mortem finalized.'
      }
    ]
  },
  {
    name: 'QA – Internal Quality Review',
    category: 'QA',
    owner: 'QA Specialist',
    version: '1.0',
    description: 'Standardized internal quality audit required before presenting any milestone deliverable (Design, Web, Campaign, Automation) to client.',
    steps_json: [
      {
        title: 'Audit Deliverable Against Approved SOW Scope',
        details: 'Verify that every feature, page, or campaign component promised in the milestone is present and functional.'
      },
      {
        title: 'Conduct Deep Functional & Visual Testing',
        details: 'Test all interactions, forms, responsive viewports, and links. Ensure zero visual glitches, broken layout, or console errors.'
      },
      {
        title: 'Verify Spelling, Grammar & Brand Compliance',
        details: 'Proofread all public copy. Confirm brand colors, logos, and typography match guidelines.'
      },
      {
        title: 'Sign-off or Issue Bug Fix Tickets',
        details: 'If defects are found, create developer bug tickets in Founder OS. If clean, grant QA Clearance for client presentation.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when deliverable receives formal QA Approval before client review.'
      }
    ]
  },
  {
    name: 'QA – Client Feedback Tracking',
    category: 'QA',
    owner: 'Project Manager',
    version: '1.0',
    description: 'Systematic intake, categorization, and prioritization of client review feedback in Founder OS.',
    steps_json: [
      {
        title: 'Consolidate Feedback in Centralized Tracking Board',
        details: 'Import all client comments from email, WhatsApp, and Figma into Founder OS Feedback Tracker.'
      },
      {
        title: 'Categorize Feedback Items',
        details: 'Classify each item: 1) Bug / Defect (in-scope fix), 2) Minor Aesthetic Tweak (in-scope revision round 1 or 2), 3) Scope Creep / New Feature Request (out-of-scope).'
      },
      {
        title: 'Review Scope Creep Items with Client',
        details: 'For out-of-scope requests, explain timeline and cost impact and issue Change Request for approval.'
      },
      {
        title: 'Assign Approved Revision Tasks to Team',
        details: 'Create actionable tasks for developer/designer with screenshots and clear acceptance criteria.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when 100% of feedback items are categorized and assigned.'
      }
    ]
  },
  {
    name: 'QA – Revision Verification',
    category: 'QA',
    owner: 'QA Specialist',
    version: '1.0',
    description: 'Verifying that all client-requested revisions have been accurately resolved without introducing regression bugs.',
    steps_json: [
      {
        title: 'Re-test Every Item in Feedback Tracker',
        details: 'Inspect resolved tasks on staging environment. Verify the fix matches client request.'
      },
      {
        title: 'Perform Regression Testing on Adjacent Features',
        details: 'Ensure new code fixes did not break previously functioning features or layouts.'
      },
      {
        title: 'Update Task Status to "Verified / Ready for Client"',
        details: 'Mark verified items in tracking board and prepare updated staging link.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when all client revision items pass QA verification.'
      }
    ]
  },
  {
    name: 'Offboarding – Project Handover',
    category: 'Offboarding',
    owner: 'Project Manager',
    version: '1.0',
    description: 'Final deliverable handover session, delivering documentation, user training, and securing Project Acceptance sign-off.',
    steps_json: [
      {
        title: 'Compile Master Project Documentation',
        details: 'Assemble user manuals, CMS editing guides, API credentials, and architecture diagrams into Project Handover Package.'
      },
      {
        title: 'Host Client Handover & Training Walkthrough',
        details: 'Conduct 45-minute walkthrough call showing client team how to manage their digital assets. Provide video recording.'
      },
      {
        title: 'Deliver Master Acceptance Form for Signature',
        details: 'Send Project Acceptance Form for client digital signature confirming all SOW deliverables are received in full.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when client signs Project Acceptance Form and handover documentation is delivered.'
      }
    ]
  },
  {
    name: 'Offboarding – Client Access Handover',
    category: 'Offboarding',
    owner: 'Account Manager',
    version: '1.0',
    description: 'Transferring primary administrative ownership of domains, hosting, analytics, and software licenses to client.',
    steps_json: [
      {
        title: 'Promote Client Designated User to Primary Owner',
        details: 'Transfer master owner role across domain registrar, hosting, CMS, Google Analytics, and ad accounts to client email.'
      },
      {
        title: 'Deliver Encrypted Master Credential Sheet',
        details: 'Send secure one-time link with all administrator usernames and passwords.'
      },
      {
        title: 'Instruct Client to Update Master Passwords',
        details: 'Advise client to update master administrative passwords and verify their login access.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when client confirms successful login as primary administrator across all accounts.'
      }
    ]
  },
  {
    name: 'Offboarding – Internal Access Revocation',
    category: 'Offboarding',
    owner: 'Project Manager',
    version: '1.0',
    description: 'Removing agency team permissions from client third-party tools when retainer or support agreement concludes.',
    steps_json: [
      {
        title: 'Audit Active Agency Permissions',
        details: 'List all client accounts where InfronixWeb team members hold access (Google Ads, Meta, GSC, GA4, WordPress, Shopify, Server).'
      },
      {
        title: 'Remove Agency Users and Partner Links',
        details: 'Remove agency team members and unlink agency partner permissions from client assets.'
      },
      {
        title: 'Archive Credentials from Agency Password Manager',
        details: 'Move client vault to "Archived Clients" in password manager with read-only access.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when all agency accesses to client accounts are revoked.'
      }
    ]
  },
  {
    name: 'Offboarding – Final Backup',
    category: 'Offboarding',
    owner: 'Web Developer',
    version: '1.0',
    description: 'Generating permanent final archive snapshots of codebase, database, media assets, and configurations.',
    steps_json: [
      {
        title: 'Create Final Database SQL Snapshot',
        details: 'Export full database dump with timestamped filename (e.g. client_final_db_backup_2026.sql).'
      },
      {
        title: 'Tag Final Release in Git Repository',
        details: 'Create release tag (e.g. v1.0.0-final-handover) on GitHub main branch and archive repository.'
      },
      {
        title: 'Store Master Archive in Agency Cold Storage',
        details: 'Upload code, database dump, and design assets to agency permanent backup cloud storage (AWS S3 / Google Drive Archive).'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when permanent final backup is archived in secure storage.'
      }
    ]
  },
  {
    name: 'Offboarding – Project Archive',
    category: 'Offboarding',
    owner: 'Project Manager',
    version: '1.0',
    description: 'Final closure of project board in Founder OS, archiving temporary branches, and capturing client exit feedback.',
    steps_json: [
      {
        title: 'Verify Financial Settlement',
        details: 'Confirm with Finance that all milestone payments, change requests, and retainer balances are 100% settled.'
      },
      {
        title: 'Request Client Review / Testimonial',
        details: 'Send friendly review request for Google Business / Clutch and capture video/written testimonial.'
      },
      {
        title: 'Mark Project Status as "Completed" in Founder OS',
        details: 'Update project state to Completed/Archived in Founder OS.'
      },
      {
        title: 'Conduct Internal Team Debrief',
        details: 'Document key delivery learnings, profitability margins, and process improvements for future projects.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when project is archived in Founder OS with final review recorded.'
      }
    ]
  }
];
