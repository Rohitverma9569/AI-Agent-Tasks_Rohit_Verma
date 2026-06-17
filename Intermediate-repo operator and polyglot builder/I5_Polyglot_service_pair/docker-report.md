# Docker Report

> **Service containerized:** `/Users/rohitverma/Downloads/bo-migration-service`  
> **Image name:** `bo-migration-service:latest`  
> **Generated:** 2026-06-17  
> **Stack:** Java 17 · Spring Boot 3.2 · Maven multi-stage build

---

## Service Summary

| Item | Value |
| ---- | ----- |
| Application | `bo-migration-service` (user migration API) |
| Build tool | Maven (`migration-service-1.0.0.jar`) |
| Server port | `8080` |
| Health endpoint | `GET /health` → `OK` |
| Actuator | `GET /actuator/health` (aggregated db/redis when up) |
| External deps | MySQL, Redis (required at runtime) |

---

## Dockerfile

**Location:** `~/Downloads/bo-migration-service/Dockerfile`

| Layer / Stage | Instruction | Purpose |
| ------------- | ----------- | ------- |
| **Stage 1: `build`** | `FROM maven:3.9.6-eclipse-temurin-17 AS build` | Maven + JDK 17 to compile; not shipped in final image |
| | `COPY pom.xml`, `COPY src` | Minimal layer caching — deps resolve when pom changes |
| | `RUN mvn -B -DskipTests package` | Produces `target/migration-service-1.0.0.jar` |
| **Stage 2: `runtime`** | `FROM eclipse-temurin:17-jre-jammy AS runtime` | JRE-only runtime (no Maven/JDK) |
| | `ARG git_commit_id`, `ARG env_name` | Build-time labels for traceability |
| | `ENV SPRING_PROFILES_ACTIVE` | Profile from build arg (`local` default) |
| | `RUN apt-get install curl` | Health probe binary |
| | `RUN groupadd/useradd appuser` | Non-root uid/gid **1001** |
| | `COPY --from=build ... app.jar` | Only the fat JAR from builder |
| | `USER appuser` | Drop root privileges |
| | `EXPOSE 8080` | Matches `server.port` in `application.yml` |
| | `HEALTHCHECK curl /health` | Liveness probe every 30s (90s start grace for Spring Boot) |
| | `ENTRYPOINT java -jar` | Supports `JAVA_OPTS` env for heap/GC tuning |

**`.dockerignore`** excludes `.git`, `target/`, `.m2/`, `.env*`, docs, and terraform to keep build context small and secrets out.

---

## Build Verification

| Field | Value |
| ----- | ----- |
| Command | `docker build -t bo-migration-service:latest .` |
| Directory | `~/Downloads/bo-migration-service` |
| Image name | `bo-migration-service:latest` |
| Exit code | _Run locally — Docker not available in agent sandbox_ |

```bash
cd ~/Downloads/bo-migration-service
docker build -t bo-migration-service:latest .
```

**With build metadata (matches `infra/docker-build.sh` pattern):**

```bash
docker build \
  --build-arg git_commit_id=$(git rev-parse --short HEAD) \
  --build-arg env_name=local \
  -t bo-migration-service:latest .
```

**Expected output (tail):**

```
=> exporting to image
=> => naming to docker.io/library/bo-migration-service:latest
```

**Verify image:**

```bash
docker images bo-migration-service
```

---

## Runtime Verification

| Field | Value |
| ----- | ----- |
| Command | See below |
| Port mapping | `-p 8080:8080` |

### Prerequisites

The app requires **MySQL** and **Redis**. Use local compose (see repo `docs/contributing/LOCAL_DEV_COMPOSE.md`) or override env vars:

| Variable | Purpose |
| -------- | ------- |
| `BO_MYSQL_USERNAME` | MySQL user |
| `BO_MYSQL_PASSWORD` | MySQL password |
| `SPRING_DATASOURCE_URL` | Override JDBC URL (optional) |
| `SPRING_DATA_REDIS_HOST` | Override Redis host (optional) |

### docker run

```bash
docker run -d --name bo-migration \
  -p 8080:8080 \
  -e BO_MYSQL_USERNAME=root \
  -e BO_MYSQL_PASSWORD=secret \
  -e SPRING_DATASOURCE_URL=jdbc:mysql://host.docker.internal:3306/bo_common \
  -e SPRING_DATA_REDIS_HOST=host.docker.internal \
  bo-migration-service:latest
```

**View startup logs:**

```bash
docker logs -f bo-migration
```

**Expected logs (when DB/Redis reachable):**

```
Started MigrationServiceApplication in X.XXX seconds
```

**Note:** Without MySQL/Redis the container may exit during startup — that is expected for this service architecture.

---

## Health Check

### Docker HEALTHCHECK (built-in)

Probes `GET http://127.0.0.1:8080/health` inside the container.

```bash
docker inspect --format='{{json .State.Health}}' bo-migration
```

### Manual curl (from host)

| Field | Value |
| ----- | ----- |
| Command | `curl -s http://127.0.0.1:8080/health` |
| Expected response | `OK` |
| HTTP status | `200` |

```bash
curl -s -w "\nHTTP %{http_code}\n" http://127.0.0.1:8080/health
```

### Actuator (aggregated health)

```bash
curl -s http://127.0.0.1:8080/actuator/health
```

Returns component status for db/redis when dependencies are connected.

---

## Performance Notes

| Metric | Expected |
| ------ | -------- |
| Image size | ~350–450 MB (Temurin JRE + Spring Boot fat JAR) |
| Build time | ~2–5 min first build (Maven dependency download) |
| Startup | ~15–45s (JPA + Redis warmup; cache warmup if enabled) |
| JVM memory | Tune via `JAVA_OPTS=-Xms256m -Xmx512m` |

**Measure locally:**

```bash
docker images bo-migration-service --format "{{.Repository}}:{{.Tag}} {{.Size}}"
docker stats bo-migration --no-stream
```

**Optimizations applied:**

* Multi-stage build (Maven not in runtime image)
* `.dockerignore` shrinks context
* `-DskipTests` in image build (run tests in CI separately)
* Non-root `appuser`

---

## README — Docker Commands

Run from `~/Downloads/bo-migration-service/`:

### docker build

```bash
docker build -t bo-migration-service:latest .
```

### docker run

```bash
docker run -d --name bo-migration -p 8080:8080 \
  -e BO_MYSQL_USERNAME=<user> \
  -e BO_MYSQL_PASSWORD=<pass> \
  bo-migration-service:latest
```

### docker stop

```bash
docker stop bo-migration
docker rm bo-migration
```

### Existing repo tooling

| File | Purpose |
| ---- | ------- |
| `infra/docker-build.sh` | ECR push with git branch tag |
| `docs/architecture/DEPLOYMENT.md` | Full deployment guide |
| `docs/contributing/LOCAL_DEV_COMPOSE.md` | Local MySQL + Redis via compose |

---

## Files Modified / Created

| File | Action |
| ---- | ------ |
| `Dockerfile` | Enhanced — non-root user, `HEALTHCHECK`, `jre-jammy` base |
| `.dockerignore` | Extended — exclude docs/terraform from context |
| `I5_Polyglot_service_pair/docker-report.md` | This report |

---

## Agent Environment Note

Docker CLI was **not available** in the Cursor agent sandbox. Run build/runtime/curl commands on a machine with **Docker Desktop** installed and paste logs into this report if needed.

### Local verification checklist

| Step | Command | Pass |
| ---- | ------- | ---- |
| Build | `docker build -t bo-migration-service:latest .` | ☐ |
| Run (with MySQL/Redis) | `docker run -d --name bo-migration -p 8080:8080 ...` | ☐ |
| Health | `curl http://127.0.0.1:8080/health` → `OK` | ☐ |
| Swagger | `http://127.0.0.1:8080/swagger-ui.html` | ☐ |
| Stop | `docker stop bo-migration && docker rm bo-migration` | ☐ |
