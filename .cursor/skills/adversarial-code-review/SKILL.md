---
name: adversarial-code-review
description: >-
  Skeptical staff-level review of AI-generated or unfamiliar code. Produces a
  severity-rated issue list with blocking classification, suggested fixes, and
  verification steps in code-review-report.md. Use when the user types
  /adversarial-code-review or asks for adversarial code review or staff review.
disable-model-invocation: true
---

# Adversarial Code Review (slash command entry)

Read and follow **`Advanced-parallel agent operator and system builder/A5_Agent_Code_Review/agent.md`** in full.

Review the repo/path/scope the user provides. Write output to **`A5_Agent_Code_Review/code-review-report.md`**.

Be skeptical. Cite file paths. Classify every issue as blocking or non-blocking. Do not change target repo code unless the user asks. Do not commit unless asked.
