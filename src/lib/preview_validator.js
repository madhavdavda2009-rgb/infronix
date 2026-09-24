/**
 * Preview URL Validator for Client Portal Live Preview Frame
 */

// List of allowed staging/production domain patterns
const ALLOWED_DOMAIN_PATTERNS = [
  /^([a-z0-9-]+\.)*infronixweb\.in$/i,
  /^([a-z0-9-]+\.)*vercel\.app$/i,
  /^([a-z0-9-]+\.)*netlify\.app$/i,
  /^([a-z0-9-]+\.)*pages\.dev$/i,
  /^([a-z0-9-]+\.)*github\.io$/i,
  /^([a-z0-9-]+\.)*render\.com$/i,
  /^([a-z0-9-]+\.)*railway\.app$/i,
  /^([a-z0-9-]+\.)*fly\.dev$/i
];

/**
 * Validate preview URL.
 * Returns { valid: boolean, error?: string, sanitizedUrl?: string }
 */
export function validatePreviewUrl(rawUrl) {
  if (!rawUrl || typeof rawUrl !== 'string') {
    return { valid: false, error: 'Preview URL is required' };
  }

  const trimmed = rawUrl.trim();

  // Block unsafe protocols
  if (/^(javascript|data|file|vbscript|blob):/i.test(trimmed)) {
    return { valid: false, error: 'Unsafe URL protocol is not permitted' };
  }

  try {
    const parsed = new URL(trimmed);

    // Protocol check
    const isLocalDev = process.env.NODE_ENV !== 'production' && (parsed.hostname === 'localhost' || parsed.hostname === '127.0.0.1');
    if (!isLocalDev && parsed.protocol !== 'https:') {
      return { valid: false, error: 'Preview URLs must use secure HTTPS protocol in production' };
    }

    if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
      return { valid: false, error: 'Only HTTP and HTTPS protocols are permitted' };
    }

    // Block credentials in URL
    if (parsed.username || parsed.password) {
      return { valid: false, error: 'Credentials in preview URL are forbidden for security' };
    }

    // Block private/internal IP ranges in production
    if (!isLocalDev) {
      const hostname = parsed.hostname.toLowerCase();
      if (
        hostname === 'localhost' ||
        hostname.startsWith('127.') ||
        hostname.startsWith('10.') ||
        hostname.startsWith('192.168.') ||
        hostname.startsWith('172.16.') ||
        hostname.endsWith('.internal') ||
        hostname.endsWith('.local')
      ) {
        return { valid: false, error: 'Internal and local network URLs cannot be used as client preview destinations' };
      }
    }

    return {
      valid: true,
      sanitizedUrl: parsed.toString()
    };
  } catch (e) {
    return { valid: false, error: 'Invalid URL format' };
  }
}
