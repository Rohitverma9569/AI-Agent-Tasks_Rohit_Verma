import pytest
from fastapi.testclient import TestClient

from app.main import app


@pytest.fixture
def client() -> TestClient:
    return TestClient(app)


def test_health_returns_ok(client: TestClient) -> None:
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"


def test_list_items_returns_demo_payload(client: TestClient) -> None:
    response = client.get("/api/items")
    assert response.status_code == 200
    assert response.json()["items"][0]["name"] == "demo-item"


def test_demo_error_returns_500(client: TestClient) -> None:
    response = client.get("/api/error")
    assert response.status_code == 500
