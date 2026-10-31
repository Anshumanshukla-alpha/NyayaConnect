package com.nyayaconnect.config;

import com.nyayaconnect.security.AuthenticationFilter;
import com.nyayaconnect.web.CorrelationIdFilter;
import com.nyayaconnect.web.SecurityHeadersFilter;
import jakarta.servlet.DispatcherType;
import jakarta.servlet.FilterRegistration;
import jakarta.servlet.MultipartConfigElement;
import jakarta.servlet.ServletContext;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRegistration;
import org.springframework.web.context.ContextLoaderListener;
import org.springframework.web.context.support.AnnotationConfigWebApplicationContext;
import org.springframework.web.filter.CharacterEncodingFilter;

import java.util.EnumSet;

public class WebAppInitializer implements jakarta.servlet.ServletContainerInitializer {

@Override
public void onStartup(java.util.Set<Class<?>> c, ServletContext ctx)
        throws ServletException {

    AnnotationConfigWebApplicationContext root =
            new AnnotationConfigWebApplicationContext();
    root.register(AppConfig.class);
    ctx.addListener(new ContextLoaderListener(root));

    // Session cookie configuration
    jakarta.servlet.SessionCookieConfig sessionCookie =
            ctx.getSessionCookieConfig();
    sessionCookie.setHttpOnly(true);
    sessionCookie.setSecure(
            "production".equalsIgnoreCase(
                    System.getenv().getOrDefault("APP_ENV", "local")
            )
    );
    sessionCookie.setAttribute("SameSite", "None");
    sessionCookie.setMaxAge(1800);

    // Authentication endpoints
    add(ctx, "login", com.nyayaconnect.auth.LoginServlet.class,
            "/api/v1/auth/login");
    add(ctx, "register", com.nyayaconnect.auth.RegisterServlet.class,
            "/api/v1/auth/register");
    add(ctx, "logout", com.nyayaconnect.auth.LogoutServlet.class,
            "/api/v1/auth/logout");
    add(ctx, "me", com.nyayaconnect.auth.MeServlet.class,
            "/api/v1/auth/me");

    // AI endpoints
    add(ctx, "triage", com.nyayaconnect.ai.TriageServlet.class,
            "/api/ai/triage");
    add(ctx, "chat", com.nyayaconnect.ai.ChatServlet.class,
            "/api/ai/chat");
    add(ctx, "doc-summary", com.nyayaconnect.ai.DocumentSummaryServlet.class,
            "/api/ai/document-summary");
    add(ctx, "doc-intelligence",
            com.nyayaconnect.ai.DocumentIntelligenceServlet.class,
            "/api/ai/document-intelligence/*");
    add(ctx, "consultation-brief",
            com.nyayaconnect.ai.ConsultationBriefServlet.class,
            "/api/ai/consultation-brief");

    // Appointment endpoints
    add(ctx, "appointment",
            com.nyayaconnect.appointment.AppointmentServlet.class,
            "/api/v1/appointments");
    add(ctx, "appointment-action",
            com.nyayaconnect.appointment.AppointmentActionServlet.class,
            "/api/v1/appointments/*");

    // Document upload/download
    ServletRegistration.Dynamic upload = add(
            ctx,
            "document-upload",
            com.nyayaconnect.document.DocumentUploadServlet.class,
            "/api/v1/documents"
    );
    upload.setMultipartConfig(new MultipartConfigElement(
            System.getenv().getOrDefault("DOCUMENT_TMP_DIR", "./tmp"),
            10L * 1024 * 1024,
            12L * 1024 * 1024,
            1024 * 1024
    ));

    add(ctx, "document-download",
            com.nyayaconnect.document.DocumentDownloadServlet.class,
            "/api/v1/documents/*");
    add(ctx, "bootstrap", com.nyayaconnect.web.BootstrapServlet.class,
            "/api/v1/bootstrap");
    add(ctx, "case-actions",
            com.nyayaconnect.casemgmt.CaseActionServlet.class,
            "/api/v1/cases/*");
    add(ctx, "notifications",
            com.nyayaconnect.web.NotificationServlet.class,
            "/api/v1/notifications/*");
    add(ctx, "admin-actions",
            com.nyayaconnect.web.AdminActionServlet.class,
            "/api/v1/admin/*");
    add(ctx, "admin-dashboard",
            com.nyayaconnect.web.AdminDashboardServlet.class,
            "/admin/dashboard");

    // Health endpoints
    add(ctx, "health", com.nyayaconnect.health.HealthServlet.class,
            "/health");
    add(ctx, "readiness", com.nyayaconnect.health.ReadinessServlet.class,
            "/ready");

    // Register CORS before authentication and CSRF filters.
    addFilter(ctx, "cors",
            new com.nyayaconnect.web.CorsFilter(), "/*");

    // Character encoding
    FilterRegistration.Dynamic enc = ctx.addFilter(
            "encoding",
            new CharacterEncodingFilter("UTF-8", true)
    );
    enc.addMappingForUrlPatterns(
            EnumSet.of(DispatcherType.REQUEST), false, "/*"
    );

    // Application filters
    addFilter(ctx, "correlation", new CorrelationIdFilter(), "/*");
    addFilter(ctx, "headers", new SecurityHeadersFilter(), "/*");
    addFilter(ctx, "auth", new AuthenticationFilter(), "/api/*");
    addFilter(ctx, "csrf",
            new com.nyayaconnect.security.CsrfFilter(), "/api/*");
}

private ServletRegistration.Dynamic add(
        ServletContext c,
        String n,
        Class<? extends jakarta.servlet.Servlet> type,
        String mapping
) {
    ServletRegistration.Dynamic servlet = c.addServlet(n, type);
    servlet.setLoadOnStartup(1);
    servlet.addMapping(mapping);
    return servlet;
}

private void addFilter(
        ServletContext c,
        String n,
        jakarta.servlet.Filter filter,
        String mapping
) {
    FilterRegistration.Dynamic registration = c.addFilter(n, filter);
    registration.addMappingForUrlPatterns(
            EnumSet.of(DispatcherType.REQUEST), false, mapping
    );
}

}