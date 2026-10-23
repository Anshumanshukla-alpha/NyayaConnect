export interface JavaCodeSnippet {
  id: string;
  category: 'MAVEN' | 'SQL' | 'CONTROLLER' | 'SERVICE' | 'DAO' | 'FILTER' | 'CONFIG' | 'VIEW';
  fileName: string;
  filePath: string;
  description: string;
  code: string;
}

export const JAVA_PROJECT_FILES: JavaCodeSnippet[] = [
  {
    id: 'pom_xml',
    category: 'MAVEN',
    fileName: 'pom.xml',
    filePath: 'pom.xml',
    description: 'Maven Build Configuration with Spring Framework 6, Jakarta Servlet 6.0, MySQL 8.0, and HikariCP',
    code: `<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 
         http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.nyayaconnect</groupId>
    <artifactId>nyayaconnect-legal-platform</artifactId>
    <version>1.0.0-RELEASE</version>
    <packaging>war</packaging>

    <name>NyayaConnect Legal Platform</name>
    <description>AI-Powered Secure Legal Consultation and Case Management Platform</description>

    <properties>
        <maven.compiler.source>17</maven.compiler.source>
        <maven.compiler.target>17</maven.compiler.target>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
        <spring.version>6.1.4</spring.version>
        <jakarta.servlet.version>6.0.0</jakarta.servlet.version>
        <mysql.version>8.3.0</mysql.version>
        <hikaricp.version>5.1.0</hikaricp.version>
        <jackson.version>2.16.1</jackson.version>
        <slf4j.version>2.0.12</slf4j.version>
    </properties>

    <dependencies>
        <!-- Jakarta Servlet API for Apache Tomcat 10.1+ -->
        <dependency>
            <groupId>jakarta.servlet</groupId>
            <artifactId>jakarta.servlet-api</artifactId>
            <version>\${jakarta.servlet.version}</version>
            <scope>provided</scope>
        </dependency>

        <!-- Jakarta Standard Tag Library (JSTL 3.0) -->
        <dependency>
            <groupId>jakarta.servlet.jsp.jstl</groupId>
            <artifactId>jakarta.servlet.jsp.jstl-api</artifactId>
            <version>3.0.0</version>
        </dependency>
        <dependency>
            <groupId>org.glassfish.web</groupId>
            <artifactId>jakarta.servlet.jsp.jstl</artifactId>
            <version>3.0.1</version>
        </dependency>

        <!-- Spring Framework 6 Core & IoC / Context -->
        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-context</artifactId>
            <version>\${spring.version}</version>
        </dependency>
        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-web</artifactId>
            <version>\${spring.version}</version>
        </dependency>

        <!-- Spring JDBC & Transaction Management -->
        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-jdbc</artifactId>
            <version>\${spring.version}</version>
        </dependency>
        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-tx</artifactId>
            <version>\${spring.version}</version>
        </dependency>

        <!-- MySQL Connector/J -->
        <dependency>
            <groupId>com.mysql</groupId>
            <artifactId>mysql-connector-j</artifactId>
            <version>\${mysql.version}</version>
        </dependency>

        <!-- HikariCP Production Connection Pool -->
        <dependency>
            <groupId>com.zaxxer</groupId>
            <artifactId>HikariCP</artifactId>
            <version>\${hikaricp.version}</version>
        </dependency>

        <!-- Password Hashing (BCrypt) -->
        <dependency>
            <groupId>org.mindrot</groupId>
            <artifactId>jbcrypt</artifactId>
            <version>0.4</version>
        </dependency>

        <!-- Jackson JSON Parser -->
        <dependency>
            <groupId>com.fasterxml.jackson.core</groupId>
            <artifactId>jackson-databind</artifactId>
            <version>\${jackson.version}</version>
        </dependency>

        <!-- Logging (SLF4J + Logback) -->
        <dependency>
            <groupId>ch.qos.logback</groupId>
            <artifactId>logback-classic</artifactId>
            <version>1.4.14</version>
        </dependency>
    </dependencies>

    <build>
        <finalName>nyayaconnect</finalName>
        <plugins>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-war-plugin</artifactId>
                <version>3.4.0</version>
                <configuration>
                    <failOnMissingWebXml>false</failOnMissingWebXml>
                </configuration>
            </plugin>
        </plugins>
    </build>
</project>`
  },
  {
    id: 'schema_sql',
    category: 'SQL',
    fileName: 'schema.sql',
    filePath: 'src/main/resources/schema.sql',
    description: 'MySQL 8.0 Normalized Schema: 16 Relational Tables with Foreign Keys, Indexes & Constraints',
    code: `-- ========================================================
-- NYAYACONNECT: DATABASE SCHEMA (MySQL 8.0)
-- AI-Powered Legal Consultation & Case Management Platform
-- ========================================================

CREATE DATABASE IF NOT EXISTS nyayaconnect_db 
CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE nyayaconnect_db;

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    user_id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('CLIENT', 'LAWYER', 'ADMIN') NOT NULL DEFAULT 'CLIENT',
    phone VARCHAR(20) NOT NULL,
    city VARCHAR(80) NOT NULL,
    is_blocked BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_email (email),
    INDEX idx_user_role (role)
) ENGINE=InnoDB;

-- 2. LAWYER PROFILES TABLE
CREATE TABLE IF NOT EXISTS lawyer_profiles (
    lawyer_id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL UNIQUE,
    bar_council_number VARCHAR(60) NOT NULL UNIQUE,
    practice_areas TEXT NOT NULL, -- comma-separated or JSON
    experience_years INT NOT NULL DEFAULT 0,
    languages VARCHAR(255) NOT NULL,
    court_jurisdiction VARCHAR(150) NOT NULL,
    consultation_fee DECIMAL(10,2) NOT NULL DEFAULT 1000.00,
    rating DECIMAL(3,2) NOT NULL DEFAULT 5.00,
    review_count INT NOT NULL DEFAULT 0,
    verification_status ENUM('PENDING', 'UNDER_REVIEW', 'VERIFIED', 'REJECTED', 'SUSPENDED') NOT NULL DEFAULT 'PENDING',
    bio TEXT,
    education VARCHAR(255),
    bar_council_cert_path VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_lawyer_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_lawyer_status (verification_status),
    INDEX idx_lawyer_rating (rating)
) ENGINE=InnoDB;

-- 3. LAWYER AVAILABILITY SLOTS
CREATE TABLE IF NOT EXISTS lawyer_availability (
    slot_id VARCHAR(36) PRIMARY KEY,
    lawyer_id VARCHAR(36) NOT NULL,
    day_of_week VARCHAR(15) NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    CONSTRAINT fk_avail_lawyer FOREIGN KEY (lawyer_id) REFERENCES lawyer_profiles(lawyer_id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 4. APPOINTMENTS TABLE
CREATE TABLE IF NOT EXISTS appointments (
    appointment_id VARCHAR(36) PRIMARY KEY,
    client_id VARCHAR(36) NOT NULL,
    lawyer_id VARCHAR(36) NOT NULL,
    appointment_date DATE NOT NULL,
    time_slot VARCHAR(50) NOT NULL,
    legal_issue_title VARCHAR(200) NOT NULL,
    legal_category VARCHAR(100) NOT NULL,
    client_notes TEXT,
    status ENUM('PENDING', 'CONFIRMED', 'REJECTED', 'CANCELLED', 'COMPLETED', 'NO_SHOW') NOT NULL DEFAULT 'PENDING',
    meeting_link VARCHAR(255),
    meeting_room_id VARCHAR(100),
    lawyer_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_apt_client FOREIGN KEY (client_id) REFERENCES users(user_id) ON DELETE RESTRICT,
    CONSTRAINT fk_apt_lawyer FOREIGN KEY (lawyer_id) REFERENCES lawyer_profiles(lawyer_id) ON DELETE RESTRICT,
    INDEX idx_apt_date_status (appointment_date, status)
) ENGINE=InnoDB;

-- 5. CASES TABLE (Case Workspace)
CREATE TABLE IF NOT EXISTS cases (
    case_id VARCHAR(36) PRIMARY KEY,
    case_number VARCHAR(50) NOT NULL UNIQUE,
    cnr_number VARCHAR(25),
    title VARCHAR(200) NOT NULL,
    category VARCHAR(100) NOT NULL,
    client_id VARCHAR(36) NOT NULL,
    lawyer_id VARCHAR(36) NOT NULL,
    court_name VARCHAR(150),
    status ENUM('OPEN', 'ACTIVE', 'ON_HOLD', 'RESOLVED', 'CLOSED') NOT NULL DEFAULT 'OPEN',
    description TEXT,
    next_hearing_date DATE,
    origin_appointment_id VARCHAR(36),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_case_client FOREIGN KEY (client_id) REFERENCES users(user_id) ON DELETE RESTRICT,
    CONSTRAINT fk_case_lawyer FOREIGN KEY (lawyer_id) REFERENCES lawyer_profiles(lawyer_id) ON DELETE RESTRICT,
    CONSTRAINT fk_case_apt FOREIGN KEY (origin_appointment_id) REFERENCES appointments(appointment_id) ON DELETE SET NULL,
    INDEX idx_case_status (status)
) ENGINE=InnoDB;

-- 6. CASE TIMELINE TABLE
CREATE TABLE IF NOT EXISTS case_timeline (
    event_id VARCHAR(36) PRIMARY KEY,
    case_id VARCHAR(36) NOT NULL,
    event_date DATE NOT NULL,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    event_type ENUM('FILING', 'CONSULTATION', 'NOTICE', 'HEARING', 'SETTLEMENT', 'DOCUMENT') NOT NULL,
    created_by_user_id VARCHAR(36) NOT NULL,
    document_id VARCHAR(36),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_timeline_case FOREIGN KEY (case_id) REFERENCES cases(case_id) ON DELETE CASCADE,
    INDEX idx_timeline_date (event_date)
) ENGINE=InnoDB;

-- 7. DOCUMENTS TABLE (Secure Document Vault)
CREATE TABLE IF NOT EXISTS documents (
    document_id VARCHAR(36) PRIMARY KEY,
    case_id VARCHAR(36),
    appointment_id VARCHAR(36),
    original_file_name VARCHAR(255) NOT NULL,
    stored_safe_name VARCHAR(255) NOT NULL UNIQUE,
    file_path VARCHAR(500) NOT NULL,
    file_size_kb INT NOT NULL,
    file_type VARCHAR(100) NOT NULL,
    checksum_sha256 VARCHAR(64) NOT NULL,
    uploaded_by VARCHAR(36) NOT NULL,
    classification VARCHAR(100),
    ai_summary_json JSON,
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_doc_case FOREIGN KEY (case_id) REFERENCES cases(case_id) ON DELETE CASCADE,
    CONSTRAINT fk_doc_apt FOREIGN KEY (appointment_id) REFERENCES appointments(appointment_id) ON DELETE SET NULL,
    CONSTRAINT fk_doc_uploader FOREIGN KEY (uploaded_by) REFERENCES users(user_id)
) ENGINE=InnoDB;

-- 8. REVIEWS & RATINGS TABLE
CREATE TABLE IF NOT EXISTS reviews (
    review_id VARCHAR(36) PRIMARY KEY,
    appointment_id VARCHAR(36) NOT NULL UNIQUE,
    client_id VARCHAR(36) NOT NULL,
    lawyer_id VARCHAR(36) NOT NULL,
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_rev_apt FOREIGN KEY (appointment_id) REFERENCES appointments(appointment_id) ON DELETE CASCADE,
    CONSTRAINT fk_rev_client FOREIGN KEY (client_id) REFERENCES users(user_id),
    CONSTRAINT fk_rev_lawyer FOREIGN KEY (lawyer_id) REFERENCES lawyer_profiles(lawyer_id)
) ENGINE=InnoDB;

-- 9. AUDIT LOGS TABLE (Tamper-Evident Trail)
CREATE TABLE IF NOT EXISTS audit_logs (
    audit_id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36),
    user_role VARCHAR(20),
    user_name VARCHAR(120),
    action VARCHAR(100) NOT NULL,
    resource_accessed VARCHAR(255) NOT NULL,
    ip_address VARCHAR(45) NOT NULL,
    status ENUM('SUCCESS', 'DENIED', 'FLAGGED') NOT NULL DEFAULT 'SUCCESS',
    details TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_audit_time (created_at),
    INDEX idx_audit_action (action)
) ENGINE=InnoDB;

-- 10. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS notifications (
    notification_id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    title VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    action_link VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_notif_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_notif_user_read (user_id, is_read)
) ENGINE=InnoDB;

-- 11. USER CONSENTS TABLE (DPDP Act Compliance)
CREATE TABLE IF NOT EXISTS consents (
    consent_id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    consent_type VARCHAR(100) NOT NULL,
    granted BOOLEAN NOT NULL DEFAULT TRUE,
    purpose TEXT NOT NULL,
    ip_address VARCHAR(45) NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_consent_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
) ENGINE=InnoDB;`
  },
  {
    id: 'client_dashboard_servlet',
    category: 'CONTROLLER',
    fileName: 'ClientDashboardServlet.java',
    filePath: 'src/main/java/com/nyayaconnect/controller/ClientDashboardServlet.java',
    description: 'Controller consolidating active cases, upcoming appointments, and documents for the client dashboard',
    code: `package com.nyayaconnect.controller;

import com.nyayaconnect.model.Appointment;
import com.nyayaconnect.model.CaseWorkspace;
import com.nyayaconnect.model.Document;
import com.nyayaconnect.service.AppointmentService;
import com.nyayaconnect.service.CaseService;
import com.nyayaconnect.service.DocumentService;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.context.support.WebApplicationContextUtils;

import java.io.IOException;
import java.util.List;

/**
 * Controller: Client Dashboard Aggregator
 * Demonstrates: Session validation, multi-service delegation (CaseService,
 * AppointmentService, DocumentService), model preparation, and dispatch to JSP view.
 */
@WebServlet(name = "ClientDashboardServlet", urlPatterns = {"/client/dashboard"})
public class ClientDashboardServlet extends HttpServlet {

    private CaseService caseService;
    private AppointmentService appointmentService;
    private DocumentService documentService;

    @Override
    public void init() throws ServletException {
        super.init();
        WebApplicationContext ctx = WebApplicationContextUtils
                .getRequiredWebApplicationContext(getServletContext());
        this.caseService = ctx.getBean(CaseService.class);
        this.appointmentService = ctx.getBean(AppointmentService.class);
        this.documentService = ctx.getBean(DocumentService.class);
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("userId") == null) {
            response.sendRedirect(request.getContextPath() + "/login?error=session_expired");
            return;
        }

        String clientId = (String) session.getAttribute("userId");

        // 1. Fetch Client's Active Cases
        List<CaseWorkspace> activeCases = caseService.getCasesByClientId(clientId);
        request.setAttribute("activeCases", activeCases);

        // 2. Fetch Upcoming and Pending Appointments
        List<Appointment> appointments = appointmentService.getAppointmentsByClientId(clientId);
        request.setAttribute("appointments", appointments);

        // 3. Fetch Recent Case Evidence Documents
        List<Document> documents = documentService.getDocumentsByClientId(clientId);
        request.setAttribute("recentDocuments", documents);

        // Forward to Consolidated Client Dashboard JSP View
        request.getRequestDispatcher("/WEB-INF/views/client/dashboard.jsp")
               .forward(request, response);
    }
}
`,
  },
  {
    id: 'user_profile_servlet',
    category: 'CONTROLLER',
    fileName: 'UserProfileServlet.java',
    filePath: 'src/main/java/com/nyayaconnect/controller/UserProfileServlet.java',
    description: 'Controller handling client contact updates, notification preferences, and BCrypt password hashing',
    code: `package com.nyayaconnect.controller;

import com.nyayaconnect.model.User;
import com.nyayaconnect.service.AuditService;
import com.nyayaconnect.service.UserService;
import com.nyayaconnect.util.PasswordUtil;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.context.support.WebApplicationContextUtils;

import java.io.IOException;

/**
 * Controller: Client Profile & Security Management
 * Handles: Contact info updates, notification preferences, and BCrypt salted password changes.
 */
@WebServlet(name = "UserProfileServlet", urlPatterns = {"/client/profile", "/client/profile/update", "/client/security/password"})
public class UserProfileServlet extends HttpServlet {

    private UserService userService;
    private AuditService auditService;

    @Override
    public void init() throws ServletException {
        super.init();
        WebApplicationContext ctx = WebApplicationContextUtils
                .getRequiredWebApplicationContext(getServletContext());
        this.userService = ctx.getBean(UserService.class);
        this.auditService = ctx.getBean(AuditService.class);
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("userId") == null) {
            response.sendRedirect(request.getContextPath() + "/login?error=auth_required");
            return;
        }

        String userId = (String) session.getAttribute("userId");
        User user = userService.getUserById(userId);
        request.setAttribute("user", user);

        request.getRequestDispatcher("/WEB-INF/views/client/profile.jsp")
               .forward(request, response);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("userId") == null) {
            response.sendRedirect(request.getContextPath() + "/login?error=session_expired");
            return;
        }

        String userId = (String) session.getAttribute("userId");
        String path = request.getServletPath();

        if ("/client/security/password".equals(path)) {
            // Handle Password Change with BCrypt Hashing
            String currentPassword = request.getParameter("currentPassword");
            String newPassword = request.getParameter("newPassword");

            boolean success = userService.changePassword(userId, currentPassword, newPassword);
            if (success) {
                auditService.logSecurityEvent(userId, "PASSWORD_UPDATE_SUCCESS", request.getRemoteAddr());
                response.sendRedirect(request.getContextPath() + "/client/profile?success=password_updated");
            } else {
                request.setAttribute("errorMessage", "Current password does not match records.");
                request.getRequestDispatcher("/WEB-INF/views/client/profile.jsp").forward(request, response);
            }
        } else {
            // Handle Contact & Notification Preference Updates
            String name = request.getParameter("name");
            String phone = request.getParameter("phone");
            String city = request.getParameter("city");
            String address = request.getParameter("address");

            User updated = new User();
            updated.setId(userId);
            updated.setName(name);
            updated.setPhone(phone);
            updated.setCity(city);
            updated.setAddress(address);

            userService.updateUserProfile(updated);
            auditService.logSecurityEvent(userId, "PROFILE_CONTACT_UPDATE", request.getRemoteAddr());

            response.sendRedirect(request.getContextPath() + "/client/profile?success=profile_saved");
        }
    }
}
`,
  },
  {
    id: 'book_apt_servlet',
    category: 'CONTROLLER',
    fileName: 'BookAppointmentServlet.java',
    filePath: 'src/main/java/com/nyayaconnect/controller/BookAppointmentServlet.java',
    description: 'Controller handling appointment creation, session validation & Spring service delegation',
    code: `package com.nyayaconnect.controller;

import com.nyayaconnect.dto.AppointmentRequestDTO;
import com.nyayaconnect.model.Appointment;
import com.nyayaconnect.service.AppointmentService;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.context.support.WebApplicationContextUtils;

import java.io.IOException;
import java.time.LocalDate;

/**
 * Controller: Handles appointment booking requests.
 * Demonstrates: Jakarta Servlet API, Session validation, Spring Dependency Lookup,
 * DTO data binding, Error handling, and MVC forwarding.
 */
@WebServlet(name = "BookAppointmentServlet", urlPatterns = {"/client/book-appointment"})
public class BookAppointmentServlet extends HttpServlet {

    private AppointmentService appointmentService;

    @Override
    public void init() throws ServletException {
        super.init();
        // Retrieve Spring ApplicationContext from ServletContext
        WebApplicationContext ctx = WebApplicationContextUtils
                .getRequiredWebApplicationContext(getServletContext());
        this.appointmentService = ctx.getBean(AppointmentService.class);
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        String lawyerId = request.getParameter("lawyerId");
        if (lawyerId == null || lawyerId.trim().isEmpty()) {
            response.sendRedirect(request.getContextPath() + "/lawyers");
            return;
        }
        request.setAttribute("selectedLawyerId", lawyerId);
        request.getRequestDispatcher("/WEB-INF/views/appointment/book-appointment.jsp")
               .forward(request, response);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("userId") == null) {
            response.sendRedirect(request.getContextPath() + "/login?error=session_expired");
            return;
        }

        String clientId = (String) session.getAttribute("userId");
        String lawyerId = request.getParameter("lawyerId");
        String dateStr = request.getParameter("appointmentDate");
        String timeSlot = request.getParameter("timeSlot");
        String issueTitle = request.getParameter("issueTitle");
        String category = request.getParameter("category");
        String clientNotes = request.getParameter("clientNotes");

        // Server-Side Input Validation
        if (lawyerId == null || dateStr == null || timeSlot == null || issueTitle == null) {
            request.setAttribute("errorMessage", "All required fields must be filled.");
            request.getRequestDispatcher("/WEB-INF/views/appointment/book-appointment.jsp")
                   .forward(request, response);
            return;
        }

        try {
            AppointmentRequestDTO dto = new AppointmentRequestDTO();
            dto.setClientId(clientId);
            dto.setLawyerId(lawyerId);
            dto.setAppointmentDate(LocalDate.parse(dateStr));
            dto.setTimeSlot(timeSlot);
            dto.setLegalIssueTitle(issueTitle.trim());
            dto.setLegalCategory(category != null ? category.trim() : "General Civil");
            dto.setClientNotes(clientNotes != null ? clientNotes.trim() : "");

            // Delegate core business rules to Spring Service layer
            Appointment appointment = appointmentService.createAppointment(dto);

            // Redirect with success attribute
            response.sendRedirect(request.getContextPath() + 
                    "/client/appointments?success=booked&id=" + appointment.getId());

        } catch (IllegalArgumentException e) {
            request.setAttribute("errorMessage", e.getMessage());
            request.getRequestDispatcher("/WEB-INF/views/appointment/book-appointment.jsp")
                   .forward(request, response);
        } catch (Exception e) {
            log("Error booking appointment", e);
            request.setAttribute("errorMessage", "An internal error occurred. Please try again.");
            request.getRequestDispatcher("/WEB-INF/views/appointment/book-appointment.jsp")
                   .forward(request, response);
        }
    }
}`
  },
  {
    id: 'apt_service_impl',
    category: 'SERVICE',
    fileName: 'AppointmentServiceImpl.java',
    filePath: 'src/main/java/com/nyayaconnect/service/impl/AppointmentServiceImpl.java',
    description: 'Spring Service implementation with business rules, transaction boundary & video generation',
    code: `package com.nyayaconnect.service.impl;

import com.nyayaconnect.dao.AppointmentDAO;
import com.nyayaconnect.dao.AuditDAO;
import com.nyayaconnect.dao.LawyerDAO;
import com.nyayaconnect.dto.AppointmentRequestDTO;
import com.nyayaconnect.model.Appointment;
import com.nyayaconnect.model.AppointmentStatus;
import com.nyayaconnect.model.LawyerProfile;
import com.nyayaconnect.service.AppointmentService;
import com.nyayaconnect.service.NotificationService;
import com.nyayaconnect.service.VideoMeetingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

/**
 * Spring Service Component: Implements business rules for appointments.
 * Demonstrates: Dependency Injection (@Autowired), Declarative Transactions (@Transactional),
 * and Multi-DAO orchestration.
 */
@Service
public class AppointmentServiceImpl implements AppointmentService {

    private final AppointmentDAO appointmentDAO;
    private final LawyerDAO lawyerDAO;
    private final NotificationService notificationService;
    private final VideoMeetingService videoMeetingService;
    private final AuditDAO auditDAO;

    @Autowired
    public AppointmentServiceImpl(AppointmentDAO appointmentDAO,
                                  LawyerDAO lawyerDAO,
                                  NotificationService notificationService,
                                  VideoMeetingService videoMeetingService,
                                  AuditDAO auditDAO) {
        this.appointmentDAO = appointmentDAO;
        this.lawyerDAO = lawyerDAO;
        this.notificationService = notificationService;
        this.videoMeetingService = videoMeetingService;
        this.auditDAO = auditDAO;
    }

    @Override
    @Transactional
    public Appointment createAppointment(AppointmentRequestDTO dto) {
        // Business Rule 1: Verify lawyer exists and is officially verified
        LawyerProfile lawyer = lawyerDAO.findById(dto.getLawyerId());
        if (lawyer == null) {
            throw new IllegalArgumentException("Target lawyer profile not found.");
        }
        if (!"VERIFIED".equals(lawyer.getVerificationStatus())) {
            throw new IllegalStateException("Consultations can only be booked with verified advocates.");
        }

        // Business Rule 2: Ensure slot is not double booked
        boolean slotOccupied = appointmentDAO.isSlotBooked(
                dto.getLawyerId(), dto.getAppointmentDate(), dto.getTimeSlot()
        );
        if (slotOccupied) {
            throw new IllegalArgumentException("This appointment slot has already been reserved.");
        }

        // Assemble Model
        Appointment appointment = new Appointment();
        appointment.setId(UUID.randomUUID().toString());
        appointment.setClientId(dto.getClientId());
        appointment.setLawyerId(dto.getLawyerId());
        appointment.setAppointmentDate(dto.getAppointmentDate());
        appointment.setTimeSlot(dto.getTimeSlot());
        appointment.setLegalIssueTitle(dto.getLegalIssueTitle());
        appointment.setLegalCategory(dto.getLegalCategory());
        appointment.setClientNotes(dto.getClientNotes());
        appointment.setStatus(AppointmentStatus.PENDING);

        // Persist via DAO
        appointmentDAO.save(appointment);

        // Notify Lawyer
        notificationService.sendNotification(
                lawyer.getUserId(),
                "New Consultation Request",
                "You have a new consultation request for: " + dto.getLegalIssueTitle(),
                "/lawyer/appointments"
        );

        return appointment;
    }

    @Override
    @Transactional
    public boolean acceptAppointment(String appointmentId, String lawyerUserId) {
        Appointment apt = appointmentDAO.findById(appointmentId);
        if (apt == null) {
            throw new IllegalArgumentException("Appointment not found.");
        }

        // Generate Secure Jitsi Video Meeting Link
        String roomId = "NyayaConnect-" + UUID.randomUUID().toString().substring(0, 8);
        String meetingLink = videoMeetingService.createMeetingLink(roomId);

        // Update Appointment State atomically
        apt.setStatus(AppointmentStatus.CONFIRMED);
        apt.setMeetingLink(meetingLink);
        appointmentDAO.update(apt);

        // Send confirmation alert to Client
        notificationService.sendNotification(
                apt.getClientId(),
                "Consultation Confirmed",
                "Your advocate accepted your consultation. Video link has been generated.",
                "/client/appointments"
        );

        return true;
    }
}`
  },
  {
    id: 'apt_dao_impl',
    category: 'DAO',
    fileName: 'AppointmentDAOImpl.java',
    filePath: 'src/main/java/com/nyayaconnect/dao/impl/AppointmentDAOImpl.java',
    description: 'Data Access Object using Spring JdbcTemplate with parameterized queries',
    code: `package com.nyayaconnect.dao.impl;

import com.nyayaconnect.dao.AppointmentDAO;
import com.nyayaconnect.model.Appointment;
import com.nyayaconnect.model.AppointmentStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDate;
import java.util.List;

/**
 * DAO Pattern Implementation using Spring JdbcTemplate.
 * Parameterized SQL completely eliminates SQL Injection vulnerabilities.
 */
@Repository
public class AppointmentDAOImpl implements AppointmentDAO {

    private final JdbcTemplate jdbcTemplate;

    @Autowired
    public AppointmentDAOImpl(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private static final class AppointmentRowMapper implements RowMapper<Appointment> {
        @Override
        public Appointment mapRow(ResultSet rs, int rowNum) throws SQLException {
            Appointment apt = new Appointment();
            apt.setId(rs.getString("appointment_id"));
            apt.setClientId(rs.getString("client_id"));
            apt.setLawyerId(rs.getString("lawyer_id"));
            apt.setAppointmentDate(rs.getDate("appointment_date").toLocalDate());
            apt.setTimeSlot(rs.getString("time_slot"));
            apt.setLegalIssueTitle(rs.getString("legal_issue_title"));
            apt.setLegalCategory(rs.getString("legal_category"));
            apt.setClientNotes(rs.getString("client_notes"));
            apt.setStatus(AppointmentStatus.valueOf(rs.getString("status")));
            apt.setMeetingLink(rs.getString("meeting_link"));
            apt.setLawyerNotes(rs.getString("lawyer_notes"));
            return apt;
        }
    }

    @Override
    public int save(Appointment a) {
        String sql = "INSERT INTO appointments (appointment_id, client_id, lawyer_id, " +
                     "appointment_date, time_slot, legal_issue_title, legal_category, " +
                     "client_notes, status, meeting_link) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        return jdbcTemplate.update(sql,
                a.getId(),
                a.getClientId(),
                a.getLawyerId(),
                java.sql.Date.valueOf(a.getAppointmentDate()),
                a.getTimeSlot(),
                a.getLegalIssueTitle(),
                a.getLegalCategory(),
                a.getClientNotes(),
                a.getStatus().name(),
                a.getMeetingLink()
        );
    }

    @Override
    public Appointment findById(String appointmentId) {
        String sql = "SELECT * FROM appointments WHERE appointment_id = ?";
        List<Appointment> list = jdbcTemplate.query(sql, new AppointmentRowMapper(), appointmentId);
        return list.isEmpty() ? null : list.get(0);
    }

    @Override
    public boolean isSlotBooked(String lawyerId, LocalDate date, String timeSlot) {
        String sql = "SELECT COUNT(*) FROM appointments WHERE lawyer_id = ? " +
                     "AND appointment_date = ? AND time_slot = ? " +
                     "AND status IN ('PENDING', 'CONFIRMED')";
        Integer count = jdbcTemplate.queryForObject(sql, Integer.class,
                lawyerId, java.sql.Date.valueOf(date), timeSlot);
        return count != null && count > 0;
    }
}`
  },
  {
    id: 'auth_filter',
    category: 'FILTER',
    fileName: 'AuthorizationFilter.java',
    filePath: 'src/main/java/com/nyayaconnect/filter/AuthorizationFilter.java',
    description: 'Jakarta Servlet Filter enforcing server-side Role-Based Access Control (RBAC)',
    code: `package com.nyayaconnect.filter;

import jakarta.servlet.*;
import jakarta.servlet.annotation.WebFilter;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import java.io.IOException;

/**
 * Servlet Filter: Enforces strict Role-Based Access Control (RBAC).
 * Prevents unauthorized URL access regardless of frontend presentation.
 */
@WebFilter(filterName = "AuthorizationFilter", urlPatterns = {"/admin/*", "/lawyer/*", "/client/*"})
public class AuthorizationFilter implements Filter {

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        HttpServletRequest req = (HttpServletRequest) request;
        HttpServletResponse res = (HttpServletResponse) response;
        HttpSession session = req.getSession(false);

        String uri = req.getRequestURI();
        String contextPath = req.getContextPath();
        String path = uri.substring(contextPath.length());

        if (session == null || session.getAttribute("userRole") == null) {
            res.sendRedirect(contextPath + "/login?error=auth_required");
            return;
        }

        String role = (String) session.getAttribute("userRole");

        // Admin Isolation
        if (path.startsWith("/admin/") && !"ADMIN".equals(role)) {
            res.sendError(HttpServletResponse.SC_FORBIDDEN, "Access Denied: Administrator role required.");
            return;
        }

        // Lawyer Isolation
        if (path.startsWith("/lawyer/") && !"LAWYER".equals(role)) {
            res.sendError(HttpServletResponse.SC_FORBIDDEN, "Access Denied: Advocate credentials required.");
            return;
        }

        // Client Isolation
        if (path.startsWith("/client/") && !"CLIENT".equals(role)) {
            res.sendError(HttpServletResponse.SC_FORBIDDEN, "Access Denied: Client role required.");
            return;
        }

        // Authorized: Proceed down filter chain
        chain.doFilter(request, response);
    }
}`
  },
  {
    id: 'matching_service',
    category: 'SERVICE',
    fileName: 'LawyerMatchingService.java',
    filePath: 'src/main/java/com/nyayaconnect/service/LawyerMatchingService.java',
    description: 'Deterministic Multi-Factor Lawyer Matching Algorithm (Platform Match Score)',
    code: `package com.nyayaconnect.service;

import com.nyayaconnect.model.LawyerProfile;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Deterministic Scoring Engine for Lawyer Discovery.
 * Evaluator Principle: Deterministic mathematical scoring, NOT opaque LLM hallucinations.
 * Formula:
 * - Practice Area Match: 30%
 * - Experience Depth: 20%
 * - Court / Location: 15%
 * - Language Synergy: 10%
 * - Slot Availability: 10%
 * - Fee / Budget: 10%
 * - Client Rating: 5%
 */
@Service
public class LawyerMatchingService {

    public int calculatePlatformMatchScore(LawyerProfile lawyer, 
                                          String practiceArea, 
                                          String city, 
                                          String language,
                                          double maxBudget) {
        double score = 0.0;

        // 1. Practice Area (30 points)
        if (lawyer.getPracticeAreas() != null && lawyer.getPracticeAreas().contains(practiceArea)) {
            score += 30.0;
        }

        // 2. Experience (20 points, scaled to 15+ years max)
        double expScore = Math.min(lawyer.getExperienceYears() / 15.0, 1.0) * 20.0;
        score += expScore;

        // 3. Location / Court Match (15 points)
        if (lawyer.getCity() != null && lawyer.getCity().equalsIgnoreCase(city)) {
            score += 15.0;
        } else {
            score += 5.0; // partial for nearby jurisdiction
        }

        // 4. Language Compatibility (10 points)
        if (lawyer.getLanguages() != null && lawyer.getLanguages().contains(language)) {
            score += 10.0;
        }

        // 5. Availability (10 points)
        if ("VERIFIED".equals(lawyer.getVerificationStatus())) {
            score += 10.0;
        }

        // 6. Fee within budget (10 points)
        if (maxBudget <= 0 || lawyer.getConsultationFee() <= maxBudget) {
            score += 10.0;
        } else {
            score += 3.0;
        }

        // 7. Rating (5 points, 5.0 rating = 5 points)
        score += (lawyer.getRating() / 5.0) * 5.0;

        return (int) Math.round(Math.min(score, 99.0));
    }
}`
  },
  {
    id: 'spring_config',
    category: 'CONFIG',
    fileName: 'DatabaseConfig.java',
    filePath: 'src/main/java/com/nyayaconnect/config/DatabaseConfig.java',
    description: 'Spring 6 Java Configuration defining HikariDataSource and JdbcTemplate Beans',
    code: `package com.nyayaconnect.config;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.datasource.DataSourceTransactionManager;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import javax.sql.DataSource;

@Configuration
@EnableTransactionManagement
public class DatabaseConfig {

    @Bean
    public DataSource dataSource() {
        HikariConfig config = new HikariConfig();
        config.setJdbcUrl("jdbc:mysql://localhost:3306/nyayaconnect_db?useSSL=false&serverTimezone=UTC");
        config.setUsername(System.getenv().getOrDefault("DB_USER", "nyaya_user"));
        config.setPassword(System.getenv().getOrDefault("DB_PASS", "nyaya_pass_2026"));
        config.setDriverClassName("com.mysql.cj.jdbc.Driver");
        config.setMaximumPoolSize(20);
        config.setMinimumIdle(5);
        config.setConnectionTimeout(30000);
        config.setIdleTimeout(600000);
        return new HikariDataSource(config);
    }

    @Bean
    public JdbcTemplate jdbcTemplate(DataSource dataSource) {
        return new JdbcTemplate(dataSource);
    }

    @Bean
    public PlatformTransactionManager transactionManager(DataSource dataSource) {
        return new DataSourceTransactionManager(dataSource);
    }
}`
  }
];

export const VIVA_QUESTIONS = [
  { question: "Why does NyayaConnect use Jakarta Servlets + Spring 6 instead of a single framework?", answer: "Servlets remain the HTTP/controller boundary required by the academic Advanced Java architecture. Spring manages dependency injection, services and transactions, while JdbcTemplate/DAO handles persistence. This preserves the requested stack while keeping responsibilities separated." },
  { question: "How is authentication enforced?", answer: "Login creates a server-side HttpSession containing a SessionUser. AuthenticationFilter protects /api/* endpoints, while CSRF protection checks a per-session token for state-changing requests. The browser cannot change its role by editing React state." },
  { question: "How is authorization enforced for a case?", answer: "CaseAccessService checks the authenticated user against the case client_id or lawyer_id, with administrator access handled explicitly. Document download and upload call this service before touching private storage." },
  { question: "How does appointment double-booking prevention work?", answer: "AppointmentService validates the requested interval, verifies that the lawyer is currently verified, checks overlapping REQUESTED/PENDING/CONFIRMED appointments, then creates the booking inside a Spring transaction." },
  { question: "Why is AI not allowed to invent legal answers?", answer: "Triage and chat expose sourceVerified/citation information. If the verified legal-source index cannot support an answer, the backend returns a safe limitation instead of pretending that an LLM or classifier is authoritative legal advice." },
  { question: "How is document security implemented?", answer: "Uploads are multipart-limited, MIME-checked and magic-byte checked for supported binary formats. Files are stored outside the public web directory, linked to a case, hashed with SHA-256, versioned in MySQL and protected by server-side case authorization." },
  { question: "What makes the project modern without turning it into microservices?", answer: "NyayaConnect is a modular monolith. Authentication, cases, appointments, documents, AI, notifications, payments and audit concerns are separated into Java packages/services while sharing a controlled MySQL persistence boundary. This is easier to deploy and defend academically than unnecessary microservices." },
  { question: "What should still happen before commercial production?", answer: "Use real secrets and HTTPS, remove demo seed credentials, establish a governed legal-source refresh process, add malware scanning, complete dependency/SBOM and penetration testing, configure production monitoring and independently review legal/privacy/compliance claims." }
];
