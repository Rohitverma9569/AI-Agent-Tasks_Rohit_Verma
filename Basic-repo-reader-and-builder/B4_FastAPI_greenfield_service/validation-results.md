# Validation Results

> **Project:** `Basic-repo-reader-and-builder/B4_FastAPI_greenfield_service`
> **Generated:** 2026-06-22
> **Method:** Executed pytest and live uvicorn + curl.
> **Local test guide:** [local-testing.md](./local-testing.md)

---

## pytest

**Command:**

```bash
cd Basic-repo-reader-and-builder/B4_FastAPI_greenfield_service
source .venv/bin/activate
pytest -v
```

**Exit Code:** `0`

**Last run:** 2026-06-22 · rohitverma · PMLMBT4677

**Output:**

```
============================= test session starts ==============================
platform darwin -- Python 3.9.6, pytest-8.4.2, pluggy-1.6.0
collected 5 items

tests/test_transactions.py::test_create_transaction PASSED                        [ 20%]
tests/test_transactions.py::test_get_transactions PASSED                          [ 40%]
tests/test_transactions.py::test_get_balance PASSED                               [ 60%]
tests/test_transactions.py::test_create_transaction_validation_error PASSED       [ 80%]
tests/test_transactions.py::test_create_transaction_default_timestamp PASSED      [100%]

============================= 5 passed, 1 warning in 0.04s ==============================
```

**Result:** `PASSED`

---

## Manual curl (2026-06-22 session)

| Field | Value |
| ----- | ----- |
| Port | `8001` |
| Verified | 2026-06-22 · rohitverma · PMLMBT4677 |
| Full details | [local-testing.md §3](./local-testing.md#3-curl-session-capture-2026-06-22) |

### Service identity

**Output:** `"service":"Transaction API"`

**Result:** `PASSED`

### Happy path

| Request | Captured response | Result |
| ------- | ----------------- | ------ |
| `GET /health` | `{"status":"ok"}` | ✅ PASSED |
| `POST credit 100` | 201 + auto `id` and `timestamp` | ✅ PASSED |
| `POST debit 50` | 201 + auto `id` and `timestamp` | ✅ PASSED |
| `GET /transactions` | 4 transactions listed | ✅ PASSED |
| `GET /balance` | `{"balance":100.0,"transaction_count":4}` | ✅ PASSED |

> Balance: credits (100+100) − debits (50+50) = **100**

**Result:** `PASSED`

---

## uvicorn (2026-06-17 reference run)

**Command:**

```bash
cd Basic-repo-reader-and-builder/B4_FastAPI_greenfield_service
source .venv/bin/activate
uvicorn app.main:app --host 127.0.0.1 --port 8765
```

**Server output:**

```
INFO:     Started server process [58652]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://127.0.0.1:8765 (Press CTRL+C to quit)
2026-06-17 03:04:26,989 | INFO | app.routes | Created transaction id=5d0524a7-... type=credit amount=100.0
INFO:     127.0.0.1:50021 - "POST /transactions HTTP/1.1" 201 Created
2026-06-17 03:04:27,002 | INFO | app.routes | Created transaction id=04f61ca3-... type=debit amount=25.0
INFO:     127.0.0.1:50022 - "POST /transactions HTTP/1.1" 201 Created
2026-06-17 03:04:27,015 | INFO | app.routes | Listed 2 transaction(s)
INFO:     127.0.0.1:50023 - "GET /transactions HTTP/1.1" 200 OK
2026-06-17 03:04:27,027 | INFO | app.routes | Balance requested: balance=75.0 count=2
INFO:     127.0.0.1:50024 - "GET /balance HTTP/1.1" 200 OK
INFO:     127.0.0.1:50025 - "GET /health HTTP/1.1" 200 OK
```

**Live API responses (curl):**

```bash
# POST credit
{"id":"5d0524a7-1e99-4da7-a884-9b9a2e66a6cb","amount":100.0,"type":"credit","timestamp":"2026-06-16T21:34:26.986883Z"}

# POST debit
{"id":"04f61ca3-435f-4f27-af36-9876f2bf6c76","amount":25.0,"type":"debit","timestamp":"2026-06-16T21:34:27.002574Z"}

# GET /transactions
[{"id":"5d0524a7-...","amount":100.0,"type":"credit",...},{"id":"04f61ca3-...","amount":25.0,"type":"debit",...}]

# GET /balance
{"balance":75.0,"transaction_count":2}
```

**Result:** `PASSED`

---

## Summary

| Check | Result |
| ----- | ------ |
| pytest (5 tests) | ✅ PASSED |
| Manual curl — port 8001 (2026-06-22) | ✅ PASSED |
| uvicorn + curl (2026-06-17, port 8765) | ✅ PASSED |
