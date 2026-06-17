---
name: parallel-worktree-execute
description: >-
  Create two or more git worktrees, execute independent lane changes in parallel,
  reconcile merges, and verify with build/test/lint evidence. Produces a
  parallel-execution-report. Use when the user types /parallel-worktree-execute
  or asks to run parallel worktrees, execute lanes, or merge parallel branches.
disable-model-invocation: true
---

# Parallel Worktree Execute (slash command entry)

Read and follow **`Advanced-parallel agent operator and system builder/A2_Execute_two_parallel_worktrees/agent.md`** in full — that file is the source of truth for workflow, rules, and output format.

Execute parallel worktrees for the repo and lanes the user provides. If a plan exists in **`A1_Multi-worktree_parallel_plan/multi-worktree-plan.md`**, use it as the lane definition.

Write output to **`Advanced-parallel agent operator and system builder/A2_Execute_two_parallel_worktrees/parallel-execution-report.md`** only (single `.md` file).

Capture exact git commands and verification output. Never claim merge success without build + test proof.

Do not commit or push unless the user explicitly asks.
