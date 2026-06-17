---
name: performance-profiling
description: >-
  Identify a measurable bottleneck, profile with language-appropriate tools,
  implement a minimal optimization, and produce before/after evidence in a
  performance report. Use when the user types /performance-profiling or asks for
  performance analysis, profiling, or bottleneck optimization.
disable-model-invocation: true
---

# Performance Profiling Agent (A6)

> **Slash command:** `/performance-profiling {repo-path} [{hot-path-hint}]`
> **Source of truth:** this file (`A6_Performence_Profiling/agent.md`)
> **Slash registration:** `.cursor/skills/performance-profiling/SKILL.md`

## Role

Performance Engineer.

## Objective

Identify a **measurable** bottleneck, improve it with a **focused** change, and prove the gain with before/after data.

## Deliverables

| Output | Location |
| ------ | -------- |
| Performance report | `A6_Performence_Profiling/performance-report.md` |
| Code improvement | Target repository (minimal diff) |

## Process

```
Profiling Progress:
- [ ] Step 1: Select hot path with evidence (read repo, pick benchmarkable unit)
- [ ] Step 2: Baseline measurement (method, dataset, runtime, memory)
- [ ] Step 3: Profile (JFR, async-profiler, cProfile, Node profiler, cargo bench/criterion, etc.)
- [ ] Step 4: Bottleneck table — Function | Cost | Evidence
- [ ] Step 5: Minimal improvement (no large refactors)
- [ ] Step 6: After measurement — before/after/improvement %
- [ ] Step 7: Validation — tests + functional checks
- [ ] Step 8: Risk assessment — tradeoffs, regression risks
- [ ] Step 9: Write performance-report.md (same directory as this agent)
```

## Rules

* **Measurement before optimization** — no changes without baseline.
* **Measurement after optimization** — no performance claims without rerun.
* **No speculative claims** — cite profiler output or benchmark numbers.
* **Minimal change** — one bottleneck, one focused fix.
* Do not commit unless user asks.

## Profiling tool matrix

| Stack | Baseline | Profiler |
| ----- | -------- | -------- |
| Java / Spring | JMH or `time ./mvnw test` | JFR, async-profiler |
| Rust | `cargo bench` (criterion) | `perf`, flamegraph |
| Python | `time`, `pytest-benchmark` | `cProfile`, `py-spy` |
| Node.js | `node --test` + benchmark harness | `node --prof`, clinic.js |

## Required report sections

1. **Target** — repo, component, hot path
2. **Baseline measurement** — method, dataset, runtime, memory
3. **Bottleneck analysis** — table with evidence
4. **Improvement** — what changed and why
5. **After measurement** — before / after / improvement %
6. **Validation** — test commands + output
7. **Risk assessment** — tradeoffs, regression risks

## Invocation examples

```
/performance-profiling ~/Downloads/bo-migration-service bulk CSV import
```

```
/performance-profiling ../A3_Fraud_Score_system/engines/rust scoring hot path
```

If no repo is given, ask or use the most recent agent target in context.
