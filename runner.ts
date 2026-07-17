import { ENV } from './config/env.ts';
import { getThresholds } from './config/thresholds.config.ts';
import { loadProfile } from './profiles/load.ts';
import { stressProfile } from './profiles/stress.ts';
import { spikeProfile } from './profiles/spike.ts';
import { volumeProfile } from './profiles/volume.ts';
import { generateReport, generateTextSummary } from './core/reporter.ts';

// 1. Dynamic Options Configuration
let profileOptions = {};

switch (ENV.TEST_TYPE) {
  case 'load':
    profileOptions = loadProfile;
    break;
  case 'stress':
    profileOptions = stressProfile;
    break;
  case 'spike':
    profileOptions = spikeProfile;
    break;
  case 'volume':
    profileOptions = volumeProfile;
    break;
  default:
    console.error(`Unknown TEST_TYPE: ${ENV.TEST_TYPE}. Defaulting to load.`);
    profileOptions = loadProfile;
}

export const options = {
  ...profileOptions,
  thresholds: getThresholds(ENV.TEST_TYPE),
  // Optionally disable connection reuse or set other global k6 options here
};

// 2. Setup (Optional) - Can be used to fetch initial tokens if needed before tests start
export function setup() {
  console.log(`Starting ${ENV.TEST_TYPE.toUpperCase()} test for scenario: ${ENV.SCENARIO.toUpperCase()}`);
  return { startTime: new Date().toISOString() };
}

// 3. Dynamic Scenario Routing
// Note: k6 does not support dynamic imports inside the default function in the same way Node does.
// Therefore, we must import all available scenarios and route them here, or use a build step.
// For a fully dynamic approach without a build step, we map scenarios explicitly.

import { scenario as exampleApi } from './scenarios/example_api.ts';
import { scenario as exampleDashboard } from './scenarios/example_dashboard.ts';

const scenarios: Record<string, () => void> = {
  'example_api': exampleApi,
  'example_dashboard': exampleDashboard,
  // Add new scenarios here
};

export default function () {
  const runScenario = scenarios[ENV.SCENARIO];
  if (!runScenario) {
    console.error(`Scenario '${ENV.SCENARIO}' not found! Check your SCENARIO environment variable.`);
    return;
  }
  runScenario();
}

// 4. Teardown & Reporting
export function handleSummary(data: any) {
  const jsonReport = generateReport(data);
  const textSummary = generateTextSummary(data);

  const reportFileName = `reports/report_${ENV.SCENARIO}_${ENV.TEST_TYPE}_${Date.now()}.json`;

  return {
    'stdout': textSummary, // Print human-readable summary to console
    [reportFileName]: jsonReport, // Save detailed structured report
  };
}
