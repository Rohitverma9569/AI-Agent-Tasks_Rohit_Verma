---
name: observability
description: >-
  Add structured logging, /metrics, Prometheus, and Grafana dashboard to a
  service with load-test proof and live dashboard evidence. Use when the user
  types /observability or asks for Prometheus, Grafana, metrics endpoint, or
  SRE observability stack.
disable-model-invocation: true
---

# Observability Bolt-On with Metrics Agent (D6)

> **Slash command:** `/observability [{target-path}]`
> **Source of truth:** this file (`Infra-and-DevOps/D6_Observability_bolt_on_with_metrics/agent.md`)
> **Slash registration:** `.cursor/skills/observability/SKILL.md`

## Role

Site Reliability Engineer.

## Objective

Add **observability** to a service and **prove metrics are visible in Grafana** with captured evidence — not assumptions.

## Target paths

| Artifact | Location |
| -------- | -------- |
| Agent spec | `Infra-and-DevOps/D6_Observability_bolt_on_with_metrics/agent.md` |
| Stack + code changes | `{target-path}/` (user repo) |
| Report | `Infra-and-DevOps/D6_Observability_bolt_on_with_metrics/docs/observability-report.md` |

## Requirements

Implement all four layers:

| Layer | Requirement |
| ----- | ----------- |
| **Structured logging** | JSON or key-value logs with correlation fields (request id, level, timestamp, service name) — align with stack (Logback JSON, structlog, pino, etc.) |
| **Metrics endpoint** | HTTP **`/metrics`** exposing Prometheus text format |
| **Prometheus** | Scrape config targeting the service; targets must show **UP** |
| **Grafana dashboard** | Provisioned dashboard JSON showing **live** request metrics |

## Metrics requirements

Expose **`/metrics`** (or stack-native path mapped to `/metrics` via reverse proxy — document if different).

**Required metric signals** (names may follow framework conventions; document mapping):

| Signal | Purpose | Example metric names |
| ------ | ------- | -------------------- |
| **Request count** | Total HTTP requests | `http_server_requests_seconds_count`, `http_requests_total` |
| **Request duration** | Latency histogram or summary | `http_server_requests_seconds_bucket`, `http_request_duration_seconds` |
| **Error count** | Failed requests (4xx/5xx or `status=error`) | `http_server_requests_seconds_count{status="500"}`, `http_errors_total` |

Use existing instrumentation when present (Spring Boot Actuator + Micrometer, Prometheus client libraries, OpenTelemetry exporter). **Do not emit fake/static metrics** — counters must increment with real traffic.

## Deliverables (created on run)

### Under `{target-path}/`

| File / area | Purpose |
| ----------- | ------- |
| **Code changes** | Logging config, metrics middleware/instrumentation, dependency additions |
| `observability/docker-compose.yml` | Service + Prometheus + Grafana (+ optional load sidecar network) |
| `observability/prometheus.yml` | Scrape jobs, intervals, target labels |
| `observability/grafana/provisioning/` | Datasource + dashboard provisioning YAML |
| `observability/grafana/dashboards/*.json` | Dashboard JSON (request rate, duration, errors) |
| `observability/load-test.sh` | Generates sustained HTTP traffic against the service |
| `observability/README.md` | Startup order, ports, curl examples, troubleshooting |

If the repo already has `docker-compose.yml`, extend it or document why a separate `observability/` compose file is used — avoid breaking existing stacks.

### Report (agent workspace)

| File | Purpose |
| ---- | ------- |
| `Infra-and-DevOps/D6_Observability_bolt_on_with_metrics/docs/observability-report.md` | Full evidence bundle |

## Stack alignment

Read the target repo before implementing:

| Stack | Typical approach |
| ----- | ---------------- |
| **Spring Boot** | Actuator `/actuator/prometheus` → expose as `/metrics` via `management.endpoints.web.base-path` or nginx sidecar; Logback Logstash encoder |
| **Node/Express** | `prom-client` + `pino`/`winston` JSON |
| **Python/FastAPI** | `prometheus-fastapi-instrumentator` + `structlog` |
| **Go** | `prometheus/client_golang` + `slog`/zerolog JSON |

Prefer **`/metrics`** on the service port Prometheus scrapes. If the framework uses `/actuator/prometheus`, either re-map to `/metrics` in config or add a scrape path in `prometheus.yml` **and** document the actual path in README — the user requirement is visibility of request count, duration, and errors in Grafana.

## Workflow

```
Observability Progress:
- [ ] Step 1: Repo recon — language, existing actuator/metrics/logging, ports, health paths
- [ ] Step 2: Add structured logging (code + config)
- [ ] Step 3: Add /metrics instrumentation (request count, duration, errors)
- [ ] Step 4: Write observability/docker-compose.yml, prometheus.yml, Grafana provisioning
- [ ] Step 5: Write observability/grafana/dashboards/*.json
- [ ] Step 6: Write observability/load-test.sh and observability/README.md
- [ ] Step 7: Start stack in order — Service → Prometheus → Grafana → Load generator
- [ ] Step 8: Metrics validation — curl /metrics (captured output)
- [ ] Step 9: Prometheus verification — targets healthy (captured output)
- [ ] Step 10: Grafana verification — dashboard JSON path and/or screenshot; live metrics
- [ ] Step 11: Write docs/observability-report.md with evidence
```

## Verification

### Metrics validation

```bash
curl -sf http://localhost:<service-port>/metrics | head -50
# or documented path, e.g. /actuator/prometheus
```

Capture:

* Exact URL
* Sample output showing request/duration/error series
* Exit code

### Traffic generation

```bash
./observability/load-test.sh
```

Script must:

* Hit real API endpoints (health + at least one business route if available)
* Run long enough for Prometheus to scrape 2+ intervals
* Be idempotent and documented in README

### Prometheus verification

```bash
curl -sf http://localhost:9090/api/v1/targets | jq '.data.activeTargets[] | {job, health, lastScrape}'
# or: docker compose -f observability/docker-compose.yml ps
```

Capture targets in **UP** / **healthy** state.

### Grafana verification

Provide **at least one**:

* Path to provisioned **`observability/grafana/dashboards/*.json`**
* Screenshot path (e.g. `observability/evidence/grafana-dashboard.png`) showing live panels updating during load test

Panels must include request rate, latency, and error signals derived from scraped metrics.

### Documentation — startup order

`observability/README.md` must document this order:

1. **Service** (application)
2. **Prometheus**
3. **Grafana**
4. **Load generator** (`load-test.sh`)

Include exact `docker compose` commands and default URLs (Grafana `3000`, Prometheus `9090`, service port).

## Report format

Write `Infra-and-DevOps/D6_Observability_bolt_on_with_metrics/docs/observability-report.md`:

```markdown
# Observability Report

> **Target:** `{target-path}`
> **Generated:** {YYYY-MM-DD}
> **Agent:** D6 — Observability Bolt-On with Metrics

---

## Service Summary
## Code Changes (files touched)
## Stack Inventory (compose, prometheus, grafana, dashboard)
## Metrics Validation (curl /metrics output)
## Traffic Generation (load-test.sh output)
## Prometheus Verification (targets healthy)
## Grafana Verification (dashboard JSON path and/or screenshot)
## Startup Order (as documented)
## Risks and Assumptions (Verified / Inferred / Unknown)
```

Always separate **Verified**, **Inferred**, and **Unknown**. Never claim Grafana shows live data without screenshot, query result, or API evidence.

## Rules

* **Metrics must be real** — instrumented in application code or framework middleware; no hand-crafted static exposition files.
* **Dashboard must use live data** — prove with load test + Prometheus scrape + Grafana panel values or screenshot.
* **Show evidence, not assumptions** — capture command output, exit codes, target health, metric samples.
* Do not commit unless the user asks.
* Do not deploy to production monitoring unless explicitly requested — local docker-compose only by default.
* Touch only observability-related code and config; surface unrelated issues as findings, do not fix silently.

## Success criteria

Complete only when:

* Structured logging configured and documented
* `/metrics` (or documented equivalent) exposes request count, duration, and error signals
* `observability/docker-compose.yml`, `prometheus.yml`, Grafana provisioning, and dashboard JSON exist
* `observability/load-test.sh` runs and generates traffic
* `curl /metrics` output captured
* Prometheus targets show healthy/UP
* Grafana dashboard evidence captured (JSON path + live data proof)
* `observability/README.md` documents startup order
* `docs/observability-report.md` written with evidence

Do not declare success without proof.

## Invocation examples

```
/observability ~/Downloads/bo-migration-service
```

```
/observability .
```

```
/observability ../A3_Fraud_Score_system
```

If no target path is given, ask or use the most recent repo in context.
