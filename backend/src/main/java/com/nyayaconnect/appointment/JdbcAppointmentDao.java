package com.nyayaconnect.appointment;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.UUID;
@Repository public class JdbcAppointmentDao implements AppointmentDao {
 private final JdbcTemplate db; public JdbcAppointmentDao(JdbcTemplate db){this.db=db;}
 public boolean overlaps(UUID lawyerId,LocalDateTime start,LocalDateTime end){Integer n=db.queryForObject("select count(*) from appointments where lawyer_id=? and status in ('REQUESTED','PENDING','CONFIRMED') and starts_at < ? and ends_at > ?",Integer.class,lawyerId.toString(),end,start);return n!=null&&n>0;}
 public UUID create(UUID caseId,UUID clientId,UUID lawyerId,LocalDateTime start,LocalDateTime end,String notes){UUID id=UUID.randomUUID();db.update("insert into appointments(id,case_id,client_id,lawyer_id,starts_at,ends_at,status,client_notes) values(?,?,?,?,?,?,'PENDING',?)",id.toString(),caseId.toString(),clientId.toString(),lawyerId.toString(),start,end,notes);return id;}
 public Participants participants(UUID id){return db.queryForObject("select client_id,lawyer_id,status from appointments where id=?",(rs,n)->new Participants(UUID.fromString(rs.getString(1)),UUID.fromString(rs.getString(2)),AppointmentStatus.valueOf(rs.getString(3))),id.toString());}
 public void transition(UUID id,AppointmentStatus from,AppointmentStatus to,String url,String notes){int n=db.update("update appointments set status=?,meeting_url=coalesce(?,meeting_url),lawyer_notes=coalesce(?,lawyer_notes) where id=? and status=?",to.name(),url,notes,id.toString(),from.name());if(n!=1)throw new IllegalStateException("Appointment state changed; refresh and retry.");}
}
