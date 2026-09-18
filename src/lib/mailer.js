import nodemailer from 'nodemailer';
import path from 'path';
import fs from 'fs';

/**
 * Resolves the logo attachment for inline CID rendering
 */
function getLogoAttachment() {
  try {
    const logoPath = path.join(process.cwd(), 'public', 'dark-web-logo.png');
    if (fs.existsSync(logoPath)) {
      return [
        {
          filename: 'infronix-logo.png',
          path: logoPath,
          cid: 'infronix_logo'
        }
      ];
    }
  } catch (e) {
    console.warn('Could not load logo attachment:', e.message);
  }
  return [];
}

/**
 * Escapes unsafe characters for HTML email templates
 */
export function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Validates and retrieves server-side SMTP configuration
 */
export function getMailConfig() {
  const host = (process.env.SMTP_HOST || process.env.HOSTINGER_EMAIL_HOST || 'smtp.hostinger.com').trim();
  const portStr = (process.env.SMTP_PORT || process.env.HOSTINGER_EMAIL_PORT || '465').trim();
  const port = parseInt(portStr, 10);
  
  const secureEnv = process.env.SMTP_SECURE ? process.env.SMTP_SECURE.trim().toLowerCase() : undefined;
  const isSecure = secureEnv !== undefined ? secureEnv === 'true' : (port === 465);

  let user = (process.env.SMTP_USER || process.env.HOSTINGER_EMAIL || '').trim();
  let pass = (process.env.SMTP_PASSWORD || process.env.HOSTINGER_EMAIL_PASSWORD || '').trim();

  // Strip wrapping quotes if user placed quotes inside .env
  if ((user.startsWith('"') && user.endsWith('"')) || (user.startsWith("'") && user.endsWith("'"))) {
    user = user.slice(1, -1);
  }
  if ((pass.startsWith('"') && pass.endsWith('"')) || (pass.startsWith("'") && pass.endsWith("'"))) {
    pass = pass.slice(1, -1);
  }

  const fromEmail = (process.env.SMTP_FROM_EMAIL || user || 'notifications@infronixweb.in').trim();
  const fromName = (process.env.SMTP_FROM_NAME || 'InfronixWeb').trim();
  const adminEmail = (process.env.ADMIN_NOTIFICATION_EMAIL || process.env.ADMIN_EMAIL || user || 'admin@infronixweb.in').trim();

  const isConfigured = Boolean(user && pass && host);

  return {
    isConfigured,
    host,
    port,
    secure: isSecure,
    auth: { user, pass },
    fromEmail,
    fromName,
    adminEmail
  };
}

/**
 * Creates a Nodemailer transporter instance
 */
export function createMailTransporter() {
  const config = getMailConfig();

  if (!config.isConfigured) {
    throw new Error('SMTP credentials are not configured in server environment variables.');
  }

  return nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: {
      user: config.auth.user,
      pass: config.auth.pass
    },
    tls: {
      rejectUnauthorized: false
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000
  });
}

/**
 * Sends a secure email verification link to the customer
 */
export async function sendVerificationEmail(enquiry, plainTextToken, baseUrl = '') {
  const config = getMailConfig();
  if (!config.isConfigured) {
    console.warn('SMTP missing. Cannot send verification email.');
    return { success: false, status: 'Config Missing', error: 'SMTP credentials missing', messageId: null };
  }

  const name = escapeHtml(enquiry.full_name || 'Valued Customer');
  const targetBaseUrl = (baseUrl && !baseUrl.includes('localhost') && !baseUrl.includes('127.0.0.1'))
    ? baseUrl
    : (process.env.APP_BASE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://infronixweb.in');
  const verifyUrl = `${targetBaseUrl.replace(/\/$/, '')}/verify-enquiry?token=${plainTextToken}`;
  const expiryText = 'This link will expire in 30 minutes.';

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify your email to submit your InfronixWeb enquiry</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; color: #1e293b;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; padding: 32px 16px;">
    <tr>
      <td align="center">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
          <!-- Header with Logo -->
          <tr>
            <td style="background-color: #0b0d12; padding: 24px 32px; text-align: left;">
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td>
                    <a href="https://infronixweb.in" target="_blank" style="text-decoration: none; display: inline-block;">
                      <img src="cid:infronix_logo" alt="InfronixWeb" style="height: 38px; max-height: 44px; width: auto; display: block; border: 0;" />
                    </a>
                    <div style="font-size: 11px; color: #94a3b8; margin-top: 6px; letter-spacing: 0.5px; text-transform: uppercase;">Web Development • Digital Marketing • AI Automation</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 32px 32px 24px 32px;">
              <h1 style="margin: 0 0 16px 0; font-size: 22px; font-weight: 700; color: #0f172a;">Hello ${name},</h1>
              <p style="margin: 0 0 20px 0; font-size: 15px; line-height: 1.6; color: #334155;">
                Please verify your email address to complete your enquiry with <strong>InfronixWeb</strong>.
              </p>
              
              <div style="margin: 30px 0; text-align: center;">
                <a href="${verifyUrl}" style="display: inline-block; padding: 14px 28px; background-color: #4f46e5; color: #ffffff; font-weight: 600; text-decoration: none; border-radius: 8px; font-size: 15px;">Verify Email Address</a>
              </div>
              
              <p style="margin: 0 0 16px 0; font-size: 14px; color: #64748b;">
                ${expiryText}
              </p>
              
              <p style="margin: 0 0 0 0; font-size: 13px; color: #64748b; line-height: 1.5;">
                If you did not submit this enquiry, you can safely ignore this email.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; padding: 24px 32px; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0; font-size: 13px; color: #64748b; line-height: 1.5;">
                Regards,<br>
                <strong>The InfronixWeb Team</strong><br>
                <a href="https://infronixweb.in" style="color: #4f46e5; text-decoration: none;">infronixweb.in</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  const text = `
Hello ${name},

Please verify your email address to complete your enquiry with InfronixWeb.

Verify your email by clicking the link below:
${verifyUrl}

${expiryText}

If you did not submit this enquiry, you can safely ignore this email.

Regards,
InfronixWeb
https://infronixweb.in
  `.trim();

  try {
    const transporter = createMailTransporter();
    const info = await transporter.sendMail({
      from: `"${config.fromName}" <${config.fromEmail}>`,
      to: enquiry.email,
      subject: 'Verify your email to submit your InfronixWeb enquiry',
      html,
      text,
      attachments: getLogoAttachment()
    });

    console.log('Verification email sent:', info.messageId);
    return { success: true, status: 'Sent', error: null, messageId: info.messageId };
  } catch (err) {
    console.error('Failed to send verification email:', err.message);
    return { success: false, status: 'Failed', error: err.message, messageId: null };
  }
}

/**
 * Generates Customer Confirmation HTML & Plaintext
 */
export function generateCustomerEmailTemplate(enquiry) {
  const name = escapeHtml(enquiry.full_name || 'Valued Customer');
  const refId = escapeHtml(enquiry.reference_id || 'N/A');
  const service = escapeHtml(enquiry.selected_service || enquiry.form_type || 'Custom Service');
  const company = enquiry.company ? escapeHtml(enquiry.company) : null;
  const timeline = enquiry.preferred_start_date ? escapeHtml(enquiry.preferred_start_date) : null;

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>We received your enquiry — InfronixWeb</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; color: #1e293b;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; padding: 32px 16px;">
    <tr>
      <td align="center">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
          <!-- Header with Logo -->
          <tr>
            <td style="background-color: #0b0d12; padding: 24px 32px; text-align: left;">
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td>
                    <a href="https://infronixweb.in" target="_blank" style="text-decoration: none; display: inline-block;">
                      <img src="cid:infronix_logo" alt="InfronixWeb" style="height: 38px; max-height: 44px; width: auto; display: block; border: 0;" />
                    </a>
                    <div style="font-size: 11px; color: #94a3b8; margin-top: 6px; letter-spacing: 0.5px; text-transform: uppercase;">Web Development • Digital Marketing • AI Automation</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 32px 32px 24px 32px;">
              <h1 style="margin: 0 0 16px 0; font-size: 22px; font-weight: 700; color: #0f172a;">Hello ${name},</h1>
              <p style="margin: 0 0 20px 0; font-size: 15px; line-height: 1.6; color: #334155;">
                Thank you for contacting <strong>InfronixWeb</strong>. We have successfully received your enquiry.
              </p>

              <!-- Reference Badge Card -->
              <div style="background-color: #f1f5f9; border-left: 4px solid #3b82f6; padding: 16px 20px; border-radius: 6px; margin-bottom: 24px;">
                <div style="font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px;">Reference ID</div>
                <div style="font-size: 18px; font-weight: 800; color: #0f172a; font-family: monospace; margin-top: 2px;">${refId}</div>
              </div>

              <!-- Summary Table -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 24px; border-collapse: collapse;">
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; font-size: 14px; color: #64748b; width: 140px;">Requested Service</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; font-size: 14px; font-weight: 600; color: #0f172a;">${service}</td>
                </tr>
                ${company ? `
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; font-size: 14px; color: #64748b;">Company</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; font-size: 14px; font-weight: 600; color: #0f172a;">${company}</td>
                </tr>` : ''}
                ${timeline ? `
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; font-size: 14px; color: #64748b;">Timeline</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; font-size: 14px; font-weight: 600; color: #0f172a;">${timeline}</td>
                </tr>` : ''}
              </table>

              <p style="margin: 0 0 16px 0; font-size: 14px; line-height: 1.6; color: #475569;">
                Our team will review your requirements and reach out within 24 hours with the next steps or a tailored proposal.
              </p>
              <p style="margin: 0 0 24px 0; font-size: 14px; line-height: 1.6; color: #475569;">
                If you have any extra details or urgent requirements, simply reply directly to this email.
              </p>

              <div style="border-top: 1px solid #e2e8f0; padding-top: 20px; font-size: 14px; color: #64748b; line-height: 1.5;">
                Best regards,<br>
                <strong style="color: #0f172a;">InfronixWeb Team</strong><br>
                <span style="font-size: 12px; color: #94a3b8;">Web Development • Digital Marketing • AI Automation</span>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; padding: 20px 32px; border-top: 1px solid #e2e8f0; text-align: center; font-size: 12px; color: #94a3b8;">
              © ${new Date().getFullYear()} InfronixWeb. All rights reserved.<br>
              <a href="https://infronixweb.in" style="color: #3b82f6; text-decoration: none;">infronixweb.in</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  const text = `
Hello ${enquiry.full_name || 'Valued Customer'},

Thank you for contacting InfronixWeb. We have successfully received your enquiry.

Reference ID: ${enquiry.reference_id || 'N/A'}
Requested Service: ${enquiry.selected_service || enquiry.form_type || 'Custom Service'}
${enquiry.company ? `Company: ${enquiry.company}\n` : ''}${enquiry.preferred_start_date ? `Timeline: ${enquiry.preferred_start_date}\n` : ''}
Our team will review your requirements and contact you shortly within 24 hours.

If you need to add more information, simply reply directly to this email.

Regards,
InfronixWeb Team
Web Development, Digital Marketing and AI Automation
https://infronixweb.in
  `.trim();

  return { html, text };
}

/**
 * Generates Admin Notification HTML & Plaintext
 */
export function generateAdminEmailTemplate(enquiry, adminUrl) {
  const name = escapeHtml(enquiry.full_name || 'New Visitor');
  const email = escapeHtml(enquiry.email || 'N/A');
  const phone = escapeHtml(enquiry.phone || 'N/A');
  const company = enquiry.company ? escapeHtml(enquiry.company) : 'Not specified';
  const service = escapeHtml(enquiry.selected_service || enquiry.form_type || 'General');
  const formType = escapeHtml(enquiry.form_type || 'Website Form');
  const budget = enquiry.budget ? escapeHtml(enquiry.budget) : 'Not specified';
  const timeline = enquiry.preferred_start_date ? escapeHtml(enquiry.preferred_start_date) : 'Not specified';
  const contactMethod = escapeHtml(enquiry.preferred_contact_method || 'Email');
  const sourcePage = escapeHtml(enquiry.source_page || '/');
  const description = escapeHtml(enquiry.project_description || enquiry.message || 'No description provided');
  const refId = escapeHtml(enquiry.reference_id || 'N/A');
  const dateStr = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Website Enquiry: ${name} — ${service}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; padding: 32px 16px;">
    <tr>
      <td align="center">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 650px; background-color: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
          <!-- Header with Logo -->
          <tr>
            <td style="background-color: #0b0d12; padding: 22px 32px; border-bottom: 3px solid #3b82f6;">
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td>
                    <a href="https://infronixweb.in" target="_blank" style="text-decoration: none; display: inline-block;">
                      <img src="cid:infronix_logo" alt="InfronixWeb" style="height: 34px; max-height: 40px; width: auto; display: block; border: 0;" />
                    </a>
                    <div style="font-size: 11px; font-weight: 700; color: #3b82f6; text-transform: uppercase; letter-spacing: 1px; margin-top: 8px;">Founder OS Alert</div>
                    <h1 style="margin: 4px 0 0 0; font-size: 19px; font-weight: 800; color: #ffffff;">New Website Lead: ${name}</h1>
                  </td>
                  <td align="right" valign="top">
                    <span style="background-color: #1e293b; color: #94a3b8; font-size: 12px; font-family: monospace; padding: 4px 10px; border-radius: 4px; border: 1px solid #334155;">${refId}</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 28px 32px;">
              <div style="margin-bottom: 24px; display: flex; align-items: center; justify-content: space-between;">
                <span style="font-size: 13px; color: #64748b;">Source Form: <strong style="color: #0f172a;">${formType}</strong></span>
                <span style="font-size: 12px; color: #94a3b8;">${dateStr} (IST)</span>
              </div>

              <!-- Customer Info Table -->
              <h2 style="font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #475569; margin: 0 0 12px 0; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px;">Contact Information</h2>
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 24px; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; font-size: 14px; color: #64748b; width: 140px;">Full Name:</td>
                  <td style="padding: 8px 0; font-size: 14px; font-weight: 600; color: #0f172a;">${name}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-size: 14px; color: #64748b;">Email:</td>
                  <td style="padding: 8px 0; font-size: 14px; font-weight: 600; color: #3b82f6;"><a href="mailto:${email}" style="color: #3b82f6; text-decoration: none;">${email}</a></td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-size: 14px; color: #64748b;">Phone / WA:</td>
                  <td style="padding: 8px 0; font-size: 14px; font-weight: 600; color: #0f172a;">${phone}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-size: 14px; color: #64748b;">Company:</td>
                  <td style="padding: 8px 0; font-size: 14px; color: #0f172a;">${company}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-size: 14px; color: #64748b;">Preferred Method:</td>
                  <td style="padding: 8px 0; font-size: 14px; color: #0f172a;">${contactMethod}</td>
                </tr>
              </table>

              <!-- Project Info Table -->
              <h2 style="font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #475569; margin: 0 0 12px 0; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px;">Project Scope</h2>
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 24px; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; font-size: 14px; color: #64748b; width: 140px;">Service:</td>
                  <td style="padding: 8px 0; font-size: 14px; font-weight: 600; color: #0f172a;">${service}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-size: 14px; color: #64748b;">Budget:</td>
                  <td style="padding: 8px 0; font-size: 14px; font-weight: 600; color: #0f172a;">${budget}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-size: 14px; color: #64748b;">Target Timeline:</td>
                  <td style="padding: 8px 0; font-size: 14px; color: #0f172a;">${timeline}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-size: 14px; color: #64748b;">Source Page:</td>
                  <td style="padding: 8px 0; font-size: 14px; color: #64748b;">${sourcePage}</td>
                </tr>
              </table>

              <!-- Description Block -->
              <h2 style="font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #475569; margin: 0 0 12px 0;">Description / Requirements</h2>
              <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; padding: 16px 20px; border-radius: 8px; font-size: 14px; line-height: 1.6; color: #334155; white-space: pre-wrap; margin-bottom: 28px;">${description}</div>

              <!-- Action Link -->
              <div style="text-align: center; margin-bottom: 12px;">
                <a href="${adminUrl || 'https://infronixweb.in/admin'}" style="display: inline-block; background-color: #3b82f6; color: #ffffff; font-size: 14px; font-weight: 700; text-decoration: none; padding: 12px 28px; border-radius: 6px; letter-spacing: 0.5px;">
                  Open Founder OS Sales CRM &rarr;
                </a>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; padding: 16px 32px; border-top: 1px solid #e2e8f0; text-align: center; font-size: 12px; color: #94a3b8;">
              This notification was generated automatically by InfronixWeb Website. You can reply directly to this email to reach the client (${email}).
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  const text = `
NEW WEBSITE ENQUIRY
===================
Reference ID: ${enquiry.reference_id || 'N/A'}
Form Source: ${enquiry.form_type || 'Website Form'}
Date: ${dateStr} (IST)

CUSTOMER DETAILS:
- Name: ${enquiry.full_name || 'N/A'}
- Email: ${enquiry.email || 'N/A'}
- Phone: ${enquiry.phone || 'N/A'}
- Company: ${enquiry.company || 'Not specified'}
- Preferred Contact: ${enquiry.preferred_contact_method || 'Email'}

PROJECT DETAILS:
- Service: ${enquiry.selected_service || enquiry.form_type || 'General'}
- Budget: ${enquiry.budget || 'Not specified'}
- Timeline: ${enquiry.preferred_start_date || 'Not specified'}
- Source Page: ${enquiry.source_page || '/'}

MESSAGE / DETAILS:
${enquiry.project_description || enquiry.message || 'No description provided'}

FOUNDER OS CRM:
${adminUrl || 'https://infronixweb.in/admin'}
  `.trim();

  return { html, text };
}

/**
 * Sends customer confirmation email
 */
export async function sendCustomerConfirmationEmail(enquiry) {
  const config = getMailConfig();
  if (!config.isConfigured) {
    return {
      success: false,
      status: 'Configuration Missing',
      error: 'SMTP credentials missing from environment variables'
    };
  }

  if (!enquiry.email || !enquiry.email.includes('@')) {
    return {
      success: false,
      status: 'Failed',
      error: 'Invalid recipient customer email address'
    };
  }

  try {
    const transporter = createMailTransporter();
    const { html, text } = generateCustomerEmailTemplate(enquiry);

    const info = await transporter.sendMail({
      from: `"${config.fromName}" <${config.fromEmail}>`,
      to: enquiry.email.trim(),
      replyTo: config.adminEmail,
      subject: 'We received your enquiry — InfronixWeb',
      html,
      text,
      attachments: getLogoAttachment()
    });

    return {
      success: true,
      status: 'Sent',
      messageId: info.messageId || `cust_msg_${Date.now()}`
    };
  } catch (err) {
    console.error('Customer email delivery error:', err.message);
    return {
      success: false,
      status: 'Failed',
      error: (err.message || 'Customer email delivery failed').substring(0, 255)
    };
  }
}

/**
 * Sends admin notification email
 */
export async function sendAdminNotificationEmail(enquiry, baseUrl = '') {
  const config = getMailConfig();
  if (!config.isConfigured) {
    return {
      success: false,
      status: 'Configuration Missing',
      error: 'SMTP credentials missing from environment variables'
    };
  }

  const destination = config.adminEmail;
  if (!destination || !destination.includes('@')) {
    return {
      success: false,
      status: 'Failed',
      error: 'ADMIN_NOTIFICATION_EMAIL is not a valid email address'
    };
  }

  try {
    const transporter = createMailTransporter();
    const targetBaseUrl = (baseUrl && !baseUrl.includes('localhost') && !baseUrl.includes('127.0.0.1'))
      ? baseUrl
      : (process.env.APP_BASE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://infronixweb.in');
    const adminUrl = `${targetBaseUrl.replace(/\/$/, '')}/admin`;
    const { html, text } = generateAdminEmailTemplate(enquiry, adminUrl);

    const serviceName = enquiry.selected_service || enquiry.form_type || 'General Enquiry';
    const customerName = enquiry.full_name || 'Visitor';

    const info = await transporter.sendMail({
      from: `"InfronixWeb Website" <${config.fromEmail}>`,
      to: destination,
      replyTo: enquiry.email && enquiry.email.includes('@') ? enquiry.email.trim() : config.fromEmail,
      subject: `New website enquiry: ${customerName} — ${serviceName}`,
      html,
      text,
      attachments: getLogoAttachment()
    });

    return {
      success: true,
      status: 'Sent',
      messageId: info.messageId || `admin_msg_${Date.now()}`
    };
  } catch (err) {
    console.error('Admin email delivery error:', err.message);
    return {
      success: false,
      status: 'Failed',
      error: (err.message || 'Admin notification email delivery failed').substring(0, 255)
    };
  }
}
