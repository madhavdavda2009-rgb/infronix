import { execute } from './src/lib/db.js';
import dotenv from 'dotenv';
dotenv.config();

async function run() {
  try {
    console.log("Running migration...");
    await execute(`
      ALTER TABLE consultations 
      ADD COLUMN IF NOT EXISTS service VARCHAR(150) DEFAULT NULL,
      ADD COLUMN IF NOT EXISTS package VARCHAR(150) DEFAULT NULL,
      ADD COLUMN IF NOT EXISTS package_price VARCHAR(100) DEFAULT NULL;
    `);
    console.log("Migration applied successfully!");
    process.exit(0);
  } catch(e) {
    console.error("Migration failed:", e);
    process.exit(1);
  }
}
run();
