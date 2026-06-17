# Validation Results

> **Project:** I4 Polyglot Service Pair  
> **Generated:** 2026-06-17

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

### CLI error handling (missing args)

| Field | Value |
| ----- | ----- |
| Command | `node cli.js` |
| Exit code | `1` |
| Output | Usage message printed to stderr |

---

## Manual curl (optional)

```bash
curl -s -X POST http://127.0.0.1:8000/convert \
  -H "Content-Type: application/json" \
  -d '{"amount":100,"from":"USD","to":"INR"}'
```

Expected: `{"convertedAmount":8300.0}`
