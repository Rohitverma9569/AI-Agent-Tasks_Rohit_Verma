# D6 — Observability Bolt-On with Metrics and Dashboard

Complete **FastAPI** observability stack: structured JSON logging, Prometheus metrics, Grafana dashboards, and load-test verification.

| | |
| --- | --- |
| **Agent** | [`agent.md`](agent.md) · slash command `/observability` |
| **Stack** | FastAPI + Prometheus + Grafana (Docker Compose) |
| **Local testing** | [`docs/local-testing.md`](docs/local-testing.md) · verified 2026-06-21 |
| **Full report** | [`docs/observability-report.md`](docs/observability-report.md) |

### Live links (start stack first)

| Service | URL | Login |
| ------- | --- | ----- |
| **Grafana dashboard** (stats UI) | [http://localhost:3000/d/d6-app-dashboard](http://localhost:3000/d/d6-app-dashboard) | admin / admin |
| Grafana home | [http://localhost:3000](http://localhost:3000) | admin / admin |
| Prometheus targets | [http://localhost:9090/targets](http://localhost:9090/targets) | — |
| Prometheus UI | [http://localhost:9090](http://localhost:9090) | — |
| App health | [http://localhost:8008/health](http://localhost:8008/health) | — |
| App metrics | [http://localhost:8008/metrics](http://localhost:8008/metrics) | — |
| Demo API | [http://localhost:8008/api/items](http://localhost:8008/api/items) | — |
| API docs | [http://localhost:8008/docs](http://localhost:8008/docs) | — |

```bash
cd Infra-and-DevOps/D6_Observability_bolt_on_with_metrics/monitoring && docker-compose up -d --build
```

---

## Architecture

```
                    ┌──────────────────────────────────────────────┐
                    │     observability network (bridge)         │
                    │                                              │
  curl :8008  ─────►│  app (FastAPI + JSON logs + /metrics)        │
                    │       │                                      │
                    │       │ GET /metrics                         │
                    │       ▼                                      │
                    │  prometheus (:9090)                          │
                    │       │                                      │
                    │       ▼                                      │
                    │  grafana (:3000)                             │
                    └──────────────────────────────────────────────┘

  scripts/load-test.sh  ──► 100 requests to /api/items (+ periodic /api/error)
```

| Service | Container | Host port | Internal | Purpose |
| ------- | --------- | --------- | -------- | ------- |
| app | d6-demo-api | **8008** | 8000 | FastAPI API — health, demo routes, `/metrics` |
| prometheus | d6-prometheus | 9090 | 9090 | Scrapes `app:8000/metrics` every 15s |
| grafana | d6-grafana | 3000 | 3000 | Auto-provisioned datasource + dashboard |

> **Port note:** Host **8008** maps to container 8000 because local port 8000 is often occupied by other FastAPI dev servers (e.g. B4).

---

## Live URLs (stack running)

Open these after `docker-compose up -d --build`:

| What | URL | Credentials |
| ---- | --- | ----------- |
| **App health** | [http://localhost:8008/health](http://localhost:8008/health) | — |
| **App metrics** | [http://localhost:8008/metrics](http://localhost:8008/metrics) | — |
| **Demo API** | [http://localhost:8008/api/items](http://localhost:8008/api/items) | — |
| **FastAPI docs** | [http://localhost:8008/docs](http://localhost:8008/docs) | — |
| **Prometheus UI** | [http://localhost:9090](http://localhost:9090) | — |
| **Prometheus targets** | [http://localhost:9090/targets](http://localhost:9090/targets) | — |
| **Grafana dashboard** | [http://localhost:3000/d/d6-app-dashboard](http://localhost:3000/d/d6-app-dashboard) | admin / admin |

**Grafana is the stats UI** — Prometheus scrapes `http://localhost:8008/metrics` every 15s. Panels include Total API Requests, RPS, errors, latency graphs, **request rate by endpoint**, and **requests by endpoint table**.

---

## Start with the Agent (recommended)

In **Cursor Agent chat**:

| Scenario | Command |
| -------- | ------- |
| **This stack** | `/observability Infra-and-DevOps/D6_Observability_bolt_on_with_metrics` |
| **Another app** | `/observability path/to/spring-boot-or-fastapi-or-node-app` |

The agent reads [`agent.md`](agent.md) and automatically:

1. Discovers the application stack (FastAPI / Spring Boot / Node.js)
2. Adds structured logging and a metrics endpoint
3. Configures Prometheus and Grafana provisioning
4. Runs load tests and captures curl / scrape evidence
5. Writes [`docs/observability-report.md`](docs/observability-report.md)

> The agent does not commit or deploy externally unless you explicitly ask.

---

## Quick start (manual)

### 1. Prerequisites

| Tool | Check |
| ---- | ----- |
| Docker | `docker info` |
| docker-compose | `docker-compose version` |
| curl | `curl --version` |

### 2. Start the stack

```bash
cd Infra-and-DevOps/D6_Observability_bolt_on_with_metrics/monitoring
docker-compose up -d --build
docker-compose ps
```

### 3. Smoke test

```bash
curl -s http://localhost:8008/health
curl -s http://localhost:8008/metrics | grep -E '^http_requests_total|^http_errors_total'
```

### 4. Generate traffic

```bash
cd Infra-and-DevOps/D6_Observability_bolt_on_with_metrics
chmod +x scripts/load-test.sh
./scripts/load-test.sh
```

> Run `load-test.sh` from the **project root**, not from `monitoring/`.

### 5. Open Grafana dashboard

- Login: [http://localhost:3000](http://localhost:3000) — **admin** / **admin**
- Dashboard: [http://localhost:3000/d/d6-app-dashboard](http://localhost:3000/d/d6-app-dashboard)
- Prometheus targets: [http://localhost:9090/targets](http://localhost:9090/targets) — `d6-demo-api` must be **UP**

### 6. Stop

```bash
cd Infra-and-DevOps/D6_Observability_bolt_on_with_metrics/monitoring
docker-compose down
```

---

## Expected results

Use this checklist to confirm stats are flowing.

### Containers — `docker-compose ps`

| Container | Expected status | Expected ports |
| --------- | --------------- | -------------- |
| `d6-demo-api` | Up **(healthy)** | `0.0.0.0:8008→8000/tcp` |
| `d6-prometheus` | Up | `0.0.0.0:9090→9090/tcp` |
| `d6-grafana` | Up | `0.0.0.0:3000→3000/tcp` |

### Health check

```bash
curl -s http://localhost:8008/health
```

**Expected:**

```json
{"status":"ok","service":"d6-observability-demo"}
```

### Metrics endpoint

```bash
curl -s http://localhost:8008/metrics | grep -E '^http_requests_total|^http_errors_total'
```

**Expected (after load test):** lines for `/api/items`, `/api/error`, and `http_errors_total`.

### Prometheus targets

Open [http://localhost:9090/targets](http://localhost:9090/targets)

| Job | State |
| --- | ----- |
| `d6-demo-api` | **UP** |
| `prometheus` | **UP** |

Screenshot proof: [`docs/evidence/prometheus-targets-up.png`](docs/evidence/prometheus-targets-up.png)

### Load test

```bash
./scripts/load-test.sh
```

**Expected:**

```
Successful (200): 100
Duration: 2s
```

Exit code: **0**

### Prometheus query (stats increasing)

```bash
curl -s -G 'http://localhost:9090/api/v1/query' \
  --data-urlencode 'query=sum(http_requests_total{job="d6-demo-api"})'
```

**Expected:** number increases after each `./scripts/load-test.sh` run.

### Grafana panels (after traffic)

| Panel | Expected |
| ----- | -------- |
| Total Requests | > 0, increases after load |
| Requests Per Second | Brief spike after load |
| Error Count | ≥ 10 (from `/api/error` hits) |
| Response Time (p95) | Non-zero latency line |

---

## API endpoints

| Method | Path | Description |
| ------ | ---- | ----------- |
| GET | `/health` | Health check |
| GET | `/api/items` | Demo JSON response (used by load test) |
| GET | `/api/error` | Intentional 500 for error metrics |
| GET | `/metrics` | Prometheus exposition format |
| GET | `/docs` | FastAPI Swagger UI |

**Note:** Request counters exclude internal routes (`/health`, `/metrics`, `/favicon.ico`) so totals reflect app traffic (`/api/items`, `/api/error`, load tests).

---

## Metrics exposed

| Metric | Type | Labels |
| ------ | ---- | ------ |
| `http_requests_total` | Counter | method, endpoint, status |
| `http_request_duration_seconds` | Histogram | method, endpoint, status |
| `http_errors_total` | Counter | method, endpoint, status (4xx/5xx) |

---

## Local development (without Docker)

```bash
cd Infra-and-DevOps/D6_Observability_bolt_on_with_metrics
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
pytest -q
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

Prometheus and Grafana require the full Docker Compose stack for scraping and dashboards.

---

## Verification commands (copy-paste)

```bash
# Stack status
cd monitoring && docker-compose ps

# App layer
curl -s http://localhost:8008/health
curl -s http://localhost:8008/metrics | grep '^http_'

# Prometheus layer
curl -s http://localhost:9090/-/healthy
curl -s -G 'http://localhost:9090/api/v1/query' \
  --data-urlencode 'query=sum(http_requests_total{job="d6-demo-api"})'

# Generate traffic (from project root)
cd ..
./scripts/load-test.sh

# Re-check totals
curl -s -G 'http://localhost:9090/api/v1/query' \
  --data-urlencode 'query=sum(http_errors_total{job="d6-demo-api"})'
```

---

## Troubleshooting

| Problem | Cause | Fix |
| ------- | ----- | --- |
| `curl :8000` shows wrong app | B4 or another FastAPI on 8000 | Use **8008** |
| `no such file: ./scripts/load-test.sh` | Ran from `monitoring/` | Run from project root or `../scripts/load-test.sh` |
| `command not found: #` | Pasted `#` comment lines in zsh | Run commands without inline `#` comments |
| Prometheus target DOWN | Stack not fully healthy | `docker-compose ps`, wait for `d6-demo-api` healthy |
| Grafana panels empty | No traffic yet | Run `./scripts/load-test.sh`, wait ~15s (scrape interval) |
| Stats on app but not Grafana | Prometheus not scraping | Check [targets page](http://localhost:9090/targets) |

---

## Project layout

```
D6_Observability_bolt_on_with_metrics/
├── agent.md                      # Evaluation agent spec
├── app/                          # FastAPI application
│   ├── main.py                   # Routes + observability middleware
│   ├── logging_config.py         # Structured JSON logging
│   └── metrics.py                # Prometheus counters/histograms
├── monitoring/
│   ├── docker-compose.yml        # app + prometheus + grafana
│   ├── prometheus/prometheus.yml
│   └── grafana/
│       ├── provisioning/         # Auto datasource + dashboard provider
│       └── dashboards/app-dashboard.json
├── scripts/load-test.sh
├── tests/                        # pytest suite (7 tests)
├── docs/
│   ├── local-testing.md          # Manual verification + screenshot
│   ├── observability-report.md   # Full evaluation report
│   ├── logging-diff.md
│   ├── metrics-diff.md
│   ├── prometheus-verification.md
│   ├── load-test-results.md
│   ├── dashboard-verification.md
│   ├── live-traffic-proof.md
│   └── evidence/
│       ├── prometheus-targets-up.png
│       ├── app-dashboard-export.json
│       └── grafana-*.json
├── Dockerfile
├── requirements.txt
└── README.md
```

---

## Documentation index

| Document | Purpose | Live links |
| -------- | ------- | ---------- |
| [**local-testing.md**](docs/local-testing.md) | Manual test run + Prometheus screenshot | [Grafana](http://localhost:3000/d/d6-app-dashboard) · [Targets](http://localhost:9090/targets) |
| [observability-report.md](docs/observability-report.md) | Full evaluation report | [Grafana](http://localhost:3000/d/d6-app-dashboard) · [Metrics](http://localhost:8008/metrics) |
| [dashboard-verification.md](docs/dashboard-verification.md) | Grafana provisioning proof | [Dashboard](http://localhost:3000/d/d6-app-dashboard) |
| [prometheus-verification.md](docs/prometheus-verification.md) | Scrape target proof | [Targets](http://localhost:9090/targets) |
| [live-traffic-proof.md](docs/live-traffic-proof.md) | Metrics increase after traffic | [Grafana](http://localhost:3000/d/d6-app-dashboard) |
| [load-test-results.md](docs/load-test-results.md) | Load generator output | [Metrics](http://localhost:8008/metrics) |
| [logging-diff.md](docs/logging-diff.md) | Before/after structured logging | [Health](http://localhost:8008/health) |
| [metrics-diff.md](docs/metrics-diff.md) | Before/after metrics instrumentation | [Metrics](http://localhost:8008/metrics) |

---

## Verification status (latest local run)

| Check | Result | Evidence |
| ----- | ------ | -------- |
| Docker Compose up | **PASS** | 3 containers running |
| App health | **PASS** | `curl :8008/health` → 200 |
| App metrics | **PASS** | `http_requests_total`, `http_errors_total` |
| Prometheus scrape | **PASS** | Targets UP — [screenshot](docs/evidence/prometheus-targets-up.png) |
| Prometheus query | **PASS** | Total requests returned (151 at time of test) |
| Load test | **PASS** | Run from project root — 100/100 success |
| Grafana dashboard | **PASS** | Auto-provisioned — [open dashboard](http://localhost:3000/d/d6-app-dashboard) |

Full details: [**docs/local-testing.md**](docs/local-testing.md)
