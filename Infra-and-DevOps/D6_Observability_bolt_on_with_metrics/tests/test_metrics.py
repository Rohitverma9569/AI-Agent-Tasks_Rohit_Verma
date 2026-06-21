from fastapi.testclient import TestClient

from app.main import app


def test_metrics_endpoint_exposes_prometheus_format() -> None:
    client = TestClient(app)
    response = client.get("/metrics")
    assert response.status_code == 200
    body = response.text
    assert "http_requests_total" in body
    assert "http_request_duration_seconds" in body
    assert "http_errors_total" in body


def test_metrics_increment_after_request() -> None:
    client = TestClient(app)
    client.get("/api/items")
    response = client.get("/metrics")
    assert 'endpoint="/api/items"' in response.text or 'endpoint="/api/items"' in response.text.replace("\\", "")
