# Deployment and Operations

## Local demo

Requirements: Docker Desktop with Compose, Node/npm, and a browser. From `backend/`, `docker compose up --build` starts MySQL and the Tomcat WAR. From the project root, run `npm install` and `npm run dev`. Local demo credentials and seed data are documented in the root README; never reuse them in a real environment.

## Production configuration

- Set `APP_ENV=production`.
- Supply `DB_URL`, `DB_USER`, and `DB_PASSWORD` through a secret manager/environment injection. Use Connector/J `sslMode=VERIFY_IDENTITY` where supported by the database certificate setup (or `VERIFY_CA` where hostname verification cannot be configured, with a documented reason).
- Use unique, high-entropy credentials and a least-privilege database account.
- Terminate HTTPS at a trusted reverse proxy and forward only trusted proxy headers. Set the application cookie Secure flag by keeping `APP_ENV=production`.
- Configure private durable document storage, encryption at rest, malware scanning/quarantine, backups and retention controls.
- Remove demo seed SQL from production initialization and disable demo accounts.
- Restrict database network access to the application tier; do not publish MySQL ports publicly.

## Startup and checks

- Backend base URL: `http://localhost:8080` for local demo.
- Liveness: `GET /health`.
- Readiness (includes a database query): `GET /ready`.
- Schema initialization in local Docker runs only on first initialization of an empty MySQL data directory. Existing volumes are not automatically migrated by edits to `schema.sql`.

## Backup, rollback, incidents

Before any schema migration, create and verify a database backup. Use additive/versioned migrations for future schema changes; do not reset an existing database. Test restoration into an isolated database before relying on backups. Keep deployment artifacts and prior image versions so rollback can restore the prior application version; make sure schema changes remain backward-compatible. Rotate credentials after suspected exposure, review audit/security events, preserve relevant evidence, and follow the organization's incident-response process.

## Readiness boundary

The current repository has not been verified with a full Maven build, live Docker/MySQL startup, load/concurrency tests, production TLS, backups, monitoring, or an independent security review in this environment. It is not certified production-ready.
