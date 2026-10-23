# NyayaConnect 5.2.1 — Project Audit

Audit updated: 2026-10-19. Scope: supplied ZIP extracted to a working copy; original ZIP retained unchanged. A local Git baseline commit was created before edits.

## Executive status

The repository is a React/Vite + TypeScript frontend and Java 17-targeted Jakarta Servlet/Spring 6 WAR backend using JdbcTemplate and MySQL. The available environment has Node 22 and Java 21, but no Maven, Docker, MySQL, installed frontend dependencies, or npm cache. Full application builds and live integration cannot be honestly marked passed here.

## Findings by severity

### High

- **Appointment race condition (addressed in code; concurrency test blocked):** the previous overlap-check then insert sequence did not serialize concurrent bookings for the same lawyer. The booking transaction now locks the lawyer's `users` row with `SELECT ... FOR UPDATE` before checking overlaps. A real two-connection MySQL concurrency test is still required.
- **Blocked accounts could retain an existing session (addressed in code; servlet integration test blocked):** authentication previously trusted the session snapshot only. Protected API requests now re-check the current user record and invalidate sessions for deleted/blocked users or changed roles. This adds a database lookup to protected requests and fails closed if the check is unavailable.
- **Unsafe production database defaults (addressed in code):** `DatabaseConfig` now requires explicit DB settings in `APP_ENV=production`, rejects placeholder credentials and weak TLS URL flags, and requires Connector/J `sslMode=VERIFY_CA` or `VERIFY_IDENTITY`. Local/demo defaults remain for the documented Docker demo only.
- **Authentication brute-force controls absent (partially addressed):** added a bounded per-process IP throttle after 10 failed login attempts in a 15-minute window. This is not a distributed rate limiter; production must also enforce edge/WAF/API-gateway limits.

### Medium

- **No dependency lockfile:** `package-lock.json` is absent. `npm install` timed out in this environment and no node_modules/cache was available. A reproducible frontend install is therefore not verified.
- **Full backend build unavailable:** Maven is not installed and the dependency cache is absent. Backend core checks pass, but servlet/Spring compilation and JUnit tests remain unverified.
- **Live database/Docker integration unavailable:** neither Docker nor MySQL is installed, so startup, migrations, DB TLS behavior, and end-to-end flows are unverified.
- **AI source quality is operationally dependent on seed/index data:** chat performs MySQL full-text retrieval from active verified source rows and abstains when none are found. There is no LLM generation in this path and no automated evaluation corpus yet; legal accuracy must not be overstated.
- **Upload malware scanning is not implemented:** uploads use size, MIME/signature and private-path checks, but scanning/quarantine remains a deployment requirement.
- **CSP allows inline styles:** this is documented as a compatibility trade-off for current inline style attributes. A nonce/hash-based CSP or removal of inline styles is preferable before production.

### Low

- Some older documents still contain historical version labels. The main README is the current entry point; version labels in legacy verification notes should not be interpreted as the current release version.
- `backend/README.md` was updated to align its version label with 5.2.1; other historical changelog entries remain intentionally historical.

## Changes made in this continuation

- Added per-lawyer transaction locking to serialize appointment booking checks.
- Revalidate the session user against current database state on protected API requests.
- Add best-effort per-IP login throttling and a unit test.
- Set session cookies HttpOnly, production-Secure, and a 30-minute max age.
- Require explicit, TLS-verified database settings in production mode.
- Added security, architecture, testing, deployment, and AI safety documentation.

## Verification evidence

`backend/verify-backend.sh` was executed after changes. Results: `CORE_BACKEND_CHECK=PASS`, `LOGIN_RATE_LIMIT_CHECK=PASS`, `XML_CHECK=PASS`, `SCHEMA_CHECK=PASS`, `SEED_FILES_CHECK=PASS`, `BOOKING_LOCK_SOURCE_CHECK=PASS`, `BLOCKED_SESSION_SOURCE_CHECK=PASS`, `PRODUCTION_DB_GUARD_SOURCE_CHECK=PASS`, `ROUTE_CHECK=PASS`, `SECURITY_SOURCE_CHECK=PASS`. Maven tests were explicitly skipped by the script because Maven is unavailable. `npm install` timed out; frontend typecheck/build were not run because dependencies were unavailable. Docker/MySQL integration was not run.

## Readiness decision

Suitable for continued local development and a controlled college/demo evaluation only after running it on a machine with the required dependencies. Not verified for staging or production. Complete the blocked build, DB concurrency, authorization, CSRF, upload, AI evaluation, dependency scanning, and deployment tests before staging or production use.
