
## 5.2.1 Final UI/Encoding Fixes — 2026-10-10

- Fixed desktop client navigation overflow by moving Legal Aid and Case Tracking into a More menu.
- Added stable spacing between NyayaConnect branding and desktop navigation.
- Preserved role-based navigation, notifications, account controls, sign-out, and mobile navigation.
- Added `SET NAMES utf8mb4;` to MySQL seed scripts to prevent UTF-8 seed data corruption during initialization.
- No backend API, authentication, MySQL schema, or case workflow changes beyond the seed initialization charset directive.

# NyayaConnect 5.2.1

## Docker/runtime and verification hotfix
- Fixed HikariCP/MySQL driver resolution by explicitly setting `com.mysql.cj.jdbc.Driver`.
- Updated the local JDBC fallback URL for MySQL 8.x with UTF-8 and Docker-compatible public-key retrieval settings.
- Made JUnit 5 execution explicit and fail the Maven build when no tests are discovered.
- Added the JUnit Jupiter engine explicitly for deterministic Surefire test discovery.
- Standardized project version metadata to 5.2.1.


## Professional legal workspace + engineering hardening
- Replaced AI-first dashboard patterns with a calm, case-centric legal workspace for clients and advocates.
- Removed decorative AI language, dark gradient hero sections, arbitrary lawyer match scores and dashboard chatbot behavior.
- Added real case progress, next-action, consultation, advocate and document summaries from backend data.
- Added advocate workspace focused on consultation requests, matters and schedule.
- Added backend unit coverage for appointment transitions, triage safety, citation bounds, BCrypt password verification and document integrity/path traversal.
- Centralized appointment transition policy for easier testing and maintenance.
- Standardized frontend/backend version to 5.2.1.
- Made Docker database credentials configurable through environment variables while retaining local demo defaults.
- Added UTF-8 JDBC settings to the local Docker connection configuration.

# NyayaConnect 5.1

## Production UX refinement
- Reworked the client dashboard around legal case management rather than AI-first marketing patterns.
- Introduced restrained legal-professional visual language: navy, paper, muted gold, serif matter headings and compact controls.
- Reduced oversized rounded cards, gradients, decorative AI badges and excessive pills.
- Prioritized current matter, consultation schedule, outstanding case actions and advocate discovery.
- Removed developer/architecture language from the customer experience while preserving the engineering implementation.
- Updated page metadata to describe the customer product rather than the academic Java stack.

# Changelog

## 5.0.0 — Production User Experience

- Removed architecture/source-code controls from the customer experience.
- Removed the visible role-mode banner and technology-stack labels.
- Removed academic/developer architecture links from the public footer.
- Added role-aware product navigation for Client, Lawyer and Admin accounts.
- Restricted administration and security-log navigation to Admin accounts.
- Removed hard-coded demo payment/invoice presentation from the client dashboard.
- Removed fake/local-only client messaging controls from the customer dashboard.
- Replaced hard-coded time-of-day greeting with a dynamic local greeting.
- Dashboard metrics now show active cases, open tasks, documents and verified advocates.
- Improved customer-facing wording for document security, sessions, video consultations and account security.
- Removed internal file identifiers/storage keys from the document UI.
- Removed framework/database implementation names from common customer-facing screens.
- Made appointment date/time serialization robust for MySQL JDBC drivers returning either Timestamp or LocalDateTime.
- Kept Advanced Java architecture, source code and viva material in the repository for academic/engineering evaluation without exposing it to customers.

## 4.1.2 — Local build fixes
- Fixed Spring transaction annotation import.
- Implemented JdbcDocumentDao.find(UUID).
- Aligned esbuild with Vite 8 peer requirements.
- Verification script now fails on frontend/backend command failures instead of reporting a false PASS.

## 4.0.0 — Modern Legal-Tech UX

- Reframed the product as a digital legal case companion.
- Added case-centric client command center.
- Added browser voice legal intake.
- Added English/Hinglish experience toggle.
- Added explainable lawyer matching presentation.
- Added Ask My Documents source-first UX.
- Added consultation brief workflow and backend endpoint.
- Added Lawyer Copilot dashboard.
- Added Security Center and AI Trust Center.
- Added dark/light mode and mobile-first modal behavior.
- Expanded MySQL schema with verification, messaging, payments, invoices, privacy, AI brief and document-query entities.
- Removed unused client-side Gemini/Express runtime dependencies; AI access is intended to be server-side.
