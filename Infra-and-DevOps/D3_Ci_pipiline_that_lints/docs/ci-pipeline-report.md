# CI Pipeline Report

> **Target:** `Infra-and-DevOps/D3_Ci_pipiline_that_lints`  
> **Platform:** GitHub Actions  
> **Generated:** 2026-06-21  
> **Agent:** D3 — CI Pipeline  
> **Workflow:** `.github/workflows/build.yml`  
> **App:** `app/` (Node.js 20 · Express · ESLint · node:test)

---

## Pipeline Summary

| Job | Stage | Command | Depends on |
| --- | ----- | ------- | ---------- |
| `lint` | Static analysis | `npm run lint` (ESLint) | — |
| `test` | Unit tests | `npm test` (node --test) | `lint` |
| `build` | Docker image | `docker/build-push-action` + SHA tags | `test` |

**Triggers:** `push` (all branches) · `pull_request` (all branches)  
**Runner:** `ubuntu-latest`  
**Node.js:** 20  
**Image tags:** `d3-ci-demo-app:${{ github.sha }}`, `d3-ci-demo-app:sha-${{ github.sha }}`  
**Registry push:** `false` (build proof only)

```
push / pull_request → lint → test → build (Docker + SHA tag)
```

---

## Deliverables

| File | Path | Status |
| ---- | ---- | ------ |
| Workflow | `.github/workflows/build.yml` | Created |
| Demo app | `app/` | Created |
| Dockerfile | `app/Dockerfile` | Created |
| README | `README.md` | Created |
| Report | `docs/ci-pipeline-report.md` | Created |

---

## Workflow Explanation

Path: [`.github/workflows/build.yml`](../.github/workflows/build.yml)

| Feature | Implementation |
| ------- | -------------- |
| Checkout | `actions/checkout@v4` on every job |
| Cache | `actions/setup-node@v4` with `cache: npm` |
| Lint job | `npm ci` → `npm run lint` in `app/` |
| Test job | `needs: lint` → `npm test` → upload artifact |
| Build job | `needs: test` → Buildx + GHA cache → tag with `github.sha` |
| Concurrency | Cancel stale runs per branch |

---

## Cache Configuration

| Layer | Configuration |
| ----- | ------------- |
| **npm** | `actions/setup-node@v4` · `cache: npm` |
| **Lockfile path** | `cache-dependency-path: app/package-lock.json` |
| **Docker** | `cache-from: type=gha` · `cache-to: type=gha,mode=max` |

---

## Matrix Strategy

**Not used** — single `ubuntu-latest` runner, Node.js 20 only.

**Reason:** Single demo service with one supported Node LTS version. A matrix (e.g. Node 20 + 22) can be added if multi-version coverage is required.

---

## Verification — Success Run

### act (attempted)

| Field | Value |
| ----- | ----- |
| Command | `act push -W .github/workflows/build.yml -j lint` |
| Exit code | **1** |
| Output | `failed to start container: ... mkdir /Users/rohitverma/.colima/docker.sock: operation not supported` |

**Interpretation:** `act` 0.2.89 installed; run blocked by Colima Docker socket mount on this machine. Manual pipeline commands used as equivalent verification per agent rules.

### Lint (manual — workflow equivalent)

| Field | Value |
| ----- | ----- |
| Command | `cd app && npm ci && npm run lint` |
| Exit code | **0** |
| Output | ESLint completed with no errors |

### Test (manual — workflow equivalent)

| Field | Value |
| ----- | ----- |
| Command | `npm test` |
| Exit code | **0** |
| Output | |

```
ℹ tests 3
ℹ suites 2
ℹ pass 3
ℹ fail 0
ℹ duration_ms 212.169334
```

### Docker build (manual — workflow equivalent)

| Field | Value |
| ----- | ----- |
| Command | `docker build -t d3-ci-demo-app:8254d73 -t d3-ci-demo-app:sha-8254d73 ./app` |
| Exit code | **0** |
| Output | |

```
Successfully built 37e22adf7400
Successfully tagged d3-ci-demo-app:8254d73
Successfully tagged d3-ci-demo-app:sha-8254d73
BUILD_EXIT=0
```

| Image | Tag | Size |
| ----- | --- | ---- |
| d3-ci-demo-app | 8254d73 | 203MB |
| d3-ci-demo-app | sha-8254d73 | 203MB |

---

## Failure Demonstration

| Field | Value |
| ----- | ----- |
| Intentional change | Replaced health test assertion with `assert.fail("intentional CI failure demo")` in `app/src/health.test.js` |
| Command | `npm test` |
| Exit code | **1** |
| Output | |

```
✖ returns ok status (1.067291ms)
  AssertionError [ERR_ASSERTION]: intentional CI failure demo

ℹ tests 3
ℹ pass 2
ℹ fail 1
```

| Pipeline behaviour | Test job fails with exit 1. In GitHub Actions, `build` job would not run (`needs: test`). Fail-fast on test failure. |

---

## Recovery — Green Run

| Field | Value |
| ----- | ----- |
| Fix applied | Restored `app/src/health.test.js` to original assertions |
| Command | `npm test && npm run lint` |
| Exit code | **0** |
| Output | |

```
ℹ pass 3
ℹ fail 0
RECOVERY_TEST_EXIT=0
RECOVERY_LINT_EXIT=0
```

All pipeline stages green again after fix.

---

## Risks and Assumptions

### Verified

- `.github/workflows/build.yml` created with lint, test, build jobs on push and pull_request.
- npm cache configuration present in workflow YAML.
- Docker GHA cache configuration present in workflow YAML.
- `npm run lint` exits **0**.
- `npm test` exits **0** (3 tests pass).
- `docker build` exits **0** with SHA tags applied locally.
- Intentional test failure produces exit **1** with surefire-style node:test output.
- Recovery restores green lint + test runs.
- `README.md` documents workflow, cache, local run, and act usage.

### Inferred

- GitHub-hosted runners will execute all three jobs successfully when workflow is placed at repo root `.github/workflows/`.
- Docker build on GitHub Actions will succeed with normal registry access (local build verified).
- `act` would run all jobs on environments without Colima socket mount issues.

### Unknown

- Full `act push` end-to-end run not completed (Colima socket mount failure).
- Whether org wants container registry push (ECR/GHCR) integrated — not configured (`push: false`).

---

## Local Verification (manual run)

A presentable record of the latest local lint + test run is in [`run-status.md`](run-status.md).

| Field | Value |
| ----- | ----- |
| Verified by | rohitverma · PMLMBT4677 |
| Command | `cd app && npm ci && npm run lint && npm test` |
| Exit code | **0** |
| Lint | ESLint pass (no errors) |
| Tests | **3 passed · 0 failed** |

---

## Manual Verification Notes

```bash
cd Infra-and-DevOps/D3_Ci_pipiline_that_lints/app
npm ci && npm run lint && npm test

cd ..
SHORT_SHA=$(git rev-parse --short HEAD)
docker build -t d3-ci-demo-app:${SHORT_SHA} ./app

# act (optional — may fail on Colima)
cd Infra-and-DevOps/D3_Ci_pipiline_that_lints
act push -W .github/workflows/build.yml -j lint
act push -W .github/workflows/build.yml -j test
act push -W .github/workflows/build.yml -j build
```

### Success criteria status

| Criterion | Status |
| --------- | ------ |
| Workflow file exists | **Pass** |
| Lint, test, build, tag stages defined | **Pass** |
| Successful run captured | **Pass** (manual equivalent) |
| Failure demo captured | **Pass** |
| Recovery green run captured | **Pass** |
| Report with cache/matrix docs | **Pass** |
