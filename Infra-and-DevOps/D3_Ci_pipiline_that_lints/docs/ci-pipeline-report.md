# CI Pipeline Report

> **Target:** `/Users/rohitverma/Downloads/bo-migration-service`  
> **Platform:** GitHub Actions  
> **Generated:** 2026-06-17  
> **Agent:** D3 — CI Pipeline  
> **Workflow:** `.github/workflows/build.yml`

---

## Pipeline Summary

| Job | Stage | Command | Depends on |
| --- | ----- | ------- | ---------- |
| `lint` | Static analysis | `mvn -B validate compile` | — |
| `test` | Unit tests | `mvn -B test` | `lint` |
| `build` | Docker image | `docker/build-push-action` + tags | `test` |

**Trigger:** `push` (all branches)  
**Java:** 17 (Temurin)  
**Image tags:** `bo-migration-service:${{ github.sha }}`, `bo-migration-service:sha-${{ github.sha }}`

```
push → lint → test → build (Docker tag)
```

---

## Deliverables

| File | Path | Status |
| ---- | ---- | ------ |
| Workflow | `bo-migration-service/.github/workflows/build.yml` | Created |
| CI docs | `bo-migration-service/docs/CI.md` | Created |
| Dockerfile | `bo-migration-service/Dockerfile` | Pre-existing (used by build job) |

---

## Workflow YAML

Path: `.github/workflows/build.yml`

Key features:

- Three jobs: `lint`, `test`, `build`
- `concurrency` cancels stale runs per branch
- Maven cache via `actions/setup-java@v4` (`cache: maven`)
- Docker GHA cache via `cache-from` / `cache-to: type=gha`
- Build args: `git_commit_id`, `env_name=ci`
- **No registry push** (`push: false`) — build + tag proof only

---

## Cache Configuration

| Layer | Configuration |
| ----- | ------------- |
| **Maven** | `actions/setup-java@v4` with `cache: maven` |
| **Maven local repo** | `MAVEN_OPTS=-Dmaven.repo.local=$GITHUB_WORKSPACE/.m2-cache/repository` |
| **Docker** | Buildx GHA cache: `cache-from: type=gha`, `cache-to: type=gha,mode=max` |

---

## Matrix Strategy

**Not used** — single `ubuntu-latest` runner, Java 17 only.

**Reason:** Single-module Spring Boot service; `pom.xml` pins Java 17. No multi-version or multi-OS requirement.

---

## Verification — Success Run

### act

`act` is **not installed** on this machine (`which act` → not found). Verification used **manual equivalent** (workflow commands run directly).

### Lint (manual)

| Field | Value |
| ----- | ----- |
| Command | `cd bo-migration-service && mvn -B validate compile` |
| Exit code | **0** |
| Output | `BUILD SUCCESS` (Total time: ~0.9s) |

### Test (manual)

| Field | Value |
| ----- | ----- |
| Command | `mvn -B test` |
| Exit code | **0** |
| Output | `Tests run: 27, Failures: 0, Errors: 0, Skipped: 0` — `BUILD SUCCESS` |

### Build (manual)

| Field | Value |
| ----- | ----- |
| Command | `docker build -t bo-migration-service:<short-sha> .` |
| Exit code | **1** |
| Output | `failed to resolve reference "docker.io/library/maven:3.9.6-eclipse-temurin-17": tls: failed to verify certificate: x509: certificate signed by unknown authority` |

**Interpretation:** Lint and test succeed locally. Docker build blocked by TLS/certificate issue pulling base image from Colima environment — workflow YAML is valid; build job expected to pass on GitHub-hosted runners with normal registry access.

---

## Failure Demo

| Field | Value |
| ----- | ----- |
| Intentional change | Temporarily replaced `HealthControllerTest.healthReturnsOk()` with `Assertions.fail("intentional CI failure demo")` |
| Command | `mvn -B test -Dtest=HealthControllerTest` |
| Exit code | **1** |
| Failing output | |

```
[ERROR] Failures: 
[ERROR]   HealthControllerTest.ciFailureDemo:22 intentional CI failure demo
[ERROR] Tests run: 1, Failures: 1, Errors: 0, Skipped: 0
[INFO] BUILD FAILURE
[ERROR] Failed to execute goal ... maven-surefire-plugin:3.1.2:test ... There are test failures.
```

| Pipeline behaviour | Test job fails; `build` job would not run (`needs: test`). Fail-fast on surefire failure. |

---

## Recovery — Green Run

| Field | Value |
| ----- | ----- |
| Fix applied | Restored `HealthControllerTest.java` to original `healthReturnsOk()` assertion |
| Command | `mvn -B test` |
| Exit code | **0** |
| Output | `Tests run: 27, Failures: 0, Errors: 0, Skipped: 0` — `BUILD SUCCESS` |

---

## Risks and Assumptions

### Verified

- `.github/workflows/build.yml` created with lint, test, build, tag stages on `push`.
- `mvn -B validate compile` exits 0.
- `mvn -B test` exits 0 (27 tests).
- Intentional test failure produces exit 1 and surefire failure output.
- Recovery restores green test run.
- `docs/CI.md` documents stages, cache, local commands, act usage.

### Inferred

- GitHub Actions hosted runners will pull `maven:3.9.6-eclipse-temurin-17` and complete Docker build where local Colima TLS issue does not apply.
- Repo docs reference `make lint` / spotless / `./mvnw verify`; current `pom.xml` on this branch uses simpler Maven goals — workflow uses `validate compile` + `test` matching **actual** pom capabilities.

### Unknown

- Full `act push` run not executed (act not installed).
- Docker build not verified end-to-end locally due to registry TLS error.
- Whether org wants ECR push step (existing `infra/docker-build.sh` / Jenkins) integrated into this GHA workflow.

---

## Manual Verification Notes

```bash
# On GitHub after push — expected green lint + test; build if runner can reach Docker Hub
git add .github/workflows/build.yml docs/CI.md
git push

# Local parity
mvn -B validate compile && mvn -B test

# Install act (optional)
brew install act
act push -j lint -W .github/workflows/build.yml
act push -j test -W .github/workflows/build.yml
```

To add ECR push, extend `build` job with AWS credentials and `push: true` aligned with `infra/docker-build.sh`.
