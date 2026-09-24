/**
 * Server-Side In-Memory Rate Limiter
 * 
 * Provides IP-based rate limiting for sensitive endpoints:
 *   - 3 attempts within a window  →  1-hour lockout
 * 
 * NOTE: This is in-memory, so restarting the server clears counts.
 * For production with multiple instances, swap the Map for a Redis store.
 */

/** @type {Map<string, { count: number, lockedUntil: number | null, firstAttempt: number }>} */
const store = new Map();

// Purge stale entries every 15 minutes to prevent memory bloat
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of store) {
      const isUnlocked = !entry.lockedUntil || entry.lockedUntil < now;
      const isStale = now - entry.firstAttempt > 2 * 60 * 60 * 1000; // 2 hours old
      if (isUnlocked && isStale) {
        store.delete(key);
      }
    }
  }, 15 * 60 * 1000);
}

/**
 * Check and record an attempt.
 * 
 * @param {string} key     - Unique key, typically `"${context}:${ip}"` or `"${context}:${identifier}"`
 * @param {object} options
 * @param {number} options.maxAttempts  - Max failures before lockout (default: 3)
 * @param {number} options.lockMs       - Lockout duration in milliseconds (default: 1 hour)
 * @param {number} options.windowMs     - Sliding window for counting attempts (default: 1 hour)
 * @returns {{ allowed: boolean, attemptsLeft: number, lockedUntilMs: number | null, message: string }}
 */
export function checkAndRecord(key, { maxAttempts = 3, lockMs = 60 * 60 * 1000, windowMs = 60 * 60 * 1000 } = {}) {
  const now = Date.now();
  const entry = store.get(key) || { count: 0, lockedUntil: null, firstAttempt: now };

  // Still locked?
  if (entry.lockedUntil && entry.lockedUntil > now) {
    const remaining = Math.ceil((entry.lockedUntil - now) / 60000);
    return {
      allowed: false,
      attemptsLeft: 0,
      lockedUntilMs: entry.lockedUntil,
      message: `Too many attempts. Please try again in ${remaining} minute${remaining !== 1 ? 's' : ''}.`
    };
  }

  // Reset window if it has expired (and wasn't locked, or lock has expired)
  const windowExpired = now - entry.firstAttempt > windowMs;
  const lockExpired = entry.lockedUntil && entry.lockedUntil <= now;

  if (windowExpired || lockExpired) {
    store.set(key, { count: 1, lockedUntil: null, firstAttempt: now });
    return { allowed: true, attemptsLeft: maxAttempts - 1, lockedUntilMs: null, message: '' };
  }

  // Increment
  const newCount = entry.count + 1;

  if (newCount >= maxAttempts) {
    const lockedUntil = now + lockMs;
    store.set(key, { count: newCount, lockedUntil, firstAttempt: entry.firstAttempt });
    const mins = Math.ceil(lockMs / 60000);
    return {
      allowed: false,
      attemptsLeft: 0,
      lockedUntilMs: lockedUntil,
      message: `Too many attempts. Locked for ${mins} minute${mins !== 1 ? 's' : ''}. Try again later.`
    };
  }

  store.set(key, { count: newCount, lockedUntil: null, firstAttempt: entry.firstAttempt });
  return {
    allowed: true,
    attemptsLeft: maxAttempts - newCount,
    lockedUntilMs: null,
    message: ''
  };
}

/**
 * Reset the counter for a key (e.g. on successful login).
 * @param {string} key
 */
export function resetKey(key) {
  store.delete(key);
}

/**
 * Get the current state without recording a new attempt.
 * @param {string} key
 * @param {{ maxAttempts?: number, lockMs?: number }} options
 */
export function getState(key, { maxAttempts = 3 } = {}) {
  const now = Date.now();
  const entry = store.get(key);
  if (!entry) return { locked: false, attemptsLeft: maxAttempts, lockedUntilMs: null };

  if (entry.lockedUntil && entry.lockedUntil > now) {
    return { locked: true, attemptsLeft: 0, lockedUntilMs: entry.lockedUntil };
  }
  return { locked: false, attemptsLeft: Math.max(0, maxAttempts - entry.count), lockedUntilMs: null };
}

/**
 * Convenience: extract IP from a Next.js request object.
 * @param {Request} request
 * @returns {string}
 */
export function getIp(request) {
  return (
    request?.headers?.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request?.headers?.get('x-real-ip')?.trim() ||
    '127.0.0.1'
  );
}
