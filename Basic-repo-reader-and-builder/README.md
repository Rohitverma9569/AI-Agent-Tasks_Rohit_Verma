# Basic Repo Reader & Builder

> **First skill track** in the [AI Agent Tasks](https://github.com/Rohitverma9569/AI-Agent-Tasks_Rohit_Verma) monorepo. Six Cursor agents that teach foundational repo reading (analysis reports) and greenfield building (runnable APIs and a CLI) across Python, Node.js, and Rust.

| | |
| --- | --- |
| **Agents** | **6** (B1–B6) — all complete |
| **Folder** | `Basic-repo-reader-and-builder/` |
| **Docs hub** | [`docs/README.md`](../docs/README.md) |
| **Assignment** | [Google Docs — Agent Tasks](https://docs.google.com/document/d/1VurgqAe_qZlMieK8pA4S2yJjWBd7cnoO8cuvh4zmNZs/edit) |
| **Catalog** | [agent-catalog.vercel.app](https://agent-catalog.vercel.app) |

---

## Table of Contents

1. [Learning Objectives](#1-learning-objectives)
2. [Content Categories](#2-content-categories)
3. [Task Overview](#3-task-overview)
4. [Suggested Learning Journey](#4-suggested-learning-journey)
5. [Repository Analysis Exercises (B1–B3)](#5-repository-analysis-exercises-b1b3)
6. [Reference Applications (B4–B6)](#6-reference-applications-b4b6)
7. [Common Ledger API Specification](#7-common-ledger-api-specification)
8. [Requirements & Environment Setup](#8-requirements--environment-setup)
9. [Agent Workflow Guidelines](#9-agent-workflow-guidelines)
10. [Task Folder Structure](#10-task-folder-structure)
11. [Quick Start Guide](#11-quick-start-guide)
12. [Best Practices & Standards](#12-best-practices--standards)
13. [Next Steps](#13-next-steps)

---

## 1. Learning Objectives

By the end of this track you should be comfortable orienting yourself in code you did not write, and shipping small services with proof they work.

| Outcome | Projects | What you gain |
| ------- | -------- | ------------- |
| Map a codebase by artifact type | B1 | A mental model of where HTTP handlers, business logic, persistence, and configuration live |
| Document every public API surface | B2 | A route-to-handler table you can trust for integration or review work |
| Run and interpret an existing test suite | B3 | Confidence in how a repo is validated before you change it |
| Compare patterns across languages | B4, B5, B6 | Exposure to Python, Node.js, and Rust in compact, readable codebases |
| Deliver tested greenfield code | B4, B5, B6 | Runnable APIs and a CLI with pytest, Jest, or cargo evidence on disk |

Reports from B1–B3 must be grounded in source: list real paths, open the files, and mark anything you cannot confirm.

---

## 2. Content Categories

Work in this folder falls into two buckets that complement each other.

### Repository Analysis Exercises (B1–B3)

These are **report-only** agents. You point Cursor at a repository path; the agent reads production code and writes markdown in the B1–B3 folders. Nothing in the target repo is edited.

- **Typical external target:** `bo-migration-service` — a Spring Boot 3.2 migration API (Java 17, Maven) used in the checked-in golden reports
- **Easier first targets:** the in-repo B4 or B5 apps — few files, clear layering, no enterprise middleware

### Reference Applications (B4–B6)

These are **built and run inside the monorepo**. They exist so you can practice analysis on small code, prove greenfield delivery, and hand off stable fixtures to later tracks.

- B4 and B5 expose the same transaction ledger over HTTP in Python and Node.js
- B6 is a Rust command-line log counter — no server, no port
- Intermediate work (I3 patches, I5 Docker) references B4/B5 layouts documented here

---

## 3. Task Overview

| ID | Mode | Output / proof | Where to read more |
| -- | ---- | -------------- | ------------------ |
| **B1** | Report | [`repo-inventory.md`](B1_Repo_Artifact_Inventory/repo-inventory.md) | [B1 README](B1_Repo_Artifact_Inventory/README.md) |
| **B2** | Report | [`api-endpoint-map.md`](B2_API_endpoint_map/api-endpoint-map.md) | [B2 README](B2_API_endpoint_map/README.md) |
| **B3** | Report + run | [`test-discovery-report.md`](B3_Test_discovery_and_execution/test-discovery-report.md) | [B3 README](B3_Test_discovery_and_execution/README.md) |
| **B4** | Greenfield API | FastAPI on **8001**, pytest **5/5** | [B4 README](B4_FastAPI_greenfield_service/README.md) |
| **B5** | Greenfield API | Express on **3000**, Jest **18/18** | [B5 README](B5_Node.js_greenfield_API/README.md) |
| **B6** | Greenfield CLI | `cargo test` **6/6**, sample log run | [B6 README](B6_Rust_greenfield/README.md) |

Plan roughly **75 minutes** for B1 + B2 + B3 together. B4–B6 have no fixed time limit.

**Cursor commands:** `/repo-inventory` · `/api-endpoint-map` · `/test-discovery` · `/fastapi-builder` · `/nodejs-builder` · `/rust-log-analyzer`

---

## 4. Suggested Learning Journey

| Order | Do this | Rationale |
| ----- | ------- | --------- |
| 1 | Install and run B4, B5, or B6 once | You see tests pass and (for B4/B5) hit Swagger before analyzing strangers' repos |
| 2 | `/repo-inventory` on B4 or B5 | Learn B1's report shape on ~10 files instead of 29 Java classes |
| 3 | `/api-endpoint-map` on the same folder | B4/B5 each expose a handful of routes — good B2 practice |
| 4 | `/test-discovery` on B4, B5, or B6 | Short feedback loop: pytest, Jest, or cargo |
| 5 | Run B1 → B2 → B3 on `bo-migration-service` (or your own Spring service) | Full-stack Java example with JPA, Redis, schedulers, and JUnit |
| 6 | Open the Intermediate track | I1 and I2 assume you can already inventory entities and trace routes |

If Spring Boot is already familiar, start at step 5 and use B4/B5 only when you want a quick format check.

---

## 5. Repository Analysis Exercises (B1–B3)

The three analysis agents chain naturally on one target:

```
/repo-inventory  →  /api-endpoint-map  →  /test-discovery
```

### B1 — Repo Artifact Inventory

**Purpose:** Classify production source into controllers, services, repositories, DTOs, schedulers, configs, and related types — each row tied to a path on disk.

**Report outline:**

1. Verification summary (file counts, manifests found)
2. Master inventory table
3. Architecture notes (layering, deploy signals, integrations)
4. Entry points (boot class, config, scheduled jobs, consumers)
5. Per-type groupings
6. Items mentioned in docs but not found in code

**Constraints:** Skip `.venv`, `node_modules`, `target`, `vendor`, `build`, `dist`. Prefer annotations and router registration over folder names. Do not treat README text as proof.

| Doc | Path |
| --- | ---- |
| Overview | [B1/README.md](B1_Repo_Artifact_Inventory/README.md) |
| Workflow | [agent.md](B1_Repo_Artifact_Inventory/agent.md) |
| Example output | [repo-inventory.md](B1_Repo_Artifact_Inventory/repo-inventory.md) |

### B2 — API Endpoint Map

**Purpose:** List routes reachable by external clients — REST, GraphQL, WebSocket, and SPA navigation — with handler, DTOs, auth, and source location.

**Report outline:**

1. Verification summary by endpoint type
2. Main endpoint table
3. Counts (public vs protected, deprecated, etc.)
4. Per-route call chain where traceable
5. Breakdown by protocol / surface
6. Unverified or ambiguous registrations

**Constraints:** Ignore internal-only calls and batch jobs. Trace `@GetMapping`, Express `router.get`, FastAPI decorators, etc. OpenAPI may help but must match code.

| Doc | Path |
| --- | ---- |
| Overview | [B2/README.md](B2_API_endpoint_map/README.md) |
| Workflow | [agent.md](B2_API_endpoint_map/agent.md) |
| Example output | [api-endpoint-map.md](B2_API_endpoint_map/api-endpoint-map.md) |

### B3 — Test Discovery & Execution

**Purpose:** Determine how the repo tests itself, run the canonical command, and capture real terminal output plus failure notes.

**Report outline:**

1. Build tool and test framework (with evidence)
2. Config files
3. Test file inventory (unit / integration / E2E)
4. Commands tried (primary and alternates)
5. Executed run (command, exit code, output)
6. Failure breakdown or `_No failures._`

**Constraints:** Read `package.json`, `pom.xml`, or `Cargo.toml` before guessing commands. Run tests; do not invent pass/fail. Classify errors when they occur.

| Repo target | Stack | Typical command |
| ----------- | ----- | ----------------- |
| B4 | pytest | `pytest -v` |
| B5 | Jest + Supertest | `npm test` |
| B6 | cargo | `cargo test` |
| External Java service | JUnit 5 | `mvn test` |

| Doc | Path |
| --- | ---- |
| Overview | [B3/README.md](B3_Test_discovery_and_execution/README.md) |
| Workflow | [agent.md](B3_Test_discovery_and_execution/agent.md) |
| Example output | [test-discovery-report.md](B3_Test_discovery_and_execution/test-discovery-report.md) |

---

## 6. Reference Applications (B4–B6)

Each greenfield project includes `agent.md`, `STATUS.md`, `local-testing.md`, and `validation-results.md` with pasted command output.

### B4 — FastAPI Transaction API

| | |
| --- | --- |
| **Stack** | Python 3.9+, FastAPI, Pydantic v2, uvicorn, pytest |
| **Listen** | `127.0.0.1:8001` (keeps **8000** free for I4 / A3) |
| **Key files** | `app/main.py`, `app/routes.py`, `app/storage.py`, `app/models.py`, `tests/test_transactions.py` |
| **Verified** | 2026-06-22 · pytest **5/5** |

```bash
cd Basic-repo-reader-and-builder/B4_FastAPI_greenfield_service
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
pytest -v
uvicorn app.main:app --reload --host 127.0.0.1 --port 8001
# Swagger: http://127.0.0.1:8001/docs
```

Details: [B4/README.md](B4_FastAPI_greenfield_service/README.md) · [local-testing.md](B4_FastAPI_greenfield_service/local-testing.md)

### B5 — Node.js Transaction API

| | |
| --- | --- |
| **Stack** | Node.js 18+, Express 4, Jest, Supertest, Swagger UI |
| **Listen** | `localhost:3000` (set `PORT=3001` if busy) |
| **Key files** | `src/index.js`, `src/app.js`, `src/controllers/`, `src/routes/`, `tests/` |
| **Verified** | 2026-06-22 · Jest **18/18** across 10 suites |

```bash
cd Basic-repo-reader-and-builder/B5_Node.js_greenfield_API
npm install
npm test
npm start
# Swagger: http://localhost:3000/docs
```

Use **`localhost`**, not `127.0.0.1`, for browser and curl on this machine — IPv4 loopback can hit an SSH tunnel.

Details: [B5/README.md](B5_Node.js_greenfield_API/README.md) · [local-testing.md](B5_Node.js_greenfield_API/local-testing.md)

### B6 — Rust Log Analyzer CLI

| | |
| --- | --- |
| **Stack** | Rust stable, cargo |
| **Kind** | CLI only — parses log files, prints level counts |
| **Key files** | `src/main.rs`, `src/lib.rs`, `sample.log`, `tests/analyzer_tests.rs` |
| **Verified** | 2026-06-22 · cargo test **6/6**; `sample.log` → INFO 4, WARN 2, ERROR 2 |

```bash
cd Basic-repo-reader-and-builder/B6_Rust_greenfield
cargo test
cargo run -- sample.log
```

Details: [B6/README.md](B6_Rust_greenfield/README.md) · [local-testing.md](B6_Rust_greenfield/local-testing.md)

---

## 7. Common Ledger API Specification

B4 and B5 both implement an in-memory **Transaction API** with matching routes — useful for B2 comparisons and for Intermediate tasks that patch ledger behavior.

| HTTP | Path | Behavior |
| ---- | ---- | -------- |
| POST | `/transactions` | Record a credit or debit |
| GET | `/transactions` | Return all stored transactions |
| GET | `/balance` | Net balance: sum(credits) − sum(debits) |

Shared extras: `GET /health`, `GET /` (JSON service metadata). B5 additionally serves Swagger at `/docs` and OpenAPI JSON at `/api-docs`.

**Request body (create):**

- `amount` — positive number
- `type` — `"credit"` or `"debit"`
- `id` and `timestamp` — assigned by the server if omitted

```bash
curl -X POST http://127.0.0.1:8001/transactions \
  -H "Content-Type: application/json" \
  -d '{"amount": 100.0, "type": "credit"}'
```

B4 listens on **8001**; B5 on **3000** — swap host/port in examples accordingly.

---

## 8. Requirements & Environment Setup

### For B1–B3 (analysis)

Provide any **local directory path** when invoking the agent. Golden reports in this repo were generated against `bo-migration-service`:

```text
/repo-inventory ~/Downloads/bo-migration-service
/api-endpoint-map ~/Downloads/bo-migration-service
/test-discovery ~/Downloads/bo-migration-service
```

This monorepo does not ship that service as a submodule — you clone or mount it yourself.

### For B4–B6 (runnable)

| Runtime | Minimum | Used by |
| ------- | ------- | ------- |
| Python | 3.9+ | B4 |
| Node.js | 18+ | B5 |
| Rust / cargo | stable toolchain | B6 |
| JDK + Maven | 17+, Maven 3.x | Optional — only for external Java targets in B1–B3 |

Keep virtualenvs and `node_modules` local; they are gitignored.

**Monorepo setup:** [`docs/complete-setup.md`](../docs/complete-setup.md) · [`docs/getting-started.md`](../docs/getting-started.md)

---

## 9. Agent Workflow Guidelines

Every B1–B6 task defines behavior in an **`agent.md`** beside its README. Cursor exposes the same logic through **`.cursor/skills/<name>/SKILL.md`** at the repository root (thin wrappers — edit the `agent.md` in each project folder).

| ID | Workflow file | Slash command |
| -- | ------------- | ------------- |
| B1 | [B1/agent.md](B1_Repo_Artifact_Inventory/agent.md) | `/repo-inventory` |
| B2 | [B2/agent.md](B2_API_endpoint_map/agent.md) | `/api-endpoint-map` |
| B3 | [B3/agent.md](B3_Test_discovery_and_execution/agent.md) | `/test-discovery` |
| B4 | [B4/agent.md](B4_FastAPI_greenfield_service/agent.md) | `/fastapi-builder` |
| B5 | [B5/agent.md](B5_Node.js_greenfield_API/agent.md) | `/nodejs-builder` |
| B6 | [B6/agent.md](B6_Rust_greenfield/agent.md) | `/rust-log-analyzer` |

**Recommended agent session:**

1. Skim the project `README.md` for scope and evidence links
2. Follow the checklist in `agent.md`
3. For B1–B3, align output structure with the existing `*-report.md` in that folder
4. For B4–B6, update `validation-results.md` after a successful local run

---

## 10. Task Folder Structure

```
Basic-repo-reader-and-builder/
├── README.md
├── B1_Repo_Artifact_Inventory/
│   ├── README.md · agent.md · STATUS.md · repo-inventory.md
├── B2_API_endpoint_map/
│   ├── README.md · agent.md · STATUS.md · api-endpoint-map.md
├── B3_Test_discovery_and_execution/
│   ├── README.md · agent.md · STATUS.md · test-discovery-report.md
├── B4_FastAPI_greenfield_service/
│   ├── README.md · agent.md · STATUS.md · app/ · tests/
│   ├── local-testing.md · validation-results.md · k8s/ · Dockerfile
├── B5_Node.js_greenfield_API/
│   ├── README.md · agent.md · STATUS.md · src/ · tests/
│   └── local-testing.md · validation-results.md · package.json
└── B6_Rust_greenfield/
    ├── README.md · agent.md · STATUS.md · src/ · tests/
    └── sample.log · Cargo.toml · local-testing.md · validation-results.md
```

| File | Role |
| ---- | ---- |
| `README.md` | Human-facing summary and links |
| `agent.md` | Machine-facing workflow and output schema |
| `STATUS.md` | Grader checklist — what passed and when |
| `*-report.md` | B1–B3 deliverable (overwritten per run) |
| `local-testing.md` | Step-by-step install, test, and demo commands |
| `validation-results.md` | B4–B6 captured terminal sessions |

---

## 11. Quick Start Guide

Three entry paths based on what is actually in this folder — analysis reports (B1–B3), in-repo greenfield apps (B4–B6), or both on the same small target.

### Before you start

1. Open the **monorepo root** in Cursor (`AI-Agents-Tasks -PML/`), not an individual `B*` subfolder.
2. Type **`/`** in Agent chat — six Basic commands: `/repo-inventory`, `/api-endpoint-map`, `/test-discovery`, `/fastapi-builder`, `/nodejs-builder`, `/rust-log-analyzer`.
3. Each task folder ships `agent.md` (workflow), `STATUS.md` (grader checklist), and either a golden `*-report.md` (B1–B3) or `local-testing.md` + `validation-results.md` (B4–B6).

### Path A — Analysis trio on in-repo B4 (~20 min)

Use the smallest runnable target in this track — four Python modules under `app/`, five pytest cases, ledger routes on port **8001**.

| Step | Action |
| ---- | ------ |
| 1 | `/repo-inventory Basic-repo-reader-and-builder/B4_FastAPI_greenfield_service` |
| 2 | `/api-endpoint-map Basic-repo-reader-and-builder/B4_FastAPI_greenfield_service` |
| 3 | `/test-discovery Basic-repo-reader-and-builder/B4_FastAPI_greenfield_service` |
| 4 | Compare outputs to [`B1/repo-inventory.md`](B1_Repo_Artifact_Inventory/repo-inventory.md) shape, [`B2/api-endpoint-map.md`](B2_API_endpoint_map/api-endpoint-map.md), and [`B3/test-discovery-report.md`](B3_Test_discovery_and_execution/test-discovery-report.md) |

Reports are written into **B1–B3 folders only** — B4 source stays read-only.

Optional smoke test before agents run:

```bash
cd Basic-repo-reader-and-builder/B4_FastAPI_greenfield_service
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt && pytest -v
```

### Path B — Full-stack Java analysis (`bo-migration-service`)

Golden B1–B3 samples in this repo were generated against an external Spring Boot 3.2 service (29 `src/main/java` files, JUnit via Maven). Clone it locally, then chain the same three agents:

```text
/repo-inventory ~/Downloads/bo-migration-service
/api-endpoint-map ~/Downloads/bo-migration-service
/test-discovery ~/Downloads/bo-migration-service
```

| Deliverable | Golden reference |
| ----------- | ---------------- |
| Artifact inventory | [`B1/repo-inventory.md`](B1_Repo_Artifact_Inventory/repo-inventory.md) — controllers, services, repositories, schedulers |
| Endpoint map | [`B2/api-endpoint-map.md`](B2_API_endpoint_map/api-endpoint-map.md) — REST routes with handler chains |
| Test discovery | [`B3/test-discovery-report.md`](B3_Test_discovery_and_execution/test-discovery-report.md) — `mvn test` output captured |

This monorepo does **not** vendor `bo-migration-service`; you supply the path. For a second in-repo target with more surface area, repeat Path A on **B5** (`src/` + `tests/`, Jest **18/18**).

### Path C — Run the greenfield builders (B4 · B5 · B6)

| Project | Stack | Verify | Live surface |
| ------- | ----- | ------ | ------------ |
| **B4** | FastAPI · Pydantic v2 · pytest | `pytest -v` → **5/5** | [Swagger :8001/docs](http://127.0.0.1:8001/docs) |
| **B5** | Express 4 · Jest · Supertest · Swagger | `npm test` → **18/18** | [Swagger :3000/docs](http://localhost:3000/docs) |
| **B6** | Rust CLI · `log-analyzer` binary | `cargo test` → **6/6** | `cargo run -- sample.log` → INFO/WARN/ERROR counts |

**B4** (port **8001** — leaves **8000** free for I4/A3):

```bash
cd Basic-repo-reader-and-builder/B4_FastAPI_greenfield_service
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
pytest -v
uvicorn app.main:app --reload --host 127.0.0.1 --port 8001
```

**B5** (port **3000** — use `localhost`, not `127.0.0.1`, if an SSH tunnel binds IPv4 loopback):

```bash
cd Basic-repo-reader-and-builder/B5_Node.js_greenfield_API
npm install && npm test && npm start
```

**B6** (no server — CLI only):

```bash
cd Basic-repo-reader-and-builder/B6_Rust_greenfield
cargo test && cargo run -- sample.log
```

Invoke `/fastapi-builder`, `/nodejs-builder`, or `/rust-log-analyzer` in Cursor to extend or re-verify; paste fresh terminal output into each project's `validation-results.md`.

B4 and B5 share the same ledger contract ([§7](#7-common-ledger-api-specification)): `POST/GET /transactions`, `GET /balance`, `GET /health`. B4 also includes a `Dockerfile` and `k8s/` manifests used later by **I5**.

### Verify you are done

| Goal | Pass criteria |
| ---- | ------------- |
| B1–B3 report | Output matches `agent.md` sections; every row cites a real path; target repo untouched |
| B4 | `STATUS.md` green · pytest **5/5** · Swagger on **8001** |
| B5 | `STATUS.md` green · Jest **18/18** · API on **`localhost:3000`** |
| B6 | `STATUS.md` green · cargo **6/6** · `sample.log` counts match [`B6/local-testing.md`](B6_Rust_greenfield/local-testing.md) |

**More runbooks:** [`docs/runnable-projects.md`](../docs/runnable-projects.md) · [agent-catalog.vercel.app](https://agent-catalog.vercel.app)

---

## 12. Best Practices & Standards

- **Evidence over narrative** — if you cannot point to a file and line context, put the item under "not verified"
- **Hands off the target repo** during B1–B3; reports live in this track's folders
- **Ignore build output** — never inventory or commit `.venv/`, `node_modules/`, `target/`, `vendor/`, `.pytest_cache/`
- **Respect ports** — B4 → **8001**, B5 → **3000**, I4/A3 → **8000**, D6 Grafana may also want **3000**
- **Use golden files as rubrics**, not copy-paste sources — graders expect your own scan results
- **Treat B4/B5 as shared contracts** — changing ledger routes or validation breaks downstream Intermediate exercises

---

## 13. Next Steps

When B1–B6 are done, continue in **`Intermediate-repo operator and polyglot builder/`**:

| Task | How Basics prepares you |
| ---- | ----------------------- |
| **I1** ER diagram | Entity classes you catalogued in B1 |
| **I2** Flow trace | Routes you mapped in B2 |
| **I3** Small safe change | Test commands you discovered in B3 |
| **I4** Polyglot pair | Patterns from B4/B5 multi-language APIs |
| **I5** Dockerization | B4 Dockerfile and k8s manifests |
| **I6** Dockerize and run | Compose stacks built on runnable services |

**Other monorepo tracks:**

| Track | Directory |
| ----- | --------- |
| Basic *(current)* | `Basic-repo-reader-and-builder/` |
| Intermediate | `Intermediate-repo operator and polyglot builder/` |
| Advanced | `Advanced-parallel agent operator and system builder/` |
| Infra & DevOps | `Infra-and-DevOps/` |

**Central docs:** [`docs/README.md`](../docs/README.md) · [`docs/project-status.md`](../docs/project-status.md) · [`docs/agent-catalog.md`](../docs/agent-catalog.md)
