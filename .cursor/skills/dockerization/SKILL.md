---
name: dockerization
description: >-
  Containerize an existing service with multi-stage Dockerfile, .dockerignore,
  health check, and verified docker-report. Use when the user types
  /dockerization or asks to dockerize, containerize, or add Docker support.
disable-model-invocation: true
---

# Dockerization (slash command entry)

Read and follow **`Intermediate-repo operator and polyglot builder/I5_Polyglot_service_pair/agent.md`** in full — that file is the source of truth for workflow, rules, and output format.

Containerize the service path the user provides (or default to I4 FastAPI if unclear). Write output to **`Intermediate-repo operator and polyglot builder/I5_Polyglot_service_pair/docker-report.md`**.

Place `Dockerfile` and `.dockerignore` alongside the containerized service.

Do not commit unless the user explicitly asks.
