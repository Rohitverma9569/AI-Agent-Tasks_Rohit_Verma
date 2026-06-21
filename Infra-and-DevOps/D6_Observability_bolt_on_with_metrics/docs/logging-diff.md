# Structured Logging Diff

> **Target:** `app/` — FastAPI D6 demo service  
> **Date:** 2026-06-21

**Live:** [App health](http://localhost:8008/health) · [Grafana dashboard](http://localhost:3000/d/d6-app-dashboard)

## Summary

Replaced plain-text / no logging with **structured JSON logging** via `app/logging_config.py` and HTTP middleware in `app/main.py`.

---

## File: `app/main.py` (before — minimal FastAPI, no structured logging)

```python
from fastapi import FastAPI

app = FastAPI(title="D6 Observability Demo API")

@app.get("/health")
def health():
    return {"status": "ok", "service": "d6-observability-demo"}

@app.get("/api/items")
def list_items():
    return {"items": [{"id": 1, "name": "demo-item"}]}
```

---

## File: `app/main.py` (after — middleware emits JSON logs per request)

```python
from app.logging_config import configure_logging, log_request
from app.metrics import SERVICE_NAME, record_request

SERVICE = os.getenv("SERVICE_NAME", SERVICE_NAME)
logger = configure_logging(SERVICE)

@app.middleware("http")
async def observability_middleware(request: Request, call_next):
    if request.url.path == "/metrics":
        return await call_next(request)
    start = time.perf_counter()
    response = await call_next(request)
    duration_seconds = time.perf_counter() - start
    record_request(request.method, request.url.path, response.status_code, duration_seconds)
    log_request(
        logger,
        endpoint=request.url.path,
        status=response.status_code,
        method=request.method,
        duration_ms=duration_seconds * 1000,
        service=SERVICE,
    )
    return response
```

---

## File: `app/logging_config.py` (new)

```python
class JsonFormatter(logging.Formatter):
    def format(self, record: logging.LogRecord) -> str:
        payload = {
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "level": record.levelname,
            "message": record.getMessage(),
            "logger": record.name,
        }
        for key in ("endpoint", "status", "method", "duration_ms", "service"):
            if hasattr(record, key):
                payload[key] = getattr(record, key)
        return json.dumps(payload, default=str)
```

---

## Sample log output (verified)

```json
{"timestamp": "2026-06-21T14:09:19.750809+00:00", "level": "INFO", "message": "request completed", "logger": "d6-observability-demo", "endpoint": "/api/items", "status": 200, "method": "GET", "duration_ms": 1.234, "service": "d6-observability-demo"}
```

Saved sample: [`evidence/structured-log-sample.json`](evidence/structured-log-sample.json)
