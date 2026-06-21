from __future__ import annotations

import os
import time
from typing import Any, Dict

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse, Response
from prometheus_client import CONTENT_TYPE_LATEST, generate_latest

from app.logging_config import configure_logging, log_request
from app.metrics import SERVICE_NAME, record_request

# Internal/observability routes — excluded from request counters and access logs
METRICS_EXCLUDED_PATHS = frozenset({
    "/metrics",
    "/health",
    "/favicon.ico",
})

SERVICE = os.getenv("SERVICE_NAME", SERVICE_NAME)
logger = configure_logging(SERVICE)

app = FastAPI(
    title="D6 Observability Demo API",
    description="FastAPI service with structured logging and Prometheus metrics",
    version="1.0.0",
)


@app.middleware("http")
async def observability_middleware(request: Request, call_next):
    if request.url.path in METRICS_EXCLUDED_PATHS:
        return await call_next(request)

    start = time.perf_counter()
    response = await call_next(request)
    duration_seconds = time.perf_counter() - start
    endpoint = request.url.path
    method = request.method
    status = response.status_code

    record_request(method, endpoint, status, duration_seconds)
    log_request(
        logger,
        endpoint=endpoint,
        status=status,
        method=method,
        duration_ms=duration_seconds * 1000,
        service=SERVICE,
    )
    return response


@app.get("/health", tags=["health"])
def health() -> Dict[str, str]:
    return {"status": "ok", "service": SERVICE}


@app.get("/api/items", tags=["demo"])
def list_items() -> Dict[str, Any]:
    return {"items": [{"id": 1, "name": "demo-item"}]}


@app.get("/api/error", tags=["demo"])
def demo_error() -> JSONResponse:
    return JSONResponse(status_code=500, content={"error": "intentional demo error"})


@app.get("/metrics", tags=["observability"])
def metrics() -> Response:
    return Response(content=generate_latest(), media_type=CONTENT_TYPE_LATEST)
