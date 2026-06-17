---
name: reproducible-dev-environment
description: >-
  Make a repository runnable from a fresh clone with a single bootstrap command
  using devcontainer, Nix flake, or Makefile + asdf/mise. Captures dependency
  analysis, bootstrap proof, and test validation. Use when the user types
  /reproducible-dev-environment or asks for dev bootstrap, devcontainer, mise,
  asdf, or one-command setup.
disable-model-invocation: true
---

# Reproducible Development Environment Agent (D5)

> **Slash command:** `/reproducible-dev-environment [{target-path}] [{devcontainer|nix|asdf|mise}]`
> **Source of truth:** this file (`Infra-and-DevOps/D5_Reproducible_dev_environment/agent.md`)
> **Slash registration:** `.cursor/skills/reproducible-dev-environment/SKILL.md`

## Role

Developer Productivity Engineer.

## Objective

Make the repository **runnable from a fresh clone** using **one command** — no manual dependency installation steps documented outside the bootstrap path.

## Target paths

| Artifact | Location |
| -------- | -------- |
| Agent spec | `Infra-and-DevOps/D5_Reproducible_dev_environment/agent.md` |
| Bootstrap files | `{target-path}/` (user repo) |
| Report | `Infra-and-DevOps/D5_Reproducible_dev_environment/docs/dev-bootstrap-report.md` |

## Supported approaches

Choose **one** approach per run. Prefer what the repo already uses; otherwise pick the best fit for the stack.

| Approach | Primary deliverables | Single command |
| -------- | -------------------- | -------------- |
| **devcontainer** (default for polyglot / IDE-first) | `.devcontainer/devcontainer.json`, optional `Dockerfile`, `postCreateCommand` | `devcontainer open` or documented VS Code / Cursor flow |
| **Nix Flake** | `flake.nix`, optional `flake.lock` | `nix develop` or `nix develop -c make setup` |
| **Makefile + asdf** | `Makefile`, `.tool-versions` | `make setup` |
| **Makefile + mise** | `Makefile`, `.mise.toml` or `mise.toml` | `make setup` |

The **Makefile `setup` target** (when used) must install tool versions and project dependencies end-to-end. It may invoke `asdf install`, `mise install`, `npm ci`, `mvn …`, etc. — but the developer runs **only** `make setup`.

## Deliverables (created on run, under `{target-path}/`)

| File | Purpose |
| ---- | ------- |
| Bootstrap config | One of: `.devcontainer/devcontainer.json`, `flake.nix`, `.tool-versions` + `Makefile`, `.mise.toml` + `Makefile` |
| `Makefile` | Required when using asdf/mise; optional helper targets (`test`, `lint`, `run`) |
| `README.md` | **Update or create** — prominent "Quick start" with the single bootstrap command |
| `.env.example` | When the app requires env vars — document all required keys (no secrets) |

Do **not** add multiple competing bootstrap systems in one run. One approach only.

## Required analysis

Before writing files, inventory the target repo and document in the report.

### Previously implicit dependencies

Identify and pin (or containerize) each:

| Category | Examples | Where to look |
| -------- | -------- | ------------- |
| Java version | 17, 21 | `pom.xml`, `build.gradle`, `.java-version`, CI workflows |
| Python version | 3.11, 3.12 | `pyproject.toml`, `.python-version`, `requirements.txt` |
| Node version | 20, 22 | `package.json` `engines`, `.nvmrc`, CI |
| Rust / Go / other | edition, toolchain | `Cargo.toml`, `go.mod`, CI |
| System packages | `mysql-client`, `libssl`, `docker` | Dockerfiles, scripts, docs |
| Environment variables | `SPRING_*`, `DATABASE_URL`, API keys | `.env.example`, `application*.yml`, README |

Mark each finding as **Verified** (read from file), **Inferred** (from CI/Dockerfile), or **Unknown** (needs clarification — add `[NEEDS CLARIFICATION]` in report only; do not guess secret values).

### Bootstrap process

Exactly **one** documented entry command, for example:

```bash
make setup
```

```bash
devcontainer open
```

```bash
nix develop
```

If devcontainer: `postCreateCommand` must finish dependency install; opening the devcontainer is the single developer action.

## Workflow

```
Reproducible Dev Environment Progress:
- [ ] Step 1: Repo recon — languages, package managers, CI, Docker, implicit deps
- [ ] Step 2: Choose bootstrap approach (user hint or best fit)
- [ ] Step 3: Write bootstrap files under {target-path}/
- [ ] Step 4: Update README.md — Quick start with single command
- [ ] Step 5: Run bootstrap process — capture full command + output + exit code
- [ ] Step 6: Run project tests — capture command + output + exit code
- [ ] Step 7: Write docs/dev-bootstrap-report.md with evidence
```

## Verification

### Bootstrap run

Execute the single bootstrap command in a clean or clean-enough context:

```bash
# Examples — use the one you implemented
make setup
# or
nix develop -c make setup
# or
devcontainer build && devcontainer up  # if CLI available
```

Capture:

* Exact command
* Full stdout/stderr output
* Exit code

If full fresh-clone simulation is impractical in-session, run from a clean worktree or after removing local `node_modules` / `target` / `.venv` where safe — document what was cleaned.

### Test validation

Run the repo's canonical test command — read from CI, Makefile, or build file; **do not guess**.

Examples:

```bash
make test
./mvnw test
npm test
cargo test
```

Capture:

* Test command
* Output (summary + failures if any)
* Exit code

Tests must pass (exit 0) to declare success unless the repo has known pre-existing failures — then document as **Verified** failure with ticket/reference.

## Report format

Write `Infra-and-DevOps/D5_Reproducible_dev_environment/docs/dev-bootstrap-report.md`:

```markdown
# Dev Bootstrap Report

> **Target:** `{target-path}`
> **Approach:** devcontainer | nix | asdf | mise
> **Generated:** {YYYY-MM-DD}
> **Agent:** D5 — Reproducible Development Environment

---

## Application Summary
## Previously Implicit Dependencies (Verified / Inferred / Unknown)
## Bootstrap Approach and File Inventory
## Bootstrap Execution (command, output, exit code)
## Test Validation (command, output, exit code)
## README Quick Start (excerpt)
## Risks and Assumptions
```

Always separate **Verified**, **Inferred**, and **Unknown**. Never claim bootstrap or tests passed without captured output.

## Rules

* **Fresh clone reproducible** — a new developer runs one command; no undocumented manual steps.
* **No manual dependency installation** outside the chosen bootstrap path.
* **Single-command setup required** — `make setup`, `nix develop`, or `devcontainer open` (or equivalent documented once).
* Pin versions explicitly (`.tool-versions`, `.mise.toml`, `flake.nix`, devcontainer feature versions).
* Do not commit unless the user asks.
* Do not install global system packages without encoding them in the bootstrap (Makefile, devcontainer, or Nix).
* Prefer existing repo conventions (e.g. `./mvnw` over bare `mvn` when wrapper exists).

## Success criteria

Complete only when:

* Bootstrap files exist under `{target-path}/`
* `README.md` documents the single bootstrap command
* Bootstrap command executed with captured output and exit code 0
* Test command executed with captured output and exit code 0
* `docs/dev-bootstrap-report.md` written with evidence

Do not declare success without proof.

## Invocation examples

```
/reproducible-dev-environment ~/Downloads/bo-migration-service mise
```

```
/reproducible-dev-environment . devcontainer
```

```
/reproducible-dev-environment ../A3_Fraud_Score_system nix
```

```
/reproducible-dev-environment
```

If no target path is given, ask or use the most recent repo in context.
