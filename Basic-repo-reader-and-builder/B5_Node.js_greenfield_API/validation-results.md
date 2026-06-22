# Validation Results

> **Project:** `Basic-repo-reader-and-builder/B5_Node.js_greenfield_API`
> **Generated:** 2026-06-22
> **Method:** Executed npm install, npm test, npm start + curl.
> **Local test guide:** [local-testing.md](./local-testing.md)

---

## npm install

**Command:**

```bash
cd Basic-repo-reader-and-builder/B5_Node.js_greenfield_API
npm install
```

**Exit Code:** `0`

**Last run:** 2026-06-22 · rohitverma · PMLMBT4677

**Output (summary):**

```
up to date, audited 394 packages in 1s
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
Test Suites: 10 passed, 10 total
Tests:       18 passed, 18 total
Time:        1.892 s
```

**Core integration tests:**

- POST /transactions creates a transaction — PASSED
- GET /transactions returns all transactions — PASSED
- GET /balance returns credits minus debits — PASSED
- POST /transactions rejects invalid amount — PASSED

**Result:** `PASSED`

---

## Manual curl (2026-06-22 session)

| Field | Value |
| ----- | ----- |
| Base URL | `http://localhost:3000` |
| Verified | 2026-06-22 · rohitverma · PMLMBT4677 |
| Full details | [local-testing.md §3](./local-testing.md#3-curl-session-capture-2026-06-22) |

> Use **`localhost`**, not `127.0.0.1` — SSH tunnel on IPv4 port 3000 returns HTML `/login`.

### Service identity

| URL | Result |
| --- | ------ |
| `http://127.0.0.1:3000/` | HTML redirect (wrong target) |
| `http://localhost:3000/` | `"service":"Transaction API"` |

**Result:** `PASSED` (via localhost)

### Happy path

| Request | Captured response | Result |
| ------- | ----------------- | ------ |
| `GET /health` | `{"status":"ok"}` | ✅ PASSED |
| `POST credit 100` | 201 + `id` `1df84ecf-...` | ✅ PASSED |
| `POST debit 25` | 201 + `id` `12790bdc-...` | ✅ PASSED |
| `GET /transactions` | 2 transactions | ✅ PASSED |
| `GET /balance` | `{"balance":75,"transaction_count":2}` | ✅ PASSED |

> Balance: 100 − 25 = **75**

**Result:** `PASSED`

---

## npm start (2026-06-17 reference run)

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

```json
{"id":"34b9beb3-e2df-4c23-adf6-9d5972126f9b","amount":100,"type":"credit","timestamp":"2026-06-17T03:17:31.308Z"}
{"id":"84c57c7b-1081-409c-b462-9df54f58d808","amount":25,"type":"debit","timestamp":"2026-06-17T03:17:31.325Z"}
{"balance":75,"transaction_count":2}
```

**Result:** `PASSED`

---

## npm start (2026-06-22 session)

**Command:**

```bash
npm start
```

**Server output:**

```
[INFO] Transaction service listening on http://127.0.0.1:3000
[INFO] Created transaction id=1df84ecf-... type=credit amount=100
[INFO] Created transaction id=12790bdc-... type=debit amount=25
[INFO] Listed 2 transaction(s)
[INFO] Balance requested: balance=75 count=2
```

**Result:** `PASSED`

---

## Summary

| Check | Result |
| ----- | ------ |
| npm install | ✅ PASSED |
| npm test (18 tests, 10 suites) | ✅ PASSED |
| Manual curl — localhost:3000 (2026-06-22) | ✅ PASSED |
| npm start + curl (2026-06-17, port 3001) | ✅ PASSED |
