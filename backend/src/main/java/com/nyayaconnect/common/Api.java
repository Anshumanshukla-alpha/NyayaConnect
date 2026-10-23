package com.nyayaconnect.common;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Map;
public final class Api {
  private Api() {}
  public static void json(HttpServletResponse response, int status, Object body) throws IOException {
    response.setStatus(status); response.setContentType("application/json"); response.setCharacterEncoding("UTF-8");
    Json.MAPPER.writeValue(response.getWriter(), body);
  }
  public static void error(HttpServletResponse response, int status, String code, String message) throws IOException {
    json(response, status, Map.of("error", Map.of("code", code, "message", message)));
  }
}
