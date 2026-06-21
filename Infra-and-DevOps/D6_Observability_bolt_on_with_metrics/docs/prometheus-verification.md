# Prometheus Verification

> **Config:** `monitoring/prometheus/prometheus.yml`  
> **Date:** 2026-06-21  
> **Status:** PASS

### Live links

| Link | URL |
| ---- | --- |
| Prometheus targets | [http://localhost:9090/targets](http://localhost:9090/targets) |
| Prometheus UI | [http://localhost:9090](http://localhost:9090) |
| App metrics (scrape source) | [http://localhost:8008/metrics](http://localhost:8008/metrics) |
| Grafana dashboard | [http://localhost:3000/d/d6-app-dashboard](http://localhost:3000/d/d6-app-dashboard) |

---

## Configuration

| Setting | Value |
| ------- | ----- |
| Scrape interval | 15s |
| Job name | `d6-demo-api` |
| Target | `app:8000` |
| Metrics path | `/metrics` |
| Label | `service=d6-observability-demo` |

---

## Verification command

```bash
curl -s http://localhost:9090/api/v1/targets | python3 -m json.tool
```

**Exit code:** 0

---

## Target status (parsed)

| Job | Health | Last scrape |
| --- | ------ | ----------- |
| d6-demo-api | **up** | 2026-06-21T14:09:19Z |
| prometheus | **up** | 2026-06-21T14:09:18Z |

---

## Scrape success query

```bash
curl -s -G 'http://localhost:9090/api/v1/query' \
  --data-urlencode 'query=sum(http_requests_total{job="d6-demo-api"})'
```

**Response (after load test):**

```json
{
  "status": "success",
  "data": {
    "resultType": "vector",
    "result": [
      {
        "metric": {},
        "value": [1782050959.871, "109"]
      }
    ]
  }
}
```

Prometheus is successfully scraping application metrics from the Docker network target `app:8000`.

---

## UI

Targets page: [http://localhost:9090/targets](http://localhost:9090/targets)
