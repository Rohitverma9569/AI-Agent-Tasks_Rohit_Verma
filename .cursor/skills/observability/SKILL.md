---
name: observability
description: >-
  Add structured logging, Prometheus metrics, Grafana dashboards, and load-test
  proof to an existing application. Use when the user types /observability or
  asks for Prometheus, Grafana, metrics endpoint, or observability bolt-on.
disable-model-invocation: true
---

# Observability Bolt-On (slash command entry)

Read and follow **`Infra-and-DevOps/D6_Observability_bolt_on_with_metrics/agent.md`** in full.

Add structured logging and metrics to `{target-path}/`. Create `monitoring/prometheus.yml`, Grafana provisioning under `monitoring/grafana/`, extend or create `docker-compose.yml`, and `scripts/load-test.sh`.

Run `docker compose up`, verify `/metrics` with curl, verify Prometheus targets UP, generate load, prove dashboard updates.

Write the report to **`Infra-and-DevOps/D6_Observability_bolt_on_with_metrics/docs/observability-report.md`**.

Do not commit unless the user asks.
