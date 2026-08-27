/**
 * Formats strings to Title Case (capitalizes the first letter of each word).
 * e.g., "john doe" -> "John Doe", "ACME CORP" -> "Acme Corp"
 */
export function formatTitleCase(str = '') {
  if (!str) return '';
  return str
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Formats email addresses to trimmed lowercase.
 * e.g., "  JANE.DOE@Company.COM " -> "jane.doe@company.com"
 */
export function formatEmail(str = '') {
  if (!str) return '';
  return str.trim().toLowerCase();
}

/**
 * Validates standard email address format.
 * Ensures username, '@' symbol, domain name, and valid TLD extension.
 */
export function isValidEmail(email = '') {
  if (!email) return false;
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(email.trim().toLowerCase());
}
