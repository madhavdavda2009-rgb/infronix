import nodemailer from 'nodemailer';
import { execute } from '../db.js';

let cachedMailboxInfo = null;

/**
 * Helper to dynamically resolve mailbox resource ID from API Token
 */
async function resolveHostingerMailbox(apiToken, hint = '') {
  if (hint && hint.startsWith('AC') && !hint.includes('@')) {
    return { resourceId: hint, address: process.env.HOSTINGER_EMAIL || 'support@infronixweb.in' };
  }

  if (cachedMailboxInfo && cachedMailboxInfo.token === apiToken) {
    return cachedMailboxInfo;
  }

  const { Configuration, AccountApi } = await import('hostinger-mail-api-sdk');
  const config = new Configuration({ accessToken: apiToken });
  const accountApi = new AccountApi(config);
  const meRes = await accountApi.getCurrentAccount();
  const mailboxes = meRes?.data?.data?.mailboxes || [];

  if (mailboxes.length === 0) {
    throw new Error('No active mailboxes found for this Hostinger API token.');
  }

  const found = (hint ? mailboxes.find(m => m.address === hint || m.resourceId === hint) : null) || mailboxes[0];

  cachedMailboxInfo = {
    token: apiToken,
    resourceId: found.resourceId,
    address: found.address
  };

  return cachedMailboxInfo;
}

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
  if (apiToken) {
    try {
      const resolved = await resolveHostingerMailbox(apiToken, mailboxId || smtpUser);
      return {
        configured: true,
        connected: true,
        mode: 'HOSTINGER_API_SDK',
        senderEmail: resolved.address,
        mailboxResourceId: resolved.resourceId,
        host: 'api.mail.hostinger.com',
        port: 443,
        message: `Connected successfully to Hostinger Mail API SDK (${resolved.address}).`
      };
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message;
      return {
        configured: true,
        connected: false,
        mode: 'HOSTINGER_API_SDK',
        senderEmail: smtpUser || null,
        host: 'api.mail.hostinger.com',
        port: 443,
        message: `Hostinger API SDK check failed: ${errMsg}`
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
 * Send Outreach or Invoice Email (Supports Hostinger Mail API SDK or SMTP)
 */
export async function sendOutreachEmail({ leadId, recipient, subject, body, draftId = null, htmlOverride = null }) {
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
  const mailboxIdHint = process.env.HOSTINGER_MAILBOX_ID;
  const fromName = process.env.HOSTINGER_FROM_NAME || 'Infronix Web Agency';
  const htmlContent = htmlOverride || formatHtmlEmail(body.trim());
  let messageId = null;

  try {
    // 1. Use Hostinger Mail API SDK if API token is configured
    if (apiToken) {
      const resolved = await resolveHostingerMailbox(apiToken, mailboxIdHint);
      const { Configuration, SendApi } = await import('hostinger-mail-api-sdk');
      const config = new Configuration({ accessToken: apiToken });
      const sendApi = new SendApi(config);

      await sendApi.sendEmail(resolved.resourceId, {
        to: [recipient.trim()],
        subject: subject.trim(),
        text: body.trim(),
        html: htmlContent,
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
        html: htmlContent
      });

      messageId = info.messageId || `smtp_msg_${Date.now()}`;
    }

    // Insert into sent_emails table
    try {
      await execute(
        `INSERT INTO sent_emails (lead_id, recipient, subject, body, status, message_id, sent_at)
         VALUES (?, ?, ?, ?, 'Sent', ?, CURRENT_TIMESTAMP)`,
        [leadId || null, recipient.trim(), subject.trim(), body.trim(), messageId]
      );
    } catch (auditErr) {
      console.warn('Audit log write skipped:', auditErr.message);
    }

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
    const rawError = err.response?.data?.message || err.response?.data?.error || err.message;
    console.error('Email dispatch failed:', rawError);

    // Record failure in sent_emails for audit log
    try {
      await execute(
        `INSERT INTO sent_emails (lead_id, recipient, subject, body, status, error_message, sent_at)
         VALUES (?, ?, ?, ?, 'Failed', ?, CURRENT_TIMESTAMP)`,
        [leadId || null, recipient.trim(), subject.trim(), body.trim(), rawError]
      );
    } catch (dbErr) {
      console.error('Failed to log email failure to DB:', dbErr.message);
    }

    throw new Error(`Failed to send email via Hostinger: ${rawError}`);
  }
}
