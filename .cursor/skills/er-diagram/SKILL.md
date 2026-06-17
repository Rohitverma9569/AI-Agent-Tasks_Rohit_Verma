---
name: er-diagram
description: >-
  Reverse-engineer database models from source code and produce a verified ER
  diagram report and Mermaid diagram. Discovers entities from JPA, Hibernate,
  Flyway, Liquibase, ORM models, and schema files. Use when the user types
  /er-diagram or asks for ER diagram, database schema discovery, entity
  relationships, or data model mapping.
disable-model-invocation: true
---

# ER Diagram (slash command entry)

Read and follow **`Intermediate-repo operator and polyglot builder/I1_ER_diagram_from_repo/agent.md`** in full — that file is the source of truth for workflow, rules, and output format.

Execute the schema/ER analysis for the path the user provides (or ask for one if missing). Write output to:

- **`Intermediate-repo operator and polyglot builder/I1_ER_diagram_from_repo/er-diagram-report.md`**
- **`Intermediate-repo operator and polyglot builder/I1_ER_diagram_from_repo/er-diagram.mmd`**

unless the user specifies different paths.
