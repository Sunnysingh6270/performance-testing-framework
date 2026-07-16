/**
 * Evaluates the results against expected thresholds.
 * For custom thresholds, k6 inherently marks a test as passed/failed based on the config.
 * However, this module provides logic to programmatically extract that for the custom report.
 * 
 * @param {object} data - The summary data provided by handleSummary
 * @returns {object} Evaluation results (pass/fail status, observations)
 */
export function evaluateResults(data) {
  let isPass = true;
  let failedThresholds = [];

  // Iterate over all metrics and their thresholds
  for (const [metricName, metric] of Object.entries(data.metrics)) {
    if (metric.thresholds) {
      for (const [thresholdName, thresholdPassed] of Object.entries(metric.thresholds)) {
        if (!thresholdPassed.ok) {
          isPass = false;
          failedThresholds.push(`${metricName} failed on threshold ${thresholdName}`);
        }
      }
    }
  }

  let observation = 'All performance metrics are within the acceptable thresholds.';
  let recommendation = 'No action required.';

  if (!isPass) {
    observation = `Performance issues detected: ${failedThresholds.join(', ')}`;
    recommendation = 'Investigate the endpoints failing thresholds. Consider scaling resources or optimizing the application code.';
  }

  return {
    isPass,
    observation,
    recommendation
  };
}
