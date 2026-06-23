# Intermediate Repo Operator & Polyglot Builder

> **Second skill track** in the [AI Agent Tasks](https://github.com/Rohitverma9569/AI-Agent-Tasks_Rohit_Verma) monorepo. Six Cursor agents that move beyond read-only discovery: schema diagrams, flow traces, surgical edits, a two-language service pair, Docker packaging, and structured bug investigation.

| | |
| --- | --- |
| **Agents** | **6** (I1–I6) — all complete |
| **Folder** | `Intermediate-repo operator and polyglot builder/` |
| **Docs hub** | [`docs/README.md`](../docs/README.md) |
| **Catalog** | [agent-catalog.vercel.app](https://agent-catalog.vercel.app) |

---

## Table of Contents

1. [Learning Objectives](#1-learning-objectives)
2. [Content Categories](#2-content-categories)
3. [Task Overview](#3-task-overview)
4. [Suggested Learning Journey](#4-suggested-learning-journey)
5. [Repository Operator Exercises (I1–I2)](#5-repository-operator-exercises-i1i2)
6. [Build & Operate Projects (I3–I6)](#6-build--operate-projects-i3i6)
7. [Currency Conversion API Specification](#7-currency-conversion-api-specification)
8. [Agent Workflow Guidelines](#8-agent-workflow-guidelines)
9. [Task Folder Structure](#9-task-folder-structure)
10. [Completion Criteria Overview](#10-completion-criteria-overview)
11. [Next Steps](#11-next-steps)
12. [Quick Start Guide](#12-quick-start-guide)

---

## 1. Learning Objectives

This track assumes you can already inventory a repo (B1), map its routes (B2), and run its tests (B3). Here you apply those skills to deeper analysis and controlled change.

| Outcome | Projects | What you gain |
| ------- | -------- | ------------- |
| Reverse-engineer persistence from code | I1 | ER diagrams with cited entities, columns, and relationships |
| Trace a single entry point through the stack | I2 | Sequence diagrams with verified hops and side effects |
| Land a minimal, tested patch in foreign code | I3 | Small diffs with build/test proof in `change-report.md` |
| Ship a service plus client in two languages | I4 | FastAPI API on **8000** and a Node CLI that calls it |
| Containerize a runnable service | I5 | Multi-stage Dockerfile, health check, `docker-report.md` |
| Reproduce, fix, and document a defect | I6 | Root-cause report with verification evidence |

Diagram and report agents (I1, I2) stay read-only on the target repo. I3, I5, and I6 edit external code; I4 builds inside this monorepo.

---

## 2. Content Categories

Intermediate work groups into three modes.

### Deep-read operators (I1–I2)

Report-only agents aimed at **understanding** data and control flow. You supply a repo path (and for I2, an entry point). Output lands in this track's folders as markdown plus Mermaid (`.mmd`).

- **Reference target:** `bo-migration-service` — Spring Boot 3.2 migration API (JPA, MySQL, Redis, Flyway)
- Golden samples: [`er-diagram-report.md`](I1_ER_diagram_from_repo/er-diagram-report.md), [`flow-trace-report.md`](I2_End_to_end_flow_trace/flow-trace-report.md)

### Surgical operators (I3, I6)

Agents that **modify** a target repository with a narrow scope:

- **I3** — one requested behaviour change, new/updated tests, no commit unless asked
- **I6** — reproduce a described bug, root-cause analysis, minimal fix, re-verification

Both write investigation or change reports here; code changes live in the repo you point at.

### Polyglot builders & packaging (I4–I5)

- **I4** — in-repo FastAPI service + Node CLI (`/polyglot-service-pair`)
- **I5** — agent workflow that adds Docker artifacts **beside** the service being containerized (reference: I4 FastAPI under `I4/services/fastapi/`)

---

## 3. Task Overview

| ID | Mode | Primary output | Start here |
| -- | ---- | -------------- | ---------- |
| **I1** | Report + diagram | [`er-diagram-report.md`](I1_ER_diagram_from_repo/er-diagram-report.md), [`er-diagram.mmd`](I1_ER_diagram_from_repo/er-diagram.mmd) | [I1 README](I1_ER_diagram_from_repo/README.md) |
| **I2** | Report + diagram | [`flow-trace-report.md`](I2_End_to_end_flow_trace/flow-trace-report.md), [`flow-trace-sequence.mmd`](I2_End_to_end_flow_trace/flow-trace-sequence.mmd) | [I2 README](I2_End_to_end_flow_trace/README.md) |
| **I3** | Patch + report | Code diff in target + [`change-report.md`](I3_Small_safe_change/change-report.md) | [I3 README](I3_Small_safe_change/README.md) |
| **I4** | Greenfield pair | `I4/services/fastapi/` + `I4/clients/node-cli/` | [I4 README](I4/README.md) |
| **I5** | Docker workflow | `Dockerfile` at service path + [`docker-report.md`](I5_Polyglot_service_pair/docker-report.md) | [I5 README](I5_Polyglot_service_pair/README.md) |
| **I6** | Debug + report | Fix in target + [`bug-investigation-report.md`](I6_Dockerize_and_run/bug-investigation-report.md) | [I6 README](I6_Dockerize_and_run/README.md) |

**Cursor commands:** `/er-diagram` · `/flow-trace` · `/small-safe-change` · `/polyglot-service-pair` · `/dockerization` · `/bug-diagnosis`

---

## 4. Suggested Learning Journey

| Order | Do this | Rationale |
| ----- | ------- | --------- |
| 1 | Finish Basic B1–B3 on the same target you will use here | I1 needs entities from B1; I2 needs routes from B2 |
| 2 | `/er-diagram` on `bo-migration-service` (or your Spring service) | Practice JPA entity extraction before flow complexity |
| 3 | `/flow-trace` on one POST route you mapped in B2 | e.g. `POST /bo-migration/v1/migrateUser` — 10 verified hops in the golden report |
| 4 | Run I4 locally — API + CLI | See polyglot integration before Docker or patches |
| 5 | `/small-safe-change` with a single-line requirement | e.g. return 404 instead of synthetic defaults on cache miss |
| 6 | `/dockerization` on `I4/services/fastapi` | Package the service you just exercised |
| 7 | `/bug-diagnosis` on a known regression | Closes the loop: read → change → containerize → debug |

If ER modeling is already routine, pair I1 and I2 on the same endpoint in one session.

---

## 5. Repository Operator Exercises (I1–I2)

These extend Basic analysis: less breadth, more depth on schema and one execution path.

### I1 — ER Diagram from Repository

**Purpose:** Derive tables, columns, keys, and relationships from ORM entities, migrations, and config — not from guesswork.

**Deliverables:**

1. Verification summary (ORM stack, entity count, migration tooling)
2. Entity/table catalog with cited source files
3. Column lists with types and constraints
4. Relationship matrix (verified vs inferred)
5. Mermaid ER diagram ([`er-diagram.mmd`](I1_ER_diagram_from_repo/er-diagram.mmd))
6. Conflicts between code and migration scripts

**Golden run:** 3 JPA entities (`migration_status`, `migration_audit_log`, `migration_default_config`), 0 verified FKs, 1 inferred link on `user_id`.

| Doc | Path |
| --- | ---- |
| Overview | [I1/README.md](I1_ER_diagram_from_repo/README.md) |
| Workflow | [agent.md](I1_ER_diagram_from_repo/agent.md) |
| Example | [er-diagram-report.md](I1_ER_diagram_from_repo/er-diagram-report.md) |

### I2 — End-to-End Flow Trace

**Purpose:** Follow **one** HTTP route, consumer, or job from entry to persistence and side effects.

**Deliverables:**

1. Entry point declaration (method, path, handler file)
2. Step-by-step call chain with file paths
3. External systems touched (DB, cache, queues, HTTP)
4. Error and branch paths
5. Mermaid sequence diagram ([`flow-trace-sequence.mmd`](I2_End_to_end_flow_trace/flow-trace-sequence.mmd))

**Golden run:** `POST /bo-migration/v1/migrateUser` — controller → service → JPA repos → Redis cache → MySQL; 10 happy-path hops, 3 error paths documented.

| Doc | Path |
| --- | ---- |
| Overview | [I2/README.md](I2_End_to_end_flow_trace/README.md) |
| Workflow | [agent.md](I2_End_to_end_flow_trace/agent.md) |
| Example | [flow-trace-report.md](I2_End_to_end_flow_trace/flow-trace-report.md) |

---

## 6. Build & Operate Projects (I3–I6)

### I3 — Small Safe Change

**Purpose:** Implement exactly one behaviour change with the smallest diff and passing tests.

**Typical flow:** parse requirement → locate handler/service → edit production code → add/adjust tests → `mvn test` or equivalent → write [`change-report.md`](I3_Small_safe_change/change-report.md).

**Golden change:** `GET .../byUserId/{userId}` returns **404** on cache miss in AUDIT mode (was 200 with defaults). 2 production files, 4 new tests, risk **Low**.

| Doc | Path |
| --- | ---- |
| Overview | [I3/README.md](I3_Small_safe_change/README.md) |
| Workflow | [agent.md](I3_Small_safe_change/agent.md) |
| Example | [change-report.md](I3_Small_safe_change/change-report.md) |

### I4 — Polyglot Service Pair

**Purpose:** Deliver a currency conversion API and a CLI client that consumes it.

| Component | Stack | Location |
| --------- | ----- | -------- |
| API | FastAPI · uvicorn · pytest | [`I4/services/fastapi/`](I4/services/fastapi/) |
| CLI | Node.js · `cli.js` | [`I4/clients/node-cli/`](I4/clients/node-cli/) |

```bash
# Terminal 1 — API (port 8000)
cd "Intermediate-repo operator and polyglot builder/I4/services/fastapi"
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
pytest -v                    # 9/9
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000

# Terminal 2 — CLI
cd "Intermediate-repo operator and polyglot builder/I4/clients/node-cli"
node cli.js 100 USD INR      # prints 8300
```

Service identity: **`Currency Conversion API`** (not B4's Transaction API). Swagger: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

Details: [I4/README.md](I4/README.md) · [local-testing.md](I4/local-testing.md) · [validation-results.md](I4/validation-results.md)

### I5 — Dockerization

**Purpose:** Add production-ready container files to an existing service and document build/run/health checks.

Docker artifacts are written **next to the service**, not inside `I5_Polyglot_service_pair/`. Reference implementation:

```
I4/services/fastapi/
├── Dockerfile              # multi-stage python:3.12-slim
├── .dockerignore
├── requirements-prod.txt   # no pytest
└── app/
```

Report template: [`I5/docker-report.md`](I5_Polyglot_service_pair/docker-report.md)

```bash
/dockerization Intermediate-repo operator and polyglot builder/I4/services/fastapi
```

Details: [I5/README.md](I5_Polyglot_service_pair/README.md) · [agent.md](I5_Polyglot_service_pair/agent.md)

### I6 — Bug Diagnosis

**Purpose:** Reproduce a reported defect, document root cause, apply a minimal fix, and prove resolution.

**Report sections:** reproduction steps → RCA table → fix summary → verification (build, tests, re-run) → [`bug-investigation-report.md`](I6_Dockerize_and_run/bug-investigation-report.md)

```bash
/bug-diagnosis ~/Downloads/bo-migration-service GET byUserId returns 200 with defaults instead of 404 for missing user
```

Details: [I6/README.md](I6_Dockerize_and_run/README.md) · [agent.md](I6_Dockerize_and_run/agent.md) · [STATUS.md](I6_Dockerize_and_run/STATUS.md)

---

## 7. Currency Conversion API Specification

I4's FastAPI service defines the contract the Node CLI calls. Hardcoded rates (per 1 USD): INR **83**, EUR **0.92**, GBP **0.79**, JPY **156**.

| HTTP | Path | Behavior |
| ---- | ---- | -------- |
| POST | `/convert` | Convert `amount` from `from` currency to `to` currency |
| GET | `/health` | Liveness — `{"status":"ok"}` |
| GET | `/` | Service metadata — `"Currency Conversion API"` |
| GET | `/currencies` | List supported currency codes |

**Request body (`POST /convert`):**

```json
{
  "amount": 100,
  "from": "USD",
  "to": "INR"
}
```

**Response:**

```json
{
  "convertedAmount": 8300
}
```

**CLI equivalent:**

```bash
node cli.js 100 USD INR
# stdout: 8300
```

I4 listens on **8000**. Run B4 on **8001** if both stacks are needed on one machine.

---

## 8. Agent Workflow Guidelines

Each I1–I6 task defines behaviour in **`agent.md`**. Cursor registers matching skills under **`.cursor/skills/`** at the repository root.

| ID | Workflow file | Slash command |
| -- | ------------- | ------------- |
| I1 | [I1/agent.md](I1_ER_diagram_from_repo/agent.md) | `/er-diagram` |
| I2 | [I2/agent.md](I2_End_to_end_flow_trace/agent.md) | `/flow-trace` |
| I3 | [I3/agent.md](I3_Small_safe_change/agent.md) | `/small-safe-change` |
| I4 | [I4/agent.md](I4/agent.md) | `/polyglot-service-pair` |
| I5 | [I5/agent.md](I5_Polyglot_service_pair/agent.md) | `/dockerization` |
| I6 | [I6/agent.md](I6_Dockerize_and_run/agent.md) | `/bug-diagnosis` |

**Session checklist:**

1. Read the project `README.md` and `STATUS.md` for scope and last verification date
2. Execute the step list in `agent.md`
3. For I1/I2 — produce `.md` report + `.mmd` diagram in the task folder
4. For I3/I6 — apply edits only in the target repo; report stays here
5. For I4 — update `validation-results.md` after pytest and CLI succeed
6. For I5 — run `docker build` / `docker run` and capture output in `docker-report.md`

---

## 9. Task Folder Structure

```
Intermediate-repo operator and polyglot builder/
├── README.md
│
├── I1_ER_diagram_from_repo/
│   ├── README.md · agent.md · er-diagram-report.md · er-diagram.mmd
│
├── I2_End_to_end_flow_trace/
│   ├── README.md · agent.md · flow-trace-report.md · flow-trace-sequence.mmd
│
├── I3_Small_safe_change/
│   ├── README.md · agent.md · change-report.md
│
├── I4/
│   ├── README.md · agent.md · STATUS.md · local-testing.md · validation-results.md
│   ├── services/fastapi/          # FastAPI app, tests, Dockerfile
│   └── clients/node-cli/          # cli.js, package.json
│
├── I5_Polyglot_service_pair/
│   ├── README.md · agent.md · STATUS.md · docker-report.md
│
└── I6_Dockerize_and_run/
    ├── README.md · agent.md · STATUS.md · bug-investigation-report.md
```

| File | Role |
| ---- | ---- |
| `README.md` | Task summary, invoke examples, evidence links |
| `agent.md` | Workflow steps and output schema |
| `STATUS.md` | Grader checklist (where present) |
| `*.mmd` | Mermaid source for diagrams (I1, I2) |
| `*-report.md` | Deliverable or investigation write-up |
| `local-testing.md` / `validation-results.md` | I4 runbook and terminal captures |
| `Dockerfile` | Lives at **service path** (I4 reference for I5) |

---

## 10. Completion Criteria Overview

| ID | Considered complete when |
| -- | ------------------------ |
| **I1** | Every entity/column cites source; relationships marked verified or inferred; `er-diagram.mmd` renders; migration conflicts noted |
| **I2** | Entry point identified; each hop has file path; externals listed; sequence diagram matches report; error paths documented |
| **I3** | Change matches single requirement; diff is minimal; tests added/updated; build + test exit 0; risk classified in report |
| **I4** | `pytest -v` passes (**9** tests); API on **8000** returns `"Currency Conversion API"`; CLI prints correct conversion |
| **I5** | Multi-stage `Dockerfile` + `.dockerignore`; image builds; container passes `/health`; steps recorded in `docker-report.md` |
| **I6** | Bug reproduced with evidence; RCA before fix; minimal patch; build/tests green; issue no longer reproduces |

See each project's `STATUS.md` for dated verification.

---

## 11. Next Steps

When I1–I6 are complete, continue to **Advanced** and **Infra & DevOps**:

| Track | Folder | Examples |
| ----- | ------ | -------- |
| Advanced | `Advanced-parallel agent operator and system builder/` | Parallel worktrees (A1), fraud scoring system (A3), repo modernization |
| Infra & DevOps | `Infra-and-DevOps/` | Terraform (D1), CI pipelines (D2), Kubernetes (D3), observability (D6) |

**Skills that extend Intermediate work:**

| Advanced / Infra | Builds on |
| ---------------- | --------- |
| A3 Fraud system | Polyglot patterns from I4 |
| D3 Kubernetes | Container images from I5 |
| I4 polyglot + A3 | Multiple HTTP services on distinct ports |

**Central docs:** [`docs/README.md`](../docs/README.md) · [`docs/project-status.md`](../docs/project-status.md) · [`docs/agent-catalog.md`](../docs/agent-catalog.md) · [`docs/runnable-projects.md`](../docs/runnable-projects.md)

---

## 12. Quick Start Guide

Get moving in this track in three paths — pick the one that matches your goal.

### Before you start

1. Open the **monorepo root** in Cursor (not a single `I*` subfolder).
2. Have Basic **B1–B3** done on a target repo if you plan to run **I1**, **I2**, **I3**, or **I6** — golden samples in this folder used `bo-migration-service`.
3. Type **`/`** in Agent chat to see all six Intermediate slash commands.

### Path A — Deep-read reports (I1 + I2)

Best when you want markdown + Mermaid deliverables without editing code.

| Step | Action |
| ---- | ------ |
| 1 | `/er-diagram ~/Downloads/bo-migration-service` |
| 2 | Open [`I1_ER_diagram_from_repo/`](I1_ER_diagram_from_repo/) — compare your output to `er-diagram-report.md` and `er-diagram.mmd` |
| 3 | `/flow-trace ~/Downloads/bo-migration-service POST /bo-migration/v1/migrateUser` |
| 4 | Review [`I2_End_to_end_flow_trace/flow-trace-report.md`](I2_End_to_end_flow_trace/flow-trace-report.md) for the expected hop-by-hop format |

Both agents write **only** into their task folders — the target repo stays untouched.

### Path B — Runnable polyglot demo (I4)

Best when you want a working API + CLI inside this monorepo with no external clone.

```bash
# API — port 8000
cd "Intermediate-repo operator and polyglot builder/I4/services/fastapi"
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt && pytest -v
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000

# CLI — second terminal
cd "Intermediate-repo operator and polyglot builder/I4/clients/node-cli"
node cli.js 100 USD INR
```

Confirm the API identifies as **Currency Conversion API** at [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs). Full runbook: [`I4/local-testing.md`](I4/local-testing.md).

Or invoke `/polyglot-service-pair` in Cursor to rebuild or extend the pair.

### Path C — Change, containerize, debug (I3 + I5 + I6)

Best after Path A — you already understand the target codebase.

| Agent | Invoke | Deliverable in this folder |
| ----- | ------ | -------------------------- |
| **I3** | `/small-safe-change ~/Downloads/bo-migration-service — <one behaviour change>` | [`I3_Small_safe_change/change-report.md`](I3_Small_safe_change/change-report.md) |
| **I5** | `/dockerization Intermediate-repo operator and polyglot builder/I4/services/fastapi` | [`I5_Polyglot_service_pair/docker-report.md`](I5_Polyglot_service_pair/docker-report.md) — Dockerfile lands beside the FastAPI app |
| **I6** | `/bug-diagnosis ~/Downloads/bo-migration-service — <symptom>` | [`I6_Dockerize_and_run/bug-investigation-report.md`](I6_Dockerize_and_run/bug-investigation-report.md) |

I3 and I6 apply patches in the **target** repo; I5 adds container files next to `I4/services/fastapi/` (see the existing `Dockerfile` there as reference).

### Verify you are done

| Task | Quick check |
| ---- | ----------- |
| I1 | `er-diagram.mmd` renders; entities cite JPA source files |
| I2 | Sequence diagram matches a single traced route |
| I3 | `mvn test` (or equivalent) green; `change-report.md` lists risk |
| I4 | pytest **9/9**; CLI prints `8300` for `100 USD INR` |
| I5 | `docker build` succeeds; container responds on `/health` |
| I6 | Bug no longer reproduces; investigation report has RCA + proof |

Browse all agents: [agent-catalog.vercel.app](https://agent-catalog.vercel.app) · runnable index: [`docs/runnable-projects.md`](../docs/runnable-projects.md)
