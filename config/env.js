export const ENV = {
  BASE_URL: __ENV.BASE_URL || 'https://test-api.k6.io',
  SCENARIO: __ENV.SCENARIO || 'example_api',
  TEST_TYPE: __ENV.TEST_TYPE || 'load',
  
  // Authentication configurations
  AUTH_TYPE: __ENV.AUTH_TYPE || 'none', // none, token, basic, cookie
  AUTH_TOKEN: __ENV.AUTH_TOKEN || '',
  AUTH_USERNAME: __ENV.AUTH_USERNAME || '',
  AUTH_PASSWORD: __ENV.AUTH_PASSWORD || '',
  
  // Custom headers (JSON string)
  CUSTOM_HEADERS: __ENV.CUSTOM_HEADERS ? JSON.parse(__ENV.CUSTOM_HEADERS) : {},
};
