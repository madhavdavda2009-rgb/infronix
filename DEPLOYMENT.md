# Vercel Deployment Guide

This project is configured as a full-stack Next.js 16 application using App Router Route Handlers, making it 100% compatible with Vercel's Serverless Functions. It uses Supabase PostgreSQL for its database.

## 1. Required Environment Variables
Add the following Environment Variables to your Vercel project settings:

### Database (Required for Production)
The application connects to a Supabase PostgreSQL database using the standard `pg` connection pool, making it optimized for serverless edge functions when using Supabase's Transaction Pooler (Supavisor).

- `SUPABASE_DATABASE_URL`: Your Supabase Transaction connection pool string. 
  - To find this, go to your Supabase Project -> Settings -> Database -> Connection Pooler.
  - Set the Connection Mode to **Transaction**.
  - Example: `postgresql://postgres.[ref]:[password]@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true`

### Security (Required)
- `ENCRYPTION_KEY`: A 64-character hex string used for AES-256-GCM encryption of client data. (e.g., `0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef`)
- `JWT_SECRET`: A strong secret key used for signing Admin session tokens.
- `ADMIN_USERNAME`: The initial admin username to seed if the `admins` table is empty.
- `ADMIN_PASSWORD`: The initial admin password to seed if the `admins` table is empty.

## 2. API Endpoints
All API endpoints are Next.js Route Handlers located under `/api/*`.
- `POST /api/consultations` (Public Form Submission)
- `POST /api/admin/login`
- `POST /api/admin/logout`
- `GET /api/admin/me`
- `POST /api/admin/change-password`
- `GET /api/admin/consultations`
- `PUT /api/admin/consultations/:id`
- `DELETE /api/admin/consultations/:id`
- `GET /api/health`

## 3. Database Setup Instructions
1. Create a free account at [Supabase (supabase.com)](https://supabase.com).
2. Create a new project.
3. Open the **SQL Editor** in your Supabase dashboard and run the following schema creation script:

```sql
CREATE TABLE IF NOT EXISTS consultations (
  id SERIAL PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  project_details TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'Pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS admins (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

4. Go to Settings -> Database -> Connection Pooler and copy your **Transaction Mode** connection string into your Vercel `SUPABASE_DATABASE_URL` environment variable.

## 4. Vercel Deployment Steps
1. Push this repository to GitHub/GitLab/Bitbucket.
2. Go to Vercel and import the repository.
3. The Build Command should be `npm run build` or `next build` (Vercel will detect Next.js automatically).
4. In the "Environment Variables" section, add all the variables listed in Step 1.
5. Click **Deploy**.
