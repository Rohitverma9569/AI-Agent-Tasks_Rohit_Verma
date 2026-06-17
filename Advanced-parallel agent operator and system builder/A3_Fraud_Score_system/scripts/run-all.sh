#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DB_PATH="${FRAUD_DB_PATH:-$ROOT/data/fraud.db}"
export FRAUD_DB_PATH="$DB_PATH"
export RUST_ENGINE_URL="${RUST_ENGINE_URL:-http://127.0.0.1:3001}"

mkdir -p "$(dirname "$DB_PATH")"
rm -f "$DB_PATH"

echo "==> Building Rust engine"
(cd "$ROOT/engines/rust" && cargo build --release)

echo "==> Node worker (no npm dependencies — uses node:sqlite)"

echo "==> Starting Rust engine on :3001"
RUST_ENGINE_PORT=3001 "$ROOT/engines/rust/target/release/fraud-engine" &
RUST_PID=$!

cleanup() {
  kill "$RUST_PID" 2>/dev/null || true
  kill "$NODE_PID" 2>/dev/null || true
  kill "$API_PID" 2>/dev/null || true
}
trap cleanup EXIT

sleep 1

echo "==> Starting Node worker"
node "$ROOT/workers/node/src/index.js" &
NODE_PID=$!

echo "==> Starting FastAPI on :8000"
(
  cd "$ROOT/services/fastapi"
  if [ ! -d .venv ]; then python3 -m venv .venv; fi
  source .venv/bin/activate
  pip install -q -r requirements.txt
  uvicorn app.main:app --host 127.0.0.1 --port 8000
) &
API_PID=$!

sleep 2

echo "==> Waiting for FastAPI health"
for i in $(seq 1 30); do
  if curl -sf http://127.0.0.1:8000/health >/dev/null 2>&1; then
    break
  fi
  sleep 1
done

echo "==> Running integration test"
python3 "$ROOT/tests/integration/test_e2e.py"

echo "==> All services ran successfully"
