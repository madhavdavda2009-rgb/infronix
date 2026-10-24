import crypto from 'crypto';
import { query, initFounderOSDb } from '@/lib/founder_os_db';
import { DOC_TYPES, DEFAULT_PROFILE, buildDefaultData, canonicalContent, isSignatureImage } from '@/lib/document_templates';

// initFounderOSDb() skips its migration once the schema exists, so this module
// owns its own table bootstrap.
let ensured = Boolean(globalThis._client_documents_table_ready);

export async function initClientDocumentsDb() {
  await initFounderOSDb();
  if (ensured) return;
  await query(`
    CREATE TABLE IF NOT EXISTS founder_os_client_documents (
      id SERIAL PRIMARY KEY,
      doc_number VARCHAR(50) UNIQUE,
      doc_type VARCHAR(30) NOT NULL,
      title VARCHAR(255) NOT NULL,
      client_id INTEGER REFERENCES founder_os_clients(id) ON DELETE CASCADE,
      project_id INTEGER REFERENCES founder_os_projects(id) ON DELETE CASCADE,
      data JSONB NOT NULL DEFAULT '{}'::jsonb,
      status VARCHAR(50) NOT NULL DEFAULT 'Draft',
      requires_signature BOOLEAN NOT NULL DEFAULT FALSE,
      content_hash VARCHAR(64),
      sent_to_email VARCHAR(255),
      sent_at TIMESTAMP WITH TIME ZONE,
      viewed_at TIMESTAMP WITH TIME ZONE,
      signed_at TIMESTAMP WITH TIME ZONE,
      signer_name VARCHAR(255),
      signer_title VARCHAR(255),
      signature_text VARCHAR(255),
      signer_ip_hash VARCHAR(100),
      signer_user_agent TEXT,
      signed_by_portal_user_id INTEGER REFERENCES founder_os_portal_users(id) ON DELETE SET NULL,
      client_comment TEXT,
      created_by VARCHAR(255) DEFAULT 'admin',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
    CREATE INDEX IF NOT EXISTS idx_client_docs_project ON founder_os_client_documents(project_id);
    CREATE INDEX IF NOT EXISTS idx_client_docs_client ON founder_os_client_documents(client_id);
    ALTER TABLE founder_os_client_documents ADD COLUMN IF NOT EXISTS signature_image TEXT;
  `);
  ensured = true;
  globalThis._client_documents_table_ready = true;
}

export function hashDocumentContent(doc) {
  return crypto.createHash('sha256').update(canonicalContent(doc)).digest('hex');
}

function formatDocNumber(docType, id) {
  const prefix = DOC_TYPES[docType]?.prefix || 'DOC';
  return `IW-${prefix}-${new Date().getFullYear()}-${String(id).padStart(4, '0')}`;
}

const PROFILE_KEY = 'documents_profile';
const templateKey = docType => `documents_template_${docType}`;

async function readSetting(key) {
  const res = await query('SELECT value FROM founder_os_settings WHERE key = $1', [key]);
  if (!res.rows.length) return null;
  try {
    return JSON.parse(res.rows[0].value);
  } catch {
    return null;
  }
}

async function writeSetting(key, value) {
  await query(`
    INSERT INTO founder_os_settings (key, value, updated_at) VALUES ($1, $2, NOW())
    ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()
  `, [key, JSON.stringify(value)]);
}

/** Agency details and signature used to pre-fill every new document. */
export async function getDocumentProfile() {
  return { ...DEFAULT_PROFILE, ...((await readSetting(PROFILE_KEY)) || {}) };
}

export async function saveDocumentProfile(input) {
  const profile = {};
  for (const key of Object.keys(DEFAULT_PROFILE)) {
    const value = input?.[key];
    if (key === 'agency_signature') {
      profile[key] = value && isSignatureImage(value) ? value : '';
    } else {
      profile[key] = typeof value === 'string' ? value.trim().slice(0, 500) : DEFAULT_PROFILE[key];
    }
  }
  await writeSetting(PROFILE_KEY, profile);
  return profile;
}

/** Saved default sections for a document type, or null to use the built-in ones. */
export async function getDocumentTemplate(docType) {
  const sections = await readSetting(templateKey(docType));
  return Array.isArray(sections) && sections.length ? sections : null;
}

export async function saveDocumentTemplate(docType, sections) {
  if (!sections) {
    await query('DELETE FROM founder_os_settings WHERE key = $1', [templateKey(docType)]);
    return null;
  }
  const clean = sanitizeSections(sections);
  await writeSetting(templateKey(docType), clean);
  return clean;
}

export function sanitizeSections(sections) {
  if (!Array.isArray(sections)) return [];
  return sections.slice(0, 60).map((s, i) => ({
    id: typeof s?.id === 'string' ? s.id.slice(0, 40) : `s${i}`,
    title: String(s?.title ?? '').slice(0, 200),
    body: String(s?.body ?? '').slice(0, 20000),
  }));
}

/** Loads CRM context used to pre-fill a document. */
export async function loadDocumentContext({ clientId, projectId }) {
  let project = null;
  let payments = [];
  if (projectId) {
    const pRes = await query('SELECT * FROM founder_os_projects WHERE id = $1', [projectId]);
    project = pRes.rows[0] || null;
    if (project) {
      const payRes = await query(
        'SELECT name, amount, due_date FROM founder_os_payment_schedules WHERE project_id = $1 ORDER BY due_date NULLS LAST, id',
        [projectId]
      );
      payments = payRes.rows;
    }
  }
  const resolvedClientId = clientId || project?.client_id || null;
  let client = null;
  if (resolvedClientId) {
    const cRes = await query('SELECT * FROM founder_os_clients WHERE id = $1', [resolvedClientId]);
    client = cRes.rows[0] || null;
  }
  return { client, project, payments, clientId: client?.id || null, projectId: project?.id || null };
}

export async function createClientDocument({ docType, clientId, projectId, data, title, createdBy }) {
  const meta = DOC_TYPES[docType];
  if (!meta) throw new Error('Unknown document type');

  const ctx = await loadDocumentContext({ clientId, projectId });
  if (!ctx.clientId) throw new Error('A client (or a project linked to a client) is required');

  const [profile, sections] = await Promise.all([getDocumentProfile(), getDocumentTemplate(docType)]);
  const defaults = buildDefaultData(docType, { ...ctx, profile, sections });
  const merged = { ...defaults, ...(data || {}) };
  const docTitle = title?.trim() || `${meta.label}${ctx.project ? ` – ${ctx.project.project_name}` : ''}`;

  const insertRes = await query(`
    INSERT INTO founder_os_client_documents
      (doc_type, title, client_id, project_id, data, status, requires_signature, created_by)
    VALUES ($1, $2, $3, $4, $5::jsonb, 'Draft', $6, $7)
    RETURNING id
  `, [docType, docTitle.slice(0, 255), ctx.clientId, ctx.projectId, JSON.stringify(merged), meta.requiresSignature, createdBy || 'admin']);

  const id = insertRes.rows[0].id;
  const updated = await query(
    'UPDATE founder_os_client_documents SET doc_number = $1 WHERE id = $2 RETURNING *',
    [formatDocNumber(docType, id), id]
  );
  return updated.rows[0];
}

export const DOCUMENT_LIST_SQL = `
  SELECT d.*, c.name AS client_display_name, c.company AS client_display_company,
         p.project_name
  FROM founder_os_client_documents d
  LEFT JOIN founder_os_clients c ON c.id = d.client_id
  LEFT JOIN founder_os_projects p ON p.id = d.project_id
`;

// Columns safe to expose to the client portal (no IP hashes, user agents or internal notes).
export const CLIENT_DOCUMENT_COLUMNS = `
  d.id, d.doc_number, d.doc_type, d.title, d.project_id, d.data, d.status, d.requires_signature,
  d.content_hash, d.sent_at, d.viewed_at, d.signed_at, d.signer_name, d.signer_title,
  d.signature_text, d.signature_image, d.client_comment, d.updated_at
`;
