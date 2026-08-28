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

  if (
    process.env.SUPABASE_DATABASE_URL.includes('db.vhmffcmpjwejhrmjehye') &&
    !process.env.SUPABASE_DATABASE_URL.includes('.supabase.co') &&
    !process.env.SUPABASE_DATABASE_URL.includes('pooler.supabase.com')
  ) {
    console.warn('⚠️ WARNING: SUPABASE_DATABASE_URL appears to have an incomplete hostname.');
    console.warn('⚠️ Ensure it ends with .supabase.co or use the connection pooler URL.');
  }

  try {
    pool = new Pool({
      connectionString: process.env.SUPABASE_DATABASE_URL,
      // Optimized for Serverless environments (like Vercel)
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
      ssl: {
        rejectUnauthorized: false
      }
    });

    // Test Postgres connection
    const client = await pool.connect();
    
    try {
      // Seed initial admin if empty
      const adminCheck = await client.query('SELECT COUNT(*) as count FROM admins');
      if (parseInt(adminCheck.rows[0].count) === 0) {
        const username = process.env.ADMIN_USERNAME || 'admin';
        const password = process.env.ADMIN_PASSWORD || 'password123';
        const bcrypt = (await import('bcryptjs')).default;
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        await client.query('INSERT INTO admins (username, password_hash) VALUES ($1, $2)', [username, hash]);
        console.log('✅ Seeded initial admin user.');
      }
    } catch (seedErr) {
      console.warn('⚠️ Could not seed admin (tables might not exist yet):', seedErr.message);
    }
    
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
