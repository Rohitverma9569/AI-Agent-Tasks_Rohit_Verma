#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
cd "${ROOT_DIR}"

API_URL="${API_URL:-http://localhost:8080}"
MAX_WAIT_SEC="${MAX_WAIT_SEC:-30}"

PASSED=0
FAILED=0

pass() {
  echo "PASS: $1"
  PASSED=$((PASSED + 1))
}

fail() {
  echo "FAIL: $1"
  FAILED=$((FAILED + 1))
}

wait_for_status() {
  local job_id="$1"
  local expected="$2"
  local elapsed=0

  while [ "${elapsed}" -lt "${MAX_WAIT_SEC}" ]; do
    STATUS=$(curl -sf "${API_URL}/jobs/${job_id}" | grep -o '"status":"[^"]*"' | head -1 | cut -d'"' -f4)
    if [ "${STATUS}" = "${expected}" ]; then
      return 0
    fi
    sleep 1
    elapsed=$((elapsed + 1))
  done
  return 1
}

echo "==> D2 End-to-End Tests"
echo "    API_URL=${API_URL}"
echo ""

echo "--- Test 1: API health check ---"
HEALTH=$(curl -sf "${API_URL}/health" || true)
if echo "${HEALTH}" | grep -q '"status":"ok"'; then
  pass "GET /health returns status ok"
else
  fail "GET /health — expected status ok, got: ${HEALTH}"
fi

if echo "${HEALTH}" | grep -q '"database":"connected"'; then
  pass "GET /health confirms database connected"
else
  fail "GET /health — database not connected: ${HEALTH}"
fi

echo ""
echo "--- Test 2: List jobs (API reads from database) ---"
JOBS=$(curl -sf "${API_URL}/jobs" || true)
if echo "${JOBS}" | grep -q '"jobs"'; then
  pass "GET /jobs returns jobs array"
else
  fail "GET /jobs failed: ${JOBS}"
fi

echo ""
echo "--- Test 3: Create job via API (API writes to database) ---"
CREATE=$(curl -sf -X POST "${API_URL}/jobs" \
  -H "Content-Type: application/json" \
  -d '{"title":"e2e-test-job","payload":{"action":"e2e-verify"}}' || true)
JOB_ID=$(echo "${CREATE}" | grep -o '"id":[0-9]*' | head -1 | cut -d':' -f2)

if [ -n "${JOB_ID}" ]; then
  pass "POST /jobs created job id=${JOB_ID}"
else
  fail "POST /jobs failed: ${CREATE}"
fi

echo ""
echo "--- Test 4: Worker processes job (Worker reads/writes database) ---"
if [ -n "${JOB_ID}" ]; then
  if wait_for_status "${JOB_ID}" "completed"; then
    pass "Worker completed job id=${JOB_ID} within ${MAX_WAIT_SEC}s"
    JOB_DETAIL=$(curl -sf "${API_URL}/jobs/${JOB_ID}")
    if echo "${JOB_DETAIL}" | grep -q '"result":"processed:e2e-verify'; then
      pass "Job result contains processed payload"
    else
      fail "Job result missing expected value: ${JOB_DETAIL}"
    fi
  else
    fail "Job id=${JOB_ID} not completed within ${MAX_WAIT_SEC}s"
  fi
fi

echo ""
echo "--- Test 5: Seed jobs processed by worker ---"
SEED_COMPLETED=0
for i in 1 2 3; do
  if curl -sf "${API_URL}/jobs" | grep -q '"status":"completed"'; then
    SEED_COMPLETED=$((SEED_COMPLETED + 1))
  fi
  sleep 1
done

COMPLETED_COUNT=$(curl -sf "${API_URL}/jobs" | grep -o '"status":"completed"' | wc -l | tr -d ' ')
if [ "${COMPLETED_COUNT}" -ge 1 ]; then
  pass "At least one seed job completed (completed count: ${COMPLETED_COUNT})"
else
  fail "No completed jobs found after seed"
fi

echo ""
echo "========================================"
echo "Test Summary: ${PASSED} passed, ${FAILED} failed"
echo "========================================"

if [ "${FAILED}" -gt 0 ]; then
  exit 1
fi
exit 0
