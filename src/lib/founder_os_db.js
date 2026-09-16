import pg from 'pg';
const { Pool } = pg;

let pool = null;
let initialized = false;

export function getPool() {
  if (!pool) {
    const connectionString = process.env.SUPABASE_DATABASE_URL;
    if (!connectionString) {
      throw new Error('SUPABASE_DATABASE_URL environment variable is missing');
    }
    pool = new Pool({
      connectionString,
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
      ssl: {
        rejectUnauthorized: false
      }
    });
  }
  return pool;
}

export async function query(sql, params = []) {
  const p = getPool();
  try {
    const result = await p.query(sql, params);
    return result;
  } catch (err) {
    console.error('Founder OS DB query error:', err.message, '\nSQL:', sql);
    throw err;
  }
}

// 14 Standard System Security Checklist Templates
const INITIAL_SECURITY_CHECKLIST_TEMPLATES = [
  { item_key: 'email_mfa', title: 'Primary business email accounts have MFA enabled', category: 'Access Control' },
  { item_key: 'domain_mfa', title: 'Domain registrar (Hostinger/GoDaddy) has MFA & lock enabled', category: 'Infrastructure' },
  { item_key: 'github_mfa', title: 'GitHub organization & developer accounts have 2FA enabled', category: 'Source Code' },
  { item_key: 'hosting_mfa', title: 'Cloud hosting (Vercel/AWS/Supabase) accounts have MFA enabled', category: 'Infrastructure' },
  { item_key: 'password_mgr', title: 'Dedicated password manager (1Password/Bitwarden) in active use', category: 'Credentials' },
  { item_key: 'backup_system', title: 'Automated database and site backup routines configured', category: 'Resilience' },
  { item_key: 'backup_restore_tested', title: 'Backup restoration successfully verified & tested', category: 'Resilience' },
  { item_key: 'api_secrets_protected', title: 'API keys & secrets never committed to repository or client code', category: 'Secrets' },
  { item_key: 'env_vars_secured', title: 'Production environment variables secured with restricted access', category: 'Secrets' },
  { item_key: 'prod_access_reviewed', title: 'Production database and server access reviewed', category: 'Access Control' },
  { item_key: 'freelancer_access_reviewed', title: 'Contractor & freelancer permissions scoped with least privilege', category: 'Access Control' },
  { item_key: 'old_accounts_removed', title: 'Decommissioned team members & legacy vendor accounts removed', category: 'Access Control' },
  { item_key: 'domain_autorenew', title: 'Domain auto-renewal & DNSSEC confirmed active', category: 'Infrastructure' },
  { item_key: 'ssl_https_checked', title: 'SSL/TLS certificates configured with HSTS enforcement', category: 'Infrastructure' },
];

export async function initFounderOSDb() {
  if (initialized) return;

  const p = getPool();
  const client = await p.connect();

  try {
    await client.query('BEGIN');

    // 1. Settings Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS founder_os_settings (
        key VARCHAR(100) PRIMARY KEY,
        value TEXT NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);

    // 2. Leads Table (Dedicated Founder OS Leads CRM)
    await client.query(`
      CREATE TABLE IF NOT EXISTS founder_os_leads (
        id SERIAL PRIMARY KEY,
        lead_id VARCHAR(50) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        company VARCHAR(255),
        phone VARCHAR(50),
        email VARCHAR(255),
        source VARCHAR(100) DEFAULT 'Website',
        industry VARCHAR(100),
        status VARCHAR(50) DEFAULT 'New',
        estimated_value NUMERIC(12, 2) DEFAULT 0,
        notes TEXT,
        next_followup DATE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);

    // 3. Sales Calls Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS founder_os_calls (
        id SERIAL PRIMARY KEY,
        lead_id INTEGER REFERENCES founder_os_leads(id) ON DELETE SET NULL,
        lead_name VARCHAR(255) NOT NULL,
        call_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        call_type VARCHAR(50) NOT NULL DEFAULT 'Discovery',
        outcome VARCHAR(100) NOT NULL DEFAULT 'Connected',
        notes TEXT,
        next_action VARCHAR(255),
        next_action_date DATE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);

    // 4. Proposals Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS founder_os_proposals (
        id SERIAL PRIMARY KEY,
        client_name VARCHAR(255) NOT NULL,
        lead_id INTEGER REFERENCES founder_os_leads(id) ON DELETE SET NULL,
        project_title VARCHAR(255) NOT NULL,
        proposal_value NUMERIC(12, 2) NOT NULL DEFAULT 0,
        status VARCHAR(50) NOT NULL DEFAULT 'Draft',
        sent_date DATE,
        followup_date DATE,
        scope_summary TEXT,
        notes TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);

    // 5. Projects Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS founder_os_projects (
        id SERIAL PRIMARY KEY,
        project_name VARCHAR(255) NOT NULL,
        client_name VARCHAR(255) NOT NULL,
        project_value NUMERIC(12, 2) NOT NULL DEFAULT 0,
        start_date DATE,
        deadline DATE,
        status VARCHAR(50) NOT NULL DEFAULT 'Planning',
        priority VARCHAR(50) NOT NULL DEFAULT 'Medium',
        assigned_person VARCHAR(255),
        notes TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);

    // 6. Project Tasks Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS founder_os_tasks (
        id SERIAL PRIMARY KEY,
        project_id INTEGER REFERENCES founder_os_projects(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        assigned_to VARCHAR(255),
        priority VARCHAR(50) NOT NULL DEFAULT 'Medium',
        status VARCHAR(50) NOT NULL DEFAULT 'Todo',
        deadline DATE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);

    // 7. Project Client Feedback Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS founder_os_feedback (
        id SERIAL PRIMARY KEY,
        project_id INTEGER REFERENCES founder_os_projects(id) ON DELETE CASCADE,
        feedback_date DATE DEFAULT CURRENT_DATE,
        author VARCHAR(255) NOT NULL,
        feedback_text TEXT NOT NULL,
        status VARCHAR(50) NOT NULL DEFAULT 'Open',
        action_plan TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);

    // 8. Project QA Checklist Items Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS founder_os_qa_checklist (
        id SERIAL PRIMARY KEY,
        project_id INTEGER REFERENCES founder_os_projects(id) ON DELETE CASCADE,
        item_key VARCHAR(100) NOT NULL,
        item_label VARCHAR(255) NOT NULL,
        is_checked BOOLEAN NOT NULL DEFAULT FALSE,
        notes TEXT,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);

    // 9. Standard Operating Procedures (SOPs) Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS founder_os_sops (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        category VARCHAR(100) NOT NULL,
        description TEXT,
        steps_json JSONB DEFAULT '[]'::jsonb,
        owner VARCHAR(255) NOT NULL DEFAULT 'Founder',
        version VARCHAR(50) NOT NULL DEFAULT '1.0',
        last_updated DATE DEFAULT CURRENT_DATE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);

    // 10. Revenue Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS founder_os_revenue (
        id SERIAL PRIMARY KEY,
        client_name VARCHAR(255) NOT NULL,
        project_id INTEGER REFERENCES founder_os_projects(id) ON DELETE SET NULL,
        project_name VARCHAR(255),
        amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
        payment_date DATE NOT NULL,
        payment_status VARCHAR(50) NOT NULL DEFAULT 'Paid',
        payment_method VARCHAR(100) NOT NULL DEFAULT 'Bank Transfer',
        invoice_number VARCHAR(100),
        notes TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);

    // 11. Expenses Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS founder_os_expenses (
        id SERIAL PRIMARY KEY,
        category VARCHAR(100) NOT NULL,
        description VARCHAR(255) NOT NULL,
        amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
        expense_date DATE NOT NULL,
        payment_method VARCHAR(100) NOT NULL DEFAULT 'UPI',
        is_recurring BOOLEAN NOT NULL DEFAULT FALSE,
        recurring_frequency VARCHAR(50),
        project_id INTEGER REFERENCES founder_os_projects(id) ON DELETE SET NULL,
        notes TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);

    // 12. People Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS founder_os_people (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        role VARCHAR(100) NOT NULL,
        email VARCHAR(255),
        phone VARCHAR(50),
        joining_date DATE,
        employment_type VARCHAR(50) NOT NULL DEFAULT 'Employee',
        responsibilities_json JSONB DEFAULT '[]'::jsonb,
        status VARCHAR(50) NOT NULL DEFAULT 'Active',
        notes TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);

    // 13. Security Accounts Table (NO Passwords!)
    await client.query(`
      CREATE TABLE IF NOT EXISTS founder_os_security_accounts (
        id SERIAL PRIMARY KEY,
        service_name VARCHAR(255) NOT NULL,
        category VARCHAR(100) NOT NULL,
        owner VARCHAR(255) NOT NULL,
        security_status VARCHAR(50) NOT NULL DEFAULT 'Secured',
        mfa_enabled BOOLEAN NOT NULL DEFAULT FALSE,
        recovery_configured BOOLEAN NOT NULL DEFAULT FALSE,
        last_reviewed DATE,
        url_reference VARCHAR(500),
        notes TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);

    // 14. Security Checklist Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS founder_os_security_checklist (
        id SERIAL PRIMARY KEY,
        item_key VARCHAR(100) UNIQUE NOT NULL,
        title VARCHAR(255) NOT NULL,
        category VARCHAR(100) NOT NULL,
        status VARCHAR(50) NOT NULL DEFAULT 'Not Checked',
        last_verified DATE,
        notes TEXT,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);

    // 15. Secret References Table (Zero secret values!)
    await client.query(`
      CREATE TABLE IF NOT EXISTS founder_os_secret_references (
        id SERIAL PRIMARY KEY,
        secret_name VARCHAR(255) NOT NULL,
        purpose VARCHAR(255) NOT NULL,
        stored_in VARCHAR(255) NOT NULL DEFAULT 'Password Manager',
        environment VARCHAR(100) NOT NULL DEFAULT 'Production',
        last_rotated DATE,
        notes TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);

    // 16. Activity / Audit Logs Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS founder_os_activity_logs (
        id SERIAL PRIMARY KEY,
        user_name VARCHAR(255) NOT NULL DEFAULT 'Founder',
        entity_type VARCHAR(100) NOT NULL,
        entity_id INTEGER,
        action VARCHAR(100) NOT NULL,
        details TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);

    // 17. Backups Metadata Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS founder_os_backups (
        id SERIAL PRIMARY KEY,
        filename VARCHAR(255) NOT NULL,
        backup_type VARCHAR(50) NOT NULL DEFAULT 'Manual',
        record_count INTEGER NOT NULL DEFAULT 0,
        size_bytes INTEGER NOT NULL DEFAULT 0,
        notes TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);

    // Initialize Default Settings if empty
    const settingsCheck = await client.query('SELECT COUNT(*) as count FROM founder_os_settings');
    if (parseInt(settingsCheck.rows[0].count) === 0) {
      await client.query(`
        INSERT INTO founder_os_settings (key, value) VALUES 
        ('business_name', 'InfronixWeb'),
        ('currency_symbol', '₹'),
        ('currency_code', 'INR'),
        ('timezone', 'Asia/Kolkata'),
        ('last_backup_date', 'Never')
        ON CONFLICT (key) DO NOTHING
      `);
    }

    // Initialize 14 Security Checklist System Templates (All set to 'Not Checked')
    for (const t of INITIAL_SECURITY_CHECKLIST_TEMPLATES) {
      await client.query(`
        INSERT INTO founder_os_security_checklist (item_key, title, category, status)
        VALUES ($1, $2, $3, 'Not Checked')
        ON CONFLICT (item_key) DO UPDATE
        SET title = EXCLUDED.title, category = EXCLUDED.category
        WHERE founder_os_security_checklist.title != EXCLUDED.title
      `, [t.item_key, t.title, t.category]);
    }

    await client.query('COMMIT');
    initialized = true;
    console.log('✅ InfronixWeb Founder OS Database initialized successfully in Supabase PostgreSQL.');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('⚠️ Founder OS Database initialization error:', err.message);
    throw err;
  } finally {
    client.release();
  }
}

// 11 Standard QA Checklist Templates for Projects
export const DEFAULT_QA_CHECKLIST_TEMPLATES = [
  { item_key: 'responsive_design', item_label: 'Responsive design & mobile layout verified' },
  { item_key: 'mobile_testing', item_label: 'Tested on actual iOS & Android physical devices' },
  { item_key: 'forms_tested', item_label: 'All contact forms, validation & lead notifications tested' },
  { item_key: 'links_tested', item_label: 'Internal & external links verified (0 broken 404 links)' },
  { item_key: 'images_optimized', item_label: 'Images compressed, WebP converted & dimensions specified' },
  { item_key: 'seo_basics', item_label: 'Page title tags, meta descriptions & H1 hierarchy verified' },
  { item_key: 'metadata_checked', item_label: 'OpenGraph, Twitter cards & favicon icons verified' },
  { item_key: 'performance_checked', item_label: 'Google Lighthouse score > 90 & Core Web Vitals passed' },
  { item_key: 'accessibility_checked', item_label: 'WCAG color contrast & ARIA accessibility verified' },
  { item_key: 'browser_testing', item_label: 'Cross-browser compatibility verified (Chrome, Safari, Firefox, Edge)' },
  { item_key: 'client_approval', item_label: 'Final client walkthrough & sign-off approval received' },
];
