from fastapi import FastAPI

from app.database import init_db
from app.routes.transactions import router as transactions_router

app = FastAPI(
    title="Fraud Scoring API",
    description="Receives transactions and publishes async processing requests",
    version="1.0.0",
)


@app.on_event("startup")
def on_startup() -> None:
    init_db()


@app.get("/health", tags=["health"])
def health() -> dict[str, str]:
    return {"status": "ok", "service": "fastapi"}


app.include_router(transactions_router)
