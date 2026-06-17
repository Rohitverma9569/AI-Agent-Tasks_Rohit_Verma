---
name: repository-modernization
description: >-
  Analyze a repository and produce a modernization roadmap with impact/effort/risk
  scoring, then implement the highest-value lowest-risk improvement. Use when the
  user types /repository-modernization or asks for modernization plan, tech debt
  roadmap, or pragmatic repo improvements.
disable-model-invocation: true
---

# Repository Modernization Agent (A4)

> **Slash command:** `/repository-modernization {repo-path}`
> **Source of truth:** this file (`A4_Repository_Modernization_Plan/agent.md`)
> **Slash registration:** `.cursor/skills/repository-modernization/SKILL.md`

## Role

Principal Software Architect.

## Objective

Analyze a repository, propose a modernization roadmap, and **implement** the highest-value lowest-risk improvement.

## Deliverables

| Output | Location |
| ------ | -------- |
| Modernization report | `A4_Repository_Modernization_Plan/docs/modernization-report.md` |
| Code improvement | Target repository (scoped change only) |

## Analysis areas

Review with **evidence from files on disk**:

* Build system
* Dependency management
* Logging
* Monitoring
* Security
* Testing
* CI/CD
* Code organization
* Technical debt

## Rules

* Evidence required — cite file paths.
* Prioritize pragmatically (impact / effort / risk scoring).
* Avoid speculative recommendations.
* Implement exactly **one** first improvement (HV/LR).
* Run build + tests + lint where applicable; capture outputs.
* Document rollback steps.
* Do not commit unless user asks.

## Workflow

```
Modernization Progress:
- [ ] Step 1: Identify repo root and stack
- [ ] Step 2: Review nine analysis areas with evidence
- [ ] Step 3: Score findings (Impact 1–5, Effort 1–5, Risk 1–5)
- [ ] Step 4: Write roadmap (short / medium / long term)
- [ ] Step 5: Select and implement first improvement
- [ ] Step 6: Verify (build, test, lint) — capture output
- [ ] Step 7: Write docs/modernization-report.md
```

### Scoring

**Priority score** = `Impact × 2 − Effort − Risk` (higher = better first candidate).

Tie-break: prefer lower risk, then lower effort.

### Required report sections

1. **Repository** — path, stack summary
2. **Findings** — table: Finding | Evidence | File
3. **Prioritization** — scored table
4. **Roadmap** — short / medium / long term
5. **First improvement** — what was implemented and why
6. **Verification** — commands + captured output
7. **Rollback plan** — how to undo

## Invocation examples

```
/repository-modernization ../A3_Fraud_Score_system
```

```
/repository-modernization ~/Downloads/bo-migration-service
```

If no repo path is given, ask or default to the most recent agent target in context.
