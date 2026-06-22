# Validation Results

> **Project:** `Basic-repo-reader-and-builder/B6_Rust_greenfield`
> **Generated:** 2026-06-22
> **Method:** Executed `cargo test` and `cargo run`.
> **Local test guide:** [local-testing.md](./local-testing.md)

---

## cargo test

**Command:**

```bash
cd Basic-repo-reader-and-builder/B6_Rust_greenfield
cargo test
```

**Exit Code:** `0`

**Last run:** 2026-06-22 · rohitverma · PMLMBT4677

**Output (summary):**

```
running 2 tests (lib unit tests)
test tests::empty_content_has_zero_counts ... ok
test tests::counts_levels_in_content ... ok

running 4 tests (integration tests)
test valid_log_file_returns_correct_counts ... ok
test missing_file_returns_error ... ok
test analyze_log_file_reads_valid_file ... ok
test empty_file_returns_zero_counts ... ok

test result: ok. 6 passed; 0 failed
```

**Integration tests:**

| Test | Result |
| ---- | ------ |
| `valid_log_file_returns_correct_counts` | ✅ PASSED |
| `empty_file_returns_zero_counts` | ✅ PASSED |
| `missing_file_returns_error` | ✅ PASSED |
| `analyze_log_file_reads_valid_file` | ✅ PASSED |

**Result:** `PASSED`

---

## CLI session (2026-06-22)

| Field | Value |
| ----- | ----- |
| Verified | 2026-06-22 · rohitverma · PMLMBT4677 |
| Full details | [local-testing.md §3](./local-testing.md#3-cli-session-capture-2026-06-22) |

### cargo run -- sample.log

**Exit Code:** `0`

```
File: sample.log

Log Analysis Summary
--------------------
INFO:  4
WARN:  2
ERROR: 2
Total lines: 8
```

**Result:** `PASSED`

### Error handling

| Case | Command | Captured output | Result |
| ---- | ------- | --------------- | ------ |
| Missing file | `cargo run -- missing.log` | `Error: File not found: missing.log` | ✅ PASSED |
| No arguments | `cargo run` | Usage help | ✅ PASSED |
| Empty file | `cargo run -- /tmp/empty_b6.log` | All zeros + note | ✅ PASSED |
| Directory | `cargo run -- .` | `Error: Invalid path (not a file): .` | ✅ PASSED |
| Custom log | `cargo run -- /tmp/mytest.log` | INFO:2 WARN:1 ERROR:1, Total:4 | ✅ PASSED |

---

## Summary

| Check | Result |
| ----- | ------ |
| cargo build | ✅ PASSED |
| cargo test (6 tests) | ✅ PASSED |
| cargo run — sample.log | ✅ PASSED |
| Error handling (4 cases) | ✅ PASSED |
| Custom log file | ✅ PASSED |
