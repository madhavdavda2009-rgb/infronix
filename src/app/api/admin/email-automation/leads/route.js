import { NextResponse } from 'next/server';
import { execute } from '@/lib/db';
import { verifyAdminAuth } from '@/lib/auth';
import { initEmailAutomationDb } from '@/lib/email-automation/db-init';

export async function GET(request) {
  try {
    const admin = verifyAdminAuth(request);
    if (!admin) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await initEmailAutomationDb();

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || 'ALL';
    const limit = parseInt(searchParams.get('limit') || '200', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);

    let query = `
      SELECT 
        id,
        COALESCE(company_name, business_name, '') AS company_name,
        COALESCE(name, '') AS name,
        email,
        website,
        COALESCE(industry, category, '') AS industry,
        COALESCE(location, CONCAT_WS(', ', NULLIF(area, ''), NULLIF(city, '')), '') AS location,
        company_description,
        personalization_context,
        COALESCE(lead_source, source, 'Manual') AS lead_source,
        status,
        phone,
        lead_score,
        created_at,
        updated_at
      FROM leads
    `;

    const whereClauses = [];
    const params = [];

    if (status && status !== 'ALL') {
      whereClauses.push(`LOWER(status) = LOWER(?)`);
      params.push(status);
    }

    if (search && search.trim().length > 0) {
      const searchTerm = `%${search.trim().toLowerCase()}%`;
      whereClauses.push(`(
        LOWER(COALESCE(company_name, business_name, '')) LIKE ? OR
        LOWER(COALESCE(name, '')) LIKE ? OR
        LOWER(COALESCE(email, '')) LIKE ? OR
        LOWER(COALESCE(industry, category, '')) LIKE ? OR
        LOWER(COALESCE(location, '')) LIKE ?
      )`);
      params.push(searchTerm, searchTerm, searchTerm, searchTerm, searchTerm);
    }

    if (whereClauses.length > 0) {
      query += ` WHERE ` + whereClauses.join(' AND ');
    }

    query += ` ORDER BY created_at DESC LIMIT ? OFFSET ?`;
    params.push(limit, offset);

    const [rows] = await execute(query, params);

    // Get status counts for metrics
    const [counts] = await execute(`
      SELECT 
        status, 
        COUNT(*) AS count 
      FROM leads 
      GROUP BY status
    `);

    const statusCounts = {};
    let totalCount = 0;
    (counts || []).forEach(item => {
      statusCounts[item.status] = parseInt(item.count, 10);
      totalCount += parseInt(item.count, 10);
    });

    return NextResponse.json({
      success: true,
      data: rows || [],
      total: totalCount,
      statusCounts
    });
  } catch (err) {
    console.error('Error fetching leads:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to fetch leads' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const admin = verifyAdminAuth(request);
    if (!admin) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await initEmailAutomationDb();

    const body = await request.json();
    const {
      name,
      company_name,
      email,
      website,
      industry,
      location,
      company_description,
      personalization_context,
      lead_source,
      status
    } = body;

    if (!company_name && !name && !email) {
      return NextResponse.json(
        { success: false, error: 'Company name, contact name, or email is required.' },
        { status: 400 }
      );
    }

    const leadStatus = status || 'New';
    const source = lead_source || 'Manual';

    await execute(`
      INSERT INTO leads (
        name,
        company_name,
        business_name,
        email,
        website,
        industry,
        category,
        location,
        company_description,
        personalization_context,
        lead_source,
        source,
        status,
        created_at,
        updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `, [
      name || null,
      company_name || null,
      company_name || null,
      email || null,
      website || null,
      industry || null,
      industry || null,
      location || null,
      company_description || null,
      personalization_context || null,
      source,
      source,
      leadStatus
    ]);

    return NextResponse.json({
      success: true,
      message: 'Lead created successfully.'
    });
  } catch (err) {
    console.error('Error creating lead:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to create lead' },
      { status: 500 }
    );
  }
}
