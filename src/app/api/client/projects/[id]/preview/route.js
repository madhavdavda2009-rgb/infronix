import { NextResponse } from 'next/server';
import { verifyClientAuth, verifyClientProjectAccess, getPortalSecurityHeaders } from '@/lib/client_auth';
import { validatePreviewUrl } from '@/lib/preview_validator';

export async function GET(request, { params }) {
  try {
    const auth = await verifyClientAuth(request);
    if (!auth) {
      return NextResponse.json({ success: false, error: 'Unauthorized.' }, { status: 401, headers: getPortalSecurityHeaders() });
    }

    const resolvedParams = await params;
    const { id } = resolvedParams;
    const projectId = parseInt(id, 10);

    const accessCheck = await verifyClientProjectAccess(auth.client.id, auth.user.id, projectId);
    if (!accessCheck.authorized) {
      return NextResponse.json({ success: false, error: 'Project not found.' }, { status: 404, headers: getPortalSecurityHeaders() });
    }

    const { project } = accessCheck;

    if (!project.preview_enabled) {
      return NextResponse.json({
        success: true,
        preview_enabled: false,
        preview_status: project.preview_status || 'Preparing',
        message: 'Live staging preview is currently being prepared for this project.'
      }, { headers: getPortalSecurityHeaders() });
    }

    // Validate preview URL security
    const validation = validatePreviewUrl(project.preview_url);
    if (!validation.valid) {
      return NextResponse.json({
        success: true,
        preview_enabled: true,
        preview_status: 'Temporarily Unavailable',
        error: validation.error,
        preview_url: null,
        preview_label: project.preview_label || 'Staging Preview'
      }, { headers: getPortalSecurityHeaders() });
    }

    return NextResponse.json({
      success: true,
      preview_enabled: true,
      preview_url: validation.sanitizedUrl,
      preview_label: project.preview_label || 'Live Staging Preview',
      preview_status: project.preview_status || 'Available',
      preview_instructions: project.preview_instructions || '',
      updated_at: project.updated_at
    }, { headers: getPortalSecurityHeaders() });
  } catch (err) {
    console.error('Client preview get error:', err);
    return NextResponse.json({ success: false, error: 'Failed to retrieve preview configuration.' }, { status: 500, headers: getPortalSecurityHeaders() });
  }
}
