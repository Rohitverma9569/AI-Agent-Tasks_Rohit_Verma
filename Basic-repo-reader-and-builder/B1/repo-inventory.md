# Repository Inventory

> **Scope analyzed:** `/Users/rohitverma/Downloads/bo-migration-service`
> **Generated:** 2026-06-17
> **Method:** Source-verified repository scan.

---

## Verification Summary

| Check | Result |
| --- | --- |
| Total source files analyzed (`src/main/java`) | `29` |
| Verified artifacts identified | `29` |
| Build manifests found | `pom.xml`, `Dockerfile` |
| Git repository | `Yes` |

Production `src/main` sources only. Test files excluded.

---

## Artifact Inventory

| Type | Name | File Path | Responsibility | Dependencies |
| ---- | ---- | --------- | -------------- | ------------ |
| Main Application | `MigrationServiceApplication` | `src/main/java/com/paytmmoney/migration/MigrationServiceApplication.java` | Spring Boot entry point; enables caching and scheduling; logs masked datasource config on startup. | `SpringApplication`, `@EnableCaching`, `@EnableScheduling`, `Environment` |
| Controllers | `MigrationController` | `src/main/java/com/paytmmoney/migration/controller/MigrationController.java` | Single-user and bulk CSV migration APIs under `/bo-migration`. | `MigrationService`, `BulkMigrationService`, `MigrateUserRequest`, `ApiResponse` |
| Controllers | `MigrationStatusController` | `src/main/java/com/paytmmoney/migration/controller/MigrationStatusController.java` | Migration status lookup by userId/UCC/list and manual cache refresh under `/bo-migration`. | `MigrationStatusService`, `MigrationCacheManager`, `MigrationStatusResponse` |
| Controllers | `DefaultMigrationConfigController` | `src/main/java/com/paytmmoney/migration/controller/DefaultMigrationConfigController.java` | GET/PUT default migration config and cache refresh under `/bo-migration`. | `DefaultMigrationConfigService`, `DefaultMigrationConfigRequest`, `ApiResponse` |
| Controllers | `HealthController` | `src/main/java/com/paytmmoney/migration/controller/HealthController.java` | Simple liveness endpoint returning `OK` at `/health`. | `ResponseEntity` |
| Services | `MigrationService` | `src/main/java/com/paytmmoney/migration/service/MigrationService.java` | Migrates a single user: upserts `MigrationStatus`, writes audit log, updates Redis cache. | `MigrationStatusRepository`, `MigrationAuditLogRepository`, `MigrationCacheManager` |
| Services | `BulkMigrationService` | `src/main/java/com/paytmmoney/migration/service/BulkMigrationService.java` | Parses CSV uploads and bulk-migrates users; records bulk audit entry and refreshes cache. | `MigrationStatusRepository`, `MigrationAuditLogRepository`, `MigrationCacheManager`, Apache CSV |
| Services | `MigrationStatusService` | `src/main/java/com/paytmmoney/migration/service/MigrationStatusService.java` | Resolves migration status from cache or default config; emits Micrometer metrics per API/response type. | `MigrationCacheManager`, `DefaultMigrationConfigService`, `MeterRegistry` |
| Services | `DefaultMigrationConfigService` | `src/main/java/com/paytmmoney/migration/service/DefaultMigrationConfigService.java` | Reads/updates default migration config with optional Redis cache backing. | `DefaultMigrationConfigRepository`, `RedisTemplate`, `GlobalFlag`, `ClusterType` |
| Services | `MigrationCacheManager` | `src/main/java/com/paytmmoney/migration/cache/MigrationCacheManager.java` | Redis dual-index cache (userId + UCC) for migration status; warmup, refresh, CRUD on cache entries. | `MigrationStatusRepository`, `RedisTemplate`, `HashOperations` |
| Repositories | `MigrationStatusRepository` | `src/main/java/com/paytmmoney/migration/repository/MigrationStatusRepository.java` | JPA access to `migration_status`; lookup by userId/UCC and full cache load query. | `JpaRepository`, `MigrationStatus` |
| Repositories | `MigrationAuditLogRepository` | `src/main/java/com/paytmmoney/migration/repository/MigrationAuditLogRepository.java` | JPA persistence for migration audit log records. | `JpaRepository`, `MigrationAuditLog` |
| Repositories | `DefaultMigrationConfigRepository` | `src/main/java/com/paytmmoney/migration/repository/DefaultMigrationConfigRepository.java` | JPA access to singleton default migration configuration row. | `JpaRepository`, `DefaultMigrationConfig` |
| Entities | `MigrationStatus` | `src/main/java/com/paytmmoney/migration/model/entity/MigrationStatus.java` | JPA entity for per-user cluster assignment (primary/secondary, sync flag). | `ClusterType`, JPA annotations |
| Entities | `MigrationAuditLog` | `src/main/java/com/paytmmoney/migration/model/entity/MigrationAuditLog.java` | JPA entity for migration/rollback/bulk audit trail with cluster change fields. | JPA annotations, nested `AuditAction` enum |
| Entities | `DefaultMigrationConfig` | `src/main/java/com/paytmmoney/migration/model/entity/DefaultMigrationConfig.java` | JPA entity for global default clusters, sync flag, and `GlobalFlag` mode. | `ClusterType`, `GlobalFlag` |
| DTOs | `ApiResponse` | `src/main/java/com/paytmmoney/migration/model/dto/ApiResponse.java` | Generic API wrapper with SUCCESS/ERROR status, message, and typed data payload. | Lombok |
| DTOs | `MigrateUserRequest` | `src/main/java/com/paytmmoney/migration/model/dto/MigrateUserRequest.java` | Request body for single-user migration with cluster and sync validation. | `ClusterInfo`, `@NotNull` |
| DTOs | `MigrationStatusResponse` | `src/main/java/com/paytmmoney/migration/model/dto/MigrationStatusResponse.java` | Response shape for migration status queries (userId, ucc, cluster, sync flag). | `ClusterInfo`, Jackson `@JsonInclude` |
| DTOs | `MigrationStatusByUserIdListRequest` | `src/main/java/com/paytmmoney/migration/model/dto/MigrationStatusByUserIdListRequest.java` | Wrapper for bulk status lookup by list of user IDs. | `List<Long>` |
| DTOs | `DefaultMigrationConfigRequest` | `src/main/java/com/paytmmoney/migration/model/dto/DefaultMigrationConfigRequest.java` | Validated request to update default migration configuration. | `ClusterType`, `GlobalFlag`, `@NotNull` |
| DTOs | `DefaultMigrationConfigResponse` | `src/main/java/com/paytmmoney/migration/model/dto/DefaultMigrationConfigResponse.java` | Response DTO for default migration configuration values. | `ClusterType`, `GlobalFlag` |
| DTOs | `ClusterInfo` | `src/main/java/com/paytmmoney/migration/model/dto/ClusterInfo.java` | Primary/secondary cluster pair used in requests and responses. | `ClusterType` |
| Models | `ClusterType` | `src/main/java/com/paytmmoney/migration/model/enums/ClusterType.java` | Enum of target backend clusters: `CLASS`, `TECHEXCEL`. | — |
| Models | `GlobalFlag` | `src/main/java/com/paytmmoney/migration/model/enums/GlobalFlag.java` | Enum controlling status resolution mode: `AUDIT`, `CLASS`, `TECHEXCEL`. | — |
| Schedulers | `CacheRefreshScheduler` | `src/main/java/com/paytmmoney/migration/scheduler/CacheRefreshScheduler.java` | Periodically refreshes migration status Redis cache from database. | `MigrationCacheManager`, `@Scheduled` |
| Schedulers | `DefaultMigrationConfigCacheRefreshScheduler` | `src/main/java/com/paytmmoney/migration/scheduler/DefaultMigrationConfigCacheRefreshScheduler.java` | Periodically refreshes default migration config Redis cache. | `DefaultMigrationConfigService`, `@Scheduled` |
| Configurations | `CacheConfig` | `src/main/java/com/paytmmoney/migration/config/CacheConfig.java` | Defines RedisTemplate beans for `MigrationStatus` and `DefaultMigrationConfig` with Jackson serializers. | `RedisConnectionFactory`, Jackson, `JavaTimeModule` |
| Exception Handlers | `GlobalExceptionHandler` | `src/main/java/com/paytmmoney/migration/exception/GlobalExceptionHandler.java` | Maps validation, illegal-argument, runtime, and generic exceptions to `ApiResponse` HTTP responses. | `@RestControllerAdvice`, `ApiResponse`, Spring Web |

---

## Architecture Summary

### Layered Architecture

**Verified Yes** — Controllers (`controller/`), services (`service/`, `cache/`), and JPA repositories (`repository/`) with entities/DTOs in `model/`.

### Hexagonal Architecture

**Verified No** — No explicit ports/adapters separation; standard Spring layered packages.

### Microservice Components

**Verified Yes** — Single deployable Spring Boot service with `MigrationServiceApplication`, `Dockerfile` multi-stage build, actuator/prometheus endpoints in `application.yml`.

### External Integrations

| Integration | Verified Evidence |
| --- | --- |
| MySQL | `pom.xml` (`mysql-connector-j`), `application.yml` datasource URL, JPA entities/repositories |
| Redis | `spring-boot-starter-data-redis`, `CacheConfig`, `MigrationCacheManager`, `DefaultMigrationConfigService` |
| Flyway | `flyway-core` / `flyway-mysql` in `pom.xml`; SQL migrations under `src/main/resources/db/migration/` (disabled in default `application.yml`) |
| Prometheus / Actuator | `micrometer-registry-prometheus`, `management.endpoints` in `application.yml` |
| OpenAPI / Swagger | `springdoc-openapi` (via controller `@Operation` annotations), `springdoc` config in `application.yml` |

#### Detected Stack

- **Languages:** Java 17
- **Frameworks:** Spring Boot 3.2.0 (Web, Data JPA, Validation, Actuator, Data Redis)
- **Build tools:** Maven (`pom.xml`), Docker multi-stage build

---

## Entry Points

### Main Application Classes

| Name | File Path |
| --- | --- |
| `MigrationServiceApplication` | `src/main/java/com/paytmmoney/migration/MigrationServiceApplication.java` |

### Startup Configuration

| Name | File Path |
| --- | --- |
| `application.yml` | `src/main/resources/application.yml` |
| `application-stg.yml` | `src/main/resources/application-stg.yml` |
| `application-prod.yml` | `src/main/resources/application-prod.yml` |
| `V1__create_migration_tables.sql` | `src/main/resources/db/migration/V1__create_migration_tables.sql` |
| `V2__create_default_migration_config.sql` | `src/main/resources/db/migration/V2__create_default_migration_config.sql` |
| `V3__add_global_flag_to_default_config.sql` | `src/main/resources/db/migration/V3__add_global_flag_to_default_config.sql` |

### Scheduler Entry Points

| Name | File Path |
| --- | --- |
| `CacheRefreshScheduler.refreshCache` | `src/main/java/com/paytmmoney/migration/scheduler/CacheRefreshScheduler.java` |
| `DefaultMigrationConfigCacheRefreshScheduler.refreshCache` | `src/main/java/com/paytmmoney/migration/scheduler/DefaultMigrationConfigCacheRefreshScheduler.java` |

### Consumer Entry Points

_None verified._

---

## Artifacts by Type

### Controllers

| Name | File Path |
| --- | --- |
| `MigrationController` | `src/main/java/com/paytmmoney/migration/controller/MigrationController.java` |
| `MigrationStatusController` | `src/main/java/com/paytmmoney/migration/controller/MigrationStatusController.java` |
| `DefaultMigrationConfigController` | `src/main/java/com/paytmmoney/migration/controller/DefaultMigrationConfigController.java` |
| `HealthController` | `src/main/java/com/paytmmoney/migration/controller/HealthController.java` |

### Services

| Name | File Path |
| --- | --- |
| `MigrationService` | `src/main/java/com/paytmmoney/migration/service/MigrationService.java` |
| `BulkMigrationService` | `src/main/java/com/paytmmoney/migration/service/BulkMigrationService.java` |
| `MigrationStatusService` | `src/main/java/com/paytmmoney/migration/service/MigrationStatusService.java` |
| `DefaultMigrationConfigService` | `src/main/java/com/paytmmoney/migration/service/DefaultMigrationConfigService.java` |
| `MigrationCacheManager` | `src/main/java/com/paytmmoney/migration/cache/MigrationCacheManager.java` |

### Interfaces

_None found_ (repository interfaces classified as Repositories per priority rules).

### Models

| Name | File Path |
| --- | --- |
| `ClusterType` | `src/main/java/com/paytmmoney/migration/model/enums/ClusterType.java` |
| `GlobalFlag` | `src/main/java/com/paytmmoney/migration/model/enums/GlobalFlag.java` |

### DTOs

| Name | File Path |
| --- | --- |
| `ApiResponse` | `src/main/java/com/paytmmoney/migration/model/dto/ApiResponse.java` |
| `MigrateUserRequest` | `src/main/java/com/paytmmoney/migration/model/dto/MigrateUserRequest.java` |
| `MigrationStatusResponse` | `src/main/java/com/paytmmoney/migration/model/dto/MigrationStatusResponse.java` |
| `MigrationStatusByUserIdListRequest` | `src/main/java/com/paytmmoney/migration/model/dto/MigrationStatusByUserIdListRequest.java` |
| `DefaultMigrationConfigRequest` | `src/main/java/com/paytmmoney/migration/model/dto/DefaultMigrationConfigRequest.java` |
| `DefaultMigrationConfigResponse` | `src/main/java/com/paytmmoney/migration/model/dto/DefaultMigrationConfigResponse.java` |
| `ClusterInfo` | `src/main/java/com/paytmmoney/migration/model/dto/ClusterInfo.java` |

### Entities

| Name | File Path |
| --- | --- |
| `MigrationStatus` | `src/main/java/com/paytmmoney/migration/model/entity/MigrationStatus.java` |
| `MigrationAuditLog` | `src/main/java/com/paytmmoney/migration/model/entity/MigrationAuditLog.java` |
| `DefaultMigrationConfig` | `src/main/java/com/paytmmoney/migration/model/entity/DefaultMigrationConfig.java` |

### Repositories

| Name | File Path |
| --- | --- |
| `MigrationStatusRepository` | `src/main/java/com/paytmmoney/migration/repository/MigrationStatusRepository.java` |
| `MigrationAuditLogRepository` | `src/main/java/com/paytmmoney/migration/repository/MigrationAuditLogRepository.java` |
| `DefaultMigrationConfigRepository` | `src/main/java/com/paytmmoney/migration/repository/DefaultMigrationConfigRepository.java` |

### Jobs

_None found._

### Schedulers

| Name | File Path |
| --- | --- |
| `CacheRefreshScheduler` | `src/main/java/com/paytmmoney/migration/scheduler/CacheRefreshScheduler.java` |
| `DefaultMigrationConfigCacheRefreshScheduler` | `src/main/java/com/paytmmoney/migration/scheduler/DefaultMigrationConfigCacheRefreshScheduler.java` |

### Consumers

_None found._

### Event Listeners

_None found._

### Configurations

| Name | File Path |
| --- | --- |
| `CacheConfig` | `src/main/java/com/paytmmoney/migration/config/CacheConfig.java` |

### Utilities

_None found._

### Exception Handlers

| Name | File Path |
| --- | --- |
| `GlobalExceptionHandler` | `src/main/java/com/paytmmoney/migration/exception/GlobalExceptionHandler.java` |

---

## Not Found / Not Verified

| Item | Result |
| --- | --- |
| Kafka / RabbitMQ consumers | Not present in `src/main/java` |
| Quartz / batch jobs | Not present in `src/main/java` |
| `@EventListener` handlers | Not present in `src/main/java` |
| Standalone utility classes (`*Util`, `utils/`) | Not present in `src/main/java` |
| Flyway at runtime | Dependency present; `spring.flyway.enabled: false` in default `application.yml` |
