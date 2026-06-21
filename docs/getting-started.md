# Getting Started

This guide walks you through running agents in **Cursor Desktop** — from setup to your first invocation.

---

## Prerequisites

| Requirement | Notes |
| ----------- | ----- |
| **Cursor Desktop** | Agents run inside Cursor's AI chat panel |
| **This repository cloned locally** | Skills are loaded from `.cursor/skills/` |
| **Target repo** (for analysis agents) | Path to the codebase you want scanned |
| **Runtime tools** (for builder agents only) | Python 3.9+, Node.js 22+, Rust 1.70+ as needed |

---

## Step 1 — Open the project in Cursor

```bash
git clone https://github.com/Rohitverma9569/AI-Agent-Tasks_Rohit_Verma.git
cd "AI-Agents-Tasks -PML"
cursor .
```

Cursor automatically discovers skills in `.cursor/skills/`. Each skill file points to a detailed `agent.md` specification.

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
| **Builders** (B4, B5, B6, I4, A3) | Optional refinement | `/fastapi-builder` or `/fastapi-builder add health check` |
| **Infra** (D1–D6) | Target path + stack hint | `/terraform-plan services/api aws` |
| **Debugging** (I6) | Repo path + bug description | `/bug-diagnosis . GET /balance returns 500` |

Use `.` for the current workspace root.

---

## Step 4 — Review the output

Each agent writes deliverables to its own folder:

| Agent | Primary output |
| ----- | -------------- |
| B1 Repo Inventory | `B1_Repo_Artifact_Inventory/repo-inventory.md` |
| B2 API Endpoint Map | `B2_API_endpoint_map/api-endpoint-map.md` |
| B3 Test Discovery | `B3_Test_discovery_and_execution/test-discovery-report.md` |
| I1 ER Diagram | `I1_ER_diagram_from_repo/er-diagram-report.md` |
| A1 Multi-worktree Plan | `A1_Multi-worktree_parallel_plan/multi-worktree-plan.md` |

Open the generated file in Cursor to review results.

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

### Workflow 2 — Build a greenfield API

```
/fastapi-builder
```

Then validate locally — see [Runnable Projects](./runnable-projects.md#b4--fastapi-transaction-api).

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

---

## Troubleshooting

| Problem | Solution |
| ------- | -------- |
| Slash command not in menu | Restart Cursor; confirm `.cursor/skills/` exists in workspace root |
| Agent asks for a path | Provide absolute or relative path to the target repo |
| Builder agent skips tests | Re-invoke with: _"Run pytest/npm test and update validation-results.md with terminal output"_ |
| Wrong agent picked | Use the exact slash command from the [Agent Catalog](./agent-catalog.md) |

---

## Next steps

- Browse all agents → [Agent Catalog](./agent-catalog.md)
- Run built demos → [Runnable Projects](./runnable-projects.md)
- Explore agents in the browser → [Agent Catalog web app](./README.md#agent-catalog-web-app)
