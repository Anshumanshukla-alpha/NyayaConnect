package com.nyayaconnect.auth;
import com.nyayaconnect.common.Api; import jakarta.servlet.http.*; import java.io.IOException; import java.util.Map;
public class LogoutServlet extends HttpServlet {protected void doPost(HttpServletRequest req,HttpServletResponse res)throws IOException{HttpSession s=req.getSession(false);if(s!=null)s.invalidate();Api.json(res,200,Map.of("message","Logged out."));}}
