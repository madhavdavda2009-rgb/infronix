import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { query, initFounderOSDb } from '@/lib/founder_os_db';
import { verifyAdminAuth } from '@/lib/auth';
import { logActivity } from '@/lib/audit_logger';

function generateSlug(name) {
  if (!name) return `member-${Date.now()}`;
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '') || `member-${Date.now()}`;
}

export async function GET(request) {
  const auth = verifyAdminAuth(request);
  if (!auth) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await initFounderOSDb();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const type = searchParams.get('type');

    let sql = 'SELECT * FROM founder_os_people WHERE (is_archived IS NOT TRUE)';
    const params = [];

    if (status && status !== 'ALL') {
      params.push(status);
      sql += ` AND status = $${params.length}`;
    }

    if (type && type !== 'ALL') {
      params.push(type);
      sql += ` AND employment_type = $${params.length}`;
    }

    sql += `
      ORDER BY 
        CASE WHEN employment_type = 'Founder' OR is_founder = TRUE THEN 0 ELSE 1 END,
        display_order ASC,
        created_at DESC
    `;
    const res = await query(sql, params);
    return NextResponse.json({ success: true, people: res.rows });
  } catch (err) {
    console.error('People GET error:', err);
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
    const {
      name,
      role,
      email,
      phone,
      joining_date,
      employment_type,
      responsibilities_json,
      status,
      notes,
      public_slug,
      public_bio,
      profile_image_url,
      show_on_website,
      show_on_homepage,
      show_on_about_page,
      display_order,
      public_role,
      linkedin_url,
      github_url,
      portfolio_url,
      instagram_url
    } = body;

    if (!name || !role) {
      return NextResponse.json({ success: false, error: 'Name and role are required.' }, { status: 400 });
    }

    const cleanName = name.trim();
    const cleanRole = role.trim();
    const cleanSlug = (public_slug ? generateSlug(public_slug) : generateSlug(cleanName));
    const isFounder = employment_type === 'Founder';
    const order = Number.isInteger(Number(display_order)) && Number(display_order) >= 0 ? Number(display_order) : 0;

    const insertRes = await query(`
      INSERT INTO founder_os_people (
        name, role, email, phone, joining_date, employment_type,
        responsibilities_json, status, notes,
        public_slug, public_bio, profile_image_url,
        show_on_website, show_on_homepage, show_on_about_page,
        display_order, public_role,
        linkedin_url, github_url, portfolio_url, instagram_url,
        is_founder, created_at, updated_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6,
        $7, $8, $9,
        $10, $11, $12,
        $13, $14, $15,
        $16, $17,
        $18, $19, $20, $21,
        $22, NOW(), NOW()
      )
      RETURNING *
    `, [
      cleanName,
      cleanRole,
      email ? email.trim() : null,
      phone ? phone.trim() : null,
      joining_date || null,
      employment_type || 'Employee',
      JSON.stringify(responsibilities_json || []),
      status || 'Active',
      notes || null,
      cleanSlug,
      public_bio ? public_bio.trim().substring(0, 1000) : null,
      profile_image_url ? profile_image_url.trim() : null,
      Boolean(show_on_website),
      Boolean(show_on_homepage),
      Boolean(show_on_about_page),
      order,
      public_role ? public_role.trim() : cleanRole,
      linkedin_url ? linkedin_url.trim() : null,
      github_url ? github_url.trim() : null,
      portfolio_url ? portfolio_url.trim() : null,
      instagram_url ? instagram_url.trim() : null,
      isFounder
    ]);

    const person = insertRes.rows[0];
    await logActivity(
      auth.username,
      'Person',
      person.id,
      'Created',
      `Added team member: ${person.name} (${person.role})${show_on_website ? ' [Published on Website]' : ''}`
    );

    // Revalidate public website cache
    try {
      revalidatePath('/');
      revalidatePath('/about');
    } catch (e) {
      console.warn('Revalidation notice:', e.message);
    }

    return NextResponse.json({ success: true, person });
  } catch (err) {
    console.error('People POST error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

