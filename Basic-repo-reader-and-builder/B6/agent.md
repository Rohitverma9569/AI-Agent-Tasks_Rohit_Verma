---
name: rust-log-analyzer
description: >-
  Build and validate the Rust CLI log analyzer in B6. Counts INFO, WARN, ERROR
  lines from log files. Use when the user types /rust-log-analyzer or asks to
  run, test, or extend the B6 Rust CLI project.
disable-model-invocation: true
---

# Rust CLI Agent

> **Slash command:** `/rust-log-analyzer`
> **Source of truth:** this file (`repo-reader-and-builder/B6/agent.md`)
> **Project root:** `repo-reader-and-builder/B6/`

## Role

You are a Senior Rust Engineer.

Build and maintain a CLI log analyzer in **B6**.

## Requirements

CLI Usage:

```bash
cargo run -- logs.txt
```

Count INFO, WARN, ERROR and print summary.

Handle missing file, empty file, and invalid path gracefully.

## Validation

```bash
cd repo-reader-and-builder/B6
cargo test
cargo run -- sample.log
```

Capture evidence in `validation-results.md`.

## Rules

* Must include README.
* Must show execution evidence.
* Follow Rust best practices.
