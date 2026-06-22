# B4 — Local Testing (pytest, Swagger UI & curl)

| | |
| --- | --- |
| **Project** | B4 — FastAPI Transaction API |
| **Last verified** | 2026-06-22 · rohitverma · PMLMBT4677 |
| **Environment** | Local · macOS · pytest + manual curl |
| **B4 Swagger UI** | [http://127.0.0.1:8001/docs](http://127.0.0.1:8001/docs) (port 8001 when I4 uses 8000) |
| **Related** | [STATUS.md](./STATUS.md) · [validation-results.md](./validation-results.md) · [README.md](./README.md) |

---

## 1. Setup & automated tests

**Directory:** `Basic-repo-reader-and-builder/B4_FastAPI_greenfield_service`

```bash
cd "/Users/rohitverma/Desktop/AI-Agents-Tasks -PML/Basic-repo-reader-and-builder/B4_FastAPI_greenfield_service"

python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

pytest -v
```

**Captured output (2026-06-22):**

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

## 2. Start B4 FastAPI Server

```bash
cd "/Users/rohitverma/Desktop/AI-Agents-Tasks -PML/Basic-repo-reader-and-builder/B4_FastAPI_greenfield_service"
source .venv/bin/activate
uvicorn app.main:app --reload --host 127.0.0.1 --port 8001
```

Wait for: `Uvicorn running on http://127.0.0.1:8001`

> **Port conflict tip:** If port 8000 is used by **I4** (Currency Conversion API), run B4 on **8001**. If you see `ERROR: [Errno 48] Address already in use`, the server may already be running — test with `curl -s http://127.0.0.1:8001/health` before starting again.

**Confirm B4 (not I4):**

```bash
curl -s http://127.0.0.1:8001/ | grep -o '"service":"[^"]*"'
```

Expected: `"service":"Transaction API"`

---

## 3. curl Session Capture (2026-06-22)

Manual curl session against B4 on port **8001**. Server was already running from a prior session (ports 8000 and 8001 were in use when starting uvicorn again).

### 3.1 GET /health

**Command:**

```bash
curl -s http://127.0.0.1:8001/health
```

**Captured response:**

```json
{"status":"ok"}
```

**Result:** `PASSED`

---

### 3.2 GET / (root) — service identity

**Command:**

```bash
curl -s http://127.0.0.1:8001/ | grep -o '"service":"[^"]*"'
```

**Captured output:**

```
"service":"Transaction API"
```

**Result:** `PASSED`

---

### 3.3 POST /transactions — credit

**Command:**

```bash
curl -X POST 'http://127.0.0.1:8001/transactions' \
  -H 'Content-Type: application/json' \
  -d '{"amount":100,"type":"credit"}'
```

**Captured response:**

```json
{
  "id": "6d549226-4cf2-48cd-a85a-6696b561bf7f",
  "amount": 100.0,
  "type": "credit",
  "timestamp": "2026-06-22T05:46:36.897656Z"
}
```

**Result:** `PASSED` (201 Created)

---

### 3.4 POST /transactions — debit

**Command:**

```bash
curl -X POST 'http://127.0.0.1:8001/transactions' \
  -H 'Content-Type: application/json' \
  -d '{"amount":50,"type":"debit"}'
```

**Captured response:**

```json
{
  "id": "09225d69-6e30-4793-a64c-7082d8901eef",
  "amount": 50.0,
  "type": "debit",
  "timestamp": "2026-06-22T05:46:45.124951Z"
}
```

**Result:** `PASSED` (201 Created)

---

### 3.5 GET /transactions

**Command:**

```bash
curl -s http://127.0.0.1:8001/transactions
```

**Captured response** (4 transactions — 2 from earlier session + 2 from this run):

```json
[
  {
    "id": "c67f182a-4bd8-43fe-96a8-982d9595f99e",
    "amount": 100.0,
    "type": "credit",
    "timestamp": "2026-06-22T03:37:39.534305Z"
  },
  {
    "id": "64ed1c56-43ea-4a40-a797-67180963a6db",
    "amount": 50.0,
    "type": "debit",
    "timestamp": "2026-06-22T03:38:16.116550Z"
  },
  {
    "id": "6d549226-4cf2-48cd-a85a-6696b561bf7f",
    "amount": 100.0,
    "type": "credit",
    "timestamp": "2026-06-22T05:46:36.897656Z"
  },
  {
    "id": "09225d69-6e30-4793-a64c-7082d8901eef",
    "amount": 50.0,
    "type": "debit",
    "timestamp": "2026-06-22T05:46:45.124951Z"
  }
]
```

**Result:** `PASSED`

---

### 3.6 GET /balance

**Command:**

```bash
curl -s http://127.0.0.1:8001/balance
```

**Captured response:**

```json
{
  "balance": 100.0,
  "transaction_count": 4
}
```

**Balance check:** credits (100 + 100) − debits (50 + 50) = **100**

**Result:** `PASSED`

---

## 4. Swagger UI Tests (port 8001)

Open **http://127.0.0.1:8001/docs** — title should be **Transaction API**.

### Test 1 — GET /health

| Field | Value |
| ----- | ----- |
| Method | `GET` |
| URL | `http://127.0.0.1:8001/health` |
| Expected status | `200` |
| Expected response | `{"status":"ok"}` |

---

### Test 2 — POST /transactions (credit)

| Field | Value |
| ----- | ----- |
| Method | `POST` |
| URL | `http://127.0.0.1:8001/transactions` |
| Expected status | `201` |

**Request body:**

```json
{
  "amount": 100,
  "type": "credit"
}
```

`id` and `timestamp` are auto-generated if omitted.

---

### Test 3 — POST /transactions (debit)

**Request body:**

```json
{
  "amount": 50,
  "type": "debit"
}
```

---

### Test 4 — GET /transactions

| Field | Value |
| ----- | ----- |
| Method | `GET` |
| URL | `http://127.0.0.1:8001/transactions` |
| Expected status | `200` |
| Expected response | JSON array of transactions |

---

### Test 5 — GET /balance

| Field | Value |
| ----- | ----- |
| Method | `GET` |
| URL | `http://127.0.0.1:8001/balance` |
| Expected status | `200` |

**Expected shape:**

```json
{
  "balance": 50,
  "transaction_count": 2
}
```

> On a fresh server with only one credit (100) and one debit (50), balance = **50**. In-memory store persists until the server restarts.

---

### Test 6 — POST /transactions (validation error)

**Request body:**

```json
{
  "amount": -10,
  "type": "credit"
}
```

**Expected status:** `422` — negative amount rejected

---

## 5. All curl commands (copy-paste)

Run **one command per line** — do not paste comment lines into the terminal.

Replace `8001` with `8000` if B4 runs on the default port.

```bash
curl -s http://127.0.0.1:8001/health

curl -s http://127.0.0.1:8001/ | grep -o '"service":"[^"]*"'

curl -X POST 'http://127.0.0.1:8001/transactions' -H 'Content-Type: application/json' -d '{"amount":100,"type":"credit"}'

curl -X POST 'http://127.0.0.1:8001/transactions' -H 'Content-Type: application/json' -d '{"amount":50,"type":"debit"}'

curl -s http://127.0.0.1:8001/transactions

curl -s http://127.0.0.1:8001/balance

curl -X POST 'http://127.0.0.1:8001/transactions' -H 'Content-Type: application/json' -d '{"amount":-10,"type":"credit"}'
```

---

## 6. Quick Reference — B4 vs I4

| Service | Port | Swagger | Main endpoints |
| ------- | ---- | ------- | -------------- |
| **B4** Transaction API | `8001` (or `8000` if free) | [/docs](http://127.0.0.1:8001/docs) | `POST /transactions`, `GET /balance` |
| **I4** Currency Conversion | `8000` | [/docs](http://127.0.0.1:8000/docs) | `POST /convert` |

**Identity check:**

```bash
curl -s http://127.0.0.1:8001/ | grep service   # B4 → Transaction API
curl -s http://127.0.0.1:8000/ | grep service   # I4 → Currency Conversion API
```

---

## 7. Testing checklist

| Step | Command / action | Pass criteria |
| ---- | ---------------- | ------------- |
| 1 | `pytest -v` | 5 passed |
| 2 | Start uvicorn (or confirm already running) | `curl .../health` → `ok` |
| 3 | `grep service` on root | `"Transaction API"` |
| 4 | POST credit | 201 + `id` returned |
| 5 | POST debit | 201 + `id` returned |
| 6 | GET /transactions | Array includes new rows |
| 7 | GET /balance | `balance` = credits − debits |
