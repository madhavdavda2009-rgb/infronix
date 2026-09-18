import { NextResponse } from 'next/server';
import { query, initFounderOSDb } from '@/lib/founder_os_db';
import { verifyAdminAuth } from '@/lib/auth';
import { logActivity } from '@/lib/audit_logger';

export async function GET(request) {
  const auth = verifyAdminAuth(request);
  if (!auth) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await initFounderOSDb();

    // Fetch backup records
    const backupsRes = await query('SELECT * FROM founder_os_backups ORDER BY created_at DESC LIMIT 20');

    // Fetch live record counts
    const tables = [
      { name: 'Leads', table: 'founder_os_leads' },
      { name: 'Calls', table: 'founder_os_calls' },
      { name: 'Proposals', table: 'founder_os_proposals' },
      { name: 'Projects', table: 'founder_os_projects' },
      { name: 'Tasks', table: 'founder_os_tasks' },
      { name: 'SOPs', table: 'founder_os_sops' },
      { name: 'Revenue', table: 'founder_os_revenue' },
      { name: 'Expenses', table: 'founder_os_expenses' },
      { name: 'People', table: 'founder_os_people' },
      { name: 'Blog Posts', table: 'founder_os_blogs' },
      { name: 'Blog Categories', table: 'founder_os_blog_categories' },
      { name: 'Blog Tags', table: 'founder_os_blog_tags' },
      { name: 'Security Accounts', table: 'founder_os_security_accounts' },
      { name: 'Audit Logs', table: 'founder_os_activity_logs' }
    ];

    const stats = [];
    let totalRecords = 0;
    for (const t of tables) {
      const countRes = await query(`SELECT COUNT(*) as count FROM ${t.table}`);
      const count = parseInt(countRes.rows[0].count, 10);
      stats.push({ name: t.name, table: t.table, count });
      totalRecords += count;
    }

    const settingsRes = await query("SELECT value FROM founder_os_settings WHERE key = 'last_backup_date'");
    const lastBackupDate = settingsRes.rows[0]?.value || 'Never';

    return NextResponse.json({
      success: true,
      backups: backupsRes.rows,
      stats,
      totalRecords,
      lastBackupDate
    });
  } catch (err) {
    console.error('Backup GET error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  const auth = verifyAdminAuth(request);
  if (!auth) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await initFounderOSDb();
    const body = await request.json();
    const { action } = body;

    // 1. CREATE FULL BACKUP
    if (action === 'create_backup' || action === 'export_json') {
      const dump = {
        version: '1.0',
        timestamp: new Date().toISOString(),
        business: 'InfronixWeb Founder OS',
        data: {
          settings: (await query('SELECT * FROM founder_os_settings')).rows,
          leads: (await query('SELECT * FROM founder_os_leads')).rows,
          calls: (await query('SELECT * FROM founder_os_calls')).rows,
          proposals: (await query('SELECT * FROM founder_os_proposals')).rows,
          clients: (await query('SELECT * FROM founder_os_clients')).rows,
          projects: (await query('SELECT * FROM founder_os_projects')).rows,
          stages: (await query('SELECT * FROM founder_os_project_stages')).rows,
          paymentSchedules: (await query('SELECT * FROM founder_os_payment_schedules')).rows,
          plannedCosts: (await query('SELECT * FROM founder_os_planned_costs')).rows,
          requirements: (await query('SELECT * FROM founder_os_client_requirements')).rows,
          projectTeam: (await query('SELECT * FROM founder_os_project_team')).rows,
          tasks: (await query('SELECT * FROM founder_os_tasks')).rows,
          feedback: (await query('SELECT * FROM founder_os_feedback')).rows,
          qaChecklist: (await query('SELECT * FROM founder_os_qa_checklist')).rows,
          sops: (await query('SELECT * FROM founder_os_sops')).rows,
          revenue: (await query('SELECT * FROM founder_os_revenue')).rows,
          expenses: (await query('SELECT * FROM founder_os_expenses')).rows,
          people: (await query('SELECT * FROM founder_os_people')).rows,
          blogs: (await query('SELECT * FROM founder_os_blogs')).rows,
          blogCategories: (await query('SELECT * FROM founder_os_blog_categories')).rows,
          blogTags: (await query('SELECT * FROM founder_os_blog_tags')).rows,
          blogPostsTags: (await query('SELECT * FROM founder_os_blog_posts_tags')).rows,
          securityAccounts: (await query('SELECT * FROM founder_os_security_accounts')).rows,
          securityChecklist: (await query('SELECT * FROM founder_os_security_checklist')).rows,
          secretReferences: (await query('SELECT * FROM founder_os_secret_references')).rows,
          activityLogs: (await query('SELECT * FROM founder_os_activity_logs ORDER BY id DESC LIMIT 500')).rows
        }
      };

      let totalRecords = 0;
      for (const k of Object.keys(dump.data)) {
        totalRecords += dump.data[k].length;
      }

      const jsonStr = JSON.stringify(dump, null, 2);
      const sizeBytes = Buffer.byteLength(jsonStr, 'utf8');
      const filename = `infronix_backup_${new Date().toISOString().replace(/[:.]/g, '-')}.json`;

      // Record backup metadata
      await query(`
        INSERT INTO founder_os_backups (filename, backup_type, record_count, size_bytes, notes, created_at)
        VALUES ($1, 'Manual JSON', $2, $3, 'Complete snapshot', NOW())
      `, [filename, totalRecords, sizeBytes]);

      // Update last backup date
      await query(`
        INSERT INTO founder_os_settings (key, value, updated_at)
        VALUES ('last_backup_date', $1, NOW())
        ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()
      `, [new Date().toISOString()]);

      await logActivity(auth.username, 'Backup', null, 'Created', `Created manual backup "${filename}" (${totalRecords} records, ${(sizeBytes / 1024).toFixed(1)} KB)`);

      return NextResponse.json({
        success: true,
        filename,
        recordCount: totalRecords,
        sizeBytes,
        payload: dump
      });
    }

    // 2. EXPORT CSV
    if (action === 'export_csv') {
      const { module } = body; // 'leads' | 'revenue' | 'expenses' | 'projects' | 'people'
      let table = 'founder_os_leads';
      if (module === 'revenue') table = 'founder_os_revenue';
      else if (module === 'expenses') table = 'founder_os_expenses';
      else if (module === 'projects') table = 'founder_os_projects';
      else if (module === 'people') table = 'founder_os_people';

      const res = await query(`SELECT * FROM ${table} ORDER BY id ASC`);
      const rows = res.rows;
      if (rows.length === 0) {
        return NextResponse.json({ success: true, csv: '', filename: `${module}_empty.csv`, count: 0 });
      }

      const headers = Object.keys(rows[0]);
      const csvLines = [headers.join(',')];
      for (const row of rows) {
        const line = headers.map(h => {
          const val = row[h];
          if (val === null || val === undefined) return '""';
          return `"${String(val).replace(/"/g, '""')}"`;
        }).join(',');
        csvLines.push(line);
      }
      const csvStr = csvLines.join('\n');
      const filename = `infronix_${module}_${new Date().toISOString().substring(0, 10)}.csv`;

      await logActivity(auth.username, 'Backup', null, 'Exported', `Exported CSV for ${module} (${rows.length} rows)`);

      return NextResponse.json({
        success: true,
        csv: csvStr,
        filename,
        count: rows.length
      });
    }

    // 3. IMPORT PREVIEW (Validate payload)
    if (action === 'import_preview') {
      const { payload } = body;
      if (!payload || !payload.data) {
        return NextResponse.json({ success: false, error: 'Invalid backup JSON file structure' }, { status: 400 });
      }

      const previewCounts = {};
      let totalRecords = 0;
      for (const [key, rows] of Object.entries(payload.data)) {
        if (Array.isArray(rows)) {
          previewCounts[key] = rows.length;
          totalRecords += rows.length;
        }
      }

      return NextResponse.json({
        success: true,
        previewCounts,
        totalRecords,
        backupTimestamp: payload.timestamp || 'Unknown'
      });
    }

    // 4. IMPORT CONFIRM
    if (action === 'import_confirm') {
      const { payload } = body;
      if (!payload || !payload.data) {
        return NextResponse.json({ success: false, error: 'Invalid backup JSON file structure' }, { status: 400 });
      }

      const data = payload.data;
      let importedCount = 0;

      // Import Leads
      if (Array.isArray(data.leads)) {
        for (const l of data.leads) {
          await query(`
            INSERT INTO founder_os_leads (lead_id, name, company, phone, email, source, industry, status, estimated_value, notes, next_followup)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
            ON CONFLICT (lead_id) DO NOTHING
          `, [l.lead_id || `LD-${Date.now()}`, l.name, l.company, l.phone, l.email, l.source, l.industry, l.status, l.estimated_value, l.notes, l.next_followup]);
          importedCount++;
        }
      }

      // Import Revenue
      if (Array.isArray(data.revenue)) {
        for (const r of data.revenue) {
          await query(`
            INSERT INTO founder_os_revenue (client_name, amount, payment_date, payment_status, payment_method, invoice_number, notes)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
          `, [r.client_name, r.amount, r.payment_date, r.payment_status, r.payment_method, r.invoice_number, r.notes]);
          importedCount++;
        }
      }

      // Import Expenses
      if (Array.isArray(data.expenses)) {
        for (const e of data.expenses) {
          await query(`
            INSERT INTO founder_os_expenses (category, description, amount, expense_date, payment_method, is_recurring, recurring_frequency, notes)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
          `, [e.category, e.description, e.amount, e.expense_date, e.payment_method, e.is_recurring, e.recurring_frequency, e.notes]);
          importedCount++;
        }
      }

      // Import People
      if (Array.isArray(data.people)) {
        for (const p of data.people) {
          await query(`
            INSERT INTO founder_os_people (name, role, email, phone, joining_date, employment_type, responsibilities_json, status, notes)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
          `, [p.name, p.role, p.email, p.phone, p.joining_date, p.employment_type, JSON.stringify(p.responsibilities_json || []), p.status, p.notes]);
          importedCount++;
        }
      }

      // Import SOPs
      if (Array.isArray(data.sops)) {
        for (const s of data.sops) {
          await query(`
            INSERT INTO founder_os_sops (name, category, description, steps_json, owner, version, last_updated)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
          `, [s.name, s.category, s.description, JSON.stringify(s.steps_json || []), s.owner, s.version, s.last_updated]);
          importedCount++;
        }
      }

      await logActivity(auth.username, 'Backup', null, 'Restored', `Imported backup dataset (${importedCount} records processed)`);

      return NextResponse.json({ success: true, importedCount });
    }

    // 5. RESET APPLICATION DATA (Destructive)
    if (action === 'reset_database') {
      const { confirmPhrase } = body;
      if (confirmPhrase !== 'RESET') {
        return NextResponse.json({ success: false, error: 'Confirmation phrase must match "RESET"' }, { status: 400 });
      }

      // Truncate/Delete all business records
      await query('DELETE FROM founder_os_feedback');
      await query('DELETE FROM founder_os_qa_checklist');
      await query('DELETE FROM founder_os_tasks');
      await query('DELETE FROM founder_os_projects');
      await query('DELETE FROM founder_os_calls');
      await query('DELETE FROM founder_os_proposals');
      await query('DELETE FROM founder_os_leads');
      await query('DELETE FROM founder_os_revenue');
      await query('DELETE FROM founder_os_expenses');
      await query('DELETE FROM founder_os_people');
      await query('DELETE FROM founder_os_sops');
      await query('DELETE FROM founder_os_security_accounts');
      await query('DELETE FROM founder_os_secret_references');
      await query('DELETE FROM founder_os_activity_logs');
      await query('DELETE FROM founder_os_backups');

      // Reset 14 Security checklist items to 'Not Checked'
      await query("UPDATE founder_os_security_checklist SET status = 'Not Checked', last_verified = NULL, notes = NULL, updated_at = NOW()");

      await logActivity(auth.username, 'Settings', null, 'Reset', 'Application business data was completely reset to clean initial state.');

      return NextResponse.json({ success: true, message: 'All business data has been cleanly reset to 0 records.' });
    }

    return NextResponse.json({ success: false, error: 'Unknown action' }, { status: 400 });
  } catch (err) {
    console.error('Backup action error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
