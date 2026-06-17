# Validation Results

> **Project:** `repo-reader-and-builder/B5`
> **Generated:** 2026-06-17
> **Method:** Executed npm install, npm test, and npm start + curl.

---

## npm install

**Command:**

```bash
cd repo-reader-and-builder/B5
npm install
```

**Exit Code:** `0`

**Output (summary):**

```
added 356 packages, and audited 357 packages in 30s
```

---

## npm test

**Command:**

```bash
npm test
```

**Exit Code:** `0`

**Output (summary):**

```
Test Suites: 9 passed, 9 total
Tests:       16 passed, 16 total
Time:        1.3 s
```

**Core integration tests:**

- POST /transactions creates a transaction — PASSED
- GET /transactions returns all transactions — PASSED
- GET /balance returns credits minus debits — PASSED
- POST /transactions rejects invalid amount — PASSED

**Result:** `PASSED`

---

## npm start

**Command:**

```bash
PORT=3001 npm start
```

**Server output:**

```
> transaction-service@1.0.0 start
> node src/index.js

[INFO] Transaction service listening on http://127.0.0.1:3001
[INFO] Created transaction id=34b9beb3-... type=credit amount=100
[INFO] Created transaction id=84c57c7b-... type=debit amount=25
[INFO] Listed 2 transaction(s)
[INFO] Balance requested: balance=75 count=2
```

**Live API responses (curl):**

```bash
# POST credit
{"id":"34b9beb3-e2df-4c23-adf6-9d5972126f9b","amount":100,"type":"credit","timestamp":"2026-06-17T03:17:31.308Z"}

# POST debit
{"id":"84c57c7b-1081-409c-b462-9df54f58d808","amount":25,"type":"debit","timestamp":"2026-06-17T03:17:31.325Z"}

# GET /balance
{"balance":75,"transaction_count":2}
```

**Result:** `PASSED`
