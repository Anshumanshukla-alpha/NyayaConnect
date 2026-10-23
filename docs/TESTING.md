# Testing and Verification

## Commands

From project root:

```powershell
npm install
npm run typecheck
npm run build
```

Backend with Maven installed and dependency access:

```powershell
cd backend
mvn clean verify
```

Dependency-light backend checks available in this repository:

```bash
cd backend
./verify-backend.sh
```

Full local verification on Windows:

```powershell
Set-ExecutionPolicy -Scope Process Bypass
.\scripts\verify-local.ps1
```

Docker integration verification (requires Docker Desktop):

```powershell
.\scripts\verify-local.ps1 -RunDocker
```

## Actual status in the 2026-10-19 continuation environment

| Check | Status | Evidence |
|---|---|---|
| Backend dependency-free core check | PASS | `CORE_BACKEND_CHECK=PASS` |
| Login limiter executable check | PASS | `LOGIN_RATE_LIMIT_CHECK=PASS` |
| Booking/session/production-DB source assertions | PASS | `BOOKING_LOCK_SOURCE_CHECK`, `BLOCKED_SESSION_SOURCE_CHECK`, `PRODUCTION_DB_GUARD_SOURCE_CHECK` all passed |
| XML config parse | PASS | `XML_CHECK=PASS` |
| Required schema table checks | PASS | `SCHEMA_CHECK=PASS` |
| Seed files present | PASS | `SEED_FILES_CHECK=PASS` |
| Required route registration source checks | PASS | `ROUTE_CHECK=PASS` |
| Existing source security assertions | PASS | `SECURITY_SOURCE_CHECK=PASS` |
| Maven unit tests / WAR build | BLOCKED | Maven is not installed; test suite did not run |
| Frontend install | BLOCKED | `npm install` timed out; no dependency cache or `node_modules` available |
| Frontend typecheck/build | NOT RUN | Required packages unavailable |
| Docker/MySQL startup and health/readiness | NOT RUN | Docker/MySQL unavailable |
| Appointment concurrent-booking integration test | NOT RUN | Requires disposable MySQL and multiple concurrent requests |
| Full auth/authorization/CSRF/upload E2E suite | NOT RUN | Requires built backend, database and browser test environment |

A passing source-level check is not proof of a successful full build or runtime integration. Update this table only with actual command output.
