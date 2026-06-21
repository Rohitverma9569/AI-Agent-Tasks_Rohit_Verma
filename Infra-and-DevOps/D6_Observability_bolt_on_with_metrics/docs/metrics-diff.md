# Metrics Instrumentation Diff

> **Target:** `app/metrics.py`, `app/main.py`  
> **Endpoint:** `GET /metrics` (FastAPI / Prometheus exposition format)  
> **Date:** 2026-06-21

**Live:** [App metrics](http://localhost:8008/metrics) · [Prometheus targets](http://localhost:9090/targets) · [Grafana dashboard](http://localhost:3000/d/d6-app-dashboard)

## Summary

Added **prometheus-client** instrumentation tracking request count, duration, and errors per endpoint.

---

## File: `app/metrics.py` (new)

```python
from prometheus_client import Counter, Histogram

HTTP_REQUESTS_TOTAL = Counter(
    "http_requests_total",
    "Total HTTP requests",
    ["method", "endpoint", "status"],
)

HTTP_REQUEST_DURATION_SECONDS = Histogram(
    "http_request_duration_seconds",
    "HTTP request duration in seconds",
    ["method", "endpoint", "status"],
    buckets=(0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1.0, 2.0),
)

HTTP_ERRORS_TOTAL = Counter(
    "http_errors_total",
    "Total HTTP error responses (4xx and 5xx)",
    ["method", "endpoint", "status"],
)

def record_request(method, endpoint, status, duration_seconds):
    labels = {"method": method, "endpoint": endpoint, "status": str(status)}
    HTTP_REQUESTS_TOTAL.labels(**labels).inc()
    HTTP_REQUEST_DURATION_SECONDS.labels(**labels).observe(duration_seconds)
    if status >= 400:
        HTTP_ERRORS_TOTAL.labels(**labels).inc()
```

---

## File: `app/main.py` (before — no metrics endpoint)

```python
@app.get("/health")
def health():
    return {"status": "ok"}
# No /metrics route
# No request counters
```

---

## File: `app/main.py` (after — metrics endpoint + middleware)

```python
from prometheus_client import CONTENT_TYPE_LATEST, generate_latest

Middleware skips internal routes (`/health`, `/metrics`, `/favicon.ico`) so counters reflect **application traffic** only (`/api/items`, `/api/error`, load tests).

@app.get("/metrics", tags=["observability"])
def metrics() -> Response:
    return Response(content=generate_latest(), media_type=CONTENT_TYPE_LATEST)
```

---

## Metrics exposed

| Metric | Type | Labels |
| ------ | ---- | ------ |
| `http_requests_total` | Counter | method, endpoint, status |
| `http_request_duration_seconds` | Histogram | method, endpoint, status |
| `http_errors_total` | Counter | method, endpoint, status |

---

## Verified curl output (after load test)

```
http_requests_total{endpoint="/health",method="GET",status="200"} 5.0
http_requests_total{endpoint="/api/items",method="GET",status="200"} 100.0
http_requests_total{endpoint="/api/error",method="GET",status="500"} 10.0
http_errors_total{endpoint="/api/error",method="GET",status="500"} 10.0
```

Command: `curl -s http://localhost:8008/metrics | grep '^http_'`
