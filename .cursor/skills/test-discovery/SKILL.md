---
name: test-discovery
description: >-
  Discover a repository testing strategy, identify unit/integration/E2E tests,
  run tests with verified terminal output, and produce a test discovery report.
  Use when the user types /test-discovery or asks for test framework discovery,
  test execution, QA automation analysis, or test configuration inventory.
disable-model-invocation: true
---

# Test Discovery (slash command entry)

Read and follow **`Basic-repo-reader-and-builder/B3_Test_discovery_and_execution/agent.md`** in full — that file is the source of truth for workflow, rules, and output format.

Execute test discovery and run tests for the path the user provides (or ask for one if missing). Write output to **`Basic-repo-reader-and-builder/B3_Test_discovery_and_execution/test-discovery-report.md`** unless the user specifies another path.
