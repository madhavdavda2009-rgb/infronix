import dotenv from 'dotenv';
dotenv.config();

import { query, initFounderOSDb } from '../../src/lib/founder_os_db.js';
import { webDevelopmentSOPs } from './web_dev_sops.js';
import { seoSOPs } from './seo_sops.js';
import { digitalMarketingSOPs } from './digital_marketing_sops.js';
import { socialMediaSOPs } from './social_media_sops.js';
import { googleAdsSOPs } from './google_ads_sops.js';
import { metaAdsSOPs } from './meta_ads_sops.js';
import { performanceMarketingSOPs } from './performance_marketing_sops.js';
import { aiAutomationSOPs } from './ai_automation_sops.js';
import { aiChatbotSOPs } from './ai_chatbot_sops.js';
import { whatsAppAutomationSOPs } from './whatsapp_automation_sops.js';
import { crmAutomationSOPs } from './crm_automation_sops.js';
import { agencySharedSOPs } from './agency_shared_sops.js';

const ALLOWED_CATEGORIES = new Set([
  'Sales',
  'Client Onboarding',
  'Design',
  'Development',
  'QA',
  'Deployment',
  'Finance',
  'Security',
  'Offboarding'
]);

async function runSOPSeed() {
  console.log('🚀 Starting InfronixWeb Complete SOP Library Seeder...\n');

  try {
    await initFounderOSDb();

    const allSOPs = [
      ...webDevelopmentSOPs,
      ...seoSOPs,
      ...digitalMarketingSOPs,
      ...socialMediaSOPs,
      ...googleAdsSOPs,
      ...metaAdsSOPs,
      ...performanceMarketingSOPs,
      ...aiAutomationSOPs,
      ...aiChatbotSOPs,
      ...whatsAppAutomationSOPs,
      ...crmAutomationSOPs,
      ...agencySharedSOPs
    ];

    console.log(`📦 Loaded ${allSOPs.length} total standard operating procedures across all services.`);

    // 1. Validate categories and data integrity before database operations
    const nameSet = new Set();
    for (const sop of allSOPs) {
      if (!ALLOWED_CATEGORIES.has(sop.category)) {
        throw new Error(`Invalid category "${sop.category}" in SOP "${sop.name}". Must be one of allowed 9 categories.`);
      }
      if (nameSet.has(sop.name)) {
        throw new Error(`Duplicate SOP name detected in source definitions: "${sop.name}"`);
      }
      nameSet.add(sop.name);

      if (!sop.steps_json || sop.steps_json.length === 0) {
        throw new Error(`SOP "${sop.name}" has no execution steps.`);
      }

      for (const step of sop.steps_json) {
        if (!step.title || !step.details) {
          throw new Error(`Malformed step in SOP "${sop.name}": step title or details missing.`);
        }
      }
    }

    console.log('✅ Pre-validation passed: 100% of SOPs conform to strict category & schema constraints.\n');

    let insertedCount = 0;
    let updatedCount = 0;

    for (const sop of allSOPs) {
      const existing = await query('SELECT id FROM founder_os_sops WHERE name = $1', [sop.name]);

      const stepsJsonString = JSON.stringify(sop.steps_json);

      if (existing.rows.length > 0) {
        const id = existing.rows[0].id;
        await query(`
          UPDATE founder_os_sops
          SET
            category = $1,
            description = $2,
            steps_json = $3,
            owner = $4,
            version = $5,
            last_updated = CURRENT_DATE
          WHERE id = $6
        `, [
          sop.category,
          sop.description,
          stepsJsonString,
          sop.owner || 'Founder',
          sop.version || '1.0',
          id
        ]);
        updatedCount++;
      } else {
        await query(`
          INSERT INTO founder_os_sops
            (name, category, description, steps_json, owner, version, last_updated, created_at)
          VALUES ($1, $2, $3, $4, $5, $6, CURRENT_DATE, NOW())
        `, [
          sop.name,
          sop.category,
          sop.description,
          stepsJsonString,
          sop.owner || 'Founder',
          sop.version || '1.0'
        ]);
        insertedCount++;
      }
    }

    console.log(`\n🎉 SOP Seeding Completed Successfully!`);
    console.log(`   - Newly Inserted: ${insertedCount}`);
    console.log(`   - Updated Existing: ${updatedCount}`);
    console.log(`   - Total Processed: ${allSOPs.length}`);

    // Verification queries
    const countRes = await query('SELECT COUNT(*) as count FROM founder_os_sops');
    console.log(`\n📊 Live Database Count: ${countRes.rows[0].count} SOPs in founder_os_sops table.`);

    const catDistribution = await query(`
      SELECT category, COUNT(*) as count 
      FROM founder_os_sops 
      GROUP BY category 
      ORDER BY count DESC
    `);
    console.log('\n📁 Category Breakdown:');
    catDistribution.rows.forEach(r => {
      console.log(`   - ${r.category.padEnd(20)}: ${r.count} SOPs`);
    });

    const ownerDistribution = await query(`
      SELECT owner, COUNT(*) as count 
      FROM founder_os_sops 
      GROUP BY owner 
      ORDER BY count DESC
    `);
    console.log('\n👤 Document Owner Breakdown:');
    ownerDistribution.rows.forEach(r => {
      console.log(`   - ${r.owner.padEnd(25)}: ${r.count} SOPs`);
    });

    process.exit(0);
  } catch (err) {
    console.error('❌ Seeder Error:', err);
    process.exit(1);
  }
}

runSOPSeed();
