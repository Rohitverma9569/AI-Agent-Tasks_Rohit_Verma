#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
cd "${ROOT_DIR}"

COMPOSE="docker compose"
if ! docker compose version >/dev/null 2>&1; then
  COMPOSE="docker-compose"
fi

POSTGRES_USER="${POSTGRES_USER:-appuser}"
POSTGRES_DB="${POSTGRES_DB:-appdb}"

echo "==> Seeding database via PostgreSQL (container: d2-postgres)"

${COMPOSE} exec -T db psql -U "${POSTGRES_USER}" -d "${POSTGRES_DB}" <<'SQL'
DELETE FROM jobs WHERE title LIKE 'seed-%';

INSERT INTO jobs (title, payload, status) VALUES
  ('seed-welcome-email', '{"action":"send-email","to":"user@example.com"}', 'pending'),
  ('seed-report-gen', '{"action":"generate-report","report":"daily"}', 'pending'),
  ('seed-data-sync', '{"action":"sync-data","source":"external"}', 'pending');
SQL

COUNT=$(${COMPOSE} exec -T db psql -U "${POSTGRES_USER}" -d "${POSTGRES_DB}" -t -c "SELECT COUNT(*) FROM jobs;")
echo "==> Seed complete — total jobs in database: $(echo "${COUNT}" | tr -d '[:space:]')"
