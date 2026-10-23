package com.nyayaconnect.security;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class LoginRateLimiterTest {
  @Test void limitsAfterTenFailuresAndClearsOnSuccess() {
    String key = "test-login-rate-limit";
    LoginRateLimiter.success(key);
    assertFalse(LoginRateLimiter.isLimited(key));
    for (int i = 0; i < 10; i++) LoginRateLimiter.failure(key);
    assertTrue(LoginRateLimiter.isLimited(key));
    LoginRateLimiter.success(key);
    assertFalse(LoginRateLimiter.isLimited(key));
  }
}
