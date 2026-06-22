# B5 — Node.js Transaction API

> **Evaluation-grade greenfield deliverable.** Express transaction management API with validation middleware, in-memory storage, Jest tests, Swagger UI, and verified local test evidence.

Build and run a **transaction ledger API** (same contract as B4) using **Express** and **Node.js**.

```bash
/nodejs-builder
```

| | |
| --- | --- |
| **Project** | B5 — Node.js Greenfield API |
| **Agent** | [`agent.md`](agent.md) · slash command `/nodejs-builder` |
| **Cursor skill** | `.cursor/skills/nodejs-builder/SKILL.md` |
| **Location** | `Basic-repo-reader-and-builder/B5_Node.js_greenfield_API` |
| **Local URL** | `http://localhost:3000` (use `localhost`, not `127.0.0.1`) |
| **Swagger UI** | [http://localhost:3000/docs](http://localhost:3000/docs) |
| **Last verified** | 2026-06-22 · Jest 18/18 + curl on `localhost:3000` |

---

## Executive Summary (Latest Run)

| Metric | Result |
| ------ | ------ |
| **Stack** | Express 4 · Jest · Supertest · Swagger UI |
| **Automated tests** | **18 passed** (10 suites) |
| **Live API** | Verified on `localhost:3000` |
| **Service identity** | `"Transaction API"` |
| **Endpoints** | `POST /transactions`, `GET /transactions`, `GET /balance` |

```
┌──────────────────────────────────────────────────────────────┐
│  B5 TRANSACTION API — local run (localhost:3000)             │
├──────────────────────────────────────────────────────────────┤
│  npm test                    18/18 passed                    │
│  GET /health                 {"status":"ok"}                   │
│  POST credit 100             201 Created                     │
│  POST debit 25               201 Created                     │
│  GET /balance                balance = 75 (100 − 25)         │
└──────────────────────────────────────────────────────────────┘
```

---

## Endpoints

| Method | Route | Description |
| ------ | ----- | ----------- |
| POST | `/transactions` | Create a transaction |
| GET | `/transactions` | List all transactions |
| GET | `/balance` | Current balance (credits − debits) |
| GET | `/health` | Liveness check |
| GET | `/` | Service metadata |
| GET | `/docs` | Swagger UI |
| GET | `/api-docs` | OpenAPI JSON |

### Transaction schema

```json
{
  "id": "uuid",
  "amount": 100,
  "type": "credit",
  "timestamp": "2026-06-22T05:57:33.673Z"
}
```

`id` and `timestamp` are auto-generated on create.

---

## Project layout

```
B5_Node.js_greenfield_API/
├── README.md              ← you are here
├── STATUS.md                ← project status & running checks
├── agent.md                 ← NodeJS Builder Agent spec
├── local-testing.md         ← Jest + curl test guide & captured results
├── validation-results.md    ← executed test evidence
├── src/
│   ├── index.js             # Server entry
│   ├── app.js               # Express app factory
│   ├── controllers/
│   ├── routes/
│   ├── services/
│   ├── middleware/
│   └── config/swagger.js
├── tests/
└── package.json
```

---

## Quick start

### Setup

```bash
cd "Basic-repo-reader-and-builder/B5_Node.js_greenfield_API"
npm install
```

### Run tests

```bash
npm test
```

**Expected:** `18 passed`, `10` test suites

### Run server

```bash
npm start
```

> **Use `localhost:3000` for curl and browser** — `127.0.0.1:3000` may hit an SSH tunnel on IPv4 and return HTML instead of JSON. See [local-testing.md](./local-testing.md#3-curl-session-capture-2026-06-22).

**Port conflict:**

```bash
PORT=3001 npm start
```

### Quick curl test

```bash
curl -s http://localhost:3000/ | grep -o '"service":"[^"]*"'

curl -X POST 'http://localhost:3000/transactions' \
  -H 'Content-Type: application/json' \
  -d '{"amount":100,"type":"credit"}'

curl -s http://localhost:3000/balance
```

---

## Verification

| Method | Doc | What it covers |
| ------ | --- | -------------- |
| Project status | [STATUS.md](./STATUS.md) | Running status, health checks, IPv4 caveat |
| Automated tests | [validation-results.md](./validation-results.md#npm-test) | `npm test` (18 tests) |
| Manual curl | [local-testing.md](./local-testing.md#3-curl-session-capture-2026-06-22) | Live API on `localhost:3000` |
| Full test guide | [local-testing.md](./local-testing.md) | Setup, Swagger, curl commands |

---

## B4 vs B5 vs I4

| | **B5** | **B4** | **I4** |
| --- | --- | --- | --- |
| Stack | Express (Node) | FastAPI (Python) | FastAPI + Node CLI |
| API | Transaction ledger | Transaction ledger | Currency convert |
| Manual test URL | `localhost:3000` | `127.0.0.1:8001` | `localhost:8000` |

---

## Invoke the agent

```
/nodejs-builder — run npm test and update validation-results.md
```

Full agent spec: [agent.md](./agent.md)

---

## Agent catalog

Registered as **B5 — Node.js Greenfield API** in [docs/agent-catalog.md](../../docs/agent-catalog.md).
