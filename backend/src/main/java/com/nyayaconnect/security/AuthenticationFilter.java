package com.nyayaconnect.security;
import com.nyayaconnect.common.Api; import com.nyayaconnect.auth.SpringAccess; import com.nyayaconnect.user.User; import com.nyayaconnect.user.UserService; import jakarta.servlet.*; import jakarta.servlet.http.*; import java.io.IOException;
public class AuthenticationFilter implements Filter {
 public static final String SESSION_KEY="NYC_USER";
 public void doFilter(ServletRequest req,ServletResponse res,FilterChain chain)throws IOException,ServletException{
  HttpServletRequest r=(HttpServletRequest)req; HttpServletResponse s=(HttpServletResponse)res; String path=r.getRequestURI().substring(r.getContextPath().length());
  if(path.equals("/api/v1/auth/login")||path.equals("/api/v1/auth/register")||path.equals("/api/ai/triage")){chain.doFilter(req,res);return;}
  HttpSession session=r.getSession(false); Object user=session==null?null:session.getAttribute(SESSION_KEY);
  if(!(user instanceof SessionUser sessionUser)){Api.error(s,401,"AUTH_REQUIRED","Authentication is required.");return;}
  try {
   User current=SpringAccess.bean(r.getServletContext(),UserService.class).byId(sessionUser.id()).orElse(null);
   if(current==null||current.blocked()||current.role()!=sessionUser.role()){
    session.invalidate(); Api.error(s,401,"SESSION_INVALID","This session is no longer valid. Please sign in again.");return;
   }
  } catch (RuntimeException ex) { Api.error(s,503,"AUTH_CHECK_UNAVAILABLE","Authentication could not be verified. Please retry.");return; }
  chain.doFilter(req,res);
 }
}
