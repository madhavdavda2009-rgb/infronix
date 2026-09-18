import { NextResponse } from 'next/server';
import { processEnquirySubmission } from '@/lib/enquiry_service';

export async function POST(request) {
  try {
    const body = await request.json();
    const { firstName, lastName, fullName, email, company, projectDetails, message, idempotencyKey, website_hp_check, honeypot } = body;

    const resolvedName = fullName || [firstName, lastName].filter(Boolean).join(' ');

    const clientIp = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
                     request.headers.get('x-real-ip') ||
                     '127.0.0.1';

    const origin = request.headers.get('origin');
    const host = request.headers.get('host') || 'localhost:3000';
    const proto = request.headers.get('x-forwarded-proto') || (host.includes('localhost') || host.includes('127.0.0.1') ? 'http' : 'https');
    const baseUrl = origin || `${proto}://${host}`;

    const result = await processEnquirySubmission({
      fullName: resolvedName,
      email: email || '',
      company: company || '',
      projectDescription: projectDetails || message || '',
      formType: 'Consultation Form',
      sourcePage: '/contact',
      idempotencyKey,
      honeypot: honeypot || website_hp_check || '',
      clientIp,
      baseUrl
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error('Error submitting consultation:', error);
    const isValidation =
      error.message.includes('Please provide') ||
      error.message.includes('valid') ||
      error.message.includes('cannot receive') ||
      error.message.includes('domain');
    return NextResponse.json(
      { success: false, error: isValidation ? error.message : 'An internal server error occurred while processing your request.' },
      { status: isValidation ? 400 : 500 }
    );
  }
}
