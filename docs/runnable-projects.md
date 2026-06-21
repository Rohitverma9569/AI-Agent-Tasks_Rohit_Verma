# Runnable Projects

Several agents produce **runnable code**, not just reports. This guide covers how to install dependencies, run tests, and start each demo locally.

---

## Overview

| Project | Built by | Stack | Port |
| ------- | -------- | ----- | ---- |
| [B4 FastAPI API](#b4--fastapi-transaction-api) | B4 `/fastapi-builder` | Python, FastAPI | 8000 |
| [B5 Node.js API](#b5--nodejs-transaction-api) | B5 `/nodejs-builder` | Node.js, Express | 3000 |
| [B6 Rust CLI](#b6--rust-log-analyzer) | B6 `/rust-log-analyzer` | Rust CLI | — |
| [I4 Polyglot Pair](#i4--polyglot-service-pair) | I4 `/polyglot-service-pair` | FastAPI + Node CLI | 8000 |
| [A3 Fraud System](#a3--fraud-scoring-system) | A3 agent | FastAPI + Node + Rust | 8000, 3001 |
| [Agent Catalog](#agent-catalog-web-app) | — | Next.js | 3000 |

---

## B4 — FastAPI Transaction API

**Path:** `Basic-repo-reader-and-builder/B4_FastAPI_greenfield_service/`

### Endpoints

| Method | Path | Description |
| ------ | ---- | ----------- |
| POST | `/transactions` | Create a transaction |
| GET | `/transactions` | List all transactions |
| GET | `/balance` | Current balance |

### Setup & run

```bash
cd "Basic-repo-reader-and-builder/B4_FastAPI_greenfield_service"

python3 -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate
pip install -r requirements.txt

# Run tests
pytest -v

# Start server
uvicorn app.main:app --reload
```

Open API docs: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

### Quick test

```bash
curl -X POST http://127.0.0.1:8000/transactions \
  -H 'Content-Type: application/json' \
  -d '{"id":"tx-1","amount":100.0,"type":"credit","timestamp":"2026-06-17T12:00:00Z"}'

curl http://127.0.0.1:8000/balance
```

---

## B5 — Node.js Transaction API

**Path:** `Basic-repo-reader-and-builder/B5_Node.js_greenfield_API/`

### Endpoints

Same as B4: `POST /transactions`, `GET /transactions`, `GET /balance`.

### Setup & run

```bash
cd "Basic-repo-reader-and-builder/B5_Node.js_greenfield_API"

npm install
npm test
npm start
```

Server runs on [http://localhost:3000](http://localhost:3000) (check `package.json` for the exact port).

### Quick test

```bash
curl -X POST http://localhost:3000/transactions \
  -H 'Content-Type: application/json' \
  -d '{"id":"tx-1","amount":50,"type":"debit","timestamp":"2026-06-17T12:00:00Z"}'
```

---

## B6 — Rust Log Analyzer

**Path:** `Basic-repo-reader-and-builder/B6_Rust_greenfield/`

CLI tool that counts `INFO`, `WARN`, and `ERROR` lines in a log file.

### Setup & run

```bash
cd "Basic-repo-reader-and-builder/B6_Rust_greenfield"

cargo test
cargo run -- sample.log
```

### Usage

```bash
cargo run -- path/to/your.log
```

---

## I4 — Polyglot Service Pair

**Path:** `Intermediate-repo operator and polyglot builder/I4/`

Currency conversion demo: **FastAPI service** + **Node CLI client**.

### FastAPI service

```bash
cd "Intermediate-repo operator and polyglot builder/I4/services/fastapi"

python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
pytest -v
uvicorn app.main:app --reload --port 8000
```

### Node CLI client

```bash
cd "Intermediate-repo operator and polyglot builder/I4/clients/node-cli"

npm install
node index.js --from USD --to EUR --amount 100
```

See `I4/clients/node-cli/README.md` for full CLI options.

---

## A3 — Fraud Scoring System

**Path:** `Advanced-parallel agent operator and system builder/A3_Fraud_Score_system/`

Three-component polyglot system:

| Component | Tech | Port |
| --------- | ---- | ---- |
| Rust engine | Risk scoring (`LOW` / `MEDIUM` / `HIGH`) | 3001 |
| Node worker | Async queue processor | — |
| FastAPI API | Transaction ingestion | 8000 |

### Prerequisites

| Tool | Version |
| ---- | ------- |
| Python | 3.9+ |
| Node.js | 22+ |
| Rust | 1.70+ |

### One-command demo (recommended)

```bash
cd "Advanced-parallel agent operator and system builder/A3_Fraud_Score_system"
chmod +x scripts/run-all.sh
./scripts/run-all.sh
```

### Manual start (three terminals)

**Terminal 1 — Rust engine**

```bash
cd engines/rust
cargo run --release
```

**Terminal 2 — Node worker**

```bash
cd workers/node
npm start
```

**Terminal 3 — FastAPI**

```bash
cd services/fastapi
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### Submit a transaction

```bash
curl -s -X POST http://127.0.0.1:8000/transactions \
  -H 'Content-Type: application/json' \
  -d '{"user_id":"u1","merchant_id":"MERCH-1","amount":15000,"currency":"USD"}' | jq

# Poll result (replace {id} with the returned id)
curl -s http://127.0.0.1:8000/transactions/{id} | jq
```

Expected: status moves `PENDING` → `COMPLETED` with `risk_score: "HIGH"` for amount 15,000.

### Run all tests

```bash
make verify
```

---

## Agent Catalog Web App

**Path:** `agent-catalog/`

Next.js UI to browse all agents, their descriptions, and slash commands.

### Setup & run

```bash
cd agent-catalog
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

The catalog auto-regenerates agent data on `npm run dev` and `npm run build` via `scripts/generate-agents.mjs`.

### Production build

```bash
npm run build
npm start
```

---

## Validation evidence

Builder agents capture test and run output in **`validation-results.md`** inside each project folder. After running tests locally, compare your terminal output with that file to confirm everything passes.

| Project | Evidence file |
| ------- | ------------- |
| B4 | `B4_FastAPI_greenfield_service/validation-results.md` |
| B5 | `B5_Node.js_greenfield_API/validation-results.md` |
| B6 | `B6_Rust_greenfield/validation-results.md` |
| I4 | `I4/validation-results.md` |
| A3 | `A3_Fraud_Score_system/validation-results.md` |

---

## Common issues

| Issue | Fix |
| ----- | --- |
| `uvicorn: command not found` | Activate the Python venv first |
| Port already in use | Change port: `uvicorn app.main:app --port 8001` |
| `cargo: command not found` | Install Rust via [rustup.rs](https://rustup.rs) |
| Node worker fails on A3 | Start Rust engine **before** the Node worker |
| Agent catalog empty | Run `npm run generate` in `agent-catalog/` |

---

## Back to agent docs

- [Getting Started](./getting-started.md) — How to invoke agents in Cursor
- [Agent Catalog](./agent-catalog.md) — Full agent reference
