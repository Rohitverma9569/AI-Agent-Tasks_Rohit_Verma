# API Endpoint Map

> **Scope analyzed:** `/Users/rohitverma/Downloads/bo-migration-service`
> **Generated:** 2026-06-17
> **Method:** Source-verified route scan.

---

## Verification Summary

| Check | Result |
| --- | --- |
| Total endpoints verified | `16` |
| REST endpoints (application) | `10` |
| REST endpoints (actuator) | `4` |
| REST endpoints (API docs) | `2` |
| GraphQL endpoints | `0` |
| WebSocket endpoints | `0` |
| Internal API endpoints | `0` |
| Frontend routes | `0` |
| Git repository | `Yes` |

No `server.servlet.context-path` in `application.yml` — routes are served at root on port `8080`.

---

## Endpoint Map

| Method | Route | Controller | Handler | Request DTO | Response DTO | Auth Required | File Path |
| ------ | ----- | ---------- | ------- | ----------- | ------------ | ------------- | --------- |
| POST | `/bo-migration/v1/migrateUser` | `MigrationController` | `migrateUser` | `MigrateUserRequest` | `ApiResponse<Void>` | No (no security config verified) | `src/main/java/com/paytmmoney/migration/controller/MigrationController.java` |
| POST | `/bo-migration/v1/migrateUsersBulk` | `MigrationController` | `migrateUsersBulk` | `MultipartFile` + form params (`primaryCluster`, `secondaryCluster`, `isSecondarySyncAllowed`) | `ApiResponse<Integer>` | No (no security config verified) | `src/main/java/com/paytmmoney/migration/controller/MigrationController.java` |
| GET | `/bo-migration/v1/getMigrationStatus/byUserId/{userId}` | `MigrationStatusController` | `getByUserId` | `_Path: userId_` | `MigrationStatusResponse` | No (no security config verified) | `src/main/java/com/paytmmoney/migration/controller/MigrationStatusController.java` |
| GET | `/bo-migration/v1/getMigrationStatus/byUcc/{ucc}` | `MigrationStatusController` | `getByUcc` | `_Path: ucc_` | `MigrationStatusResponse` | No (no security config verified) | `src/main/java/com/paytmmoney/migration/controller/MigrationStatusController.java` |
| POST | `/bo-migration/v1/getMigrationStatus/byUserIdList` | `MigrationStatusController` | `getByUserIdListPost` | `MigrationStatusByUserIdListRequest` | `Map<Long, MigrationStatusResponse>` | No (no security config verified) | `src/main/java/com/paytmmoney/migration/controller/MigrationStatusController.java` |
| POST | `/bo-migration/v1/migrationCache/refresh` | `MigrationStatusController` | `refreshCache` | `_None_` | `ApiResponse<Void>` | No (no security config verified) | `src/main/java/com/paytmmoney/migration/controller/MigrationStatusController.java` |
| GET | `/bo-migration/v1/migrationDefaultConfig` | `DefaultMigrationConfigController` | `getDefaultConfig` | `_None_` | `ApiResponse<DefaultMigrationConfigResponse>` | No (no security config verified) | `src/main/java/com/paytmmoney/migration/controller/DefaultMigrationConfigController.java` |
| PUT | `/bo-migration/v1/migrationDefaultConfig` | `DefaultMigrationConfigController` | `updateDefaultConfig` | `DefaultMigrationConfigRequest` | `ApiResponse<DefaultMigrationConfigResponse>` | No (no security config verified) | `src/main/java/com/paytmmoney/migration/controller/DefaultMigrationConfigController.java` |
| POST | `/bo-migration/v1/migrationDefaultConfig/refresh` | `DefaultMigrationConfigController` | `refreshDefaultConfigCache` | `_None_` | `ApiResponse<Void>` | No (no security config verified) | `src/main/java/com/paytmmoney/migration/controller/DefaultMigrationConfigController.java` |
| GET | `/health` | `HealthController` | `health` | `_None_` | `String` (`OK`) | No (no security config verified) | `src/main/java/com/paytmmoney/migration/controller/HealthController.java` |
| GET | `/actuator/health` | `_Spring Actuator_` | `_auto-config_` | `_None_` | `_Actuator health JSON_` | No (no security config verified) | `src/main/resources/application.yml` |
| GET | `/actuator/info` | `_Spring Actuator_` | `_auto-config_` | `_None_` | `_Actuator info JSON_` | No (no security config verified) | `src/main/resources/application.yml` |
| GET | `/actuator/metrics` | `_Spring Actuator_` | `_auto-config_` | `_None_` | `_Actuator metrics JSON_` | No (no security config verified) | `src/main/resources/application.yml` |
| GET | `/actuator/prometheus` | `_Spring Actuator_` | `_auto-config_` | `_None_` | `_Prometheus text_` | No (no security config verified) | `src/main/resources/application.yml` |
| GET | `/api-docs` | `_SpringDoc OpenAPI_` | `_auto-config_` | `_None_` | `_OpenAPI JSON_` | No (no security config verified) | `src/main/resources/application.yml` |
| GET | `/swagger-ui.html` | `_SpringDoc OpenAPI_` | `_auto-config_` | `_None_` | `_Swagger UI HTML_` | No (no security config verified) | `src/main/resources/application.yml` |

---

## Endpoint Statistics

| Metric | Count |
| ------ | ----- |
| Total APIs | `16` |
| Public APIs | `16` |
| Authenticated APIs | `0` |
| Deprecated APIs | `0` |

---

## Route Flow

### `POST /bo-migration/v1/migrateUser`

```
Request → MigrationController.migrateUser → MigrationService.migrateUser → MigrationStatusRepository.findByUserId / findByUcc / save
                                                                        → MigrationAuditLogRepository.save
                                                                        → MigrationCacheManager.put / update
```

### `POST /bo-migration/v1/migrateUsersBulk`

```
Request → MigrationController.migrateUsersBulk → BulkMigrationService.migrateUsersBulk → MigrationStatusRepository.findByUserId / findByUcc / save
                                                                                      → MigrationAuditLogRepository.save
                                                                                      → MigrationCacheManager.refreshCache → MigrationStatusRepository.findAllForCache
```

### `GET /bo-migration/v1/getMigrationStatus/byUserId/{userId}`

```
Request → MigrationStatusController.getByUserId → MigrationStatusService.getByUserId → MigrationCacheManager.getByUserId
                                                                                      → DefaultMigrationConfigService.getDefaultConfig → DefaultMigrationConfigRepository.findById
```

### `GET /bo-migration/v1/getMigrationStatus/byUcc/{ucc}`

```
Request → MigrationStatusController.getByUcc → MigrationStatusService.getByUcc → MigrationCacheManager.getByUcc
                                                                               → DefaultMigrationConfigService.getDefaultConfig → DefaultMigrationConfigRepository.findById
```

### `POST /bo-migration/v1/getMigrationStatus/byUserIdList`

```
Request → MigrationStatusController.getByUserIdListPost → MigrationStatusService.getByUserIdList → MigrationCacheManager.getByUserIds
                                                                                                → DefaultMigrationConfigService.getDefaultConfig → DefaultMigrationConfigRepository.findById
```

### `POST /bo-migration/v1/migrationCache/refresh`

```
Request → MigrationStatusController.refreshCache → MigrationCacheManager.refreshCache → MigrationStatusRepository.findAllForCache
```

### `GET /bo-migration/v1/migrationDefaultConfig`

```
Request → DefaultMigrationConfigController.getDefaultConfig → DefaultMigrationConfigService.getDefaultConfig → DefaultMigrationConfigRepository.findById (via Redis cache or DB)
```

### `PUT /bo-migration/v1/migrationDefaultConfig`

```
Request → DefaultMigrationConfigController.updateDefaultConfig → DefaultMigrationConfigService.updateDefaultConfig → DefaultMigrationConfigRepository.findById / save
```

### `POST /bo-migration/v1/migrationDefaultConfig/refresh`

```
Request → DefaultMigrationConfigController.refreshDefaultConfigCache → DefaultMigrationConfigService.refreshCache → DefaultMigrationConfigRepository.findById
```

### `GET /health`

```
Request → HealthController.health → _Direct_ (returns static OK)
```

### `GET /actuator/*` and `GET /api-docs`, `GET /swagger-ui.html`

```
Request → Spring Boot Actuator / SpringDoc auto-configuration → _Direct_ (framework-managed)
```

---

## Endpoints by Type

### REST APIs

| Method | Route | Controller | File Path |
| ------ | ----- | ---------- | --------- |
| POST | `/bo-migration/v1/migrateUser` | `MigrationController` | `src/main/java/com/paytmmoney/migration/controller/MigrationController.java` |
| POST | `/bo-migration/v1/migrateUsersBulk` | `MigrationController` | `src/main/java/com/paytmmoney/migration/controller/MigrationController.java` |
| GET | `/bo-migration/v1/getMigrationStatus/byUserId/{userId}` | `MigrationStatusController` | `src/main/java/com/paytmmoney/migration/controller/MigrationStatusController.java` |
| GET | `/bo-migration/v1/getMigrationStatus/byUcc/{ucc}` | `MigrationStatusController` | `src/main/java/com/paytmmoney/migration/controller/MigrationStatusController.java` |
| POST | `/bo-migration/v1/getMigrationStatus/byUserIdList` | `MigrationStatusController` | `src/main/java/com/paytmmoney/migration/controller/MigrationStatusController.java` |
| POST | `/bo-migration/v1/migrationCache/refresh` | `MigrationStatusController` | `src/main/java/com/paytmmoney/migration/controller/MigrationStatusController.java` |
| GET | `/bo-migration/v1/migrationDefaultConfig` | `DefaultMigrationConfigController` | `src/main/java/com/paytmmoney/migration/controller/DefaultMigrationConfigController.java` |
| PUT | `/bo-migration/v1/migrationDefaultConfig` | `DefaultMigrationConfigController` | `src/main/java/com/paytmmoney/migration/controller/DefaultMigrationConfigController.java` |
| POST | `/bo-migration/v1/migrationDefaultConfig/refresh` | `DefaultMigrationConfigController` | `src/main/java/com/paytmmoney/migration/controller/DefaultMigrationConfigController.java` |
| GET | `/health` | `HealthController` | `src/main/java/com/paytmmoney/migration/controller/HealthController.java` |
| GET | `/actuator/health` | `_Spring Actuator_` | `src/main/resources/application.yml` |
| GET | `/actuator/info` | `_Spring Actuator_` | `src/main/resources/application.yml` |
| GET | `/actuator/metrics` | `_Spring Actuator_` | `src/main/resources/application.yml` |
| GET | `/actuator/prometheus` | `_Spring Actuator_` | `src/main/resources/application.yml` |
| GET | `/api-docs` | `_SpringDoc OpenAPI_` | `src/main/resources/application.yml` |
| GET | `/swagger-ui.html` | `_SpringDoc OpenAPI_` | `src/main/resources/application.yml` |

### GraphQL APIs

_None found._

### WebSocket APIs

_None found._

### Internal APIs

_None found._ (no routes under `/internal` or similar verified in source)

### React Routes

_None found._ (no frontend in repository)

### Angular Routes

_None found._

### Vue Routes

_None found._

### NextJS Routes

_None found._

---

## Not Found / Not Verified

| Item | Result |
| --- | --- |
| `spring-boot-starter-security` | Not in `pom.xml`; no `SecurityFilterChain` or `@PreAuthorize` in source |
| GraphQL / WebSocket | No resolver or WebSocket handler classes in `src/main/java` |
| Frontend (`package.json`) | Not present in repository |
| Routes under `/internal` | Not present in controller mappings |
| `@Deprecated` handlers | None in `src/main/java` |
| `server.servlet.context-path` | Not set in current `application.yml` |
