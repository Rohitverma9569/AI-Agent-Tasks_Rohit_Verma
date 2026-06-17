---
name: observability
description: >-
  Add structured logging, /metrics, Prometheus, Grafana dashboard, and load-test
  proof to a service. Captures curl metrics, healthy Prometheus targets, and live
  Grafana evidence. Use when the user types /observability or asks for SRE
  metrics, Prometheus, or Grafana setup.
disable-model-invocation: true
---

# Observability Bolt-On with Metrics (slash command entry)

Read and follow **`Infra-and-DevOps/D6_Observability_bolt_on_with_metrics/agent.md`** in full.

Add structured logging and `/metrics` (request count, duration, errors) to `{target-path}/`. Create `observability/docker-compose.yml`, `prometheus.yml`, Grafana provisioning, dashboard JSON, `load-test.sh`, and `observability/README.md`.

Start stack in order: Service → Prometheus → Grafana → load generator. Capture `curl /metrics`, Prometheus target health, and Grafana live metrics evidence.

Write the report to **`Infra-and-DevOps/D6_Observability_bolt_on_with_metrics/docs/observability-report.md`**.

Do not commit unless the user asks.
