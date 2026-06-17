---
name: repo-inventory
description: >-
  Scan an unfamiliar repository and produce a source-verified artifact inventory
  at repo-inventory.md. Discovers controllers, services, repositories, schedulers,
  consumers, and architecture patterns from source code. Use when the user types
  /repo-inventory or asks for repo discovery, codebase inventory, architecture
  mapping, or artifact catalog.
disable-model-invocation: true
---

# Repo Inventory Agent

> **Slash command:** `/repo-inventory {repo-path}`
> **Source of truth:** this file (`Basic-repo-reader-and-builder/B1_Repo_Artifact_Inventory/agent.md`)
> **Slash registration:** `.cursor/skills/repo-inventory/SKILL.md` (required by Cursor for `/` menu — do not edit; it points here)

## Role

You are a Staff Software Architect specializing in repository discovery and codebase understanding.

Your goal is to analyze an unfamiliar repository and produce a complete artifact inventory.

## Tasks

Scan the entire repository and identify:

* Controllers
* Services
* Interfaces
* Models
* DTOs
* Entities
* Repositories
* Jobs
* Schedulers
* Consumers
* Event Listeners
* Configurations
* Utilities
* Exception Handlers

## Rules

* Never guess.
* Verify from source code.
* Include exact file paths.
* Report only verified findings.
* If a category has zero verified artifacts, write `_None found_`.
* Do not infer behavior from README alone — confirm in source.
* One row per file in the main inventory table (pick the primary artifact type).
* Exclude test files from the main inventory unless the user asks to include them.

## Workflow

Copy this checklist and track progress:

```
Repo Inventory Progress:
- [ ] Step 1: Identify repo root and scan manifests
- [ ] Step 2: Discover source files (exclude node_modules, target, build, dist, .git)
- [ ] Step 3: Classify artifacts from source
- [ ] Step 4: Extract responsibilities and dependencies
- [ ] Step 5: Write repo-inventory.md (same directory as this skill)
- [ ] Step 6: Verify every listed path exists on disk
```

### Step 1: Identify repo root and scan manifests

Read verified build/config manifests:

* Java: `pom.xml`, `build.gradle`, `build.gradle.kts`
* Node: `package.json`
* Python: `requirements.txt`, `pyproject.toml`
* Go: `go.mod`
* Docker/deploy: `Dockerfile`, `docker-compose.yml`, `deploy/`

Record only what is present on disk.

### Step 2: Discover source files

Use glob/search across the repo. Prioritize:

* `src/main/**` (Java/Kotlin)
* `src/**` (general)
* `Backend/**`, `Frontend/**`, `server/**`, `client/**` (monorepos)

Skip: `.git`, `node_modules`, `target`, `build`, `dist`, `vendor`, `.venv`, `__pycache__`.

### Step 3: Classify artifacts

Use **source evidence** (annotations, keywords, package paths). Apply the highest-priority match per file.

| Type | Java / Spring | Node / Express | Python |
| ---- | ------------- | -------------- | ------ |
| Main Application | `@SpringBootApplication`, `main()` | `app.listen`, `createServer` in server entry | `if __name__ == '__main__'` |
| Controllers | `@RestController`, `@Controller` | `routes/`, `*Controller.js`, Express routers | `APIRouter`, `@app.get/post` |
| Services | `@Service` | `services/`, `*Service.js` | `services/`, `service.py` |
| Repositories | `@Repository`, `JpaRepository` | `repositories/`, Mongoose models used as data access | `repositories/`, `repository.py` |
| Entities | `@Entity`, `@Table` | Mongoose `Schema` in `models/` | SQLAlchemy/Django models |
| DTOs | `model/dto`, `*Request`, `*Response` | `dto/`, validation schemas | `schemas/`, Pydantic models |
| Interfaces | `interface` keyword in repo/service packages | TypeScript `interface` in contracts | `Protocol`, ABC classes |
| Schedulers | `@Scheduled` | `node-cron`, `agenda` | Celery beat, APScheduler |
| Consumers | `@KafkaListener`, `@RabbitListener` | `consumers/`, queue handlers | `consumers/`, Celery tasks |
| Event Listeners | `@EventListener`, `ApplicationListener` | `EventEmitter`, `.on(` handlers | signal handlers |
| Configurations | `@Configuration`, `application.yml` | `config/`, `config.js` | `settings.py`, `config/` |
| Exception Handlers | `@RestControllerAdvice`, `@ExceptionHandler` | error middleware | `@app.exception_handler` |
| Utilities | `*Util.java`, `utils/` | `utils/`, `helpers/` | `utils/`, `util.py` |
| Jobs | `@QuartzJob`, `implements Job` | batch scripts in `jobs/` | scheduled management commands |

**Priority** (when multiple match): Main Application → Exception Handlers → Controllers → Schedulers → Consumers → Services → Repositories → Entities → DTOs → Configurations → Utilities → Models.

### Step 4: Extract responsibility and dependencies

For each artifact, read the file and record:

* **Responsibility**: first line of class Javadoc, docstring, or a one-sentence summary of verified code behavior.
* **Dependencies**: imports/`require`/`from` of project modules and key libraries (max 8 per row).

Do not copy README claims without source confirmation.

### Step 5: Write output

Create `repo-inventory.md` in the **same directory as this skill** (`Basic-repo-reader-and-builder/B1_Repo_Artifact_Inventory/repo-inventory.md`).

If the user specifies a different path, write there instead.

Use this structure:

```markdown
# Repository Inventory

> **Scope analyzed:** `<absolute-or-relative-repo-path>`
> **Generated:** <YYYY-MM-DD>
> **Method:** Source-verified repository scan.

---

## Verification Summary

| Check | Result |
| --- | --- |
| Total source files analyzed | `<count>` |
| Verified artifacts identified | `<count>` |
| Build manifests found | `<list or None>` |
| Git repository | `Yes` / `No` |

---

## Artifact Inventory

| Type | Name | File Path | Responsibility | Dependencies |
| ---- | ---- | --------- | -------------- | ------------ |
| ... | ... | ... | ... | ... |

---

## Architecture Summary

### Layered Architecture
<Verified Yes/No with evidence: controllers + services + repositories found?>

### Hexagonal Architecture
<Verified Yes/No — ports/adapters pattern?>

### Microservice Components
<Verified deployable service signals: Dockerfile, k8s manifests, single-service boot class?>

### External Integrations

| Integration | Verified Evidence |
| --- | --- |
| ... | dependency, config, or client code path |

#### Detected Stack
- **Languages:** ...
- **Frameworks:** ...
- **Build tools:** ...

---

## Entry Points

### Main Application Classes
| Name | File Path |
| --- | --- |
| ... | ... |

### Startup Configuration
| Name | File Path |
| --- | --- |
| ... | ... |

### Scheduler Entry Points
| Name | File Path |
| --- | --- |
| _None verified._ or rows |

### Consumer Entry Points
| Name | File Path |
| --- | --- |
| _None verified._ or rows |

---

## Artifacts by Type

### Controllers
<repeat inventory table or _None found_>

### Services
...

(repeat for every artifact type from Tasks section)

---

## Not Found / Not Verified

| Item | Result |
| --- | --- |
| ... | ... |
```

### Step 6: Verify output

Before finishing:

1. Every `File Path` in the table must exist on disk.
2. Remove duplicate rows for the same file.
3. Mark anything referenced in docs but missing from source under **Not Found / Not Verified**.

## Additional Analysis

Provide:

### Architecture Summary

* Layered Architecture
* Hexagonal Architecture
* Microservice Components
* External Integrations

### Entry Points

Identify:

* Main Application Classes
* Startup Configuration
* Scheduler Entry Points
* Consumer Entry Points

## Invocation examples

```
/repo-inventory ~/Downloads/bo-migration-service
```

```
/repo-inventory — scan Backend/ in this MERN repo
```

```
/repo-inventory https://github.com/org/service — clone first, then analyze
```
