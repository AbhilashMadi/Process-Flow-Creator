#!/bin/bash

# Configuration
URL="http://localhost:8080/api/v1/monitor"
CONNECTIONS=500
DURATION=10
OUTPUT_DIR="load_test_results"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
OUTPUT_FILE="${OUTPUT_DIR}/loadtest_${TIMESTAMP}.json"

# Create output directory if it doesn't exist
mkdir -p "$OUTPUT_DIR"

echo "Starting load test with ${CONNECTIONS} connections for ${DURATION} seconds..."
echo "Results will be saved to: ${OUTPUT_FILE}"

# Run autocannon and save JSON output
autocannon \
  -c "$CONNECTIONS" \
  -d "$DURATION" \
  --renderStatusCodes \
  --json \
  "$URL" > "$OUTPUT_FILE"

# Check if the command succeeded
if [ $? -eq 0 ]; then
  echo "Test completed successfully!"
  echo "Quick stats:"
  jq -r '{
    duration: .duration,
    requests: .requests.total,
    throughput: (.requests.total/.duration | tonumber | round),
    avgLatency: .latency.average,
    errorRate: ((.errors.total/.requests.total)*100 | tonumber | round) + "%",
    statusCodes: .statusCodeStats
  }' "$OUTPUT_FILE"
else
  echo "Load test failed!"
  exit 1
fi