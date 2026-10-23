package com.nyayaconnect.security;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
@Service
public class PasswordService {
  private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);
  public String hash(String raw) { return encoder.encode(raw); }
  public boolean matches(String raw, String hash) { return encoder.matches(raw, hash); }
}
