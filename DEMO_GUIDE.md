# NyayaConnect Integrated Demo Guide

## Demo story

Use one case from start to finish instead of clicking random modules.

### Client

1. Login.
2. AI Legal Intake.
3. Lawyer matching.
4. Book consultation.
5. View appointment.
6. Open case workspace.
7. Upload evidence.
8. Ask the assistant / view trust notice.

### Lawyer

1. Login as lawyer.
2. Accept appointment.
3. Open consultation.
4. Generate consultation brief.
5. Complete consultation.
6. Review case tasks and timeline.

### Admin

1. Login as admin.
2. Review users.
3. Toggle a user block state.
4. Review lawyer verification status.
5. Inspect audit history.

## What to say to the examiner

> "The React interface is not the source of truth. It calls authenticated Jakarta Servlet APIs. Spring manages services and transactions, JdbcTemplate implements DAO persistence, and MySQL stores the legal case data. Security-sensitive actions are enforced on the server. AI is assistive and source-aware; it does not claim to replace a lawyer."
