import { NextResponse } from 'next/server';
import { processEnquirySubmission } from '@/lib/enquiry_service';

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      selectedServices,
      projectName,
      businessCategory,
      hasExistingWebsite,
      websiteUrl,
      projectDescription,
      websiteType,
      pageRequirement,
      features,
      seoGoals,
      seoLocation,
      seoBusinessDetails,
      automationDescription,
      automationPlatforms,
      existingAutomationTools,
      budget,
      timeline,
      fullName,
      email,
      phone,
      companyName,
      preferredContactMethod,
      additionalNotes,
      idempotencyKey,
      website_hp_check,
      honeypot
    } = body;

    const clientIp = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
                     request.headers.get('x-real-ip') ||
                     '127.0.0.1';

    const origin = request.headers.get('origin');
    const host = request.headers.get('host') || 'localhost:3000';
    const proto = request.headers.get('x-forwarded-proto') || (host.includes('localhost') || host.includes('127.0.0.1') ? 'http' : 'https');
    const baseUrl = origin || `${proto}://${host}`;

    const formattedDetails = [
      projectDescription ? `Description: ${projectDescription}` : '',
      projectName ? `Project: ${projectName}` : '',
      websiteUrl ? `Current Website: ${websiteUrl}` : '',
      websiteType ? `Website Type: ${websiteType}` : '',
      pageRequirement ? `Pages: ${pageRequirement}` : '',
      features && features.length > 0 ? `Features: ${features.join(', ')}` : '',
      seoGoals && seoGoals.length > 0 ? `SEO Goals: ${seoGoals.join(', ')}` : '',
      seoLocation ? `Target Location: ${seoLocation}` : '',
      seoBusinessDetails ? `Business Info: ${seoBusinessDetails}` : '',
      automationDescription ? `Automation Needed: ${automationDescription}` : '',
      automationPlatforms && automationPlatforms.length > 0 ? `Platforms: ${automationPlatforms.join(', ')}` : '',
      existingAutomationTools ? `Existing Tools: ${existingAutomationTools}` : '',
      additionalNotes ? `Notes: ${additionalNotes}` : ''
    ].filter(Boolean).join('\n\n');

    const result = await processEnquirySubmission({
      fullName: fullName || '',
      email: email || '',
      phone: phone || '',
      company: companyName || '',
      service: Array.isArray(selectedServices) ? selectedServices.join(', ') : (selectedServices || 'Website Development'),
      projectType: websiteType || 'Business Website',
      budget: budget || '',
      timeline: timeline || '',
      projectDescription: formattedDetails || projectDescription,
      preferredContactMethod: preferredContactMethod || 'Email',
      formType: 'Start Project Form',
      sourcePage: '/start-project',
      idempotencyKey,
      honeypot: honeypot || website_hp_check || '',
      clientIp,
      baseUrl
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error('Error submitting project inquiry:', error);
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
