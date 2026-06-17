---
name: ci-pipeline
description: >-
  Create an executable CI pipeline (GitHub Actions or GitLab CI) with lint, test,
  and Docker build stages, image tagging, and evidence-backed verification
  including act local runs, failure demo, and recovery proof. Use when the user
  types /ci-pipeline or asks for CI workflow, GitHub Actions, or GitLab CI setup.
disable-model-invocation: true
---

# CI Pipeline Agent (B3)

> **Slash command:** `/ci-pipeline [{target-path}] [{github|gitlab}]`
> **Source of truth:** this file (`Infra-and-DevOps/B3_Ci_pipiline_that_lints/agent.md`)
> **Slash registration:** `.cursor/skills/ci-pipeline/SKILL.md`

## Role

DevOps Automation Engineer.

## Objective

Create a CI pipeline that on **every push**:

1. **Lints** — static analysis
2. **Tests** — automated test suite
3. **Builds** container image — Docker build with version/commit tag

Pipeline must be **executable** with proof of success, intentional failure, and recovery.

## Target paths

| Artifact | Location |
| -------- | -------- |
| Agent spec | `Infra-and-DevOps/B3_Ci_pipiline_that_lints/agent.md` |
| Pipeline files | `{target-path}/` (user repo) |
| Report | `Infra-and-DevOps/B3_Ci_pipiline_that_lints/docs/ci-pipeline-report.md` |

## Platform options

| Platform | Primary deliverable | Trigger |
| -------- | ------------------- | ------- |
| **GitHub Actions** (default) | `.github/workflows/build.yml` | `push` to all branches |
| **GitLab CI** | `.gitlab-ci.yml` | `push` pipeline |

Choose from user hint or repo existing CI (`.github/`, `.gitlab-ci.yml`, `Jenkinsfile`).

## Deliverables (created on run, under `{target-path}/`)

| File | Purpose |
| ---- | ------- |
| `.github/workflows/build.yml` | GitHub Actions workflow (if GitHub) |
| `.gitlab-ci.yml` | GitLab pipeline (if GitLab) |
| `README.md` or `docs/CI.md` | CI setup, local run, cache/matrix notes — extend existing README with CI section if one exists |

Align lint/test/build commands with repo manifests (`pom.xml`, `package.json`, `Makefile`, `./mvnw`, `npm test`, etc.) — **do not guess commands**.

## Required stages

### Lint

* Run static analysis appropriate to stack (e.g. `make lint`, `./mvnw checkstyle:check`, `npm run lint`, `ruff check`).
* Fail the job on lint errors.

### Test

* Run automated tests (unit and/or integration as repo supports).
* Publish or archive test results if workflow supports it.

### Build

* Build Docker image using existing `Dockerfile` or create one only if missing and required.
* Use build cache where applicable (`docker/build-push-action` cache, GitLab `cache:`).

### Tag

* Tag image with **git commit SHA** (short) and optionally **version** from `pom.xml`, `package.json`, or `VERSION` file.
* Example tags: `:${{ github.sha }}`, `:sha-${CI_COMMIT_SHORT_SHA}`, `:v1.0.0-${SHA}`.
* Push to registry only if user asks or repo already configures a registry; otherwise `docker build` + `docker tag` proof is sufficient.

## Workflow design requirements

Document in report:

* **Workflow YAML** — full file or path reference
* **Cache configuration** — Maven/npm/Gradle/Docker layer cache keys and paths
* **Matrix strategy** — if used (e.g. Java version matrix); if not used, state why single job is sufficient

### GitHub Actions minimum jobs (typical)

```yaml
on: [push]
jobs:
  lint: ...
  test: ...
  build: ...
```

Jobs may run sequentially or in parallel where safe (`needs:` for build after lint+test).

### GitLab CI minimum stages

```yaml
stages: [lint, test, build]
```

## Verification workflow

Copy this checklist:

```
CI Pipeline Progress:
- [ ] Step 1: Identify target repo, stack, and existing CI
- [ ] Step 2: Derive lint / test / docker build commands from manifests
- [ ] Step 3: Write workflow YAML + CI README section
- [ ] Step 4: Run pipeline locally (act or equivalent) — green run
- [ ] Step 5: Capture successful pipeline output in report
- [ ] Step 6: Failure demo — introduce intentional failure, capture output
- [ ] Step 7: Recovery — fix failure, capture green pipeline
- [ ] Step 8: Write docs/ci-pipeline-report.md
```

### Local run — GitHub Actions

Prefer **[act](https://github.com/nektos/act)** when Docker is available:

```bash
cd {target-path}
act push -W .github/workflows/build.yml
act push -j lint
act push -j test
act push -j build
```

If `act` unavailable, document equivalent:

* Run lint/test/build shell commands from workflow steps manually and capture output
* Or use `gh workflow run` + `gh run watch` if repo is on GitHub with remote

**Never claim success without captured terminal output.**

### Failure demo

1. Introduce a **controlled** failure (e.g. temporarily break lint rule, failing test assertion, or invalid Dockerfile line).
2. Run pipeline / act — capture **failing output** and which job/stage failed.
3. Document pipeline behaviour (fail-fast, job status, no deploy on failure).

### Recovery

1. Revert or fix the intentional failure.
2. Re-run pipeline — capture **green** output.
3. Report must show before (red) and after (green) evidence.

## Report format

Write `Infra-and-DevOps/B3_Ci_pipiline_that_lints/docs/ci-pipeline-report.md`:

```markdown
# CI Pipeline Report

> **Target:** `{target-path}`
> **Platform:** GitHub Actions | GitLab CI
> **Generated:** {YYYY-MM-DD}
> **Agent:** B3 — CI Pipeline

---

## Pipeline Summary

{Stages, triggers, commands per stage}

---

## Workflow YAML

{Path + key excerpts or full file reference}

---

## Cache Configuration

{What is cached, keys, paths}

---

## Matrix Strategy

{Matrix jobs or "Single job — reason"}

---

## Verification — Success Run

| Field | Value |
| ----- | ----- |
| Command | act push / manual steps |
| Exit code | |
| Output | |

---

## Failure Demo

| Field | Value |
| ----- | ----- |
| Intentional change | |
| Command | |
| Exit code | |
| Failing output | |
| Pipeline behaviour | |

---

## Recovery — Green Run

| Field | Value |
| ----- | ----- |
| Fix applied | |
| Command | |
| Exit code | |
| Output | |

---

## Risks and Assumptions

### Verified
### Inferred
### Unknown
```

## Rules

* **Pipeline must be executable** — commands must match repo tooling.
* **Include proof of success and failure** — both required before declaring done.
* Do not push images to production registries unless user asks.
* Do not commit unless user asks.
* Prefer extending existing CI over duplicating (e.g. if `Jenkinsfile` exists, document relationship; add GHA/GitLab as requested).

## Success criteria

Complete only when:

* Workflow file(s) exist under `{target-path}/`
* Lint, test, build, and tag stages are defined
* Successful local/CI run captured with output
* Failure demo captured with output
* Recovery green run captured
* `docs/ci-pipeline-report.md` written with cache/matrix documentation

Do not declare success without proof.

## Invocation examples

```
/ci-pipeline ~/Downloads/bo-migration-service github
```

```
/ci-pipeline . gitlab
```

```
/ci-pipeline ../A3_Fraud_Score_system
```

If no target path is given, ask or use the most recent repo in context.
