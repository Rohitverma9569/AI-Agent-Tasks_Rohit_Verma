import os
from pathlib import Path

import pytest
from fastapi.testclient import TestClient

from app.database import init_db
from app.main import app


@pytest.fixture()
def client(tmp_path: Path):
    db_path = tmp_path / "test.db"
    os.environ["FRAUD_DB_PATH"] = str(db_path)
    init_db(db_path)
    with TestClient(app) as test_client:
        yield test_client
    os.environ.pop("FRAUD_DB_PATH", None)


def test_health(client: TestClient):
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"


def test_create_transaction_publishes_to_queue(client: TestClient, tmp_path: Path):
    response = client.post(
        "/transactions",
        json={
            "user_id": "user-42",
            "merchant_id": "MERCH-100",
            "amount": 250.0,
            "currency": "usd",
        },
    )
    assert response.status_code == 201
    body = response.json()
    assert body["status"] == "PENDING"
    assert body["risk_score"] is None
    assert body["currency"] == "USD"

    import sqlite3

    db_path = os.environ["FRAUD_DB_PATH"]
    with sqlite3.connect(db_path) as conn:
        row = conn.execute(
            "SELECT status FROM processing_queue WHERE transaction_id = ?",
            (body["id"],),
        ).fetchone()
    assert row is not None
    assert row[0] == "PENDING"


def test_get_transaction_not_found(client: TestClient):
    response = client.get("/transactions/does-not-exist")
    assert response.status_code == 404


def test_create_transaction_validation_error(client: TestClient):
    response = client.post(
        "/transactions",
        json={
            "user_id": "",
            "merchant_id": "MERCH",
            "amount": -1,
            "currency": "US",
        },
    )
    assert response.status_code == 422
