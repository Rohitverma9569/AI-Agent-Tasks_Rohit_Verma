---
name: multi-worktree-plan
description: >-
  Decompose a feature, bug fix, or migration into independent parallel
  workstreams with branch strategy, agent prompts per lane, merge order, and
  conflict prevention. Use when the user types /multi-worktree-plan or asks to
  split work across worktrees, parallel agents, or multi-branch delivery.
disable-model-invocation: true
---

# Multi Worktree Plan (slash command entry)

Read and follow **`Advanced-parallel agent operator and system builder/A1_Multi-worktree_parallel_plan/agent.md`** in full — that file is the source of truth for workflow, rules, and output format.

Decompose the task for the repo path and description the user provides. If only a repo path is given, ask what feature or task to split.

Write output to **`Advanced-parallel agent operator and system builder/A1_Multi-worktree_parallel_plan/multi-worktree-plan.md`** only (single `.md` file).

Plan only — do not create worktrees or branches unless the user explicitly asks.
