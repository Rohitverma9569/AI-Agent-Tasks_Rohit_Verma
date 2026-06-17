from __future__ import annotations

import pytest
from fastapi import status
from fastapi.testclient import TestClient

from app.main import app
from app.services.exchange import UnsupportedCurrencyError, convert_amount

client = TestClient(app)


class TestExchangeService:
    def test_usd_to_inr_matches_spec_example(self) -> None:
        assert convert_amount(100, "USD", "INR") == 8300.0

    def test_same_currency_returns_amount(self) -> None:
        assert convert_amount(50, "USD", "USD") == 50.0

    def test_unsupported_currency_raises(self) -> None:
        with pytest.raises(UnsupportedCurrencyError):
            convert_amount(10, "USD", "XYZ")


class TestConvertEndpoint:
    def test_convert_success(self) -> None:
        response = client.post(
            "/convert",
            json={"amount": 100, "from": "USD", "to": "INR"},
        )
        assert response.status_code == status.HTTP_200_OK
        assert response.json() == {"convertedAmount": 8300.0}

    def test_convert_normalizes_lowercase_currency(self) -> None:
        response = client.post(
            "/convert",
            json={"amount": 10, "from": "usd", "to": "inr"},
        )
        assert response.status_code == status.HTTP_200_OK
        assert response.json()["convertedAmount"] == 830.0

    def test_validation_rejects_non_positive_amount(self) -> None:
        response = client.post(
            "/convert",
            json={"amount": 0, "from": "USD", "to": "INR"},
        )
        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY
        body = response.json()
        assert body["message"] == "Validation failed"

    def test_validation_rejects_invalid_currency_code(self) -> None:
        response = client.post(
            "/convert",
            json={"amount": 10, "from": "US", "to": "INR"},
        )
        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY

    def test_unsupported_currency_returns_400(self) -> None:
        response = client.post(
            "/convert",
            json={"amount": 10, "from": "USD", "to": "XYZ"},
        )
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        body = response.json()
        assert "Unsupported target currency" in body["detail"]["message"]

    def test_health_endpoint(self) -> None:
        response = client.get("/health")
        assert response.status_code == status.HTTP_200_OK
        assert response.json() == {"status": "ok"}
