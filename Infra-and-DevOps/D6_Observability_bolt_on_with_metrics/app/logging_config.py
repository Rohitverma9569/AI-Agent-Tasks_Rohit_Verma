from __future__ import annotations

import json
import logging
import sys
from datetime import datetime, timezone
from typing import Any, Dict


class JsonFormatter(logging.Formatter):
    """Emit structured JSON log lines for observability."""

    def format(self, record: logging.LogRecord) -> str:
        payload: Dict[str, Any] = {
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "level": record.levelname,
            "message": record.getMessage(),
            "logger": record.name,
        }
        for key in ("endpoint", "status", "method", "duration_ms", "service"):
            if hasattr(record, key):
                payload[key] = getattr(record, key)
        if record.exc_info:
            payload["exception"] = self.formatException(record.exc_info)
        return json.dumps(payload, default=str)


def configure_logging(service_name: str = "d6-observability-demo") -> logging.Logger:
    handler = logging.StreamHandler(sys.stdout)
    handler.setFormatter(JsonFormatter())
    root = logging.getLogger()
    root.handlers.clear()
    root.addHandler(handler)
    root.setLevel(logging.INFO)
    logger = logging.getLogger(service_name)
    logger.extra = {"service": service_name}  # type: ignore[attr-defined]
    return logger


def log_request(
    logger: logging.Logger,
    *,
    endpoint: str,
    status: int,
    method: str,
    duration_ms: float,
    service: str,
) -> None:
    level = logging.ERROR if status >= 500 else logging.WARNING if status >= 400 else logging.INFO
    logger.log(
        level,
        "request completed",
        extra={
            "endpoint": endpoint,
            "status": status,
            "method": method,
            "duration_ms": round(duration_ms, 3),
            "service": service,
        },
    )
