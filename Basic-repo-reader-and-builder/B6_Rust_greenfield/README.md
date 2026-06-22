# B6 — Rust Log Analyzer CLI

> **Evaluation-grade greenfield deliverable.** Rust CLI that reads a log file and counts INFO, WARN, and ERROR lines with full error handling and cargo test coverage.

Analyze log files from the command line — no server required.

```bash
/rust-log-analyzer
```

| | |
| --- | --- |
| **Project** | B6 — Rust Greenfield CLI (Log Analyzer) |
| **Agent** | [`agent.md`](agent.md) · slash command `/rust-log-analyzer` |
| **Cursor skill** | `.cursor/skills/rust-log-analyzer/SKILL.md` |
| **Location** | `Basic-repo-reader-and-builder/B6_Rust_greenfield` |
| **Last verified** | 2026-06-22 · cargo test 6/6 + CLI session |

---

## Executive Summary (Latest Run)

| Metric | Result |
| ------ | ------ |
| **Stack** | Rust · cargo |
| **Automated tests** | **6 passed** (2 unit + 4 integration) |
| **CLI verified** | `cargo run -- sample.log` |
| **Counts** | INFO: 4 · WARN: 2 · ERROR: 2 · Total: 8 |

```
┌──────────────────────────────────────────────────────────────┐
│  B6 LOG ANALYZER — local run                                 │
├──────────────────────────────────────────────────────────────┤
│  cargo test                  6/6 passed                      │
│  cargo run -- sample.log     INFO:4 WARN:2 ERROR:2           │
│  missing file                Error handled                   │
│  empty file                  Zeros + note                    │
│  invalid path (.)            Error handled                   │
└──────────────────────────────────────────────────────────────┘
```

---

## Usage

```bash
cargo run -- sample.log
```

```bash
cargo run -- path/to/your.log
```

### Example output

```
File: sample.log

Log Analysis Summary
--------------------
INFO:  4
WARN:  2
ERROR: 2
Total lines: 8
```

---

## Error handling

| Case | Behavior |
| ---- | -------- |
| Missing file | `Error: File not found: ...` (exit 1) |
| Empty file | Summary with all zeros + note |
| Directory path | `Error: Invalid path (not a file): ...` (exit 1) |
| No arguments | Usage help (exit 1) |

---

## Project layout

```
B6_Rust_greenfield/
├── README.md              ← you are here
├── STATUS.md                ← project status
├── agent.md                 ← Rust CLI Agent spec
├── local-testing.md         ← cargo test + run guide & captured results
├── validation-results.md    ← executed test evidence
├── Cargo.toml
├── sample.log               ← bundled test fixture
├── src/
│   ├── main.rs              # CLI entry point
│   └── lib.rs               # Core analyzer logic
└── tests/
    └── analyzer_tests.rs
```

---

## Quick start

Requires [Rust](https://rustup.rs/) (cargo 1.70+).

```bash
cd "Basic-repo-reader-and-builder/B6_Rust_greenfield"

cargo build
cargo test
cargo run -- sample.log
```

---

## Verification

| Method | Doc | What it covers |
| ------ | --- | -------------- |
| Project status | [STATUS.md](./STATUS.md) | Verification checklist |
| Automated tests | [validation-results.md](./validation-results.md#cargo-test) | `cargo test` (6 tests) |
| CLI session | [local-testing.md](./local-testing.md#3-cli-session-capture-2026-06-22) | All `cargo run` cases |
| Full test guide | [local-testing.md](./local-testing.md) | Build, test, error cases |

---

## Invoke the agent

```
/rust-log-analyzer — run cargo test and update validation-results.md
```

Full agent spec: [agent.md](./agent.md)

---

## Related projects

| Project | Relationship |
| ------- | ------------ |
| [B4 — FastAPI API](../B4_FastAPI_greenfield_service/README.md) | Greenfield builder — HTTP API |
| [B5 — Node.js API](../B5_Node.js_greenfield_API/README.md) | Greenfield builder — HTTP API |

---

## Agent catalog

Registered as **B6 — Rust Log Analyzer** in [docs/agent-catalog.md](../../docs/agent-catalog.md).
