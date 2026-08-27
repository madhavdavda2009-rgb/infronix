/**
 * Helper utility to read, write, and manage cookies securely.
 */

// Read a cookie value by name
export function getCookie(name) {
  if (typeof document === 'undefined') return null;
  const nameEQ = name + '=';
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return decodeURIComponent(c.substring(nameEQ.length, c.length));
  }
  return null;
}

// Set a cookie with optional expiration in days
export function setCookie(name, value, days = 365, sameSite = 'Lax') {
  if (typeof document === 'undefined') return;
  let expires = '';
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = '; expires=' + date.toUTCString();
  }
  const secure = window.location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `${name}=${encodeURIComponent(value)}${expires}; path=/; SameSite=${sameSite}${secure}`;
}

// Remove a cookie by name
export function removeCookie(name) {
  if (typeof document === 'undefined') return;
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

// Default Consent Structure
export const DEFAULT_CONSENT = {
  essential: true, // Always true for rate-limiting, security & session tokens
  analytics: false,
  marketing: false,
  chosen: false,
  timestamp: null
};

// Retrieve Consent Preferences
export function getConsentPreferences() {
  const cookieVal = getCookie('infronix_cookie_consent');
  if (cookieVal) {
    try {
      return JSON.parse(cookieVal);
    } catch (e) {
      // Fallback if raw string
    }
  }
  return DEFAULT_CONSENT;
}

// Save Consent Preferences
export function setConsentPreferences(preferences) {
  const updated = {
    ...preferences,
    essential: true, // Essential is non-negotiable for site security & rate limiting
    chosen: true,
    timestamp: new Date().toISOString()
  };
  
  // Store in Cookie (365 days) and LocalStorage
  setCookie('infronix_cookie_consent', JSON.stringify(updated), 365);
  try {
    localStorage.setItem('infronix_cookie_consent', JSON.stringify(updated));
  } catch (e) {
    // Ignore localStorage block
  }
  
  return updated;
}

// Generate or retrieve anonymous unique device ID cookie for rate limiting & IP security tracking
export function getOrSetDeviceId() {
  let deviceId = getCookie('infronix_device_id');
  if (!deviceId) {
    deviceId = 'dev_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
    setCookie('infronix_device_id', deviceId, 730); // 2 years
  }
  return deviceId;
}
