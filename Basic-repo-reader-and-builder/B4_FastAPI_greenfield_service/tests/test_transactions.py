from datetime import datetime, timezone

from fastapi.testclient import TestClient


def test_create_transaction(client: TestClient) -> None:
    payload = {
        "amount": 150.0,
        "type": "credit",
        "timestamp": "2026-06-17T10:00:00Z",
    }
    response = client.post("/transactions", json=payload)

    assert response.status_code == 201
    body = response.json()
    assert body["amount"] == 150.0
    assert body["type"] == "credit"
    assert "id" in body and isinstance(body["id"], str)
    assert body["timestamp"] is not None


def test_get_transactions(client: TestClient) -> None:
    client.post("/transactions", json={"amount": 100.0, "type": "credit"})
    client.post("/transactions", json={"amount": 25.0, "type": "debit"})

    response = client.get("/transactions")

    assert response.status_code == 200
    transactions = response.json()
    assert len(transactions) == 2
    assert {t["type"] for t in transactions} == {"credit", "debit"}


def test_get_balance(client: TestClient) -> None:
    client.post("/transactions", json={"amount": 200.0, "type": "credit"})
    client.post("/transactions", json={"amount": 50.0, "type": "debit"})
    client.post("/transactions", json={"amount": 30.0, "type": "credit"})

    response = client.get("/balance")

    assert response.status_code == 200
    body = response.json()
    assert body["balance"] == 180.0  # 200 - 50 + 30
    assert body["transaction_count"] == 3


def test_create_transaction_validation_error(client: TestClient) -> None:
    response = client.post("/transactions", json={"amount": -10.0, "type": "credit"})

    assert response.status_code == 422
    assert "detail" in response.json()


def test_create_transaction_default_timestamp(client: TestClient) -> None:
    response = client.post("/transactions", json={"amount": 10.0, "type": "debit"})

    assert response.status_code == 201
    ts = datetime.fromisoformat(response.json()["timestamp"].replace("Z", "+00:00"))
    assert ts.tzinfo is not None
