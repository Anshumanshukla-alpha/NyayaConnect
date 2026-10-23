package com.nyayaconnect.user;
import com.nyayaconnect.security.PasswordService;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service; import org.springframework.transaction.annotation.Transactional;
import java.util.*;
@Service public class UserService {
 private final UserDao dao; private final PasswordService passwords; private final JdbcTemplate db;
 public UserService(UserDao dao,PasswordService passwords,JdbcTemplate db){this.dao=dao;this.passwords=passwords;this.db=db;}
 @Transactional public UUID register(String name,String email,String password,UserRole role,String barCouncilNumber){if(password==null||password.length()<12)throw new IllegalArgumentException("Password must contain at least 12 characters.");if(dao.findByEmail(email).isPresent())throw new IllegalArgumentException("Email is already registered.");if(role==UserRole.LAWYER&&(barCouncilNumber==null||barCouncilNumber.isBlank()))throw new IllegalArgumentException("Bar Council registration number is required for lawyer onboarding.");UUID id=dao.insert(name,email,passwords.hash(password),role);if(role==UserRole.LAWYER){db.update("insert into lawyer_profiles(id,user_id,bar_council_number,verification_status) values(?,?,?,'PENDING')",UUID.randomUUID().toString(),id.toString(),barCouncilNumber.trim());}return id;}
 public User authenticate(String email,String password){User u=dao.findByEmail(email).orElseThrow(()->new SecurityException("Invalid credentials."));if(u.blocked()||!passwords.matches(password,u.passwordHash()))throw new SecurityException("Invalid credentials.");dao.updateLastLogin(u.id());return u;}
 public Optional<User> byId(UUID id){return dao.findById(id);}
}
