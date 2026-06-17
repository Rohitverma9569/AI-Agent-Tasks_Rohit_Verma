---
name: flow-trace
description: >-
  Trace one endpoint, event, queue consumer, or cron job end-to-end through
  verified code paths. Produces a flow-trace-report with step-by-step hops,
  external dependencies, side effects, and a Mermaid sequence diagram. Use when
  the user types /flow-trace or asks for request flow tracing, call chain
  analysis, or end-to-end path documentation.
disable-model-invocation: true
---

# Flow Trace (slash command entry)

Read and follow **`Intermediate-repo operator and polyglot builder/I2_End_to_end_flow_trace/agent.md`** in full — that file is the source of truth for workflow, rules, and output format.

Execute the end-to-end flow trace for the repo path and entry point the user provides. If only a repo path is given, list discovered entry points and ask which one to trace.

Write output to:

- **`Intermediate-repo operator and polyglot builder/I2_End_to_end_flow_trace/flow-trace-report.md`**
- **`Intermediate-repo operator and polyglot builder/I2_End_to_end_flow_trace/flow-trace-sequence.mmd`**

unless the user specifies different paths.
