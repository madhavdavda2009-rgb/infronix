import nodemailer from 'nodemailer';
import { execute } from '../db.js';

/**
 * Creates a Nodemailer transporter using Hostinger SMTP credentials
 */
function createSmtpTransporter() {
  const host = process.env.HOSTINGER_EMAIL_HOST || 'smtp.hostinger.com';
  const port = parseInt(process.env.HOSTINGER_EMAIL_PORT || '465', 10);
  const user = process.env.HOSTINGER_EMAIL;
  const pass = process.env.HOSTINGER_EMAIL_PASSWORD;

  if (!user || !pass) {
    throw new Error('Hostinger email credentials are not configured in environment variables (HOSTINGER_EMAIL, HOSTINGER_EMAIL_PASSWORD).');
  }

  const isSecure = port === 465;

  return nodemailer.createTransport({
    host,
    port,
    secure: isSecure, // true for 465, false for 587
    auth: {
      user,
      pass
    },
    tls: {
      rejectUnauthorized: false
    }
  });
}

/**
 * Format plain text email to clean standard HTML
 */
function formatHtmlEmail(bodyText) {
  const sanitized = bodyText
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  const formattedParagraphs = sanitized
    .split(/\n\n+/)
    .map(p => `<p style="margin: 0 0 16px 0; line-height: 1.6; color: #222222; font-size: 15px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">${p.replace(/\n/g, '<br/>')}</p>`)
    .join('');

  return `
    <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
      ${formattedParagraphs}
    </div>
  `;
}

/**
 * Check Hostinger connection status (Supports SDK API or SMTP)
 */
export async function verifySmtpConnection() {
  const apiToken = process.env.HOSTINGER_API_TOKEN;
  const mailboxId = process.env.HOSTINGER_MAILBOX_ID;
  const smtpUser = process.env.HOSTINGER_EMAIL;
  const hasSmtpPass = Boolean(process.env.HOSTINGER_EMAIL_PASSWORD);
  const host = process.env.HOSTINGER_EMAIL_HOST || 'smtp.hostinger.com';
  const port = parseInt(process.env.HOSTINGER_EMAIL_PORT || '465', 10);

  // 1. Check Hostinger Mail API SDK if configured
  if (apiToken && mailboxId) {
    try {
      const { Configuration, AccountApi } = await import('hostinger-mail-api-sdk');
      const config = new Configuration({ accessToken: apiToken });
      const accountApi = new AccountApi(config);
      const res = await accountApi.getCurrentAccount();
      const mailboxList = res?.data?.data?.mailboxes || [];
      const matchingMailbox = mailboxList.find(m => m.resourceId === mailboxId) || mailboxList[0];
      const detectedEmail = matchingMailbox?.address || smtpUser || 'Hostinger Mailbox';

      return {
        configured: true,
        connected: true,
        mode: 'HOSTINGER_API_SDK',
        senderEmail: detectedEmail,
        host: 'api.mail.hostinger.com',
        port: 443,
        message: `Connected successfully to Hostinger Mail API SDK (${detectedEmail}).`
      };
    } catch (err) {
      return {
        configured: true,
        connected: false,
        mode: 'HOSTINGER_API_SDK',
        senderEmail: smtpUser || null,
        host: 'api.mail.hostinger.com',
        port: 443,
        message: `Hostinger API SDK check failed: ${err.message}`
      };
    }
  }

  // 2. Fallback to Hostinger SMTP
  if (!smtpUser || !hasSmtpPass) {
    return {
      configured: false,
      connected: false,
      mode: 'HOSTINGER_SMTP',
      senderEmail: smtpUser || null,
      host,
      port,
      message: 'Hostinger credentials (HOSTINGER_EMAIL & HOSTINGER_EMAIL_PASSWORD or HOSTINGER_API_TOKEN) are not set in .env'
    };
  }

  try {
    const transporter = createSmtpTransporter();
    await transporter.verify();
    return {
      configured: true,
      connected: true,
      mode: 'HOSTINGER_SMTP',
      senderEmail: smtpUser,
      host,
      port,
      message: 'Connected successfully to Hostinger SMTP.'
    };
  } catch (err) {
    return {
      configured: true,
      connected: false,
      mode: 'HOSTINGER_SMTP',
      senderEmail: smtpUser,
      host,
      port,
      message: `SMTP connection check failed: ${err.message}`
    };
  }
}

/**
 * Send Cold Outreach Email (Supports Hostinger Mail API SDK or SMTP)
 */
export async function sendOutreachEmail({ leadId, recipient, subject, body, draftId = null }) {
  if (!recipient || !recipient.includes('@')) {
    throw new Error('A valid recipient email address is required.');
  }

  if (!subject || subject.trim().length === 0) {
    throw new Error('Email subject cannot be empty.');
  }

  if (!body || body.trim().length === 0) {
    throw new Error('Email body content cannot be empty.');
  }

  const apiToken = process.env.HOSTINGER_API_TOKEN;
  const mailboxId = process.env.HOSTINGER_MAILBOX_ID;
  const fromName = process.env.HOSTINGER_FROM_NAME || 'Infronix Web Agency';
  let messageId = null;

  try {
    // 1. Use Hostinger Mail API SDK if token and mailbox are provided
    if (apiToken && mailboxId) {
      const { Configuration, SendApi } = await import('hostinger-mail-api-sdk');
      const config = new Configuration({ accessToken: apiToken });
      const sendApi = new SendApi(config);

      await sendApi.sendEmail(mailboxId, {
        to: [recipient.trim()],
        subject: subject.trim(),
        text: body.trim(),
        html: formatHtmlEmail(body.trim()),
        displayName: fromName
      });

      messageId = `api_msg_${Date.now()}`;
    } else {
      // 2. Use Hostinger SMTP via Nodemailer
      const senderEmail = process.env.HOSTINGER_EMAIL;
      const fromAddress = `"${fromName}" <${senderEmail}>`;
      const transporter = createSmtpTransporter();

      const info = await transporter.sendMail({
        from: fromAddress,
        to: recipient.trim(),
        replyTo: senderEmail,
        subject: subject.trim(),
        text: body.trim(),
        html: formatHtmlEmail(body.trim())
      });

      messageId = info.messageId || `smtp_msg_${Date.now()}`;
    }

    // Insert into sent_emails table
    await execute(
      `INSERT INTO sent_emails (lead_id, recipient, subject, body, status, message_id, sent_at)
       VALUES (?, ?, ?, ?, 'Sent', ?, CURRENT_TIMESTAMP)`,
      [leadId || null, recipient.trim(), subject.trim(), body.trim(), messageId]
    );

    // Update lead status to 'Sent' if leadId is provided
    if (leadId) {
      await execute(
        `UPDATE leads SET status = 'Sent', updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
        [leadId]
      );
    }

    // Update draft status if draftId is provided
    if (draftId) {
      await execute(
        `UPDATE email_drafts SET status = 'Sent', updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
        [draftId]
      );
    }

    return {
      success: true,
      messageId,
      recipient,
      sentAt: new Date().toISOString()
    };
  } catch (err) {
    console.error('Email dispatch failed:', err.message);

    // Record failure in sent_emails for audit log
    try {
      await execute(
        `INSERT INTO sent_emails (lead_id, recipient, subject, body, status, error_message, sent_at)
         VALUES (?, ?, ?, ?, 'Failed', ?, CURRENT_TIMESTAMP)`,
        [leadId || null, recipient.trim(), subject.trim(), body.trim(), err.message]
      );
    } catch (dbErr) {
      console.error('Failed to log email failure to DB:', dbErr.message);
    }

    throw new Error(`Failed to send email via Hostinger: ${err.message}`);
  }
}
