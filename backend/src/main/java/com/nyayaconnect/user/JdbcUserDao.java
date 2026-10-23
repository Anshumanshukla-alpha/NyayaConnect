package com.nyayaconnect.user;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import java.sql.Timestamp; import java.util.*;
@Repository
public class JdbcUserDao implements UserDao {
 private final JdbcTemplate jdbc; public JdbcUserDao(JdbcTemplate jdbc){this.jdbc=jdbc;}
 private User map(java.sql.ResultSet rs,int n)throws java.sql.SQLException{return new User(UUID.fromString(rs.getString("id")),rs.getString("name"),rs.getString("email"),rs.getString("password_hash"),UserRole.valueOf(rs.getString("role")),rs.getBoolean("blocked"),rs.getTimestamp("last_login")==null?null:rs.getTimestamp("last_login").toInstant());}
 public Optional<User> findByEmail(String e){return jdbc.query("select id,name,email,password_hash,role,blocked,last_login from users where email=?",this::map,e).stream().findFirst();}
 public Optional<User> findById(UUID id){return jdbc.query("select id,name,email,password_hash,role,blocked,last_login from users where id=?",this::map,id.toString()).stream().findFirst();}
 public UUID insert(String n,String e,String p,UserRole r){UUID id=UUID.randomUUID();jdbc.update("insert into users(id,name,email,password_hash,role,blocked) values(?,?,?,?,?,false)",id.toString(),n,e,p,r.name());return id;}
 public void updateLastLogin(UUID id){jdbc.update("update users set last_login=? where id=?",Timestamp.from(java.time.Instant.now()),id.toString());}
}
