import { NextResponse } from 'next/server';
import { execute } from '@/lib/db';
import { verifyAdminAuth } from '@/lib/auth';
import { initEmailAutomationDb } from '@/lib/email-automation/db-init';

export async function GET(request, { params }) {
  try {
    const admin = verifyAdminAuth(request);
    if (!admin) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await initEmailAutomationDb();
    const { id } = await params;

    const [leads] = await execute(`
      SELECT 
        id,
        COALESCE(company_name, business_name, '') AS company_name,
        COALESCE(name, '') AS name,
        email,
        website,
        COALESCE(industry, category, '') AS industry,
        COALESCE(location, CONCAT_WS(', ', NULLIF(area, ''), NULLIF(city, '')) , '') AS location,
        company_description,
        personalization_context,
        COALESCE(lead_source, source, 'Manual') AS lead_source,
        status,
        phone,
        lead_score,
        created_at,
        updated_at
      FROM leads 
      WHERE id = ?
    `, [id]);

    if (!leads || leads.length === 0) {
      return NextResponse.json({ success: false, error: 'Lead not found' }, { status: 404 });
    }

    // Fetch associated drafts
    const [drafts] = await execute(
      `SELECT * FROM email_drafts WHERE lead_id = ? ORDER BY created_at DESC`,
      [id]
    );

    // Fetch sent history
    const [sentEmails] = await execute(
      `SELECT * FROM sent_emails WHERE lead_id = ? ORDER BY sent_at DESC`,
      [id]
    );

    return NextResponse.json({
      success: true,
      data: {
        lead: leads[0],
        drafts: drafts || [],
        sentEmails: sentEmails || []
      }
    });
  } catch (err) {
    console.error('Error fetching lead details:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to fetch lead details' },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const admin = verifyAdminAuth(request);
    if (!admin) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await initEmailAutomationDb();
    const { id } = await params;
    const body = await request.json();

    const {
      name,
      company_name,
      email,
      website,
      industry,
      location,
      company_description,
      personalization_context,
      lead_source,
      status
    } = body;

    await execute(`
      UPDATE leads 
      SET 
        name = ?,
        company_name = ?,
        business_name = ?,
        email = ?,
        website = ?,
        industry = ?,
        category = ?,
        location = ?,
        company_description = ?,
        personalization_context = ?,
        lead_source = ?,
        status = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [
      name || null,
      company_name || null,
      company_name || null,
      email || null,
      website || null,
      industry || null,
      industry || null,
      location || null,
      company_description || null,
      personalization_context || null,
      lead_source || 'Manual',
      status || 'New',
      id
    ]);

    return NextResponse.json({
      success: true,
      message: 'Lead updated successfully.'
    });
  } catch (err) {
    console.error('Error updating lead:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to update lead' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const admin = verifyAdminAuth(request);
    if (!admin) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await initEmailAutomationDb();
    const { id } = await params;

    await execute(`DELETE FROM leads WHERE id = ?`, [id]);

    return NextResponse.json({
      success: true,
      message: 'Lead deleted successfully.'
    });
  } catch (err) {
    console.error('Error deleting lead:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to delete lead' },
      { status: 500 }
    );
  }
}
