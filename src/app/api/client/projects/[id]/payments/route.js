import { NextResponse } from 'next/server';
import { verifyClientAuth, verifyClientProjectAccess, getPortalSecurityHeaders } from '@/lib/client_auth';
import { query, initFounderOSDb } from '@/lib/founder_os_db';

export async function GET(request, { params }) {
  try {
    const auth = await verifyClientAuth(request);
    if (!auth) {
      return NextResponse.json({ success: false, error: 'Unauthorized.' }, { status: 401, headers: getPortalSecurityHeaders() });
    }

    await initFounderOSDb();
    const resolvedParams = await params;
    const { id } = resolvedParams;
    const projectId = parseInt(id, 10);

    const accessCheck = await verifyClientProjectAccess(auth.client.id, auth.user.id, projectId);
    if (!accessCheck.authorized) {
      return NextResponse.json({ success: false, error: 'Project not found.' }, { status: 404, headers: getPortalSecurityHeaders() });
    }

    const { project } = accessCheck;

    // Check if financials are allowed to be shown for this project
    if (project.visible_financials === false) {
      return NextResponse.json({
        success: true,
        financials_enabled: false,
        message: 'Financial summary is managed directly with your account executive.',
        schedules: []
      }, { headers: getPortalSecurityHeaders() });
    }

    // Fetch approved payment milestones
    const schedulesRes = await query(`
      SELECT 
        s.id,
        s.name,
        s.amount,
        s.due_date,
        s.status,
        s.paid_date,
        r.invoice_number,
        r.payment_method
      FROM founder_os_payment_schedules s
      LEFT JOIN founder_os_revenue r ON r.id = s.revenue_id
      WHERE s.project_id = $1
      ORDER BY s.due_date ASC NULLS LAST, s.id ASC
    `, [projectId]);

    // Fetch actual paid revenue for this project
    const revRes = await query(`
      SELECT 
        id, amount, payment_date, payment_status, payment_method, invoice_number, notes
      FROM founder_os_revenue 
      WHERE project_id = $1 AND payment_status = 'Paid'
      ORDER BY payment_date DESC
    `, [projectId]);

    const contractValue = parseFloat(project.project_value || 0);
    let totalPaid = 0;
    for (const r of revRes.rows) {
      totalPaid += parseFloat(r.amount || 0);
    }
    const outstanding = Math.max(0, contractValue - totalPaid);

    return NextResponse.json({
      success: true,
      financials_enabled: true,
      summary: {
        contract_value: contractValue,
        total_paid: totalPaid,
        outstanding: outstanding,
        payment_structure: project.payment_structure || 'Advance + Final'
      },
      schedules: schedulesRes.rows,
      paid_receipts: revRes.rows.map(r => ({
        id: r.id,
        amount: parseFloat(r.amount || 0),
        payment_date: r.payment_date,
        payment_method: r.payment_method,
        invoice_number: r.invoice_number
      }))
    }, { headers: getPortalSecurityHeaders() });
  } catch (err) {
    console.error('Client payments get error:', err);
    return NextResponse.json({ success: false, error: 'Failed to retrieve payments.' }, { status: 500, headers: getPortalSecurityHeaders() });
  }
}
