
package com.nyayaconnect.web;

import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.FilterConfig;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.util.Set;

public class CorsFilter implements Filter {

   
private static final String ALLOWED_ORIGIN =
        "https://nyaya-connect-iota.vercel.app";

    private static final Set<String> ALLOWED_METHODS =
            Set.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS");

    private static final Set<String> ALLOWED_HEADERS =
            Set.of("content-type", "x-csrf-token");

    @Override
    public void doFilter(
            ServletRequest request,
            ServletResponse response,
            FilterChain chain
    ) throws IOException, ServletException {

        HttpServletRequest req = (HttpServletRequest) request;
        HttpServletResponse res = (HttpServletResponse) response;

        String origin = req.getHeader("Origin");

        if (ALLOWED_ORIGIN.equals(origin)) {
            res.setHeader("Access-Control-Allow-Origin", ALLOWED_ORIGIN);
            res.setHeader("Access-Control-Allow-Credentials", "true");
            res.setHeader("Vary", "Origin");
        }

        if ("OPTIONS".equalsIgnoreCase(req.getMethod())
                && origin != null) {

            if (!ALLOWED_ORIGIN.equals(origin)) {
                res.sendError(HttpServletResponse.SC_FORBIDDEN);
                return;
            }

            String requestedMethod =
                    req.getHeader("Access-Control-Request-Method");

            if (requestedMethod == null
                    || !ALLOWED_METHODS.contains(
                            requestedMethod.toUpperCase(java.util.Locale.ROOT))) {
                res.sendError(HttpServletResponse.SC_FORBIDDEN);
                return;
            }

            String requestedHeaders =
                    req.getHeader("Access-Control-Request-Headers");

            if (requestedHeaders != null) {
                for (String header : requestedHeaders.split(",")) {
                    if (!ALLOWED_HEADERS.contains(
                            header.trim().toLowerCase(java.util.Locale.ROOT))) {
                        res.sendError(HttpServletResponse.SC_FORBIDDEN);
                        return;
                    }
                }
            }

            res.setHeader(
                    "Access-Control-Allow-Methods",
                    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
            );
            res.setHeader(
                    "Access-Control-Allow-Headers",
                    "Content-Type, X-CSRF-Token"
            );
            res.setHeader("Access-Control-Max-Age", "600");
            res.setStatus(HttpServletResponse.SC_NO_CONTENT);
            return;
        }

        chain.doFilter(request, response);
    }

    @Override
    public void init(FilterConfig filterConfig) {
    }

    @Override
    public void destroy() {
    }
}
