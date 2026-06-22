# 💻 Runnable Projects

Install, test, and run every **runnable demo** in this repository — APIs, CLIs, polyglot systems, and the Agent Catalog.

| | |
| --- | --- |
| **Last updated** | June 22, 2026 |
| **Runnable count** | 6 projects (5 agents + catalog) |
| **Docs hub** | [docs/README.md](./README.md) |
| **Project status** | [project-status.md](./project-status.md) |

---

## 🌐 Live links

| Resource | URL | Notes |
| -------- | --- | ----- |
| **Agent Catalog (deployed)** | **[https://agent-catalog.vercel.app](https://agent-catalog.vercel.app)** | Browse all 24 agents — no install required |
| Agent Catalog (local) | [http://localhost:3000](http://localhost:3000) | `cd agent-catalog && npm run dev` |

> All API and CLI demos below are **local-only** — start the service first, then open the link.

| Project | Local URL | Identity check |
| ------- | --------- | -------------- |
| 💻 **B4** FastAPI | [Swagger :8001](http://127.0.0.1:8001/docs) | `"Transaction API"` |
| 💻 **B5** Node.js | [Swagger :3000](http://localhost:3000/docs) | `"Transaction API"` |
| 💻 **I4** Currency API | [Swagger :8000](http://127.0.0.1:8000/docs) | `"Currency Conversion API"` |
| 💻 **A3** Fraud API | [Swagger :8000](http://127.0.0.1:8000/docs) | `GET /health` |
| 💻 **A3** Rust engine | [Health :3001](http://127.0.0.1:3001/health) | Engine liveness |
| 💻 **B6** Rust CLI | — | `cargo run -- sample.log` |

---

## 📋 Overview

| Project | Agent | Command | Stack | Port | Tests | Guide |
| ------- | ----- | ------- | ----- | ---- | ----- | ----- |
| [B4 FastAPI](#-b4--fastapi-transaction-api) | B4 | `/fastapi-builder` | Python · FastAPI | **8001** | 🧪 pytest 5/5 | [local-testing](../Basic-repo-reader-and-builder/B4_FastAPI_greenfield_service/local-testing.md) |
| [B5 Node.js](#-b5--nodejs-transaction-api) | B5 | `/nodejs-builder` | Node.js · Express | **3000** | 🧪 Jest 18/18 | [local-testing](../Basic-repo-reader-and-builder/B5_Node.js_greenfield_API/local-testing.md) |
| [B6 Rust CLI](#-b6--rust-log-analyzer) | B6 | `/rust-log-analyzer` | Rust · cargo | — | 🧪 cargo 6/6 | [local-testing](../Basic-repo-reader-and-builder/B6_Rust_greenfield/local-testing.md) |
| [I4 Polyglot](#-i4--polyglot-service-pair) | I4 | `/polyglot-service-pair` | FastAPI + Node CLI | **8000** | 🧪 pytest 9/9 | [local-testing](../Intermediate-repo%20operator%20and%20polyglot%20builder/I4/local-testing.md) |
| [A3 Fraud System](#-a3--fraud-scoring-system) | A3 | `/fraud-score-system` | FastAPI + Node + Rust | **8000**, **3001** | 🧪 `make verify` | [README](../Advanced-parallel%20agent%20operator%20and%20system%20builder/A3_Fraud_Score_system/README.md) |
| [Agent Catalog](#-agent-catalog-web-app) | — | — | Next.js | **3000** | — | [agent-catalog/](../agent-catalog/) |

> **Port conflicts:** I4 uses **8000**. Run B4 on **8001** when I4 is active. B5 uses **`localhost:3000`** (not `127.0.0.1`) if SSH occupies IPv4 port 3000.

---

## 🟢 B4 — FastAPI Transaction API

| | |
| --- | --- |
| **Path** | `Basic-repo-reader-and-builder/B4_FastAPI_greenfield_service/` |
| **Agent** | B4 · `/fastapi-builder` |
| **Status** | 🟢 Verified · 2026-06-22 |
| **Docs** | [README](../Basic-repo-reader-and-builder/B4_FastAPI_greenfield_service/README.md) · [STATUS](../Basic-repo-reader-and-builder/B4_FastAPI_greenfield_service/STATUS.md) · [local-testing](../Basic-repo-reader-and-builder/B4_FastAPI_greenfield_service/local-testing.md) |
| **Swagger** | [http://127.0.0.1:8001/docs](http://127.0.0.1:8001/docs) |

### Endpoints

| Method | Path | Description |
| ------ | ---- | ----------- |
| POST | `/transactions` | Create a transaction |
| GET | `/transactions` | List all transactions |
| GET | `/balance` | Current balance |
| GET | `/health` | Health check |

### Setup & run

```bash
cd "Basic-repo-reader-and-builder/B4_FastAPI_greenfield_service"

python3 -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate
pip install -r requirements.txt

pytest -v                          # 🧪 5/5 expected

# Use 8001 when I4 is on 8000
uvicorn app.main:app --reload --host 127.0.0.1 --port 8001
```

### Quick test

```bash
curl -s http://127.0.0.1:8001/ | grep -o '"service":"[^"]*"'
# "service":"Transaction API"

curl -X POST 'http://127.0.0.1:8001/transactions' \
  -H 'Content-Type: application/json' \
  -d '{"amount":100,"type":"credit"}'

curl -s http://127.0.0.1:8001/balance
```

---

## 🟢 B5 — Node.js Transaction API

| | |
| --- | --- |
| **Path** | `Basic-repo-reader-and-builder/B5_Node.js_greenfield_API/` |
| **Agent** | B5 · `/nodejs-builder` |
| **Status** | 🟢 Verified · 2026-06-22 |
| **Docs** | [README](../Basic-repo-reader-and-builder/B5_Node.js_greenfield_API/README.md) · [STATUS](../Basic-repo-reader-and-builder/B5_Node.js_greenfield_API/STATUS.md) · [local-testing](../Basic-repo-reader-and-builder/B5_Node.js_greenfield_API/local-testing.md) |
| **Swagger** | [http://localhost:3000/docs](http://localhost:3000/docs) |

> ⚠️ Use **`localhost:3000`**, not `127.0.0.1:3000` — an SSH tunnel may occupy IPv4 port 3000.

### Endpoints

Same as B4: `POST /transactions`, `GET /transactions`, `GET /balance`, `GET /health`.

### Setup & run

```bash
cd "Basic-repo-reader-and-builder/B5_Node.js_greenfield_API"

npm install
npm test                           # 🧪 18/18 expected
npm start
```

### Quick test

```bash
curl -s http://localhost:3000/ | grep -o '"service":"[^"]*"'
# "service":"Transaction API"

curl -X POST 'http://localhost:3000/transactions' \
  -H 'Content-Type: application/json' \
  -d '{"amount":100,"type":"credit"}'

curl -s http://localhost:3000/balance
```

---

## 🟢 B6 — Rust Log Analyzer

| | |
| --- | --- |
| **Path** | `Basic-repo-reader-and-builder/B6_Rust_greenfield/` |
| **Agent** | B6 · `/rust-log-analyzer` |
| **Status** | 🟢 Verified · 2026-06-22 |
| **Docs** | [README](../Basic-repo-reader-and-builder/B6_Rust_greenfield/README.md) · [STATUS](../Basic-repo-reader-and-builder/B6_Rust_greenfield/STATUS.md) · [local-testing](../Basic-repo-reader-and-builder/B6_Rust_greenfield/local-testing.md) |
| **Type** | CLI — no server port |

CLI tool that counts `INFO`, `WARN`, and `ERROR` lines in a log file.

### Setup & run

```bash
cd "Basic-repo-reader-and-builder/B6_Rust_greenfield"

cargo build
cargo test                         # 🧪 6/6 expected
cargo run -- sample.log
```

**Expected output (sample.log):**

```
INFO:  4
WARN:  2
ERROR: 2
Total lines: 8
```

### Usage

```bash
cargo run -- path/to/your.log
```

---

## 🟢 I4 — Polyglot Service Pair

| | |
| --- | --- |
| **Path** | `Intermediate-repo operator and polyglot builder/I4/` |
| **Agent** | I4 · `/polyglot-service-pair` |
| **Status** | 🟢 Verified · 2026-06-22 |
| **Docs** | [README](../Intermediate-repo%20operator%20and%20polyglot%20builder/I4/README.md) · [STATUS](../Intermediate-repo%20operator%20and%20polyglot%20builder/I4/STATUS.md) · [local-testing](../Intermediate-repo%20operator%20and%20polyglot%20builder/I4/local-testing.md) |
| **Swagger** | [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs) |

Currency conversion demo: **FastAPI service** + **Node CLI client**.

### FastAPI service

```bash
cd "Intermediate-repo operator and polyglot builder/I4/services/fastapi"

python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
pytest -v                          # 🧪 9/9 expected
uvicorn app.main:app --reload --port 8000
```

### Node CLI client

```bash
cd "Intermediate-repo operator and polyglot builder/I4/clients/node-cli"

npm install
node index.js --from USD --to EUR --amount 100
```

### Quick API test

```bash
curl -s http://127.0.0.1:8000/ | grep -o '"service":"[^"]*"'
# "service":"Currency Conversion API"

curl -s -X POST http://127.0.0.1:8000/convert \
  -H 'Content-Type: application/json' \
  -d '{"from_currency":"USD","to_currency":"INR","amount":100}'
```

See [I4 local-testing](../Intermediate-repo%20operator%20and%20polyglot%20builder/I4/local-testing.md) for full curl session and Swagger sample inputs.

---

## 🟢 A3 — Fraud Scoring System

| | |
| --- | --- |
| **Path** | `Advanced-parallel agent operator and system builder/A3_Fraud_Score_system/` |
| **Agent** | A3 · `/fraud-score-system` |
| **Status** | 🟢 Verified · 2026-06-17 |
| **Docs** | [README](../Advanced-parallel%20agent%20operator%20and%20system%20builder/A3_Fraud_Score_system/README.md) · [local-testing](../Advanced-parallel%20agent%20operator%20and%20system%20builder/A3_Fraud_Score_system/docs/local-testing.md) |
| **API** | [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs) · [health](http://127.0.0.1:8000/health) |
| **Engine** | [http://127.0.0.1:3001/health](http://127.0.0.1:3001/health) |

Three-component polyglot system:

| Component | Tech | Port | Role |
| --------- | ---- | ---- | ---- |
| Rust engine | Risk scoring | 3001 | `LOW` / `MEDIUM` / `HIGH` |
| Node worker | Async queue | — | SQLite outbox processor |
| FastAPI API | Transaction ingestion | 8000 | REST API |

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
cd engines/rust && cargo run --release
```

**Terminal 2 — Node worker**

```bash
cd workers/node && npm start
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
make verify                        # 🧪 full integration suite
```

---

## 🌐 Agent Catalog Web App

| | |
| --- | --- |
| **Path** | `agent-catalog/` |
| **Live (deployed)** | **[https://agent-catalog.vercel.app](https://agent-catalog.vercel.app)** |
| **Local** | [http://localhost:3000](http://localhost:3000) |
| **Docs** | [README](../agent-catalog/README.md) |

Next.js UI to browse all agents, descriptions, and slash commands. Agent data auto-regenerates from `**/agent.md` on `npm run dev` and `npm run build`.

### Setup & run (local)

```bash
cd agent-catalog
npm install
npm run dev
```

### Production build

```bash
npm run build
npm start
```

---

## 🧪 Validation evidence

Builder agents capture test and run output in **`validation-results.md`** and **`local-testing.md`**. Compare your terminal output with those files to confirm everything passes.

| Project | Tests | Verified | Evidence |
| ------- | ----- | -------- | -------- |
| **B4** | 🧪 pytest 5/5 | 2026-06-22 ✅ | [validation-results](../Basic-repo-reader-and-builder/B4_FastAPI_greenfield_service/validation-results.md) · [local-testing](../Basic-repo-reader-and-builder/B4_FastAPI_greenfield_service/local-testing.md) · [STATUS](../Basic-repo-reader-and-builder/B4_FastAPI_greenfield_service/STATUS.md) |
| **B5** | 🧪 Jest 18/18 | 2026-06-22 ✅ | [validation-results](../Basic-repo-reader-and-builder/B5_Node.js_greenfield_API/validation-results.md) · [local-testing](../Basic-repo-reader-and-builder/B5_Node.js_greenfield_API/local-testing.md) · [STATUS](../Basic-repo-reader-and-builder/B5_Node.js_greenfield_API/STATUS.md) |
| **B6** | 🧪 cargo 6/6 | 2026-06-22 ✅ | [validation-results](../Basic-repo-reader-and-builder/B6_Rust_greenfield/validation-results.md) · [local-testing](../Basic-repo-reader-and-builder/B6_Rust_greenfield/local-testing.md) · [STATUS](../Basic-repo-reader-and-builder/B6_Rust_greenfield/STATUS.md) |
| **I4** | 🧪 pytest 9/9 + CLI | 2026-06-22 ✅ | [validation-results](../Intermediate-repo%20operator%20and%20polyglot%20builder/I4/validation-results.md) · [local-testing](../Intermediate-repo%20operator%20and%20polyglot%20builder/I4/local-testing.md) · [STATUS](../Intermediate-repo%20operator%20and%20polyglot%20builder/I4/STATUS.md) |
| **A3** | 🧪 `make verify` | 2026-06-17 ✅ | [validation-results](../Advanced-parallel%20agent%20operator%20and%20system%20builder/A3_Fraud_Score_system/validation-results.md) · [local-testing](../Advanced-parallel%20agent%20operator%20and%20system%20builder/A3_Fraud_Score_system/docs/local-testing.md) |

---

## ⚠️ Common issues

| Issue | Fix |
| ----- | --- |
| `uvicorn: command not found` | Activate the Python venv first |
| Port already in use | B4 on **8001** if I4 uses 8000; B5: `PORT=3001 npm start` |
| B5 curl returns HTML `/login` | Use **`localhost:3000`**, not `127.0.0.1:3000` (SSH may own IPv4 port 3000) |
| `cargo: command not found` | Install Rust via [rustup.rs](https://rustup.rs) |
| Node worker fails on A3 | Start Rust engine **before** the Node worker |
| Agent catalog empty | Run `npm run generate` in `agent-catalog/` |
| Wrong API identity on curl | B4/B5 → `"Transaction API"` · I4 → `"Currency Conversion API"` |

---

## 🔗 Related docs

| Document | Purpose |
| -------- | ------- |
| [docs/README.md](./README.md) | Documentation hub — all projects & live links |
| [project-status.md](./project-status.md) | Full assignment tracker (24/24 ✅) |
| [getting-started.md](./getting-started.md) | How to invoke agents in Cursor |
| [agent-catalog.md](./agent-catalog.md) | Full agent reference |
| [complete-setup.md](./complete-setup.md) | Cursor skills + CLI + frontend sync |

---

*Last verified: June 22, 2026. For the full project index, see [docs/README.md](./README.md).*
