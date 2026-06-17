---
name: terraform-plan
description: >-
  Design, implement, validate, and document Terraform infrastructure for a small
  service with evidence-backed fmt, validate, and plan. Use when the user types
  /terraform-plan or asks for Terraform IaC or terraform validate/plan evidence.
disable-model-invocation: true
---

# Terraform Plan (slash command entry)

Read and follow **`Infra-and-DevOps/D1_Terraform_Plan_for_a_small_service/agent.md`** in full.

Create Terraform under `{target-path}/terraform/`. Run `terraform fmt -check`, `terraform validate`, and `terraform plan` with captured evidence. Write the report to **`Infra-and-DevOps/D1_Terraform_Plan_for_a_small_service/docs/terraform-report.md`**.

Do not `terraform apply` unless the user asks. Do not commit unless asked.
