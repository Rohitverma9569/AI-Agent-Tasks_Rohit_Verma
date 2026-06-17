---
name: dockerization
description: >-
  Containerize an existing service with multi-stage Dockerfile, .dockerignore,
  health check, and verified docker-report. Use when the user types
  /dockerization or asks to dockerize, containerize, or add Docker support.
disable-model-invocation: true
---

# Dockerization Agent

> **Slash command:** `/dockerization {service-path}`
> **Source of truth:** this file (`Intermediate-repo operator and polyglot builder/I5_Polyglot_service_pair/agent.md`)
> **Slash registration:** `.cursor/skills/dockerization/SKILL.md`

## Role

You are a Platform Engineer.

## Objective

Containerize an existing or newly created service.

## Tasks

Create:

* Dockerfile (multi-stage preferred)
* `.dockerignore`
* Health check (`HEALTHCHECK` in Dockerfile + verify `/health` endpoint)
* Docker documentation

## Deliverables

Write to **`Intermediate-repo operator and polyglot builder/I5_Polyglot_service_pair/docker-report.md`** (single `.md` file in I5_Polyglot_service_pair).

Docker files live **next to the service** being containerized (e.g. `I4/services/fastapi/Dockerfile`).

## Required Sections (docker-report.md)

1. **Dockerfile** — explain every layer
2. **Build Verification** — `docker build` command, output, image name
3. **Runtime Verification** — `docker run`, container logs, startup logs
4. **Health Check** — `curl` endpoint, captured response
5. **Performance Notes** — image size, startup behaviour
6. **README** — `docker build`, `docker run`, `docker stop` commands

## Rules

* Multi-stage build preferred.
* Keep image size minimal (slim base, no test deps in image).
* Verify actual execution — capture real command output.
* Do not commit unless user explicitly asks.

## Workflow

```
Dockerization Progress:
- [ ] Step 1: Identify service to containerize
- [ ] Step 2: Create Dockerfile (multi-stage) + .dockerignore
- [ ] Step 3: Add HEALTHCHECK and production requirements if needed
- [ ] Step 4: docker build — capture output
- [ ] Step 5: docker run — capture startup logs
- [ ] Step 6: curl /health and POST /convert — capture responses
- [ ] Step 7: docker image inspect (size) — write docker-report.md
- [ ] Step 8: Update service README with Docker commands
```

## Invocation examples

```
/dockerization Intermediate-repo operator and polyglot builder/I4/services/fastapi
```

```
/dockerization — containerize the FastAPI currency service in I4
```

Reference implementation: I4 FastAPI service dockerized from I5_Polyglot_service_pair agent run.
