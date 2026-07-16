// Defines default thresholds for different test types
// These can be overridden per scenario if needed
export const getThresholds = (testType) => {
  const baseThresholds = {
    http_req_failed: ['rate<0.01'], // http errors should be less than 1%
    http_reqs: ['count>0'],         // ensure some requests are made
  };

  switch (testType) {
    case 'load':
      return {
        ...baseThresholds,
        http_req_duration: ['p(90)<1000', 'p(95)<1500'], // 95% of requests should be below 1.5s
      };
    case 'stress':
      return {
        ...baseThresholds,
        http_req_duration: ['p(90)<2000', 'p(95)<3000'], // More lenient thresholds under stress
        http_req_failed: ['rate<0.05'], // Accept slightly higher error rate under stress
      };
    case 'spike':
      return {
        ...baseThresholds,
        http_req_duration: ['p(90)<3000', 'p(95)<5000'], // Spikes can cause latency
        http_req_failed: ['rate<0.1'], // Up to 10% failure during spike is often accepted
      };
    case 'volume':
      return {
        ...baseThresholds,
        http_req_duration: ['p(90)<1000', 'p(95)<1500'],
      };
    default:
      return {
        ...baseThresholds,
        http_req_duration: ['p(90)<1000', 'p(95)<1500'],
      };
  }
};
