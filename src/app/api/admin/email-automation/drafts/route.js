import { NextResponse } from 'next/server';
import { execute } from '@/lib/db';
import { verifyAdminAuth } from '@/lib/auth';
import { initEmailAutomationDb } from '@/lib/email-automation/db-init';

export async function GET(request) {
  try {
    const admin = verifyAdminAuth(request);
    if (!admin) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await initEmailAutomationDb();

    const { searchParams } = new URL(request.url);
    const leadId = searchParams.get('leadId');

    let query = `
      SELECT 
        d.*,
        COALESCE(l.company_name, l.business_name, '') as company_name,
        COALESCE(l.name, '') as contact_name,
        l.email as lead_email
      FROM email_drafts d
      LEFT JOIN leads l ON d.lead_id = l.id
    `;
    const params = [];

    if (leadId) {
      query += ` WHERE d.lead_id = ?`;
      params.push(leadId);
    }

    query += ` ORDER BY d.updated_at DESC LIMIT 100`;

    const [drafts] = await execute(query, params);

    return NextResponse.json({
      success: true,
      data: drafts || []
    });
  } catch (err) {
    console.error('Error fetching drafts:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to fetch drafts' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const admin = verifyAdminAuth(request);
    if (!admin) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await initEmailAutomationDb();

    const body = await request.json();
    const { draftId, leadId, subject, body: emailBody, targetService, observation } = body;

    if (!subject || !emailBody) {
      return NextResponse.json(
        { success: false, error: 'Subject and body content are required.' },
        { status: 400 }
      );
    }

    if (draftId) {
      // Update existing draft
      await execute(`
        UPDATE email_drafts 
        SET 
          subject = ?,
          body = ?,
          target_service = ?,
          observation = ?,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `, [subject, emailBody, targetService || 'General', observation || null, draftId]);

      return NextResponse.json({
        success: true,
        message: 'Draft updated successfully.'
      });
    } else {
      // Insert new draft
      await execute(`
        INSERT INTO email_drafts (lead_id, subject, body, target_service, observation, status, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, 'Draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      `, [leadId || null, subject, emailBody, targetService || 'General', observation || null]);

      return NextResponse.json({
        success: true,
        message: 'Draft saved successfully.'
      });
    }
  } catch (err) {
    console.error('Error saving draft:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to save draft' },
      { status: 500 }
    );
  }
}
