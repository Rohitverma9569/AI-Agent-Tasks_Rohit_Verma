# D5 — Reproducible Development Environment

Make any repository **runnable from a fresh clone** with a **single bootstrap command** — no undocumented manual dependency steps.

| | |
| --- | --- |
| **Agent** | [`agent.md`](agent.md) · slash command `/reproducible-dev-environment` |
| **Report** | [`docs/dev-bootstrap-report.md`](docs/dev-bootstrap-report.md) |
| **Latest target** | `~/Downloads/bo-migration-service` (Makefile + asdf) |

```
Fresh clone
    │
    └── one command ──► make setup | nix develop | devcontainer open
              │
              ├── pin tool versions (Java, Node, Python, …)
              ├── install dependencies (mvnw, npm ci, pip, …)
              ├── copy .env.example → .env (if needed)
              └── start local services (Docker Compose, etc.)
                        │
                        └── make test ──► exit 0
```

---

## Start with the Agent (recommended)

Open **Cursor Agent chat** and run:

| Scenario | Command |
| -------- | ------- |
| **Target repo + approach hint** | `/reproducible-dev-environment ~/path/to/repo mise` |
| **Devcontainer (IDE-first)** | `/reproducible-dev-environment . devcontainer` |
| **Nix flake** | `/reproducible-dev-environment ../A3_Fraud_Score_system nix` |
| **Makefile + asdf** | `/reproducible-dev-environment ~/Downloads/bo-migration-service asdf` |
| **No path given** | `/reproducible-dev-environment` — agent asks or uses repo in context |

The agent reads [`agent.md`](agent.md) and automatically:

1. Inventories implicit dependencies (language versions, system packages, env vars)
2. Chooses **one** bootstrap approach (devcontainer, Nix, asdf, or mise)
3. Writes bootstrap files under `{target-path}/` and updates that repo's `README.md`
4. Runs the single bootstrap command — captures output and exit code
5. Runs the canonical test command — captures pass/fail summary
6. Writes [`docs/dev-bootstrap-report.md`](docs/dev-bootstrap-report.md)

> Bootstrap files are created in the **target repo**, not in this D5 folder. The agent does not commit unless you explicitly ask.

---

## Supported Approaches

Pick **one** per run. The agent prefers what the target repo already uses.

| Approach | Primary deliverables | Single command |
| -------- | -------------------- | -------------- |
| **devcontainer** | `.devcontainer/devcontainer.json`, optional `Dockerfile`, `postCreateCommand` | `devcontainer open` (VS Code / Cursor) |
| **Nix flake** | `flake.nix`, optional `flake.lock` | `nix develop` or `nix develop -c make setup` |
| **Makefile + asdf** | `Makefile`, `.tool-versions` | `make setup` |
| **Makefile + mise** | `Makefile`, `.mise.toml` | `make setup` |

The `Makefile` `setup` target (when used) must install tool versions and project dependencies end-to-end. The developer runs **only** the documented entry command.

---

## What Gets Created (in the target repo)

| File | Purpose |
| ---- | ------- |
| Bootstrap config | One of: `.devcontainer/devcontainer.json`, `flake.nix`, `.tool-versions` + `Makefile`, `.mise.toml` + `Makefile` |
| `Makefile` | Required for asdf/mise; optional `test`, `run`, `lint` targets |
| `README.md` | Updated with a prominent **Quick start** section |
| `.env.example` | When the app needs env vars — all required keys, no secrets |

Do **not** mix multiple bootstrap systems in one run.

---

## Expected Results

Use this checklist after an agent run against a target repo.

### Bootstrap — single command

| Approach | Example command | Expected exit code |
| -------- | --------------- | ------------------ |
| asdf / mise | `make setup` | `0` |
| Nix | `nix develop -c make setup` | `0` |
| devcontainer | Open in Cursor/VS Code → postCreateCommand completes | `0` |

**Expected outcome:** tool versions pinned, dependencies installed, `.env` created from example (if applicable), local services started (if applicable).

### Tests — canonical command from target repo

| Example | Expected |
| ------- | -------- |
| `make test` | Exit `0`, all tests pass |
| `./mvnw test` | Exit `0`, BUILD SUCCESS |
| `npm test` | Exit `0`, all suites green |

### Report — [`docs/dev-bootstrap-report.md`](docs/dev-bootstrap-report.md)

| Section | Content |
| ------- | ------- |
| Application summary | Stack, canonical test/run commands |
| Implicit dependencies | Verified / Inferred / Unknown table |
| Bootstrap execution | Full command, output, exit code |
| Test validation | Full command, summary, exit code |
| README quick start | Excerpt from target repo |

---

## Latest Verified Run

From [`docs/dev-bootstrap-report.md`](docs/dev-bootstrap-report.md) — **2026-06-22**:

| Metric | Result |
| ------ | ------ |
| **Target** | `~/Downloads/bo-migration-service` |
| **Approach** | Makefile + asdf |
| **Bootstrap** | `make setup` → exit **0** |
| **Tests** | `make test` → **27/27** pass, exit **0** |

Quick start added to the target repo:

```bash
make setup   # Java 17, mvnw build, .env, MySQL + Redis via Docker Compose
make run     # start Spring Boot locally
make test    # ./mvnw test
```

---

## Manual Use (after agent has run)

Once bootstrap files exist in a target repo, any developer can use it without re-running the agent:

```bash
cd ~/path/to/target-repo
make setup
make test
```

For devcontainer-based repos, open the folder in Cursor or VS Code and choose **Reopen in Container**.

---

## Project Layout

```
D5_Reproducible_dev_environment/
├── agent.md                        # D5 agent spec and workflow
├── README.md                       # This file
└── docs/
    └── dev-bootstrap-report.md     # Evidence from latest agent run
```

Bootstrap deliverables live in `{target-path}/`, not here.

---

## Troubleshooting

| Issue | Fix |
| ----- | --- |
| `asdf not found` | Install [asdf](https://asdf-vm.com/) and required plugins, or use `devcontainer` / `mise` approach |
| Wrong Java/Node on PATH | Run `asdf install` or `mise install` before `make setup` |
| `docker compose` vs `docker-compose` | Agent scripts try both; install Docker Compose v2 plugin or standalone v1 |
| Port collision (3306, 6379, etc.) | Override in target repo `.env` |
| Tests fail after bootstrap | Check report for captured output; ensure env vars and local services are up |

---

## Documentation

| Document | Description |
| -------- | ----------- |
| [`agent.md`](agent.md) | Full D5 agent spec, workflow, and success criteria |
| [`docs/dev-bootstrap-report.md`](docs/dev-bootstrap-report.md) | Latest bootstrap + test evidence |
