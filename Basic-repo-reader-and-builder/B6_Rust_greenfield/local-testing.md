# B6 — Local Testing (cargo build, test & run)

| | |
| --- | --- |
| **Project** | B6 — Rust Log Analyzer CLI |
| **Last verified** | 2026-06-22 · rohitverma · PMLMBT4677 |
| **Environment** | Local · macOS · Rust / cargo |
| **Related** | [STATUS.md](./STATUS.md) · [validation-results.md](./validation-results.md) · [README.md](./README.md) |

> B6 is a **CLI tool** — no server port. Tests use `cargo test`; manual validation uses `cargo run -- <log-file>`.

---

## 1. Prerequisites

Requires [Rust](https://rustup.rs/) (cargo 1.70+):

```bash
rustc --version
cargo --version
```

---

## 2. Build & automated tests

**Directory:** `Basic-repo-reader-and-builder/B6_Rust_greenfield`

```bash
cd "/Users/rohitverma/Desktop/AI-Agents-Tasks -PML/Basic-repo-reader-and-builder/B6_Rust_greenfield"

cargo build

cargo test
```

**Captured output (2026-06-22):**

```
Finished `dev` profile [unoptimized + debuginfo] target(s) in 0.05s

running 2 tests (lib unit tests)
test tests::empty_content_has_zero_counts ... ok
test tests::counts_levels_in_content ... ok
test result: ok. 2 passed

running 4 tests (integration tests)
test valid_log_file_returns_correct_counts ... ok
test missing_file_returns_error ... ok
test analyze_log_file_reads_valid_file ... ok
test empty_file_returns_zero_counts ... ok
test result: ok. 4 passed

test result: ok. 6 passed; 0 failed
```

| Suite | Tests | Result |
| ----- | ----- | ------ |
| `src/lib.rs` unit tests | 2 | ✅ PASSED |
| `tests/analyzer_tests.rs` integration | 4 | ✅ PASSED |
| **Total** | **6** | ✅ PASSED |

**Result:** `PASSED`

---

## 3. CLI Session Capture (2026-06-22)

Manual `cargo run` session from project root.

### 3.1 Happy path — `sample.log`

**Command:**

```bash
cargo run -- sample.log
```

**Captured output:**

```
File: sample.log

Log Analysis Summary
--------------------
INFO:  4
WARN:  2
ERROR: 2
Total lines: 8
```

**Result:** `PASSED` (exit code 0)

---

### 3.2 Missing file

**Command:**

```bash
cargo run -- missing.log
```

**Captured output:**

```
Error: File not found: missing.log
```

**Result:** `PASSED` (exit code 1 — expected error)

---

### 3.3 No arguments — usage help

**Command:**

```bash
cargo run
```

**Captured output:**

```
Usage: log-analyzer <log-file>
Example: cargo run -- sample.log
```

**Result:** `PASSED` (exit code 1 — expected)

---

### 3.4 Empty file

**Command:**

```bash
touch /tmp/empty_b6.log
cargo run -- /tmp/empty_b6.log
```

**Captured output:**

```
File: /tmp/empty_b6.log

Log Analysis Summary
--------------------
INFO:  0
WARN:  0
ERROR: 0
Total lines: 0

Note: file is empty or contains no log lines.
```

**Result:** `PASSED` (exit code 0)

---

### 3.5 Directory path (invalid)

**Command:**

```bash
cargo run -- .
```

**Captured output:**

```
Error: Invalid path (not a file): .
```

**Result:** `PASSED` (exit code 1 — expected error)

---

### 3.6 Custom log file

**Command:**

```bash
cat > /tmp/mytest.log << 'EOF'
2026-06-22 INFO Server started
2026-06-22 WARN High memory usage
2026-06-22 ERROR Connection failed
2026-06-22 INFO Request handled
EOF

cargo run -- /tmp/mytest.log
```

**Captured output:**

```
File: /tmp/mytest.log

Log Analysis Summary
--------------------
INFO:  2
WARN:  1
ERROR: 1
Total lines: 4
```

**Result:** `PASSED` (exit code 0)

---

## 4. Error handling reference

| Case | Command | Expected behavior | Verified |
| ---- | ------- | ----------------- | -------- |
| Missing file | `cargo run -- missing.log` | `Error: File not found: ...` | ✅ |
| Empty file | `cargo run -- /tmp/empty_b6.log` | All zeros + note | ✅ |
| Directory path | `cargo run -- .` | `Error: Invalid path (not a file): ...` | ✅ |
| No arguments | `cargo run` | Usage help | ✅ |

---

## 5. All commands (copy-paste)

Run from the B6 project directory:

```bash
cd "/Users/rohitverma/Desktop/AI-Agents-Tasks -PML/Basic-repo-reader-and-builder/B6_Rust_greenfield"

cargo build

cargo test

cargo run -- sample.log

cargo run -- missing.log

cargo run

touch /tmp/empty_b6.log && cargo run -- /tmp/empty_b6.log

cargo run -- .

cat > /tmp/mytest.log << 'EOF'
2026-06-22 INFO Server started
2026-06-22 WARN High memory usage
2026-06-22 ERROR Connection failed
2026-06-22 INFO Request handled
EOF

cargo run -- /tmp/mytest.log
```

---

## 6. Testing checklist

| Step | Command | Pass criteria |
| ---- | ------- | ------------- |
| 1 | `cargo build` | Finishes without errors |
| 2 | `cargo test` | 6/6 passed |
| 3 | `cargo run -- sample.log` | INFO: 4, WARN: 2, ERROR: 2, Total: 8 |
| 4 | `cargo run -- missing.log` | File not found error |
| 5 | `cargo run` | Usage help shown |
| 6 | Empty file | All zeros + note |
| 7 | `cargo run -- .` | Invalid path error |
| 8 | Custom log | Counts match lines |

---

## 7. B6 vs B4/B5

| | **B6** | **B4 / B5** |
| --- | --- | --- |
| Type | Rust CLI | HTTP API |
| Test command | `cargo test` | `pytest` / `npm test` |
| Manual run | `cargo run -- file.log` | `uvicorn` / `npm start` + curl |
| Server port | None | 8001 / 3000 |
