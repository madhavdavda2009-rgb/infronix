import { NextResponse } from 'next/server';
import { execute } from '@/lib/db';

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

    // Insert into Supabase
    await execute(
      `INSERT INTO project_inquiries (
        selected_services, project_name, business_category, has_existing_website, website_url, 
        project_description, website_type, page_requirement, features, seo_goals, 
        seo_location, seo_business_details, automation_description, automation_platforms, 
        existing_automation_tools, budget, timeline, full_name, email, phone, 
        company_name, preferred_contact_method, additional_notes
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23
      )`,
      [
        JSON.stringify(selectedServices),
        projectName.trim(),
        businessCategory?.trim() || '',
        hasExistingWebsite || null,
        websiteUrl?.trim() || null,
        projectDescription.trim(),
        websiteType || null,
        pageRequirement || null,
        features ? JSON.stringify(features) : null,
        seoGoals ? JSON.stringify(seoGoals) : null,
        seoLocation?.trim() || null,
        seoBusinessDetails?.trim() || null,
        automationDescription?.trim() || null,
        automationPlatforms ? JSON.stringify(automationPlatforms) : null,
        existingAutomationTools?.trim() || null,
        budget,
        timeline,
        fullName.trim(),
        email.trim().toLowerCase(),
        phone.trim(),
        companyName?.trim() || null,
        preferredContactMethod || 'Email',
        additionalNotes?.trim() || null
      ]
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
            from: 'Infronix <hello@infronix.agency>',
            to: 'hello@infronix.agency',
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
            from: 'Infronix <hello@infronix.agency>',
            to: email.trim().toLowerCase(),
            subject: `We've received your project request - Infronix`,
            html: `
              <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; line-height: 1.6;">
                <h2>Hello ${fullName.split(' ')[0]},</h2>
                <p>Thank you for reaching out to Infronix.</p>
                <p>We've successfully received your project details. Our team will review your requirements for <strong>${projectName}</strong> and get back to you with the next steps.</p>
                <br />
                <p>Best regards,<br/><strong>The Infronix Team</strong></p>
                <a href="https://infronix.agency">infronix.agency</a>
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
