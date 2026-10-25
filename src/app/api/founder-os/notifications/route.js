import { NextResponse } from 'next/server';
import { query, initFounderOSDb } from '@/lib/founder_os_db';
import { verifyAdminAuth } from '@/lib/auth';

// Admin notification feed: website leads (enquiries) plus client-portal actions that
// notifyAdminAboutClientAction() records with recipient_type = 'Admin'.
// Leads are unread while still "New" and newer than the last "mark all as read".
const SEEN_KEY = 'admin_notifications_seen_at';
const DEFAULT_LOOKBACK_DAYS = 7;

async function getSeenAt() {
  const res = await query('SELECT value FROM founder_os_settings WHERE key = $1', [SEEN_KEY]);
  const value = res.rows[0]?.value;
  const parsed = value ? new Date(value) : null;
  return parsed && !Number.isNaN(parsed.getTime())
    ? parsed
    : new Date(Date.now() - DEFAULT_LOOKBACK_DAYS * 86400000);
}

function linkForClientAction(row) {
  if (row.category === 'Document') return '/admin?tab=documents';
  return row.action_url || '/admin?tab=clients';
}

export async function GET(request) {
  const auth = verifyAdminAuth(request);
  if (!auth) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await initFounderOSDb();
    const seenAt = await getSeenAt();
    const [clientRes, leadRes] = await Promise.all([
      query(`
        SELECT id, title, message, action_url, category, is_read, created_at
        FROM founder_os_portal_notifications
        WHERE recipient_type = 'Admin' AND created_at > NOW() - INTERVAL '60 days'
        ORDER BY created_at DESC
        LIMIT 40
      `),
      query(`
        SELECT id, reference_id, full_name, company, selected_service, budget, status, form_type, created_at
        FROM founder_os_enquiries
        WHERE created_at > NOW() - INTERVAL '60 days'
        ORDER BY created_at DESC
        LIMIT 30
      `),
    ]);

    const items = [
      ...leadRes.rows.map(e => ({
        key: `lead-${e.id}`,
        kind: 'lead',
        title: `New website lead: ${e.full_name}`,
        message: [e.company, e.selected_service, e.budget].filter(Boolean).join(' · ') || e.form_type || 'Website enquiry',
        category: 'Website Lead',
        link: '/admin?tab=sales&sub=enquiries',
        unread: e.status === 'New' && new Date(e.created_at) > seenAt,
        created_at: e.created_at,
      })),
      ...clientRes.rows.map(n => ({
        key: `client-${n.id}`,
        kind: 'client',
        title: String(n.title || '').replace(/^Client Action:\s*/, ''),
        message: n.message,
        category: n.category || 'Client',
        link: linkForClientAction(n),
        unread: !n.is_read,
        created_at: n.created_at,
      })),
    ]
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 50);

    return NextResponse.json({
      success: true,
      notifications: items,
      unreadCount: items.filter(i => i.unread).length,
      newLeadsToday: leadRes.rows.filter(e => new Date(e.created_at) > new Date(new Date().setHours(0, 0, 0, 0))).length,
    });
  } catch (err) {
    console.error('Admin notifications GET error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PATCH(request) {
  const auth = verifyAdminAuth(request);
  if (!auth) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await initFounderOSDb();
    const body = await request.json().catch(() => ({}));

    if (body.action === 'read_all') {
      await query("UPDATE founder_os_portal_notifications SET is_read = TRUE WHERE recipient_type = 'Admin' AND is_read = FALSE");
      await query(`
        INSERT INTO founder_os_settings (key, value, updated_at) VALUES ($1, $2, NOW())
        ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()
      `, [SEEN_KEY, new Date().toISOString()]);
      return NextResponse.json({ success: true });
    }

    const match = typeof body.key === 'string' && body.key.match(/^client-(\d+)$/);
    if (body.action === 'read' && match) {
      await query("UPDATE founder_os_portal_notifications SET is_read = TRUE WHERE id = $1 AND recipient_type = 'Admin'", [parseInt(match[1], 10)]);
      return NextResponse.json({ success: true });
    }

    // Leads stay unread until they are handled in Sales or everything is marked read.
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Admin notifications PATCH error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
