import { NextResponse } from 'next/server';
import { execute } from '@/lib/db';
import { verifyAdminAuth } from '@/lib/auth';
import { initEmailAutomationDb } from '@/lib/email-automation/db-init';
import { generatePersonalizedEmail, getAvailableServices } from '@/lib/email-automation/generator';

export async function POST(request) {
  try {
    const admin = verifyAdminAuth(request);
    if (!admin) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await initEmailAutomationDb();

    const body = await request.json();
    const { leadId, targetService, customObservation, customSubject, customCta, saveAsDraft } = body;

    if (!leadId) {
      return NextResponse.json({ success: false, error: 'Lead ID is required.' }, { status: 400 });
    }

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
        lead_source,
        status
      FROM leads 
      WHERE id = ?
    `, [leadId]);

    if (!leads || leads.length === 0) {
      return NextResponse.json({ success: false, error: 'Lead not found.' }, { status: 404 });
    }

    const lead = leads[0];

    const generated = generatePersonalizedEmail(lead, {
      targetService,
      customObservation,
      customSubject,
      customCta
    });

    let draftId = null;

    // Save as draft in DB
    if (saveAsDraft !== false) {
      const [insertResult] = await execute(`
        INSERT INTO email_drafts (lead_id, subject, body, target_service, observation, status, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, 'Draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        RETURNING id
      `, [
        lead.id,
        generated.subject,
        generated.body,
        generated.serviceKey,
        generated.observation
      ]);

      // If RETURNING id didn't return rows (due to driver abstraction), select latest draft
      if (insertResult && insertResult.id) {
        draftId = insertResult.id;
      }

      // Update lead status to 'Email Generated' if currently 'New' or 'Ready'
      if (['new', 'ready'].includes((lead.status || '').toLowerCase())) {
        await execute(
          `UPDATE leads SET status = 'Email Generated', updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
          [lead.id]
        );
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        ...generated,
        leadId: lead.id,
        draftId,
        availableServices: getAvailableServices()
      }
    });
  } catch (err) {
    console.error('Error generating email:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to generate personalized email' },
      { status: 500 }
    );
  }
}
