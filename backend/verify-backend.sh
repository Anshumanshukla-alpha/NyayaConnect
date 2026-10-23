#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT"

if command -v mvn >/dev/null 2>&1; then
  echo "== Maven unit/integration test suite =="
  mvn -q test
  echo "MAVEN_TESTS=PASS"
else
  echo "MAVEN_TESTS=SKIPPED (Maven not installed); dependency-free core checks will still run."
fi
TMP="$(mktemp -d "${TMPDIR:-/tmp}/nyayaconnect-verify.XXXXXX")"
trap 'rm -rf "$TMP"' EXIT
mkdir -p "$TMP/classes"

javac -d "$TMP/classes" \
  "$ROOT/src/main/java/com/nyayaconnect/user/UserRole.java" \
  "$ROOT/src/main/java/com/nyayaconnect/security/SessionUser.java" \
  "$ROOT/src/main/java/com/nyayaconnect/ai/LegalTriage.java" \
  "$ROOT/src/main/java/com/nyayaconnect/ai/TriageClassifier.java"
cat > "$TMP/TestCore.java" <<'JAVA'
import com.nyayaconnect.ai.*;
public class TestCore { public static void main(String[] a) {
  LegalTriage t=TriageClassifier.classify("My landlord has not returned my rent deposit");
  if(!t.category().contains("Tenancy")) throw new AssertionError("classification");
  if(!t.confidenceLevel().equals("LOW")) throw new AssertionError("uncalibrated confidence policy");
  if(t.sourceVerified()) throw new AssertionError("unverified source must not be marked verified");
  System.out.println("CORE_BACKEND_CHECK=PASS");
}}
JAVA
javac -cp "$TMP/classes" -d "$TMP/classes" "$TMP/TestCore.java"
java -cp "$TMP/classes" TestCore

javac -d "$TMP/classes" "$ROOT/src/main/java/com/nyayaconnect/security/LoginRateLimiter.java"
cat > "$TMP/TestRateLimiter.java" <<'JAVA'
import com.nyayaconnect.security.LoginRateLimiter;
public class TestRateLimiter { public static void main(String[] a) {
  String key = "verify-local-rate-limit";
  LoginRateLimiter.success(key);
  if (LoginRateLimiter.isLimited(key)) throw new AssertionError("fresh key should not be limited");
  for (int i=0; i<10; i++) LoginRateLimiter.failure(key);
  if (!LoginRateLimiter.isLimited(key)) throw new AssertionError("ten failures should be limited");
  LoginRateLimiter.success(key);
  if (LoginRateLimiter.isLimited(key)) throw new AssertionError("success should clear the limit");
  System.out.println("LOGIN_RATE_LIMIT_CHECK=PASS");
}}
JAVA
javac -cp "$TMP/classes" -d "$TMP/classes" "$TMP/TestRateLimiter.java"
java -cp "$TMP/classes" TestRateLimiter

python3 - <<'PY'
import xml.etree.ElementTree as ET
from pathlib import Path
ET.parse(Path('pom.xml')); ET.parse(Path('src/main/resources/logback.xml'))
print('XML_CHECK=PASS')
s=Path('src/main/resources/schema.sql').read_text()
required=['users','lawyer_profiles','appointments','cases','documents','document_versions','case_tasks','case_timeline','case_messages','payments','invoices','audit_logs','security_events','legal_sources','legal_source_chunks','ai_sessions','ai_case_briefs','ai_document_queries']
missing=[x for x in required if f'CREATE TABLE IF NOT EXISTS {x}' not in s]
assert not missing, missing
assert all(c in s.split('CREATE TABLE IF NOT EXISTS users',1)[1].split(';',1)[0] for c in ['phone','city','state']), 'users bootstrap columns missing'
print('SCHEMA_CHECK=PASS')
for f in ['seed-demo.sql','seed-legal-sources.sql']:
    assert Path('src/main/resources',f).exists(), f
csrf=Path('src/main/java/com/nyayaconnect/security/CsrfFilter.java').read_text()
assert 'import java.util.Set;' in csrf, 'CsrfFilter missing Set import'
booking=Path('src/main/java/com/nyayaconnect/appointment/AppointmentService.java').read_text()
assert 'select id from users where id=? for update' in booking, 'appointment booking is missing per-lawyer transaction lock'
auth=Path('src/main/java/com/nyayaconnect/security/AuthenticationFilter.java').read_text()
assert 'current.blocked()' in auth and 'session.invalidate()' in auth, 'blocked-session invalidation missing'
dbconfig=Path('src/main/java/com/nyayaconnect/config/DatabaseConfig.java').read_text()
assert 'sslMode=VERIFY_CA' in dbconfig and 'APP_ENV' in dbconfig, 'production DB TLS guard missing'
print('SEED_FILES_CHECK=PASS')
print('BOOKING_LOCK_SOURCE_CHECK=PASS')
print('BLOCKED_SESSION_SOURCE_CHECK=PASS')
print('PRODUCTION_DB_GUARD_SOURCE_CHECK=PASS')
init=Path('src/main/java/com/nyayaconnect/config/WebAppInitializer.java').read_text()
for token in ['bootstrap','appointment-action','document-download','document-intelligence','case-actions','admin-actions','notifications']:
    assert token in init, token
print('ROUTE_CHECK=PASS')
app=Path('../src/App.tsx').read_text()
assert '103.211.54.12' not in app
assert 'INITIAL_USERS' not in app
assert 'DemoPass123!' not in app
print('SECURITY_SOURCE_CHECK=PASS')
PY
