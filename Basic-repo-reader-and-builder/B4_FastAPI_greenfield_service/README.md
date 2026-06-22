# B4 — FastAPI Transaction API

> **Evaluation-grade greenfield deliverable.** Production-quality FastAPI service with Pydantic validation, in-memory transaction storage, pytest suite, and verified local test evidence.

Build and run a **transaction ledger API** — create credits/debits, list transactions, and compute balance.

```bash
/fastapi-builder
```

| | |
| --- | --- |
| **Project** | B4 — FastAPI Greenfield Service |
| **Agent** | [`agent.md`](agent.md) · slash command `/fastapi-builder` |
| **Cursor skill** | `.cursor/skills/fastapi-builder/SKILL.md` |
| **Location** | `Basic-repo-reader-and-builder/B4_FastAPI_greenfield_service` |
| **Local port** | `8001` (use when I4 occupies `8000`) |
| **Swagger UI** | [http://127.0.0.1:8001/docs](http://127.0.0.1:8001/docs) |
| **Last verified** | 2026-06-22 · pytest 5/5 + curl on port 8001 |

---

## Executive Summary (Latest Run)

| Metric | Result |
| ------ | ------ |
| **Stack** | FastAPI · Pydantic v2 · uvicorn · pytest |
| **Automated tests** | **5 passed** |
| **Live API** | Verified on port **8001** |
| **Service identity** | `"Transaction API"` |
| **Endpoints** | `POST /transactions`, `GET /transactions`, `GET /balance` |

```
┌──────────────────────────────────────────────────────────────┐
│  B4 TRANSACTION API — local run (port 8001)                  │
├──────────────────────────────────────────────────────────────┤
│  pytest -v                   5/5 passed                      │
│  GET /health                 {"status":"ok"}                 │
│  POST credit 100             201 Created                     │
│  POST debit 50               201 Created                     │
│  GET /balance                balance = credits − debits        │
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

### Transaction schema

```json
{
  "id": "string",
  "amount": 100.0,
  "type": "credit",
  "timestamp": "2026-06-17T12:00:00Z"
}
```

`id` is auto-generated on create. `timestamp` defaults to UTC now if omitted.

---

## Project layout

```
B4_FastAPI_greenfield_service/
├── README.md              ← you are here
├── STATUS.md                ← project status & running checks
├── agent.md                 ← FastAPI Builder Agent spec
├── local-testing.md         ← pytest + curl test guide & captured results
├── validation-results.md    ← executed test evidence
├── app/
│   ├── main.py              # FastAPI app, logging, error handlers
│   ├── models.py            # Pydantic models
│   ├── routes.py            # API routes
│   └── storage.py           # In-memory store
├── tests/
│   ├── conftest.py
│   └── test_transactions.py
├── k8s/                     # optional Kubernetes manifests
├── Dockerfile
└── requirements.txt
```

---

## Quick start

### Setup

```bash
cd "Basic-repo-reader-and-builder/B4_FastAPI_greenfield_service"
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

### Run tests

```bash
pytest -v
```

**Expected:** `5 passed`

### Run server

```bash
uvicorn app.main:app --reload --host 127.0.0.1 --port 8001
```

> Use port **8001** when **I4** (Currency Conversion API) runs on **8000**. Confirm B4 with:
> `curl -s http://127.0.0.1:8001/ | grep service` → `"Transaction API"`

### Quick curl test

```bash
curl -X POST 'http://127.0.0.1:8001/transactions' \
  -H 'Content-Type: application/json' \
  -d '{"amount":100,"type":"credit"}'

curl -s http://127.0.0.1:8001/balance
```

---

## Verification

| Method | Doc | What it covers |
| ------ | --- | -------------- |
| Project status | [STATUS.md](./STATUS.md) | Running status, health checks, start/stop |
| Automated tests | [validation-results.md](./validation-results.md#pytest) | `pytest -v` (5 tests) |
| Manual curl | [local-testing.md](./local-testing.md#3-curl-session-capture-2026-06-22) | Live API on port 8001 |
| Full test guide | [local-testing.md](./local-testing.md) | Setup, Swagger, curl commands |
| Kubernetes | [k8s/README.md](./k8s/README.md) | kind cluster deploy |

---

## B4 vs I4 (same machine)

| | **B4** | **I4** |
| --- | --- | --- |
| Service | Transaction API | Currency Conversion API |
| Main endpoint | `POST /transactions` | `POST /convert` |
| Suggested port | `8001` | `8000` |

---

## Invoke the agent

```
/fastapi-builder — run pytest and update validation-results.md
```

```
/fastapi-builder add pagination to GET /transactions
```

Full agent spec: [agent.md](./agent.md)

---

## Related projects

| Project | Relationship |
| ------- | ------------ |
| [B5 — Node.js API](../B5_Node.js_greenfield_API/agent.md) | Same transaction API, Express stack |
| [I4 — Polyglot Pair](../../Intermediate-repo%20operator%20and%20polyglot%20builder/I4/README.md) | Different API on port 8000 — do not confuse |
| [I5 — Dockerization](../../Intermediate-repo%20operator%20and%20polyglot%20builder/I5_Polyglot_service_pair/agent.md) | Containerize this service |

---

## Agent catalog

Registered as **B4 — FastAPI Greenfield Service** in [docs/agent-catalog.md](../../docs/agent-catalog.md).
