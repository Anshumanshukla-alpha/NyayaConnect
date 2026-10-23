package com.nyayaconnect.user;
import java.time.Instant;
import java.util.UUID;
public record User(UUID id, String name, String email, String passwordHash, UserRole role, boolean blocked, Instant lastLogin) {}
