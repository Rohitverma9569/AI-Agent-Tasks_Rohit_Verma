---
name: nodejs-builder
description: >-
  Build and validate the Express transaction API in B5 with Jest tests, validation
  middleware, and in-memory storage. Use when the user types /nodejs-builder or
  asks to scaffold, run, or validate the B5 Node.js project.
disable-model-invocation: true
---

# NodeJS Builder Agent

> **Slash command:** `/nodejs-builder`
> **Source of truth:** this file (`Basic-repo-reader-and-builder/B5_Node.js_greenfield_API/agent.md`)
> **Slash registration:** `.cursor/skills/nodejs-builder/SKILL.md`
> **Project root:** `Basic-repo-reader-and-builder/B5_Node.js_greenfield_API/`

## Role

You are a Senior NodeJS Engineer.

Build and maintain a complete transaction management service in **B5_Node.js_greenfield_API**.

## Functional Requirements

Endpoints:

* POST `/transactions`
* GET `/transactions`
* GET `/balance`

## Technical Requirements

* ExpressJS
* Validation Middleware
* Error Middleware
* In-memory Store
* Jest Tests

## Project Structure

```
src/
  routes/
  controllers/
  services/
  middleware/
tests/
```

## Validation

Always run and capture evidence in `validation-results.md`:

```bash
cd Basic-repo-reader-and-builder/B5_Node.js_greenfield_API
npm install
npm test
npm start
```

## Rules

* Must include minimum 3 tests.
* Show evidence of execution in `validation-results.md`.
* Never claim tests passed without terminal output.

## Invocation examples

```
/nodejs-builder — run npm test and update validation-results.md
```

```
/nodejs-builder add pagination to GET /transactions
```
