# Architecture

## Current application shape

- **Frontend:** React 19, TypeScript, Vite; API requests are centralized in `src/api.ts` and use same-origin `/api` routes with cookie credentials and a CSRF header.
- **HTTP layer:** Jakarta Servlet 6 endpoints registered in `WebAppInitializer`.
- **Application layer:** Spring 6 component scanning, service classes, transaction management.
- **Persistence:** JdbcTemplate and HikariCP against MySQL 8.
- **Security filters:** authentication, CSRF, security headers, correlation ID, and UTF-8 encoding.
- **Private files:** document bytes are stored under `DOCUMENT_STORAGE_ROOT`, outside the frontend's public assets, and downloads check case access.
- **AI/legal support:** deterministic triage and MySQL full-text retrieval from active, verified legal-source chunks. Chat abstains if retrieval returns no sources; it is not an autonomous legal opinion service.

## Appointment consistency

Booking runs in a Spring transaction. It locks the selected lawyer's user row with `SELECT ... FOR UPDATE`, then checks overlapping active appointments and inserts the case, appointment, timeline event, notification, and audit event. The lock is intended to serialize concurrent booking requests for a lawyer. This invariant still requires validation with concurrent requests against MySQL before release.

## Request path

Browser → Vite same-origin proxy (development) or HTTPS reverse proxy (deployment) → servlet filters → servlet → Spring service → DAO/JdbcTemplate → MySQL. Do not expose the database publicly. Deploy behind HTTPS and use least-privilege database credentials.
