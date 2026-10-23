package com.nyayaconnect.security;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class PasswordServiceTest {
    private final PasswordService passwords = new PasswordService();

    @Test void hashesNeverEqualTheRawPassword() {
        String raw = "StrongDemoPassword!123";
        String hash = passwords.hash(raw);
        assertNotEquals(raw, hash);
        assertTrue(passwords.matches(raw, hash));
        assertFalse(passwords.matches("wrong-password", hash));
    }

    @Test void bcryptUsesAWorkFactorAtLeastTwelve() {
        String hash = passwords.hash("AnotherStrongPassword!123");
        assertTrue(hash.startsWith("$2a$12$") || hash.startsWith("$2b$12$") || hash.startsWith("$2y$12$"));
    }
}
