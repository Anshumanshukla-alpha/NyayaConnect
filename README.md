# NyayaConnect 5.2.1 — Professional Legal Workspace + Integrated Java Platform

NyayaConnect is an AI-assisted legal consultation and case-management platform built around the required Advanced Java architecture:

**React/Vite UI → Jakarta Servlets → Spring 6 Services → DAO/JdbcTemplate → MySQL 8**

The frontend is a customer-facing product surface over the Java backend. Browser state is presentation state only; authenticated domain data comes from MySQL. Engineering implementation details remain in the repository and internal documentation rather than the customer UI.

## What is integrated

- Server-side login, registration, logout and session identity
- Server-side roles: CLIENT / LAWYER / ADMIN
- CSRF protection for state-changing requests
- Security headers and correlation IDs
- MySQL-backed users, lawyers, appointments, cases, tasks, timeline, notifications and audit records
- Real appointment booking, confirmation, rejection and completion APIs
- Appointment overlap prevention in the service transaction
- Secure document upload with multipart limits, MIME validation, magic-byte validation and SHA-256
- Private document download with case-level authorization
- Case task and timeline mutations persisted through Java APIs
- Admin user blocking and lawyer verification status changes
- AI legal triage with source-verification flags and safe fallback behavior
- Source-aware legal assistant endpoint
- Consultation brief endpoint with human-verification language
- Professional case-centric client and advocate workspaces with restrained legal-product UX
- Production-facing navigation hides architecture/source-code/debug controls from clients and lawyers
- Admin-only navigation for platform administration and security logs
- Customer UI uses plain-language legal product terminology instead of framework/database terminology
- Dashboard metrics are derived from real backend case, appointment, task and document records
- Voice intake using browser Speech Recognition when supported
- English / Hindi / Hinglish interaction affordances where the workflow needs them
- Mobile-first responsive UI
- Dockerized Tomcat + MySQL backend
- Demo seed data for local evaluation

## Local demo credentials

Only for the Docker demo seed:

- Client: `rahul@demo.nyayaconnect.local`
- Lawyer: `priya@demo.nyayaconnect.local`
- Admin: `admin@demo.nyayaconnect.local`
- Password: `DemoPass123!`

**Do not use these credentials in a real deployment. Remove `seed-demo.sql` from production initialization.**

## 1. Start the Java + MySQL backend

Requirements:

- Docker Desktop
- Docker Compose
- JDK 17+ for local Java tooling

From `backend/`:

```bash
docker compose up --build
```

Backend:

```text
http://localhost:8080
```

Health:

```text
http://localhost:8080/health
http://localhost:8080/ready
```

The first MySQL initialization executes `schema.sql` followed by `seed-demo.sql`.

## 2. Start the frontend

From the project root:

```bash
npm install
npm run dev
```

Open the Vite URL shown by the terminal, normally:

```text
http://localhost:5173
```

Vite proxies `/api`, `/health` and `/ready` to `http://localhost:8080`.

## 3. First end-to-end demo

1. Sign in as the demo client.
2. Open **AI Legal Triage**.
3. Enter a legal problem in English/Hinglish/Hindi.
4. Review the safe triage result and source-verification state.
5. Open **Find Lawyers**.
6. Select a verified lawyer.
7. Book a future slot.
8. Sign out.
9. Sign in as the demo lawyer.
10. Accept the pending appointment.
11. Open the consultation and complete it.
12. Sign in as the client again.
13. Open **My Cases**.
14. Toggle a case task or add a timeline event.
15. Open **Document Vault** and upload a real PDF/PNG/JPEG/TXT file.
16. Download it through the authorized document endpoint.
17. Open **Admin** using the admin account and test lawyer verification/user blocking.

## AI safety model

NyayaConnect does not treat an LLM response as legal authority. The backend exposes source verification and citation fields, and the UI labels AI output as assistive. If verified sources are unavailable, the legal assistant does not invent an answer.

## Production checklist

Before any real deployment:

- Replace demo credentials and seed data.
- Set strong database secrets through a secret manager.
- Put Tomcat behind HTTPS/reverse proxy.
- Configure Secure/HttpOnly/SameSite cookies for the production topology.
- Configure private object storage or encrypted filesystem with backup/restore.
- Add malware scanning and content-disarm controls for uploads.
- Populate and continuously verify the legal-source index.
- Connect an approved LLM provider only after privacy/contract review.
- Add formal penetration testing and dependency/SBOM scanning.
- Configure real email/SMS/WhatsApp providers if required.
- Add production monitoring, alerting and log retention policies.
- Independently review legal/privacy/compliance claims before using them commercially.

## Verification

The current continuation audit and exact environment limitations are recorded in `docs/PROJECT_AUDIT.md` and `docs/TESTING.md`. The repository CI workflow is in `.github/workflows/ci.yml`. A successful source-level check does not replace a full Maven/frontend build or Docker/MySQL integration test.


Backend automated tests now cover appointment state transitions, legal triage safety, citation bounds, BCrypt password verification and document integrity/path traversal.

Backend core verification:

```bash
cd backend
./verify-backend.sh
```

Frontend:

```bash
npm run typecheck
npm run build
```

Full Maven verification on a machine with Maven/network access:

```bash
cd backend
mvn clean verify
```

## Architecture

See `docs/ARCHITECTURE.md`, `docs/SECURITY.md`, `docs/DEPLOYMENT.md`, and `docs/AI_LEGAL_SAFETY.md` for implementation boundaries and required pre-production controls.


```text
React + Vite
     │
     │ HTTPS / same-origin API
     ▼
Jakarta Servlets
     │
     ├── Authentication / CSRF / Security Headers / Correlation ID
     │
     ▼
Spring 6 Services
     │
     ▼
DAO + JdbcTemplate
     │
     ▼
MySQL 8

AI path:

Authenticated user
  → safety validation
  → legal retrieval
  → source/citation validation
  → assistive response
  → human verification
```

## Important limitation

The platform is designed as an industrial-style modular monolith and is intentionally not presented as a certified legal service, legal advice engine, or independently audited compliance product.
