import { execute } from './src/lib/db.js';
import dotenv from 'dotenv';
dotenv.config();

async function run() {
  try {
    const result = await execute(`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_name = 'consultations'
    `);
    console.log(JSON.stringify(result, null, 2));
  } catch(e) {
    console.error(e);
  }
}
run();
