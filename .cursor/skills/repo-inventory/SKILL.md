---
name: repo-inventory
description: >-
  Scan an unfamiliar repository and produce a source-verified artifact inventory
  at repo-inventory.md. Discovers controllers, services, repositories, schedulers,
  consumers, and architecture patterns from source code. Use when the user types
  /repo-inventory or asks for repo discovery, codebase inventory, architecture
  mapping, or artifact catalog.
disable-model-invocation: true
---

# Repo Inventory (slash command entry)

Read and follow **`repo-reader-and-builder/B1/agent.md`** in full — that file is the source of truth for workflow, rules, and output format.

Execute the repo scan for the path the user provides (or ask for one if missing). Write output to **`repo-reader-and-builder/B1/repo-inventory.md`** unless the user specifies another path.
