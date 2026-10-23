# Security Notes and Deployment Controls

## Implemented controls in this repository

- BCrypt password hashing (cost factor 12).
- Generic login failure message and best-effort per-IP process-local throttling.
- Session ID rotation through invalidating any pre-existing session before creating the authenticated session.
- HttpOnly session cookie, 30-minute max age, and Secure flag when `APP_ENV=production`.
- Current-user lookup on protected API requests; blocked/deleted users and role changes invalidate their session.
- CSRF token required for state-changing authenticated API requests, except documented public login/registration and public triage routes.
- Parameterized SQL in the reviewed booking/retrieval paths.
- Security headers, including CSP, frame denial, MIME sniffing protection and referrer policy.
- Document path normalization, private storage, MIME/signature validation, upload size limits, case access checks and SHA-256 integrity metadata.

## Important limitations

These are code-level controls, not an independent security audit. Automated servlet integration and penetration tests were not run in the current environment. The login limiter is process-local and does not replace reverse-proxy/WAF rate limiting. Upload malware scanning/quarantine is not implemented. Current CSP permits inline styles for compatibility. Session `Secure` is set based on `APP_ENV`; production must only be served over HTTPS. Review cookie SameSite behavior in the selected servlet container and deployment topology.

## Production database configuration

Set `APP_ENV=production`, `DB_URL`, `DB_USER`, and `DB_PASSWORD` explicitly. `DB_URL` must use Connector/J `sslMode=VERIFY_CA` or `sslMode=VERIFY_IDENTITY`; do not use `useSSL=false`, `sslMode=DISABLED`, or `allowPublicKeyRetrieval=true`. Use a dedicated least-privilege database account and a managed secret store. Do not use demo seed accounts or placeholder passwords in production.

## Required before staging/production

- Run dependency and secret scans and review results.
- Verify authorization for each role and cross-user case/document access.
- Test CSRF, session expiry/logout/fixation, blocked-account invalidation, rate limiting and unsafe redirects.
- Add malware scanning/quarantine, encrypted backups, retention policy, restore drills and operational alerts.
- Configure HTTPS, cookie SameSite, trusted origins, CSP without unsafe inline styles where feasible, and trusted TLS certificates.
- Complete independent penetration testing and privacy/legal review.
