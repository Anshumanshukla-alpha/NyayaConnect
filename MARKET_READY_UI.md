# NyayaConnect 5.2.1 — Market-Ready UI Boundary

## Product principle

The engineering architecture remains in the application and repository, but customers should experience NyayaConnect as a legal service product—not as a software engineering demonstration.

## Customer UI hides

- Jakarta Servlet / Spring / JdbcTemplate / MySQL labels
- Architecture explorer and source-code inspection
- Developer diagnostics
- Academic viva material
- Internal database/table names
- Storage keys and internal identifiers
- Role-mode switching language
- Fake demo payment controls
- Local-only fake messaging controls

## Role boundaries

### Client
Dashboard, Legal Help, Find an Advocate, Appointments, My Cases, Documents, Legal Aid, Case Tracking, Account.

### Lawyer
Dashboard, Appointments, My Cases, Documents, Account.

### Admin
Overview, Administration, Appointments, Cases, Advocates, Security Logs.

Architecture/source-code components remain in the repository for academic and engineering evaluation but are not reachable through the normal customer navigation.
