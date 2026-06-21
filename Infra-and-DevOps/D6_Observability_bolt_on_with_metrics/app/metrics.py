from __future__ import annotations

from prometheus_client import Counter, Histogram

SERVICE_NAME = "d6-observability-demo"

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


def record_request(method: str, endpoint: str, status: int, duration_seconds: float) -> None:
    labels = {"method": method, "endpoint": endpoint, "status": str(status)}
    HTTP_REQUESTS_TOTAL.labels(**labels).inc()
    HTTP_REQUEST_DURATION_SECONDS.labels(**labels).observe(duration_seconds)
    if status >= 400:
        HTTP_ERRORS_TOTAL.labels(**labels).inc()
