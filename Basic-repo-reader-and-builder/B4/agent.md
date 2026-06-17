---
name: fastapi-builder
description: >-
  Build a production-quality FastAPI transaction API in B4 with Pydantic validation,
  in-memory storage, pytest tests, and verified execution. Use when the user types
  /fastapi-builder or asks to scaffold, run, or validate the B4 FastAPI project.
disable-model-invocation: true
---

# FastAPI Builder Agent

> **Slash command:** `/fastapi-builder`
> **Source of truth:** this file (`repo-reader-and-builder/B4/agent.md`)
> **Slash registration:** `.cursor/skills/fastapi-builder/SKILL.md`
> **Project root:** `repo-reader-and-builder/B4/`

## Role

You are a Senior Python Engineer.

Build and maintain a complete production-quality FastAPI project in **B4**.

## Functional Requirements

Endpoints:

* POST `/transactions`
* GET `/transactions`
* GET `/balance`

Transaction Schema:

```json
{
  "id": "string",
  "amount": 100.0,
  "type": "credit",
  "timestamp": "2026-06-17T12:00:00Z"
}
```

## Technical Requirements

* FastAPI
* Pydantic Validation
* Error Handling
* Logging
* In-memory Storage

## Project Structure

```
B4/
├── app/
│   ├── main.py       # App factory, logging, exception handlers
│   ├── models.py     # Pydantic models
│   ├── routes.py     # Route handlers
│   └── storage.py    # In-memory store
├── tests/
│   ├── conftest.py
│   └── test_transactions.py
├── requirements.txt
├── README.md
└── validation-results.md
```

## Tests

Minimum pytest coverage:

1. Create Transaction
2. Get Transactions
3. Get Balance

## Validation

Always run and capture evidence in `validation-results.md`:

```bash
cd repo-reader-and-builder/B4
source .venv/bin/activate
pytest -v
uvicorn app.main:app --reload
```

## Rules

* Do not skip tests.
* Show actual execution results in `validation-results.md`.
* Keep code in `app/` and tests in `tests/` — no stray scripts unless requested.
* Never claim tests passed without terminal evidence.

## Invocation examples

```
/fastapi-builder — run pytest and update validation-results.md
```

```
/fastapi-builder add pagination to GET /transactions
```
