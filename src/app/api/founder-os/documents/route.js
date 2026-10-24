import { NextResponse } from 'next/server';
import { query } from '@/lib/founder_os_db';
import { verifyAdminAuth } from '@/lib/auth';
import { logActivity } from '@/lib/audit_logger';
import { initClientDocumentsDb, createClientDocument, DOCUMENT_LIST_SQL } from '@/lib/client_documents';
import { DOC_TYPES } from '@/lib/document_templates';

export async function GET(request) {
  const auth = verifyAdminAuth(request);
  if (!auth) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await initClientDocumentsDb();
    const { searchParams } = new URL(request.url);
    const params = [];
    let sql = `${DOCUMENT_LIST_SQL} WHERE 1=1`;

    const type = searchParams.get('type');
    if (type && type !== 'ALL') {
      params.push(type);
      sql += ` AND d.doc_type = $${params.length}`;
    }
    const status = searchParams.get('status');
    if (status && status !== 'ALL') {
      params.push(status);
      sql += ` AND d.status = $${params.length}`;
    }
    const projectId = parseInt(searchParams.get('project_id'), 10);
    if (projectId) {
      params.push(projectId);
      sql += ` AND d.project_id = $${params.length}`;
    }
    const search = searchParams.get('search')?.trim();
    if (search) {
      params.push(`%${search}%`);
      sql += ` AND (d.title ILIKE $${params.length} OR d.doc_number ILIKE $${params.length} OR c.name ILIKE $${params.length} OR c.company ILIKE $${params.length})`;
    }
    sql += ' ORDER BY d.updated_at DESC LIMIT 300';

    const [docsRes, clientsRes, projectsRes] = await Promise.all([
      query(sql, params),
      query('SELECT id, name, company, email FROM founder_os_clients ORDER BY name'),
      query('SELECT id, project_name, client_id, client_name, status FROM founder_os_projects ORDER BY created_at DESC'),
    ]);

    return NextResponse.json({
      success: true,
      documents: docsRes.rows,
      clients: clientsRes.rows,
      projects: projectsRes.rows,
    });
  } catch (err) {
    console.error('Documents GET error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  const auth = verifyAdminAuth(request);
  if (!auth) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await initClientDocumentsDb();
    const body = await request.json();
    const docType = body.doc_type;
    if (!DOC_TYPES[docType]) {
      return NextResponse.json({ success: false, error: 'Choose a valid document type' }, { status: 400 });
    }

    const document = await createClientDocument({
      docType,
      clientId: parseInt(body.client_id, 10) || null,
      projectId: parseInt(body.project_id, 10) || null,
      title: body.title,
      data: body.data,
      createdBy: auth.username,
    });

    await logActivity(auth.username, 'Document', document.id, 'Created', `Created ${DOC_TYPES[docType].label} ${document.doc_number}`);
    return NextResponse.json({ success: true, document });
  } catch (err) {
    console.error('Documents POST error:', err);
    const status = err.message?.includes('required') ? 400 : 500;
    return NextResponse.json({ success: false, error: err.message }, { status });
  }
}
