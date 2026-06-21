# Dev Bootstrap Report

> **Target:** `~/Downloads/bo-migration-service` (user invoked `~/Downloads/bo-migration-services` — plural path not found; sibling repo used)
> **Approach:** Makefile + asdf
> **Generated:** 2026-06-22
> **Agent:** D5 — Reproducible Development Environment

---

## Application Summary

| Field | Value |
| ----- | ----- |
| **Repo** | `bo-migration-service` |
| **Stack** | Java 17, Spring Boot 3.2.0, Maven, MySQL 8, Redis 7, Flyway |
| **Purpose** | User migration APIs (CLASS ↔ TechExcel) with Redis-backed cache |
| **Canonical test** | `make test` → `./infra/unit-test.sh` → `./mvnw -B test` |
| **Run locally** | `make run` → `./infra/run-local.sh` (sources `.env`, profile `local`) |

---

## Previously Implicit Dependencies (Verified / Inferred / Unknown)

| Dependency | Version / detail | Source | Status |
| ---------- | ---------------- | ------ | ------ |
| **Java** | 17 (`pom.xml` `<java.version>17`) | `pom.xml` | **Verified** |
| **Maven** | 3.9.6 | `Dockerfile` (`maven:3.9.6-eclipse-temurin-17`) | **Verified** |
| **Spring Boot** | 3.2.0 parent | `pom.xml` | **Verified** |
| **MySQL** | 8.0+ (local compose uses `mysql:8.0`) | `docker-compose.yml`, docs | **Verified** |
| **Redis** | 7 (`redis:7-alpine`) | `docker-compose.yml` | **Verified** |
| **Docker** | Required for local MySQL/Redis | `docs/contributing/LOCAL_DEV_COMPOSE.md` | **Verified** |
| **Docker Compose** | v1 (`docker-compose`) or v2 plugin | Runtime check | **Inferred** — this host has `docker-compose` 5.1.4; `docker compose` subcommand failed |
| **asdf + java plugin** | Temurin 17.0.13+11 | `.tool-versions` (created) | **Verified** (file); **Unknown** on host without asdf |
| **AWS CLI** | ECR login for `make docker-build` | `infra/docker-build.sh` | **Inferred** — CI/Jenkins only; not part of `make setup` |
| **Env: datasource** | `SPRING_DATASOURCE_URL/USERNAME/PASSWORD` | `deploy/app.env.example`, `.env.example` | **Verified** |
| **Env: redis** | `SPRING_REDIS_HOST`, `SPRING_REDIS_PORT` | `.env.example` | **Verified** |
| **Env: legacy MySQL** | `BO_MYSQL_USERNAME`, `BO_MYSQL_PASSWORD` | `application.yml`, test `application.properties` | **Verified** |
| **Env: API key** | `MIGRATION_API_KEY`, `MIGRATION_API_KEY_REQUIRED` | docs, `.env.example` | **Verified** |
| **Profile `local`** | Flyway enabled, localhost JDBC | `application-local.yml` (created) | **Verified** |

### Gaps found before bootstrap

Documentation referenced files that were **missing** from the working tree: `mvnw`, `.mvn/wrapper/`, `docker-compose.yml`, `.env.example`, `.tool-versions`, `.java-version`, `.sdkmanrc`, `application-local.yml`, `scripts/setup.sh`, `infra/run-local.sh`. These were added as part of this D5 run.

---

## Bootstrap Approach and File Inventory

**Single command:** `make setup`

**Mechanism:** `Makefile` → `scripts/setup.sh`:

1. `asdf install` (if asdf present) — pins Java 17 via `.tool-versions`
2. `./mvnw -B -DskipTests package` — downloads Maven 3.9.6 via wrapper
3. `cp .env.example .env` (idempotent — skips if `.env` exists)
4. `docker-compose up -d` (fallback when `docker compose` plugin unavailable)

### Files created or updated

| File | Action |
| ---- | ------ |
| `Makefile` | Replaced — `setup`, `test`, `run`, `dev-up/down` |
| `scripts/setup.sh` | Created — one-shot bootstrap |
| `.tool-versions` | Created — `java temurin-17.0.13+11` |
| `.java-version` | Created — `17` |
| `.sdkmanrc` | Created — sdkman alternative |
| `mvnw` + `.mvn/wrapper/maven-wrapper.properties` | Created — Maven 3.9.6 |
| `docker-compose.yml` | Created — MySQL + Redis |
| `.env.example` | Created — local env template |
| `src/main/resources/application-local.yml` | Created — local profile overrides |
| `infra/run-local.sh` | Created |
| `infra/unit-test.sh`, `infra/integration-test.sh` | Updated — use `./mvnw` |
| `.gitignore` | Updated — ignore `.env`, `.env.local` |
| `README.md` | Updated — **Quick start** section with `make setup` |

---

## Bootstrap Execution (command, output, exit code)

**Command:**

```bash
cd ~/Downloads/bo-migration-service && make setup
```

**Exit code:** `0`

**Summary output:**

```
[setup] repo: /Users/rohitverma/Downloads/bo-migration-service
[setup][WARN] asdf not found — ensure Java 17 is active (see .tool-versions / .java-version)
openjdk version "21.0.5" 2024-10-15 LTS
[setup] .env exists — not overwriting
[setup] ./mvnw -B -DskipTests package
...
[INFO] BUILD SUCCESS
...
 Container bo-migration-mysql Started 
 Container bo-migration-redis Started 
NAME                 IMAGE            STATUS                            PORTS
bo-migration-mysql   mysql:8.0        Up (health: starting)           0.0.0.0:3306->3306/tcp
bo-migration-redis   redis:7-alpine   Up (health: starting)           0.0.0.0:6379->6379/tcp
[setup] done. Run app: make run
```

**Notes:**

- First `make setup` attempt failed with exit `125` because `docker compose` (v2 plugin) is not wired on this host; `scripts/setup.sh` was updated to fall back to `docker-compose`.
- Maven wrapper downloaded Apache Maven 3.9.6 on first run (network required).
- Host Java was **21** (not 17) because asdf is not installed; build still succeeded targeting Java 17 bytecode.

---

## Test Validation (command, output, exit code)

**Command:**

```bash
cd ~/Downloads/bo-migration-service && make test
```

**Exit code:** `0`

**Summary output:**

```
[INFO] -------------------------------------------------------
[INFO]  T E S T S
[INFO] -------------------------------------------------------
...
[INFO] Results:
[INFO] Tests run: 27, Failures: 0, Errors: 0, Skipped: 0
[INFO] ------------------------------------------------------------------------
[INFO] BUILD SUCCESS
[INFO] ------------------------------------------------------------------------
```

All 27 unit tests passed. Tests do not require Docker (test placeholders in `src/test/resources/application.properties`).

---

## README Quick Start (excerpt)

```markdown
## Quick start (one command)

From a fresh clone, install **asdf** with the Java plugin (`asdf plugin add java`), then:

```bash
make setup
```

This runs `scripts/setup.sh`: pins **Java 17** (`.tool-versions`), builds with **`./mvnw`**, copies **`.env.example` → `.env`**, and starts **MySQL + Redis** via Docker Compose.

Then run the app:

```bash
make run
```

Health: http://localhost:8080/actuator/health — Swagger: http://localhost:8080/swagger-ui.html

Run tests: `make test`
```

---

## Risks and Assumptions

| Risk | Mitigation |
| ---- | ---------- |
| **Path typo** (`bo-migration-services` vs `bo-migration-service`) | Used existing singular repo; document path in report |
| **asdf not installed** | `setup.sh` warns and continues; contributor should install asdf + `asdf plugin add java` for JDK 17 pin |
| **Java 21 on PATH** | Compiles with `--release 17`; recommend `asdf install` or `sdk env` before CI-parity work |
| **`docker compose` vs `docker-compose`** | `setup.sh` and Makefile try both |
| **Port 3306 collision** | Documented in `LOCAL_DEV_COMPOSE.md`; override in `.env` if needed |
| **`make docker-build`** | Requires AWS ECR credentials — out of scope for `make setup` |
| **Integration tests (`make integration-test`)** | Runs `./mvnw verify`; not executed in this run (unit tests are canonical per `Makefile` / `.foundry/dev-env.md`) |

---

## Success criteria checklist

- [x] Bootstrap files under `~/Downloads/bo-migration-service/`
- [x] `README.md` documents single command `make setup`
- [x] Bootstrap executed — exit code **0**
- [x] Tests executed — **27/27** pass, exit code **0**
- [x] Report written with captured evidence
