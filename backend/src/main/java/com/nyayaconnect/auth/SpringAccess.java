package com.nyayaconnect.auth;
import jakarta.servlet.ServletContext; import org.springframework.web.context.WebApplicationContext; import org.springframework.web.context.support.WebApplicationContextUtils;
public final class SpringAccess {private SpringAccess(){} public static <T>T bean(ServletContext c,Class<T> type){WebApplicationContext w=WebApplicationContextUtils.getRequiredWebApplicationContext(c);return w.getBean(type);}}
