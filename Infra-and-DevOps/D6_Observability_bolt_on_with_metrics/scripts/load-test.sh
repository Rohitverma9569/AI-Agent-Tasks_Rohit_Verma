#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
cd "${ROOT_DIR}"

API_URL="${API_URL:-http://localhost:8008}"
REQUEST_COUNT="${REQUEST_COUNT:-100}"

echo "==> D6 Load Test (FastAPI)"
echo "    API_URL=${API_URL}"
echo "    REQUEST_COUNT=${REQUEST_COUNT}"
echo ""

START=$(date +%s)
SUCCESS=0
ERRORS=0

for i in $(seq 1 "${REQUEST_COUNT}"); do
  CODE=$(curl -s -o /dev/null -w "%{http_code}" "${API_URL}/api/items" || echo "000")
  if [ "${CODE}" = "200" ]; then
    SUCCESS=$((SUCCESS + 1))
  else
    ERRORS=$((ERRORS + 1))
  fi
  if [ $((i % 10)) -eq 0 ]; then
    curl -s -o /dev/null "${API_URL}/api/error" || true
  fi
done

END=$(date +%s)
DURATION=$((END - START))

echo ""
echo "========================================"
echo "Load Test Summary"
echo "  Total requests: ${REQUEST_COUNT}"
echo "  Successful (200): ${SUCCESS}"
echo "  Client errors: ${ERRORS}"
echo "  Duration: ${DURATION}s"
echo "========================================"

if [ "${SUCCESS}" -lt 1 ]; then
  exit 1
fi
exit 0
