---
name: bug-diagnosis
description: >-
  Reproduce, diagnose, fix, and verify a bug in an unfamiliar repository.
  Produces a bug-investigation-report with root cause analysis, minimal fix,
  and build/test evidence. Use when the user types /bug-diagnosis or asks to
  debug, investigate, or fix a bug with verification proof.
disable-model-invocation: true
---

# Bug Diagnosis (slash command entry)

Read and follow **`repo operator and polyglot builder/I6/agent.md`** in full — that file is the source of truth for workflow, rules, and output format.

Execute the bug investigation for the repo path and bug description the user provides. If only a repo path is given, ask for the bug description and how to reproduce it.

Write output to **`repo operator and polyglot builder/I6/bug-investigation-report.md`** only (single `.md` file).

Apply code fixes in the **target repository** — not in I6. Do not commit unless the user explicitly asks.
