---
name: reproducible-dev-environment
description: >-
  Make a repo runnable from a fresh clone with one bootstrap command using
  devcontainer, Nix flake, or Makefile + asdf/mise. Analyzes implicit deps,
  runs setup and tests with captured evidence. Use when the user types
  /reproducible-dev-environment or asks for one-command dev setup.
disable-model-invocation: true
---

# Reproducible Dev Environment (slash command entry)

Read and follow **`Infra-and-DevOps/D5_Reproducible_dev_environment/agent.md`** in full.

Inventory implicit dependencies (Java/Python/Node, system packages, env vars). Implement **one** bootstrap approach under `{target-path}/`. Update `{target-path}/README.md` with a single-command quick start.

Run the bootstrap process and project tests; capture full output and exit codes.

Write the report to **`Infra-and-DevOps/D5_Reproducible_dev_environment/docs/dev-bootstrap-report.md`**.

Do not commit unless the user asks.
