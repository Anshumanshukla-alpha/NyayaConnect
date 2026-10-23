package com.nyayaconnect.auth;
import com.nyayaconnect.common.Api;
import com.nyayaconnect.security.*;
import jakarta.servlet.http.*;
import java.io.IOException;
import java.util.Map;

public class MeServlet extends HttpServlet {
  protected void doGet(HttpServletRequest req,HttpServletResponse res)throws IOException{
    HttpSession s=req.getSession(false);
    Object u=s==null?null:s.getAttribute(AuthenticationFilter.SESSION_KEY);
    if(u==null){Api.error(res,401,"AUTH_REQUIRED","Not authenticated.");return;}
    Api.json(res,200,Map.of("user",u,"csrfToken",s.getAttribute(CsrfFilter.SESSION_KEY)));
  }
}
