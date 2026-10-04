import { NextResponse } from 'next/server';
import { getPublicTeam } from '@/lib/public-team';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request) {
  try {
    const page = new URL(request.url).searchParams.get('page');
    return NextResponse.json({ success: true, team: await getPublicTeam(page) }, {
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch (error) {
    console.error('Public team API error:', error.message);
    return NextResponse.json({ success: false, error: 'Failed to load team information', team: [] }, { status: 500 });
  }
}
