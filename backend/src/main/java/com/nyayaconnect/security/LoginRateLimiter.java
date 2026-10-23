package com.nyayaconnect.security;

import java.time.Duration;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

/** Best-effort per-process login throttle; production deployments should also rate-limit at the edge. */
public final class LoginRateLimiter {
  private static final int MAX_FAILURES = 10;
  private static final long WINDOW_NANOS = Duration.ofMinutes(15).toNanos();
  private static final ConcurrentHashMap<String, Window> WINDOWS = new ConcurrentHashMap<>();
  private LoginRateLimiter() {}
  public static boolean isLimited(String key) {
    Window w = WINDOWS.get(key);
    if (w == null) return false;
    if (System.nanoTime() - w.startedAt >= WINDOW_NANOS) { WINDOWS.remove(key, w); return false; }
    return w.failures.get() >= MAX_FAILURES;
  }
  public static void failure(String key) {
    long now = System.nanoTime();
    if (WINDOWS.size() >= 10000) WINDOWS.entrySet().removeIf(e -> now - e.getValue().startedAt >= WINDOW_NANOS);
    // Avoid unbounded memory growth. At capacity, edge-level rate limiting is required for new keys.
    if (WINDOWS.size() >= 10000 && !WINDOWS.containsKey(key)) return;
    WINDOWS.compute(key, (k, old) -> {
      if (old == null || now - old.startedAt >= WINDOW_NANOS) return new Window(now, 1);
      old.failures.incrementAndGet(); return old;
    });
  }
  public static void success(String key) { WINDOWS.remove(key); }
  private static final class Window { final long startedAt; final AtomicInteger failures; Window(long start, int count) { startedAt=start; failures=new AtomicInteger(count); } }
}
