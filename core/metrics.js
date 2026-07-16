import { Trend, Rate, Counter } from 'k6/metrics';

// Custom metrics to track specific behaviors beyond the default http_req_* metrics
export const customMetrics = {
  // Successful requests counter
  successfulRequests: new Counter('successful_requests'),
  // Failed requests counter
  failedRequests: new Counter('failed_requests'),
  // Custom trend for grouping specific types of requests (e.g., API vs Static)
  apiResponseTime: new Trend('api_response_time'),
};

/**
 * Tracks the success/failure of a response and records custom metrics.
 * @param {object} res - The k6 http response object
 * @param {boolean} isSuccess - Optional override for success condition
 */
export function trackMetrics(res, isSuccess) {
  const success = isSuccess !== undefined ? isSuccess : (res.status >= 200 && res.status < 400);

  if (success) {
    customMetrics.successfulRequests.add(1);
  } else {
    customMetrics.failedRequests.add(1);
  }

  // If this is an API call (JSON response or /api/ path), track in custom trend
  if (res.url && res.url.includes('/api/')) {
    customMetrics.apiResponseTime.add(res.timings.duration);
  }
}
