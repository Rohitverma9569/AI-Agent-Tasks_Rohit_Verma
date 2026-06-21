# Dashboard Verification

> **Date:** 2026-06-21  
> **Status:** PASS — datasource and dashboard auto-provisioned from files

### Live links

| Link | URL | Credentials |
| ---- | --- | ----------- |
| **Grafana dashboard** | [http://localhost:3000/d/d6-app-dashboard](http://localhost:3000/d/d6-app-dashboard) | admin / admin |
| Grafana login | [http://localhost:3000](http://localhost:3000) | admin / admin |
| Prometheus targets | [http://localhost:9090/targets](http://localhost:9090/targets) | — |

---

## Provisioning files

| Asset | Path |
| ----- | ---- |
| Datasource | `monitoring/grafana/provisioning/datasources/prometheus.yml` |
| Dashboard provider | `monitoring/grafana/provisioning/dashboards/dashboards.yml` |
| Dashboard JSON | `monitoring/grafana/dashboards/app-dashboard.json` |

No manual Grafana configuration was performed.

---

## Datasource verification

```bash
curl -s -u admin:admin http://localhost:3000/api/datasources
```

**Result:** Prometheus datasource loaded at `http://prometheus:9090`, UID `prometheus`, default=true.

Evidence: [`evidence/grafana-datasources.json`](evidence/grafana-datasources.json)

---

## Dashboard verification

```bash
curl -s -u admin:admin 'http://localhost:3000/api/search?type=dash-db'
```

**Result:**

| Title | UID | Folder |
| ----- | --- | ------ |
| D6 FastAPI Observability | d6-app-dashboard | D6 |

Evidence: [`evidence/grafana-dashboards.json`](evidence/grafana-dashboards.json)

---

## Dashboard panels

| Panel | Type | PromQL / source |
| ----- | ---- | ---------------- |
| Requests Per Second | Stat | `sum(rate(http_requests_total{job="d6-demo-api",endpoint=~"/api/.*"}[2m]))` |
| Total API Requests | Stat | `sum(http_requests_total{job="d6-demo-api",endpoint=~"/api/.*"})` |
| Error Count | Stat | `sum(http_errors_total{job="d6-demo-api"})` |
| Avg Latency | Stat | `sum(sum)/sum(count)` from duration histogram |
| Total Requests Over Time | Graph | `http_requests_total` by `/api/items`, `/api/error` |
| Request Rate by Endpoint | Graph | `rate(...)` per endpoint |
| Requests Per Minute | Bar graph | `increase(http_requests_total[1m])` |
| Average Latency by Endpoint | Graph | Per-endpoint avg ms |
| Errors Over Time | Graph | `http_errors_total` |
| Requests by Endpoint (current) | Bar gauge | Instant `http_requests_total` |
| Requests by Endpoint (table) | Table | Method, endpoint, status, count |

---

## Dashboard JSON export

- Source: `monitoring/grafana/dashboards/app-dashboard.json`
- Export copy: [`evidence/app-dashboard-export.json`](evidence/app-dashboard-export.json)

---

## Grafana UI

- **Dashboard:** [http://localhost:3000/d/d6-app-dashboard](http://localhost:3000/d/d6-app-dashboard)
- **Login:** [http://localhost:3000](http://localhost:3000) — admin / admin

After running `./scripts/load-test.sh`, panels show increasing Total API Requests, error bars on `/api/error (500)`, and spikes on the request-rate graphs.
