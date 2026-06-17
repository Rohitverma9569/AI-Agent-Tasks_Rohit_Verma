---
name: ci-pipeline
description: >-
  Create executable GitHub Actions or GitLab CI with lint, test, Docker build,
  and image tagging. Verifies with act or equivalent, includes failure demo and
  recovery proof. Use when the user types /ci-pipeline or asks for CI workflow
  setup with lint test build stages.
disable-model-invocation: true
---

# CI Pipeline (slash command entry)

Read and follow **`Infra-and-DevOps/B3_Ci_pipiline_that_lints/agent.md`** in full.

Create CI under `{target-path}/` (`.github/workflows/build.yml` or `.gitlab-ci.yml` + CI docs). Run locally with **act** or equivalent. Capture success, intentional failure, and recovery evidence.

Write the report to **`Infra-and-DevOps/B3_Ci_pipiline_that_lints/docs/ci-pipeline-report.md`**.

Do not commit unless the user asks.
