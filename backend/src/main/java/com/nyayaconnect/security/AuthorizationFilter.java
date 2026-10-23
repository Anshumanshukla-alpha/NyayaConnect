package com.nyayaconnect.security;
import com.nyayaconnect.user.UserRole;
public final class AuthorizationFilter {
 private AuthorizationFilter(){}
 public static boolean role(SessionUser u,UserRole... allowed){if(u==null)return false;for(UserRole r:allowed)if(u.role()==r)return true;return false;}
 public static boolean owns(SessionUser u,java.util.UUID owner){return u!=null&&u.id().equals(owner);}
}
