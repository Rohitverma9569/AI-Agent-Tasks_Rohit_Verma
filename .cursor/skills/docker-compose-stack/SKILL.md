---
name: docker-compose-stack
description: >-
  Build a local docker-compose stack with API, database, and worker services
  that communicate for real. Includes seed script, run-e2e-tests.sh, and
  evidence-backed verification report. Use when the user types
  /docker-compose-stack or asks for multi-service compose stack with e2e proof.
disable-model-invocation: true
---

# Docker Compose Stack (slash command entry)

Read and follow **`Infra-and-DevOps/D2_Docker-Compose_Stack/agent.md`** in full.

Create the stack under `{target-path}/` (docker-compose.yml, Dockerfiles, seed script, `run-e2e-tests.sh`, README). Run bring-up, seed, e2e, communication proof, and recovery tests with captured evidence.

Write the report to **`Infra-and-DevOps/D2_Docker-Compose_Stack/docs/docker-compose-report.md`**.

Do not commit unless the user asks.
