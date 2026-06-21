# Observability Report — D6 FastAPI Stack

> **Target:** `Infra-and-DevOps/D6_Observability_bolt_on_with_metrics`  
> **Generated:** 2026-06-21  
> **Stack:** FastAPI · Prometheus · Grafana · Docker Compose  
> **Evaluation status:** COMPLETE

### Live links

| Service | URL | Login |
| ------- | --- | ----- |
| **Grafana dashboard** (primary stats UI) | [http://localhost:3000/d/d6-app-dashboard](http://localhost:3000/d/d6-app-dashboard) | admin / admin |
| Prometheus targets | [http://localhost:9090/targets](http://localhost:9090/targets) | — |
| App metrics | [http://localhost:8008/metrics](http://localhost:8008/metrics) | — |
| App health | [http://localhost:8008/health](http://localhost:8008/health) | — |

---

## Application Summary

| Field | Value |
| ----- | ----- |
| Language / framework | Python 3.11, **FastAPI** |
| HTTP server | Uvicorn |
| Metrics library | prometheus-client |
| Logging | Custom JSON formatter (`app/logging_config.py`) |
| Metrics endpoint | `GET /metrics` |
| Health endpoint | `GET /health` |
| Demo routes | `/api/items`, `/api/error` |
| Host port | **8008** → container 8000 |
| Tests | 7/7 pytest pass |
| Stats UI | **Grafana only** — [http://localhost:3000/d/d6-app-dashboard](http://localhost:3000/d/d6-app-dashboard) |

Repository discovery: no pre-existing app in D6 folder after Node removal — created minimal **FastAPI** demo service per evaluation spec.

---

## Structured Logging Changes

- Added `app/logging_config.py` with `JsonFormatter` emitting ISO timestamps, level, endpoint, status, method, duration_ms, service
- HTTP middleware in `app/main.py` calls `log_request()` on every request (except `/metrics`)
- Log level escalates: INFO (2xx/3xx), WARN (4xx), ERROR (5xx)

**Diff doc:** [`logging-diff.md`](logging-diff.md)  
**Sample:** [`evidence/structured-log-sample.json`](evidence/structured-log-sample.json)

---

## Metrics Changes

| Metric | Type | Labels |
| ------ | ---- | ------ |
| `http_requests_total` | Counter | method, endpoint, status |
| `http_request_duration_seconds` | Histogram | method, endpoint, status |
| `http_errors_total` | Counter | method, endpoint, status |

**Diff doc:** [`metrics-diff.md`](metrics-diff.md)

**Verified:**

```bash
curl -s http://localhost:8008/metrics | grep '^http_'
# exit 0 — exposes all three custom metric families
```

---

## Docker Compose Architecture

**File:** `monitoring/docker-compose.yml`

```
┌─────────────────────────────────────────────────┐
│  observability network (bridge)                 │
│                                                 │
│  app:8000 ◄── scrape ── prometheus:9090        │
│                              │                  │
│                              └── query ── grafana:3000
└─────────────────────────────────────────────────┘
         ▲
    host :8008
```

| Service | Image | Host port |
| ------- | ----- | --------- |
| app | `monitoring-app` (built from `Dockerfile`) | 8008 |
| prometheus | prom/prometheus:v2.55.1 | 9090 |
| grafana | grafana/grafana:11.4.0 | 3000 |

**Startup:** `docker-compose up -d --build` → exit **0**, all containers healthy.

---

## Prometheus Configuration

**File:** `monitoring/prometheus/prometheus.yml`

- Scrape interval: 15s
- Job `d6-demo-api` → `app:8000/metrics`

**Verification:** [`prometheus-verification.md`](prometheus-verification.md)

| Target | Status |
| ------ | ------ |
| d6-demo-api | **UP** |
| prometheus | **UP** |

---

## Grafana Configuration

Fully file-provisioned — no manual steps.

| Component | Path |
| --------- | ---- |
| Datasource | `monitoring/grafana/provisioning/datasources/prometheus.yml` |
| Dashboard provider | `monitoring/grafana/provisioning/dashboards/dashboards.yml` |
| Dashboard | `monitoring/grafana/dashboards/app-dashboard.json` |

**Verification:** [`dashboard-verification.md`](dashboard-verification.md)

Dashboard **D6 FastAPI Observability** includes: Requests Per Second, Total Requests, Error Count, Response Time (p95).

---

## Load Testing

**Script:** `scripts/load-test.sh`

| Field | Value |
| ----- | ----- |
| Requests | 100 |
| Success | 100/100 |
| Duration | 2s |
| Exit code | 0 |

**Results:** [`load-test-results.md`](load-test-results.md)

---

## Metrics Verification

| Check | Command | Result |
| ----- | ------- | ------ |
| Health | `curl localhost:8008/health` | 200, `d6-observability-demo` |
| Metrics format | `curl localhost:8008/metrics` | Prometheus text, exit 0 |
| Per-endpoint counters | grep `http_requests_total` | `/api/items`=100, `/api/error`=10 |

---

## Dashboard Verification

- Datasource API: Prometheus loaded ✓
- Dashboard API: **D6 FastAPI Observability** loaded ✓
- JSON export: [`evidence/app-dashboard-export.json`](evidence/app-dashboard-export.json)
- Live traffic proof: [`live-traffic-proof.md`](live-traffic-proof.md)

Prometheus post-load: `sum(http_requests_total)` = **109**, `sum(http_errors_total)` = **9–10**

---

## Evidence

| Artifact | Location |
| -------- | -------- |
| Grafana datasources API | `docs/evidence/grafana-datasources.json` |
| Grafana dashboards API | `docs/evidence/grafana-dashboards.json` |
| Dashboard JSON export | `docs/evidence/app-dashboard-export.json` |
| Structured log sample | `docs/evidence/structured-log-sample.json` |
| Live traffic proof | `docs/live-traffic-proof.md` |
| Prometheus verification | `docs/prometheus-verification.md` |

---

## Verification Matrix

| Requirement | Evidence | Status |
|------------|----------|--------|
| Structured Logging Added | `logging-diff.md` + JSON log sample | **PASS** |
| Metrics Endpoint Available | curl `/metrics` output | **PASS** |
| Prometheus Scraping | targets API — d6-demo-api UP | **PASS** |
| Grafana Datasource Configured | provisioning file + API | **PASS** |
| Dashboard Exists | app-dashboard.json + API | **PASS** |
| Load Generated | load-test-results.md | **PASS** |
| Dashboard Updated | live-traffic-proof.md (109 requests) | **PASS** |

---

## Risks

| Risk | Mitigation |
| ---- | ---------- |
| Port 8000 occupied locally | Mapped host port to **8008** |
| Grafana admin/admin | Demo credentials only |
| 15s Prometheus scrape interval | Allow one scrape cycle after load before querying |
| pytest in Docker image | Included for simplicity; production image could omit test deps |

---

## Verified vs Inferred vs Unknown

| Category | Items |
| -------- | ----- |
| **Verified** | Compose up; curl `/metrics`; Prometheus targets UP; load test 100/100; Grafana datasource + dashboard via API; 7/7 unit tests |
| **Inferred** | Grafana UI panels render correctly (PromQL matches exported JSON; UI not screenshot-captured) |
| **Unknown** | Production auth on `/metrics`, TLS termination, long-term Grafana persistence — out of D6 scope |

---

## Evaluation Checklist

- [x] Metrics endpoint works
- [x] Prometheus scrapes metrics
- [x] Grafana datasource loads automatically
- [x] Grafana dashboard loads automatically
- [x] Load script generates traffic
- [x] Metrics increase after traffic
- [x] Dashboard reflects traffic
- [x] Evidence files exist
- [x] README exists
- [x] Observability report exists
