export const aiAutomationSOPs = [
  {
    name: 'AI Automation – Client Discovery',
    category: 'Sales',
    owner: 'Automation Developer',
    version: '1.0',
    description: 'Initial discovery session to understand client manual workflows, repetitive bottlenecks, software stack, and automation business objectives.',
    steps_json: [
      {
        title: 'Review Client Software Stack & Pain Points',
        details: 'Audit client current tools (CRMs, ERPs, Spreadsheets, Email, WhatsApp, Billing software). Identify repetitive manual data entry, slow lead response times, or prone-to-error processes.'
      },
      {
        title: 'Conduct Interactive Workflow Discovery Session',
        details: 'Interview client operations and team leads: Step-by-step walkthrough of daily manual tasks, time spent per task (hours/week), frequency, and business cost of human error.'
      },
      {
        title: 'Document High-Level Automation Vision',
        details: 'Summarize automation goals: E.g., "Automate incoming lead qualification from web/WhatsApp, instant CRM entry, AI proposal generation, and Slack team notification within 60 seconds".'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when Client Discovery Brief is documented and signed off for deep process audit.'
      }
    ]
  },
  {
    name: 'AI Automation – Process Audit',
    category: 'QA',
    owner: 'Automation Developer',
    version: '1.0',
    description: 'Detailed operational audit recording exact human steps, edge cases, decision branches, and data inputs across the workflow.',
    steps_json: [
      {
        title: 'Shadow Human Operators & Record Workflow',
        details: 'Observe team members executing the manual process live. Record screen captures and document every single click, copy-paste operation, and data field handled.'
      },
      {
        title: 'Identify Unstructured Data & Edge Cases',
        details: 'Document exceptions: How does the team handle missing phone numbers, ambiguous customer messages, foreign currencies, or corrupt file attachments?'
      },
      {
        title: 'Assess Data Volume & Throughput Peaks',
        details: 'Record daily and monthly transaction volumes, peak traffic hours, and response time SLA requirements.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when Process Audit Document with step-by-step breakdown and edge cases is finalized.'
      }
    ]
  },
  {
    name: 'AI Automation – Automation Opportunity Identification',
    category: 'Design',
    owner: 'Automation Developer',
    version: '1.0',
    description: 'Evaluating and prioritizing candidate workflows based on ROI, technical feasibility, business risk, and time savings.',
    steps_json: [
      {
        title: 'Score Workflows on Feasibility vs Impact Matrix',
        details: 'Rank identified workflows on: 1) Technical Feasibility (API availability, structured data), 2) Business Impact (hours saved, revenue acceleration), 3) Risk Level.'
      },
      {
        title: 'Identify AI vs Deterministic Logic Separation',
        details: 'Determine where AI (LLMs / Vision models) is genuinely required (e.g. natural language classification, document parsing, sentiment analysis) vs where deterministic rule-based code is faster, cheaper, and 100% reliable.'
      },
      {
        title: 'Select Phase 1 MVP Automation Scope',
        details: 'Select top 1-2 high-ROI automation pipelines for Phase 1 delivery to provide immediate tangible business value.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when Automation Opportunity Assessment is approved by client with agreed MVP scope.'
      }
    ]
  },
  {
    name: 'AI Automation – Requirements Collection',
    category: 'Client Onboarding',
    owner: 'Automation Developer',
    version: '1.0',
    description: 'Gathering detailed functional specifications, input/output schemas, prompt criteria, and trigger conditions.',
    steps_json: [
      {
        title: 'Define Exact Trigger Conditions',
        details: 'Specify trigger mechanism: Webhook (instant on form submit / WhatsApp message), Schedule (cron every hour), or Polling (new row in Google Sheets).'
      },
      {
        title: 'Define Input & Output Data Schemas',
        details: 'Create strict JSON schema mapping all input fields and expected output formats (e.g., customer_name, clean_phone, intent_category, budget_tier).'
      },
      {
        title: 'Define Human-in-the-Loop Approval Points',
        details: 'Identify high-risk actions (e.g. sending formal contract, processing refund, deleting data) requiring manual human approval before execution.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when Functional Requirements Specification is signed off by client.'
      }
    ]
  },
  {
    name: 'AI Automation – Workflow Mapping',
    category: 'Design',
    owner: 'Automation Developer',
    version: '1.0',
    description: 'Constructing visual node-by-node flowchart diagrams mapping triggers, AI transformation nodes, router branches, and API endpoints.',
    steps_json: [
      {
        title: 'Build Visual Flowchart in Whimsical / Figma / Make',
        details: 'Map end-to-end flow: Trigger -> Input Validation -> AI Processing -> Conditional Router -> API Mutation -> Notification -> Logging.'
      },
      {
        title: 'Map Error & Fallback Decision Branches',
        details: 'Add dedicated error handler branches for every node: If API times out -> retry 3 times -> if still failing, notify admin Slack channel.'
      },
      {
        title: 'Review Workflow Architecture with Client',
        details: 'Present visual diagram to client stakeholders to verify business logic accuracy before coding.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when visual workflow map is approved by client and technical lead.'
      }
    ]
  },
  {
    name: 'AI Automation – Feasibility Review',
    category: 'QA',
    owner: 'Automation Developer',
    version: '1.0',
    description: 'Technical feasibility check auditing third-party API rate limits, pricing tiers, authentication protocols, and latency.',
    steps_json: [
      {
        title: 'Audit Third-Party API Endpoints & Documentation',
        details: 'Verify that target platforms (CRM, ERP, WhatsApp, Payment Gateway) provide REST APIs or Webhooks supporting required operations.'
      },
      {
        title: 'Check Rate Limits & Token Quotas',
        details: 'Calculate expected requests per minute (RPM) and tokens per minute (TPM). Ensure client API subscription tier handles peak volume.'
      },
      {
        title: 'Verify LLM Latency & Cost Economics',
        details: 'Calculate estimated LLM API costs per transaction (e.g., GPT-4o-mini / Claude 3.5 Sonnet / Gemini 1.5 Flash). Ensure execution latency meets SLA.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when technical feasibility report confirms 100% API compatibility with zero architectural blockers.'
      }
    ]
  },
  {
    name: 'AI Automation – Access & API Collection',
    category: 'Security',
    owner: 'Automation Developer',
    version: '1.0',
    description: 'Collecting and securely vaulting API keys, OAuth tokens, webhook secrets, and developer credentials.',
    steps_json: [
      {
        title: 'Request Dedicated API Credentials',
        details: 'Request dedicated service account API keys or OAuth client IDs with least-privilege permissions.'
      },
      {
        title: 'Store Secrets in Encrypted Environment Vault',
        details: 'Store all API keys, OpenAI/Anthropic/Google keys, and webhook signing secrets in 1Password / environment secret manager. Never commit secrets to code.'
      },
      {
        title: 'Test Authentication Handshake for Each Service',
        details: 'Execute test ping request in Postman/Node.js to verify API keys return 200 OK authenticated response.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when all required API credentials are authenticated and stored in secure vault.'
      }
    ]
  },
  {
    name: 'AI Automation – Architecture Planning',
    category: 'Design',
    owner: 'Automation Developer',
    version: '1.0',
    description: 'Architecting scalable automation infrastructure (Custom Node.js serverless functions, n8n, Make.com, or LangChain pipelines).',
    steps_json: [
      {
        title: 'Select Automation Engine / Stack',
        details: 'Choose architecture: Self-hosted n8n / Custom Next.js & Node.js API / Make.com enterprise based on scalability, data privacy, and latency needs.'
      },
      {
        title: 'Design Database State & Idempotency Store',
        details: 'Create PostgreSQL schema or Redis cache to store transaction execution states, processed event IDs, and prevent duplicate executions.'
      },
      {
        title: 'Design Prompt Engineering & System Instructions',
        details: 'Draft structured prompt templates with few-shot examples, JSON schema output enforcement, and strict boundary rules against hallucinations.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when System Architecture Design Document is finalized.'
      }
    ]
  },
  {
    name: 'AI Automation – Workflow Development',
    category: 'Development',
    owner: 'Automation Developer',
    version: '1.0',
    description: 'Building automation pipelines, trigger webhooks, conditional routers, AI transformation steps, and destination actions.',
    steps_json: [
      {
        title: 'Build Webhook Receiver & Signature Verification',
        details: 'Implement secure webhook listener endpoint with HMAC SHA-256 signature verification to ensure incoming payloads originate from verified source.'
      },
      {
        title: 'Implement AI Processing Node with Structured Outputs',
        details: 'Configure LLM integration using structured JSON output (zod / JSON schema). Enforce strict temperature settings (0.0 to 0.2 for deterministic classification).'
      },
      {
        title: 'Implement Business Logic Routers & Transformers',
        details: 'Code conditional logic branches routing leads based on score, geographic territory, service category, or urgency.'
      },
      {
        title: 'Implement Destination Mutations (CRM, Slack, Email)',
        details: 'Build write actions updating CRM records, creating calendar events, and dispatching real-time team notifications.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when workflow executes successfully in development environment with sample payloads.'
      }
    ]
  },
  {
    name: 'AI Automation – API Integration',
    category: 'Development',
    owner: 'Automation Developer',
    version: '1.0',
    description: 'Implementing robust third-party API clients, handling pagination, refresh tokens, and payload transformations.',
    steps_json: [
      {
        title: 'Build Resilient API Client Modules',
        details: 'Wrap third-party API calls in dedicated service functions with configurable request timeouts (standard 10s timeout).'
      },
      {
        title: 'Implement OAuth Token Refresh Logic',
        details: 'For OAuth2 integrations, implement automated refresh token rotation to prevent authentication expirations.'
      },
      {
        title: 'Handle API Pagination & Payload Limits',
        details: 'Implement cursor or offset pagination for large data extract operations to avoid memory exhaustion.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when all third-party API integrations pass integration tests.'
      }
    ]
  },
  {
    name: 'AI Automation – Data Validation',
    category: 'Development',
    owner: 'Automation Developer',
    version: '1.0',
    description: 'Implementing strict input/output validation schemas, data sanitization, phone formatting (E.164), and type enforcement.',
    steps_json: [
      {
        title: 'Enforce Schema Validation (Zod / Joi)',
        details: 'Validate all incoming payloads against strict Zod schema before processing. Reject invalid payloads immediately.'
      },
      {
        title: 'Sanitize & Normalize Customer Data',
        details: 'Normalize phone numbers into standard E.164 international format (+91...), lowercase and trim emails, title-case names, and clean whitespace.'
      },
      {
        title: 'Validate AI Generated Outputs',
        details: 'Validate that LLM responses adhere strictly to expected JSON structure. If AI returns invalid format, trigger automatic repair prompt.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when all data validation tests pass with zero unhandled type errors.'
      }
    ]
  },
  {
    name: 'AI Automation – Error Handling',
    category: 'Development',
    owner: 'Automation Developer',
    version: '1.0',
    description: 'Implementing exponential backoff retries, circuit breakers, fallback routing, and instant error escalation.',
    steps_json: [
      {
        title: 'Configure Exponential Backoff Retries',
        details: 'For transient network/API failures (HTTP 429, 502, 503), configure 3 retry attempts with exponential delays (2s, 8s, 30s).'
      },
      {
        title: 'Implement Graceful Fallback Behavior',
        details: 'If AI extraction fails, route transaction to a fallback queue with default tags and assign to human operator rather than crashing the pipeline.'
      },
      {
        title: 'Configure Dead-Letter Queue (DLQ)',
        details: 'Route permanently failed transactions to a Dead-Letter Queue table with full payload and error stack trace for replay.'
      },
      {
        title: 'Implement Instant Escalation Alerts',
        details: 'Trigger immediate high-priority alert to InfronixWeb developer Telegram/Slack channel upon critical failure.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when error handling and DLQ logging pass simulated outage testing.'
      }
    ]
  },
  {
    name: 'AI Automation – Logging',
    category: 'Development',
    owner: 'Automation Developer',
    version: '1.0',
    description: 'Implementing comprehensive execution logging, payload audits, latency tracking, and token usage records.',
    steps_json: [
      {
        title: 'Log Every Execution Event in Database',
        details: 'Record execution logs: Timestamp, execution_id, trigger_source, status (Success/Failed), duration_ms, and input/output summary.'
      },
      {
        title: 'Mask Sensitive PII & Credentials in Logs',
        details: 'Sanitize log payloads: Automatically mask credit cards, passwords, API keys, and sensitive medical/financial data.'
      },
      {
        title: 'Track LLM Token Usage & API Costs',
        details: 'Log prompt_tokens, completion_tokens, and calculated cost per execution for transparency.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when execution logs render cleanly in monitoring dashboard with masked PII.'
      }
    ]
  },
  {
    name: 'AI Automation – Testing',
    category: 'QA',
    owner: 'QA Specialist',
    version: '1.0',
    description: 'Comprehensive end-to-end integration testing across typical, edge-case, and boundary data scenarios.',
    steps_json: [
      {
        title: 'Execute 20 Typical Test Scenarios',
        details: 'Submit realistic test enquiries across all service categories. Verify correct routing, database entry, email notification, and CRM pipeline assignment.'
      },
      {
        title: 'Test Multilingual & Conversational Inputs',
        details: 'Submit queries in English, Hinglish, Gujarati, and informal colloquial phrasing. Confirm AI intent classification accuracy.'
      },
      {
        title: 'Verify Idempotency (Duplicate Prevention)',
        details: 'Send the exact same webhook payload 3 times simultaneously. Verify that only 1 record is created and 2 duplicates are safely ignored.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when QA Specialist verifies 100% passing test matrix with zero defects.'
      }
    ]
  },
  {
    name: 'AI Automation – Failure Scenario Testing',
    category: 'QA',
    owner: 'QA Specialist',
    version: '1.0',
    description: 'Stress testing automation resilience against network drops, API downtime, malformed payloads, and rate limits.',
    steps_json: [
      {
        title: 'Simulate Downstream API Outage (HTTP 500)',
        details: 'Mock third-party CRM returning 500 error. Verify pipeline enters retry loop, logs to DLQ, and triggers notification.'
      },
      {
        title: 'Simulate Malformed & Truncated Payloads',
        details: 'Send incomplete JSON and unexpected data types. Verify schema validator rejects safely without server crash.'
      },
      {
        title: 'Simulate High-Volume Traffic Spike',
        details: 'Send 50 concurrent requests. Verify queue manages concurrency without dropping transactions or exceeding API rate limits.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when failure scenarios execute cleanly with zero unhandled system exceptions.'
      }
    ]
  },
  {
    name: 'AI Automation – Client UAT',
    category: 'QA',
    owner: 'Project Manager',
    version: '1.0',
    description: 'Conducting User Acceptance Testing (UAT) with client team, validating business logic, and securing launch sign-off.',
    steps_json: [
      {
        title: 'Deploy to Staging Environment with Test Data',
        details: 'Connect staging automation workflow to client sandbox/test CRM environment.'
      },
      {
        title: 'Conduct Interactive UAT Demonstration Call',
        details: 'Walk client through live test scenarios: Trigger lead -> show AI qualification -> show CRM update -> show WhatsApp alert.'
      },
      {
        title: 'Facilitate 3-Day Client Testing Window',
        details: 'Provide client team with test checklist to run real-world sample cases and provide feedback.'
      },
      {
        title: 'Obtain Formal Written UAT Sign-off',
        details: 'Secure written approval from client stakeholder authorizing production cutover.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when client signs UAT acceptance certificate.'
      }
    ]
  },
  {
    name: 'AI Automation – Security Review',
    category: 'Security',
    owner: 'Automation Developer',
    version: '1.0',
    description: 'Auditing API key security, encryption at rest/in transit, DPDP/GDPR compliance, and access controls.',
    steps_json: [
      {
        title: 'Audit Secret Management & Key Permissions',
        details: 'Confirm zero hardcoded API keys in repository. Verify production secrets are separated from staging keys.'
      },
      {
        title: 'Verify HTTPS & Webhook Signature Verification',
        details: 'Ensure all webhook listeners enforce HTTPS and validate incoming HMAC signatures.'
      },
      {
        title: 'Verify PII Data Retention & Privacy Compliance',
        details: 'Confirm prompt data is not used for model training (zero-data retention enterprise API settings enabled). Ensure compliance with DPDP data protection rules.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when Security Audit Checklist is signed off with zero vulnerabilities.'
      }
    ]
  },
  {
    name: 'AI Automation – Production Deployment',
    category: 'Deployment',
    owner: 'Automation Developer',
    version: '1.0',
    description: 'Switching webhooks to live production endpoints, updating production API keys, and conducting live smoke testing.',
    steps_json: [
      {
        title: 'Update Webhooks to Production Endpoints',
        details: 'Switch webhook URLs on live website forms, WhatsApp API, and CRM from staging to production URLs.'
      },
      {
        title: 'Load Production Environment Secrets',
        details: 'Verify live production API keys and database connection strings are active.'
      },
      {
        title: 'Execute Live Production Smoke Test',
        details: 'Trigger single controlled live test submission. Verify instant end-to-end execution across live CRM and notification channels.'
      },
      {
        title: 'Monitor Live Traffic for 60 Minutes',
        details: 'Observe execution logs and error monitoring dashboards closely post-deployment.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when automation is live in production with verified successful executions.'
      }
    ]
  },
  {
    name: 'AI Automation – Documentation',
    category: 'Development',
    owner: 'Automation Developer',
    version: '1.0',
    description: 'Writing comprehensive system documentation, architecture diagrams, data dictionaries, and troubleshooting manuals.',
    steps_json: [
      {
        title: 'Write Technical System Architecture Manual',
        details: 'Document all webhook endpoints, data schemas, AI prompt templates, retry rules, and API dependencies.'
      },
      {
        title: 'Create Troubleshooting & Maintenance Guide',
        details: 'Document common error codes, API key rotation procedures, DLQ replay instructions, and support contacts.'
      },
      {
        title: 'Archive Documentation in Client Portal',
        details: 'Deliver PDF and Notion documentation to client workspace.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when comprehensive documentation is delivered to client.'
      }
    ]
  },
  {
    name: 'AI Automation – Client Training',
    category: 'Client Onboarding',
    owner: 'Automation Developer',
    version: '1.0',
    description: 'Conducting training session for client team on monitoring, handling manual approvals, and reviewing automated logs.',
    steps_json: [
      {
        title: 'Conduct Live Staff Training Session (45 Mins)',
        details: 'Train client team on how the automated workflow operates, where to review automated records, and how to handle manual review flags.'
      },
      {
        title: 'Provide Video Recording & Quick-Reference SOP',
        details: 'Share training video recording and 1-page quick-reference guide.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when training session is completed and acknowledged by client.'
      }
    ]
  },
  {
    name: 'AI Automation – Monitoring',
    category: 'QA',
    owner: 'Automation Developer',
    version: '1.0',
    description: 'Ongoing automated monitoring, uptime checks, failure alerts, and latency performance tracking.',
    steps_json: [
      {
        title: 'Configure Automated Uptime & Health Pings',
        details: 'Set up 5-minute health check pings on webhook endpoints (Better Uptime / Sentry).'
      },
      {
        title: 'Review Weekly Execution & Error Rates',
        details: 'Audit weekly success rate (target >= 99.5%). Investigate any logged DLQ events.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when monitoring alerts are active and weekly logs reviewed.'
      }
    ]
  },
  {
    name: 'AI Automation – Maintenance',
    category: 'Development',
    owner: 'Automation Developer',
    version: '1.0',
    description: 'Routine monthly maintenance, API version upgrades, model prompt optimizations, and quota reviews.',
    steps_json: [
      {
        title: 'Review Model Updates & Prompt Performance',
        details: 'Evaluate new LLM releases for cost reduction / latency improvements. Test updated prompts.'
      },
      {
        title: 'Rotate API Keys & Audit Expiring Tokens',
        details: 'Verify OAuth tokens and API keys are within valid date ranges.'
      },
      {
        title: 'Deliver Monthly Automation Health Summary',
        details: 'Send monthly report detailing total transactions processed, hours saved, and uptime percentage.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when monthly maintenance is logged and summary delivered to client.'
      }
    ]
  },
  {
    name: 'AI Automation – Offboarding',
    category: 'Offboarding',
    owner: 'Account Manager',
    version: '1.0',
    description: 'Orderly conclusion of automation retainer, transferring master credentials, workflow ownership, and offboarding.',
    steps_json: [
      {
        title: 'Reconcile Final Invoices with Finance',
        details: 'Ensure all development and maintenance invoices are settled.'
      },
      {
        title: 'Transfer Master Workflow Ownership to Client',
        details: 'Transfer administrative ownership of automation accounts (n8n/Make/OpenAI) to client master email.'
      },
      {
        title: 'Deliver Master Code Repository & Exports',
        details: 'Export workflow JSON definitions, custom scripts, and prompt libraries to client shared drive.'
      },
      {
        title: 'Revoke Agency Access & Archive Workspace',
        details: 'Remove agency developer credentials and archive project in Founder OS.'
      },
      {
        title: 'Definition of Done',
        details: 'Mark complete when master ownership is transferred, code exported, and offboarding finalized.'
      }
    ]
  }
];
