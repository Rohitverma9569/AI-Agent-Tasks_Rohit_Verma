# Multi Worktree Plan

> **Repository:** `/Users/rohitverma/Downloads/bo-migration-service`
> **Task:** Add bulk export API for migration status
> **Generated:** 2026-06-17
> **Base branch:** `master-foundry-changes-bo-migration-service`

---

## Task Definition

Add a **bulk export** HTTP API that returns migration status records for many users at once, suitable for operations/reporting (up to ~200K rows per repo design). The service already supports **bulk import** via `POST /bo-migration/v1/migrateUsersBulk` (CSV multipart) and **batch lookup** via `POST /bo-migration/v1/getMigrationStatus/byUserIdList` (max 10,000 IDs). This feature adds the **inverse operation**: export `migration_status` data in a downloadable format.

**Proposed endpoint (frozen for this plan):**

```
GET /bo-migration/v1/exportMigrationStatus?format=csv&limit=10000&offset=0
```

**Response:** `200 OK`, `Content-Type: text/csv`, body = CSV with columns matching bulk import:

```csv
userId,ucc,primaryCluster,secondaryCluster,isSecondarySyncAllowed
```

**`[NEEDS CLARIFICATION]`** (does not block lane split — defaults above):

| Item | Default in plan |
| ---- | --------------- |
| Export format | CSV only in v1 (JSON deferred) |
| Max rows per request | 10,000 (align with `byUserIdList` cap) |
| Data source | MySQL via JPA (not Redis cache) for full export accuracy |
| Auth | Same as other `/bo-migration/**` endpoints (`X-Migration-Api-Key` when enabled) |

**Stack:** Java 17, Spring Boot 3.2, Maven, JPA, Redis cache, Apache Commons CSV (already in `pom.xml` for bulk import).

**No database migration required** — reads existing `migration_status` table (`MigrationStatus` entity).

---

## Task Decomposition

| Lane | Objective | Files Expected | Risk |
| ---- | --------- | -------------- | ---- |
| **A — Contract** | Freeze API shape + add request/response DTOs and export format enum | `src/main/java/com/paytmmoney/migration/model/enums/ExportFormat.java` **(new)**, `src/main/java/com/paytmmoney/migration/model/dto/MigrationExportQuery.java` **(new)**, `docs/api/migration-export-contract.md` **(new)** | **Low** — new files only |
| **B — Repository** | Add paginated read for export (no service/controller changes) | `src/main/java/com/paytmmoney/migration/repository/MigrationStatusRepository.java` **(edit)**, `src/test/java/com/paytmmoney/migration/repository/MigrationStatusRepositoryTest.java` **(new, @DataJpaTest)** | **Low** — single shared file, isolated methods |
| **C — Service** | Export business logic + CSV serialization | `src/main/java/com/paytmmoney/migration/service/MigrationExportService.java` **(new)**, `src/main/java/com/paytmmoney/migration/service/MigrationStatusCsvWriter.java` **(new)**, `src/test/java/com/paytmmoney/migration/service/MigrationExportServiceTest.java` **(new)**, `src/test/java/com/paytmmoney/migration/service/MigrationStatusCsvWriterTest.java` **(new) | **Medium** — depends on Lane A DTOs + Lane B repo methods |
| **D — Controller** | HTTP endpoint, Swagger annotations, WebMvc tests | `src/main/java/com/paytmmoney/migration/controller/MigrationExportController.java` **(new)**, `src/test/java/com/paytmmoney/migration/controller/MigrationExportControllerTest.java` **(new) | **Low** — new controller file (avoids editing `MigrationStatusController.java`) |

### Lane dependencies

| Lane | Blocked by | Blocks |
| ---- | ---------- | ------ |
| A | — | C, D |
| B | — | C |
| C | A, B | D |
| D | C | — |

**Parallel wave 1:** Lanes **A** and **B** (no file overlap).

**Parallel wave 2:** Lane **C** after A + B merged to base.

**Serial wave 3:** Lane **D** after C merged.

---

## Branch Strategy

| Lane | Branch | Worktree path | Owner |
| ---- | ------ | ------------- | ----- |
| A — Contract | `feature/export-migration-status-contract` | `../bo-migration-export-contract` | Agent A |
| B — Repository | `feature/export-migration-status-repo` | `../bo-migration-export-repo` | Agent B |
| C — Service | `feature/export-migration-status-service` | `../bo-migration-export-service` | Agent C |
| D — Controller | `feature/export-migration-status-controller` | `../bo-migration-export-controller` | Agent D |

### Worktree commands

```bash
cd ~/Downloads/bo-migration-service
git fetch origin
git checkout master-foundry-changes-bo-migration-service
git pull

git worktree add ../bo-migration-export-contract -b feature/export-migration-status-contract
git worktree add ../bo-migration-export-repo     -b feature/export-migration-status-repo
# After A + B merged:
git worktree add ../bo-migration-export-service   -b feature/export-migration-status-service
# After C merged:
git worktree add ../bo-migration-export-controller -b feature/export-migration-status-controller
```

### Cleanup after merge

```bash
git worktree remove ../bo-migration-export-contract
git worktree remove ../bo-migration-export-repo
git worktree remove ../bo-migration-export-service
git worktree remove ../bo-migration-export-controller
```

---

## Agent Prompt Per Lane

### Lane A — API contract + DTOs

```
Repository: ~/Downloads/bo-migration-service
Branch: feature/export-migration-status-contract
Worktree: ../bo-migration-export-contract

Task: Implement Lane A only — API contract and DTOs for bulk migration status export.

ALLOWED files (create/edit only these):
- src/main/java/com/paytmmoney/migration/model/enums/ExportFormat.java (new: CSV; reserve JSON for future)
- src/main/java/com/paytmmoney/migration/model/dto/MigrationExportQuery.java (new: format, limit, offset with validation)
- docs/api/migration-export-contract.md (new: endpoint, query params, CSV columns, error codes)

FORBIDDEN: controllers, services, repositories, tests, pom.xml, application.yml

API contract to document:
- GET /bo-migration/v1/exportMigrationStatus?format=csv&limit=10000&offset=0
- Response: text/csv, columns: userId,ucc,primaryCluster,secondaryCluster,isSecondarySyncAllowed
- Validation: limit 1..10000, offset >= 0, format required
- Errors: 400 invalid params, 415 unsupported format

Follow .foundry/casts/code-style.md: Lombok, jakarta.validation, package layout.

Done when: DTOs compile, contract doc complete, ./mvnw compile passes. No other files changed.
```

### Lane B — Repository pagination

```
Repository: ~/Downloads/bo-migration-service
Branch: feature/export-migration-status-repo
Worktree: ../bo-migration-export-repo

Task: Implement Lane B only — paginated JPA read for migration status export.

ALLOWED files (create/edit only these):
- src/main/java/com/paytmmoney/migration/repository/MigrationStatusRepository.java
- src/test/java/com/paytmmoney/migration/repository/MigrationStatusRepositoryTest.java (new, @DataJpaTest)

Add method (exact signature — do not rename):
  Page<MigrationStatus> findAllByOrderByIdAsc(Pageable pageable);

Do NOT add service or controller code.
Do NOT modify existing query methods.

Follow Spring Data JPA conventions. Use H2 or testcontainers per existing test patterns in repo.

Done when: repository test passes for pagination, ./mvnw test -Dtest=MigrationStatusRepositoryTest passes.
```

### Lane C — Export service + CSV writer

```
Repository: ~/Downloads/bo-migration-service
Branch: feature/export-migration-status-service
Worktree: ../bo-migration-export-service

Prerequisite: Lanes A and B must be merged into your branch (rebase onto latest base).

Task: Implement Lane C only — export service layer.

ALLOWED files (create only):
- src/main/java/com/paytmmoney/migration/service/MigrationExportService.java
- src/main/java/com/paytmmoney/migration/service/MigrationStatusCsvWriter.java
- src/test/java/com/paytmmoney/migration/service/MigrationExportServiceTest.java
- src/test/java/com/paytmmoney/migration/service/MigrationStatusCsvWriterTest.java

FORBIDDEN: controllers, MigrationStatusRepository.java edits, existing services (MigrationStatusService, BulkMigrationService)

MigrationExportService interface:
- byte[] exportCsv(MigrationExportQuery query) — reads DB via repository pagination, delegates to CsvWriter
- Enforce limit cap 10000 in service layer

MigrationStatusCsvWriter:
- Use org.apache.commons.csv (already on classpath) — mirror BulkMigrationService CSV style
- Header row: userId,ucc,primaryCluster,secondaryCluster,isSecondarySyncAllowed

Use constructor injection, @Service, @Slf4j. Mock repository in unit tests.

Done when: ./mvnw test -Dtest=MigrationExport* passes.
```

### Lane D — Controller + HTTP tests

```
Repository: ~/Downloads/bo-migration-service
Branch: feature/export-migration-status-controller
Worktree: ../bo-migration-export-controller

Prerequisite: Lane C merged into your branch.

Task: Implement Lane D only — HTTP endpoint for bulk export.

ALLOWED files (create only):
- src/main/java/com/paytmmoney/migration/controller/MigrationExportController.java
- src/test/java/com/paytmmoney/migration/controller/MigrationExportControllerTest.java

FORBIDDEN: MigrationStatusController.java, MigrationExportService.java edits, repository edits

MigrationExportController:
- @RestController @RequestMapping("/bo-migration")
- GET /v1/exportMigrationStatus
- @Valid MigrationExportQuery as @ModelAttribute or individual @RequestParam
- Returns ResponseEntity<byte[]> with Content-Type text/csv, Content-Disposition attachment
- Swagger @Operation on new controller
- Inject MigrationExportService only

WebMvcTest with @MockBean MigrationExportService.

Done when: ./mvnw test -Dtest=MigrationExportControllerTest passes and ./mvnw compile succeeds.
```

---

## Shared Constraints

| Constraint | Value / rule |
| ---------- | ------------- |
| API path | `GET /bo-migration/v1/exportMigrationStatus` |
| Query params | `format` (ExportFormat), `limit` (1–10000), `offset` (≥0) |
| CSV columns | `userId,ucc,primaryCluster,secondaryCluster,isSecondarySyncAllowed` |
| DTO contract | `MigrationExportQuery` — Lane A owns field names/types |
| Repository method | `Page<MigrationStatus> findAllByOrderByIdAsc(Pageable pageable)` — Lane B owns |
| Response type | `byte[]` CSV body, not JSON wrapper |
| Database | Read-only; no Flyway migration for v1 |
| Cache | Do not read Redis for export — use JPA for authoritative data |
| Coding standards | `.foundry/casts/code-style.md`, `./mvnw validate` clean |
| Tests | JUnit 5, Mockito, `@WebMvcTest` for controller; TDD per `.foundry/casts/testing.md` |
| Logging | `@Slf4j`, log export size + duration at INFO |
| Security | Document `X-Migration-Api-Key` in contract; do not disable security filters |

### Shared files (do not edit in parallel)

| File | Owner lane | Reason |
| ---- | ---------- | ------ |
| `MigrationStatusRepository.java` | **B only** | Single repository extension point |
| `MigrationStatusController.java` | **None** — use new `MigrationExportController` | Avoid merge conflicts |
| `MigrationStatusService.java` | **None** — use new `MigrationExportService` | Avoid merge conflicts |
| `pom.xml` | **None** — commons-csv already present | No new deps in v1 |

---

## Merge Order

1. **Lane A** (`feature/export-migration-status-contract`) — DTOs + contract doc; zero runtime deps for other lanes
2. **Lane B** (`feature/export-migration-status-repo`) — can merge same day as A (parallel, no conflict)
3. **Lane C** (`feature/export-migration-status-service`) — requires A + B on branch
4. **Lane D** (`feature/export-migration-status-controller`) — requires C on branch

**Integration branch (optional):** `feature/export-migration-status` — merge A→B→C→D sequentially, then PR to `master-foundry-changes-bo-migration-service`.

---

## Conflict Prevention Plan

### Expected overlap

| Files | Lanes | Strategy |
| ----- | ----- | -------- |
| `MigrationStatusRepository.java` | B only | No other lane touches — safe |
| `model/dto/*`, `model/enums/*` | A only | C imports but does not edit |
| New service/controller files | C, D separate | No overlap between C and D |

### High-risk files (do not split across lanes)

- `MigrationStatusController.java` — **excluded**; new `MigrationExportController` instead
- `MigrationStatusService.java` — **excluded**; new `MigrationExportService` instead
- `BulkMigrationService.java` — **read-only reference** for CSV patterns; no edits
- `application.yml` — no changes in v1

### Reconciliation strategy

1. If Lane C starts before B merges: C mocks `MigrationStatusRepository` in tests using the **frozen method signature** from Shared Constraints; rebase C after B merges.
2. If export limit validation differs between A and C: **Lane A contract wins** — C must match `MigrationExportQuery` validation.
3. Merge conflicts on `pom.xml`: escalate to human — should not occur in v1.

---

## Verification Plan

### Per-lane

| Lane | Build | Test | Done when |
| ---- | ----- | ---- | --------- |
| A | `./mvnw compile` | — (compile only) | DTOs compile, contract doc exists |
| B | `./mvnw compile` | `./mvnw test -Dtest=MigrationStatusRepositoryTest` | Pagination query verified |
| C | `./mvnw compile` | `./mvnw test -Dtest=MigrationExport*` | CSV bytes match fixture |
| D | `./mvnw compile` | `./mvnw test -Dtest=MigrationExportControllerTest` | 200 + CSV content-type |

### Post-merge integration

| Step | Command | Expected |
| ---- | ------- | -------- |
| Full unit suite | `./mvnw test` | All tests pass |
| Lint gate | `make lint` or `./mvnw validate` | Checkstyle/spotless clean |
| CI parity | `./mvnw verify -Ddependency-check.skip=true` | Per `docs/contributing/AGENT_READINESS.md` |
| Manual smoke | `curl -H "X-Migration-Api-Key: $KEY" "http://localhost:8080/bo-migration/v1/exportMigrationStatus?format=csv&limit=100&offset=0" -o export.csv` | CSV file with header + rows |
| Swagger | Open `/swagger-ui.html` | New export endpoint documented |

### Integration verification checklist

| Check | Pass criteria |
| ----- | ------------- |
| CSV round-trip | Export row can be re-imported via `migrateUsersBulk` column layout |
| Pagination | `offset=100&limit=50` returns next page, no duplicate rows |
| Empty DB | `200` with header-only CSV or `204` per contract doc |
| Limit enforcement | `limit=10001` → `400` |

---

## Not in scope / Blocked

| Item | Reason |
| ---- | ------ |
| JSON export format | Deferred — CSV only in v1 |
| Async / streaming export for full 200K | v1 capped at 10K per request; streaming is follow-up |
| Redis cache as export source | Plan uses JPA for accuracy |
| Flyway migration | No schema change |
| Frontend / UI download button | Backend API only |
| Worktree creation | Plan only — user must run worktree commands |
