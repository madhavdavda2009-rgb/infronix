import { NextResponse } from 'next/server';
import { getLearnedPhrases, recordLearning } from '@/lib/niya_learning';
import { checkAndRecord, getIp } from '@/lib/rate_limiter';

export const dynamic = 'force-dynamic';

// GET: phrases Niya has learned from visitors. POST: one visitor's choice after Niya was unsure.
export async function GET() {
  try {
    return NextResponse.json({ success: true, learned: await getLearnedPhrases() }, {
      headers: { 'Cache-Control': 'public, max-age=300' },
    });
  } catch (error) {
    console.error('Niya learned phrases error:', error.message);
    return NextResponse.json({ success: false, learned: [] });
  }
}

export async function POST(request) {
  const ip = getIp(request);
  // Generous enough for real chats, low enough that nobody can flood the votes.
  const limit = checkAndRecord(`niya-learn:${ip}`, { maxAttempts: 20, windowMs: 60 * 60 * 1000, lockMs: 60 * 60 * 1000 });
  if (!limit.allowed) return NextResponse.json({ success: false }, { status: 429 });

  try {
    const body = await request.json().catch(() => ({}));
    // One vote per visitor per phrase, so a phrase is learned only when different people agree.
    const voteKey = `${ip}|${String(body?.phrase || '').toLowerCase().trim()}|${body?.topic}`;
    const seen = (globalThis._niyaVotes ||= new Set());
    if (seen.has(voteKey)) return NextResponse.json({ success: true });
    if (seen.size > 20000) seen.clear();
    seen.add(voteKey);
    const saved = await recordLearning(body?.phrase, body?.topic);
    return NextResponse.json({ success: saved });
  } catch (error) {
    console.error('Niya learning error:', error.message);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
