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

    // Migration: add client_id to calls if table was created before this column existed
    await client.query(`
      ALTER TABLE founder_os_calls
      ADD COLUMN IF NOT EXISTS client_id INTEGER REFERENCES founder_os_clients(id) ON DELETE SET NULL;
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
        public_slug VARCHAR(255) UNIQUE,
        public_bio TEXT,
        profile_image_url VARCHAR(1000),
        show_on_website BOOLEAN DEFAULT FALSE,
        show_on_homepage BOOLEAN DEFAULT FALSE,
        show_on_about_page BOOLEAN DEFAULT FALSE,
        display_order INTEGER DEFAULT 0,
        public_role VARCHAR(255),
        linkedin_url VARCHAR(500),
        github_url VARCHAR(500),
        portfolio_url VARCHAR(500),
        instagram_url VARCHAR(500),
        is_founder BOOLEAN DEFAULT FALSE,
        is_archived BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);

    // Migration for People Website Profile columns
    await client.query(`
      ALTER TABLE founder_os_people
      ADD COLUMN IF NOT EXISTS public_slug VARCHAR(255),
      ADD COLUMN IF NOT EXISTS public_bio TEXT,
      ADD COLUMN IF NOT EXISTS profile_image_url VARCHAR(1000),
      ADD COLUMN IF NOT EXISTS show_on_website BOOLEAN DEFAULT FALSE,
      ADD COLUMN IF NOT EXISTS show_on_homepage BOOLEAN DEFAULT FALSE,
      ADD COLUMN IF NOT EXISTS show_on_about_page BOOLEAN DEFAULT FALSE,
      ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0,
      ADD COLUMN IF NOT EXISTS public_role VARCHAR(255),
      ADD COLUMN IF NOT EXISTS linkedin_url VARCHAR(500),
      ADD COLUMN IF NOT EXISTS github_url VARCHAR(500),
      ADD COLUMN IF NOT EXISTS portfolio_url VARCHAR(500),
      ADD COLUMN IF NOT EXISTS instagram_url VARCHAR(500),
      ADD COLUMN IF NOT EXISTS is_founder BOOLEAN DEFAULT FALSE,
      ADD COLUMN IF NOT EXISTS is_archived BOOLEAN DEFAULT FALSE;
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_founder_os_people_website ON founder_os_people(show_on_website, status, display_order);
      CREATE INDEX IF NOT EXISTS idx_founder_os_people_slug ON founder_os_people(public_slug);
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

    // 24. Website Enquiries Table (Central submission tracking)
    await client.query(`
      CREATE TABLE IF NOT EXISTS founder_os_enquiries (
        id SERIAL PRIMARY KEY,
        reference_id VARCHAR(50) UNIQUE NOT NULL,
        form_type VARCHAR(100) NOT NULL DEFAULT 'Contact Form',
        full_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(50),
        company VARCHAR(255),
        selected_service VARCHAR(255),
        project_type VARCHAR(100),
        budget VARCHAR(100),
        preferred_start_date VARCHAR(100),
        project_description TEXT,
        message TEXT,
        preferred_contact_method VARCHAR(50) DEFAULT 'Email',
        source_page VARCHAR(255),
        lead_source VARCHAR(100) DEFAULT 'Website',
        utm_source VARCHAR(100),
        utm_medium VARCHAR(100),
        utm_campaign VARCHAR(100),
        status VARCHAR(50) DEFAULT 'New',
        lead_id INTEGER REFERENCES founder_os_leads(id) ON DELETE SET NULL,
        client_id INTEGER REFERENCES founder_os_clients(id) ON DELETE SET NULL,
        project_id INTEGER REFERENCES founder_os_projects(id) ON DELETE SET NULL,
        customer_email_status VARCHAR(50) DEFAULT 'Pending',
        customer_email_message_id VARCHAR(255),
        admin_email_status VARCHAR(50) DEFAULT 'Pending',
        admin_email_message_id VARCHAR(255),
        email_attempt_count INTEGER DEFAULT 0,
        last_email_error TEXT,
        idempotency_key VARCHAR(100) UNIQUE,
        submitted_ip_hash VARCHAR(100),
        verification_token_hash VARCHAR(255),
        verification_expires_at TIMESTAMP WITH TIME ZONE,
        verification_attempts INTEGER DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);

    // Add new columns if the table already existed
    await client.query(`
      ALTER TABLE founder_os_enquiries
      ADD COLUMN IF NOT EXISTS verification_token_hash VARCHAR(255),
      ADD COLUMN IF NOT EXISTS verification_expires_at TIMESTAMP WITH TIME ZONE,
      ADD COLUMN IF NOT EXISTS verification_attempts INTEGER DEFAULT 0;
    `);

    // 25. Blog Categories Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS founder_os_blog_categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        description TEXT,
        display_order INTEGER DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);

    // 26. Blog Tags Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS founder_os_blog_tags (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);

    // 27. Blog Posts Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS founder_os_blogs (
        id SERIAL PRIMARY KEY,
        title VARCHAR(500) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        excerpt TEXT NOT NULL,
        content_markdown TEXT NOT NULL DEFAULT '',
        content_json JSONB DEFAULT '{}'::jsonb,
        cover_image_url VARCHAR(1000),
        cover_image_alt VARCHAR(500),
        author_person_id INTEGER REFERENCES founder_os_people(id) ON DELETE SET NULL,
        author_name VARCHAR(255) NOT NULL DEFAULT 'InfronixWeb Editorial Team',
        author_role VARCHAR(255) DEFAULT 'Digital Specialists',
        author_avatar_url VARCHAR(1000),
        category_id INTEGER REFERENCES founder_os_blog_categories(id) ON DELETE SET NULL,
        status VARCHAR(50) NOT NULL DEFAULT 'Draft',
        featured BOOLEAN NOT NULL DEFAULT FALSE,
        published_at TIMESTAMP WITH TIME ZONE,
        scheduled_for TIMESTAMP WITH TIME ZONE,
        reading_time_minutes INTEGER DEFAULT 1,
        seo_title VARCHAR(255),
        seo_description TEXT,
        canonical_url VARCHAR(1000),
        og_image_url VARCHAR(1000),
        previous_slugs_json JSONB DEFAULT '[]'::jsonb,
        created_by VARCHAR(255) DEFAULT 'Founder',
        updated_by VARCHAR(255) DEFAULT 'Founder',
        archived_at TIMESTAMP WITH TIME ZONE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);

    // 28. Blog Post Tags Mapping Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS founder_os_blog_posts_tags (
        post_id INTEGER REFERENCES founder_os_blogs(id) ON DELETE CASCADE,
        tag_id INTEGER REFERENCES founder_os_blog_tags(id) ON DELETE CASCADE,
        PRIMARY KEY (post_id, tag_id)
      )
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_founder_os_blogs_status_pub ON founder_os_blogs(status, published_at DESC);
      CREATE INDEX IF NOT EXISTS idx_founder_os_blogs_slug ON founder_os_blogs(slug);
      CREATE INDEX IF NOT EXISTS idx_founder_os_blogs_category ON founder_os_blogs(category_id);
      CREATE INDEX IF NOT EXISTS idx_founder_os_blog_cats_slug ON founder_os_blog_categories(slug);
      CREATE INDEX IF NOT EXISTS idx_founder_os_blog_tags_slug ON founder_os_blog_tags(slug);

      ALTER TABLE founder_os_blogs
      ALTER COLUMN cover_image_url TYPE TEXT,
      ALTER COLUMN og_image_url TYPE TEXT,
      ALTER COLUMN author_avatar_url TYPE TEXT;

      ALTER TABLE founder_os_people
      ALTER COLUMN profile_image_url TYPE TEXT;
    `);

    // Initialize Default Blog Categories if empty
    const categoriesCheck = await client.query('SELECT COUNT(*) as count FROM founder_os_blog_categories');
    if (parseInt(categoriesCheck.rows[0].count, 10) === 0) {
      await client.query(`
        INSERT INTO founder_os_blog_categories (name, slug, description, display_order) VALUES 
        ('Web Development', 'web-development', 'Modern web design, development architectures, frameworks, and digital performance.', 1),
        ('Local SEO', 'local-seo', 'Google Maps optimization, local search visibility, and localized growth strategies.', 2),
        ('AI Automation', 'ai-automation', 'AI chatbots, automated inquiry workflows, and business process automation.', 3),
        ('Digital Marketing', 'digital-marketing', 'Growth strategies, paid advertising, and high-converting funnel optimizations.', 4)
        ON CONFLICT (slug) DO NOTHING
      `);
    }

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

    // Seed Founder (Madhav Davda) if not already present
    const founderCheck = await client.query(`
      SELECT id, profile_image_url FROM founder_os_people 
      WHERE employment_type = 'Founder' OR is_founder = TRUE OR LOWER(name) LIKE '%madhav%'
      LIMIT 1
    `);

    if (founderCheck.rows.length === 0) {
      await client.query(`
        INSERT INTO founder_os_people (
          name, role, public_role, email, employment_type,
          status, show_on_website, show_on_homepage, show_on_about_page,
          display_order, is_founder, public_slug, public_bio,
          instagram_url, responsibilities_json, created_at, updated_at
        ) VALUES (
          'Madhav Davda',
          'Founder & Lead Engineer',
          'Founder & Lead Engineer',
          'support@infronixweb.in',
          'Founder',
          'Active',
          TRUE,
          TRUE,
          TRUE,
          0,
          TRUE,
          'madhav-davda',
          'Founder & Lead Engineer at InfronixWeb. Direct access, massive impact.',
          'https://www.instagram.com/madhavdavda09',
          '["Architecture", "Product Engineering", "Technical Strategy"]'::jsonb,
          NOW(),
          NOW()
        )
      `);
    } else {
      await client.query(`
        UPDATE founder_os_people
        SET is_founder = TRUE,
            employment_type = 'Founder',
            show_on_website = TRUE,
            show_on_homepage = TRUE,
            show_on_about_page = TRUE,
            display_order = 0,
            public_role = COALESCE(public_role, 'Founder & Lead Engineer'),
            public_slug = COALESCE(public_slug, 'madhav-davda'),
            public_bio = COALESCE(public_bio, 'Founder & Lead Engineer at InfronixWeb. Direct access, massive impact.'),
            instagram_url = COALESCE(instagram_url, 'https://www.instagram.com/madhavdavda09')
        WHERE id = $1
      `, [founderCheck.rows[0].id]);
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
