# InfronixWeb

**Official website:** [infronixweb.in](https://www.infronixweb.in/), a web development, SEO and digital marketing agency in Ahmedabad.

This repository contains everything InfronixWeb runs on:

1. **The public website**: service pages, portfolio, blog and enquiry forms.
2. **The client portal**: where clients follow their projects, approve work and sign documents.
3. **Founder OS**: the internal workspace the founder uses to run the business: sales, clients, delivery, documents, mail, finance and team.

## Technology

- **Framework:** Next.js 16 (App Router) with React 19. This Next.js version has breaking changes from older releases; check the guides in `node_modules/next/dist/docs/` before writing route or page code.
- **Styling:** Tailwind CSS 4 with a custom design system (see *Design system* below).
- **Database:** PostgreSQL through `pg` (`src/lib/founder_os_db.js`, `src/lib/db.js`).
- **Email:** Hostinger Mail API (`hostinger-mail-api-sdk`), SMTP through `nodemailer`, and IMAP through `imapflow`.
- **Media:** Cloudinary for team and blog images, with a database fallback.
- **Icons and motion:** Phosphor icons, GSAP and Framer Motion.
- **Lint:** `oxlint` (`npm run lint`).

## Project layout

| Path | What it holds |
| --- | --- |
| `src/app/` | Pages and API routes (App Router) |
| `src/app/(service folders)` | Service landing pages: web development, SEO, Google Ads, Meta Ads, performance marketing, AI chatbot, AI automation, CRM automation, WhatsApp automation, digital marketing |
| `src/app/projects`, `src/app/blog` | Portfolio and blog |
| `src/app/contact`, `src/app/start-project`, `src/app/verify-enquiry` | Enquiry and project-start flows |
| `src/app/client/` | Client portal: dashboard, projects, change requests, notifications, profile, sign-in and password setup |
| `src/app/founder-os/` | Founder OS workspace |
| `src/app/api/` | API routes: `founder-os`, `client`, `public`, `enquiries`, `consultations`, `start-project`, `health` |
| `src/components/` | Website sections and shared UI |
| `src/components/founder-os/` | Founder OS modules |
| `src/components/client-portal/` | Client portal UI |
| `src/lib/` | Server and shared logic (database, auth, mail, documents, SEO, rate limiting) |

## Public website

- Home page with hero, services, process, portfolio, team, FAQ and call-to-action sections.
- A landing page for each service, built from `src/lib/services.js` and `src/lib/service-content.js`.
- Project detail pages with a real screenshot, factual project details, and a link to the live site.
- A blog whose articles are managed from Founder OS.
- Enquiry, consultation and start-project forms with input validation, rate limiting and email verification.
- SEO features: sitemap, `llms.txt`, Open Graph image, structured page metadata and `app-ads.txt`.

## Client portal

Clients sign in to:

- follow project stages and deliverables;
- approve deliverables and upload requirements;
- raise and track change requests;
- read and e-sign agreements, and view invoices;
- receive notifications.

## Founder OS

Founder OS is the internal workspace for running the agency. Each area is a module in `src/components/founder-os/` and is opened from the sidebar:

| Module | Purpose |
| --- | --- |
| Dashboard | Business overview, key numbers and alerts |
| Sales CRM | Leads, calls, proposals and outreach email |
| Client 360° | Every client with their projects and history |
| Delivery | Projects, stages, tasks and QA checklists |
| Client Documents | Agreements, invoices and welcome kits, with e-signatures and PDF export |
| Mailbox | The full support@infronixweb.in mailbox (see below) |
| SOP Library | Standard operating procedures |
| Finance | Revenue, expenses and profitability |
| People & Roles | Team members and responsibilities |
| Blog Management | Write and publish blog articles |
| Security Center | Accounts, access and backups |
| Activity Log | Audit trail of every change |
| Settings | Business settings |

### Mailbox

The Mailbox module manages the whole support@infronixweb.in mailbox (hosted on Hostinger) from inside Founder OS:

- Read the Inbox, Drafts, Sent, Archive, Spam, Trash and any custom folders.
- Open messages and conversations, and download attachments.
- Compose, reply, reply all and forward, with attachments. Forwarding keeps the original attachments.
- Save drafts.
- Mark messages read or unread, star them, move them between folders, archive them and delete them.
- Search, filter by unread or starred, and page through large folders.

**How it works.** The mailbox itself is the source of truth. Every action goes live to the Hostinger Mail API, so webmail and phone mail apps always show the same state. Nothing is copied into the database.

**Drafts.** The Mail API cannot store drafts, so drafts are saved into the Drafts folder over IMAP. If the IMAP login fails, they are kept in the `founder_os_mail_drafts` table and shown as "Panel draft".

**Safety.** Incoming HTML is sanitized with DOMPurify and shown in a sandboxed frame that cannot run scripts. Remote images stay hidden until "Show images" is clicked, which protects against tracking pixels.

**Code:**
- `src/lib/mailbox.js`: server logic
- `src/lib/mail_html.js`: sanitizer
- `src/app/api/founder-os/mailbox/`: API routes
- `src/components/founder-os/MailboxModule.jsx`: interface

### Client Documents

Agreements, invoices and onboarding documents are generated from templates (`src/lib/document_templates.js`), sent to clients, published to the client portal and signed online (`SignaturePad`). Signed content is hashed so any later change can be detected. PDFs are produced with `html2pdf.js`.

## Development setup

1. Clone the repository:
   ```bash
   git clone https://github.com/madhavdavda2009-rgb/infronix.git
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the project root. Never commit it. The main variables are:
   - **Database:** `DATABASE_URL`
   - **Security:** `JWT_SECRET`, `ENCRYPTION_KEY`, `IP_HASH_SECRET`
   - **Site:** `SITE_URL`, `NEXT_PUBLIC_SITE_URL`, `APP_BASE_URL`, `NEXT_PUBLIC_GA_MEASUREMENT_ID`
   - **Hostinger mail:** `HOSTINGER_API_TOKEN`, `HOSTINGER_MAILBOX_ID`, `HOSTINGER_EMAIL`, `HOSTINGER_EMAIL_PASSWORD`, `HOSTINGER_EMAIL_HOST`, `HOSTINGER_EMAIL_PORT`, `HOSTINGER_FROM_NAME`
     - Optional: `HOSTINGER_IMAP_HOST`, `HOSTINGER_IMAP_PORT` (default `imap.hostinger.com:993`)
   - **SMTP:** `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASSWORD`, `SMTP_FROM_EMAIL`, `SMTP_FROM_NAME`
   - **Cloudinary:** `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Before shipping, run:
   ```bash
   npm run lint
   ```
   ```bash
   npm run build
   ```

### Database tables

`initFounderOSDb()` creates the main schema on first run, then skips its migration once the schema exists. Newer modules therefore create their own tables:
- `initClientDocumentsDb()` in `src/lib/client_documents.js`
- the drafts table in `src/lib/mailbox.js`

## Image storage (team and blog)

Team profiles and articles use the image uploaded in Founder OS. Local files do not override an uploaded photo. Until Cloudinary is configured, uploads stay in the database and are served through the versioned public media endpoint.

To enable Cloudinary:

1. Create a product environment and open Console Settings → API Keys.
2. Set `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY` and `CLOUDINARY_API_SECRET` in both the local and hosting server environments.
3. Restart or redeploy.

Keep the secret on the server: never give it a `NEXT_PUBLIC_` name or paste it into a form. Uploads are signed on the server, and each image gets a new asset ID, which prevents overwrites and cache collisions. Existing database images keep working; new uploads go to Cloudinary.

## Design system: "Loyal Luxury"

The look is calm, premium and authoritative: generous whitespace, a dark navy base and thin gold accents.

- **Colours:**
  - Midnight Navy `#0A1128`: text and structure
  - Sophisticated Gold `#C5A059`: borders, icons and highlights
  - Warm Champagne `#F8F5F0`: page background
  - Navy Muted `#1C2541`: hover states
  - Ink Black `#050814`: display type
- **Typography:** only two self-hosted Fontshare families. Font files and the licence are in `src/assets/fonts`; do not add a third family.
  - **Cabinet Grotesk:** headings and display text
  - **General Sans:** body text, forms, labels, buttons and data
- **Layout:**
  - **Desktop:** a 1200px centred container with 80px side margins and a 120px gap between sections.
  - **Mobile:** 24px margins and a single column.
- **Depth:** thin 1px gold borders at 30% opacity and tonal layers instead of heavy shadows. Any shadow is near-invisible (2–3% opacity).
- **Shapes:** sharp 90° corners, except functional circles such as avatars.
- **Components:**
  - **Buttons:** navy primary buttons and gold-outlined secondary buttons, with slow 300ms+ hover transitions.
  - **Inputs:** underline-style, with a solid gold border on focus.
  - **Cards:** gold-bordered, with at least 40px of padding.
  - **Dividers:** a thin gold "signature divider" between sections.
- **Project pages:** one H1 naming the client, a details list beside the introduction, a real screenshot linked to the live site, and no invented results.

## Principles

- **Architecture:** clear separation between frontend and backend, with no duplicated logic.
- **Design:** no placeholder components; every screen should feel finished and premium.
- **Security:**
  - Validate, sanitize and authenticate all data.
  - Keep secrets in environment variables.
  - Rate-limit public endpoints.
