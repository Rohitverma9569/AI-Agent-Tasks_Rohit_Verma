---
name: polyglot-service-pair
description: >-
  Build a two-component polyglot system — FastAPI service plus Node CLI client.
  Currency conversion demo with validation, tests, README, and verification output.
  Use when the user types /polyglot-service-pair or asks for FastAPI + Node CLI
  paired implementation.
disable-model-invocation: true
---

# Polyglot Service Pair Agent

> **Slash command:** `/polyglot-service-pair`
> **Source of truth:** this file (`repo operator and polyglot builder/I4/agent.md`)
> **Slash registration:** `.cursor/skills/polyglot-service-pair/SKILL.md`

## Role

You are a Full Stack Polyglot Engineer.

## Objective

Build a two-component system:

* **Component 1:** FastAPI Service (`services/fastapi/`)
* **Component 2:** NodeJS CLI Client (`clients/node-cli/`)

## Functional Requirements

**FastAPI Endpoint:** `POST /convert`

Request:

```json
{
  "amount": 100,
  "from": "USD",
  "to": "INR"
}
```

Response:

```json
{
  "convertedAmount": 8300
}
```

Use hardcoded exchange rates.

## FastAPI Requirements

* Validation
* Error handling
* Tests (`pytest`)
* README in `services/fastapi/`

## Node CLI Requirements

Usage:

```bash
node cli.js 100 USD INR
```

CLI should:

* Call FastAPI service
* Print converted value
* Handle failures gracefully

## Deliverables

| Path | Purpose |
| ---- | ------- |
| `services/fastapi/` | FastAPI conversion API |
| `clients/node-cli/` | Node CLI client |
| `README.md` | Architecture, request flow, two-terminal setup |
| `validation-results.md` | Captured pytest + CLI output |

## Required Documentation (in root README.md)

* Architecture Diagram (Mermaid inline in README)
* Request Flow
* Run Instructions
* Two Terminal Setup Instructions

## Verification

Run and capture in `validation-results.md`:

```bash
cd services/fastapi && pytest -v
cd clients/node-cli && node cli.js 100 USD INR
```

## Rules

* Production-quality structure.
* Include tests.
* Include validation.
* Single `.md` outputs for docs — no separate `.mmd` files unless user requests.
* Smallest change when extending; no unrelated refactoring.

## Invocation

```
/polyglot-service-pair
```

Reference implementation lives in this directory (`I4/`).
