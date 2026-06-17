# Fraud Scoring System (A3)

Polyglot distributed fraud scoring demo — **FastAPI** ingests transactions, **Node.js** processes them asynchronously, and a **Rust** engine computes `LOW` / `MEDIUM` / `HIGH` risk scores.

## Project structure

```
A3_Fraud_Score_system/
├── contracts/              # JSON schemas (data contracts)
├── docs/architecture.md    # Diagrams, sequence flow, contracts
├── engines/rust/           # Rust scoring HTTP service
├── services/fastapi/       # Transaction API
├── workers/node/           # Async queue worker
├── tests/integration/      # End-to-end test
└── scripts/run-all.sh      # Start all services + e2e
```

## Prerequisites

| Tool | Version |
| ---- | ------- |
| Python | 3.9+ |
| Node.js | 22+ (`node:sqlite` built-in) |
| Rust | 1.70+ (cargo) |

## Run order

Start components **in this order** (three terminals):

### 1. Rust engine (port 3001)

```bash
cd engines/rust
cargo run --release
```

### 2. Node worker

```bash
cd workers/node
npm start
```

### 3. FastAPI (port 8000)

```bash
cd services/fastapi
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### 4. Submit a transaction

```bash
curl -s -X POST http://127.0.0.1:8000/transactions \
  -H 'Content-Type: application/json' \
  -d '{"user_id":"u1","merchant_id":"MERCH-1","amount":15000,"currency":"USD"}' | jq

# Poll result (replace {id})
curl -s http://127.0.0.1:8000/transactions/{id} | jq
```

Expected: `status` moves `PENDING` → `COMPLETED` with `risk_score: "HIGH"` for amount 15,000.

## One-command demo

```bash
chmod +x scripts/run-all.sh
./scripts/run-all.sh
```

## Testing

```bash
# Unified gate (recommended)
make verify

# Or per component:
cd engines/rust && cargo test

# FastAPI
cd services/fastapi
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
pytest -q

# Node
cd workers/node && npm test

# Integration (requires all services running, or use scripts/run-all.sh)
python3 tests/integration/test_e2e.py
```

## Configuration

| Variable | Default | Description |
| -------- | ------- | ----------- |
| `FRAUD_DB_PATH` | `data/fraud.db` | Shared SQLite database |
| `RUST_ENGINE_PORT` | `3001` | Rust HTTP port |
| `RUST_ENGINE_URL` | `http://127.0.0.1:3001` | Worker → Rust URL |
| `POLL_INTERVAL_MS` | `500` | Worker poll interval |

## Architecture

See [docs/architecture.md](docs/architecture.md) for component diagram, sequence diagram, and JSON contracts.

## API

| Method | Path | Description |
| ------ | ---- | ----------- |
| `POST` | `/transactions` | Create transaction + enqueue processing |
| `GET` | `/transactions/{id}` | Fetch transaction and score |
| `GET` | `/health` | Health check |

Rust engine:

| Method | Path | Description |
| ------ | ---- | ----------- |
| `POST` | `/score` | Compute risk score |
| `GET` | `/health` | Health check |
