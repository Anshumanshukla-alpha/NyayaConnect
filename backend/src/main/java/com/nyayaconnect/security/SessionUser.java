package com.nyayaconnect.security;
import com.nyayaconnect.user.UserRole;
import java.util.UUID;
public record SessionUser(UUID id, String name, String email, UserRole role) {}
