import { NextResponse } from 'next/server';
import { verifyClientAuth, verifyClientProjectAccess } from '@/lib/client_auth';
import { validatePreviewUrl } from '@/lib/preview_validator';

export async function GET(request, { params }) {
  try {
    const auth = await verifyClientAuth(request);
    if (!auth) {
      return new Response('Unauthorized preview access.', { status: 401 });
    }

    const resolvedParams = await params;
    const { id } = resolvedParams;
    const projectId = parseInt(id, 10);

    const accessCheck = await verifyClientProjectAccess(auth.client.id, auth.user?.id, projectId);
    if (!accessCheck.authorized) {
      return new Response('Project not found or access denied.', { status: 404 });
    }

    const { project } = accessCheck;
    if (!project.preview_enabled || !project.preview_url) {
      return new Response('Preview is not enabled for this project.', { status: 400 });
    }

    const validation = validatePreviewUrl(project.preview_url);
    if (!validation.valid) {
      return new Response('Invalid preview URL configuration.', { status: 400 });
    }

    const targetUrl = validation.sanitizedUrl;
    const parsedTarget = new URL(targetUrl);
    const targetOrigin = parsedTarget.origin;

    const upstreamRes = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 InfronixWeb-Portal-Preview',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      },
      next: { revalidate: 0 }
    });

    if (!upstreamRes.ok) {
      return new Response(`Unable to fetch live staging build (HTTP ${upstreamRes.status}). Please open the preview in a new tab.`, {
        status: upstreamRes.status,
        headers: { 'Content-Type': 'text/plain' }
      });
    }

    let html = await upstreamRes.text();

    // Ensure base tag is present so relative CSS/JS/images load from the upstream origin
    const baseTag = `<base href="${targetOrigin}/" target="_blank" />`;
    if (html.includes('<head>')) {
      html = html.replace('<head>', `<head>${baseTag}`);
    } else if (html.includes('<head ')) {
      html = html.replace(/<head[^>]*>/, `$&${baseTag}`);
    } else {
      html = baseTag + html;
    }

    return new Response(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-store, max-age=0'
      }
    });
  } catch (err) {
    console.error('Preview proxy error:', err);
    return new Response('Failed to load proxy preview. Please open in a new tab.', { status: 500 });
  }
}
