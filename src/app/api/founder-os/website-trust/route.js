import { NextResponse } from 'next/server';
import { verifyAdminAuth } from '@/lib/auth';
import { logActivity } from '@/lib/audit_logger';
import { getTrustSettings, saveTrustSettings } from '@/lib/website_trust';

// Homepage numbers strip, trust badges and rating strip toggle.
export async function GET(request) {
  const auth = verifyAdminAuth(request);
  if (!auth) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    return NextResponse.json({ success: true, trust: await getTrustSettings() });
  } catch (err) {
    console.error('Website trust GET error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PUT(request) {
  const auth = verifyAdminAuth(request);
  if (!auth) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const trust = await saveTrustSettings(await request.json());
    await logActivity(auth.username, 'Website', null, 'Trust Updated', `Updated homepage trust section (${trust.stats.length} numbers, ${trust.badges.length} badges)`);
    return NextResponse.json({ success: true, trust });
  } catch (err) {
    console.error('Website trust PUT error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
