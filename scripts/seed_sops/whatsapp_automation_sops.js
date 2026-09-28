export const whatsAppAutomationSOPs = [
  {
    name: 'WhatsApp Automation – Client Discovery',
    category: 'Sales',
    owner: 'Automation Developer',
    version: '1.0',
    description: 'Initial discovery identifying WhatsApp automation goals (instant lead response, order confirmations, broadcast marketing, customer support).',
    steps_json: [
      {
        title: 'Review Client Customer Communication Channels',
        details: 'Assess client incoming inquiry volume on WhatsApp, current response time, team bandwidth, and missed lead rates.'
      },
      {
        title: 'Define Primary Automation Use Cases',
        details: 'Identify key workflows: 1) Instant Lead Auto-responder (within 10 seconds of web form fill), 2) Interactive Qualification Bot, 3) Automated Payment/Appointment Reminders, 4) Human Support Escalation.'
      },
      {
        title: 'Audit Phone Number & Business Eligibility',
        details: 'Check if client has dedicated business phone number not tied to personal WhatsApp, and verify business eligibility under Meta WhatsApp Commerce Policy.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when WhatsApp Discovery Document is signed off.'
      }
    ]
  },
  {
    name: 'WhatsApp Automation – Use Case Mapping',
    category: 'Design',
    owner: 'Automation Developer',
    version: '1.0',
    description: 'Mapping step-by-step interactive button flows, quick replies, list menus, and qualification paths on WhatsApp.',
    steps_json: [
      {
        title: 'Map Interactive Button & Menu Architecture',
        details: 'Design structured menus with interactive buttons (max 3 buttons per message) and List Menus (up to 10 items) for service selection.'
      },
      {
        title: 'Map Automated Qualification Logic',
        details: 'Design branching questions: What service do you need? -> What is your project budget? -> What is your city/location?'
      },
      {
        title: 'Map Human Handover & Business Hours Logic',
        details: 'Design distinct flows for Business Hours (route to live sales agent) vs After-Hours (record inquiry and promise next-morning callback).'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when WhatsApp Flowchart is approved by client.'
      }
    ]
  },
  {
    name: 'WhatsApp Automation – Account Setup',
    category: 'Client Onboarding',
    owner: 'Automation Developer',
    version: '1.0',
    description: 'Setting up Meta WhatsApp Business Account (WABA), Business Solution Provider (BSP: Gupshup, Wati, AiSensy, Interakt, or Cloud API).',
    steps_json: [
      {
        title: 'Select WhatsApp Business Solution Provider (BSP)',
        details: 'Choose platform: Meta Cloud API / Wati / AiSensy / Interakt based on client team size and broadcast requirements.'
      },
      {
        title: 'Register Dedicated Phone Number on WABA',
        details: 'Delete existing standard WhatsApp/Business app account linked to number and register on official WhatsApp Business API with 6-digit PIN.'
      },
      {
        title: 'Configure WhatsApp Business Profile Details',
        details: 'Upload high-resolution logo, set display name, business category, description, website URL, and office hours.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when WABA is active and phone number is connected to API.'
      }
    ]
  },
  {
    name: 'WhatsApp Automation – Business Verification Check',
    category: 'Security',
    owner: 'Automation Developer',
    version: '1.0',
    description: 'Guiding client through Meta Business Verification in Meta Business Manager to unlock messaging limits and green tick eligibility.',
    steps_json: [
      {
        title: 'Check Meta Business Verification Status',
        details: 'Navigate to Meta Business Settings -> Security Center -> Business Verification.'
      },
      {
        title: 'Submit Official Legal Business Documents',
        details: 'Upload official Certificate of Incorporation, GST Registration, or Utility Bill matching exact legal business name and address.'
      },
      {
        title: 'Verify Domain Ownership & Business Email',
        details: 'Complete domain DNS TXT verification and verify corporate email address.'
      },
      {
        title: 'Monitor Verification Approval Status',
        details: 'Track approval in Meta Business Settings. Once verified, messaging tier expands from 250 to 1,000+ conversations/day.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when Meta Business Verification is approved.'
      }
    ]
  },
  {
    name: 'WhatsApp Automation – Template Planning',
    category: 'Design',
    owner: 'Automation Developer',
    version: '1.0',
    description: 'Drafting, categorizing, and submitting WhatsApp HSM template messages (Utility, Marketing, Authentication) for Meta approval.',
    steps_json: [
      {
        title: 'Draft WhatsApp HSM Template Messages',
        details: 'Write template messages for outreach outside the 24-hour customer care window: 1) Instant Lead Auto-Reply (Utility), 2) Appointment Reminder (Utility), 3) Re-engagement / Special Offer (Marketing).'
      },
      {
        title: 'Incorporate Dynamic Variables & Quick Reply Buttons',
        details: 'Use parameters like {{1}} for customer name, {{2}} for service name. Add CTA buttons (Call Now, Visit Website, Chat with Agent).'
      },
      {
        title: 'Submit Templates to Meta for Approval',
        details: 'Submit templates in WhatsApp Manager under correct categories. Ensure zero spam phrasing to prevent rejection.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when all required template messages are marked APPROVED by Meta.'
      }
    ]
  },
  {
    name: 'WhatsApp Automation – Opt-In Flow',
    category: 'Development',
    owner: 'Automation Developer',
    version: '1.0',
    description: 'Implementing explicit user opt-in capture on website forms to ensure compliance with WhatsApp Anti-Spam policies and DPDP rules.',
    steps_json: [
      {
        title: 'Add WhatsApp Consent Checkbox on Web Forms',
        details: 'Include explicit consent text on all website forms: "Receive project updates and quotes on WhatsApp [Phone Number]".'
      },
      {
        title: 'Record Timestamped Opt-In in Database',
        details: 'Log opt-in timestamp, source URL, and phone number in database for audit compliance.'
      },
      {
        title: 'Implement "STOP" / Opt-Out Keyword Handler',
        details: 'Configure automated opt-out: If user replies "STOP", "UNSUBSCRIBE", or "NO", immediately blacklist phone number from automated marketing broadcasts.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when opt-in and opt-out workflows are active and compliant.'
      }
    ]
  },
  {
    name: 'WhatsApp Automation – Conversation Flow',
    category: 'Design',
    owner: 'Automation Developer',
    version: '1.0',
    description: 'Building multi-step interactive chatbot flows in visual flow builder with button handlers and fallback prompts.',
    steps_json: [
      {
        title: 'Build Welcome & Lead Intake Node',
        details: 'Configure auto-reply triggered on first incoming message: Greet user by name, explain services, and display interactive quick-reply buttons.'
      },
      {
        title: 'Build Dynamic Service Selection Branch',
        details: 'Route users based on button selection (e.g., Web Development -> show pricing & portfolio -> request project scope).'
      },
      {
        title: 'Configure Fallback & Clarification Node',
        details: 'If user sends unparseable voice note or unrecognized text, send polite fallback offering to connect with human consultant.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when conversation flow executes smoothly in test environment.'
      }
    ]
  },
  {
    name: 'WhatsApp Automation – Lead Capture',
    category: 'Development',
    owner: 'Automation Developer',
    version: '1.0',
    description: 'Capturing structured customer requirements via WhatsApp and auto-creating CRM contact records.',
    steps_json: [
      {
        title: 'Extract User Profile & Mobile Number',
        details: 'Capture WhatsApp display name, verified phone number, and conversation timestamp.'
      },
      {
        title: 'Extract Service Requirement & Budget Data',
        details: 'Collect structured answers from interactive menu selections.'
      },
      {
        title: 'Create Lead Record in Founder OS / Client CRM',
        details: 'Automatically create new lead with source "WhatsApp Inbound" and assign to sales manager.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when WhatsApp interactions successfully create verified leads in CRM.'
      }
    ]
  },
  {
    name: 'WhatsApp Automation – CRM Integration',
    category: 'Development',
    owner: 'CRM Specialist',
    version: '1.0',
    description: 'Two-way integration between WhatsApp Business API and CRM database for unified lead timelines and chat history.',
    steps_json: [
      {
        title: 'Configure Two-Way CRM Webhooks',
        details: 'When a new lead fills website form -> trigger WhatsApp template to lead. When lead replies on WhatsApp -> update CRM activity timeline.'
      },
      {
        title: 'Embed WhatsApp Live Chat in CRM Interface',
        details: 'Enable sales team to read and reply to WhatsApp messages directly inside Founder OS / CRM dashboard.'
      },
      {
        title: 'Configure Automated Stage-Change WhatsApp Messages',
        details: 'Trigger automatic WhatsApp notifications when CRM lead stage changes (e.g. Stage "Proposal Sent" -> triggers WhatsApp message with proposal link).'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when two-way CRM and WhatsApp sync is active and tested.'
      }
    ]
  },
  {
    name: 'WhatsApp Automation – API / Webhook Setup',
    category: 'Development',
    owner: 'Automation Developer',
    version: '1.0',
    description: 'Implementing webhook listeners for incoming WhatsApp messages, delivery receipts, and status callbacks.',
    steps_json: [
      {
        title: 'Deploy Secure Webhook Endpoint',
        details: 'Build HTTPS webhook listener endpoint verifying Meta Hub Challenge verification token on GET and handling message payloads on POST.'
      },
      {
        title: 'Handle Message Status Callbacks (Sent, Delivered, Read)',
        details: 'Process status updates to track message delivery rates and read receipts in database.'
      },
      {
        title: 'Implement Rate Limiting & Queue Buffer',
        details: 'Add Redis / queue buffer to handle sudden inbound surges without dropping messages.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when webhook handles all Meta status and message callbacks with 200 OK responses.'
      }
    ]
  },
  {
    name: 'WhatsApp Automation – Testing',
    category: 'QA',
    owner: 'QA Specialist',
    version: '1.0',
    description: 'Testing 25+ real-world WhatsApp chat scenarios, button clicks, invalid inputs, media uploads, and notification speed.',
    steps_json: [
      {
        title: 'Test Full Inbound Qualification Flow',
        details: 'Send message from test phone: verify welcome message triggers in < 5 seconds, buttons click properly, and lead enters CRM.'
      },
      {
        title: 'Test Triggered Webhook from Website Form',
        details: 'Submit website consultation form: verify instant WhatsApp notification is received on test mobile phone within 10 seconds.'
      },
      {
        title: 'Test Edge Cases (Voice Notes, Images, Emojis)',
        details: 'Send unexpected inputs (photos, audio notes, emojis). Verify bot handles gracefully without crashing.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when QA Specialist marks test suite PASSED with zero defects.'
      }
    ]
  },
  {
    name: 'WhatsApp Automation – Failure Handling',
    category: 'Development',
    owner: 'Automation Developer',
    version: '1.0',
    description: 'Configuring automated retries for failed template dispatches, 24-hour session window fallbacks, and error logging.',
    steps_json: [
      {
        title: 'Handle 24-Hour Session Window Expirations',
        details: 'If 24-hour customer window has expired and automated message fails, automatically switch payload to an approved Utility Template message.'
      },
      {
        title: 'Configure Retry Queue for Failed API Requests',
        details: 'Retry transient WhatsApp API failures up to 3 times with exponential backoff.'
      },
      {
        title: 'Trigger Alert to Support Channel on Delivery Blockers',
        details: 'If WhatsApp API account balance is low or quality rating drops to "Red", dispatch instant alert to developer Slack channel.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when failure handling and 24-hour window fallback rules pass simulation.'
      }
    ]
  },
  {
    name: 'WhatsApp Automation – Human Handover',
    category: 'Development',
    owner: 'Automation Developer',
    version: '1.0',
    description: 'Configuring seamless bot-to-human agent transfer, pausing bot auto-replies when agent enters chat, and resuming upon ticket resolution.',
    steps_json: [
      {
        title: 'Implement Bot Pause Mechanism',
        details: 'When user clicks "Speak with Human" or sales agent sends a manual message from CRM: Automatically pause bot auto-replies for that contact for 24 hours.'
      },
      {
        title: 'Dispatch Instant Push Notification to Available Agents',
        details: 'Send real-time alert to sales team WhatsApp group / Slack with user contact card and chat transcript.'
      },
      {
        title: 'Provide Bot Resume Trigger',
        details: 'Allow agent to click "Resume Bot" or automatically resume bot after 24 hours of inactivity.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when human handover pauses bot cleanly and notifies sales agents.'
      }
    ]
  },
  {
    name: 'WhatsApp Automation – Security Review',
    category: 'Security',
    owner: 'Automation Developer',
    version: '1.0',
    description: 'Auditing WhatsApp API tokens, 2FA on Business Manager, phone number PIN security, and data privacy.',
    steps_json: [
      {
        title: 'Verify 2FA on Meta Business Manager',
        details: 'Confirm two-factor authentication is enforced for all administrators in Meta Business Manager.'
      },
      {
        title: 'Set Two-Step Verification PIN on WhatsApp API',
        details: 'Configure permanent 6-digit registration PIN on WABA to prevent unauthorized number hijacking.'
      },
      {
        title: 'Audit Webhook Token Security',
        details: 'Ensure webhook verification tokens are stored in environment variables and rotated periodically.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when WhatsApp security checklist is signed off.'
      }
    ]
  },
  {
    name: 'WhatsApp Automation – Production Deployment',
    category: 'Deployment',
    owner: 'Automation Developer',
    version: '1.0',
    description: 'Connecting live production website forms, activating live WABA number, and conducting live verification test.',
    steps_json: [
      {
        title: 'Switch Webhooks to Production Endpoints',
        details: 'Point live website form submissions to production WhatsApp automation webhook.'
      },
      {
        title: 'Verify WhatsApp Business Number Quality Rating',
        details: 'Confirm phone number quality rating is "Green / High" in WhatsApp Manager.'
      },
      {
        title: 'Conduct Live End-to-End Smoke Test',
        details: 'Submit live test form on website: confirm WhatsApp auto-reply arrives within 5 seconds and interactive buttons work.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when WhatsApp automation is live and verified in production.'
      }
    ]
  },
  {
    name: 'WhatsApp Automation – Monitoring',
    category: 'QA',
    owner: 'Automation Developer',
    version: '1.0',
    description: 'Daily and weekly monitoring of WhatsApp delivery rates, read rates, response times, and phone number quality tier.',
    steps_json: [
      {
        title: 'Monitor Message Delivery & Read Rates',
        details: 'Track metrics: Delivery Rate (target >= 95%), Read Rate (target >= 80%), and Average First Response Time (< 10 seconds).'
      },
      {
        title: 'Check WhatsApp Phone Quality Rating & Block Rates',
        details: 'Inspect WhatsApp Manager: Ensure quality rating remains Green. If block rate rises, review recent broadcast template copy and frequency.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when weekly metrics are logged and quality tier is confirmed Green.'
      }
    ]
  },
  {
    name: 'WhatsApp Automation – Maintenance',
    category: 'Development',
    owner: 'Automation Developer',
    version: '1.0',
    description: 'Routine monthly maintenance, updating template messages, flow optimizations, and recharging API messaging credits.',
    steps_json: [
      {
        title: 'Submit New Promotional & Seasonal Templates',
        details: 'Draft and submit new marketing templates for upcoming seasonal campaigns.'
      },
      {
        title: 'Review Messaging Credit Balances',
        details: 'Ensure client API prepaid balance / credit line has sufficient funds for the upcoming month.'
      },
      {
        title: 'Deliver Monthly WhatsApp Performance Summary',
        details: 'Send report detailing total messages delivered, leads qualified, and response times to client.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when monthly maintenance is logged and report delivered.'
      }
    ]
  },
  {
    name: 'WhatsApp Automation – Offboarding',
    category: 'Offboarding',
    owner: 'Account Manager',
    version: '1.0',
    description: 'Orderly conclusion of WhatsApp automation retainer, transferring master WABA ownership, and offboarding.',
    steps_json: [
      {
        title: 'Reconcile Final Invoices with Finance',
        details: 'Confirm all development and monthly retainer fees are cleared.'
      },
      {
        title: 'Transfer Master WABA Ownership to Client',
        details: 'Transfer primary administrator ownership of WhatsApp Business Account to client corporate email.'
      },
      {
        title: 'Export Conversation Flows & Contact Archives',
        details: 'Deliver flow diagrams and contact data exports to client shared drive.'
      },
      {
        title: 'Archive Project in Founder OS',
        details: 'Mark project status as "Completed/Offboarded" in Founder OS.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when WABA ownership is transferred and client offboarded.'
      }
    ]
  }
];
