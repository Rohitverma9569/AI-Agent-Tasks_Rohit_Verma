# Performance Report

> **Repository:** `bo-migration-service`  
> **Path:** `/Users/rohitverma/Downloads/bo-migration-service`  
> **Hot path:** Bulk CSV import — `BulkMigrationService.parseCsvFile`  
> **Branch:** `master-foundry-changes-bo-migration-service`  
> **Generated:** 2026-06-17  
> **Agent:** A6 — Performance Profiling

---

## Target

| Field | Value |
| ----- | ----- |
| Endpoint | `POST /bo-migration/v1/migrateUsersBulk` |
| Service method | `BulkMigrationService.migrateUsersBulk` → `parseCsvFile` |
| Library | Apache Commons CSV 1.10 (`pom.xml`) |
| Dataset | 10,000 rows — `userId,ucc` columns |

---

## Baseline measurement

| Field | Value |
| ----- | ----- |
| **Method** | JUnit micro-benchmark `BulkMigrationCsvParseBenchmarkTest` — 5 warmup + 20 timed samples, median reported |
| **Dataset** | Synthetic CSV, 10,000 data rows + header |
| **Runtime** | **2.678 ms** median per parse |
| **Throughput** | ~3.73M rows/sec |
| **Memory** | Not instrumented with JFR; inferred allocation pressure from per-call `CSVFormat` construction |

### Baseline command

```bash
cd ~/Downloads/bo-migration-service
mvn -Dtest=BulkMigrationCsvParseBenchmarkTest test
```

### Baseline output (before optimization)

```
BULK_CSV_PARSE_BENCHMARK rows=10000 median_ms=2.678 throughput_rows_per_sec=3734361
```

---

## Profiling

| Tool | Usage |
| ---- | ----- |
| **Isolated micro-benchmark** | `BulkMigrationCsvParseBenchmarkTest` — parse-only, mocks for DB/cache |
| **Code review** | `BulkMigrationService.parseCsvFile` — per-request format build + default `ArrayList` growth |

### Bottleneck analysis

| Function / cost | Evidence |
| ----------------- | -------- |
| `CSVFormat.DEFAULT.withFirstRecordAsHeader()...` built **on every parse** | `parseCsvFile` line 81–84 (before): new format object per upload |
| `ArrayList` default capacity → repeated growth copies | `new ArrayList<>()` before pre-sizing |
| `CSVParser` not in try-with-resources (before) | Manual close risk; extra allocation path |
| Per-row `String.trim()` on already-trimmed CSV fields | Redundant after `withTrim()` |
| DB/cache in full `migrateUsersBulk` | Dominated by I/O in production; **out of scope** for this parse-focused pass |

---

## Improvement (minimal change)

### Files changed

| File | Change |
| ---- | ------ |
| `BulkMigrationService.java` | `static final CSVFormat BULK_CSV_FORMAT`; pre-sized `ArrayList`; try-with-resources for `CSVParser`; remove redundant `trim()` |
| `BulkMigrationCsvParseBenchmarkTest.java` | **New** — reproducible parse benchmark (package-visible `parseCsvFile`) |

### What did NOT change

- Scoring/migration business rules
- API contract (`multipart` CSV upload)
- Transaction boundaries or cache refresh behavior

---

## After measurement

| Metric | Before | After (median of 3 runs) | Improvement |
| ------ | ------ | -------------------------- | ----------- |
| Parse time (10k rows) | **2.678 ms** | **2.526 ms** | **~5.7% faster** |
| Throughput | 3.73M rows/sec | 3.96M rows/sec | **~6.2% higher** |

### After command

```bash
mvn -Dtest=BulkMigrationCsvParseBenchmarkTest test
```

### After output (3 consecutive runs)

```
BULK_CSV_PARSE_BENCHMARK rows=10000 median_ms=2.526 throughput_rows_per_sec=3959156
BULK_CSV_PARSE_BENCHMARK rows=10000 median_ms=2.581 throughput_rows_per_sec=3874718
BULK_CSV_PARSE_BENCHMARK rows=10000 median_ms=2.487 throughput_rows_per_sec=4020167
```

---

## Validation

### Unit tests

```bash
mvn -B test
```

```
Tests run: 28, Failures: 0, Errors: 0, Skipped: 0
BUILD SUCCESS
```

Includes `BulkMigrationServiceTest` (bulk migrate happy path + parse failure) and `BulkMigrationCsvParseBenchmarkTest`.

### Functional checks

- CSV with header `userId,ucc` still parses correctly (benchmark asserts 10,000 `MigrateUserRequest` rows)
- Invalid file still throws wrapped `RuntimeException` (`parseFailureThrowsWrappedRuntimeException`)

---

## Risk assessment

| Risk | Level | Notes |
| ---- | ----- | ----- |
| CSV format behavior change | Low | Same Commons CSV options, now static |
| Header name case sensitivity | Low | `withIgnoreHeaderCase()` retained |
| `estimatedRowCapacity` underestimate | Low | Only affects list growth copies, not correctness |
| Benchmark in CI | Low | Test is fast (~6s); optional to exclude with tag later |
| Full bulk path (DB) | N/A | Parse phase only; DB remains dominant at scale |

### Tradeoffs

- **Pros:** Cheaper per-upload parse; less garbage from format objects; safer parser lifecycle.
- **Cons:** Static `CSVFormat` uses deprecated `with*` methods (pre-existing library style); modest gain — further wins need streaming DB batch writes.

### Rollback

```bash
cd ~/Downloads/bo-migration-service
git checkout -- src/main/java/com/paytmmoney/migration/service/BulkMigrationService.java
rm src/test/java/com/paytmmoney/migration/service/BulkMigrationCsvParseBenchmarkTest.java
```

---

## Next steps (not implemented)

1. Batch `saveAll` in `migrateUsersBulk` loop (DB round-trip reduction)
2. JFR / async-profiler on full `migrateUsersBulk` with Testcontainers MySQL
3. Defer single `cacheManager.refreshCache()` until after bulk commit (already once per file)
