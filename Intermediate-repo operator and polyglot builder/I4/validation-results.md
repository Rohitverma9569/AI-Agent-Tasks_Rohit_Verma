# Validation Results

> **Project:** I4 Polyglot Service Pair  
> **Generated:** 2026-06-22  
> **Status:** [STATUS.md](./STATUS.md) · **Local test guide:** [local-testing.md](./local-testing.md)

---

## uvicorn (server startup)

| Field | Value |
| ----- | ----- |
| Command | `uvicorn app.main:app --reload --host 127.0.0.1 --port 8000` |
| Directory | `services/fastapi` |
| Exit code | Running (manual session) |

```
INFO:     Will watch for changes in these directories: ['/Users/rohitverma/Desktop/AI-Agents-Tasks -PML/Intermediate-repo operator and polyglot builder/I4/services/fastapi']
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
INFO:     Started reloader process [62824] using WatchFiles
INFO:     Started server process [62836]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

**Result:** `PASSED` — server ready at [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

---

## Swagger UI (manual)

| Field | Value |
| ----- | ----- |
| UI | [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs) |
| Service title | Currency Conversion API |
| Verified | 2026-06-22 · rohitverma · PMLMBT4677 |
| Full details | [local-testing.md §2](./local-testing.md#2-i4-swagger-ui-tests-port-8000) |

### GET /health

| Field | Value |
| ----- | ----- |
| Status | `200` |
| Response | `{"status":"ok"}` |

**Result:** `PASSED`

### GET / (root)

| Field | Value |
| ----- | ----- |
| Status | `200` |

```json
{
  "service": "Currency Conversion API",
  "docs": "/docs",
  "supportedCurrencies": ["EUR", "GBP", "INR", "JPY", "USD"],
  "endpoints": {
    "convert": "POST /convert"
  }
}
```

**Result:** `PASSED`

### POST /convert — USD → INR

| Field | Value |
| ----- | ----- |
| Status | `200` |

**Request:**

```json
{
  "amount": 100,
  "from": "USD",
  "to": "INR"
}
```

**Response:**

```json
{
  "convertedAmount": 8300
}
```

**Result:** `PASSED`

### POST /convert — USD → EUR

**Request:** `{"amount":100,"from":"USD","to":"EUR"}`  
**Response:** `{"convertedAmount":92}`  
**Result:** `PASSED`

### POST /convert — same currency

**Request:** `{"amount":250,"from":"USD","to":"USD"}`  
**Response:** `{"convertedAmount":250}`  
**Result:** `PASSED`

### POST /convert — USD → GBP

**Request:** `{"amount":50,"from":"USD","to":"GBP"}`  
**Response:** `{"convertedAmount":39.5}`  
**Result:** `PASSED`

### POST /convert — USD → JPY

**Request:** `{"amount":10,"from":"USD","to":"JPY"}`  
**Response:** `{"convertedAmount":1560.0}`  
**Result:** `PASSED`

---

## Manual curl (2026-06-22 session)

| Field | Value |
| ----- | ----- |
| Verified | 2026-06-22 · rohitverma · PMLMBT4677 |
| Port | `8000` |
| Full details | [local-testing.md §3](./local-testing.md#3-curl-session-capture-2026-06-22) |

### Service identity

**Command:**

```bash
curl -s http://127.0.0.1:8000/ | grep -o '"service":"[^"]*"'
```

**Output:** `"service":"Currency Conversion API"`

**Result:** `PASSED`

### POST /convert — happy path (5 cases)

| Request | Captured response | Result |
| ------- | ----------------- | ------ |
| `100 USD → INR` | `{"convertedAmount":8300.0}` | ✅ PASSED |
| `100 USD → EUR` | `{"convertedAmount":92.0}` | ✅ PASSED |
| `250 USD → USD` | `{"convertedAmount":250.0}` | ✅ PASSED |
| `50 USD → GBP` | `{"convertedAmount":39.5}` | ✅ PASSED |
| `10 USD → JPY` | `{"convertedAmount":1560.0}` | ✅ PASSED |

### POST /convert — error cases

| Request | Status | Result |
| ------- | ------ | ------ |
| `amount: -10` | 422 — `Input should be greater than 0` | ✅ PASSED |
| `to: XYZ` (unsupported) | 400 — `Unsupported target currency: XYZ` | ✅ PASSED |

**Example curl:**

```bash
curl -s -X POST http://127.0.0.1:8000/convert \
  -H "Content-Type: application/json" \
  -d '{"amount":100,"from":"USD","to":"INR"}'
```

Expected: `{"convertedAmount":8300.0}`

See [local-testing.md §5](./local-testing.md#5-all-curl-commands-copy-paste) for the full copy-paste curl list.

---

## pytest

| Field | Value |
| ----- | ----- |
| Command | `pytest -v` |
| Directory | `services/fastapi` |
| Exit code | `0` |

```
============================= test session starts ==============================
collected 9 items

tests/test_convert.py::TestExchangeService::test_usd_to_inr_matches_spec_example PASSED
tests/test_convert.py::TestExchangeService::test_same_currency_returns_amount PASSED
tests/test_convert.py::TestExchangeService::test_unsupported_currency_raises PASSED
tests/test_convert.py::TestConvertEndpoint::test_convert_success PASSED
tests/test_convert.py::TestConvertEndpoint::test_convert_normalizes_lowercase_currency PASSED
tests/test_convert.py::TestConvertEndpoint::test_validation_rejects_non_positive_amount PASSED
tests/test_convert.py::TestConvertEndpoint::test_validation_rejects_invalid_currency_code PASSED
tests/test_convert.py::TestConvertEndpoint::test_unsupported_currency_returns_400 PASSED
tests/test_convert.py::TestConvertEndpoint::test_health_endpoint PASSED

======================== 9 passed in 0.31s =========================
```

**Result:** `PASSED`

---

## node cli.js

| Field | Value |
| ----- | ----- |
| Command | `node cli.js 100 USD INR` |
| Directory | `clients/node-cli` |
| Exit code | `0` |
| Output | `8300` |

**Prerequisite:** FastAPI server running at `http://127.0.0.1:8000`

```
uvicorn app.main:app --host 127.0.0.1 --port 8000
```

**Result:** `PASSED`

### CLI error handling (missing args)

| Field | Value |
| ----- | ----- |
| Command | `node cli.js` |
| Exit code | `1` |
| Output | Usage message printed to stderr |

**Result:** `PASSED`

---

## Summary

| Check | Result |
| ----- | ------ |
| uvicorn startup (port 8000) | ✅ PASSED |
| Swagger UI — GET /health | ✅ PASSED |
| Swagger UI — GET / | ✅ PASSED |
| Swagger UI — POST /convert (5 cases) | ✅ PASSED |
| Manual curl — POST /convert (5 happy path) | ✅ PASSED |
| Manual curl — validation & unsupported currency | ✅ PASSED |
| pytest (9 tests) | ✅ PASSED |
| node cli.js | ✅ PASSED |
| CLI error handling | ✅ PASSED |
