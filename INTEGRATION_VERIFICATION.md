# NyayaConnect 5.2.1 — Integration Verification

Updated: 2026-10-19. This document supersedes the older version-labeled status below in previous releases. See `docs/TESTING.md` for the detailed current verification matrix and `docs/PROJECT_AUDIT.md` for findings.

## Verified in the current continuation environment

- `backend/verify-backend.sh`: PASS for dependency-free core behavior, login limiter behavior, XML parsing, required schema/seed checks, source assertions for appointment locking, blocked-session invalidation and production database TLS guards, route registration and selected security-source checks.
- TypeScript transpile/parse check across 23 `.ts`/`.tsx` files: PASS, zero syntax diagnostics.
- `git diff --check`: expected to be run before packaging.

## Blocked or not run

- `npm install`: attempted; failed with `EAI_AGAIN` resolving `registry.npmjs.org`. No lockfile or installed `node_modules` is present. Frontend typecheck and production build are not verified.
- Maven is not installed and dependencies are not cached. Full Java compilation, JUnit tests, WAR packaging and servlet-container startup are not verified.
- Docker and MySQL are not installed. Docker Compose, health/readiness, real database persistence and live integration tests are not verified.
- Concurrent appointment booking has a per-lawyer row lock in the transaction, but has not been proven with competing requests against MySQL.

## Commands to run on a machine with dependencies

```powershell
Set-ExecutionPolicy -Scope Process Bypass
.\scripts\verify-local.ps1
```

To additionally launch MySQL + Tomcat and poll health/readiness:

```powershell
.\scripts\verify-local.ps1 -RunDocker
```

Do not interpret source checks as a passing full build or a completed security audit. The platform is not verified for staging/production in this environment.
