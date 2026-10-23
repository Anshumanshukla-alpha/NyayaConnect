package com.nyayaconnect.web;
import jakarta.servlet.*;import jakarta.servlet.http.*;import java.io.IOException;import java.util.UUID;
public class CorrelationIdFilter implements Filter {public static final String HEADER="X-Correlation-Id"; public void doFilter(ServletRequest q,ServletResponse p,FilterChain c)throws IOException,ServletException{HttpServletRequest r=(HttpServletRequest)q;HttpServletResponse s=(HttpServletResponse)p;String id=r.getHeader(HEADER);if(id==null||id.isBlank())id=UUID.randomUUID().toString();s.setHeader(HEADER,id);r.setAttribute(HEADER,id);c.doFilter(q,p);}}
