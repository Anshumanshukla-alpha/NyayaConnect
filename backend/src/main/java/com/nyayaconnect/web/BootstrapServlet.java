package com.nyayaconnect.web;

import com.nyayaconnect.auth.SpringAccess;
import com.nyayaconnect.common.Api;
import com.nyayaconnect.security.AuthenticationFilter;
import com.nyayaconnect.security.SessionUser;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.jdbc.core.JdbcTemplate;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.*;

/** Read-only UI bootstrap. All records are loaded from MySQL; React mock state is not authoritative. */
public final class BootstrapServlet extends HttpServlet {
    private JdbcTemplate db;
    private static final DateTimeFormatter DATE = DateTimeFormatter.ofPattern("yyyy-MM-dd");
    private static final DateTimeFormatter TS = DateTimeFormatter.ISO_INSTANT;

    @Override public void init() { db = SpringAccess.bean(getServletContext(), JdbcTemplate.class); }

    @Override protected void doGet(HttpServletRequest req, HttpServletResponse res) throws IOException {
        try {
            SessionUser user = (SessionUser) req.getSession(false).getAttribute(AuthenticationFilter.SESSION_KEY);
            String id = user.id().toString();
            Map<String,Object> payload = new LinkedHashMap<>();
            Map<String,Object> current = loadUser(id);
            payload.put("user", current);
            payload.put("users", user.role().name().equals("ADMIN") ? loadUsers() : List.of(current));
            payload.put("lawyers", loadLawyers(user.role().name().equals("ADMIN")));
            payload.put("appointments", loadAppointments(user));
            payload.put("cases", loadCases(user));
            payload.put("timelineEvents", loadTimeline(user));
            payload.put("documents", loadDocuments(user));
            payload.put("notifications", loadNotifications(id));
            payload.put("auditLogs", loadAudit(user));
            payload.put("csrfToken", req.getSession(false).getAttribute(com.nyayaconnect.security.CsrfFilter.SESSION_KEY));
            Api.json(res, 200, payload);
        } catch (Exception e) {
            Api.error(res, 500, "BOOTSTRAP_FAILED", "Unable to load the authenticated workspace.");
        }
    }

    private Map<String,Object> loadUser(String id) {
        Map<String,Object> raw = db.queryForMap("select id,name,email,role,blocked,last_login,coalesce(city,'') city,coalesce(phone,'') phone,coalesce(state,'') state from users where id=?", id);
        Map<String,Object> u = new LinkedHashMap<>();
        u.put("id", raw.get("id")); u.put("name", raw.get("name")); u.put("email", raw.get("email")); u.put("role", raw.get("role"));
        u.put("isBlocked", raw.get("blocked")); u.put("lastLogin", String.valueOf(raw.get("last_login")));
        u.put("city", raw.get("city")); u.put("phone", raw.get("phone")); u.put("state", raw.get("state"));
        return u;
    }

    private List<Map<String,Object>> loadUsers(){
        List<Map<String,Object>> raw=db.queryForList("select id,name,email,role,blocked,last_login,coalesce(city,'') city,coalesce(phone,'') phone,coalesce(state,'') state from users order by created_at desc");
        List<Map<String,Object>> out=new ArrayList<>();
        for(Map<String,Object> r:raw){Map<String,Object>u=new LinkedHashMap<>();u.put("id",r.get("id"));u.put("name",r.get("name"));u.put("email",r.get("email"));u.put("role",r.get("role"));u.put("isBlocked",r.get("blocked"));u.put("lastLogin",String.valueOf(r.get("last_login")));u.put("city",r.get("city"));u.put("phone",r.get("phone"));u.put("state",r.get("state"));out.add(u);}
        return out;
    }

    private List<Map<String,Object>> loadLawyers(boolean admin) {
        String sql = "select lp.id, u.id user_id,u.name,u.email,coalesce(u.phone,'') phone,lp.bar_council_number,lp.verification_status,coalesce(lp.bio,'') bio,lp.experience_years,coalesce(lp.city,'') city,coalesce(lp.court,'') court,lp.consultation_fee,lp.rating,lp.review_count, " +
                "coalesce((select group_concat(lpa.practice_area separator '||') from lawyer_practice_areas lpa where lpa.lawyer_id=lp.id),'') practice_areas, " +
                "coalesce((select group_concat(ll.language_name separator '||') from lawyer_languages ll where ll.lawyer_id=lp.id),'') languages " +
                "from lawyer_profiles lp join users u on u.id=lp.user_id " + (admin ? "" : "where lp.verification_status='VERIFIED' and u.blocked=false ") + "order by lp.rating desc,lp.review_count desc";
        List<Map<String,Object>> rows = db.queryForList(sql);
        for (Map<String,Object> r : rows) {
            r.put("practiceAreas", split(r.remove("practice_areas")));
            r.put("languages", split(r.remove("languages")));
            r.put("availableDays", List.of("Monday","Tuesday","Wednesday","Thursday","Friday"));
            r.put("timeSlots", List.of("10:00 AM - 10:30 AM","11:30 AM - 12:00 PM","03:00 PM - 03:30 PM","05:00 PM - 05:30 PM"));
            r.put("verificationStatus", String.valueOf(r.get("verification_status")));
            r.remove("verification_status");
            r.put("experienceYears", r.remove("experience_years"));
            r.put("consultationFee", r.remove("consultation_fee"));
            r.put("reviewCount", r.remove("review_count"));
            r.put("userId", r.remove("user_id"));
            r.put("barCouncilNumber", r.remove("bar_council_number"));
        }
        return rows;
    }

    private List<Map<String,Object>> loadAppointments(SessionUser user) {
        String sql = "select a.id,a.client_id,a.lawyer_id,cu.name client_name,lu.name lawyer_name,a.starts_at,a.ends_at,a.status,coalesce(a.client_notes,'') client_notes,coalesce(a.lawyer_notes,'') lawyer_notes,coalesce(a.meeting_url,'') meeting_url,coalesce(a.case_id,'') case_id,coalesce(c.title,'Legal consultation') title,coalesce(c.category,'General legal consultation') category,a.created_at from appointments a join users cu on cu.id=a.client_id join users lu on lu.id=a.lawyer_id left join cases c on c.id=a.case_id where a.client_id=? or a.lawyer_id=? order by a.starts_at desc";
        List<Map<String,Object>> rows = db.queryForList(sql,user.id().toString(),user.id().toString());
        for (Map<String,Object> r : rows) normalizeAppointment(r);
        return rows;
    }

    private void normalizeAppointment(Map<String,Object> r) {
        r.put("clientId", r.remove("client_id")); r.put("lawyerId", r.remove("lawyer_id"));
        r.put("clientName", r.remove("client_name")); r.put("lawyerName", r.remove("lawyer_name"));
        r.put("legalIssueTitle", r.remove("title")); r.put("legalCategory", r.remove("category"));
        r.put("clientNotes", r.remove("client_notes")); r.put("lawyerNotes", r.remove("lawyer_notes"));
        r.put("meetingLink", r.remove("meeting_url"));
        r.put("caseId", r.remove("case_id"));
        Object start = r.remove("starts_at"), end = r.remove("ends_at");
        LocalDateTime startTime = toLocalDateTime(start);
        LocalDateTime endTime = toLocalDateTime(end);
        if (startTime != null && endTime != null) {
            r.put("date", startTime.toLocalDate().toString());
            String a = startTime.toLocalTime().format(DateTimeFormatter.ofPattern("hh:mm a"));
            String b = endTime.toLocalTime().format(DateTimeFormatter.ofPattern("hh:mm a"));
            r.put("timeSlot", a + " - " + b);
        }
        r.put("createdAt", String.valueOf(r.get("created_at"))); r.remove("created_at");
    }


    private LocalDateTime toLocalDateTime(Object value) {
        if (value == null) return null;
        if (value instanceof LocalDateTime dt) return dt;
        if (value instanceof java.sql.Timestamp ts) return ts.toLocalDateTime();
        if (value instanceof java.sql.Date d) return d.toLocalDate().atStartOfDay();
        if (value instanceof java.util.Date d) return d.toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime();
        return null;
    }

    private List<Map<String,Object>> loadCases(SessionUser user) {
        String sql = "select c.id,c.case_number,c.title,c.category,c.description,c.client_id,c.lawyer_id,c.status,c.opened_at,c.updated_at,cu.name client_name,coalesce(lu.name,'Unassigned') lawyer_name,coalesce(lu.id,'') lawyer_user_id,coalesce(lu.email,'') lawyer_email from cases c join users cu on cu.id=c.client_id left join users lu on lu.id=c.lawyer_id where c.client_id=? or c.lawyer_id=? order by c.updated_at desc";
        List<Map<String,Object>> rows=db.queryForList(sql,user.id().toString(),user.id().toString());
        for(Map<String,Object> r:rows){
            r.put("caseNumber",r.remove("case_number"));r.put("clientId",r.remove("client_id"));r.put("lawyerId",r.remove("lawyer_id"));
            r.put("clientName",r.remove("client_name"));r.put("lawyerName",r.remove("lawyer_name"));r.put("openedAt",String.valueOf(r.remove("opened_at")));r.put("lastUpdated",String.valueOf(r.remove("updated_at")));
            r.put("tasks",loadTasks(String.valueOf(r.get("id"))));r.put("court","Online consultation / jurisdiction to be confirmed");
        }
        return rows;
    }


    private List<Map<String,Object>> loadTimeline(SessionUser user){
        String sql="select t.id,t.case_id,t.event_type,t.title,coalesce(t.description,'') description,t.created_at,u.name created_by_name from case_timeline t join users u on u.id=t.created_by where t.case_id in (select id from cases where client_id=? or lawyer_id=?) order by t.created_at desc";
        return db.queryForList(sql,user.id().toString(),user.id().toString()).stream().map(r->{Map<String,Object>x=new LinkedHashMap<>();x.put("id",r.get("id"));x.put("caseId",r.get("case_id"));x.put("eventType",r.get("event_type"));x.put("title",r.get("title"));x.put("description",r.get("description"));x.put("date",String.valueOf(r.get("created_at")));x.put("createdByUserName",r.get("created_by_name"));return x;}).toList();
    }
    private List<Map<String,Object>> loadTasks(String caseId){
        return db.queryForList("select id,title,status,due_at from case_tasks where case_id=? order by coalesce(due_at,'9999-12-31')",caseId).stream().map(r->{Map<String,Object>x=new LinkedHashMap<>();x.put("id",r.get("id"));x.put("title",r.get("title"));x.put("completed","COMPLETED".equals(String.valueOf(r.get("status"))));x.put("dueDate",String.valueOf(r.get("due_at")));return x;}).toList();
    }

    private List<Map<String,Object>> loadDocuments(SessionUser user){
        String sql="select d.id,d.case_id,d.original_name,d.storage_key,d.mime_type,d.size_bytes,d.uploaded_by,d.created_at,u.name uploaded_by_name from documents d join users u on u.id=d.uploaded_by where d.case_id in (select id from cases where client_id=? or lawyer_id=?) order by d.created_at desc";
        return db.queryForList(sql,user.id().toString(),user.id().toString()).stream().map(r->{Map<String,Object>x=new LinkedHashMap<>();x.put("id",r.get("id"));x.put("caseId",r.get("case_id"));x.put("originalName",r.get("original_name"));x.put("storedFileName",r.get("storage_key"));x.put("fileSizeKb",((Number)r.get("size_bytes")).doubleValue()/1024);x.put("fileType",r.get("mime_type"));x.put("uploadedByUserId",r.get("uploaded_by"));x.put("uploadedByUserName",r.get("uploaded_by_name"));x.put("uploadedAt",String.valueOf(r.get("created_at")));return x;}).toList();
    }

    private List<Map<String,Object>> loadNotifications(String userId){
        return db.queryForList("select id,user_id,title,message,type,read_at,created_at from notifications where user_id=? order by created_at desc limit 50",userId).stream().map(r->{Map<String,Object>x=new LinkedHashMap<>();x.put("id",r.get("id"));x.put("userId",r.get("user_id"));x.put("title",r.get("title"));x.put("message",r.get("message"));x.put("type",r.get("type"));x.put("read",r.get("read_at")!=null);x.put("createdAt",String.valueOf(r.get("created_at")));return x;}).toList();
    }

    private List<Map<String,Object>> loadAudit(SessionUser user){
        String sql=user.role().name().equals("ADMIN")?"select a.id,a.actor_user_id,a.action,a.resource,a.resource_id,a.outcome,a.ip_address,a.created_at,u.name user_name,u.role user_role from audit_logs a left join users u on u.id=a.actor_user_id order by a.created_at desc limit 100":"select a.id,a.actor_user_id,a.action,a.resource,a.resource_id,a.outcome,a.ip_address,a.created_at,u.name user_name,u.role user_role from audit_logs a left join users u on u.id=a.actor_user_id where a.actor_user_id=? order by a.created_at desc limit 100";
        List<Map<String,Object>> rows=user.role().name().equals("ADMIN")?db.queryForList(sql):db.queryForList(sql,user.id().toString());
        for(Map<String,Object> r:rows){r.put("userId",r.remove("actor_user_id"));r.put("userName",r.remove("user_name"));r.put("userRole",r.remove("user_role"));r.put("action",r.get("action"));r.put("resource",r.get("resource"));r.put("ipAddress",r.get("ip_address"));r.put("timestamp",String.valueOf(r.get("created_at")));r.put("status",r.remove("outcome"));r.put("details",String.valueOf(r.getOrDefault("resource_id","")));r.remove("resource_id");r.remove("ip_address");r.remove("created_at");}
        return rows;
    }

    private static List<String> split(Object value){String s=String.valueOf(value==null?"":value);return s.isBlank()?List.of():Arrays.asList(s.split("\\|\\|"));}
}
