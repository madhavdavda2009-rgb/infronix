import mysql from 'mysql2/promise';
import Database from 'better-sqlite3';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mysqlPool = null;
let sqliteDb = null;
let useSqlite = false;

// Initialize Database connection
export async function initDb() {
  try {
    // Attempt MySQL connection
    mysqlPool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'infronix_db',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });

    // Test MySQL connection
    const connection = await mysqlPool.getConnection();
    console.log('✅ Connected to MySQL Database:', process.env.DB_NAME || 'infronix_db');
    connection.release();

    // Create MySQL Tables if not exists
    await mysqlPool.execute(`
      CREATE TABLE IF NOT EXISTS consultations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        email TEXT NOT NULL,
        company TEXT,
        project_details TEXT NOT NULL,
        status VARCHAR(50) DEFAULT 'Pending',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    await mysqlPool.execute(`
      CREATE TABLE IF NOT EXISTS admins (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(100) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

  } catch (mysqlErr) {
    console.warn('⚠️ MySQL connection failed:', mysqlErr.message);
    console.log('🔄 Falling back to embedded SQLite database for zero-downtime execution...');
    useSqlite = true;

    const dbPath = path.join(__dirname, '../../infronix_data.sqlite');
    sqliteDb = new Database(dbPath);

    sqliteDb.exec(`
      CREATE TABLE IF NOT EXISTS consultations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        email TEXT NOT NULL,
        company TEXT,
        project_details TEXT NOT NULL,
        status TEXT DEFAULT 'Pending',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS admins (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('✅ SQLite Database ready at:', dbPath);
  }
}

// Unified query wrapper supporting both MySQL and SQLite
export async function execute(sql, params = []) {
  if (useSqlite) {
    // Convert MySQL placeholder syntax if needed
    const stmt = sqliteDb.prepare(sql);
    if (sql.trim().toUpperCase().startsWith('SELECT')) {
      const rows = stmt.all(...params);
      return [rows];
    } else {
      const result = stmt.run(...params);
      return [{ insertId: result.lastInsertRowid, affectedRows: result.changes }];
    }
  } else {
    return await mysqlPool.execute(sql, params);
  }
}

export function isUsingSqlite() {
  return useSqlite;
}
