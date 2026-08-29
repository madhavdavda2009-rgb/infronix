import { NextResponse } from 'next/server';
import { execute } from '@/lib/db';
import { encrypt } from '@/lib/crypto';

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
      additionalNotes
    } = body;

    // Validate Required Fields
    if (!selectedServices || selectedServices.length === 0 || !projectName || !projectDescription || !budget || !timeline || !fullName || !email || !phone) {
      return NextResponse.json(
        { success: false, error: 'Please fill in all required fields.' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Please provide a valid email address.' },
        { status: 400 }
      );
    }

    // Split Full Name into First and Last for DB schema
    const nameParts = fullName.trim().split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : ' ';

    // Format all extra form fields into a unified comprehensive block for the projectDetails column
    const formattedDetails = `
PROJECT NAME: ${projectName.trim()}
SERVICES REQUESTED: ${selectedServices.join(', ')}
BUDGET: ${budget}
TIMELINE: ${timeline}

[CONTACT PREFERENCES]
Phone: ${phone.trim()}
Preferred Method: ${preferredContactMethod || 'Email'}
${companyName ? `Company: ${companyName.trim()}` : ''}
${businessCategory ? `Category: ${businessCategory.trim()}` : ''}

[PROJECT DESCRIPTION]
${projectDescription.trim()}

[WEBSITE DETAILS]
Has Existing Website: ${hasExistingWebsite ? 'Yes' : 'No'}
${websiteUrl ? `URL: ${websiteUrl.trim()}` : ''}
${websiteType ? `Type: ${websiteType}` : ''}
${pageRequirement ? `Pages: ${pageRequirement}` : ''}
${features && features.length > 0 ? `Requested Features: ${features.join(', ')}` : ''}

[SEO DETAILS]
${seoGoals && seoGoals.length > 0 ? `SEO Goals: ${seoGoals.join(', ')}` : ''}
${seoLocation ? `Target Location: ${seoLocation.trim()}` : ''}
${seoBusinessDetails ? `Business Info: ${seoBusinessDetails.trim()}` : ''}

[AUTOMATION DETAILS]
${automationDescription ? `Automation Needed: ${automationDescription.trim()}` : ''}
${automationPlatforms && automationPlatforms.length > 0 ? `Platforms: ${automationPlatforms.join(', ')}` : ''}
${existingAutomationTools ? `Existing Tools: ${existingAutomationTools.trim()}` : ''}

[ADDITIONAL NOTES]
${additionalNotes ? additionalNotes.trim() : 'None'}
    `.trim();

    // Encrypt sensitive fields using existing agency security
    const encFirstName = encrypt(firstName);
    const encLastName = encrypt(lastName);
    const encEmail = encrypt(email.trim().toLowerCase());
    const encCompany = encrypt(companyName ? companyName.trim() : '');
    const encProjectDetails = encrypt(formattedDetails);

    // Insert into consultations table with 'new' status
    await execute(
      `INSERT INTO consultations (first_name, last_name, email, company, project_details, status)
       VALUES ($1, $2, $3, $4, $5, 'new')`,
      [encFirstName, encLastName, encEmail, encCompany, encProjectDetails]
    );

    // Attempt to send email via Resend if API key is present
    if (process.env.RESEND_API_KEY) {
      try {
        const agencyEmailRes = fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            from: 'Infronix <support@infronixweb.in>',
            to: 'support@infronixweb.in',
            subject: `New Project Inquiry from ${fullName.trim()}`,
            html: `
              <h2>New Project Inquiry</h2>
              <p><strong>Name:</strong> ${fullName}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Phone:</strong> ${phone}</p>
              <p><strong>Budget:</strong> ${budget}</p>
              <p><strong>Project:</strong> ${projectName}</p>
              <p><strong>Description:</strong> ${projectDescription}</p>
            `
          })
        });

        const clientEmailRes = fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            from: 'Infronix <support@infronixweb.in>',
            to: email.trim().toLowerCase(),
            subject: `We've received your project request - Infronix`,
            html: `
              <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; line-height: 1.6;">
                <h2>Hello ${firstName},</h2>
                <p>Thank you for reaching out to Infronix.</p>
                <p>We've successfully received your project details. Our team will review your requirements for <strong>${projectName}</strong> and get back to you with the next steps.</p>
                <br />
                <p>Best regards,<br/><strong>The Infronix Team</strong></p>
                <a href="https://infronixweb.in">infronixweb.in</a>
              </div>
            `
          })
        });

        // Fire and forget, don't await to avoid slowing down response
        Promise.all([agencyEmailRes, clientEmailRes]).catch(e => console.error('Email sending failed:', e));
      } catch (emailErr) {
        console.error('Failed to trigger emails:', emailErr);
      }
    } else {
      console.warn('RESEND_API_KEY not found. Emails were not sent.');
    }

    return NextResponse.json(
      { success: true, message: 'Project request received successfully.' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error submitting project inquiry:', error);
    return NextResponse.json(
      { success: false, error: 'An internal server error occurred while processing your request.' },
      { status: 500 }
    );
  }
}
