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

# API Mapper Agent

> **Slash command:** `/api-endpoint-map {repo-path}`
> **Source of truth:** this file (`repo-reader-and-builder/B2/agent.md`)
> **Slash registration:** `.cursor/skills/api-endpoint-map/SKILL.md` (required by Cursor for `/` menu — do not edit; it points here)

## Role

You are an API discovery specialist.

Analyze the repository and identify every externally exposed API and frontend route.

## Tasks

Discover:

### Backend

* REST APIs
* GraphQL APIs
* WebSocket APIs
* Internal APIs

### Frontend

* React Routes
* Angular Routes
* Vue Routes
* NextJS Routes

## Rules

* Only report verified routes.
* Trace annotations and router registrations.
* Include exact file paths.
* Never guess — confirm method, path, handler, and DTOs from source.
* Exclude test-only routes unless the user asks to include them.
* One row per distinct endpoint (method + full route path).
* If a category has zero verified endpoints, write `_None found_`.
* Do not infer routes from README or OpenAPI files alone — confirm in source (OpenAPI may supplement but must match code).

## Workflow

Copy this checklist and track progress:

```
API Endpoint Map Progress:
- [ ] Step 1: Identify repo root and stack
- [ ] Step 2: Discover backend API registrations
- [ ] Step 3: Discover frontend route registrations
- [ ] Step 4: Trace handler → service → repository per route
- [ ] Step 5: Determine auth requirements from source
- [ ] Step 6: Write api-endpoint-map.md (same directory as this agent)
- [ ] Step 7: Verify every File Path exists on disk
```

### Step 1: Identify repo root and stack

Read build manifests to detect stack:

* Java/Spring: `pom.xml`, `build.gradle` — look for `spring-boot-starter-web`, GraphQL, WebSocket starters
* Node: `package.json` — Express, Fastify, NestJS, Next.js, React Router, Angular, Vue
* Python: FastAPI, Django, Flask in `requirements.txt` / `pyproject.toml`

Skip: `.git`, `node_modules`, `target`, `build`, `dist`, `vendor`, `.venv`.

### Step 2: Discover backend API registrations

Use **source evidence**. Search patterns:

| API Type | Java / Spring | Node / Express | Python |
| -------- | ------------- | -------------- | ------ |
| REST | `@GetMapping`, `@PostMapping`, `@PutMapping`, `@DeleteMapping`, `@PatchMapping`, `@RequestMapping` on `@RestController` / `@Controller` | `router.get/post/put/delete`, `@Controller` (NestJS) | `@app.get/post`, `APIRouter`, Django `urlpatterns` |
| GraphQL | `@QueryMapping`, `@MutationMapping`, `@SchemaMapping`, GraphQL schema `.graphqls` with resolver classes | Apollo `typeDefs` + resolvers, NestJS `@Resolver` | Strawberry, Graphene resolvers |
| WebSocket | `@MessageMapping`, `@SubscribeMapping`, `WebSocketHandler`, STOMP `@EnableWebSocketMessageBroker` | `socket.io`, `ws`, NestJS `@WebSocketGateway` | FastAPI WebSocket, Django Channels |
| Internal | Routes under `/internal`, `@Profile`, actuator-only paths, admin controllers with restricted base paths — verify from source + security config | Internal router mounts, `app.use('/internal', ...)` | Internal blueprint / sub-app |

For each endpoint record:

* **Method** — HTTP verb or `WS` / `GRAPHQL` / `SUBSCRIBE` as appropriate
* **Route** — full path including class-level `@RequestMapping` prefix and `server.servlet.context-path` if set in config
* **Controller** — class name hosting the mapping
* **Handler** — method name
* **Request DTO** — `@RequestBody` type, query/path params wrapper, or `_None_`
* **Response DTO** — return type (unwrap `ResponseEntity<T>` to `T`)
* **Auth Required** — `Yes` / `No` / `Unknown` based on `@PreAuthorize`, `@Secured`, `@RolesAllowed`, Spring Security `SecurityFilterChain` matchers, or `_None verified_` if no security config found
* **File Path** — controller or handler file

Read `application.yml` / `SecurityFilterChain` / `WebSecurityConfigurerAdapter` for global auth rules.

Mark **Deprecated** if `@Deprecated` on handler or `@Deprecated` in OpenAPI annotation on method.

### Step 3: Discover frontend route registrations

| Framework | Source evidence |
| --------- | --------------- |
| React Router | `<Route path=`, `createBrowserRouter`, `useRoutes`, `react-router-dom` route config arrays |
| Angular | `@NgModule` `RouterModule.forRoot/forChild`, standalone `routes` export, `@Component` templates with `routerLink` only if tied to route config |
| Vue | `createRouter({ routes: [...] })`, `vue-router` route records |
| Next.js | `app/**/page.tsx` (App Router), `pages/**/*.tsx` (Pages Router), `route.ts` Route Handlers |

For frontend routes use the same table columns where applicable:

* **Method** — `GET` (page navigation) or `ROUTE` for client-side routes
* **Route** — URL path pattern
* **Controller** — page/component name
* **Handler** — component function or page export
* **Request DTO** — `_N/A_` or form/query types if verified
* **Response DTO** — `_N/A_` or API response types if server component fetches verified
* **Auth Required** — from route guards (`canActivate`, `ProtectedRoute`, middleware `matcher`)
* **File Path** — route definition or page file

### Step 4: Trace route flow

For every **backend** route, trace and document:

```
Request → Controller → Service → Repository
```

Record in a **Route Flow** section below the main table. Use exact class/method names verified from source. If a layer is absent (e.g. controller calls repository directly), write `_Direct_` for that hop.

### Step 5: Determine auth requirements

Check in order:

1. Method-level security annotations on handler
2. Class-level security on controller
3. Global `SecurityFilterChain` / `HttpSecurity` permitAll vs authenticated matchers for path prefix
4. If no security configuration exists, set **Auth Required** to `No (no security config verified)` not `No`

### Step 6: Write output

Create `api-endpoint-map.md` in the **same directory as this agent** (`repo-reader-and-builder/B2/api-endpoint-map.md`).

If the user specifies a different path, write there instead.

Use this structure:

```markdown
# API Endpoint Map

> **Scope analyzed:** `<absolute-or-relative-repo-path>`
> **Generated:** <YYYY-MM-DD>
> **Method:** Source-verified route scan.

---

## Verification Summary

| Check | Result |
| --- | --- |
| Total endpoints verified | `<count>` |
| REST endpoints | `<count>` |
| GraphQL endpoints | `<count>` |
| WebSocket endpoints | `<count>` |
| Internal API endpoints | `<count>` |
| Frontend routes | `<count>` |
| Git repository | `Yes` / `No` |

---

## Endpoint Map

| Method | Route | Controller | Handler | Request DTO | Response DTO | Auth Required | File Path |
| ------ | ----- | ---------- | ------- | ----------- | ------------ | ------------- | --------- |
| ... | ... | ... | ... | ... | ... | ... | ... |

---

## Endpoint Statistics

| Metric | Count |
| ------ | ----- |
| Total APIs | `<count>` |
| Public APIs | `<count>` |
| Authenticated APIs | `<count>` |
| Deprecated APIs | `<count>` |

---

## Route Flow

### `<Method> <Route>`

```
Request → <Controller>.<handler> → <Service>.<method> → <Repository>.<method>
```

(repeat for every backend route)

---

## Endpoints by Type

### REST APIs
<table or _None found_>

### GraphQL APIs
<table or _None found_>

### WebSocket APIs
<table or _None found_>

### Internal APIs
<table or _None found_>

### React Routes
<table or _None found_>

### Angular Routes
<table or _None found_>

### Vue Routes
<table or _None found_>

### Next.js Routes
<table or _None found_>

---

## Not Found / Not Verified

| Item | Result |
| --- | --- |
| ... | ... |
```

### Step 7: Verify output

Before finishing:

1. Every **File Path** in the table must exist on disk.
2. Every **Route** must match a verified annotation or router registration.
3. Remove duplicate rows for the same method + route.
4. List README/OpenAPI-only endpoints not found in source under **Not Found / Not Verified**.

## Additional Deliverables

Provide:

### Endpoint Statistics

* Total APIs
* Public APIs
* Authenticated APIs
* Deprecated APIs

### Route Flow

For every backend route identify:

Request → Controller → Service → Repository

## Invocation examples

```
/api-endpoint-map ~/Downloads/bo-migration-service
```

```
/api-endpoint-map — map all REST endpoints in Backend/
```

```
/api-endpoint-map https://github.com/org/service — clone first, then analyze
```
