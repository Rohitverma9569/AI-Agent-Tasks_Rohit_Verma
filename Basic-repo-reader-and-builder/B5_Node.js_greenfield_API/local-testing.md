# B5 — Local Testing (Jest, Swagger UI & curl)

| | |
| --- | --- |
| **Project** | B5 — Node.js Transaction API (Express) |
| **Last verified** | 2026-06-22 · rohitverma · PMLMBT4677 |
| **Environment** | Local · macOS · Jest + manual curl |
| **B5 Swagger UI** | [http://localhost:3000/docs](http://localhost:3000/docs) |
| **Related** | [STATUS.md](./STATUS.md) · [validation-results.md](./validation-results.md) · [README.md](./README.md) |

> **Important:** Use **`localhost:3000`**, not `127.0.0.1:3000`, for manual curl and browser tests. An SSH tunnel may occupy IPv4 port 3000 and return HTML (`302 /login`) instead of the B5 JSON API.

---

## 1. Setup & automated tests

**Directory:** `Basic-repo-reader-and-builder/B5_Node.js_greenfield_API`

```bash
cd "/Users/rohitverma/Desktop/AI-Agents-Tasks -PML/Basic-repo-reader-and-builder/B5_Node.js_greenfield_API"

npm install

npm test
```

**Captured output (2026-06-22):**

```
Test Suites: 10 passed, 10 total
Tests:       18 passed, 18 total
Time:        1.892 s
```

**Suites executed:**

| Suite | Tests |
| ----- | ----- |
| `tests/transactionStore.test.js` | 2 |
| `tests/validateTransaction.test.js` | 2 |
| `tests/errorHandler.test.js` | 2 |
| `tests/transactionController.test.js` | 2 |
| `tests/index.test.js` | 1 |
| `tests/transactionRoutes.test.js` | 1 |
| `tests/balanceRoutes.test.js` | 1 |
| `tests/swagger.test.js` | 2 |
| `tests/transactions.test.js` | 4 |
| `tests/app.test.js` | 1 |

**Core integration tests (`tests/transactions.test.js`):**

- POST /transactions creates a transaction — PASSED
- GET /transactions returns all transactions — PASSED
- GET /balance returns credits minus debits — PASSED
- POST /transactions rejects invalid amount — PASSED

**Result:** `PASSED`

---

## 2. Start B5 Express Server

```bash
cd "/Users/rohitverma/Desktop/AI-Agents-Tasks -PML/Basic-repo-reader-and-builder/B5_Node.js_greenfield_API"
npm start
```

Wait for: `[INFO] Transaction service listening on http://127.0.0.1:3000`

**Alternative (avoid port 3000 conflict):**

```bash
PORT=3001 npm start
```

Then use `localhost:3001` in curl commands below.

**Confirm B5 (not another app on port 3000):**

```bash
curl -s http://localhost:3000/ | grep -o '"service":"[^"]*"'
```

Expected: `"service":"Transaction API"`

If `127.0.0.1:3000` returns `<a href="/login">Found</a>`, you are hitting the **SSH tunnel on IPv4** — switch to **`localhost`**.

---

## 3. curl Session Capture (2026-06-22)

Manual curl session against B5 on port **3000** using **`localhost`**.

### 3.1 Service identity — `127.0.0.1` vs `localhost`

| URL | Result | Meaning |
| --- | ------ | ------- |
| `http://127.0.0.1:3000/` | `<a href="/login">Found</a>.` (302) | Wrong target — SSH tunnel on IPv4 |
| `http://localhost:3000/` | `"service":"Transaction API"` | Correct — B5 Express API |

**Command (correct):**

```bash
curl -s http://localhost:3000/ | grep -o '"service":"[^"]*"'
```

**Captured output:**

```
"service":"Transaction API"
```

**Result:** `PASSED`

---

### 3.2 GET /health

**Command:**

```bash
curl -s http://localhost:3000/health
```

**Captured response:**

```json
{"status":"ok"}
```

**Result:** `PASSED`

---

### 3.3 GET / (root)

**Command:**

```bash
curl -s http://localhost:3000/
```

**Captured response:**

```json
{
  "service": "Transaction API",
  "docs": "/docs",
  "openapi": "/api-docs",
  "endpoints": {
    "create_transaction": "POST /transactions",
    "list_transactions": "GET /transactions",
    "balance": "GET /balance"
  }
}
```

**Result:** `PASSED`

---

### 3.4 POST /transactions — credit

**Command:**

```bash
curl -X POST 'http://localhost:3000/transactions' \
  -H 'Content-Type: application/json' \
  -d '{"amount":100,"type":"credit"}'
```

**Captured response:**

```json
{
  "id": "1df84ecf-3843-45d8-8372-803694e6c5b4",
  "amount": 100,
  "type": "credit",
  "timestamp": "2026-06-22T05:57:33.673Z"
}
```

**Server log:**

```
[INFO] Created transaction id=1df84ecf-... type=credit amount=100
```

**Result:** `PASSED` (201 Created)

---

### 3.5 POST /transactions — debit

**Command:**

```bash
curl -X POST 'http://localhost:3000/transactions' \
  -H 'Content-Type: application/json' \
  -d '{"amount":25,"type":"debit"}'
```

**Captured response:**

```json
{
  "id": "12790bdc-488d-4957-85b3-07fac04eb546",
  "amount": 25,
  "type": "debit",
  "timestamp": "2026-06-22T05:57:33.686Z"
}
```

**Server log:**

```
[INFO] Created transaction id=12790bdc-... type=debit amount=25
```

**Result:** `PASSED` (201 Created)

---

### 3.6 GET /transactions

**Command:**

```bash
curl -s http://localhost:3000/transactions
```

**Captured response:**

```json
[
  {
    "id": "1df84ecf-3843-45d8-8372-803694e6c5b4",
    "amount": 100,
    "type": "credit",
    "timestamp": "2026-06-22T05:57:33.673Z"
  },
  {
    "id": "12790bdc-488d-4957-85b3-07fac04eb546",
    "amount": 25,
    "type": "debit",
    "timestamp": "2026-06-22T05:57:33.686Z"
  }
]
```

**Server log:**

```
[INFO] Listed 2 transaction(s)
```

**Result:** `PASSED`

---

### 3.7 GET /balance

**Command:**

```bash
curl -s http://localhost:3000/balance
```

**Captured response:**

```json
{
  "balance": 75,
  "transaction_count": 2
}
```

**Balance check:** credit 100 − debit 25 = **75**

**Server log:**

```
[INFO] Balance requested: balance=75 count=2
```

**Result:** `PASSED`

---

## 4. Swagger UI Tests (port 3000)

Open **http://localhost:3000/docs** — title should be **Transaction API — Swagger UI**.

| Test | Method | URL | Expected |
| ---- | ------ | --- | -------- |
| Health | `GET` | `/health` | `{"status":"ok"}` |
| Root | `GET` | `/` | `"service":"Transaction API"` |
| Create credit | `POST` | `/transactions` | 201 + `id` |
| Create debit | `POST` | `/transactions` | 201 + `id` |
| List | `GET` | `/transactions` | JSON array |
| Balance | `GET` | `/balance` | `balance` = credits − debits |

**OpenAPI JSON:** http://localhost:3000/api-docs

---

## 5. All curl commands (copy-paste)

Run **one command per line**. Always use **`localhost`**, not `127.0.0.1`.

```bash
curl -s http://localhost:3000/ | grep -o '"service":"[^"]*"'

curl -s http://localhost:3000/health

curl -s http://localhost:3000/

curl -X POST 'http://localhost:3000/transactions' -H 'Content-Type: application/json' -d '{"amount":100,"type":"credit"}'

curl -X POST 'http://localhost:3000/transactions' -H 'Content-Type: application/json' -d '{"amount":25,"type":"debit"}'

curl -s http://localhost:3000/transactions

curl -s http://localhost:3000/balance

curl -X POST 'http://localhost:3000/transactions' -H 'Content-Type: application/json' -d '{"amount":-10,"type":"credit"}'
```

---

## 6. Quick Reference — B4 vs B5 vs I4

| Service | Stack | URL for manual tests | Main endpoint |
| ------- | ----- | -------------------- | ------------- |
| **B5** Transaction API | Express | `http://localhost:3000` | `POST /transactions` |
| **B4** Transaction API | FastAPI | `http://127.0.0.1:8001` | `POST /transactions` |
| **I4** Currency Conversion | FastAPI | `http://localhost:8000` | `POST /convert` |

---

## 7. Known issues / tips

| Issue | Resolution |
| ----- | ---------- |
| `curl 127.0.0.1:3000` returns HTML `/login` | Use **`localhost:3000`** — SSH may own IPv4 port 3000 |
| `grep` returns empty on `127.0.0.1` | Response is HTML, not JSON — switch to `localhost` |
| Port 3000 busy | `PORT=3001 npm start` then use `localhost:3001` |
| `[ERROR] GET /fail: boom` in test output | Expected — from `errorHandler.test.js`, not a failure |

---

## 8. Testing checklist

| Step | Command / action | Pass criteria |
| ---- | ---------------- | ------------- |
| 1 | `npm test` | 18/18 passed |
| 2 | `npm start` | Server listening on 3000 |
| 3 | `curl localhost:3000/` | `"Transaction API"` |
| 4 | POST credit 100 | 201 + `id` |
| 5 | POST debit 25 | 201 + `id` |
| 6 | GET `/balance` | `{"balance":75,"transaction_count":2}` |
| 7 | Swagger `/docs` | Transaction API UI loads |
