import { NextResponse } from 'next/server';
import { revokePortalSession, getPortalSecurityHeaders } from '@/lib/client_auth';

export async function POST(request) {
  try {
    const rawToken = request.cookies.get('client_session')?.value;
    if (rawToken) {
      await revokePortalSession(rawToken);
    }

    const response = NextResponse.json({
      success: true,
      message: 'Logged out successfully'
    }, { headers: getPortalSecurityHeaders() });

    response.cookies.set({
      name: 'client_session',
      value: '',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 0
    });

    return response;
  } catch (err) {
    console.error('Client Portal logout error:', err);
    return NextResponse.json(
      { success: false, error: 'Logout failed' },
      { status: 500, headers: getPortalSecurityHeaders() }
    );
  }
}
