/**
 * Safely parses response JSON without throwing "Unexpected end of JSON input".
 */
export async function parseJsonResponse(response) {
  try {
    const text = await response.text();
    if (!text || text.trim() === '') {
      return {
        success: false,
        error: response.ok
          ? 'Server completed request without returning data.'
          : 'Service received an unexpected empty response.'
      };
    }
    return JSON.parse(text);
  } catch (err) {
    return {
      success: false,
      error: 'We encountered a response formatting issue. Please try again.'
    };
  }
}

/**
 * Converts raw errors, status codes, and exceptions into clear, non-technical, friendly user messages.
 * Prevents internal server details, SQL traces, or raw code exceptions from reaching the client.
 */
export function getFriendlyErrorMessage(err, defaultMessage = 'Something went wrong. Please try again or contact support.') {
  if (!err) return defaultMessage;

  const rawMessage = typeof err === 'string' ? err : err.message || '';
  const msgLower = rawMessage.toLowerCase();

  // JSON parse error / unexpected end of input
  if (msgLower.includes('unexpected end of json input') || msgLower.includes('json.parse') || msgLower.includes('failed to execute')) {
    return "The server response was interrupted. Please refresh or try again shortly.";
  }

  // Network or Server Connectivity Issues
  if (
    msgLower.includes('failed to fetch') ||
    msgLower.includes('networkerror') ||
    msgLower.includes('econnrefused') ||
    msgLower.includes('connection error') ||
    msgLower.includes('offline')
  ) {
    return "We're having trouble connecting to our server right now. Please check your internet connection and try again.";
  }

  // Rate limit / Too many submissions
  if (
    msgLower.includes('too many requests') ||
    msgLower.includes('rate limit') ||
    msgLower.includes('24-hour')
  ) {
    return 'You have reached the submission limit for today. Please wait before requesting another session.';
  }

  // Authentication Failures
  if (
    msgLower.includes('invalid username') ||
    msgLower.includes('invalid password') ||
    msgLower.includes('unauthorized') ||
    msgLower.includes('authentication failed')
  ) {
    return 'Incorrect credentials. Please double-check your username and password.';
  }

  // Expired Sessions / Forbidden
  if (
    msgLower.includes('jwt') ||
    msgLower.includes('session expired') ||
    msgLower.includes('forbidden') ||
    msgLower.includes('token')
  ) {
    return 'Your security session has expired. Please sign in again to continue.';
  }

  // Internal Server / Database Errors (500s)
  if (
    msgLower.includes('500') ||
    msgLower.includes('internal server error') ||
    msgLower.includes('sqlite') ||
    msgLower.includes('database') ||
    msgLower.includes('sql') ||
    msgLower.includes('syntaxerror')
  ) {
    return 'Our systems are undergoing brief maintenance. Please try again in a few moments.';
  }

  // Clean human readable message passed from API
  if (
    rawMessage &&
    !msgLower.includes('error:') &&
    !msgLower.includes('at ') &&
    !msgLower.includes('stack') &&
    rawMessage.length < 150
  ) {
    return rawMessage;
  }

  return defaultMessage;
}
