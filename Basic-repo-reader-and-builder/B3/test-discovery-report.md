# Test Discovery Report

> **Scope analyzed:** `/Users/rohitverma/Downloads/bo-migration-service`
> **Generated:** 2026-06-17
> **Method:** Source-verified discovery + executed test run.

---

## Test Framework

**Build Tool:** Maven 3.x (`pom.xml`)

**Test Framework:** JUnit 5 (Jupiter) + Spring Boot Test + Mockito

**Evidence:**
- `spring-boot-starter-test` (test scope) in `pom.xml` — includes JUnit Jupiter, Mockito, AssertJ, Spring Test
- Test classes import `org.junit.jupiter.api.Test`
- Maven Surefire `3.1.2` with `JUnitPlatformProvider` (from execution output)
- Controller slice tests use `@WebMvcTest`
- Service/scheduler tests use `@ExtendWith(MockitoExtension.class)`

---

## Config Files

| File Path | Purpose |
| --------- | ------- |
| `pom.xml` | Maven build; `spring-boot-starter-test`; compiler plugin; Spring Boot parent manages Surefire |
| `src/test/resources/application.properties` | Test placeholders for `BO_MYSQL_USERNAME`, `BO_MYSQL_PASSWORD`, and security properties used during slice test context bootstrap |
| `src/main/resources/application.yml` | Main app config loaded by `@WebMvcTest` context (datasource/redis URLs resolved with test property overrides) |

---

## Relevant Test Files

### Unit Tests

| File Path |
| --------- |
| `src/test/java/com/paytmmoney/migration/service/BulkMigrationServiceTest.java` |
| `src/test/java/com/paytmmoney/migration/service/DefaultMigrationConfigServiceTest.java` |
| `src/test/java/com/paytmmoney/migration/scheduler/CacheRefreshSchedulerTest.java` |
| `src/test/java/com/paytmmoney/migration/scheduler/DefaultMigrationConfigCacheRefreshSchedulerTest.java` |
| `src/test/java/com/paytmmoney/migration/model/dto/ApiResponseTest.java` |
| `src/test/java/com/paytmmoney/migration/model/dto/ClusterInfoTest.java` |
| `src/test/java/com/paytmmoney/migration/model/dto/DefaultMigrationConfigRequestValidationTest.java` |
| `src/test/java/com/paytmmoney/migration/model/dto/DefaultMigrationConfigResponseTest.java` |
| `src/test/java/com/paytmmoney/migration/model/dto/MigrateUserRequestValidationTest.java` |
| `src/test/java/com/paytmmoney/migration/model/dto/MigrationStatusByUserIdListRequestTest.java` |
| `src/test/java/com/paytmmoney/migration/model/dto/MigrationStatusResponseTest.java` |
| `src/test/java/com/paytmmoney/migration/model/entity/MigrationAuditLogAuditActionTest.java` |
| `src/test/java/com/paytmmoney/migration/model/enums/ClusterTypeTest.java` |
| `src/test/java/com/paytmmoney/migration/model/enums/GlobalFlagTest.java` |

### Integration Tests

| File Path |
| --------- |
| `src/test/java/com/paytmmoney/migration/controller/HealthControllerTest.java` |
| `src/test/java/com/paytmmoney/migration/controller/DefaultMigrationConfigControllerTest.java` |

_Both use `@WebMvcTest` — Spring MVC slice tests with mocked services and MockMvc._

### E2E Tests

_None found._ (no Cypress, Playwright, Selenium, or full `@SpringBootTest` with live DB/Redis)

---

## Commands

### Run all tests

```bash
cd /Users/rohitverma/Downloads/bo-migration-service && mvn test
```

### Run module tests

```bash
# N/A — single-module Maven project (no -pl submodules)
```

### Run single test class

```bash
cd /Users/rohitverma/Downloads/bo-migration-service && mvn test -Dtest=HealthControllerTest
```

### Run single test method

```bash
cd /Users/rohitverma/Downloads/bo-migration-service && mvn test -Dtest=HealthControllerTest#healthReturnsOk
```

---

## Execution

### Run attempted

**Command:**

```bash
cd /Users/rohitverma/Downloads/bo-migration-service && mvn test
```

**Exit Code:** `0`

**Output:**

```
[INFO] Scanning for projects...
[INFO] 
[INFO] ------------------< com.paytmmoney:migration-service >------------------
[INFO] Building Migration Service 1.0.0
[INFO]   from pom.xml
[INFO] --------------------------------[ jar ]---------------------------------
[INFO] 
[INFO] --- resources:3.3.1:resources (default-resources) @ migration-service ---
[INFO] Copying 3 resources from src/main/resources to target/classes
[INFO] Copying 3 resources from src/main/resources to target/classes
[INFO] 
[INFO] --- compiler:3.11.0:compile (default-compile) @ migration-service ---
[INFO] Nothing to compile - all classes are up to date
[INFO] 
[INFO] --- resources:3.3.1:testResources (default-testResources) @ migration-service ---
[INFO] Copying 1 resource from src/test/resources to target/test-classes
[INFO] 
[INFO] --- compiler:3.11.0:testCompile (default-testCompile) @ migration-service ---
[INFO] Nothing to compile - all classes are up to date
[INFO] 
[INFO] --- surefire:3.1.2:test (default-test) @ migration-service ---
[INFO] Using auto detected provider org.apache.maven.surefire.junitplatform.JUnitPlatformProvider
[INFO] 
[INFO] -------------------------------------------------------
[INFO]  T E S T S
[INFO] -------------------------------------------------------
[INFO] Running com.paytmmoney.migration.scheduler.DefaultMigrationConfigCacheRefreshSchedulerTest
[INFO] Tests run: 1, Failures: 0, Errors: 0, Skipped: 0
[INFO] Running com.paytmmoney.migration.scheduler.CacheRefreshSchedulerTest
[INFO] Tests run: 1, Failures: 0, Errors: 0, Skipped: 0
[INFO] Running com.paytmmoney.migration.controller.HealthControllerTest
[INFO] Tests run: 1, Failures: 0, Errors: 0, Skipped: 0
[INFO] Running com.paytmmoney.migration.controller.DefaultMigrationConfigControllerTest
[INFO] Tests run: 3, Failures: 0, Errors: 0, Skipped: 0
[INFO] Running com.paytmmoney.migration.model.dto.ClusterInfoTest
[INFO] Tests run: 1, Failures: 0, Errors: 0, Skipped: 0
[INFO] Running com.paytmmoney.migration.model.dto.ApiResponseTest
[INFO] Tests run: 3, Failures: 0, Errors: 0, Skipped: 0
[INFO] Running com.paytmmoney.migration.model.dto.MigrationStatusResponseTest
[INFO] Tests run: 1, Failures: 0, Errors: 0, Skipped: 0
[INFO] Running com.paytmmoney.migration.model.dto.DefaultMigrationConfigResponseTest
[INFO] Tests run: 1, Failures: 0, Errors: 0, Skipped: 0
[INFO] Running com.paytmmoney.migration.model.dto.DefaultMigrationConfigRequestValidationTest
[INFO] Tests run: 2, Failures: 0, Errors: 0, Skipped: 0
[INFO] Running com.paytmmoney.migration.model.dto.MigrationStatusByUserIdListRequestTest
[INFO] Tests run: 1, Failures: 0, Errors: 0, Skipped: 0
[INFO] Running com.paytmmoney.migration.model.dto.MigrateUserRequestValidationTest
[INFO] Tests run: 3, Failures: 0, Errors: 0, Skipped: 0
[INFO] Running com.paytmmoney.migration.model.entity.MigrationAuditLogAuditActionTest
[INFO] Tests run: 1, Failures: 0, Errors: 0, Skipped: 0
[INFO] Running com.paytmmoney.migration.model.enums.ClusterTypeTest
[INFO] Tests run: 1, Failures: 0, Errors: 0, Skipped: 0
[INFO] Running com.paytmmoney.migration.model.enums.GlobalFlagTest
[INFO] Tests run: 1, Failures: 0, Errors: 0, Skipped: 0
[INFO] Running com.paytmmoney.migration.service.DefaultMigrationConfigServiceTest
[INFO] Tests run: 4, Failures: 0, Errors: 0, Skipped: 0
[INFO] Running com.paytmmoney.migration.service.BulkMigrationServiceTest
[INFO] Tests run: 2, Failures: 0, Errors: 0, Skipped: 0
[INFO] 
[INFO] Results:
[INFO] 
[INFO] Tests run: 27, Failures: 0, Errors: 0, Skipped: 0
[INFO] 
[INFO] ------------------------------------------------------------------------
[INFO] BUILD SUCCESS
[INFO] ------------------------------------------------------------------------
[INFO] Total time:  5.028 s
[INFO] Finished at: 2026-06-17T02:39:04+05:30
[INFO] ------------------------------------------------------------------------
```

**Result:** `PASSED`

_Note: `BulkMigrationServiceTest` logs a deliberate `IOException: disk` stack trace during `parseFailureThrowsWrappedRuntimeException` — expected test behavior, not a failure._

---

## Failure Analysis

_No failures._

| Test / Error | Root Cause | Fix Suggestion |
| ------------ | ---------- | -------------- |
| — | All 27 tests passed (exit code 0) | — |

---

## Summary

| Metric | Value |
| ------ | ----- |
| Total test files | `16` |
| Unit test files | `14` |
| Integration test files | `2` |
| E2E test files | `0` |
| Tests run | `27` |
| Passed | `27` |
| Failed | `0` |
| Skipped | `0` |

---

## Not Found / Not Verified

| Item | Result |
| --- | --- |
| `@SpringBootTest` full-context tests | Not present in `src/test/java` |
| Maven Failsafe (integration-test phase) | Not configured in `pom.xml` |
| E2E / browser automation | Not present |
| Testcontainers / live MySQL-Redis tests | Not present — DB/Redis mocked or sliced |
| CI workflow test commands | Not scanned (optional supplementary) |
