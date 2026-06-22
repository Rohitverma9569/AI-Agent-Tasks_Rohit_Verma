# Bug Investigation Report

> **Repository:** `/Users/rohitverma/Downloads/bo-migration-service`
> **Bug:** `GET byUserId` returns default values instead of 404 for missing user
> **Generated:** 2026-06-17
> **Status:** Fixed (verified by unit tests)
> **Project status:** [STATUS.md](./STATUS.md)

---

## Bug Description

When calling `GET /bo-migration/v1/getMigrationStatus/byUserId/{userId}` for a user that does **not** exist in the migration cache (with global flag `AUDIT`), the API returns **HTTP 200** with synthetic **default cluster values** instead of **HTTP 404 Not Found**.

This misleads API consumers into believing the user exists with default migration configuration.

---

## Reproduction Steps

| Step | Command / Action | Input |
| ---- | ---------------- | ----- |
| 1 | Ensure global flag is `AUDIT` (default in `migration_default_config`) | — |
| 2 | Call endpoint with a `userId` not present in Redis cache | `userId=999` |
| 3 | Observe HTTP status and body | — |

**Endpoint:** `GET /bo-migration/v1/getMigrationStatus/byUserId/999`

**Expected result:** `404 Not Found` (empty body or error payload)

**Actual result (before fix):** `200 OK` with body like:

```json
{
  "userId": 999,
  "cluster": { "primary": "CLASS", "secondary": "TECHEXCEL" },
  "isSecondarySyncAllowed": true
}
```

**Code-level reproduction (pre-fix):** In `MigrationStatusService.getByUserId`, when `GlobalFlag.AUDIT` and `cacheManager.getByUserId(userId)` returns `null`, execution fell through to `getDefaultResponse()` instead of signalling not-found.

---

## Root Cause Analysis

| File | Function | Problem |
| ---- | -------- | ------- |
| `src/main/java/com/paytmmoney/migration/service/MigrationStatusService.java` | `getByUserId` | On AUDIT mode cache miss, no early exit — code falls through to `getDefaultResponse(userId, null)` (L59–61) |
| `src/main/java/com/paytmmoney/migration/controller/MigrationStatusController.java` | `getByUserId` | Always wraps service result in `ResponseEntity.ok()` — no handling for missing user (L38–40) |

**Call chain:**

```
GET /bo-migration/v1/getMigrationStatus/byUserId/{userId}
  → MigrationStatusController.getByUserId
  → MigrationStatusService.getByUserId
  → cacheManager.getByUserId → null
  → getDefaultResponse()  ← bug: treats missing as defaults
  → 200 OK
```

---

## Fix

### Files changed

| File | Why changed |
| ---- | ----------- |
| `MigrationStatusService.java` | Return `null` when AUDIT mode and cache miss (instead of default response) |
| `MigrationStatusController.java` | Map `null` service result to `ResponseEntity.notFound()`; update OpenAPI description |
| `MigrationStatusControllerTest.java` | **New** — asserts 404 on null, 200 when found |
| `MigrationStatusServiceTest.java` | **New** — asserts service returns null on cache miss in AUDIT mode |

### Diff summary

**Service:** After AUDIT branch cache lookup, if `status == null`, `return null` immediately.

**Controller:** If `migrationStatusService.getByUserId(userId)` returns `null`, return `404 Not Found`.

**Scope:** Only `byUserId` GET endpoint. `byUcc` and `byUserIdList` unchanged. Non-AUDIT global flag modes still return defaults (by design).

---

## Verification

### Build

| Field | Value |
| ----- | ----- |
| Command | `mvn -q compile` |
| Exit code | `0` |
| Output | Compile succeeded (no errors) |

### Tests

| Field | Value |
| ----- | ----- |
| Command | `mvn -q test` |
| Exit code | `0` |
| Output | All tests passed including `MigrationStatusControllerTest.getByUserIdReturns404WhenNotFound`, `MigrationStatusServiceTest.getByUserIdReturnsNullWhenAuditModeAndUserNotInCache` |

**Key log lines from test run:**

```
GET /getMigrationStatus/byUserId/999 not found
Fetching migration status for userId: 999
Fetching migration status for userId: 42
```

### Reproduction (post-fix)

| Field | Value |
| ----- | ----- |
| Command | `mvn -q test -Dtest=MigrationStatusControllerTest#getByUserIdReturns404WhenNotFound` |
| Expected | HTTP 404 for userId 999 when service returns null |
| Actual | Test passes — `status().isNotFound()` |
| Pass | **Yes** |

---

## Agent vs Manual Verification

### Agent suggested

| Claim | Evidence |
| ----- | -------- |
| Bug reproduced in code | `MigrationStatusService.getByUserId` L47–61 — cache miss → `getDefaultResponse` before fix |
| Root cause identified | Service + controller both contributed; service was primary |
| Fix verified | `mvn test` exit 0; new controller test asserts 404 |
| No unrelated files changed | 2 main + 2 test files only |

### Manually verified

| Claim | Evidence |
| ----- | -------- |
| Live HTTP curl against running service | Pending user review |
| Integration test with real Redis | Pending user review |

---

## Risk Assessment

| Risk | Level | Notes |
| ---- | ----- | ----- |
| Regression risk | **Low** | Narrow branch: AUDIT + cache miss on `byUserId` only |
| Deployment risk | **Medium** | **Breaking change** for clients that relied on 200 + defaults for unknown users in AUDIT mode |
| Rollback strategy | Revert commit or restore `getDefaultResponse` fallback in `getByUserId` AUDIT branch |

---

## Not Done / Blocked

| Item | Reason |
| ---- | ------ |
| 404 for `byUcc` missing users | Out of scope — bug report specified `byUserId` only |
| Git commit | Not requested |
| Live curl against running app | Requires MySQL/Redis + running server — unit tests used as proof |
