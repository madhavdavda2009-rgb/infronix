import { NextResponse } from 'next/server';
import { execute } from '@/lib/db';
import { decrypt } from '@/lib/crypto';
import { verifyAdminAuth } from '@/lib/auth';

export async function GET(request) {
  try {
    const adminSession = verifyAdminAuth(request);
    if (!adminSession) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const [rows] = await execute('SELECT * FROM consultations ORDER BY created_at DESC');

    const decryptedRows = rows.map((row) => ({
      id: row.id,
      firstName: decrypt(row.first_name),
      lastName: decrypt(row.last_name),
      email: decrypt(row.email),
      company: decrypt(row.company),
      projectDetails: decrypt(row.project_details),
      status: row.status,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    }));

    return NextResponse.json({
      success: true,
      count: decryptedRows.length,
      data: decryptedRows
    });

  } catch (error) {
    console.error('Error fetching consultations:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch consultations list.' },
      { status: 500 }
    );
  }
}
