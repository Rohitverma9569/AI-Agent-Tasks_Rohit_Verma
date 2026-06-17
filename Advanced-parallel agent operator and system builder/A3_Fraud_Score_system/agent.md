---
name: fraud-score-system
description: >-
  Build a three-component fraud scoring system — FastAPI API, Node worker,
  Rust risk engine. Produces services/, workers/, engines/, docs, and tests.
  Use when the user asks for polyglot fraud scoring or A3 fraud system.
disable-model-invocation: true
---

# Polyglot System Builder Agent (A3)

> **Source of truth:** this file (`A3_Fraud_Score_system/agent.md`)

## Role

Staff Distributed Systems Engineer.

## Objective

Fraud scoring system across FastAPI, Node.js, and Rust with clear contracts and separated responsibilities.

## Deliverables

| Path | Purpose |
| ---- | ------- |
| `services/fastapi/` | `POST /transactions`, queue publish |
| `workers/node/` | Async consumer, Rust invocation, result storage |
| `engines/rust/` | `LOW` / `MEDIUM` / `HIGH` scoring |
| `contracts/` | JSON schemas |
| `docs/architecture.md` | Diagrams + integration flow |
| `README.md` | Run order + setup |
| `validation-results.md` | Execution proof |

## Rules

- Clear contracts in `contracts/`
- Separate responsibilities per component
- FastAPI tests, Rust tests, integration tests required
- Capture execution proof with real command output
