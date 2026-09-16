# InfronixWeb Founder OS — Walkthrough & Verification

**InfronixWeb Founder OS** is the complete internal business management operating system engineered for InfronixWeb Digital Marketing.

Powered by **Supabase PostgreSQL** and modern Next.js 16 App Router architecture, the operating system is built with a sleek, dark SaaS dashboard aesthetic, zero cloud dependency for core logic, and strict compliance with the **ZERO FAKE DATA** rule.

---

## 🏛️ System Architecture

```
                                  INFRONIXWEB FOUNDER OS
                                             │
           ┌─────────────────────────────────┼─────────────────────────────────┐
           ↓                                 ↓                                 ↓
      [SALES CRM]                       [DELIVERY]                         [FINANCE]
    • Leads Pipeline                  • Projects Directory               • Revenue Receipts
    • Sales Calls Tracker             • Task Management                  • Categorized Expenses
    • Proposals Generator             • Client Feedback Log              • Real-time Profitability
                                      • 11-Point QA Checklist            • Project Margin Tracking
           │                                 │                                 │
           └─────────────────────────────────┼─────────────────────────────────┘
                                             ↓
           ┌─────────────────────────────────┴─────────────────────────────────┐
           ↓                                                                   ↓
       [PEOPLE]                                                           [SECURITY]
    • Team Directory                                                    • Service Accounts Tracker
    • Employment Types & Status                                         • 14-Point Security Checklist
    • Custom Responsibilities Builder                                   • Secrets Reference Guide
                                                                        • Backup & Export/Import Center
                                             │
           ┌─────────────────────────────────┴─────────────────────────────────┐
           ↓                                                                   ↓
     [GLOBAL SEARCH & ALERTS]                                          [AUDIT & SETTINGS]
    • Ctrl+K Command Palette                                          • Live Action Audit Stream
    • Computed Overdue & Deadline Alerts                              • Currency & Profile Controls
```

---

## 🔒 Strict Zero-Data Compliance

- **Zero Fake Data**: All modules start clean without any placeholder leads, fake transactions, or dummy accounts.
- **Dynamic Calculation**: All KPI cards, monthly trend graphs, and profitability reports calculate directly from actual database records (defaulting to ₹0 / empty state if unpopulated).
- **Template System**:
  - **14-Point Security Checklist**: Pre-seeded with 14 standard agency security checks, all initialized to **"Not Checked"**.
  - **11-Point Project QA Checklist**: Automatically initialized per project as unchecked criteria (Responsive design, Mobile testing, Forms, Links, Images, SEO, Metadata, Performance, Accessibility, Browser testing, Client approval).

---

## 🚀 Modules & Capabilities

### 1. Founder Dashboard
- **7 Live KPI Summary Cards**: Total Revenue, Total Expenses, Net Profit, Active Projects, Open Leads, Pending Proposals, Outstanding Receivables.
- **SVG Trend Visualizer**: Monthly Revenue vs Expense vs Profit comparative charts.
- **Operational Alerts**: Real-time calculated indicators for overdue follow-ups, impending deadlines (< 7 days), and unpaid receivables.
- **Recent Audit Feed**: Live chronological record of user actions.

### 2. Sales CRM & Pipeline
- **Sub-views**: Leads Table, Kanban Pipeline view, Call Tracker, and Proposals Engine.
- **Leads**: Filter by Status (`New`, `Contacted`, `Qualified`, `Meeting`, `Proposal Sent`, `Negotiation`, `Won`, `Lost`), Source, and Industry. Sort by value and date.
- **Calls**: Log cold calls, discovery calls, follow-ups, and negotiation notes with next action dates.
- **Proposals**: Generate client proposals with values, statuses (`Draft`, `Sent`, `Viewed`, `Negotiation`, `Accepted`, `Rejected`, `Expired`), and scope summaries.

### 3. Delivery & Projects
- **Projects Directory**: Track status (`Planning`, `Design`, `Development`, `Review`, `Client Feedback`, `QA`, `Deployment`, `Completed`, `On Hold`), priority (`Low`, `Medium`, `High`, `Urgent`), deadline countdowns, and assigned team leads.
- **Project Detail View**:
  - **Overview**: Value, dates, client info, and progress meters.
  - **Tasks**: Create, edit, toggle, and assign project deliverables.
  - **Client Feedback**: Log feedback rounds with action plans.
  - **QA Checklist**: 11 standard checklist items with instant checkbox verification, notes, and custom QA item addition.

### 4. Standard Operating Procedures (SOP Library)
- **Categories**: Sales, Client Onboarding, Design, Development, QA, Deployment, Finance, Security, Offboarding.
- **SOP Reader**: Clean reading interface with step numbers, owner, and versioning.
- **Dynamic Step Builder**: Add, edit, remove, and reorder steps dynamically.

### 5. Finance & Profitability
- **Overview & Profitability**: Paid Revenue vs Expenses, Net Profit, monthly breakdown table, and project-by-project profit margins.
- **Revenue & Invoices**: Record client payments with invoice numbers, payment methods (UPI, Bank Transfer, Stripe), and payment statuses (`Paid`, `Pending`, `Overdue`).
- **Expenses**: Categorize costs (Software, Hosting, Domain, Marketing, Salaries, Freelancers, Office, Equipment) with recurring subscription tracking.

### 6. People & Responsibilities
- **Team Directory**: Track Founders, Employees, Freelancers, Contractors, and Interns.
- **Responsibilities System**: Dynamic tag-based responsibility assignment per team member.

### 7. Security Center
- **Accounts Tracker**: Track infrastructure services (Domain, Email, GitHub, Hosting, Cloud, Payment, Analytics) with MFA status, recovery keys, and review dates without storing plaintext passwords.
- **14-Point Security Checklist**: Manually maintainable compliance checklist initialized to "Not Checked".
- **Secrets Reference Guide**: Educational index for API keys and database vaults without exposing secret values.
- **Backup & Resilience Center**:
  - **Create Full Backup**: Generates timestamped `.json` snapshots with record counts and triggers instant local download.
  - **Restore / Import**: Upload JSON backup with preview modal ("X records will be added") and safe confirmation.
  - **Export CSV**: Export module-specific CSV datasets (Leads, Revenue, Expenses, Projects, People).
  - **Reset Data**: Double-confirmation dialog requiring typing `RESET` to safely reset all business data.

### 8. Global Search & Notifications
- **Ctrl+K Command Palette**: Fast real-time search across Leads, Projects, Tasks, SOPs, People, and Security accounts.
- **Dynamic Notifications Bell**: Live count indicator for overdue items.

### 9. Settings
- **Agency Profile**: Change business name, currency symbol (`₹`, `$`, `€`, `£`), and timezone.
- **User Security**: Change administrator password with current password verification.
- **Storage Status**: Live Supabase connection and region health.

---

## 🧪 Verification & Build Status

| Check | Result | Details |
| :--- | :--- | :--- |
| **Database Migration** | ✅ Passed | 17 tables created in Supabase PostgreSQL |
| **Next.js Production Build** | ✅ Passed | `npm run build` compiled 53 pages & 25 API endpoints cleanly |
| **Zero-Data Compliance** | ✅ Passed | Clean business tables with ₹0 calculations & 14 "Not Checked" checklist items |
| **Local Authentication** | ✅ Passed | Protected API routes & session cookie verification |
| **Audit Logging** | ✅ Passed | Real actions recorded to `founder_os_activity_logs` |
| **App Shell Isolation** | ✅ Passed | Marketing header/footer hidden on `/admin` and `/founder-os` |

---

## 🧭 How to Access

1. Open your browser to **`http://localhost:3000/admin`** (or `/founder-os`).
2. Sign in with your administrator credentials.
3. Access the full suite of Founder OS tools from the sidebar navigation or press **`Ctrl + K`** to search.
