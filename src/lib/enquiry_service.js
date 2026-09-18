import crypto from 'node:crypto';
import { Resolver, promises as dns } from 'node:dns';

import { getPool, initFounderOSDb } from './founder_os_db.js';
import { logActivity } from './audit_logger.js';
import {
  sendAdminNotificationEmail,
  sendCustomerConfirmationEmail,
  sendVerificationEmail,
} from './mailer.js';

const VERIFICATION_TTL_MINUTES = 30;
const MAX_VERIFICATION_ATTEMPTS = 3;
const RESEND_COOLDOWN_MS = 2 * 60 * 1000;

const KNOWN_VALID_EMAIL_DOMAINS = new Set([
  'gmail.com',
  'googlemail.com',
  'yahoo.com',
  'yahoo.co.in',
  'yahoo.co.uk',
  'outlook.com',
  'hotmail.com',
  'live.com',
  'msn.com',
  'icloud.com',
  'me.com',
  'mac.com',
  'proton.me',
  'protonmail.com',
  'zoho.com',
  'zoho.in',
  'infronixweb.in',
  'aol.com',
  'yandex.com',
  'mail.com',
  'gmx.com',
]);

let fallbackResolver = null;
function getFallbackResolver() {
  if (!fallbackResolver) {
    fallbackResolver = new Resolver();
    fallbackResolver.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4', '1.0.0.1']);
  }
  return fallbackResolver;
}

function cleanOptional(value, maxLength = 1_000) {
  if (value === undefined || value === null) return null;
  const cleaned = String(value).trim();
  return cleaned ? cleaned.slice(0, maxLength) : null;
}

function safeError(error) {
  return cleanOptional(error?.message || 'Email delivery failed', 1_000);
}

function normalizeMailResult(result) {
  return {
    status: result?.status || (result?.success ? 'Sent' : 'Failed'),
    messageId: result?.messageId || null,
    error: result?.error ? safeError(result.error) : null,
  };
}

function createToken() {
  const plainTextToken = crypto.randomBytes(32).toString('hex');
  return {
    plainTextToken,
    tokenHash: crypto.createHash('sha256').update(plainTextToken).digest('hex'),
  };
}

function resolveBaseUrl(candidate) {
  const configured = cleanOptional(
    process.env.APP_BASE_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SITE_URL,
    2_000
  );
  if (configured) {
    let urlString = configured;
    if (!urlString.startsWith('http://') && !urlString.startsWith('https://')) {
      urlString = `https://${urlString}`;
    }
    try {
      return new URL(urlString).origin;
    } catch {
      // ignore
    }
  }

  if (candidate) {
    let urlString = cleanOptional(candidate, 2_000);
    if (urlString) {
      if (!urlString.startsWith('http://') && !urlString.startsWith('https://')) {
        urlString = `https://${urlString}`;
      }
      try {
        const parsed = new URL(urlString);
        const isLocal = ['localhost', '127.0.0.1', '::1'].includes(parsed.hostname);
        if (!isLocal) {
          return parsed.origin;
        }
      } catch {
        // ignore
      }
    }
  }

  return 'https://infronixweb.in';
}

function createIdempotencyKey({ idempotencyKey, email, phone, description, formType }) {
  const provided = cleanOptional(idempotencyKey, 200);
  if (provided) return provided;

  // Deduplicate identical accidental retries in the same ten-minute window.
  const timeBucket = Math.floor(Date.now() / (10 * 60 * 1000));
  return crypto
    .createHash('sha256')
    .update([email, phone || '', description, formType, timeBucket].join('|'))
    .digest('hex');
}

async function withTransaction(callback) {
  await initFounderOSDb();
  const client = await getPool().connect();

  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

async function generateReferenceIdInTransaction(client) {
  const year = new Date().getUTCFullYear();
  const prefix = `IW-${year}-`;

  await client.query('SELECT pg_advisory_xact_lock(hashtext($1))', [
    `founder-os-enquiry-reference-${year}`,
  ]);

  const result = await client.query(
    `SELECT COALESCE(MAX(RIGHT(reference_id, 6)::integer), 0) AS last_number
       FROM founder_os_enquiries
      WHERE reference_id LIKE $1
        AND reference_id ~ $2`,
    [`${prefix}%`, `^IW-${year}-[0-9]{6}$`],
  );

  const nextNumber = Number(result.rows[0]?.last_number || 0) + 1;
  if (nextNumber > 999_999) {
    throw new Error(`Enquiry reference sequence exhausted for ${year}.`);
  }

  return `${prefix}${String(nextNumber).padStart(6, '0')}`;
}

/** Generate an atomic human-readable reference ID: IW-YYYY-XXXXXX. */
export async function generateReferenceId(client = null) {
  if (client) return generateReferenceIdInTransaction(client);
  return withTransaction(generateReferenceIdInTransaction);
}

export function hashIpAddress(ip) {
  const cleaned = cleanOptional(ip, 200);
  if (!cleaned) return null;
  const secret = process.env.IP_HASH_SECRET || process.env.JWT_SECRET;
  if (!secret) return null;
  return crypto.createHmac('sha256', secret).update(cleaned).digest('hex').slice(0, 32);
}

export function formatTitleCase(value) {
  const cleaned = cleanOptional(value, 255);
  if (!cleaned) return '';
  return cleaned
    .toLocaleLowerCase('en-IN')
    .split(/\s+/)
    .map((word) => word.charAt(0).toLocaleUpperCase('en-IN') + word.slice(1))
    .join(' ');
}

export function isValidEmail(email) {
  if (typeof email !== 'string') return false;
  const cleaned = email.trim();
  return cleaned.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleaned);
}

function parseEstimatedBudget(value) {
  const cleaned = cleanOptional(value, 100);
  if (!cleaned) return 0;
  const matches = cleaned.replaceAll(',', '').match(/\d+(?:\.\d+)?/g);
  if (!matches?.length) return 0;

  const amount = Number(matches[0]);
  return Number.isFinite(amount) && amount >= 0 ? amount : 0;
}

export async function validateEmailDomain(email) {
  if (!isValidEmail(email)) return false;
  const domain = email.trim().toLowerCase().split('@')[1];
  if (!domain) return false;

  // 1. Fast-path: Known valid public and agency email providers
  if (KNOWN_VALID_EMAIL_DOMAINS.has(domain)) {
    return true;
  }

  const resolveWithTimeout = (promise, ms = 2500) =>
    Promise.race([
      promise,
      new Promise((_, reject) => {
        const timer = setTimeout(() => reject(new Error('DNS_TIMEOUT')), ms);
        timer.unref?.();
      }),
    ]);

  // 2. Primary: System DNS MX resolution
  try {
    const records = await resolveWithTimeout(dns.resolveMx(domain));
    if (records && records.some((record) => record.exchange && Number.isFinite(record.priority))) {
      return true;
    }
  } catch (error) {
    const code = error?.code || error?.message;
    if (code === 'ENODATA' || code === 'NODATA') {
      // RFC 5321: Domain without MX may accept mail via direct A / AAAA record
      try {
        const aRecords = await resolveWithTimeout(dns.resolve4(domain));
        if (aRecords && aRecords.length > 0) return true;
      } catch {
        // Continue to fallback
      }
    }
  }

  // 3. Fallback: Public DNS Resolvers (Google 8.8.8.8 / Cloudflare 1.1.1.1)
  try {
    const resolver = getFallbackResolver();
    const records = await resolveWithTimeout(
      new Promise((resolve, reject) => {
        resolver.resolveMx(domain, (err, addresses) => {
          if (err) reject(err);
          else resolve(addresses);
        });
      }),
      2500,
    );
    if (records && records.some((record) => record.exchange && Number.isFinite(record.priority))) {
      return true;
    }
  } catch (error) {
    const code = error?.code || error?.message;
    // Conclusively non-existent domain in public DNS
    if (code === 'ENOTFOUND' || code === 'NXDOMAIN') {
      return false;
    }

    if (code === 'ENODATA' || code === 'NODATA') {
      try {
        const resolver = getFallbackResolver();
        const aRecords = await resolveWithTimeout(
          new Promise((resolve, reject) => {
            resolver.resolve4(domain, (err, addresses) => {
              if (err) reject(err);
              else resolve(addresses);
            });
          }),
          2000,
        );
        if (aRecords && aRecords.length > 0) return true;
      } catch {
        return false;
      }
    }

    // If local runtime / firewall / ISP blocked UDP port 53 / DNS queries (e.g. ECONNREFUSED, ETIMEOUT, SERVFAIL, EAI_AGAIN),
    // we bypass DNS blocking and let the cryptographic email verification link verify real inbox delivery.
    console.warn(`DNS MX check bypassed for domain "${domain}" due to resolver status (${code || 'UNKNOWN'}).`);
    return true;
  }

  return false;
}

async function updateVerificationDelivery(enquiryId, result) {
  const normalized = normalizeMailResult(result);
  await getPool().query(
    `UPDATE founder_os_enquiries
        SET customer_email_status = $1,
            customer_email_message_id = $2,
            last_email_error = $3,
            email_attempt_count = email_attempt_count + 1,
            updated_at = NOW()
      WHERE id = $4`,
    [normalized.status, normalized.messageId, normalized.error, enquiryId],
  );
  return normalized;
}

export async function processEnquirySubmission({
  fullName,
  email,
  phone,
  company,
  service,
  projectType,
  budget,
  timeline,
  projectDescription,
  message,
  preferredContactMethod,
  formType = 'Website Contact Form',
  sourcePage = '/',
  utmSource,
  utmMedium,
  utmCampaign,
  idempotencyKey,
  honeypot,
  clientIp,
  baseUrl = '',
}) {
  if (cleanOptional(honeypot, 500)) {
    // Do not reveal honeypot detection details to bots.
    return { success: true, referenceId: null, message: 'Your request has been received.' };
  }

  const cleanName = formatTitleCase(fullName);
  const cleanEmail = cleanOptional(email, 254)?.toLowerCase() || '';
  const cleanPhone = cleanOptional(phone, 30);
  const cleanCompany = company ? formatTitleCase(company) : null;
  const cleanDescription = cleanOptional(projectDescription || message, 10_000) || '';
  const cleanService = cleanOptional(service, 150) || 'General Enquiry';
  const cleanFormType = cleanOptional(formType, 150) || 'Website Contact Form';

  if (cleanName.length < 2) throw new Error('Please provide your full name.');
  if (!isValidEmail(cleanEmail)) throw new Error('Please provide a valid email address.');
  if (cleanDescription.length < 5) throw new Error('Please provide a brief message.');
  if (!(await validateEmailDomain(cleanEmail))) {
    throw new Error('The email domain cannot receive email. Please use another address.');
  }
  const safeBaseUrl = resolveBaseUrl(baseUrl);

  const effectiveIdempotencyKey = createIdempotencyKey({
    idempotencyKey,
    email: cleanEmail,
    phone: cleanPhone,
    description: cleanDescription,
    formType: cleanFormType,
  });
  const { plainTextToken, tokenHash } = createToken();

  const transactionResult = await withTransaction(async (client) => {
    await client.query('SELECT pg_advisory_xact_lock(hashtext($1))', [
      `founder-os-enquiry-${effectiveIdempotencyKey}`,
    ]);

    const existing = await client.query(
      'SELECT id, reference_id, customer_email_status FROM founder_os_enquiries WHERE idempotency_key = $1',
      [effectiveIdempotencyKey],
    );
    if (existing.rows[0]) return { duplicate: true, enquiry: existing.rows[0] };

    const referenceId = await generateReferenceIdInTransaction(client);
    const inserted = await client.query(
      `INSERT INTO founder_os_enquiries (
         reference_id, form_type, full_name, email, phone, company,
         selected_service, project_type, budget, preferred_start_date,
         project_description, message, preferred_contact_method, source_page,
         lead_source, utm_source, utm_medium, utm_campaign, status,
         customer_email_status, admin_email_status, email_attempt_count,
         idempotency_key, submitted_ip_hash, verification_token_hash,
         verification_expires_at, verification_attempts, created_at, updated_at
       ) VALUES (
         $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
         $11, $12, $13, $14, $15, $16, $17, $18,
         'Pending Verification', 'Pending', 'Pending', 0,
         $19, $20, $21, NOW() + ($22 * INTERVAL '1 minute'), 1, NOW(), NOW()
       ) RETURNING *`,
      [
        referenceId,
        cleanFormType,
        cleanName,
        cleanEmail,
        cleanPhone,
        cleanCompany,
        cleanService,
        cleanOptional(projectType, 150),
        cleanOptional(budget, 100),
        cleanOptional(timeline, 100),
        cleanDescription,
        cleanOptional(message, 10_000) || cleanDescription,
        cleanOptional(preferredContactMethod, 50) || 'Email',
        cleanOptional(sourcePage, 2_000) || '/',
        cleanFormType,
        cleanOptional(utmSource, 255),
        cleanOptional(utmMedium, 255),
        cleanOptional(utmCampaign, 255),
        effectiveIdempotencyKey,
        hashIpAddress(clientIp),
        tokenHash,
        VERIFICATION_TTL_MINUTES,
      ],
    );

    return { duplicate: false, enquiry: inserted.rows[0] };
  });

  if (transactionResult.duplicate) {
    return {
      success: true,
      referenceId: transactionResult.enquiry.reference_id,
      enquiryId: transactionResult.enquiry.id,
      customerEmailStatus: transactionResult.enquiry.customer_email_status,
      isDuplicate: true,
      message: 'Enquiry already recorded.',
    };
  }

  const enquiry = transactionResult.enquiry;
  let delivery;
  try {
    delivery = await sendVerificationEmail(enquiry, plainTextToken, safeBaseUrl);
  } catch (error) {
    delivery = { status: 'Failed', error: safeError(error) };
  }

  let emailStatus = normalizeMailResult(delivery);
  try {
    emailStatus = await updateVerificationDelivery(enquiry.id, delivery);
  } catch (error) {
    console.error('Could not record verification delivery status:', safeError(error));
  }

  return {
    success: true,
    referenceId: enquiry.reference_id,
    enquiryId: enquiry.id,
    customerEmailStatus: emailStatus.status,
    message:
      emailStatus.status === 'Sent'
        ? `Please check your inbox to verify your email address. Reference: ${enquiry.reference_id}.`
        : `Your enquiry was saved as ${enquiry.reference_id}, but the verification email could not be delivered. Please request another verification email.`,
  };
}

async function generateLeadIdInTransaction(client) {
  await client.query('SELECT pg_advisory_xact_lock(hashtext($1))', ['founder-os-lead-id']);
  const result = await client.query(
    `SELECT COALESCE(MAX(SUBSTRING(lead_id FROM 4)::integer), 1000) AS last_number
       FROM founder_os_leads
      WHERE lead_id ~ '^LD-[0-9]+$'`,
  );
  return `LD-${Number(result.rows[0]?.last_number || 1000) + 1}`;
}

export async function verifyEnquiryToken(plainTextToken, baseUrl = '') {
  if (typeof plainTextToken !== 'string' || plainTextToken.length !== 64) {
    throw new Error('Invalid or expired verification link.');
  }
  const tokenHash = crypto.createHash('sha256').update(plainTextToken).digest('hex');
  const safeBaseUrl = resolveBaseUrl(baseUrl);

  const { enquiry, lead } = await withTransaction(async (client) => {
    const enquiryResult = await client.query(
      `SELECT * FROM founder_os_enquiries
        WHERE verification_token_hash = $1
        FOR UPDATE`,
      [tokenHash],
    );
    const record = enquiryResult.rows[0];
    if (!record || record.status !== 'Pending Verification') {
      throw new Error('Invalid or expired verification link.');
    }
    if (!record.verification_expires_at || new Date(record.verification_expires_at) <= new Date()) {
      throw new Error('Verification link has expired. Please request a new one.');
    }

    const existingLead = await client.query(
      `SELECT id, lead_id, name
         FROM founder_os_leads
        WHERE email IS NOT NULL AND LOWER(email) = LOWER($1)
        ORDER BY id ASC
        LIMIT 1
        FOR UPDATE`,
      [record.email],
    );

    let leadRecord = existingLead.rows[0];
    if (leadRecord) {
      await client.query(
        `UPDATE founder_os_leads
            SET updated_at = NOW(),
                notes = CONCAT_WS(E'\n\n', NULLIF(notes, ''), $1)
          WHERE id = $2`,
        [
          `[Verified enquiry ${record.reference_id}] ${record.project_description || record.message || ''}`,
          leadRecord.id,
        ],
      );
    } else {
      const leadId = await generateLeadIdInTransaction(client);
      const insertedLead = await client.query(
        `INSERT INTO founder_os_leads (
           lead_id, name, company, phone, email, source, industry,
           status, estimated_value, notes, created_at, updated_at
         ) VALUES ($1, $2, $3, $4, $5, $6, $7, 'New', $8, $9, NOW(), NOW())
         RETURNING *`,
        [
          leadId,
          record.full_name,
          record.company,
          record.phone,
          record.email,
          record.form_type || 'Website',
          record.selected_service,
          parseEstimatedBudget(record.budget),
          record.project_description || record.message,
        ],
      );
      leadRecord = insertedLead.rows[0];
    }

    const updatedEnquiry = await client.query(
      `UPDATE founder_os_enquiries
          SET status = 'New',
              lead_id = $1,
              verification_token_hash = NULL,
              verification_expires_at = NULL,
              updated_at = NOW()
        WHERE id = $2
        RETURNING *`,
      [leadRecord.id, record.id],
    );

    return { enquiry: updatedEnquiry.rows[0], lead: leadRecord };
  });

  try {
    await logActivity(
      'Website',
      'Lead',
      lead.id,
      'Verified Enquiry Linked',
      `Verified enquiry ${enquiry.reference_id} from ${enquiry.full_name}`,
    );
  } catch (error) {
    console.warn('Could not write enquiry activity log:', safeError(error));
  }

  const [customerSettled, adminSettled] = await Promise.allSettled([
    sendCustomerConfirmationEmail(enquiry),
    sendAdminNotificationEmail(enquiry, safeBaseUrl),
  ]);
  const customer = normalizeMailResult(
    customerSettled.status === 'fulfilled'
      ? customerSettled.value
      : { status: 'Failed', error: safeError(customerSettled.reason) },
  );
  const admin = normalizeMailResult(
    adminSettled.status === 'fulfilled'
      ? adminSettled.value
      : { status: 'Failed', error: safeError(adminSettled.reason) },
  );
  const combinedError = [
    customer.error ? `Customer: ${customer.error}` : null,
    admin.error ? `Admin: ${admin.error}` : null,
  ]
    .filter(Boolean)
    .join(' | ');

  try {
    await getPool().query(
      `UPDATE founder_os_enquiries
          SET customer_email_status = $1,
              customer_email_message_id = $2,
              admin_email_status = $3,
              admin_email_message_id = $4,
              email_attempt_count = email_attempt_count + 2,
              last_email_error = $5,
              updated_at = NOW()
        WHERE id = $6`,
      [
        customer.status,
        customer.messageId,
        admin.status,
        admin.messageId,
        combinedError || null,
        enquiry.id,
      ],
    );
  } catch (error) {
    console.error('Could not record final email delivery status:', safeError(error));
  }

  return {
    success: true,
    enquiry,
    customerEmailStatus: customer.status,
    adminEmailStatus: admin.status,
  };
}

export async function resendVerificationEmail(enquiryId, _clientIp, baseUrl = '') {
  if (!Number.isInteger(Number(enquiryId)) || Number(enquiryId) <= 0) {
    throw new Error('Invalid enquiry ID.');
  }
  const { plainTextToken, tokenHash } = createToken();
  const safeBaseUrl = resolveBaseUrl(baseUrl);

  const enquiry = await withTransaction(async (client) => {
    const result = await client.query(
      'SELECT * FROM founder_os_enquiries WHERE id = $1 FOR UPDATE',
      [enquiryId],
    );
    const record = result.rows[0];
    if (!record) throw new Error('Enquiry not found.');
    if (record.status !== 'Pending Verification') {
      throw new Error('This enquiry does not require verification.');
    }
    if (Number(record.verification_attempts || 0) >= MAX_VERIFICATION_ATTEMPTS) {
      throw new Error('Maximum verification attempts reached. Please submit a new enquiry.');
    }
    if (record.updated_at && Date.now() - new Date(record.updated_at).getTime() < RESEND_COOLDOWN_MS) {
      throw new Error('Please wait before requesting another verification email.');
    }

    const updated = await client.query(
      `UPDATE founder_os_enquiries
          SET verification_token_hash = $1,
              verification_expires_at = NOW() + ($2 * INTERVAL '1 minute'),
              verification_attempts = verification_attempts + 1,
              customer_email_status = 'Pending',
              last_email_error = NULL,
              updated_at = NOW()
        WHERE id = $3
        RETURNING *`,
      [tokenHash, VERIFICATION_TTL_MINUTES, enquiryId],
    );
    return updated.rows[0];
  });

  let delivery;
  try {
    delivery = await sendVerificationEmail(enquiry, plainTextToken, safeBaseUrl);
  } catch (error) {
    delivery = { status: 'Failed', error: safeError(error) };
  }
  const status = await updateVerificationDelivery(enquiry.id, delivery);

  return {
    success: true,
    customerEmailStatus: status.status,
    message: status.status === 'Sent' ? 'Verification email resent.' : 'Enquiry retained; email delivery failed.',
  };
}
