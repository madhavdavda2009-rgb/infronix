import crypto from 'crypto';

// Time-based one-time codes (RFC 6238), the same codes Google Authenticator,
// Microsoft Authenticator and Authy show. SHA-1, 6 digits, 30-second steps.

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
const STEP_SECONDS = 30;
const DIGITS = 6;

export function base32Encode(buffer) {
  let bits = 0;
  let value = 0;
  let out = '';
  for (const byte of buffer) {
    value = (value << 8) | byte;
    bits += 8;
    while (bits >= 5) {
      out += ALPHABET[(value >>> (bits - 5)) & 31];
      bits -= 5;
    }
  }
  if (bits > 0) out += ALPHABET[(value << (5 - bits)) & 31];
  return out;
}

export function base32Decode(text) {
  const clean = String(text || '').toUpperCase().replace(/[\s=-]/g, '');
  let bits = 0;
  let value = 0;
  const bytes = [];
  for (const char of clean) {
    const index = ALPHABET.indexOf(char);
    if (index === -1) throw new Error('Invalid base32 secret');
    value = (value << 5) | index;
    bits += 5;
    if (bits >= 8) {
      bytes.push((value >>> (bits - 8)) & 255);
      bits -= 8;
    }
  }
  return Buffer.from(bytes);
}

/** A new random 160-bit secret, as the base32 text authenticator apps expect. */
export function generateTotpSecret() {
  return base32Encode(crypto.randomBytes(20));
}

export function currentStep(now = Date.now()) {
  return Math.floor(now / 1000 / STEP_SECONDS);
}

export function totpCode(secret, step) {
  const counter = Buffer.alloc(8);
  counter.writeBigUInt64BE(BigInt(step));
  const hmac = crypto.createHmac('sha1', base32Decode(secret)).update(counter).digest();
  const offset = hmac[hmac.length - 1] & 15;
  const number = (hmac.readUInt32BE(offset) & 0x7fffffff) % 10 ** DIGITS;
  return String(number).padStart(DIGITS, '0');
}

/**
 * Checks a 6-digit code, allowing one step of clock drift either way.
 * Returns the matching step, or null. A step at or below `lastUsedStep` is refused,
 * so a code that was already used cannot be replayed.
 */
export function verifyTotp(secret, code, lastUsedStep = 0, now = Date.now()) {
  const given = String(code || '').replace(/\s/g, '');
  if (!/^\d{6}$/.test(given)) return null;
  const step = currentStep(now);
  for (const candidate of [step - 1, step, step + 1]) {
    if (candidate <= Number(lastUsedStep || 0)) continue;
    const expected = totpCode(secret, candidate);
    if (crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(given))) return candidate;
  }
  return null;
}

export function otpauthUri(secret, accountName, issuer = 'InfronixWeb') {
  const label = encodeURIComponent(`${issuer}:${accountName}`);
  const params = new URLSearchParams({ secret, issuer, algorithm: 'SHA1', digits: String(DIGITS), period: String(STEP_SECONDS) });
  return `otpauth://totp/${label}?${params.toString()}`;
}

// ── Backup codes: one-time codes for when the phone is lost ──────────────────

export function generateBackupCodes(count = 10) {
  return Array.from({ length: count }, () => {
    const raw = base32Encode(crypto.randomBytes(5)).slice(0, 8).toLowerCase();
    return `${raw.slice(0, 4)}-${raw.slice(4)}`;
  });
}

export function normaliseBackupCode(code) {
  return String(code || '').toLowerCase().replace(/[^a-z2-7]/g, '');
}

export function hashBackupCode(code) {
  return crypto.createHash('sha256').update(normaliseBackupCode(code)).digest('hex');
}
