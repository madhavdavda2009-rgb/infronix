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

export async function PUT(request, { params }) {
  const auth = verifyAdminAuth(request);
  if (!auth) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await initFounderOSDb();
    const resolvedParams = await params;
    const { id } = resolvedParams;
    const body = await request.json();

    const existingRes = await query('SELECT * FROM founder_os_people WHERE id = $1', [id]);
    if (existingRes.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Team member not found' }, { status: 404 });
    }
    const current = existingRes.rows[0];

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

    const isFounder = current.is_founder || current.employment_type === 'Founder' || employment_type === 'Founder';
    const targetEmploymentType = isFounder ? 'Founder' : (employment_type !== undefined ? employment_type : current.employment_type);
    const targetSlug = public_slug !== undefined ? generateSlug(public_slug || name || current.name) : current.public_slug;
    const targetOrder = display_order !== undefined && Number.isInteger(Number(display_order)) && Number(display_order) >= 0
      ? Number(display_order)
      : (current.display_order || 0);

    const updateRes = await query(`
      UPDATE founder_os_people
      SET 
        name = COALESCE($1, name),
        role = COALESCE($2, role),
        email = $3,
        phone = $4,
        joining_date = $5,
        employment_type = $6,
        responsibilities_json = COALESCE($7, responsibilities_json),
        status = COALESCE($8, status),
        notes = $9,
        public_slug = COALESCE($10, public_slug),
        public_bio = $11,
        profile_image_url = $12,
        show_on_website = COALESCE($13, show_on_website),
        show_on_homepage = COALESCE($14, show_on_homepage),
        show_on_about_page = COALESCE($15, show_on_about_page),
        display_order = $16,
        public_role = $17,
        linkedin_url = $18,
        github_url = $19,
        portfolio_url = $20,
        instagram_url = $21,
        is_founder = $22,
        updated_at = NOW()
      WHERE id = $23
      RETURNING *
    `, [
      name ? name.trim() : null,
      role ? role.trim() : null,
      email !== undefined ? (email ? email.trim() : null) : current.email,
      phone !== undefined ? (phone ? phone.trim() : null) : current.phone,
      joining_date !== undefined ? (joining_date || null) : current.joining_date,
      targetEmploymentType,
      responsibilities_json !== undefined ? JSON.stringify(responsibilities_json) : null,
      status !== undefined ? status : current.status,
      notes !== undefined ? notes : current.notes,
      targetSlug,
      public_bio !== undefined ? (public_bio ? public_bio.trim().substring(0, 1000) : null) : current.public_bio,
      profile_image_url !== undefined ? (profile_image_url ? profile_image_url.trim() : null) : current.profile_image_url,
      show_on_website !== undefined ? Boolean(show_on_website) : current.show_on_website,
      show_on_homepage !== undefined ? Boolean(show_on_homepage) : current.show_on_homepage,
      show_on_about_page !== undefined ? Boolean(show_on_about_page) : current.show_on_about_page,
      targetOrder,
      public_role !== undefined ? (public_role ? public_role.trim() : null) : current.public_role,
      linkedin_url !== undefined ? (linkedin_url ? linkedin_url.trim() : null) : current.linkedin_url,
      github_url !== undefined ? (github_url ? github_url.trim() : null) : current.github_url,
      portfolio_url !== undefined ? (portfolio_url ? portfolio_url.trim() : null) : current.portfolio_url,
      instagram_url !== undefined ? (instagram_url ? instagram_url.trim() : null) : current.instagram_url,
      isFounder,
      id
    ]);

    const person = updateRes.rows[0];
    await logActivity(
      auth.username,
      'Person',
      id,
      'Updated',
      `Updated team member: ${person.name} (${person.role})${person.show_on_website ? ' [Visible on Website]' : ' [Hidden from Website]'}`
    );

    // Revalidate public cache
    try {
      revalidatePath('/');
      revalidatePath('/about');
    } catch (e) {
      console.warn('Revalidation notice:', e.message);
    }

    return NextResponse.json({ success: true, person });
  } catch (err) {
    console.error('People PUT error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const auth = verifyAdminAuth(request);
  if (!auth) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await initFounderOSDb();
    const resolvedParams = await params;
    const { id } = resolvedParams;

    const res = await query('SELECT * FROM founder_os_people WHERE id = $1', [id]);
    if (res.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Team member not found' }, { status: 404 });
    }

    const person = res.rows[0];

    // Protect Founder from deletion
    if (person.is_founder || person.employment_type === 'Founder' || person.name.toLowerCase().includes('madhav')) {
      return NextResponse.json(
        {
          success: false,
          error: 'The primary Founder record is protected and cannot be deleted.'
        },
        { status: 403 }
      );
    }

    // Safely delete team member (foreign keys in project_team and calls are ON DELETE SET NULL)
    await query('DELETE FROM founder_os_people WHERE id = $1', [id]);
    await logActivity(auth.username, 'Person', id, 'Deleted', `Deleted team member: ${person.name}`);

    // Revalidate public cache
    try {
      revalidatePath('/');
      revalidatePath('/about');
    } catch (e) {
      console.warn('Revalidation notice:', e.message);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('People DELETE error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

