# Performance Testing Automation Framework

A generic, project-independent performance testing framework built with Grafana k6 and JavaScript. 
This framework is designed to be reusable across any web application or API.

## Architecture

The framework is organized into the following components:

- **`core/`**: Reusable modules for HTTP request handling (`http.js`), authentication (`auth.js`), custom metrics (`metrics.js`), threshold evaluation (`evaluator.js`), and report generation (`reporter.js`).
- **`profiles/`**: Configuration files defining execution stages for different test types (`load`, `stress`, `spike`, `volume`).
- **`config/`**: Centralized environment variable management (`env.js`) and dynamic threshold definitions (`thresholds.config.js`).
- **`scenarios/`**: Specific user journeys or API test cases. (e.g., `example_api.js`, `example_dashboard.js`).
- **`test-data/`**: Static test data (JSON files) used by scenarios.
- **`reports/`**: Directory where generated JSON and console reports are saved.
- **`runner.js`**: The main k6 entry point. It dynamically merges the chosen profile and scenario based on environment variables.

## Prerequisites

- [Grafana k6](https://k6.io/docs/get-started/installation/) installed on your machine.

## Initial Setup

Clone this repository and ensure k6 is installed. No specific `npm install` is required for the core framework as it relies on k6 built-in modules.

## Configuration

All configuration is handled via Environment Variables passed to the `k6 run` command.

### Environment Variables

| Variable | Description | Default |
|---|---|---|
| `BASE_URL` | The target API or Web application base URL | `https://test-api.k6.io` |
| `SCENARIO` | The name of the scenario to execute (matches filename in `scenarios/`) | `example_api` |
| `TEST_TYPE` | The performance profile (`load`, `stress`, `spike`, `volume`) | `load` |
| `AUTH_TYPE` | Type of authentication (`none`, `token`, `basic`, `cookie`) | `none` |
| `AUTH_TOKEN` | Bearer token or Cookie string | `''` |
| `AUTH_USERNAME`| Username for Basic Auth | `''` |
| `AUTH_PASSWORD`| Password for Basic Auth | `''` |
| `CUSTOM_HEADERS`| JSON string of additional global headers | `{}` |

## Test Profiles (Test Types)

- **Load**: Standard ramp up, steady state, and ramp down to test normal expected usage.
- **Stress**: Pushes the system beyond normal capacity to find breaking points.
- **Spike**: Sudden, extreme surge in traffic to test system resilience.
- **Volume**: Sustained heavy load over a long duration to detect memory leaks and long-term degradation.

## Execution Commands

You can run tests using the standard `k6 run` command, passing the required environment variables:

```bash
# Run a Load test on the Dashboard scenario
k6 run -e SCENARIO=example_dashboard -e TEST_TYPE=load -e BASE_URL=https://reqres.in runner.js

# Run a Stress test on the API scenario
k6 run -e SCENARIO=example_api -e TEST_TYPE=stress -e BASE_URL=https://reqres.in runner.js
```

Alternatively, use the provided helper script:

```bash
chmod +x scripts/run.sh
./scripts/run.sh example_api stress https://reqres.in
```

## Report Generation & Result Interpretation

After every run, the framework generates two outputs:
1. **Console Summary**: A human-readable summary of the test printed to standard output.
2. **JSON Report**: A detailed structured report saved in the `reports/` directory.

The report clearly indicates:
- Test configuration (Type, Scenario, Concurrent Users)
- Key metrics (Average, Min, Max, P90, P95, Throughput)
- Failed request percentages
- **PASS/FAIL Status**: Evaluated dynamically based on thresholds.
- **Observation & Recommendation**: Actionable feedback based on threshold evaluations.

## Integration Checklist (Adding a New Project)

To use this framework for a new project, follow these steps:

1. [ ] **Define Base URL**: Determine the target `BASE_URL` for the application.
2. [ ] **Setup Authentication**: If the app requires auth, determine the `AUTH_TYPE` (e.g., `token`) and ensure you have valid credentials or tokens to pass via environment variables.
3. [ ] **Create Test Data**: Add necessary JSON payloads to `test-data/`.
4. [ ] **Create Scenarios**: Write new test scripts in the `scenarios/` folder. Use the `get`, `post`, `put`, `del` methods from `../core/http.js` to automatically handle metrics and headers.
5. [ ] **Register Scenarios**: Open `runner.js` and add your new scenario to the `scenarios` mapping object.
6. [ ] **Review Thresholds**: If the default SLAs don't match the new project, adjust `config/thresholds.config.js`.
7. [ ] **Execute**: Run `k6 run` with your new scenario name.

## Troubleshooting

- **Scenario Not Found**: Ensure the scenario file is created, properly exported, and mapped in `runner.js` inside the `scenarios` object.
- **Authentication Failing**: Check if `AUTH_TYPE` is correctly set and the corresponding token/credentials are valid.
- **k6 Command Not Found**: Verify k6 is correctly installed and available in your PATH.
