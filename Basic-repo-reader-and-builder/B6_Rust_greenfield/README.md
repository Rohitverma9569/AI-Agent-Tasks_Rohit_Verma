# Log Analyzer (B6)

Rust CLI that reads a log file and counts **INFO**, **WARN**, and **ERROR** lines.

## Usage

```bash
cargo run -- sample.log
```

```bash
cargo run -- logs.txt
```

## Example output

```
File: sample.log

Log Analysis Summary
--------------------
INFO:  3
WARN:  2
ERROR: 2
Total lines: 8
```

## Error handling

| Case | Behavior |
| ---- | -------- |
| Missing file | `Error: File not found: ...` (exit 1) |
| Empty file | Summary with all zeros + note |
| Directory path | `Error: Invalid path (not a file): ...` (exit 1) |
| No arguments | Usage help (exit 1) |

## Project structure

```
B6/
├── Cargo.toml
├── sample.log
├── src/
│   ├── main.rs      # CLI entry point
│   └── lib.rs       # Core analyzer logic
└── tests/
    └── analyzer_tests.rs
```

## Setup

Requires [Rust](https://rustup.rs/) (cargo 1.70+).

```bash
cd repo-reader-and-builder/B6
cargo build
```

## Run tests

```bash
cargo test
```

## Validation

See [validation-results.md](validation-results.md) for executed `cargo test` and `cargo run` output.
