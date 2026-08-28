import { NextResponse } from 'next/server';
import { execute } from '@/lib/db';
import { encrypt } from '@/lib/crypto';
import { verifyAdminAuth } from '@/lib/auth';

export async function PUT(request, { params }) {
  try {
    const adminSession = verifyAdminAuth(request);
    if (!adminSession) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const { firstName, lastName, email, company, projectDetails, status } = body;

    const encFirstName = encrypt(firstName);
    const encLastName = encrypt(lastName);
    const encEmail = encrypt(email);
    const encCompany = encrypt(company || '');
    const encProjectDetails = encrypt(projectDetails);

    const [result] = await execute(
      `UPDATE consultations 
       SET first_name = ?, last_name = ?, email = ?, company = ?, project_details = ?, status = ?
       WHERE id = ?`,
      [encFirstName, encLastName, encEmail, encCompany, encProjectDetails, status, id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { success: false, error: 'Consultation entry not found.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Consultation entry updated successfully.'
    });

  } catch (error) {
    console.error('Error updating consultation:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update consultation record.' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const adminSession = verifyAdminAuth(request);
    if (!adminSession) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;

    const [result] = await execute('DELETE FROM consultations WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return NextResponse.json(
        { success: false, error: 'Consultation entry not found.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Consultation entry deleted successfully.'
    });

  } catch (error) {
    console.error('Error deleting consultation:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete consultation record.' },
      { status: 500 }
    );
  }
}
