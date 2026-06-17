# Change Report

> **Repository:** `/Users/rohitverma/Downloads/bo-migration-service`
> **Change request:** Return 404 when migration status not found by userId
> **Generated:** 2026-06-17
> **Method:** Minimal-diff implementation with build/test evidence.

---

## Change Request

**Before:** `GET /bo-migration/v1/getMigrationStatus/byUserId/{userId}` returned `200 OK` with default cluster values when the user had no record in cache (AUDIT global flag mode).

**After:** When global flag is `AUDIT` and the user is not in the migration cache, the endpoint returns **`404 Not Found`** with an empty body instead of synthetic default values.

**Scope:** Only the `byUserId` GET endpoint. `byUcc` and `byUserIdList` behaviour unchanged. Non-AUDIT global flag modes still return default values (existing behaviour).

---

## Files Modified

| File | Reason |
| ---- | ------ |
| `src/main/java/com/paytmmoney/migration/service/MigrationStatusService.java` | Return `null` from `getByUserId` when AUDIT mode and cache miss (instead of default response) |
| `src/main/java/com/paytmmoney/migration/controller/MigrationStatusController.java` | Map `null` service result to `ResponseEntity.notFound()`; update OpenAPI description |
| `src/test/java/com/paytmmoney/migration/controller/MigrationStatusControllerTest.java` | **New** — WebMvcTest for 404 and 200 paths |
| `src/test/java/com/paytmmoney/migration/service/MigrationStatusServiceTest.java` | **New** — unit tests for cache miss (null) and cache hit |

---

## Diff Summary

**Service (`getByUserId`):** In the AUDIT branch, when `cacheManager.getByUserId(userId)` returns `null`, the method now returns `null` immediately instead of falling through to `getDefaultResponse()`.

**Controller (`getByUserId`):** After calling the service, if the response is `null`, return `404 Not Found`. Otherwise return `200 OK` as before.

```diff
// MigrationStatusService.getByUserId — AUDIT branch cache miss
-        }
-
-        MigrationStatusResponse response = getDefaultResponse(userId, null);
+            return null;
+        }
+
+        MigrationStatusResponse response = getDefaultResponse(userId, null);

// MigrationStatusController.getByUserId
         MigrationStatusResponse response = migrationStatusService.getByUserId(userId);
+        if (response == null) {
+            return ResponseEntity.notFound().build();
+        }
         return ResponseEntity.ok(response);
```

---

## Tests

### Existing tests updated

| Test file | Test name | Change |
| --------- | --------- | ------ |
| _None_ | — | No existing tests covered this endpoint |

### New tests added

| Test file | Test name | Covers |
| --------- | --------- | ------ |
| `MigrationStatusControllerTest.java` | `getByUserIdReturns404WhenNotFound` | Controller returns HTTP 404 when service returns null |
| `MigrationStatusControllerTest.java` | `getByUserIdReturns200WhenFound` | Controller returns HTTP 200 with body when service returns status |
| `MigrationStatusServiceTest.java` | `getByUserIdReturnsNullWhenAuditModeAndUserNotInCache` | Service returns null on AUDIT + cache miss |
| `MigrationStatusServiceTest.java` | `getByUserIdReturnsStatusWhenAuditModeAndUserInCache` | Service returns mapped response on cache hit |

---

## Execution

### Build

| Field | Value |
| ----- | ----- |
| Command | `mvn -q compile` |
| Exit code | `0` |
| Output | _(no errors; compile succeeded)_ |

### Tests

| Field | Value |
| ----- | ----- |
| Command | `mvn -q test` |
| Exit code | `0` |
| Output | All tests passed including new `MigrationStatusControllerTest` and `MigrationStatusServiceTest`. Log excerpts: `GET /getMigrationStatus/byUserId/999 not found` (404 path); `GET /getMigrationStatus/byUserId/42 response: MigrationStatusResponse(...)` (200 path). |

---

## Risk Assessment

**Classification:** **Low**

**Why:**

* Two production files changed with a narrow, explicit branch (AUDIT + cache miss only).
* No schema, config, or dependency changes.
* Backward-incompatible for clients that relied on `200` + default values for unknown users in AUDIT mode — intentional per request.
* `byUcc` / bulk endpoints untouched; non-AUDIT modes unchanged.

---

## Verification Matrix

### Agent suggested

| Item | Status |
| ---- | ------ |
| Unit tests pass | Pass (`mvn test` exit 0) |
| Build succeeds | Pass (`mvn compile` exit 0) |
| Change matches request | Pass — 404 on not found by userId in AUDIT mode |
| No unrelated files changed | Pass — 2 main + 2 test files only |

### Manually verified

| Item | Status |
| ---- | ------ |
| Live HTTP call against running service | Pending user review |
| Client impact (callers expecting 200 + defaults) | Pending user review |

---

## Not Done / Deferred

| Item | Reason |
| ---- | ------ |
| 404 for `byUcc` when not found | Out of scope — request specified userId only |
| 404 in non-AUDIT global flag modes | Out of scope — those modes skip cache lookup by design |
| Git commit | Not requested |
