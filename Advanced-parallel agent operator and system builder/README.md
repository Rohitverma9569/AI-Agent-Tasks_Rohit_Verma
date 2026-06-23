# Advanced Parallel Agent Operator & System Builder

> **Third skill track** in the [AI Agent Tasks](https://github.com/Rohitverma9569/AI-Agent-Tasks_Rohit_Verma) monorepo. Six Cursor agents for parallel git worktrees, a polyglot fraud scoring system, repository modernization, adversarial code review, and performance profiling.

| | |
| --- | --- |
| **Agents** | **6** (A1–A6) — all complete |
| **Folder** | `Advanced-parallel agent operator and system builder/` |
| **Docs hub** | [`docs/README.md`](../docs/README.md) |
| **Catalog** | [agent-catalog.vercel.app](https://agent-catalog.vercel.app) |

---

## Table of Contents

1. [Learning Objectives](#1-learning-objectives)
2. [Content Categories](#2-content-categories)
3. [Task Overview](#3-task-overview)
4. [Cursor Commands](#4-cursor-commands)
5. [Parallel Operator Exercises (A1–A2)](#5-parallel-operator-exercises-a1a2)
6. [Reference Applications (A3–A6)](#6-reference-applications-a3a6)
7. [Common API Endpoint Specification](#7-common-api-endpoint-specification)
8. [Requirements & Environment Setup](#8-requirements--environment-setup)
9. [Agent Workflow Guidelines](#9-agent-workflow-guidelines)
10. [Task Folder Structure](#10-task-folder-structure)
11. [Completion Criteria Overview](#11-completion-criteria-overview)
12. [Quick Start Guide](#12-quick-start-guide)
13. [Next Steps](#13-next-steps)

---

## 1. Learning Objectives

By the end of this track you should be able to plan and execute multi-agent parallel delivery, ship a three-language distributed system, and produce evaluation-grade modernization, review, and profiling reports.

| Outcome | Agent | What you gain |
| ------- | ----- | ------------- |
| Split a feature into parallel lanes with merge strategy | A1 | `multi-worktree-plan.md` — branches, file ownership, agent prompts |
| Create worktrees, implement lanes, merge with proof | A2 | `parallel-execution-report.md` — git commands, per-lane tests, integration output |
| Build FastAPI + Node + Rust with async processing | A3 | Runnable fraud pipeline with JSON contracts and E2E proof |
| Score repo debt and ship one HV/LR improvement | A4 | `modernization-report.md` — roadmap + one verified fix + rollback |
| Review code skeptically with severity ratings | A5 | `code-review-report.md` — blocking issues, ship recommendation |
| Measure, optimize, and prove a hot path | A6 | `performance-report.md` — before/after benchmarks, tests green |

Golden reports in this folder were generated against **`bo-migration-service`** (A1, A2, A4, A5, A6) and verified locally for **A3** (2026-06-21).

---

## 2. Content Categories

Work in this folder falls into three groups.

### Parallel operators (A1–A2)

**Report-only in this folder** — code changes happen in target-repo worktrees.

| Agent | Command | Output |
| ----- | ------- | ------ |
| A1 | `/multi-worktree-plan` | 8-section parallel plan |
| A2 | `/parallel-worktree-execute` | 7-section execution evidence |

A2 reads the A1 plan (or inline lane definitions), creates worktrees, implements two or more lanes, merges, and runs build + test on the merged tree.

### Polyglot system builder (A3)

**Built and run inside this monorepo** — the only fully in-repo runnable application in the Advanced track.

| Component | Path | Port |
| --------- | ---- | ---- |
| FastAPI API | `A3_Fraud_Score_system/services/fastapi/` | **8000** |
| Node worker | `A3_Fraud_Score_system/workers/node/` | — |
| Rust engine | `A3_Fraud_Score_system/engines/rust/` | **3001** |

### Evaluation operators (A4–A6)

**Analyze target repos** — A4 and A6 may apply one scoped code change; A5 is review-only by default.

| Agent | Command | Output |
| ----- | ------- | ------ |
| A4 | `/repository-modernization` | Scored roadmap + one improvement |
| A5 | `/adversarial-code-review` | Severity-rated issue list |
| A6 | `/performance-profiling` | Before/after benchmark report |

---

## 3. Task Overview

| ID | Mode | Output / proof | Where to read more |
| -- | ---- | -------------- | ------------------ |
| **A1** | Plan | [`multi-worktree-plan.md`](A1_Multi-worktree_parallel_plan/multi-worktree-plan.md) | [A1 README](A1_Multi-worktree_parallel_plan/README.md) |
| **A2** | Execute | [`parallel-execution-report.md`](A2_Execute_two_parallel_worktrees/parallel-execution-report.md) | [A2 README](A2_Execute_two_parallel_worktrees/README.md) |
| **A3** | Build + run | Polyglot system · E2E **PASSED** | [A3 README](A3_Fraud_Score_system/README.md) |
| **A4** | Analyze + fix | [`docs/modernization-report.md`](A4_Repository_Modernization_Plan/docs/modernization-report.md) | [A4 README](A4_Repository_Modernization_Plan/README.md) |
| **A5** | Review | [`code-review-report.md`](A5_Agent_Code_Review/code-review-report.md) | [A5 README](A5_Agent_Code_Review/README.md) |
| **A6** | Profile + fix | [`performance-report.md`](A6_Performence_Profiling/performance-report.md) | [A6 README](A6_Performence_Profiling/README.md) |

---

## 4. Cursor Commands

Type **`/`** in Cursor Agent chat to invoke any Advanced agent. Each command maps to an `agent.md` spec and a skill under `.cursor/skills/` at the monorepo root.

| ID | Project | Cursor command | Mode | Example invocation |
| -- | ------- | -------------- | ---- | ------------------ |
| **A1** | Multi-Worktree Parallel Plan | `/multi-worktree-plan` | Plan | `/multi-worktree-plan ~/Downloads/bo-migration-service Add bulk export API for migration status` |
| **A2** | Execute Parallel Worktrees | `/parallel-worktree-execute` | Execute | `/parallel-worktree-execute ~/Downloads/bo-migration-service — execute Lane A and Lane B from A1 export plan` |
| **A3** | Fraud Scoring System | `/fraud-score-system` | Build + run | `/fraud-score-system` |
| **A4** | Repository Modernization Plan | `/repository-modernization` | Analyze + fix | `/repository-modernization ~/Downloads/bo-migration-service` |
| **A5** | Adversarial Code Review | `/adversarial-code-review` | Review | `/adversarial-code-review ~/Downloads/bo-migration-service` |
| **A6** | Performance Profiling | `/performance-profiling` | Profile + fix | `/performance-profiling ~/Downloads/bo-migration-service bulk CSV import` |

| Command | Primary output |
| ------- | -------------- |
| `/multi-worktree-plan` | [`multi-worktree-plan.md`](A1_Multi-worktree_parallel_plan/multi-worktree-plan.md) |
| `/parallel-worktree-execute` | [`parallel-execution-report.md`](A2_Execute_two_parallel_worktrees/parallel-execution-report.md) |
| `/fraud-score-system` | `A3_Fraud_Score_system/` — FastAPI · Node worker · Rust engine |
| `/repository-modernization` | [`docs/modernization-report.md`](A4_Repository_Modernization_Plan/docs/modernization-report.md) |
| `/adversarial-code-review` | [`code-review-report.md`](A5_Agent_Code_Review/code-review-report.md) |
| `/performance-profiling` | [`performance-report.md`](A6_Performence_Profiling/performance-report.md) |

Browse all **24** agents: [agent-catalog.vercel.app](https://agent-catalog.vercel.app)

---

## 5. Parallel Operator Exercises (A1–A2)

Plan-and-execute agents for multi-lane delivery using git worktrees. Reports live in this folder; code changes happen in target-repo worktrees.

#### A1 — Multi-Worktree Parallel Plan

**Purpose:** Decompose a feature into independent lanes — each with branch, worktree path, allowed/forbidden files, and a copy-paste Cursor prompt.

**Deliverable:** [`multi-worktree-plan.md`](A1_Multi-worktree_parallel_plan/multi-worktree-plan.md) — 8 sections:

1. Task definition · 2. Task decomposition · 3. Branch strategy · 4. Agent prompt per lane · 5. Shared constraints · 6. Merge order · 7. Conflict prevention · 8. Verification plan

**Golden example:** Bulk export API — 4 lanes (Contract · Repository · Service · Controller), Wave 1 parallel (A + B).

**Constraints:** Plan only — no worktrees or branches unless you ask.

| Doc | Path |
| --- | ---- |
| Overview | [A1/README.md](A1_Multi-worktree_parallel_plan/README.md) |
| Workflow | [agent.md](A1_Multi-worktree_parallel_plan/agent.md) |

#### A2 — Execute Two Parallel Worktrees

**Purpose:** Create two or more worktrees, implement lane changes, reconcile merges, and prove integration with build + test output.

**Deliverable:** [`parallel-execution-report.md`](A2_Execute_two_parallel_worktrees/parallel-execution-report.md) — 7 sections:

1. Worktree creation · 2. Branch layout · 3. Lane 1 output · 4. Lane 2 output · 5. Reconciliation · 6. Conflict analysis · 7. Verification

**Golden result:** Wave 1 complete — **28/28** tests, **0** merge conflicts, `mvn validate` clean.

| Doc | Path |
| --- | ---- |
| Overview | [A2/README.md](A2_Execute_two_parallel_worktrees/README.md) |
| Workflow | [agent.md](A2_Execute_two_parallel_worktrees/agent.md) |
| Companion plan | [A1/multi-worktree-plan.md](A1_Multi-worktree_parallel_plan/multi-worktree-plan.md) |

---

## 6. Reference Applications (A3–A6)

**A3** is the runnable reference application in this track — a three-language fraud scoring pipeline with async queue processing and shared SQLite. **A4–A6** produce evaluation reports against external target repos.

### A3 — Fraud Scoring System

| | |
| --- | --- |
| **Stack** | Python 3.9+ · Node.js 22+ · Rust 1.70+ · SQLite |
| **Ports** | FastAPI **8000** · Rust engine **3001** |
| **Tests** | Rust **4/4** · FastAPI **4/4** · Node **7/7** · E2E **PASSED** |
| **Verified** | 2026-06-21 |

```bash
cd "Advanced-parallel agent operator and system builder/A3_Fraud_Score_system"
make verify && ./scripts/run-all.sh
# Swagger: http://127.0.0.1:8000/docs
```

**Pipeline:** POST transaction → `PENDING` → Node worker polls outbox → Rust `/score` → worker writes result → GET returns `COMPLETED` with `risk_score`.

Details: [A3/README.md](A3_Fraud_Score_system/README.md) · [architecture.md](A3_Fraud_Score_system/docs/architecture.md) · [validation-results.md](A3_Fraud_Score_system/validation-results.md)

### Evaluation deliverables (A4–A6)

Report agents in this folder — no runnable server:

| Agent | Golden deliverable | Key metric |
| ----- | ------------------ | ---------- |
| **A4** | [`modernization-report.md`](A4_Repository_Modernization_Plan/docs/modernization-report.md) | Priority **7** fix · **27/27** tests |
| **A5** | [`code-review-report.md`](A5_Agent_Code_Review/code-review-report.md) | **12** issues · **4** blocking · Do not ship |
| **A6** | [`performance-report.md`](A6_Performence_Profiling/performance-report.md) | **~5.7%** faster CSV parse · **28/28** tests |

---

## 7. Common API Endpoint Specification

The **A3 Fraud Scoring System** exposes an async transaction API — clients submit a transaction, poll for completion, and receive a fraud risk score once processing finishes.

### FastAPI endpoints (port 8000)

| HTTP | Path | Behavior |
| ---- | ---- | -------- |
| POST | `/transactions` | Validate, persist as `PENDING`, enqueue processing job |
| GET | `/transactions/{id}` | Return transaction; poll until `COMPLETED` with score |
| GET | `/health` | Liveness check |

### Request body (`POST /transactions`)

```json
{
  "user_id": "user-01",
  "merchant_id": "MERCH-1",
  "amount": 15000,
  "currency": "USD"
}
```

| Field | Rule |
| ----- | ---- |
| `user_id` | Required string |
| `merchant_id` | Required string |
| `amount` | Positive number |
| `currency` | 3-letter ISO code (e.g. `USD`) |

### Response lifecycle

| When | `status` | `risk_score` |
| ---- | -------- | ------------ |
| Right after POST | `PENDING` | `null` |
| After worker + Rust (~1–2 s) | `COMPLETED` | `LOW` / `MEDIUM` / `HIGH` |

**Completed example:**

```json
{
  "id": "uuid",
  "status": "COMPLETED",
  "risk_score": "HIGH",
  "score_value": 0.92,
  "reasons": ["amount_exceeds_high_threshold"]
}
```

### Verified test scenarios

| Scenario | Input | Expected |
| -------- | ----- | -------- |
| HIGH | amount 15000 | HIGH · 0.92 |
| LOW | amount 50 | LOW · 0.15 |
| MEDIUM | amount 2500 | MEDIUM · 0.45 |
| Suspicious merchant | `merchant_id: "SUS-999"` | MEDIUM · 0.35 |

### JSON Schema contracts

Defined in [`A3_Fraud_Score_system/contracts/`](A3_Fraud_Score_system/contracts/):

| File | Purpose |
| ---- | ------- |
| `transaction.schema.json` | Stored transaction + scoring fields |
| `processing-request.schema.json` | Outbox queue message |
| `risk-score.schema.json` | Rust engine response |

### Rust engine (internal — port 3001)

| HTTP | Path | Called by |
| ---- | ---- | --------- |
| POST | `/score` | Node worker only |
| GET | `/health` | Health checks |

**Risk rules:** amount thresholds → LOW/MEDIUM/HIGH; merchant prefix `SUS` bumps one level; non-USD/EUR/GBP currency adds one level.

```bash
curl -s -X POST http://127.0.0.1:8000/transactions \
  -H 'Content-Type: application/json' \
  -d '{"user_id":"user-01","merchant_id":"MERCH-1","amount":15000,"currency":"USD"}'
```

A3 FastAPI listens on **8000**. Rust scoring engine on **3001**.

---

## 8. Requirements & Environment Setup

### Prerequisites

Have a local clone of your target repo ready for A1, A2, A4, A5, and A6 agents (golden reports used `bo-migration-service`).

### External target (A1, A2, A4, A5, A6)

Clone **`bo-migration-service`** locally (not shipped in this monorepo):

```text
/multi-worktree-plan ~/Downloads/bo-migration-service Add bulk export API for migration status
/parallel-worktree-execute ~/Downloads/bo-migration-service — execute Lane A and Lane B from A1 export plan
/repository-modernization ~/Downloads/bo-migration-service
/adversarial-code-review ~/Downloads/bo-migration-service
/performance-profiling ~/Downloads/bo-migration-service bulk CSV import
```

### Tooling by agent

| Tool | Version | Agents |
| ---- | ------- | ------ |
| Git (worktree support) | 2.x+ | A1, A2 |
| Python | 3.9+ | A3 FastAPI |
| Node.js | **22+** (`node:sqlite`) | A3 worker |
| Rust / cargo | 1.70+ | A3 engine |
| JDK + Maven | 17+ | A1, A2, A4, A5, A6 (Java targets) |
| curl · jq | optional | A3 manual testing |

**Monorepo setup:** [`docs/complete-setup.md`](../docs/complete-setup.md) · [`docs/getting-started.md`](../docs/getting-started.md)

---

## 9. Agent Workflow Guidelines

Each A1–A6 task defines behaviour in **`agent.md`**. Cursor exposes slash commands via **`.cursor/skills/`** at the repo root.

| ID | Workflow file | Slash command |
| -- | ------------- | ------------- |
| A1 | [A1/agent.md](A1_Multi-worktree_parallel_plan/agent.md) | `/multi-worktree-plan` |
| A2 | [A2/agent.md](A2_Execute_two_parallel_worktrees/agent.md) | `/parallel-worktree-execute` |
| A3 | [A3/agent.md](A3_Fraud_Score_system/agent.md) | `/fraud-score-system` |
| A4 | [A4/agent.md](A4_Repository_Modernization_Plan/agent.md) | `/repository-modernization` |
| A5 | [A5/agent.md](A5_Agent_Code_Review/agent.md) | `/adversarial-code-review` |
| A6 | [A6/agent.md](A6_Performence_Profiling/agent.md) | `/performance-profiling` |

**Recommended session:**

1. Read the task `README.md` and golden report in that folder
2. Follow the checklist in `agent.md`
3. **A1** — write plan; do not create worktrees unless asked
4. **A2** — read A1 plan first; capture git output and test exit codes
5. **A3** — run `make verify` then `./scripts/run-all.sh`
6. **A4/A6** — one scoped change in target repo; document rollback
7. **A5** — review only unless you ask for fixes

**Typical pipeline:**

```
A1 plan  →  A2 execute  →  A5 review  →  A4 modernize  →  A6 profile
                              A3 (independent polyglot build)
```

---

## 10. Task Folder Structure

```
Advanced-parallel agent operator and system builder/
├── README.md
│
├── A1_Multi-worktree_parallel_plan/
│   ├── README.md · agent.md · multi-worktree-plan.md
│
├── A2_Execute_two_parallel_worktrees/
│   ├── README.md · agent.md · parallel-execution-report.md
│
├── A3_Fraud_Score_system/
│   ├── README.md · agent.md · Makefile · validation-results.md
│   ├── contracts/                 # JSON Schema
│   ├── services/fastapi/          # API :8000
│   ├── workers/node/              # Queue processor
│   ├── engines/rust/              # Scorer :3001
│   ├── tests/integration/         # E2E
│   ├── scripts/run-all.sh · verify.sh
│   └── docs/architecture.md · local-testing.md · testing-screenshots/
│
├── A4_Repository_Modernization_Plan/
│   ├── README.md · agent.md · docs/modernization-report.md
│
├── A5_Agent_Code_Review/
│   ├── README.md · agent.md · code-review-report.md
│
└── A6_Performence_Profiling/
    ├── README.md · agent.md · performance-report.md
```

| File | Role |
| ---- | ---- |
| `README.md` | Task summary and invoke examples |
| `agent.md` | Machine-facing workflow and output schema |
| `multi-worktree-plan.md` | A1 deliverable (overwritten per run) |
| `parallel-execution-report.md` | A2 deliverable (overwritten per run) |
| `validation-results.md` | A3 automated test captures |
| `*-report.md` | A4/A5/A6 deliverables |

Code for A1/A2/A4/A5/A6 lives in **target-repo worktrees**; only A3 code lives entirely in this folder.

---

## 11. Completion Criteria Overview

| ID | Considered complete when |
| -- | ------------------------ |
| **A1** | `multi-worktree-plan.md` has all 8 sections; each lane lists allowed and forbidden files; merge order documented |
| **A2** | Two+ worktrees created; per-lane tests pass; merged tree build + integration tests pass; report has 7 sections |
| **A3** | `make verify` exit 0; `./scripts/run-all.sh` prints `Integration test PASSED`; POST → `PENDING`, GET → `COMPLETED` |
| **A4** | 9 areas scored; roadmap written; one HV/LR fix implemented; tests pass; rollback documented |
| **A5** | 7 review areas covered; every finding cites a file; severity + blocking assigned; ship recommendation stated |
| **A6** | Baseline before change; bottleneck table with evidence; after rerun shows improvement %; test suite green |

See golden reports in each folder for dated verification evidence.

---

## 12. Quick Start Guide

Three entry paths cover the Advanced track. Open the **monorepo root** in Cursor, then choose the path that matches your goal.

### Path 1 — Parallel worktree delivery (A1 → A2)

Use when you need to split one feature across independent agent lanes and prove a clean merge.

| Step | What to do | Where output lands |
| ---- | ---------- | ------------------ |
| 1 | `/multi-worktree-plan ~/Downloads/bo-migration-service Add bulk export API for migration status` | [`A1_Multi-worktree_parallel_plan/multi-worktree-plan.md`](A1_Multi-worktree_parallel_plan/multi-worktree-plan.md) |
| 2 | Review the plan — confirm lane file lists, merge order (A → B → C → D), and per-lane prompts | [A1 README](A1_Multi-worktree_parallel_plan/README.md) |
| 3 | `/parallel-worktree-execute ~/Downloads/bo-migration-service — execute Lane A and Lane B from A1 export plan` | [`A2_Execute_two_parallel_worktrees/parallel-execution-report.md`](A2_Execute_two_parallel_worktrees/parallel-execution-report.md) |
| 4 | Check the report for `git worktree add` commands, per-lane test exit codes, and merged-tree integration proof | Golden run: **28/28** tests, **0** conflicts |

A1 is **plan-only** — it does not create branches or worktrees unless you ask. A2 implements code in sibling worktrees beside your target repo.

### Path 2 — Polyglot fraud system (A3)

Use when you want a runnable three-process system entirely inside this folder — no external clone required.

```bash
cd "Advanced-parallel agent operator and system builder/A3_Fraud_Score_system"
make verify          # Rust 4/4 · FastAPI 4/4 · Node 7/7
./scripts/run-all.sh # starts Rust :3001 → Node worker → FastAPI :8000 → E2E test
```

| Check | Expected |
| ----- | -------- |
| Swagger UI | [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs) — POST `/transactions` |
| Rust engine health | [http://127.0.0.1:3001/health](http://127.0.0.1:3001/health) |
| Transaction flow | POST returns `PENDING` → GET by id returns `COMPLETED` with `risk_score` |
| Proof on disk | [`validation-results.md`](A3_Fraud_Score_system/validation-results.md) · [`docs/local-testing.md`](A3_Fraud_Score_system/docs/local-testing.md) |

Or invoke `/fraud-score-system` in Cursor to build or extend the system. JSON contracts live in [`A3_Fraud_Score_system/contracts/`](A3_Fraud_Score_system/contracts/).

### Path 3 — Evaluation agents (A4 · A5 · A6)

Use when you have a target repo (golden samples used `bo-migration-service`) and need audit-grade reports.

| Agent | Invoke | Report file |
| ----- | ------ | ----------- |
| **A4** | `/repository-modernization ~/Downloads/bo-migration-service` | [`A4_Repository_Modernization_Plan/docs/modernization-report.md`](A4_Repository_Modernization_Plan/docs/modernization-report.md) |
| **A5** | `/adversarial-code-review ~/Downloads/bo-migration-service` | [`A5_Agent_Code_Review/code-review-report.md`](A5_Agent_Code_Review/code-review-report.md) |
| **A6** | `/performance-profiling ~/Downloads/bo-migration-service bulk CSV import` | [`A6_Performence_Profiling/performance-report.md`](A6_Performence_Profiling/performance-report.md) |

A4 and A6 each ship **one scoped code change** in the target repo with rollback steps in the report. A5 is **review-only** unless you explicitly ask for fixes.

### Done? Verify against golden samples

| Task | Quick pass criteria |
| ---- | ------------------- |
| **A1** | 8 sections in `multi-worktree-plan.md`; every lane has allowed + forbidden files |
| **A2** | Worktree commands captured; merged tree tests green |
| **A3** | `Integration test PASSED` from `run-all.sh` |
| **A4** | One HV/LR fix verified; rollback documented |
| **A5** | Severity + blocking per issue; ship recommendation stated |
| **A6** | Before/after benchmark numbers from the same harness |

Full command reference: [§4 Cursor Commands](#4-cursor-commands) · live demos: [`docs/runnable-projects.md`](../docs/runnable-projects.md) · catalog: [agent-catalog.vercel.app](https://agent-catalog.vercel.app)

---

## 13. Next Steps

When A1–A6 are complete, continue to **Infra & DevOps**:

| Track | Folder | Builds on Advanced |
| ----- | ------ | ------------------ |
| Infra & DevOps | `Infra-and-DevOps/` | D3 CI (A4 roadmap) · D5 bootstrap · D6 observability (A5/A6 gaps) |

| Agent | When to use after Advanced |
| ----- | -------------------------- |
| **D3** `/ci-pipeline` | Add GitHub Actions from A4 roadmap |
| **D5** `/reproducible-dev-environment` | One-command bootstrap after A4 wrapper fix |
| **D6** `/observability` | Metrics for reliability issues found in A5 |

**Central docs:** [`docs/README.md`](../docs/README.md) · [`docs/project-status.md`](../docs/project-status.md) · [`docs/runnable-projects.md`](../docs/runnable-projects.md)
