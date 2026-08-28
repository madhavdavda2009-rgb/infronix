import pg from 'pg';
const { Pool } = pg;

let pool = null;
let dbInitialized = false;

// Initialize Database connection
export async function initDb() {
  if (dbInitialized) return;

  if (!process.env.SUPABASE_DATABASE_URL) {
    console.warn('⚠️ Missing SUPABASE_DATABASE_URL for Supabase PostgreSQL');
    return;
  }

  try {
    pool = new Pool({
      connectionString: process.env.SUPABASE_DATABASE_URL,
      // For Supabase, connection pooling via Supavisor might require setting max connections
      max: 10,
    });

    // Test Postgres connection
    const client = await pool.connect();
    console.log('✅ Connected to Supabase PostgreSQL Database');
    client.release();

    dbInitialized = true;

  } catch (err) {
    console.error('⚠️ Supabase Postgres connection failed:', err.message);
  }
}

// Unified query wrapper supporting Postgres
export async function execute(sql, params = []) {
  if (!dbInitialized) await initDb();

  if (!pool) {
    throw new Error('Database is not connected');
  }

  // Convert MySQL placeholder syntax (?) to Postgres syntax ($1, $2, ...)
  let paramIndex = 1;
  const pgSql = sql.replace(/\?/g, () => `$${paramIndex++}`);

  try {
    const result = await pool.query(pgSql, params);
    
    if (pgSql.trim().toUpperCase().startsWith('SELECT')) {
      return [result.rows];
    } else {
      return [{ affectedRows: result.rowCount }];
    }
  } catch (err) {
    console.error('Database query error:', err.message);
    throw err;
  }
}

// Ensure isUsingSqlite is false for backwards compatibility with any remaining code
export function isUsingSqlite() {
  return false;
}
