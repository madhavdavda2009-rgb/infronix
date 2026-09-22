import { NextResponse } from 'next/server';
import { processEnquirySubmission } from '@/lib/enquiry_service';
import { enquiryDescription } from '@/lib/enquiry-input';

export async function POST(request) {
  try {
    let body;
    try { body = await request.json(); } catch { return NextResponse.json({ success: false, error: 'Please send a valid form submission.' }, { status: 400 }); }
    if (!body || typeof body !== 'object' || Array.isArray(body)) return NextResponse.json({ success: false, error: 'Please send a valid form submission.' }, { status: 400 });

    const clientIp = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
                     request.headers.get('x-real-ip') ||
                     '127.0.0.1';

    const origin = request.headers.get('origin');
    const host = request.headers.get('host') || 'localhost:3000';
    const proto = request.headers.get('x-forwarded-proto') || (host.includes('localhost') || host.includes('127.0.0.1') ? 'http' : 'https');
    const baseUrl = origin || `${proto}://${host}`;

    const {
      fullName,
      firstName,
      lastName,
      email,
      phone,
      company,
      companyName,
      service,
      selectedServices,
      projectType,
      budget,
      timeline,
      message,
      preferredContactMethod,
      formType,
      sourcePage,
      utmSource,
      utmMedium,
      utmCampaign,
      idempotencyKey,
      honeypot,
      website_hp_check
    } = body;

    // Normalizing alternate form field names across forms
    const resolvedFullName = fullName || [firstName, lastName].filter(Boolean).join(' ');
    const resolvedCompany = company || companyName || '';
    const resolvedServices = service || (Array.isArray(selectedServices) ? selectedServices.join(', ') : selectedServices) || '';
    const resolvedDescription = enquiryDescription(body);
    const resolvedHoneypot = honeypot || website_hp_check || '';

    const result = await processEnquirySubmission({
      fullName: resolvedFullName,
      email,
      phone,
      company: resolvedCompany,
      service: resolvedServices,
      projectType,
      budget,
      timeline,
      projectDescription: resolvedDescription,
      message,
      preferredContactMethod,
      formType: formType || 'Website Form',
      sourcePage: sourcePage || '/',
      utmSource,
      utmMedium,
      utmCampaign,
      idempotencyKey,
      honeypot: resolvedHoneypot,
      clientIp,
      baseUrl
    });

    return NextResponse.json(result, { status: 201 });
  } catch (err) {
    console.error('Enquiry submission API error:', err.message);
    const isValidationError =
      err.message.includes('Please provide') ||
      err.message.includes('valid') ||
      err.message.includes('cannot receive') ||
      err.message.includes('domain');
    return NextResponse.json(
      {
        success: false,
        error: isValidationError ? err.message : 'Unable to submit your enquiry at this time. Please try again shortly.'
      },
      { status: isValidationError ? 400 : 500 }
    );
  }
}
