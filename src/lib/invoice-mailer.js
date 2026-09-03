import { sendOutreachEmail } from './email-automation/mailer.js';

/**
 * Format email-safe HTML for Client Invoice
 */
export function generateInvoiceEmailHtml({ client, invoice }) {
  const {
    invoiceId,
    issueDate,
    dueDate,
    status = 'PENDING',
    items = [],
    subtotal = 0,
    taxRate = 18,
    taxAmount = 0,
    total = 0,
    amountPaid = 0,
    balanceDue = 0,
    paymentMethod = '',
    transactionId = '',
    paymentDate = '',
    enableUpi = false,
    upiId = '',
    upiPayeeName = 'Infronix Web Agency',
    upiAmount = 0,
    notes = ''
  } = invoice;

  const clientName = `${client?.firstName || ''} ${client?.lastName || ''}`.trim() || 'Valued Client';
  const companyName = client?.company || '';
  const clientEmail = client?.email || '';

  // Status colors
  const statusColors = {
    PAID: { bg: '#dcfce7', text: '#15803d', border: '#86efac' },
    'PARTIALLY PAID': { bg: '#dbeafe', text: '#1d4ed8', border: '#93c5fd' },
    PENDING: { bg: '#fef3c7', text: '#b45309', border: '#fcd34d' }
  };
  const sc = statusColors[status] || statusColors.PENDING;

  // Build line items rows
  const itemRows = items.map((item, idx) => {
    const qty = parseFloat(item.qty) || 1;
    const rate = parseFloat(item.rate || item.amount) || 0;
    const lineTotal = parseFloat(item.amount) || (qty * rate);
    const rowBg = idx % 2 === 0 ? '#ffffff' : '#f8fafc';

    return `
      <tr style="background-color: ${rowBg}; border-bottom: 1px solid #e2e8f0;">
        <td style="padding: 12px 16px; font-size: 14px; color: #1e293b; font-weight: 500; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
          ${item.description || 'Service Deliverable'}
        </td>
        <td style="padding: 12px 16px; font-size: 14px; color: #475569; text-align: center; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
          ${qty}
        </td>
        <td style="padding: 12px 16px; font-size: 14px; color: #475569; text-align: right; font-family: 'SF Pro Text', Menlo, monospace;">
          ₹${rate.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
        </td>
        <td style="padding: 12px 16px; font-size: 14px; color: #0f172a; font-weight: 600; text-align: right; font-family: 'SF Pro Text', Menlo, monospace;">
          ₹${lineTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
        </td>
      </tr>
    `;
  }).join('');

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Invoice ${invoiceId} — Infronix Web Agency</title>
</head>
<body style="margin: 0; padding: 24px 12px; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b; -webkit-font-smoothing: antialiased;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
    <tr>
      <td align="center">
        <!-- Main Card Container -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 680px; background-color: #ffffff; border-radius: 8px; overflow: hidden; border: 1px solid #cbd5e1; box-shadow: 0 4px 12px rgba(0,0,0,0.06);">
          
          <!-- Header Banner -->
          <tr>
            <td style="background-color: #1C2541; padding: 32px 28px; border-bottom: 3px solid #E5D4B1;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="vertical-align: top;">
                    <div style="font-size: 26px; font-weight: 700; color: #ffffff; letter-spacing: 0.5px; margin: 0; font-family: 'Georgia', 'Playfair Display', serif;">
                      INFRONIX
                    </div>
                    <div style="font-size: 11px; font-weight: 600; color: #E5D4B1; text-transform: uppercase; letter-spacing: 2px; margin-top: 4px;">
                      Web Agency
                    </div>
                    <div style="font-size: 11px; color: #94a3b8; margin-top: 6px;">
                      Web Development &middot; SEO &middot; AI Automation
                    </div>
                  </td>
                  <td align="right" style="vertical-align: top;">
                    <div style="font-size: 22px; font-weight: 700; color: #E5D4B1; letter-spacing: 1px; text-transform: uppercase;">
                      INVOICE
                    </div>
                    <div style="font-size: 13px; font-weight: 600; color: #ffffff; margin-top: 4px; font-family: monospace;">
                      ${invoiceId}
                    </div>
                    <div style="margin-top: 8px;">
                      <span style="display: inline-block; padding: 4px 10px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; background-color: ${sc.bg}; color: ${sc.text}; border: 1px solid ${sc.border}; border-radius: 4px;">
                        ${status}
                      </span>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Bill To / From Section -->
          <tr>
            <td style="padding: 28px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td width="50%" style="vertical-align: top; padding-right: 16px;">
                    <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: #64748b; margin-bottom: 8px;">
                      BILLED TO
                    </div>
                    <div style="font-size: 16px; font-weight: 700; color: #0f172a; margin-bottom: 4px;">
                      ${clientName}
                    </div>
                    ${companyName ? `<div style="font-size: 13px; font-weight: 500; color: #334155; margin-bottom: 4px;">${companyName}</div>` : ''}
                    ${clientEmail ? `<div style="font-size: 13px; color: #64748b; margin-bottom: 4px;">${clientEmail}</div>` : ''}
                    ${client?.phone ? `<div style="font-size: 13px; color: #64748b;">${client.phone}</div>` : ''}
                  </td>
                  <td width="50%" style="vertical-align: top; padding-left: 16px; border-left: 1px solid #e2e8f0;">
                    <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: #64748b; margin-bottom: 8px;">
                      ISSUED BY
                    </div>
                    <div style="font-size: 15px; font-weight: 700; color: #0f172a; margin-bottom: 4px;">
                      Infronix Web Agency
                    </div>
                    <div style="font-size: 13px; color: #475569; margin-bottom: 4px;">
                      support@infronixweb.in
                    </div>
                    <div style="font-size: 13px; color: #64748b; margin-bottom: 4px;">
                      Sanand, Ahmedabad, Gujarat, India
                    </div>
                    <div style="font-size: 13px; color: #1e40af;">
                      <a href="https://www.infronixweb.in" style="color: #1e40af; text-decoration: none;">www.infronixweb.in</a>
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Invoice Metadata Badges -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top: 20px; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 12px 16px;">
                <tr>
                  <td width="33%" style="font-size: 12px; color: #475569;">
                    <span style="color: #64748b; font-weight: 600;">Issue Date:</span> ${issueDate}
                  </td>
                  <td width="33%" style="font-size: 12px; color: #475569; text-align: center;">
                    ${dueDate ? `<span style="color: #64748b; font-weight: 600;">Due Date:</span> ${dueDate}` : `<span style="color: #64748b; font-weight: 600;">Terms:</span> Due on Receipt`}
                  </td>
                  <td width="33%" style="font-size: 12px; color: #475569; text-align: right;">
                    ${client?.service ? `<span style="color: #64748b; font-weight: 600;">Service:</span> ${client.service}` : `<span style="color: #64748b; font-weight: 600;">Currency:</span> INR (₹)`}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Line Items Table -->
          <tr>
            <td style="padding: 0 28px 20px 28px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; width: 100%;">
                <thead>
                  <tr style="background-color: #1C2541; color: #ffffff;">
                    <th style="padding: 12px 16px; text-align: left; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">Description</th>
                    <th style="padding: 12px 16px; text-align: center; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; width: 60px;">Qty</th>
                    <th style="padding: 12px 16px; text-align: right; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; width: 110px;">Rate (₹)</th>
                    <th style="padding: 12px 16px; text-align: right; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; width: 120px;">Amount (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemRows}
                </tbody>
              </table>
            </td>
          </tr>

          <!-- Summary & Totals -->
          <tr>
            <td style="padding: 0 28px 28px 28px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td width="50%" style="vertical-align: top; padding-right: 16px;">
                    ${paymentMethod || transactionId ? `
                      <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 14px; font-size: 12px; margin-bottom: 12px;">
                        <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #475569; margin-bottom: 6px;">Payment Information</div>
                        ${paymentMethod ? `<div style="color: #334155; margin-bottom: 3px;"><strong>Method:</strong> ${paymentMethod}</div>` : ''}
                        ${transactionId ? `<div style="color: #334155; margin-bottom: 3px;"><strong>Ref / Txn ID:</strong> ${transactionId}</div>` : ''}
                        ${paymentDate ? `<div style="color: #334155;"><strong>Date:</strong> ${paymentDate}</div>` : ''}
                      </div>
                    ` : `
                      <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 14px; font-size: 12px; color: #64748b; margin-bottom: 12px;">
                        <strong style="color: #334155;">Payment Notes:</strong><br>
                        Bank transfers & UPI accepted. Work begins upon deposit confirmation.
                      </div>
                    `}

                    ${enableUpi && upiId ? `
                      <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 6px; padding: 14px; font-size: 12px;">
                        <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #166534; margin-bottom: 6px;">⚡ Instant UPI Payment</div>
                        <div style="color: #14532d; margin-bottom: 4px;"><strong>UPI VPA ID:</strong> <span style="font-family: monospace; font-weight: 700; background: #dcfce7; padding: 2px 6px; border-radius: 4px;">${upiId}</span></div>
                        <div style="color: #166534; font-size: 11px; margin-bottom: 8px;">Payee: ${upiPayeeName}</div>
                        <div style="margin-top: 8px;">
                          <a href="upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(upiPayeeName)}&am=${(parseFloat(upiAmount) || balanceDue).toFixed(2)}&cu=INR&tn=${encodeURIComponent('Invoice ' + invoiceId)}" style="display: inline-block; background-color: #16a34a; color: #ffffff; text-decoration: none; padding: 6px 14px; font-size: 11px; font-weight: 700; border-radius: 4px; text-transform: uppercase; letter-spacing: 0.5px;">
                            Tap to Pay ₹${(parseFloat(upiAmount) || balanceDue).toLocaleString('en-IN', { minimumFractionDigits: 2 })} via UPI
                          </a>
                        </div>
                      </div>
                    ` : ''}
                  </td>
                  <td width="50%" style="vertical-align: top; padding-left: 16px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="font-size: 13px;">
                      <tr>
                        <td style="padding: 6px 0; color: #64748b;">Subtotal:</td>
                        <td align="right" style="padding: 6px 0; font-family: monospace; font-weight: 600; color: #334155;">
                          ₹${subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 6px 0; color: #64748b;">Tax (${taxRate}%):</td>
                        <td align="right" style="padding: 6px 0; font-family: monospace; font-weight: 600; color: #334155;">
                          ₹${taxAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </td>
                      </tr>
                      <tr style="border-top: 2px solid #1C2541;">
                        <td style="padding: 10px 0 6px 0; font-size: 15px; font-weight: 700; color: #0f172a; text-transform: uppercase; letter-spacing: 0.5px;">Total:</td>
                        <td align="right" style="padding: 10px 0 6px 0; font-size: 16px; font-family: monospace; font-weight: 700; color: #0f172a;">
                          ₹${total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </td>
                      </tr>
                      ${amountPaid > 0 ? `
                        <tr>
                          <td style="padding: 6px 0; color: #16a34a; font-weight: 600;">Amount Paid:</td>
                          <td align="right" style="padding: 6px 0; font-family: monospace; font-weight: 600; color: #16a34a;">
                            - ₹${amountPaid.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                          </td>
                        </tr>
                      ` : ''}
                      <tr style="border-top: 1px solid #cbd5e1;">
                        <td style="padding: 8px 0; font-size: 14px; font-weight: 700; color: #b45309; text-transform: uppercase;">Balance Due:</td>
                        <td align="right" style="padding: 8px 0; font-size: 16px; font-family: monospace; font-weight: 800; color: #b45309;">
                          ₹${balanceDue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Terms & Conditions Section -->
          <tr>
            <td style="padding: 20px 28px; background-color: #f8fafc; border-top: 1px solid #e2e8f0; font-size: 11px; color: #64748b; line-height: 1.6;">
              <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #334155; margin-bottom: 8px;">
                Terms & Conditions Summary
              </div>
              <p style="margin: 0 0 6px 0;"><strong>1. Payments:</strong> Work begins strictly upon confirmation of the agreed deposit. Deposits reserve dedicated engineering schedule.</p>
              <p style="margin: 0 0 6px 0;"><strong>2. Scope & IP:</strong> Custom project deliverables ownership transfers upon final payment. Complete terms apply at <a href="https://www.infronixweb.in/terms-and-conditions" style="color: #1C2541; font-weight: 600; text-decoration: underline;">infronixweb.in/terms-and-conditions</a>.</p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #1C2541; padding: 20px 28px; text-align: center; color: #94a3b8; font-size: 11px; border-top: 2px solid #E5D4B1;">
              <div style="color: #ffffff; font-weight: 600; font-size: 12px; margin-bottom: 4px;">
                Thank you for choosing Infronix Web Agency.
              </div>
              <div>
                <a href="https://www.infronixweb.in" style="color: #E5D4B1; text-decoration: none;">www.infronixweb.in</a> &middot; 
                <a href="mailto:support@infronixweb.in" style="color: #E5D4B1; text-decoration: none;">support@infronixweb.in</a>
              </div>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

/**
 * Dispatch Invoice Email to Client
 */
export async function sendInvoiceMail({ client, invoice, customMessage = '' }) {
  if (!client?.email || !client.email.includes('@')) {
    throw new Error('A valid client email address is required.');
  }

  const invoiceHtml = generateInvoiceEmailHtml({ client, invoice });
  const clientName = `${client?.firstName || ''} ${client?.lastName || ''}`.trim() || 'Valued Client';
  const serviceName = client?.service || 'your project';
  const invoiceId = invoice?.invoiceId || `INV-${Date.now()}`;

  const plainTextBody = `
Hi ${clientName},

Please find your official invoice (${invoiceId}) for ${serviceName} from Infronix Web Agency below.

Invoice Details:
- Invoice ID: ${invoiceId}
- Issue Date: ${invoice.issueDate}
- Total Amount: ₹${(invoice.total || 0).toLocaleString('en-IN')}
- Balance Due: ₹${(invoice.balanceDue || 0).toLocaleString('en-IN')}
- Status: ${invoice.status || 'PENDING'}

${customMessage ? `\nNote from Agency:\n${customMessage}\n` : ''}

Thank you for choosing Infronix Web Agency.
Website: https://www.infronixweb.in
Support: support@infronixweb.in
  `.trim();

  const subject = `Invoice ${invoiceId} — Infronix Web Agency`;

  return sendOutreachEmail({
    leadId: null,
    recipient: client.email.trim(),
    subject,
    body: plainTextBody,
    htmlOverride: invoiceHtml
  });
}
