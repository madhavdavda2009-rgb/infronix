import { NextResponse } from 'next/server';
import { verifyAdminAuth } from '@/lib/auth';

export function proxy(request) {
  const { pathname } = request.nextUrl;
  const authenticated = Boolean(verifyAdminAuth(request));

  // Protect /admin and any sub-routes (except /admin/login)
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    if (!authenticated) {
      const loginUrl = new URL('/admin/login', request.url);
      const response = NextResponse.redirect(loginUrl);
      response.cookies.delete('admin_token');
      return response;
    }
  }

  // If already authenticated and visiting /admin/login, redirect to /admin dashboard
  if (pathname === '/admin/login') {
    if (authenticated) {
      const adminUrl = new URL('/admin', request.url);
      return NextResponse.redirect(adminUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match /admin and all subpaths under /admin
     */
    '/admin/:path*',
  ],
};
