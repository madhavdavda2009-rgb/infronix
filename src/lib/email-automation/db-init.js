import { execute } from '../db.js';

let tablesInitialized = false;

export async function initEmailAutomationDb() {
  if (tablesInitialized) return;

  try {
    // 1. Ensure columns exist on leads table
    await execute(`
      ALTER TABLE leads 
      ADD COLUMN IF NOT EXISTS name TEXT,
      ADD COLUMN IF NOT EXISTS company_name TEXT,
      ADD COLUMN IF NOT EXISTS industry TEXT,
      ADD COLUMN IF NOT EXISTS location TEXT,
      ADD COLUMN IF NOT EXISTS company_description TEXT,
      ADD COLUMN IF NOT EXISTS personalization_context TEXT,
      ADD COLUMN IF NOT EXISTS lead_source TEXT;
    `);

    // Backfill legacy fields if empty
    await execute(`
      UPDATE leads 
      SET company_name = business_name 
      WHERE company_name IS NULL AND business_name IS NOT NULL;
    `);

    await execute(`
      UPDATE leads 
      SET industry = category 
      WHERE industry IS NULL AND category IS NOT NULL;
    `);

    await execute(`
      UPDATE leads 
      SET location = CONCAT_WS(', ', NULLIF(area, ''), NULLIF(city, '')) 
      WHERE location IS NULL AND (city IS NOT NULL OR area IS NOT NULL);
    `);

    await execute(`
      UPDATE leads 
      SET lead_source = source 
      WHERE lead_source IS NULL AND source IS NOT NULL;
    `);

    // 2. Create email_drafts table
    await execute(`
      CREATE TABLE IF NOT EXISTS email_drafts (
        id SERIAL PRIMARY KEY,
        lead_id INTEGER REFERENCES leads(id) ON DELETE CASCADE,
        subject TEXT NOT NULL,
        body TEXT NOT NULL,
        target_service VARCHAR(100) DEFAULT 'General',
        observation TEXT,
        status VARCHAR(50) DEFAULT 'Draft',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 3. Create sent_emails table
    await execute(`
      CREATE TABLE IF NOT EXISTS sent_emails (
        id SERIAL PRIMARY KEY,
        lead_id INTEGER REFERENCES leads(id) ON DELETE SET NULL,
        recipient TEXT NOT NULL,
        subject TEXT NOT NULL,
        body TEXT NOT NULL,
        status VARCHAR(50) DEFAULT 'Sent',
        message_id TEXT,
        error_message TEXT,
        sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 4. Create index on foreign keys & status
    await execute(`
      CREATE INDEX IF NOT EXISTS idx_email_drafts_lead_id ON email_drafts(lead_id);
      CREATE INDEX IF NOT EXISTS idx_sent_emails_lead_id ON sent_emails(lead_id);
      CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
    `);

    tablesInitialized = true;
    console.log('✅ Email automation database tables initialized successfully.');
  } catch (err) {
    console.error('⚠️ Failed to initialize email automation tables:', err.message);
  }
}
