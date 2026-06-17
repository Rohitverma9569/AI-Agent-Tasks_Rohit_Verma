---
name: docker-compose-stack
description: >-
  Build a local multi-service docker-compose stack (API, database, worker) with
  real inter-service communication, seed script, e2e tests, and evidence-backed
  verification. Use when the user types /docker-compose-stack or asks for
  docker-compose local stack, multi-service compose, or compose e2e proof.
disable-model-invocation: true
---

# Docker Compose Stack Agent (D2)

> **Slash command:** `/docker-compose-stack [{target-path}] [{stack-hint}]`
> **Source of truth:** this file (`Infra-and-DevOps/D2_Docker-Compose_Stack/agent.md`)
> **Slash registration:** `.cursor/skills/docker-compose-stack/SKILL.md`

## Role

Platform Engineer building a complete local multi-service environment.

## Objective

Create a **docker-compose** stack consisting of:

* **API Service**
* **Database**
* **Worker Service**

All components must **communicate successfully** — no mocked services.

## Target paths

| Artifact | Location |
| -------- | -------- |
| Agent spec | `Infra-and-DevOps/D2_Docker-Compose_Stack/agent.md` |
| Stack deliverables | `{target-path}/` (user repo or greenfield directory) |
| Report | `Infra-and-DevOps/D2_Docker-Compose_Stack/docs/docker-compose-report.md` |

## Deliverables (created on run, under `{target-path}/`)

| File | Purpose |
| ---- | ------- |
| `docker-compose.yml` | Orchestrates API, DB, worker + networks/volumes |
| `Dockerfile` (per service) | One Dockerfile per buildable service (API, worker) |
| Seed script | Populates database with initial data |
| `run-e2e-tests.sh` | Single-command end-to-end test runner |
| `README.md` | Setup, usage, troubleshooting |

Optional supporting files (as needed): `.dockerignore`, service source dirs, `scripts/seed.sh`, healthcheck configs.

## Stack design requirements

### API Service

* Exposes HTTP endpoints (health + at least one data endpoint)
* Connects to database (read/write)
* Documented port mapping in compose

### Database

* Real database container (PostgreSQL, MySQL, Redis+Postgres, etc. — pick to match target repo or user hint)
* Persistent volume for data
* Credentials via compose environment (not hardcoded secrets in source)

### Worker Service

* Polls queue, cron, or DB-backed job table — **must touch database**
* May call API (document if applicable)
* Starts after DB is healthy (`depends_on` + healthcheck)

### Communication

| Path | Required proof |
| ---- | -------------- |
| API → Database | Logs or e2e test showing query/write |
| Worker → Database | Logs or e2e test showing job processing |
| Worker → API | Required if worker calls API; otherwise mark N/A with reason |

## Workflow

Copy this checklist and track progress:

```
Docker Compose Stack Progress:
- [ ] Step 1: Identify target path, repo stack, and service boundaries
- [ ] Step 2: Design compose topology — services, networks, volumes, env
- [ ] Step 3: Write Dockerfiles, docker-compose.yml, seed script, README
- [ ] Step 4: Write run-e2e-tests.sh (executable)
- [ ] Step 5: docker compose up — capture startup logs
- [ ] Step 6: Run seed script — capture output
- [ ] Step 7: Run ./run-e2e-tests.sh — capture pass/fail summary
- [ ] Step 8: Capture communication proof from logs
- [ ] Step 9: Recovery test — compose down -v, compose up, re-seed, re-test
- [ ] Step 10: Write docs/docker-compose-report.md with evidence
```

### Step 1: Identify target path

* `{target-path}` — existing repo (containerize its services) or new folder in workspace.
* Read repo manifests (`pom.xml`, `package.json`, `requirements.txt`) to align API/worker/DB with project stack.
* If no repo given, ask or create a minimal greenfield stack under a named directory.

### Step 2: Design topology

Document in report:

* Service names and images
* Network(s) — all services on shared bridge network
* Volume(s) for DB persistence
* Environment variables and connection strings
* Healthchecks and startup order

### Step 3–4: Implement deliverables

* **No mocked services** — real DB, real API process, real worker process.
* Use `docker compose` (v2) syntax; support both `docker compose` and document `docker-compose` alias if needed.
* Seed script must be idempotent or safe to re-run after recovery test.
* `run-e2e-tests.sh` must exit non-zero on failure.

### Step 5–9: Verification (evidence required)

Execute and capture **actual** terminal output:

#### Bring up stack

```bash
cd {target-path}
docker compose up -d --build
docker compose logs --no-color
```

Capture: startup output, health status, any crash loops.

#### Seed data

```bash
./scripts/seed.sh
# or documented seed command
```

Capture: rows inserted, success messages, errors.

#### End-to-end testing

```bash
chmod +x run-e2e-tests.sh
./run-e2e-tests.sh
```

Capture: full test output and pass/fail summary.

#### Communication proof

From logs or test output, show evidence for:

* API → Database (connection, query result)
* Worker → Database (job read/write)
* Worker → API (HTTP call logs, if applicable)

```bash
docker compose logs api worker db
```

#### Recovery test

```bash
docker compose down -v
docker compose up -d --build
# re-run seed + e2e
```

Prove stack rebuilds from zero with same test results.

## Report format

Write `Infra-and-DevOps/D2_Docker-Compose_Stack/docs/docker-compose-report.md`:

```markdown
# Docker Compose Stack Report

> **Target:** `{target-path}`
> **Generated:** {YYYY-MM-DD}
> **Agent:** D2 — Docker Compose Stack

---

## Stack Summary

{Services, ports, networks, volumes, communication diagram}

---

## Deliverables

| File | Path | Status |
| ---- | ---- | ------ |

---

## Bring Up — docker compose up

| Field | Value |
| ----- | ----- |
| Command | |
| Exit code | |
| Output | |

---

## Seed Data

| Field | Value |
| ----- | ----- |
| Command | |
| Exit code | |
| Output | |

---

## End-to-End Tests — ./run-e2e-tests.sh

| Field | Value |
| ----- | ----- |
| Command | |
| Exit code | |
| Output | |
| Summary | X passed, Y failed |

---

## Communication Proof

### API → Database
{Log excerpt or test evidence}

### Worker → Database
{Log excerpt or test evidence}

### Worker → API
{Log excerpt or N/A}

---

## Recovery Test

| Step | Command | Exit code | Result |
| ---- | ------- | --------- | ------ |

---

## Risks and Assumptions

### Verified
{Facts proven through execution}

### Inferred
{Assumptions}

### Unknown
{Not verified}
```

## Verification rules

Always separate **Verified**, **Inferred**, and **Unknown**. Never claim tests passed without captured output.

## Rules

* **No mocked services** — real containers, real network, real DB protocol.
* **Services must actually communicate** — prove with logs or e2e tests.
* **Evidence required** for every verification step.
* Do not commit unless the user asks.
* Tear down containers after verification if running in CI-like environment (`docker compose down`) unless user wants stack left running.

## Success criteria

Task complete only when:

* All deliverables exist under `{target-path}/`
* `docker compose up` succeeds
* Seed script runs successfully
* `./run-e2e-tests.sh` passes (exit 0)
* Communication proof captured in report
* Recovery test passes (stack rebuilds from zero)
* `docs/docker-compose-report.md` written with evidence

Do not declare success without proof.

## Invocation examples

```
/docker-compose-stack ~/Downloads/bo-migration-service
```

```
/docker-compose-stack . — greenfield API + Postgres + worker
```

```
/docker-compose-stack ../Advanced-parallel agent operator and system builder/A3_Fraud_Score_system
```

If no target path is given, ask or use the most recent repo in context.
