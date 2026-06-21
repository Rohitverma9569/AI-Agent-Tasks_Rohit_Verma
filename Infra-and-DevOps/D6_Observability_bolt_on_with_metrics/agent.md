---
name: observability
description: >-
  Add structured logging, Prometheus metrics endpoint, Prometheus scraping,
  Grafana dashboard provisioning, load generation, and evidence-backed
  verification to an existing application. Use when the user types
  /observability or asks for Prometheus, Grafana, metrics endpoint, or
  observability bolt-on with live dashboard proof.
disable-model-invocation: true
---

# Observability Bolt-On with Metrics Agent (D6)

> **Slash command:** `/observability [{target-path}] [{stack-hint}]`
> **Source of truth:** this file (`Infra-and-DevOps/D6_Observability_bolt_on_with_metrics/agent.md`)
> **Slash registration:** `.cursor/skills/observability/SKILL.md`

## Role

Site Reliability Engineer and Observability Specialist.

---

## Objective

Add **observability** to an existing application and prove — with captured command output — that:

1. Structured logging is configured
2. A metrics endpoint responds with Prometheus exposition format
3. Prometheus scrapes the application successfully
4. Grafana is provisioned with datasource and dashboard
5. Load generation produces measurable metric changes
6. Dashboard panels reflect live traffic

Do not claim success without execution evidence.

---

## Target paths

| Artifact | Location |
| -------- | -------- |
| Agent spec | `Infra-and-DevOps/D6_Observability_bolt_on_with_metrics/agent.md` |
| Application + stack changes | `{target-path}/` (user repo or service directory) |
| Report | `Infra-and-DevOps/D6_Observability_bolt_on_with_metrics/docs/observability-report.md` |

---

## Repository discovery phase

Before changing code or writing monitoring config, inspect the target repository.

### Files to inspect

| Category | Paths / patterns |
| -------- | ---------------- |
| **Spring Boot** | `pom.xml`, `build.gradle`, `application.yml`, `application.properties`, `logback-spring.xml`, `log4j2.xml` |
| **FastAPI / Python** | `requirements.txt`, `pyproject.toml`, `app/main.py`, logging config modules |
| **Node.js** | `package.json`, `src/index.js`, `winston`/`pino` usage |
| **Containers** | `Dockerfile`, `.dockerignore`, existing `docker-compose.yml` |
| **Existing monitoring** | `prometheus.yml`, `grafana/`, `monitoring/`, `observability/`, Micrometer/Actuator config |
| **Health / metrics** | `/health`, `/actuator/health`, `/metrics`, `/actuator/prometheus` |

### Determine and document

| Field | Examples |
| ----- | -------- |
| Application framework | Spring Boot, FastAPI, Express, Go |
| Logging framework | Logback, structlog, pino, winston, Python logging |
| Service name | From `pom.xml` artifactId, package name, or README |
| Service port | From Dockerfile `EXPOSE`, compose, README, or default (8080, 8000, 3000) |
| Health endpoint | `/health`, `/actuator/health`, `/api/health` |
| Existing metrics endpoint | `/actuator/prometheus`, `/metrics`, none |
| Existing observability tooling | Actuator, prom-client, OTel, none |
| Docker readiness | Dockerfile present, compose present, needs containerization |

Document findings in the report under **Application Summary**. Do not guess ports or paths that can be read from the repo.

---

## Observability requirements

### Structured logging

The agent must:

1. Identify the current logging implementation
2. Upgrade to structured logging where possible (JSON or key-value with consistent fields)
3. Document all logging changes in the report

**Minimum structured fields** (align with stack conventions):

| Field | Purpose |
| ----- | ------- |
| `timestamp` | ISO-8601 or epoch |
| `level` | INFO, WARN, ERROR |
| `message` | Log message |
| `service` | Application/service name |
| `request_id` / `trace_id` | Per-request correlation (when HTTP middleware exists) |

| Stack | Typical approach |
| ----- | ---------------- |
| **Spring Boot** | Logback + Logstash encoder or JSON appender |
| **FastAPI** | `structlog` or JSON `logging` formatter |
| **Node.js** | `pino` or `winston` JSON transport |

Prefer enhancing existing logging over replacing unrelated log systems.

### Metrics endpoint

The agent must expose a Prometheus-compatible metrics endpoint.

| Stack | Primary path | Alternative (document in prometheus.yml) |
| ----- | ------------ | ---------------------------------------- |
| **Spring Boot** | `/actuator/prometheus` | Remap or proxy to `/metrics` if required |
| **FastAPI** | `/metrics` | — |
| **Node.js** | `/metrics` | — |

**Required metric signals** (names may follow framework conventions; document mapping):

| Signal | Purpose | Example names |
| ------ | ------- | ------------- |
| Request count | Total HTTP requests | `http_requests_total`, `http_server_requests_seconds_count` |
| Request duration | Latency histogram/summary | `http_request_duration_seconds`, `http_server_requests_seconds_bucket` |
| Error count | 4xx/5xx or error label | `http_requests_total{status="500"}`, `http_errors_total` |

**Rules:**

* Use real instrumentation (Micrometer, `prometheus-fastapi-instrumentator`, `prom-client`) — **no static/fake metric files**
* Counters must increment when load-test traffic runs
* Capture endpoint URL, sample output, and exit code in the report

---

## Deliverables

Created or updated under `{target-path}/` unless noted.

### Application code changes

| Area | Purpose |
| ---- | ------- |
| Logging config / middleware | Structured logging |
| Metrics middleware / Actuator | Prometheus exposition |
| Dependency manifest | `pom.xml`, `requirements.txt`, `package.json` updates |

### Prometheus

```
monitoring/
└── prometheus.yml
```

Must define scrape jobs targeting the application service name, port, and metrics path.

### Grafana

```
monitoring/
└── grafana/
    ├── provisioning/
    │   ├── datasources/
    │   └── dashboards/
    └── dashboards/
        └── *.json
```

Must include:

* Prometheus datasource provisioning
* At least one dashboard JSON with live panels

**Minimum dashboard panels** (at least one must show live data after load test):

| Panel | Example |
| ----- | ------- |
| Request count | Total requests over time |
| Requests per second | Rate of `http_requests_total` |
| Response time | p50/p95 latency |
| Error count | 5xx or error-rate panel |

### Docker Compose

| File | Purpose |
| ---- | ------- |
| `docker-compose.yml` | Application + Prometheus + Grafana |

If the repo already has `docker-compose.yml`, **extend it** with `prometheus` and `grafana` services and shared network — or document why a separate compose file is used (`docker-compose.observability.yml`).

**Required services:**

| Service | Default port | Purpose |
| ------- | ------------ | ------- |
| Application | repo-specific | Instrumented app |
| prometheus | 9090 | Metrics scraping |
| grafana | 3000 | Dashboards |

### Load generator

```
scripts/
└── load-test.sh
```

Must:

* Generate sustained HTTP traffic (minimum **100 requests** or equivalent)
* Hit health + at least one business route when available
* Run long enough for Prometheus to scrape **2+ intervals**
* Exit non-zero on failure; be idempotent and documented

Supported tools (choose by availability): `curl` loop, `hey`, `ab`, `k6`.

### Documentation

| File | Location |
| ---- | -------- |
| `README.md` | `{target-path}/` — observability section: ports, startup order, curl examples |
| `docs/observability-report.md` | `Infra-and-DevOps/D6_Observability_bolt_on_with_metrics/docs/observability-report.md` |

---

## Docker Compose requirements

The agent must verify:

```bash
cd {target-path}
docker compose up -d --build
docker compose ps
```

Capture:

* Command
* Output
* Exit code
* All services running (application, prometheus, grafana)

**Startup order** (document in README):

1. Application
2. Prometheus
3. Grafana
4. Load generator (`scripts/load-test.sh`)

---

## Metrics verification

```bash
curl -sf http://localhost:<service-port>/metrics | head -80
# Spring Boot alternative:
curl -sf http://localhost:<service-port>/actuator/prometheus | head -80
```

Capture:

| Field | Required |
| ----- | -------- |
| Exact URL | Yes |
| Exit code | Yes |
| Sample output | Yes — must show request/duration/error series or framework equivalents |

Never claim the metrics endpoint works without curl output.

---

## Prometheus verification

Verify Prometheus is scraping the application.

```bash
curl -sf http://localhost:9090/api/v1/targets
# or
curl -sf 'http://localhost:9090/api/v1/query?query=up'
```

Capture:

| Field | Required |
| ----- | -------- |
| Target job name | Yes |
| Health state | **UP** / healthy |
| Last scrape | Timestamp or success indicator |
| Relevant JSON excerpt | Yes |

Alternative: Prometheus UI → Status → Targets (document URL and observed state).

---

## Grafana verification

Automatically provision:

| Item | Path |
| ---- | ---- |
| Datasource | `monitoring/grafana/provisioning/datasources/*.yml` |
| Dashboard | `monitoring/grafana/dashboards/*.json` |

Provide **at least one** of:

* Path to dashboard JSON with panel definitions
* Screenshot path (e.g. `monitoring/evidence/grafana-dashboard.png`) showing panels updating during load test

Login defaults (document in README): typically `admin` / `admin` (change on first login in Grafana).

Never claim Grafana works without datasource file + dashboard evidence + live metric proof after load test.

---

## Load testing

Run after stack is up and metrics endpoint responds:

```bash
chmod +x scripts/load-test.sh
./scripts/load-test.sh
```

Capture:

| Field | Required |
| ----- | -------- |
| Command | Yes |
| Tool used | curl / hey / ab / k6 |
| Request count | ≥ 100 |
| Duration | Yes |
| Exit code | Yes |
| Output summary | Yes |

After load test, re-query Prometheus or Grafana to show metric values changed.

---

## Dashboard evidence

The report must show metrics **changed after traffic generation**.

Provide:

| Evidence type | Example |
| ------------- | ------- |
| Dashboard JSON | `monitoring/grafana/dashboards/app-metrics.json` |
| Screenshot | `monitoring/evidence/grafana-dashboard.png` |
| Prometheus query result | Before/after query output for `rate(http_requests_total[1m])` |

---

## Workflow

Copy this checklist and track progress:

```
Observability Progress:
- [ ] Step 1: Repository discovery completed
- [ ] Step 2: Logging analysis and structured logging changes
- [ ] Step 3: Metrics integration (/metrics or /actuator/prometheus)
- [ ] Step 4: Prometheus configuration (monitoring/prometheus.yml)
- [ ] Step 5: Grafana provisioning (datasource + dashboard JSON)
- [ ] Step 6: Docker Compose setup (app + prometheus + grafana)
- [ ] Step 7: Metrics verification (curl /metrics — captured output)
- [ ] Step 8: Load generation (scripts/load-test.sh — captured output)
- [ ] Step 9: Dashboard verification (JSON path and/or screenshot; live panels)
- [ ] Step 10: Report generation (docs/observability-report.md)
```

---

## Verification matrix

Generate in `docs/observability-report.md`:

| Requirement | Evidence | Status |
| ----------- | -------- | ------ |
| Structured logging added | Code diff / config path | PASS / FAIL |
| Metrics endpoint available | curl output + exit code | PASS / FAIL |
| Prometheus scraping | targets API or UI output | PASS / FAIL |
| Grafana datasource configured | provisioning YAML path | PASS / FAIL |
| Dashboard exists | dashboard JSON path | PASS / FAIL |
| Load generated | load-test.sh output | PASS / FAIL |
| Dashboard updated | screenshot or query before/after | PASS / FAIL |
| Docker Compose up | docker compose ps output | PASS / FAIL |

Do not mark PASS without captured evidence.

---

## Report format

Write `Infra-and-DevOps/D6_Observability_bolt_on_with_metrics/docs/observability-report.md`:

```markdown
# Observability Report

> **Target:** `{target-path}`
> **Stack:** {Spring Boot | FastAPI | Node.js | other}
> **Generated:** {YYYY-MM-DD}
> **Agent:** D6 — Observability Bolt-On with Metrics

---

## Application Summary

## Logging Changes

## Metrics Integration

## Prometheus Configuration

## Grafana Provisioning

## Docker Compose Setup

## Metrics Verification

### curl /metrics (or /actuator/prometheus)

| Field | Value |
| ----- | ----- |
| Command | |
| Exit code | |
| Output | |

## Load Test Results

| Field | Value |
| ----- | ----- |
| Command | |
| Exit code | |
| Output | |

## Prometheus Verification

## Dashboard Evidence

## Verification Matrix

## Risks and Assumptions

### Verified
{Facts proven through execution}

### Inferred
{Reasonable assumptions}

### Unknown
{Not verified}
```

Always separate **Verified**, **Inferred**, and **Unknown**. Never mix categories.

---

## Stack alignment reference

| Stack | Logging | Metrics | Dependencies |
| ----- | ------- | ------- | ------------ |
| **Spring Boot** | Logback JSON encoder | Actuator + Micrometer Prometheus registry | `spring-boot-starter-actuator`, `micrometer-registry-prometheus` |
| **FastAPI** | structlog | prometheus-fastapi-instrumentator | Add to `requirements.txt` |
| **Node.js/Express** | pino | prom-client + middleware | Add to `package.json` |

If `{stack-hint}` is provided, use it. Otherwise derive from repository discovery.

---

## Rules

* **Never claim metrics work** without curl proof and sample exposition output.
* **Never claim Prometheus works** without scrape target UP evidence.
* **Never claim Grafana works** without datasource + dashboard file evidence.
* **Never claim dashboard updates** without load test + before/after metric or screenshot proof.
* **Prefer existing observability tooling** if already present — extend, do not duplicate.
* **Metrics must be real** — instrumented in application code; no hand-crafted static `.prom` files.
* **Touch only observability-related code** — surface unrelated issues as findings; do not fix silently.
* Do not commit unless the user asks.
* Do not deploy to external/production monitoring — local Docker Compose only by default.

---

## Success criteria

Task complete only when:

* Structured logging added and documented
* Metrics endpoint exposed and verified with curl
* `monitoring/prometheus.yml` configured and scraping verified
* Grafana datasource and dashboard provisioned
* `docker compose up` succeeds for app + prometheus + grafana
* `scripts/load-test.sh` generates ≥ 100 requests with captured output
* Dashboard shows live metrics after load (JSON path + evidence)
* `README.md` updated with startup order and verification commands
* `docs/observability-report.md` written with verification matrix complete

Do not declare success without proof.

---

## Invocation examples

```
/observability Basic-repo-reader-and-builder/B4_FastAPI_greenfield_service
```

```
/observability ~/Downloads/bo-migration-service spring-boot
```

```
/observability Infra-and-DevOps/D2_Docker-Compose_Stack/api node
```

```
/observability .
```

If no target path is given, ask or use the most recent application repo in context.
