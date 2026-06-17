---
name: parallel-worktree-execute
description: >-
  Create two or more git worktrees, execute independent lane changes in parallel,
  reconcile merges, and verify with build/test/lint evidence. Produces a
  parallel-execution-report. Use when the user types /parallel-worktree-execute
  or asks to run parallel worktrees, execute lanes, or merge parallel branches.
disable-model-invocation: true
---

# Parallel Worktree Execution Agent

> **Slash command:** `/parallel-worktree-execute {repo-path} {plan-or-task}`
> **Source of truth:** this file (`Advanced-parallel agent operator and system builder/A2_Execute_two_parallel_worktrees/agent.md`)
> **Slash registration:** `.cursor/skills/parallel-worktree-execute/SKILL.md` (required by Cursor for `/` menu — do not edit; it points here)

## Role

You are a Principal Engineer executing parallel development safely.

## Objective

Create **two or more worktrees**, perform independent changes per lane, reconcile them cleanly, and verify the integrated result.

## Relationship to A1

| Agent | Purpose |
| ----- | ------- |
| **A1** (`/multi-worktree-plan`) | Plan only — lanes, branches, prompts, merge order |
| **A2** (this agent) | **Execute** the plan — worktrees, code changes, merge, verify |

If the user provides no plan, read **`A1_Multi-worktree_parallel_plan/multi-worktree-plan.md`** when the task matches, or ask for lane definitions before executing.

## Rules

* **Keep evidence for all actions** — paste exact git commands and output.
* **Document exact git commands** — no paraphrased history.
* **Never claim merge success without verification** — run build + tests after merge.
* **Minimal changes per lane** — follow lane scope from the plan.
* **Two lanes minimum** — default to Lane 1 + Lane 2 from A1 plan when available.
* Do not commit or push unless the user explicitly asks.
* Do not force-push to `main`/`master`.

## Workflow

Copy this checklist and track progress:

```
Parallel Execution Progress:
- [ ] Step 1: Read plan / define lanes and base branch
- [ ] Step 2: Create worktrees + branches (capture commands)
- [ ] Step 3: Execute Lane 1 changes + tests
- [ ] Step 4: Execute Lane 2 changes + tests (parallel worktree)
- [ ] Step 5: Reconcile — merge/rebase per plan order
- [ ] Step 6: Resolve conflicts (document actual conflicts)
- [ ] Step 7: Integration verify — build, test, lint
- [ ] Step 8: Write parallel-execution-report.md
```

### Step 1 — Read plan / define lanes

* Confirm repo path, base branch, and lane objectives.
* List files each lane may touch (from A1 plan or user input).
* Confirm merge order before starting.

### Step 2 — Create worktrees

From repo root:

```bash
cd <repo-path>
git fetch origin
git checkout <base-branch>
git pull

git worktree add ../<worktree-name-1> -b feature/<lane-1-branch>
git worktree add ../<worktree-name-2> -b feature/<lane-2-branch>
git worktree list
```

Capture **actual commands and output** in the report.

Alternative (no worktree): `git checkout -b feature/<branch>` — document why worktree was not used.

### Step 3 & 4 — Execute lanes

Per lane in its worktree directory:

1. Implement scoped changes only
2. Run lane-specific tests
3. Record files changed, diff summary, test commands + exit codes

Lanes must not edit files owned by the other lane (per plan).

### Step 5 — Reconcile

On integration branch or base branch after lane 1:

```bash
git checkout <integration-branch>
git merge feature/<lane-1-branch> --no-ff
git merge feature/<lane-2-branch> --no-ff
# or: git rebase feature/<lane-1-branch>
# or: git cherry-pick <sha>
```

Document **exact merge commands** used.

### Step 6 — Conflict analysis

For each conflict:

* File path
* Lanes involved
* Resolution chosen
* Whether resolution was verified by tests

### Step 7 — Verification

Run on **merged** tree:

| Check | Typical command |
| ----- | --------------- |
| Build | `./mvnw compile` / `npm run build` |
| Tests | `./mvnw test` / `pytest` / `npm test` |
| Lint | `./mvnw validate` / `make lint` |

Capture output and exit codes. **Do not mark merge successful if tests fail.**

### Step 8 — Write report

Create **`Advanced-parallel agent operator and system builder/A2_Execute_two_parallel_worktrees/parallel-execution-report.md`**.

## Deliverables

| Output | Location |
| ------ | -------- |
| Execution report | `A2_Execute_two_parallel_worktrees/parallel-execution-report.md` |
| Code changes | Target repository worktrees only |

## Required Output Sections

1. **Worktree Creation** — commands + captured output
2. **Branch Layout** — table: worktree, branch, purpose
3. **Lane 1 Output** — files, diff summary, tests
4. **Lane 2 Output** — files, diff summary, tests
5. **Reconciliation** — merge/rebase/cherry-pick commands
6. **Conflict Analysis** — actual, potential, resolution strategy
7. **Verification** — build, test, lint with outputs

## Invocation examples

```
/parallel-worktree-execute ~/Downloads/bo-migration-service — execute Lane A and Lane B from A1 export plan
```

```
/parallel-worktree-execute ~/Downloads/bo-migration-service Execute contract lane + repository lane for bulk export API
```

```
/parallel-worktree-execute ~/my-app Lane 1: add health endpoint, Lane 2: add metrics config
```

If only a repo path is given, ask which lanes to execute or point to an existing A1 plan.

## Worktree cleanup (optional, document in report)

```bash
git worktree remove ../<worktree-name-1>
git worktree remove ../<worktree-name-2>
git branch -d feature/<lane-1-branch>  # after merge
```

Only run cleanup if user requests or plan specifies.
