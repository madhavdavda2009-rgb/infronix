import { NextResponse } from 'next/server';
import { query, initFounderOSDb } from '@/lib/founder_os_db';
import { verifyAdminAuth } from '@/lib/auth';
import { logActivity } from '@/lib/audit_logger';

export async function GET(request) {
  const auth = verifyAdminAuth(request);
  if (!auth) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await initFounderOSDb();
    const settingsRes = await query('SELECT key, value FROM founder_os_settings');
    const settings = {};
    for (const row of settingsRes.rows) {
      settings[row.key] = row.value;
    }

    return NextResponse.json({
      success: true,
      settings,
      currentUser: {
        username: auth.username,
        role: auth.role || 'Administrator'
      }
    });
  } catch (err) {
    console.error('Settings GET error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PUT(request) {
  const auth = verifyAdminAuth(request);
  if (!auth) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await initFounderOSDb();
    const body = await request.json();
    const { business_name, currency_symbol, currency_code, timezone } = body;

    if (business_name) {
      await query(`
        INSERT INTO founder_os_settings (key, value, updated_at)
        VALUES ('business_name', $1, NOW())
        ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()
      `, [business_name.trim()]);
    }

    if (currency_symbol) {
      await query(`
        INSERT INTO founder_os_settings (key, value, updated_at)
        VALUES ('currency_symbol', $1, NOW())
        ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()
      `, [currency_symbol.trim()]);
    }

    if (currency_code) {
      await query(`
        INSERT INTO founder_os_settings (key, value, updated_at)
        VALUES ('currency_code', $1, NOW())
        ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()
      `, [currency_code.trim()]);
    }

    if (timezone) {
      await query(`
        INSERT INTO founder_os_settings (key, value, updated_at)
        VALUES ('timezone', $1, NOW())
        ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()
      `, [timezone.trim()]);
    }

    await logActivity(auth.username, 'Settings', null, 'Updated', 'Updated business profile settings');

    return NextResponse.json({ success: true, message: 'Settings saved successfully' });
  } catch (err) {
    console.error('Settings PUT error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
