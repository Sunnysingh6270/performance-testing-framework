import http from 'k6/http';
import { check } from 'k6';
import { ENV } from '../config/env.ts';
import { getAuthHeaders } from './auth.ts';
import { trackMetrics } from './metrics.ts';

/**
 * Builds the complete headers for a request, combining default headers,
 * auth headers, custom global headers, and request-specific headers.
 */
function buildHeaders(customHeaders = {}) {
  const authHeaders = getAuthHeaders();
  return {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...ENV.CUSTOM_HEADERS,
    ...authHeaders,
    ...customHeaders,
  };
}

/**
 * Wrapper for k6 http.get
 */
export function get(endpoint: string, customHeaders: Record<string, string> = {}, expectedStatus: number = 200) {
  const url = `${ENV.BASE_URL}${endpoint}`;
  const params = {
    headers: buildHeaders(customHeaders),
  };
  
  const res = http.get(url, params);
  
  const isSuccess = check(res, {
    [`status is ${expectedStatus}`]: (r) => r.status === expectedStatus,
  });
  
  trackMetrics(res, isSuccess);
  return res;
}

/**
 * Wrapper for k6 http.post
 */
export function post(endpoint: string, payload: any, customHeaders: Record<string, string> = {}, expectedStatus: number = 200) {
  const url = `${ENV.BASE_URL}${endpoint}`;
  const body = typeof payload === 'string' ? payload : JSON.stringify(payload);
  const params = {
    headers: buildHeaders(customHeaders),
  };
  
  const res = http.post(url, body, params);
  
  const isSuccess = check(res, {
    [`status is ${expectedStatus} or 201`]: (r) => r.status === expectedStatus || r.status === 201,
  });
  
  trackMetrics(res, isSuccess);
  return res;
}

/**
 * Wrapper for k6 http.put
 */
export function put(endpoint: string, payload: any, customHeaders: Record<string, string> = {}, expectedStatus: number = 200) {
  const url = `${ENV.BASE_URL}${endpoint}`;
  const body = typeof payload === 'string' ? payload : JSON.stringify(payload);
  const params = {
    headers: buildHeaders(customHeaders),
  };
  
  const res = http.put(url, body, params);
  
  const isSuccess = check(res, {
    [`status is ${expectedStatus}`]: (r) => r.status === expectedStatus,
  });
  
  trackMetrics(res, isSuccess);
  return res;
}

/**
 * Wrapper for k6 http.del
 */
export function del(endpoint: string, customHeaders: Record<string, string> = {}, expectedStatus: number = 200) {
  const url = `${ENV.BASE_URL}${endpoint}`;
  const params = {
    headers: buildHeaders(customHeaders),
  };
  
  const res = http.del(url, null, params);
  
  const isSuccess = check(res, {
    [`status is ${expectedStatus} or 204`]: (r) => r.status === expectedStatus || r.status === 204,
  });
  
  trackMetrics(res, isSuccess);
  return res;
}
