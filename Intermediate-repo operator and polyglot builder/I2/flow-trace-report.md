# Flow Trace Report

> **Scope analyzed:** `/Users/rohitverma/Downloads/bo-migration-service`
> **Entry point traced:** `POST /v1/migrateUser` (controller route; full path `POST /bo-migration/v1/migrateUser`)
> **Generated:** 2026-06-17
> **Method:** Source-verified end-to-end call-chain tracing.

---

## Flow Summary

Migrates a single user to a specified primary/secondary cluster configuration. The endpoint accepts a JSON body with `userId` or `ucc`, cluster targets, and a secondary-sync flag. It upserts a row in `migration_status`, writes an audit record to `migration_audit_log`, and synchronizes the in-memory Redis cache indexes keyed by user ID and UCC.

---

## Entry Point

| Field | Value |
| ----- | ----- |
| Type | HTTP endpoint |
| File path | `src/main/java/com/paytmmoney/migration/controller/MigrationController.java` |
| Class | `com.paytmmoney.migration.controller.MigrationController` |
| Function | `migrateUser` |
| Route / trigger | `@PostMapping("/v1/migrateUser")` on class `@RequestMapping("/bo-migration")` → **`POST /bo-migration/v1/migrateUser`** |

**Request body:** `MigrateUserRequest` (`src/main/java/com/paytmmoney/migration/model/dto/MigrateUserRequest.java`) — fields: `userId`, `ucc`, `cluster` (`@NotNull`), `isSecondarySyncAllowed` (`@NotNull`).

---

## Step-by-Step Trace

| Step | File | Class | Function | Responsibility |
| ---- | ---- | ----- | -------- | -------------- |
| 1 | `src/main/java/com/paytmmoney/migration/controller/MigrationController.java` | `MigrationController` | `migrateUser` | Receives `POST /v1/migrateUser`; `@Valid` triggers Bean Validation on `MigrateUserRequest`; logs request; delegates to service |
| 2 | `src/main/java/com/paytmmoney/migration/service/MigrationService.java` | `MigrationService` | `migrateUser` | Opens `@Transactional` boundary; validates at least one of `userId` or `ucc` is present |
| 3a | `src/main/java/com/paytmmoney/migration/repository/MigrationStatusRepository.java` | `MigrationStatusRepository` | `findByUserId` | **DB read** — lookup existing status by `userId` when `request.getUserId() != null` (`MigrationService.java` L39–41) |
| 3b | `src/main/java/com/paytmmoney/migration/repository/MigrationStatusRepository.java` | `MigrationStatusRepository` | `findByUcc` | **DB read** — lookup existing status by `ucc` when only `ucc` provided (`MigrationService.java` L42–44) |
| 4a | `src/main/java/com/paytmmoney/migration/service/MigrationService.java` | `MigrationService` | `createAuditLog` | **Update path** — builds audit log with old/new cluster values (`MigrationService.java` L54, L88–102) |
| 4b | `src/main/java/com/paytmmoney/migration/repository/MigrationAuditLogRepository.java` | `MigrationAuditLogRepository` | `save` | **DB write** — persists audit log (update path, `MigrationService.java` L101) |
| 5a | `src/main/java/com/paytmmoney/migration/service/MigrationService.java` | `MigrationService` | `migrateUser` (update branch) | Mutates `existingStatus` cluster fields (`MigrationService.java` L56–58) |
| 6a | `src/main/java/com/paytmmoney/migration/repository/MigrationStatusRepository.java` | `MigrationStatusRepository` | `save` | **DB write** — UPDATE `migration_status` (update path, `MigrationService.java` L60) |
| 7a | `src/main/java/com/paytmmoney/migration/cache/MigrationCacheManager.java` | `MigrationCacheManager` | `update` | **Cache write** — removes old Redis hash entries, puts new (`MigrationService.java` L63; `MigrationCacheManager.java` L135–138) |
| 4c | `src/main/java/com/paytmmoney/migration/service/MigrationService.java` | `MigrationService` | `migrateUser` (create branch) | Builds new `MigrationStatus` entity when no existing row (`MigrationService.java` L68–74) |
| 5c | `src/main/java/com/paytmmoney/migration/repository/MigrationStatusRepository.java` | `MigrationStatusRepository` | `save` | **DB write** — INSERT `migration_status` (create path, `MigrationService.java` L76) |
| 6c | `src/main/java/com/paytmmoney/migration/service/MigrationService.java` | `MigrationService` | `createAuditLogForNew` | Builds audit log for new migration (`MigrationService.java` L79, L104–117) |
| 7c | `src/main/java/com/paytmmoney/migration/repository/MigrationAuditLogRepository.java` | `MigrationAuditLogRepository` | `save` | **DB write** — persists audit log (create path, `MigrationService.java` L116) |
| 8c | `src/main/java/com/paytmmoney/migration/cache/MigrationCacheManager.java` | `MigrationCacheManager` | `put` | **Cache write** — adds entries to Redis hashes `migration:user-id` and `migration:ucc` (`MigrationService.java` L82; `MigrationCacheManager.java` L114–123) |
| 9 | `src/main/java/com/paytmmoney/migration/controller/MigrationController.java` | `MigrationController` | `migrateUser` | Returns `200 OK` with `ApiResponse.success("User migrated successfully")` (`MigrationController.java` L37) |
| 10 | `src/main/java/com/paytmmoney/migration/model/dto/ApiResponse.java` | `ApiResponse` | `success` | Builds `{ status: "SUCCESS", message: "User migrated successfully" }` response body |

### Error paths (verified, not happy-path steps)

| Condition | Handler | File | Response |
| --------- | ------- | ---- | -------- |
| Bean Validation failure (`cluster` or `isSecondarySyncAllowed` null) | `handleValidationExceptions` | `GlobalExceptionHandler.java` L27–45 | `400 BAD_REQUEST` — no DB/cache side effects |
| Both `userId` and `ucc` null | `handleIllegalArgumentException` | `GlobalExceptionHandler.java` L19–24 | `400 BAD_REQUEST` — thrown at `MigrationService.java` L32–34 |
| Unchecked runtime / generic errors | `handleRuntimeException` / `handleGenericException` | `GlobalExceptionHandler.java` L48–62 | `500 INTERNAL_SERVER_ERROR` |

---

## External Dependencies

| Dependency | Type | Used at step | Evidence |
| ---------- | ---- | ------------ | -------- |
| MySQL (`bo_common`) | Database | 3, 4, 5, 6, 7 | `application.yml` L7–10 — `jdbc:mysql://bo-logs-db.equity:3306/bo_common`; JPA repositories |
| Redis (`bo-redis.equity:6379`) | Cache | 7, 8 | `application.yml` L34–37; `MigrationCacheManager.java` — `RedisTemplate`, hash keys `migration:user-id`, `migration:ucc` |
| External HTTP APIs | — | — | _None found_ in traced path |
| Message queues | — | — | _None found_ in traced path |

---

## Side Effects

| Effect | Target | Step | Verified |
| ------ | ------ | ---- | -------- |
| DB read | `migration_status` (SELECT by `user_id` or `ucc`) | 3a / 3b | Yes |
| DB write | `migration_status` (INSERT or UPDATE) | 6a / 5c | Yes |
| DB write | `migration_audit_log` (INSERT) | 4b / 7c | Yes |
| Cache write | Redis hash `migration:user-id` | 7a / 8c | Yes |
| Cache write | Redis hash `migration:ucc` | 7a / 8c | Yes |
| HTTP outbound call | — | — | _None found_ |
| Queue publish | — | — | _None found_ |
| Queue consume | — | — | _None found_ |

**Final side effect (happy path):** User cluster assignment persisted in MySQL, audit trail recorded, Redis cache indexes updated, HTTP `200 OK` returned to client.

---

## Sequence Diagram

See [flow-trace-sequence.mmd](./flow-trace-sequence.mmd) for the full diagram.

---

## Known Uncertainties

| Item | Status |
| ---- | ------ |
| Full URL path prefix | **Verified** — class-level `@RequestMapping("/bo-migration")` + `@PostMapping("/v1/migrateUser")` → `/bo-migration/v1/migrateUser`. User query `/v1/migrateUser` is the method-relative path. |
| `performedBy` audit field | **Verified constant** — hardcoded `"SYSTEM"` in `createAuditLog` / `createAuditLogForNew` (`MigrationService.java` L98, L113); comment says "Can be enhanced to get from security context" — no security context integration found. |
| Auth / security filters | **Not found** — no Spring Security config or servlet filters in `src/main/java`; request may be unauthenticated at application layer. |
| Branch selection (update vs create) | **Runtime branch** — determined by step 3 read result; both branches verified in source. |
| `@PrePersist` timestamps | **Verified** — `MigrationStatus` entity sets `created_at` / `updated_at` on persist/update (`MigrationStatus.java` L54–62); Hibernate applies on `save`. |
| Transaction rollback on cache failure | **Unresolved** — `cacheManager.put/update` is outside explicit try/catch; Redis failure could propagate and roll back DB transaction via `@Transactional` on `migrateUser`. |

---

## Not Found / Not Verified

| Item | Result |
| ---- | ------ |
| Outbound HTTP clients (RestTemplate, WebClient, Feign) | _None found_ in `src/main/java` |
| Kafka / RabbitMQ / SQS | _None found_ |
| Servlet filters / interceptors on this route | _None found_ |
| Spring Security | _None found_ |
| Queue interactions | _None found_ |
