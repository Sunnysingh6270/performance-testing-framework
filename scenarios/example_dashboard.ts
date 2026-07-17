import { get } from '../core/http.ts';
import { group, sleep } from 'k6';

export function scenario() {
  // Example UI/Dashboard flow simulation
  // This simulates a user opening a dashboard and fetching multiple resources
  
  group('Dashboard Load', function () {
    // 1. Load main dashboard page (Simulated HTML fetch)
    get('/');
    
    // 2. Fetch data for widgets
    group('Fetch Widgets', function () {
      get('/api/users/1');
      get('/api/users/2');
      get('/api/users/3');
    });

    sleep(2); // Think time between actions
  });
}
