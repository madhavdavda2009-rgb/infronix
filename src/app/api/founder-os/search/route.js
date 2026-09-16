import { NextResponse } from 'next/server';
import { query, initFounderOSDb } from '@/lib/founder_os_db';
import { verifyAdminAuth } from '@/lib/auth';

export async function GET(request) {
  const auth = verifyAdminAuth(request);
  if (!auth) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await initFounderOSDb();
    const { searchParams } = new URL(request.url);
    const q = (searchParams.get('q') || '').trim().toLowerCase();

    if (!q || q.length < 2) {
      return NextResponse.json({ success: true, results: [] });
    }

    const pattern = `%${q}%`;
    const results = [];

    // 1. Search Clients
    const clientsRes = await query(`
      SELECT id, name, company, email, phone, '/admin?tab=clients' as url
      FROM founder_os_clients
      WHERE LOWER(name) LIKE $1 OR LOWER(COALESCE(company, '')) LIKE $1 OR LOWER(COALESCE(email, '')) LIKE $1
      LIMIT 5
    `, [pattern]);
    for (const r of clientsRes.rows) {
      results.push({
        id: `client-${r.id}`,
        title: r.name,
        subtitle: `${r.company ? r.company + ' • ' : ''}${r.email || r.phone || 'Client'}`,
        category: 'Clients',
        url: r.url
      });
    }

    // 2. Search Leads
    const leadsRes = await query(`
      SELECT id, name, company, email, status, 'Lead' as entity_type, '/admin?tab=sales&sub=leads&leadId=' || id as url
      FROM founder_os_leads
      WHERE LOWER(name) LIKE $1 OR LOWER(company) LIKE $1 OR LOWER(email) LIKE $1 OR LOWER(lead_id) LIKE $1
      LIMIT 5
    `, [pattern]);
    for (const r of leadsRes.rows) {
      results.push({
        id: `lead-${r.id}`,
        title: r.name,
        subtitle: `${r.company ? r.company + ' • ' : ''}Status: ${r.status}`,
        category: 'Leads',
        url: r.url
      });
    }

    // 3. Search Projects
    const projectsRes = await query(`
      SELECT id, project_name, client_name, status, 'Project' as entity_type, '/admin?tab=delivery&projectId=' || id as url
      FROM founder_os_projects
      WHERE LOWER(project_name) LIKE $1 OR LOWER(client_name) LIKE $1
      LIMIT 5
    `, [pattern]);
    for (const r of projectsRes.rows) {
      results.push({
        id: `project-${r.id}`,
        title: r.project_name,
        subtitle: `Client: ${r.client_name} • ${r.status}`,
        category: 'Projects',
        url: r.url
      });
    }

    // 4. Search Tasks
    const tasksRes = await query(`
      SELECT t.id, t.title, t.status, p.project_name, '/admin?tab=delivery&projectId=' || t.project_id as url
      FROM founder_os_tasks t
      JOIN founder_os_projects p ON p.id = t.project_id
      WHERE LOWER(t.title) LIKE $1 OR LOWER(t.description) LIKE $1
      LIMIT 5
    `, [pattern]);
    for (const r of tasksRes.rows) {
      results.push({
        id: `task-${r.id}`,
        title: r.title,
        subtitle: `In ${r.project_name} • ${r.status}`,
        category: 'Tasks',
        url: r.url
      });
    }

    // 5. Search SOPs
    const sopsRes = await query(`
      SELECT id, name, category, version, '/admin?tab=sops&sopId=' || id as url
      FROM founder_os_sops
      WHERE LOWER(name) LIKE $1 OR LOWER(description) LIKE $1
      LIMIT 5
    `, [pattern]);
    for (const r of sopsRes.rows) {
      results.push({
        id: `sop-${r.id}`,
        title: r.name,
        subtitle: `${r.category} • v${r.version}`,
        category: 'SOPs',
        url: r.url
      });
    }

    // 6. Search People
    const peopleRes = await query(`
      SELECT id, name, role, email, status, '/admin?tab=people' as url
      FROM founder_os_people
      WHERE LOWER(name) LIKE $1 OR LOWER(role) LIKE $1 OR LOWER(email) LIKE $1
      LIMIT 5
    `, [pattern]);
    for (const r of peopleRes.rows) {
      results.push({
        id: `person-${r.id}`,
        title: r.name,
        subtitle: `${r.role} • ${r.status}`,
        category: 'People',
        url: r.url
      });
    }

    // 7. Search Security Accounts
    const secRes = await query(`
      SELECT id, service_name, category, owner, '/admin?tab=security&sub=accounts' as url
      FROM founder_os_security_accounts
      WHERE LOWER(service_name) LIKE $1 OR LOWER(category) LIKE $1
      LIMIT 5
    `, [pattern]);
    for (const r of secRes.rows) {
      results.push({
        id: `sec-${r.id}`,
        title: r.service_name,
        subtitle: `${r.category} • Owner: ${r.owner}`,
        category: 'Security',
        url: r.url
      });
    }

    return NextResponse.json({ success: true, results });
  } catch (err) {
    console.error('Global search error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
