import { NextResponse } from 'next/server';
import { query } from '@/lib/founder_os_db';
import { verifyAdminAuth } from '@/lib/auth';
import { logActivity } from '@/lib/audit_logger';
import { initClientDocumentsDb, createClientDocument } from '@/lib/client_documents';
import { DOC_TYPE_KEYS } from '@/lib/document_templates';

// Creates the 5-document deal pack for a project, skipping types it already has.
export async function POST(request) {
  const auth = verifyAdminAuth(request);
  if (!auth) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await initClientDocumentsDb();
    const body = await request.json();
    const projectId = parseInt(body.project_id, 10);
    if (!projectId) {
      return NextResponse.json({ success: false, error: 'Select a project' }, { status: 400 });
    }

    const projectRes = await query('SELECT id, project_name, client_id FROM founder_os_projects WHERE id = $1', [projectId]);
    const project = projectRes.rows[0];
    if (!project) {
      return NextResponse.json({ success: false, error: 'Project not found' }, { status: 404 });
    }
    if (!project.client_id) {
      return NextResponse.json({ success: false, error: 'Link this project to a client first (Client 360°)' }, { status: 400 });
    }

    const existingRes = await query('SELECT doc_type FROM founder_os_client_documents WHERE project_id = $1', [projectId]);
    const existing = new Set(existingRes.rows.map(r => r.doc_type));

    const created = [];
    for (const docType of DOC_TYPE_KEYS) {
      if (existing.has(docType)) continue;
      created.push(await createClientDocument({
        docType,
        projectId,
        createdBy: auth.username,
      }));
    }

    if (created.length) {
      await logActivity(auth.username, 'Document', projectId, 'Deal Pack Generated', `Generated ${created.length} document draft(s) for ${project.project_name}`);
    }

    return NextResponse.json({ success: true, created, skipped: existing.size });
  } catch (err) {
    console.error('Generate pack error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
