import { NextResponse } from 'next/server';
import { verifyAdminAuth } from '@/lib/auth';
import { logActivity } from '@/lib/audit_logger';
import {
  initClientDocumentsDb,
  getDocumentProfile,
  saveDocumentProfile,
  getDocumentTemplate,
  saveDocumentTemplate
} from '@/lib/client_documents';
import { DOC_TYPES, DOC_TYPE_KEYS, getDefaultSections } from '@/lib/document_templates';

// Agency profile (business details + signature) and per-type default sections.
export async function GET(request) {
  const auth = verifyAdminAuth(request);
  if (!auth) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await initClientDocumentsDb();
    const profile = await getDocumentProfile();
    const templates = {};
    for (const type of DOC_TYPE_KEYS) {
      const saved = await getDocumentTemplate(type);
      templates[type] = { custom: Boolean(saved), sections: saved || getDefaultSections(type) };
    }
    return NextResponse.json({ success: true, profile, templates });
  } catch (err) {
    console.error('Document settings GET error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PUT(request) {
  const auth = verifyAdminAuth(request);
  if (!auth) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await initClientDocumentsDb();
    const body = await request.json();

    if (body.profile) {
      const profile = await saveDocumentProfile(body.profile);
      await logActivity(auth.username, 'Document', null, 'Profile Updated', 'Updated document business profile');
      return NextResponse.json({ success: true, profile });
    }

    if (body.doc_type) {
      if (!DOC_TYPES[body.doc_type]) {
        return NextResponse.json({ success: false, error: 'Unknown document type' }, { status: 400 });
      }
      const saved = await saveDocumentTemplate(body.doc_type, body.reset ? null : body.sections);
      await logActivity(auth.username, 'Document', null, 'Template Updated', `${body.reset ? 'Reset' : 'Saved'} default template for ${DOC_TYPES[body.doc_type].label}`);
      return NextResponse.json({ success: true, sections: saved || getDefaultSections(body.doc_type), custom: Boolean(saved) });
    }

    return NextResponse.json({ success: false, error: 'Nothing to update' }, { status: 400 });
  } catch (err) {
    console.error('Document settings PUT error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
