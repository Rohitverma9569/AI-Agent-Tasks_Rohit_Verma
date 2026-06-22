# Getting Started

This guide walks you through running agents in **Cursor Desktop** — from setup to your first invocation.

| | |
| --- | --- |
| **Repository** | [github.com/Rohitverma9569/AI-Agent-Tasks_Rohit_Verma](https://github.com/Rohitverma9569/AI-Agent-Tasks_Rohit_Verma) |
| **Agents** | 24 registered slash commands · [24 / 24 complete](./project-status.md) |
| **Agent catalog (live)** | **[agent-catalog.vercel.app](https://agent-catalog.vercel.app)** |

> **Full environment setup** (Cursor skills + catalog UI + terminal CLI): see [Complete Setup](./complete-setup.md).

---

## Prerequisites

| Requirement | Notes |
| ----------- | ----- |
| **Cursor Desktop** | Agents run inside Cursor's AI chat panel |
| **This repository cloned locally** | Skills load from `.cursor/skills/` |
| **Target repo** (for analysis agents) | Path to the codebase you want scanned |
| **Runtime tools** (for runnable demos only) | Python 3.9+, Node.js 20+ (22+ for A3), Rust 1.70+ as needed |

See [Complete Setup — Prerequisites](./complete-setup.md#-prerequisites) for version checks and optional runtimes.

---

## Step 1 — Open the project in Cursor

```bash
git clone https://github.com/Rohitverma9569/AI-Agent-Tasks_Rohit_Verma.git
cd "AI-Agents-Tasks -PML"
cursor .
```

Open the **repo root** (not `agent-catalog/`). Cursor automatically discovers skills in `.cursor/skills/`. Each skill points to a detailed `agent.md` specification.

**Optional — browse agents in the browser:**

- **Deployed:** [agent-catalog.vercel.app](https://agent-catalog.vercel.app) — no install required
- **Local:** `cd agent-catalog && npm install && npm run dev` → [http://localhost:3000](http://localhost:3000)

---

## Step 2 — Invoke an agent

There are **three ways** to run an agent:

### Option A — Slash command (recommended)

Type `/` in the Cursor chat input to open the command menu, then pick an agent or type its name:

```
/repo-inventory ~/projects/my-backend
```

```
/api-endpoint-map .
```

```
/fastapi-builder
```

All 24 commands are listed in the [Agent Catalog (reference)](./agent-catalog.md) and on the [live catalog](https://agent-catalog.vercel.app).

### Option B — Natural language

Describe what you need. Cursor matches your request to the right skill:

```
Scan this repo and produce an artifact inventory
```

```
Map all REST endpoints in the Backend folder
```

### Option C — @ mention the agent file

Reference the source-of-truth file directly:

```
@Basic-repo-reader-and-builder/B1_Repo_Artifact_Inventory/agent.md
Analyze the repo at /Users/me/projects/payments-api
```

---

## Step 3 — Provide context

Most agents need a **target path** or **task description**. Include them in the same message:

| Agent type | What to provide | Example |
| ---------- | --------------- | ------- |
| **Analysis** (B1, B2, B3, I1, I2) | Repo path | `/repo-inventory ~/code/order-service` |
| **Planning** (A1, A4) | Repo path + task | `/multi-worktree-plan . Add pagination to users API` |
| **Builders** (B4, B5, B6, I4, A3) | Optional refinement | `/fastapi-builder` or `/nodejs-builder add health check` |
| **Infra** (D1–D6) | Target path + stack hint | `/terraform-plan services/api aws` |
| **Debugging** (I6) | Repo path + bug description | `/bug-diagnosis . GET /balance returns 500` |

Use `.` for the current workspace root.

---

## Step 4 — Review the output

Each agent writes deliverables to its own folder. Every project includes a **README**; runnable agents also ship **STATUS**, **local-testing**, and **validation-results** evidence.

| Agent | Primary output | Project docs |
| ----- | -------------- | ------------ |
| B1 Repo Inventory | `repo-inventory.md` | [README](../Basic-repo-reader-and-builder/B1_Repo_Artifact_Inventory/README.md) |
| B2 API Endpoint Map | `api-endpoint-map.md` | [README](../Basic-repo-reader-and-builder/B2_API_endpoint_map/README.md) |
| B3 Test Discovery | `test-discovery-report.md` | [README](../Basic-repo-reader-and-builder/B3_Test_discovery_and_execution/README.md) |
| B4 FastAPI Builder | Runnable API + `validation-results.md` | [local-testing](../Basic-repo-reader-and-builder/B4_FastAPI_greenfield_service/local-testing.md) |
| B5 Node.js Builder | Runnable API + `validation-results.md` | [local-testing](../Basic-repo-reader-and-builder/B5_Node.js_greenfield_API/local-testing.md) |
| B6 Rust CLI | Runnable CLI + `validation-results.md` | [local-testing](../Basic-repo-reader-and-builder/B6_Rust_greenfield/local-testing.md) |
| I1 ER Diagram | `er-diagram-report.md` | [README](../Intermediate-repo%20operator%20and%20polyglot%20builder/I1_ER_diagram_from_repo/README.md) |
| I4 Polyglot Pair | FastAPI + Node CLI | [local-testing](../Intermediate-repo%20operator%20and%20polyglot%20builder/I4/local-testing.md) |
| A1 Multi-worktree Plan | `multi-worktree-plan.md` | [README](../Advanced-parallel%20agent%20operator%20and%20system%20builder/A1_Multi-worktree_parallel_plan/README.md) |
| A3 Fraud Score System | Polyglot services | [README](../Advanced-parallel%20agent%20operator%20and%20system%20builder/A3_Fraud_Score_system/README.md) |

Open the generated file in Cursor to review results. Full index: [docs/README.md](./README.md#all-projects).

---

## Typical workflows

### Workflow 1 — Understand an unfamiliar repo

Run these in order:

```
/repo-inventory /path/to/repo
/api-endpoint-map /path/to/repo
/test-discovery /path/to/repo
/er-diagram /path/to/repo
/flow-trace /path/to/repo POST /orders
```

### Workflow 2 — Build or run a greenfield demo

Invoke a builder agent, then validate locally:

| Project | Command | Start guide |
| ------- | ------- | ----------- |
| B4 FastAPI | `/fastapi-builder` | [local-testing](../Basic-repo-reader-and-builder/B4_FastAPI_greenfield_service/local-testing.md) |
| B5 Node.js | `/nodejs-builder` | [local-testing](../Basic-repo-reader-and-builder/B5_Node.js_greenfield_API/local-testing.md) |
| B6 Rust CLI | `/rust-log-analyzer` | [local-testing](../Basic-repo-reader-and-builder/B6_Rust_greenfield/local-testing.md) |
| I4 Polyglot | `/polyglot-service-pair` | [local-testing](../Intermediate-repo%20operator%20and%20polyglot%20builder/I4/local-testing.md) |
| A3 Fraud System | `/fraud-score-system` | [A3 README](../Advanced-parallel%20agent%20operator%20and%20system%20builder/A3_Fraud_Score_system/README.md) |

Full run instructions: [Runnable Projects](./runnable-projects.md).

> **Port note:** B4 uses **8001**, I4 and A3 API use **8000**, B5 uses **localhost:3000**. See [runnable-projects — port conflicts](./runnable-projects.md#-overview).

### Workflow 3 — Parallel feature delivery

```
/multi-worktree-plan . Add user notifications feature
/parallel-worktree-execute . @A1_Multi-worktree_parallel_plan/multi-worktree-plan.md
```

### Workflow 4 — Ship infra for a service

```
/terraform-plan services/api
/docker-compose-stack services/api
/ci-pipeline services/api github
/kubernetes-deployment services/api minikube
```

---

## Agent behavior rules

All agents share these conventions:

- **Source-verified** — Analysis agents read actual code; they do not guess from README alone.
- **Evidence-based** — Builder agents run tests and capture output in `validation-results.md`.
- **Plan-only by default** — Planning agents (A1) do not create branches unless you ask.
- **Scoped output** — Reports are written next to the agent's `agent.md` unless you specify another path.
- **Evaluation docs** — Each project ships README (+ STATUS / local-testing where applicable) for review and grading.

---

## Troubleshooting

| Problem | Solution |
| ------- | -------- |
| Slash command not in menu | Restart Cursor; confirm `.cursor/skills/` exists in workspace root — see [Complete Setup](./complete-setup.md) |
| Agent asks for a path | Provide absolute or relative path to the target repo |
| Builder agent skips tests | Re-invoke with: _"Run pytest/npm test and update validation-results.md with terminal output"_ |
| Wrong agent picked | Use the exact slash command from the [Agent Catalog](./agent-catalog.md) or [live catalog](https://agent-catalog.vercel.app) |
| API won't start / port in use | Check [Runnable Projects — port conflicts](./runnable-projects.md#-overview); B4 → 8001, B5 → `localhost:3000` |
| Catalog UI out of date | `cd agent-catalog && npm run generate` — see [Complete Setup](./complete-setup.md) |

---

## Next steps

| Goal | Document |
| ---- | -------- |
| Full Cursor + catalog + CLI setup | [Complete Setup](./complete-setup.md) |
| Browse all 24 agents | [Agent Catalog (live)](https://agent-catalog.vercel.app) · [Reference](./agent-catalog.md) |
| Run API / CLI demos | [Runnable Projects](./runnable-projects.md) |
| Assignment progress & evidence | [Project Status](./project-status.md) |
| Documentation hub | [docs/README.md](./README.md) |
