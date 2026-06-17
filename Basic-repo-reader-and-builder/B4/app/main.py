from __future__ import annotations

import logging
from typing import Any, Dict

from fastapi import FastAPI, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse

from app.routes import balance_router, router

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(name)s | %(message)s",
)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Transaction API",
    description="In-memory transaction ledger with credit/debit support",
    version="1.0.0",
)

app.include_router(router)
app.include_router(balance_router)


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(
    request: Request, exc: RequestValidationError
) -> JSONResponse:
    logger.warning("Validation error on %s: %s", request.url.path, exc.errors())
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={"detail": exc.errors(), "message": "Validation failed"},
    )


@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    logger.exception("Unhandled error on %s", request.url.path)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": str(exc), "message": "Internal server error"},
    )


@app.get("/health", tags=["health"])
def health() -> Dict[str, str]:
    return {"status": "ok"}


@app.get("/", tags=["health"])
def root() -> Dict[str, Any]:
    return {
        "service": "Transaction API",
        "docs": "/docs",
        "endpoints": {
            "create_transaction": "POST /transactions",
            "list_transactions": "GET /transactions",
            "balance": "GET /balance",
        },
    }
