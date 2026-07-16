import { evaluateResults } from './evaluator.js';

export function generateReport(data) {
  const { isPass, observation, recommendation } = evaluateResults(data);

  // Extract metrics safely
  const getMetric = (name, field) => {
    return data.metrics[name] && data.metrics[name].values[field] 
      ? data.metrics[name].values[field].toFixed(2) 
      : 'N/A';
  };

  const totalRequests = data.metrics.http_reqs ? data.metrics.http_reqs.values.count : 0;
  const failedRequestsCount = data.metrics.failed_requests ? data.metrics.failed_requests.values.count : 0;
  const failedRequestPercentage = totalRequests > 0 ? ((failedRequestsCount / totalRequests) * 100).toFixed(2) : 0;

  const report = {
    "Module Name": __ENV.SCENARIO || "Unknown Scenario",
    "Test Type": __ENV.TEST_TYPE || "Unknown Type",
    "Scenario": __ENV.SCENARIO || "Unknown Scenario",
    "Concurrent Users (Max)": data.metrics.vus ? data.metrics.vus.values.max : 'N/A',
    "Total Requests": totalRequests,
    "Average Response Time (ms)": getMetric('http_req_duration', 'avg'),
    "Min Response Time (ms)": getMetric('http_req_duration', 'min'),
    "Max Response Time (ms)": getMetric('http_req_duration', 'max'),
    "P90 Response Time (ms)": getMetric('http_req_duration', 'p(90)'),
    "P95 Response Time (ms)": getMetric('http_req_duration', 'p(95)'),
    "Throughput (req/s)": getMetric('http_reqs', 'rate'),
    "Failed Request Percentage (%)": failedRequestPercentage,
    "Threshold Result": isPass ? "PASS" : "FAIL",
    "Performance Result": isPass ? "PASS" : "FAIL",
    "Observation": observation,
    "Recommendation": recommendation
  };

  return JSON.stringify(report, null, 2);
}

/**
 * Custom text summary for console output.
 */
export function generateTextSummary(data) {
  const report = JSON.parse(generateReport(data));
  let text = '\n======================================================\n';
  text += `   PERFORMANCE TEST REPORT: ${report["Module Name"].toUpperCase()} (${report["Test Type"].toUpperCase()})\n`;
  text += '======================================================\n';
  
  for (const [key, value] of Object.entries(report)) {
    text += `${key.padEnd(30)} : ${value}\n`;
  }
  text += '======================================================\n';
  return text;
}
