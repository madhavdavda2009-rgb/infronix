import { NextResponse } from 'next/server';
import { execute } from '@/lib/db';
import { encrypt } from '@/lib/crypto';

export async function POST(request) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, company, projectDetails } = body;

    if (!firstName || !lastName || !email || !projectDetails) {
      return NextResponse.json(
        { success: false, error: 'Please fill in all required fields (First Name, Last Name, Email, Project Details).' },
        { status: 400 }
      );
    }

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Please provide a valid work email address.' },
        { status: 400 }
      );
    }

    // AES-256-GCM Encryption at rest
    const encFirstName = encrypt(firstName.trim());
    const encLastName = encrypt(lastName.trim());
    const encEmail = encrypt(email.trim().toLowerCase());
    const encCompany = encrypt(company ? company.trim() : '');
    const encProjectDetails = encrypt(projectDetails.trim());

    await execute(
      `INSERT INTO consultations (first_name, last_name, email, company, project_details)
       VALUES (?, ?, ?, ?, ?)`,
      [encFirstName, encLastName, encEmail, encCompany, encProjectDetails]
    );

    return NextResponse.json(
      { success: true, message: 'Thank you! Your consultation request has been securely submitted. Our team will contact you within 24 hours.' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error submitting consultation:', error);
    return NextResponse.json(
      { success: false, error: 'An internal server error occurred while processing your request.' },
      { status: 500 }
    );
  }
}
