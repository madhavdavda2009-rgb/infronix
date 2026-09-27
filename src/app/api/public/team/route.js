import { NextResponse } from 'next/server';
import { query, initFounderOSDb } from '@/lib/founder_os_db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request) {
  try {
    // Ensure DB schemas and founder seed exist
    try {
      await initFounderOSDb();
    } catch (initErr) {
      console.warn('initFounderOSDb notice in public team API:', initErr?.message);
    }

    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page'); // 'home', 'about', or null (all public)

    let sql = `
      SELECT 
        id,
        name,
        COALESCE(public_role, role) AS role,
        public_role,
        public_bio,
        profile_image_url,
        public_slug,
        display_order,
        linkedin_url,
        github_url,
        portfolio_url,
        instagram_url,
        is_founder,
        employment_type,
        show_on_homepage,
        show_on_about_page
      FROM founder_os_people
      WHERE (LOWER(status) = 'active' OR status IS NULL)
        AND show_on_website = TRUE 
        AND (is_archived IS NOT TRUE)
    `;

    const params = [];

    if (page === 'home') {
      sql += ' AND (show_on_homepage IS NOT FALSE OR is_founder = TRUE OR employment_type = \'Founder\')';
    } else if (page === 'about') {
      sql += ' AND (show_on_about_page IS NOT FALSE OR is_founder = TRUE OR employment_type = \'Founder\')';
    }

    sql += `
      ORDER BY 
        CASE WHEN employment_type = 'Founder' OR is_founder = TRUE THEN 0 ELSE 1 END,
        display_order ASC,
        id ASC
    `;

    const res = await query(sql, params);

    return NextResponse.json(
      {
        success: true,
        team: res.rows || []
      },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate'
        }
      }
    );
  } catch (err) {
    console.error('Public team API error:', err);
    return NextResponse.json(
      { success: false, error: 'Failed to load team information', team: [] },
      { status: 500 }
    );
  }
}
