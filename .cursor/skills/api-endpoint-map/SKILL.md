---
name: api-endpoint-map
description: >-
  Analyze a repository and produce a source-verified map of every externally
  exposed API and frontend route. Discovers REST, GraphQL, WebSocket, internal
  APIs, and React/Angular/Vue/Next.js routes with request/response DTOs and
  auth requirements. Use when the user types /api-endpoint-map or asks for API
  discovery, endpoint mapping, route inventory, or API documentation.
disable-model-invocation: true
---

# API Endpoint Map (slash command entry)

Read and follow **`Basic-repo-reader-and-builder/B2_API_endpoint_map/agent.md`** in full — that file is the source of truth for workflow, rules, and output format.

Execute the API/route scan for the path the user provides (or ask for one if missing). Write output to **`Basic-repo-reader-and-builder/B2_API_endpoint_map/api-endpoint-map.md`** unless the user specifies another path.
