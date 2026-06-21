# D2 — Docker Compose Stack

Multi-service local stack: **API** (Node.js/Express) + **PostgreSQL** + **Worker** (job processor).

```bash
cd Infra-and-DevOps/D2_Docker-Compose_Stack
docker-compose up -d --build && ./scripts/seed-data.sh && ./scripts/run-e2e-tests.sh
```

```
Client → API (:8080) → PostgreSQL ← Worker (polls pending jobs)
              ↑__________________________|
                    shared app-network
```

| | |
| --- | --- |
| **Agent** | [`agent.md`](agent.md) · slash command `/docker-compose-stack` |
| **Reports** | [`docs/docker-compose-report.md`](docs/docker-compose-report.md) · [`docs/run-status.md`](docs/run-status.md) |

---

## Start with the Agent (recommended)

Open **Cursor Agent chat** and run:

| Scenario | Command |
| -------- | ------- |
| **This stack** | `/docker-compose-stack Infra-and-DevOps/D2_Docker-Compose_Stack` |
| **Greenfield** | `/docker-compose-stack . — greenfield API + Postgres + worker` |
| **Another project** | `/docker-compose-stack ~/path/to/your-service` |

The agent reads [`agent.md`](agent.md) and automatically:

1. Creates or updates stack files (`docker-compose.yml`, Dockerfiles, scripts)
2. Runs `docker-compose build` and `docker-compose up -d`
3. Seeds the database and runs `./scripts/run-e2e-tests.sh`
4. Captures communication logs and recovery test evidence
5. Writes [`docs/docker-compose-report.md`](docs/docker-compose-report.md)

> The agent does not commit changes unless you explicitly ask.

---

## Expected Results

Use this checklist to confirm the stack is healthy.

### Containers — `docker-compose ps`

| Container | Expected status | Expected ports |
| --------- | --------------- | -------------- |
| `d2-api` | Up **(healthy)** | `0.0.0.0:8080→8080/tcp` |
| `d2-postgres` | Up **(healthy)** | `5432/tcp` (internal) |
| `d2-worker` | Up | — |

### Health check

```bash
curl http://localhost:8080/health
```

**Expected response:**

```json
{
  "status": "ok",
  "database": "connected"
}
```

### End-to-end tests

```bash
./scripts/run-e2e-tests.sh
```

**Expected summary:**

```
Test Summary: 7 passed, 0 failed
```

Exit code: **0**

| # | Expected test outcome |
| - | --------------------- |
| 1–2 | `GET /health` returns ok + database connected |
| 3 | `GET /jobs` returns jobs array |
| 4 | `POST /jobs` creates a new job |
| 5–6 | Worker completes the job within 30s with processed result |
| 7 | At least one seed job shows `completed` status |

### Communication logs — `docker-compose logs api worker`

| Path | Expected log line |
| ---- | ----------------- |
| API → Database | `[api] connected to PostgreSQL at db` |
| API → Database | `[api] POST /jobs — created job id=... in database` |
| Worker → Database | `[worker] claimed job id=... from database` |
| Worker → Database | `[worker] completed job id=... result="processed:..."` |

Full verification details and latest run status: [`docs/run-status.md`](docs/run-status.md)

---

## Manual Start (without agent)

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) with Compose v2 (`docker compose`) or v1 (`docker-compose`)
- Bash, curl

### Build

```bash
cd Infra-and-DevOps/D2_Docker-Compose_Stack
docker-compose build
```

### Start

```bash
docker-compose up -d
docker-compose ps
```

Services:

| Service | Container | Port | Purpose |
| ------- | --------- | ---- | ------- |
| db | d2-postgres | 5432 (internal) | PostgreSQL 16 with schema from `db/init.sql` |
| api | d2-api | 8080 | REST API — health, list/create jobs |
| worker | d2-worker | — | Polls DB for pending jobs, marks completed |

Wait until all containers are healthy (~15–30s on first start).

### Seed

```bash
chmod +x scripts/*.sh
./scripts/seed-data.sh
```

Expected: `INSERT 0 3` and `Seed complete — total jobs in database: 3`

The worker will pick up and process seed jobs automatically.

### Test

```bash
./scripts/run-e2e-tests.sh
```

Optional:

```bash
API_URL=http://localhost:8080 ./scripts/run-e2e-tests.sh
MAX_WAIT_SEC=60 ./scripts/run-e2e-tests.sh
```

### Logs

```bash
docker-compose logs
docker-compose logs api worker db
docker-compose logs -f api worker
```

### Teardown

```bash
./scripts/teardown.sh
# equivalent to: docker-compose down -v
```

---

## API Endpoints

| Method | Path | Description |
| ------ | ---- | ----------- |
| GET | `/health` | Health + DB connectivity |
| GET | `/jobs` | List all jobs |
| GET | `/jobs/:id` | Get job by ID |
| POST | `/jobs` | Create job `{ "title": "...", "payload": {} }` |

---

## Environment

| Variable | Default |
| -------- | ------- |
| POSTGRES_USER | appuser |
| POSTGRES_PASSWORD | appsecret |
| POSTGRES_DB | appdb |
| API_PORT | 8080 |

---

## Troubleshooting

| Issue | Fix |
| ----- | --- |
| API not ready | Wait for `docker-compose ps` to show api healthy |
| Seed fails | Ensure stack is up: `docker-compose ps` |
| E2E timeout | `MAX_WAIT_SEC=60 ./scripts/run-e2e-tests.sh` |
| Port 8080 in use | Set `API_PORT=8081` in `.env` and update `API_URL` for tests |
| `docker compose` not found | Use `docker-compose` (v1) instead |

---

## Project Layout

```
D2_Docker-Compose_Stack/
├── docker-compose.yml      # API, PostgreSQL, worker orchestration
├── api/                    # Express REST service
│   ├── Dockerfile
│   └── src/index.js
├── worker/                 # DB-backed job processor
│   ├── Dockerfile
│   └── src/index.js
├── db/init.sql             # Schema + seed tables
├── scripts/
│   ├── seed-data.sh        # Insert initial jobs
│   ├── run-e2e-tests.sh    # End-to-end verification
│   └── teardown.sh         # docker-compose down -v
├── docs/
│   ├── docker-compose-report.md
│   └── run-status.md
└── agent.md                # D2 agent spec
```

---

## Documentation

| Document | Description |
| -------- | ----------- |
| [`agent.md`](agent.md) | D2 agent spec and full workflow |
| [`docs/docker-compose-report.md`](docs/docker-compose-report.md) | Agent verification report with recovery test |
| [`docs/run-status.md`](docs/run-status.md) | Agent guide, expected results, and latest run status |
