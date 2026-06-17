---
name: small-safe-change
description: >-
  Implement one focused, low-risk change in an unfamiliar repository with minimal
  diff, test updates, build/test execution evidence, and a change-report. Use when
  the user types /small-safe-change or asks for a small safe change, surgical fix,
  or minimal-risk patch with verification.
disable-model-invocation: true
---

# Small Safe Change (slash command entry)

Read and follow **`Intermediate-repo operator and polyglot builder/I3_Small_safe_change/agent.md`** in full — that file is the source of truth for workflow, rules, and output format.

Execute the minimal change for the repo path and change description the user provides. If only a repo path is given, ask what single change to implement.

Write output to **`Intermediate-repo operator and polyglot builder/I3_Small_safe_change/change-report.md`** only (single `.md` file — no separate `.mmd`).

Do not commit unless the user explicitly asks.
