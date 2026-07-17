#!/bin/bash

# Utility script to run k6 tests with predefined environment variables

SCENARIO=${1:-example_api}
TEST_TYPE=${2:-load}
BASE_URL=${3:-https://reqres.in}

echo "Running Scenario: $SCENARIO"
echo "Test Type: $TEST_TYPE"
echo "Base URL: $BASE_URL"

k6 run -e SCENARIO=$SCENARIO -e TEST_TYPE=$TEST_TYPE -e BASE_URL=$BASE_URL runner.ts
