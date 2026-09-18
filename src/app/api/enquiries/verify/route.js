import { NextResponse } from 'next/server';
import { verifyEnquiryToken } from '@/lib/enquiry_service';

export async function POST(request) {
  try {
    const body = await request.json();
    const { token } = body;
    
    if (!token) {
      return NextResponse.json({ success: false, error: 'Missing verification token.' }, { status: 400 });
    }

    // Pass the base URL from the request to generate absolute URLs in emails
    const protocol = request.headers.get('x-forwarded-proto') || 'http';
    const host = request.headers.get('host') || 'localhost:3000';
    const baseUrl = `${protocol}://${host}`;

    const result = await verifyEnquiryToken(token, baseUrl);
    
    return NextResponse.json(result);
  } catch (err) {
    console.error('Email verification error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}
