from fastapi.testclient import TestClient

from app.main import app


def test_internal_paths_do_not_increment_request_counters() -> None:
    client = TestClient(app)
    before = client.get("/metrics").text

    client.get("/health")
    client.get("/metrics")

    after = client.get("/metrics").text
    assert 'endpoint="/health"' not in after
    assert before.count('endpoint="/api/items"') == after.count('endpoint="/api/items"')


def test_app_routes_still_increment_counters() -> None:
    client = TestClient(app)
    client.get("/api/items")
    response = client.get("/metrics")
    assert 'endpoint="/api/items"' in response.text
