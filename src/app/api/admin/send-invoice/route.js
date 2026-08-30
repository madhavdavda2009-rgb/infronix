import { NextResponse } from 'next/server';
import { verifyAdminAuth } from '@/lib/auth';
import { sendInvoiceMail } from '@/lib/invoice-mailer';

export async function POST(request) {
  const auth = await verifyAdminAuth(request);
  if (!auth.authenticated) {
    return NextResponse.json({ success: false, error: auth.error }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { client, invoice, customMessage } = body;

    if (!client || !client.email) {
      return NextResponse.json(
        { success: false, error: 'Client details and a valid email address are required.' },
        { status: 400 }
      );
    }

    if (!invoice || !invoice.items || invoice.items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Invoice data with at least one line item is required.' },
        { status: 400 }
      );
    }

    const result = await sendInvoiceMail({ client, invoice, customMessage });

    return NextResponse.json({
      success: true,
      message: `Invoice successfully dispatched to ${client.email}`,
      data: result
    });
  } catch (err) {
    console.error('Failed to dispatch invoice email:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Internal server error sending invoice.' },
      { status: 500 }
    );
  }
}
