# ER Diagram Report

> **Scope analyzed:** `/Users/rohitverma/Downloads/bo-migration-service`
> **Generated:** 2026-06-17
> **Method:** Source-verified schema reverse-engineering.

---

## Verification Summary

| Check | Result |
| --- | --- |
| ORM / migration stack | Spring Boot Data JPA, Hibernate (MySQL dialect), Flyway, MySQL |
| Entities/tables verified | 3 |
| Relationships verified | 0 |
| Relationships inferred | 1 |
| Git repository | Yes |

**Stack evidence:**

| Component | Evidence |
| --- | --- |
| JPA / Hibernate | `pom.xml` — `spring-boot-starter-data-jpa`; `application.yml` — `hibernate.dialect: org.hibernate.dialect.MySQLDialect` |
| Flyway | `pom.xml` — `flyway-core`, `flyway-mysql`; `application.yml` — `spring.flyway` |
| MySQL | `pom.xml` — `mysql-connector-j` |

---

## Entity Inventory

| Entity | Table | Source File |
| ------ | ----- | ----------- |
| `MigrationStatus` | `migration_status` | `src/main/java/com/paytmmoney/migration/model/entity/MigrationStatus.java` |
| `MigrationAuditLog` | `migration_audit_log` | `src/main/java/com/paytmmoney/migration/model/entity/MigrationAuditLog.java` |
| `DefaultMigrationConfig` | `migration_default_config` | `src/main/java/com/paytmmoney/migration/model/entity/DefaultMigrationConfig.java` |

**Migration scripts (schema DDL):**

| Table | Source File |
| ----- | ----------- |
| `migration_status`, `migration_audit_log` | `src/main/resources/db/migration/V1__create_migration_tables.sql` |
| `migration_default_config` | `src/main/resources/db/migration/V2__create_default_migration_config.sql` |
| `migration_default_config.global_flag` (ALTER) | `src/main/resources/db/migration/V3__add_global_flag_to_default_config.sql` |

**Repository interfaces (JPA, no schema definition):**

| Repository | Entity | Source File |
| ---------- | ------ | ----------- |
| `MigrationStatusRepository` | `MigrationStatus` | `src/main/java/com/paytmmoney/migration/repository/MigrationStatusRepository.java` |
| `MigrationAuditLogRepository` | `MigrationAuditLog` | `src/main/java/com/paytmmoney/migration/repository/MigrationAuditLogRepository.java` |
| `DefaultMigrationConfigRepository` | `DefaultMigrationConfig` | `src/main/java/com/paytmmoney/migration/repository/DefaultMigrationConfigRepository.java` |

---

## Columns

### MigrationStatus → `migration_status`

| Entity | Column | Type | PK | FK | Source File |
| ------ | ------ | ---- | -- | -- | ----------- |
| MigrationStatus | id | BIGINT / Long | Yes | — | `MigrationStatus.java` L24–26; `V1__create_migration_tables.sql` L3 |
| MigrationStatus | user_id | BIGINT / Long | No | — | `MigrationStatus.java` L28–29; `V1__...sql` L4 |
| MigrationStatus | ucc | VARCHAR(50) / String | No | — | `MigrationStatus.java` L31–32; `V1__...sql` L5 |
| MigrationStatus | primary_cluster | ENUM('CLASS','TECHEXCEL') / ClusterType | No | — | `MigrationStatus.java` L34–37; `V1__...sql` L6 |
| MigrationStatus | secondary_cluster | ENUM('CLASS','TECHEXCEL') / ClusterType | No | — | `MigrationStatus.java` L39–42; `V1__...sql` L7 |
| MigrationStatus | is_secondary_sync_allowed | BOOLEAN / Boolean | No | — | `MigrationStatus.java` L44–46; `V1__...sql` L8 |
| MigrationStatus | created_at | TIMESTAMP / LocalDateTime | No | — | `MigrationStatus.java` L48–49; `V1__...sql` L9 |
| MigrationStatus | updated_at | TIMESTAMP / LocalDateTime | No | — | `MigrationStatus.java` L51–52; `V1__...sql` L10 |

### MigrationAuditLog → `migration_audit_log`

| Entity | Column | Type | PK | FK | Source File |
| ------ | ------ | ---- | -- | -- | ----------- |
| MigrationAuditLog | id | BIGINT / Long | Yes | — | `MigrationAuditLog.java` L23–25; `V1__create_migration_tables.sql` L18 |
| MigrationAuditLog | user_id | BIGINT / Long | No | — | `MigrationAuditLog.java` L27–28; `V1__...sql` L19 |
| MigrationAuditLog | ucc | VARCHAR(50) / String | No | — | `MigrationAuditLog.java` L30–31; `V1__...sql` L20 |
| MigrationAuditLog | old_primary | VARCHAR(20) / String | No | — | `MigrationAuditLog.java` L33–34; `V1__...sql` L21 |
| MigrationAuditLog | new_primary | VARCHAR(20) / String | No | — | `MigrationAuditLog.java` L36–37; `V1__...sql` L22 |
| MigrationAuditLog | old_secondary | VARCHAR(20) / String | No | — | `MigrationAuditLog.java` L39–40; `V1__...sql` L23 |
| MigrationAuditLog | new_secondary | VARCHAR(20) / String | No | — | `MigrationAuditLog.java` L42–43; `V1__...sql` L24 |
| MigrationAuditLog | action | ENUM('MIGRATE','ROLLBACK','BULK_MIGRATE') / AuditAction | No | — | `MigrationAuditLog.java` L45–47; `V1__...sql` L25 |
| MigrationAuditLog | performed_by | VARCHAR(100) / String | No | — | `MigrationAuditLog.java` L49–50; `V1__...sql` L26 |
| MigrationAuditLog | performed_at | TIMESTAMP / LocalDateTime | No | — | `MigrationAuditLog.java` L52–53; `V1__...sql` L27 |

### DefaultMigrationConfig → `migration_default_config`

| Entity | Column | Type | PK | FK | Source File |
| ------ | ------ | ---- | -- | -- | ----------- |
| DefaultMigrationConfig | id | BIGINT / Long | Yes | — | `DefaultMigrationConfig.java` L27; `V2__create_default_migration_config.sql` L2 |
| DefaultMigrationConfig | default_primary | ENUM('CLASS','TECHEXCEL') / ClusterType | No | — | `DefaultMigrationConfig.java` L29–32; `V2__...sql` L3 |
| DefaultMigrationConfig | default_secondary | ENUM('CLASS','TECHEXCEL') / ClusterType | No | — | `DefaultMigrationConfig.java` L34–37; `V2__...sql` L4 |
| DefaultMigrationConfig | is_secondary_sync_allowed | BOOLEAN / Boolean | No | — | `DefaultMigrationConfig.java` L39–41; `V2__...sql` L5 |
| DefaultMigrationConfig | global_flag | ENUM('AUDIT','CLASS','TECHEXCEL') / GlobalFlag | No | — | `DefaultMigrationConfig.java` L43–46; `V3__add_global_flag_to_default_config.sql` L1–2 |
| DefaultMigrationConfig | updated_at | TIMESTAMP / LocalDateTime | No | — | `DefaultMigrationConfig.java` L48–49; `V2__...sql` L6 |

---

## Relationships

| Source Entity | Target Entity | Relationship | Evidence |
| ------------- | ------------- | ------------ | -------- |
| MigrationStatus | MigrationAuditLog | one-to-many `[INFERRED]` | Both tables define indexed `user_id` (`MigrationStatus.java` L28–29, L15; `MigrationAuditLog.java` L27–28, L14; `V1__create_migration_tables.sql` L4, L12, L19, L29). No `@JoinColumn`, `@ManyToOne`, or SQL `FOREIGN KEY` constraint found. |

**Verified relationships:** _None found._ No JPA association mappings (`@ManyToOne`, `@OneToMany`, `@OneToOne`, `@JoinColumn`) and no SQL `FOREIGN KEY` constraints in Flyway scripts.

---

## Mermaid ER Diagram

See [er-diagram.mmd](./er-diagram.mmd) for the full diagram.

The diagram includes all three verified tables with columns. Inferred `MigrationStatus` → `MigrationAuditLog` link is documented above only (not drawn — no FK in source).

---

## Not Found / Not Verified

| Item | Result |
| --- | --- |
| Liquibase changelogs | _None found_ |
| Prisma / TypeORM / Sequelize / Django / SQLAlchemy models | _None found_ |
| SQL `FOREIGN KEY` constraints | _None found_ in V1–V3 migrations |
| JPA association mappings | _None found_ — entities are standalone; no `@ManyToOne` / `@OneToMany` |
| `@GeneratedValue` on `DefaultMigrationConfig.id` | Entity uses `@Id` only (`DefaultMigrationConfig.java` L27); SQL defines `BIGINT PRIMARY KEY` with seed `INSERT ... VALUES (1, ...)` in `V2__create_default_migration_config.sql` L8–10 |
| Entity / migration conflict | _None found_ — JPA column mappings align with Flyway DDL for all three tables |
