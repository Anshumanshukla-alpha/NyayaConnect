# NyayaConnect 5.2.1 — Java Legal-Tech Backend

This backend preserves the PPT's required architecture: **Jakarta Servlets → Spring IoC/Service → DAO/JdbcTemplate → MySQL**, while adding production-oriented security, auditability, case management, document integrity, explainable matching, consultation briefs, case messaging, privacy controls, payments/invoices, health checks and AI safety boundaries.

## What is real in this backend
- JDK 17 target; Tomcat 10.1+ / Jakarta Servlet.
- Spring Framework 6.x dependency injection and transaction management.
- HikariCP + MySQL 8.x.
- BCrypt password hashing with cost 12.
- Server-side session authentication; roles are not trusted from the browser.
- Security headers and correlation IDs.
- Database schema for users, lawyers, verification, availability, appointments, cases, documents/versioning, notifications, consent, audit/security events and AI sessions/evaluations.
- Deterministic legal triage that **does not invent confidence percentages** and marks source verification false unless a trusted retrieval pipeline supplies citations.
- Docker/Tomcat deployment path.

## Important production boundary
The backend intentionally does not claim legal compliance, legal correctness, payment settlement, malware scanning, court-data integration or AI source verification unless the corresponding provider/integration is configured and tested. The safe default is to refuse unsupported certainty.

## Run
1. Install JDK 17 and Maven 3.9+.
2. Create MySQL database/user using `src/main/resources/schema.sql`.
3. Set `DB_URL`, `DB_USER`, `DB_PASSWORD`.
4. `mvn clean verify`
5. Deploy `target/nyayaconnect-backend.war` to Tomcat 10.1+.

## API surface
- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/logout`
- `GET /api/v1/auth/me`
- `POST /api/ai/triage`
- `POST /api/ai/chat`
- `POST /api/ai/document-summary`
- `POST /api/ai/consultation-brief`
- `POST /api/ai/chat` (safe fallback; source-grounded production provider should be configured)
- Modern client UX modules: AI intake, voice intake, Ask My Documents, consultation brief, explainable lawyer matching, security center and AI trust center
- `GET /health`
- `GET /ready`

## Frontend integration
The existing React client can continue using `/api/ai/triage`, `/api/ai/chat`, and `/api/ai/document-summary`. In production, serve the frontend behind the same origin/reverse proxy as Tomcat so session cookies and CSRF protection can be managed centrally.
