import { get, post } from '../core/http.js';
import { sleep } from 'k6';

// Read data once during init phase (works well for static test data)
const payloads = JSON.parse(open('../test-data/example_payloads.json'));

export function scenario() {
  // Example API test against a public mock API
  
  // 1. GET Request
  get('/api/users?page=2');
  sleep(1);

  // 2. POST Request
  post('/api/users', payloads.user, {}, 201);
  sleep(1);
}
