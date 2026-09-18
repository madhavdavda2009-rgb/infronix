import { NextResponse } from 'next/server';
import { resendVerificationEmail } from '@/lib/enquiry_service';

export async function POST(request) {
  try {
    const body = await request.json();
    const { enquiryId } = body;
    
    if (!enquiryId) {
      return NextResponse.json({ success: false, error: 'Missing enquiry ID.' }, { status: 400 });
    }

    // Get client IP for rate limiting
    const clientIp = request.headers.get('x-forwarded-for') || request.ip || '127.0.0.1';

    // Pass the base URL from the request to generate absolute URLs in emails
    const protocol = request.headers.get('x-forwarded-proto') || 'http';
    const host = request.headers.get('host') || 'localhost:3000';
    const baseUrl = `${protocol}://${host}`;

    const result = await resendVerificationEmail(enquiryId, clientIp, baseUrl);
    
    return NextResponse.json(result);
  } catch (err) {
    console.error('Resend verification error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}
