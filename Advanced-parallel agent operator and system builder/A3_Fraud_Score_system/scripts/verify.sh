#!/usr/bin/env bash
# Unified verification for the polyglot fraud scoring system.
# Used by: make test, make verify, and future CI pipelines.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
MODE="${1:-test-only}"

echo "==> [rust] cargo test"
(cd "$ROOT/engines/rust" && cargo test)

echo "==> [fastapi] pytest"
FASTAPI_DIR="$ROOT/services/fastapi"
if [ ! -d "$FASTAPI_DIR/.venv" ]; then
  python3 -m venv "$FASTAPI_DIR/.venv"
  "$FASTAPI_DIR/.venv/bin/pip" install -q -r "$FASTAPI_DIR/requirements.txt"
fi
(
  cd "$FASTAPI_DIR"
  source .venv/bin/activate
  pytest -q
)

echo "==> [node] npm test"
(cd "$ROOT/workers/node" && npm test)

if [ "$MODE" = "full" ]; then
  echo "==> [integration] run-all.sh"
  "$ROOT/scripts/run-all.sh"
fi

echo "==> verify.sh: all requested checks passed"
