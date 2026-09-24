import { query, initFounderOSDb } from '@/lib/founder_os_db';
import { logActivity } from '@/lib/audit_logger';
import { createMailTransporter, getMailConfig, escapeHtml } from '@/lib/mailer';

/**
 * Send an in-app + email notification to a client portal user.
 */
export async function notifyClient({
  clientId,
  portalUserId,
  projectId = null,
  title,
  message,
  actionUrl = null,
  category = 'General',
  sendEmail = true
}) {
  try {
    await initFounderOSDb();

    // 1. Insert in-app notification
    await query(`
      INSERT INTO founder_os_portal_notifications (
        recipient_type, portal_user_id, client_id, project_id, title, message, action_url, category
      ) VALUES ('Client', $1, $2, $3, $4, $5, $6, $7)
    `, [portalUserId, clientId, projectId, title, message, actionUrl, category]);

    // 2. Send email notification if enabled and user has valid email
    if (sendEmail && portalUserId) {
      const uRes = await query('SELECT full_name, email FROM founder_os_portal_users WHERE id = $1', [portalUserId]);
      if (uRes.rows.length > 0) {
        const { full_name, email } = uRes.rows[0];
        if (email) {
          sendPortalNotificationEmail({
            toEmail: email,
            recipientName: full_name,
            subject: title,
            messageText: message,
            actionUrl
          }).catch(err => console.warn('Client email notification skipped/failed:', err.message));
        }
      }
    }
  } catch (err) {
    console.warn('Could not record client notification:', err.message);
  }
}

/**
 * Notify Admin / Founder OS about client activity (Change Request, File Upload, Approval, Login).
 */
export async function notifyAdminAboutClientAction({
  clientId,
  clientName,
  portalUserId,
  projectId = null,
  projectName = null,
  actionTitle,
  details,
  category = 'Client Action'
}) {
  try {
    await initFounderOSDb();

    // 1. Log to Founder OS Activity Logs
    await logActivity(
      `${clientName || 'Client'} (Portal)`,
      'Client Portal',
      projectId || clientId,
      actionTitle,
      details
    );

    // 2. Insert into admin notifications (recipient_type = 'Admin')
    await query(`
      INSERT INTO founder_os_portal_notifications (
        recipient_type, portal_user_id, client_id, project_id, title, message, action_url, category
      ) VALUES ('Admin', $1, $2, $3, $4, $5, $6, $7)
    `, [
      portalUserId,
      clientId,
      projectId,
      `Client Action: ${actionTitle}`,
      `${clientName} - ${details}`,
      projectId ? `/admin?tab=delivery&projectId=${projectId}` : `/admin?tab=clients&clientId=${clientId}`,
      category
    ]);

    // 3. Send email to admin notification email
    const mailConfig = getMailConfig();
    if (mailConfig.isConfigured && mailConfig.adminEmail) {
      const transporter = createMailTransporter();
      const baseUrl = process.env.APP_BASE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://infronixweb.in';
      const dashboardLink = projectId 
        ? `${baseUrl}/admin` 
        : `${baseUrl}/admin`;

      const html = `
        <div style="font-family: Arial, sans-serif; background-color: #f8fafc; padding: 24px; color: #1e293b;">
          <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
            <div style="background-color: #7c3aed; padding: 20px; text-align: center; color: #ffffff;">
              <h2 style="margin: 0; font-size: 20px;">Client Portal Notification</h2>
            </div>
            <div style="padding: 24px;">
              <p style="font-size: 14px; margin-bottom: 8px;"><strong>Client:</strong> ${escapeHtml(clientName)}</p>
              ${projectName ? `<p style="font-size: 14px; margin-bottom: 8px;"><strong>Project:</strong> ${escapeHtml(projectName)}</p>` : ''}
              <p style="font-size: 14px; margin-bottom: 16px;"><strong>Action:</strong> ${escapeHtml(actionTitle)}</p>
              <div style="background-color: #f1f5f9; padding: 16px; border-radius: 8px; font-size: 14px; line-height: 1.5; margin-bottom: 24px;">
                ${escapeHtml(details)}
              </div>
              <div style="text-align: center;">
                <a href="${escapeHtml(dashboardLink)}" style="display: inline-block; background-color: #7c3aed; color: #ffffff; padding: 10px 20px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 14px;">Open Founder OS</a>
              </div>
            </div>
          </div>
        </div>
      `;

      await transporter.sendMail({
        from: `"${mailConfig.fromName}" <${mailConfig.fromEmail}>`,
        to: mailConfig.adminEmail,
        subject: `[Portal Action] ${actionTitle} - ${clientName}`,
        html
      });
    }
  } catch (err) {
    console.warn('Could not record admin notification:', err.message);
  }
}

/**
 * Send an email to client for invitation or general portal updates.
 */
export async function sendPortalNotificationEmail({
  toEmail,
  recipientName,
  subject,
  messageText,
  actionUrl = null,
  actionButtonText = 'View in Client Portal'
}) {
  const mailConfig = getMailConfig();
  if (!mailConfig.isConfigured) return;

  const transporter = createMailTransporter();
  const baseUrl = process.env.APP_BASE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://infronixweb.in';
  const fullActionUrl = actionUrl ? (actionUrl.startsWith('http') ? actionUrl : `${baseUrl}${actionUrl}`) : `${baseUrl}/client/dashboard`;

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8fafc; padding: 32px 16px; color: #0f172a;">
      <div style="max-width: 580px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
        <div style="background: linear-gradient(135deg, #6d28d9, #4f46e5); padding: 28px 24px; text-align: center;">
          <h1 style="color: #ffffff; font-size: 22px; font-weight: 700; margin: 0; letter-spacing: -0.5px;">InfronixWeb Client Portal</h1>
          <p style="color: #e0e7ff; font-size: 13px; margin: 6px 0 0 0;">Executive Project Workspace</p>
        </div>
        <div style="padding: 32px 24px;">
          <p style="font-size: 15px; margin: 0 0 16px 0;">Hello <strong>${escapeHtml(recipientName || 'Valued Client')}</strong>,</p>
          <div style="font-size: 14px; line-height: 1.6; color: #334155; margin-bottom: 28px; background: #f8fafc; padding: 18px; border-radius: 12px; border: 1px solid #f1f5f9;">
            ${escapeHtml(messageText)}
          </div>
          <div style="text-align: center; margin-bottom: 24px;">
            <a href="${escapeHtml(fullActionUrl)}" style="display: inline-block; background-color: #6d28d9; color: #ffffff; padding: 12px 28px; border-radius: 10px; font-weight: 600; font-size: 14px; text-decoration: none; box-shadow: 0 2px 4px rgba(109,40,217,0.3);">
              ${escapeHtml(actionButtonText)}
            </a>
          </div>
          <p style="font-size: 12px; color: #94a3b8; text-align: center; margin: 0;">
            Need help? Reply to this email or contact your InfronixWeb Project Manager.
          </p>
        </div>
      </div>
    </div>
  `;

  await transporter.sendMail({
    from: `"${mailConfig.fromName}" <${mailConfig.fromEmail}>`,
    to: toEmail,
    subject: `InfronixWeb: ${subject}`,
    html
  });
}
