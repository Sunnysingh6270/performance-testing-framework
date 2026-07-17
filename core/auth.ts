import { ENV } from '../config/env.ts';
import encoding from 'k6/encoding';

/**
 * Returns the authentication headers based on the configured AUTH_TYPE.
 * Supports token (Bearer), basic, and custom headers.
 * For cookies, it can return a string to be set in the headers or handled via k6 jar.
 */
export function getAuthHeaders() {
  const headers: Record<string, string> = {};

  switch (ENV.AUTH_TYPE) {
    case 'token':
      if (ENV.AUTH_TOKEN) {
        headers['Authorization'] = `Bearer ${ENV.AUTH_TOKEN}`;
      }
      break;
    case 'basic':
      if (ENV.AUTH_USERNAME && ENV.AUTH_PASSWORD) {
        const credentials = `${ENV.AUTH_USERNAME}:${ENV.AUTH_PASSWORD}`;
        const encodedCredentials = encoding.b64encode(credentials);
        headers['Authorization'] = `Basic ${encodedCredentials}`;
      }
      break;
    case 'cookie':
      if (ENV.AUTH_TOKEN) {
        // Simple cookie injection via header, though k6 supports http.cookieJar()
        headers['Cookie'] = ENV.AUTH_TOKEN;
      }
      break;
    case 'none':
    default:
      // No auth headers
      break;
  }

  return headers;
}
