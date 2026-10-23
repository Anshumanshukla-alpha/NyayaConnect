package com.nyayaconnect.audit;
import com.nyayaconnect.security.SessionUser; import org.springframework.jdbc.core.JdbcTemplate; import org.springframework.stereotype.Service;
import java.util.UUID;
@Service public class AuditService { private final JdbcTemplate jdbc; public AuditService(JdbcTemplate jdbc){this.jdbc=jdbc;}
 public void record(SessionUser actor,String action,String resource,String resourceId,String outcome,String ip,String correlationId){jdbc.update("insert into audit_logs(id,actor_user_id,action,resource,resource_id,outcome,ip_address,correlation_id) values(?,?,?,?,?,?,?,?)",UUID.randomUUID().toString(),actor==null?null:actor.id().toString(),action,resource,resourceId,outcome,ip,correlationId);}
}
