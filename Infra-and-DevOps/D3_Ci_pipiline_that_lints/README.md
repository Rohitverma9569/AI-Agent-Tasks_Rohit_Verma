# D3 — CI Pipeline (GitHub Actions)

GitHub Actions workflow for the **d3-ci-demo-app** Node.js service: lint → test → Docker build with commit SHA tagging.

| | |
| --- | --- |
| **Agent** | [`agent.md`](agent.md) · `/ci-pipeline` |
| **Workflow** | [`.github/workflows/build.yml`](.github/workflows/build.yml) |
| **App** | [`app/`](app/) |
| **Report** | [`docs/ci-pipeline-report.md`](docs/ci-pipeline-report.md) |
| **Local verification** | [`docs/run-status.md`](docs/run-status.md) |

---

## Pipeline Overview

```
push / pull_request
        │
        ├── lint   (ESLint)
        │     │
        │     ▼
        ├── test   (node --test)
        │     │
        │     ▼
        └── build  (Docker image + SHA tags)
```

| Job | Stage | Command | Depends on |
| --- | ----- | ------- | ---------- |
| `lint` | Static analysis | `npm run lint` | — |
| `test` | Unit tests | `npm test` | `lint` |
| `build` | Docker image | `docker/build-push-action` | `test` |

**Triggers:** every `push` and `pull_request`  
**Image tags:** `d3-ci-demo-app:${{ github.sha }}`, `d3-ci-demo-app:sha-${{ github.sha }}`  
**Registry push:** disabled (`push: false`) — build + tag proof only

---

## Start with the Agent

| Scenario | Command |
| -------- | ------- |
| **This project** | `/ci-pipeline Infra-and-DevOps/D3_Ci_pipiline_that_lints github` |
| **Another repo** | `/ci-pipeline ~/path/to/repo github` |

The agent creates the workflow, runs verification (lint, test, build), demonstrates failure/recovery, and writes [`docs/ci-pipeline-report.md`](docs/ci-pipeline-report.md).

---

## GitHub Activation

GitHub discovers workflows only under the **repository root** `.github/workflows/`.

For this monorepo, copy or symlink after review:

```bash
mkdir -p .github/workflows
cp Infra-and-DevOps/D3_Ci_pipiline_that_lints/.github/workflows/build.yml \
   .github/workflows/d3-ci-build.yml
```

Then edit `defaults.run.working-directory` and `context` paths to:

`Infra-and-DevOps/D3_Ci_pipiline_that_lints/app`

For local development and evaluation, run from **this folder** (see below).

---

## Local Verification (manual)

Equivalent to CI pipeline steps:

```bash
cd Infra-and-DevOps/D3_Ci_pipiline_that_lints/app

npm ci
npm run lint          # lint stage
npm test              # test stage

cd ..
SHORT_SHA=$(git rev-parse --short HEAD)
docker build -t d3-ci-demo-app:${SHORT_SHA} -t d3-ci-demo-app:sha-${SHORT_SHA} ./app
```

### Expected results

| Step | Command | Expected exit code | Expected output |
| ---- | ------- | ------------------ | --------------- |
| Lint | `npm run lint` | `0` | No ESLint errors |
| Test | `npm test` | `0` | `pass 3`, `fail 0` |
| Docker build | `docker build ...` | `0` | `Successfully tagged d3-ci-demo-app:<sha>` |

---

## Local Verification with `act`

Install [act](https://github.com/nektos/act):

```bash
brew install act
```

Configure runner image (one-time):

```bash
mkdir -p ~/Library/Application\ Support/act
cat > ~/Library/Application\ Support/act/actrc <<'EOF'
-P ubuntu-latest=catthehacker/ubuntu:act-latest
--container-architecture linux/arm64
EOF
```

Run from this directory:

```bash
cd Infra-and-DevOps/D3_Ci_pipiline_that_lints

act push -W .github/workflows/build.yml -j lint
act push -W .github/workflows/build.yml -j test
act push -W .github/workflows/build.yml -j build
```

> **Note:** `act` may fail on Colima due to Docker socket mount issues. Use manual commands above as fallback (documented in the report).

---

## Cache Configuration

| Layer | Mechanism |
| ----- | --------- |
| **npm** | `actions/setup-node@v4` with `cache: npm` |
| **npm lockfile** | `cache-dependency-path: app/package-lock.json` |
| **Docker** | Buildx GHA cache: `cache-from: type=gha`, `cache-to: type=gha,mode=max` |

---

## Matrix Strategy

**Not used** — single `ubuntu-latest` job with Node.js 20.

Single demo app; no multi-version or multi-OS requirement. Add a matrix later if you need Node 20 + 22 coverage.

---

## Artifacts

| Artifact | Job | Contents |
| -------- | --- | -------- |
| `test-summary-<run_id>` | test | Test run metadata |
| `docker-build-metadata-<run_id>` | build | Dockerfile reference |

---

## App Structure

```
app/
├── Dockerfile
├── package.json
├── eslint.config.mjs
└── src/
    ├── health.js          # health response helper
    ├── health.test.js     # unit tests
    ├── index.js           # Express entrypoint
    └── index.test.js
```

---

## Troubleshooting

| Issue | Fix |
| ----- | --- |
| `npm ci` fails | Run `npm install` in `app/` to refresh `package-lock.json` |
| ESLint errors | `npm run lint` in `app/` |
| Docker build fails | Ensure Docker daemon is running (`docker info`) |
| `act` socket error (Colima) | Use manual lint/test/build commands |
| Workflow not running on GitHub | Copy workflow to repo root `.github/workflows/` |

---

## Documentation

| Document | Description |
| -------- | ----------- |
| [`agent.md`](agent.md) | D3 agent spec |
| [`docs/ci-pipeline-report.md`](docs/ci-pipeline-report.md) | Evidence: success, failure demo, recovery |
| [`docs/run-status.md`](docs/run-status.md) | Local lint + test verification (manual run) |
