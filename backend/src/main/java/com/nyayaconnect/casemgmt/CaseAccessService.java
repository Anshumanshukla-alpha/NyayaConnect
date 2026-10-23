package com.nyayaconnect.casemgmt;
import com.nyayaconnect.security.SessionUser;import com.nyayaconnect.user.UserRole;import org.springframework.jdbc.core.JdbcTemplate;import org.springframework.stereotype.Service;import java.util.UUID;
@Service public class CaseAccessService {private final JdbcTemplate db;public CaseAccessService(JdbcTemplate db){this.db=db;}
 public void requireAccess(SessionUser u,UUID caseId){if(u==null)throw new SecurityException("Authentication required.");if(u.role()==UserRole.ADMIN)return;Integer n=db.queryForObject("select count(*) from cases where id=? and (client_id=? or lawyer_id=?)",Integer.class,caseId.toString(),u.id().toString(),u.id().toString());if(n==null||n!=1)throw new SecurityException("You do not have access to this case.");}
}
