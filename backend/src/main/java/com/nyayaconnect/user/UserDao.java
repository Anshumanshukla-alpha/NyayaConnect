package com.nyayaconnect.user;
import java.util.*;
public interface UserDao { Optional<User> findByEmail(String email); Optional<User> findById(UUID id); UUID insert(String name,String email,String passwordHash,UserRole role); void updateLastLogin(UUID id); }
