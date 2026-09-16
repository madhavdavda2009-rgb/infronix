import pg from 'pg';
const { Pool } = pg;
// DATE columns represent calendar dates, not local-time instants.
pg.types.setTypeParser(1082, value => value);

let pool = null;
let initialized = false;
let initialization = null;

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
  if (!initialization) {
    initialization = initializeSchema().finally(() => { initialization = null; });
  }
  return initialization;
}

async function initializeSchema() {

  const p = getPool();
  const client = await p.connect();

  try {
    await client.query('BEGIN');
    // Serialize schema upgrades across route bundles and server processes.
    await client.query('SELECT pg_advisory_xact_lock(73481026)');

    // 1. Settings Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS founder_os_settings (
        key VARCHAR(100) PRIMARY KEY,
        value TEXT NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);

    // 2. Clients Table (Central relational client entity)
    await client.query(`
      CREATE TABLE IF NOT EXISTS founder_os_clients (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        company VARCHAR(255),
        phone VARCHAR(50),
        email VARCHAR(255),
        industry VARCHAR(100),
        notes TEXT,
        lead_id INTEGER,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);

    // 3. Leads Table (Dedicated Founder OS Leads CRM)
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
        client_id INTEGER REFERENCES founder_os_clients(id) ON DELETE SET NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);

    // 4. Sales Calls Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS founder_os_calls (
        id SERIAL PRIMARY KEY,
        lead_id INTEGER REFERENCES founder_os_leads(id) ON DELETE SET NULL,
        client_id INTEGER REFERENCES founder_os_clients(id) ON DELETE SET NULL,
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

    // 5. Proposals Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS founder_os_proposals (
        id SERIAL PRIMARY KEY,
        client_name VARCHAR(255) NOT NULL,
        client_id INTEGER REFERENCES founder_os_clients(id) ON DELETE SET NULL,
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

    // 6. Projects Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS founder_os_projects (
        id SERIAL PRIMARY KEY,
        project_name VARCHAR(255) NOT NULL,
        client_name VARCHAR(255) NOT NULL,
        client_id INTEGER REFERENCES founder_os_clients(id) ON DELETE SET NULL,
        lead_id INTEGER REFERENCES founder_os_leads(id) ON DELETE SET NULL,
        proposal_id INTEGER REFERENCES founder_os_proposals(id) ON DELETE SET NULL,
        project_type VARCHAR(100) DEFAULT 'Business Website',
        project_value NUMERIC(12, 2) NOT NULL DEFAULT 0,
        payment_structure VARCHAR(50) DEFAULT 'Full Payment',
        advance_amount NUMERIC(12, 2) DEFAULT 0,
        final_amount NUMERIC(12, 2) DEFAULT 0,
        start_date DATE,
        deadline DATE,
        status VARCHAR(50) NOT NULL DEFAULT 'Planning',
        priority VARCHAR(50) NOT NULL DEFAULT 'Medium',
        assigned_person VARCHAR(255),
        domain_manager VARCHAR(50) DEFAULT 'Not decided',
        hosting_manager VARCHAR(50) DEFAULT 'Not decided',
        hosting_provider VARCHAR(100),
        hosting_renewal_date DATE,
        hosting_cost NUMERIC(12, 2) DEFAULT 0,
        hosting_billing VARCHAR(100),
        setup_completed BOOLEAN DEFAULT FALSE,
        notes TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);

    // Add columns if table already existed without new schema columns
    await client.query(`
      ALTER TABLE founder_os_projects
      ADD COLUMN IF NOT EXISTS client_id INTEGER REFERENCES founder_os_clients(id) ON DELETE SET NULL,
      ADD COLUMN IF NOT EXISTS lead_id INTEGER REFERENCES founder_os_leads(id) ON DELETE SET NULL,
      ADD COLUMN IF NOT EXISTS proposal_id INTEGER REFERENCES founder_os_proposals(id) ON DELETE SET NULL,
      ADD COLUMN IF NOT EXISTS project_type VARCHAR(100) DEFAULT 'Business Website',
      ADD COLUMN IF NOT EXISTS payment_structure VARCHAR(50) DEFAULT 'Full Payment',
      ADD COLUMN IF NOT EXISTS advance_amount NUMERIC(12, 2) DEFAULT 0,
      ADD COLUMN IF NOT EXISTS final_amount NUMERIC(12, 2) DEFAULT 0,
      ADD COLUMN IF NOT EXISTS domain_manager VARCHAR(50) DEFAULT 'Not decided',
      ADD COLUMN IF NOT EXISTS hosting_manager VARCHAR(50) DEFAULT 'Not decided',
      ADD COLUMN IF NOT EXISTS hosting_provider VARCHAR(100),
      ADD COLUMN IF NOT EXISTS hosting_renewal_date DATE,
      ADD COLUMN IF NOT EXISTS hosting_cost NUMERIC(12, 2) DEFAULT 0,
      ADD COLUMN IF NOT EXISTS hosting_billing VARCHAR(100),
      ADD COLUMN IF NOT EXISTS setup_completed BOOLEAN DEFAULT FALSE;
    `);

    await client.query(`
      ALTER TABLE founder_os_leads
      ADD COLUMN IF NOT EXISTS client_id INTEGER REFERENCES founder_os_clients(id) ON DELETE SET NULL;
    `);

    await client.query(`
      ALTER TABLE founder_os_proposals
      ADD COLUMN IF NOT EXISTS client_id INTEGER REFERENCES founder_os_clients(id) ON DELETE SET NULL;
    `);

    // 7. Project Stages Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS founder_os_project_stages (
        id SERIAL PRIMARY KEY,
        project_id INTEGER REFERENCES founder_os_projects(id) ON DELETE CASCADE,
        stage_name VARCHAR(100) NOT NULL,
        stage_order INTEGER DEFAULT 1,
        status VARCHAR(50) NOT NULL DEFAULT 'Pending',
        completed_at TIMESTAMP WITH TIME ZONE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);

    // 8. Project Tasks Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS founder_os_tasks (
        id SERIAL PRIMARY KEY,
        project_id INTEGER REFERENCES founder_os_projects(id) ON DELETE CASCADE,
        stage_id INTEGER REFERENCES founder_os_project_stages(id) ON DELETE SET NULL,
        stage_name VARCHAR(100),
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

    await client.query(`
      ALTER TABLE founder_os_tasks
      ADD COLUMN IF NOT EXISTS stage_id INTEGER REFERENCES founder_os_project_stages(id) ON DELETE SET NULL,
      ADD COLUMN IF NOT EXISTS stage_name VARCHAR(100);
    `);

    // 9. Payment Schedules / Milestones Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS founder_os_payment_schedules (
        id SERIAL PRIMARY KEY,
        project_id INTEGER REFERENCES founder_os_projects(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
        due_date DATE,
        status VARCHAR(50) NOT NULL DEFAULT 'Pending',
        paid_date DATE,
        revenue_id INTEGER,
        notes TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);

    // 10. Planned / Expected Project Costs Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS founder_os_planned_costs (
        id SERIAL PRIMARY KEY,
        project_id INTEGER REFERENCES founder_os_projects(id) ON DELETE CASCADE,
        cost_type VARCHAR(100) NOT NULL,
        description VARCHAR(255) NOT NULL,
        expected_amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
        status VARCHAR(50) NOT NULL DEFAULT 'Planned',
        converted_expense_id INTEGER,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);

    // 11. Client Requirements Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS founder_os_client_requirements (
        id SERIAL PRIMARY KEY,
        project_id INTEGER REFERENCES founder_os_projects(id) ON DELETE CASCADE,
        item_name VARCHAR(255) NOT NULL,
        status VARCHAR(50) NOT NULL DEFAULT 'Pending',
        notes TEXT,
        received_date DATE,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);

    // 18. People Table
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

    await client.query(`ALTER TABLE founder_os_client_requirements ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW()`);

    // 12. Project Team Assignments Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS founder_os_project_team (
        id SERIAL PRIMARY KEY,
        project_id INTEGER REFERENCES founder_os_projects(id) ON DELETE CASCADE,
        person_id INTEGER REFERENCES founder_os_people(id) ON DELETE SET NULL,
        person_name VARCHAR(255) NOT NULL,
        role VARCHAR(100) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);

    // 13. Project Client Feedback Table
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

    // 14. Project QA Checklist Items Table
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

    // 15. Standard Operating Procedures (SOPs) Table
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

    // 16. Revenue Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS founder_os_revenue (
        id SERIAL PRIMARY KEY,
        client_name VARCHAR(255) NOT NULL,
        client_id INTEGER REFERENCES founder_os_clients(id) ON DELETE SET NULL,
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

    await client.query(`
      ALTER TABLE founder_os_revenue
      ADD COLUMN IF NOT EXISTS client_id INTEGER REFERENCES founder_os_clients(id) ON DELETE SET NULL;
    `);

    // 17. Expenses Table
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

    // 19. Security Accounts Table (NO Passwords!)
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

    // 20. Security Checklist Table
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

    // 21. Secret References Table (Zero secret values!)
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

    // 22. Activity / Audit Logs Table
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

    // 23. Backups Metadata Table
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
    if (parseInt(settingsCheck.rows[0].count, 10) === 0) {
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

    // Initialize 14 Security Checklist System Templates
    for (const t of INITIAL_SECURITY_CHECKLIST_TEMPLATES) {
      await client.query(`
        INSERT INTO founder_os_security_checklist (item_key, title, category, status)
        VALUES ($1, $2, $3, 'Not Checked')
        ON CONFLICT (item_key) DO UPDATE
        SET title = EXCLUDED.title, category = EXCLUDED.category
        WHERE founder_os_security_checklist.title != EXCLUDED.title
      `, [t.item_key, t.title, t.category]);
    }

    // Seed distinct clients from existing projects or leads if not present
    const existingProjects = await client.query(`
      SELECT DISTINCT client_name FROM founder_os_projects WHERE client_id IS NULL AND client_name IS NOT NULL AND client_name != ''
    `);
    for (const row of existingProjects.rows) {
      const matches = await client.query('SELECT id FROM founder_os_clients WHERE name = $1', [row.client_name]);
      if (matches.rows.length > 1) continue; // Owner must resolve ambiguous identities.
      const cRes = matches.rows.length ? matches : await client.query(`
        INSERT INTO founder_os_clients (name, created_at, updated_at)
        VALUES ($1, NOW(), NOW()) RETURNING id
      `, [row.client_name]);
      if (cRes.rows[0]) {
        await client.query(`
          UPDATE founder_os_projects SET client_id = $1 WHERE client_name = $2 AND client_id IS NULL
        `, [cRes.rows[0].id, row.client_name]);
        await client.query(`
          UPDATE founder_os_revenue SET client_id = $1 WHERE client_name = $2 AND client_id IS NULL
        `, [cRes.rows[0].id, row.client_name]);
      }
    }

    await client.query('COMMIT');
    initialized = true;
    console.log('✅ InfronixWeb Founder OS Database initialized successfully with interconnected relational schema.');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('⚠️ Founder OS Database initialization error:', err.message);
    throw err;
  } finally {
    client.release();
  }
}

export { PROJECT_TYPES, PAYMENT_METHODS, COST_TYPES, DEFAULT_STAGE_TEMPLATES, DEFAULT_STAGE_TASKS, DEFAULT_REQUIREMENT_TEMPLATES, DEFAULT_QA_CHECKLIST_TEMPLATES } from './founder_os_constants.js';
