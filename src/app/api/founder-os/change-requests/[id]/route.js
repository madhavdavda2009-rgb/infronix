import { NextResponse } from 'next/server';
import { verifyAdminAuth } from '@/lib/auth';
import { query, initFounderOSDb } from '@/lib/founder_os_db';
import { logActivity } from '@/lib/audit_logger';
import { notifyClient } from '@/lib/portal_notifications';

export async function GET(request, { params }) {
  const auth = verifyAdminAuth(request);
  if (!auth) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await initFounderOSDb();
    const resolvedParams = await params;
    const { id } = resolvedParams;
    const crId = parseInt(id, 10);

    const crRes = await query(`
      SELECT 
        cr.*,
        p.project_name,
        c.name as client_name,
        c.email as client_email,
        u.full_name as portal_user_name,
        u.public_client_id
      FROM founder_os_client_change_requests cr
      JOIN founder_os_projects p ON p.id = cr.project_id
      JOIN founder_os_clients c ON c.id = cr.client_id
      LEFT JOIN founder_os_portal_users u ON u.id = cr.portal_user_id
      WHERE cr.id = $1
    `, [crId]);

    if (crRes.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Change request not found' }, { status: 404 });
    }

    const commentsRes = await query(`
      SELECT * FROM founder_os_change_request_comments
      WHERE change_request_id = $1
      ORDER BY created_at ASC
    `, [crId]);

    return NextResponse.json({
      success: true,
      change_request: crRes.rows[0],
      comments: commentsRes.rows
    });
  } catch (err) {
    console.error('Admin single CR get error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
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
    const crId = parseInt(id, 10);

    const crRes = await query(`
      SELECT cr.*, p.project_name, c.name as client_name 
      FROM founder_os_client_change_requests cr
      JOIN founder_os_projects p ON p.id = cr.project_id
      JOIN founder_os_clients c ON c.id = cr.client_id
      WHERE cr.id = $1
    `, [crId]);

    if (crRes.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Change request not found' }, { status: 404 });
    }
    const currentCr = crRes.rows[0];

    const body = await request.json();
    const status = body.status || currentCr.status;
    const adminPriority = body.admin_priority || currentCr.admin_priority;
    const isInScope = body.is_in_scope !== undefined ? Boolean(body.is_in_scope) : currentCr.is_in_scope;
    const quoteAmount = body.quote_amount !== undefined ? parseFloat(body.quote_amount || 0) : currentCr.quote_amount;
    const quoteCurrency = body.quote_currency || currentCr.quote_currency || 'INR';
    const quoteTaxIncluded = body.quote_tax_included !== undefined ? Boolean(body.quote_tax_included) : currentCr.quote_tax_included;
    const timelineImpactDays = body.timeline_impact_days !== undefined ? parseInt(body.timeline_impact_days || 0, 10) : currentCr.timeline_impact_days;
    const estimatedCompletionDate = body.estimated_completion_date || currentCr.estimated_completion_date;
    const quoteTerms = typeof body.quote_terms === 'string' ? body.quote_terms.trim() : currentCr.quote_terms;
    const adminExplanation = typeof body.admin_explanation === 'string' ? body.admin_explanation.trim() : currentCr.admin_explanation;

    // Increment quote version if quote amount or terms changed
    let quoteVersion = currentCr.quote_version || 1;
    if (quoteAmount !== currentCr.quote_amount || quoteTerms !== currentCr.quote_terms) {
      quoteVersion += 1;
    }

    const updateRes = await query(`
      UPDATE founder_os_client_change_requests
      SET status = $1,
          admin_priority = $2,
          is_in_scope = $3,
          quote_amount = $4,
          quote_currency = $5,
          quote_tax_included = $6,
          timeline_impact_days = $7,
          estimated_completion_date = $8,
          quote_terms = $9,
          admin_explanation = $10,
          quote_version = $11,
          updated_at = NOW()
      WHERE id = $12
      RETURNING *
    `, [
      status,
      adminPriority,
      isInScope,
      quoteAmount,
      quoteCurrency,
      quoteTaxIncluded,
      timelineImpactDays,
      estimatedCompletionDate,
      quoteTerms,
      adminExplanation,
      quoteVersion,
      crId
    ]);

    const updatedCr = updateRes.rows[0];

    // Log Activity
    await logActivity(
      auth.username || 'Admin',
      'Change Request Review',
      currentCr.project_id,
      `CR [${currentCr.reference_id}] Status: ${status}`,
      `Updated change request "${currentCr.title}". Status: ${status}. Scope: ${isInScope ? 'In Scope' : `Quoted ₹${quoteAmount}`}`
    );

    // Notify Client
    let clientNotice = `Status updated to "${status}".`;
    if (status === 'Quoted' || status === 'Awaiting Client Approval') {
      clientNotice = `A quotation of ₹${quoteAmount.toLocaleString('en-IN')} has been prepared for your change request "${currentCr.title}". Please review and approve/decline in your portal.`;
    }

    await notifyClient({
      clientId: currentCr.client_id,
      portalUserId: currentCr.portal_user_id,
      projectId: currentCr.project_id,
      title: `Change Request Update: [${currentCr.reference_id}]`,
      message: clientNotice,
      actionUrl: `/client/projects/${currentCr.project_id}?tab=change-requests&crId=${currentCr.id}`,
      category: 'Change Request'
    });

    return NextResponse.json({
      success: true,
      message: 'Change request updated successfully.',
      change_request: updatedCr
    });
  } catch (err) {
    console.error('Admin update CR error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
