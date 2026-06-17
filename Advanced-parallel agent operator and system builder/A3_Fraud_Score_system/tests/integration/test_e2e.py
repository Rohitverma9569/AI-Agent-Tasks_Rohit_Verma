#!/usr/bin/env python3
"""End-to-end integration test: FastAPI -> Node -> Rust."""

from __future__ import annotations

import json
import os
import sys
import time
import urllib.error
import urllib.request

API_BASE = os.environ.get("API_BASE", "http://127.0.0.1:8000")
POLL_TIMEOUT_SEC = 15


def http_json(method: str, url: str, payload: dict | None = None) -> dict:
    data = None
    headers = {"Content-Type": "application/json"}
    if payload is not None:
        data = json.dumps(payload).encode()
    request = urllib.request.Request(url, data=data, headers=headers, method=method)
    with urllib.request.urlopen(request, timeout=5) as response:
        return json.loads(response.read().decode())


def main() -> int:
    print("Integration: POST /transactions")
    created = http_json(
        "POST",
        f"{API_BASE}/transactions",
        {
            "user_id": "integration-user",
            "merchant_id": "MERCH-INT",
            "amount": 15000,
            "currency": "USD",
        },
    )
    tx_id = created["id"]
    assert created["status"] == "PENDING", created
    print(f"  created transaction {tx_id}")

    deadline = time.time() + POLL_TIMEOUT_SEC
    final = created
    while time.time() < deadline:
        try:
            final = http_json("GET", f"{API_BASE}/transactions/{tx_id}")
        except urllib.error.HTTPError:
            time.sleep(0.5)
            continue
        if final.get("status") == "COMPLETED":
            break
        time.sleep(0.5)

    assert final["status"] == "COMPLETED", final
    assert final["risk_score"] == "HIGH", final
    assert final["score_value"] is not None
    assert final["reasons"], final
    print(
        f"  scored {tx_id}: {final['risk_score']} "
        f"(value={final['score_value']}, reasons={final['reasons']})"
    )
    print("Integration test PASSED")
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except Exception as exc:  # noqa: BLE001
        print(f"Integration test FAILED: {exc}", file=sys.stderr)
        raise SystemExit(1) from exc
