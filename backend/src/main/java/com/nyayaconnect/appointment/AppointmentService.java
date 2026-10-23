package com.nyayaconnect.appointment;
import com.nyayaconnect.audit.AuditService;import com.nyayaconnect.security.SessionUser;import com.nyayaconnect.user.UserRole;import org.springframework.jdbc.core.JdbcTemplate;import org.springframework.stereotype.Service;import org.springframework.transaction.annotation.Transactional;import java.time.*;import java.util.UUID;
@Service public class AppointmentService {
 private final AppointmentDao dao; private final AuditService audit; private final JdbcTemplate db; public AppointmentService(AppointmentDao dao,AuditService audit,JdbcTemplate db){this.dao=dao;this.audit=audit;this.db=db;}
 @Transactional public UUID book(SessionUser actor,UUID lawyerId,LocalDateTime start,LocalDateTime end,String title,String category,String notes,String ip,String correlation){
  if(actor==null||actor.role()!=UserRole.CLIENT)throw new SecurityException("Only clients can create appointment requests.");
  Integer verified=db.queryForObject("select count(*) from lawyer_profiles lp join users u on u.id=lp.user_id where lp.user_id=? and lp.verification_status='VERIFIED' and u.blocked=false",Integer.class,lawyerId.toString());
  if(verified==null||verified!=1)throw new IllegalStateException("The selected lawyer is not currently verified or is unavailable.");
  // Serialize booking attempts per lawyer. The row lock is held until this transaction
  // commits, so two concurrent requests cannot both pass the overlap check.
  db.queryForObject("select id from users where id=? for update", String.class, lawyerId.toString());
  if(start==null||end==null||!end.isAfter(start)||Duration.between(start,end).toMinutes()<15||Duration.between(start,end).toMinutes()>180)throw new IllegalArgumentException("Appointment duration must be 15 to 180 minutes.");
  if(start.isBefore(LocalDateTime.now().plusMinutes(1)))throw new IllegalArgumentException("Appointment must be at least one minute in the future.");
  if(dao.overlaps(lawyerId,start,end))throw new IllegalStateException("The selected lawyer is already booked for that time.");
  String safeTitle=clean(title,"Legal consultation",180); String safeCategory=clean(category,"General legal consultation",100); String safeNotes=clean(notes,"",4000);
  UUID caseId=UUID.randomUUID(); String caseNumber="NYA-"+Year.now().getValue()+"-"+caseId.toString().substring(0,8).toUpperCase();
  db.update("insert into cases(id,case_number,title,category,description,client_id,lawyer_id,status) values(?,?,?,?,?,?,?,'OPEN')",caseId.toString(),caseNumber,safeTitle,safeCategory,safeNotes,actor.id().toString(),lawyerId.toString());
  UUID id=dao.create(caseId,actor.id(),lawyerId,start,end,safeNotes);
  db.update("insert into case_timeline(id,case_id,event_type,title,description,created_by) values(?,?,?,?,?,?)",UUID.randomUUID().toString(),caseId.toString(),"CONSULTATION","Consultation requested","Appointment request submitted; confirm details with the assigned advocate.",actor.id().toString());
  db.update("insert into notifications(id,user_id,title,message,type) values(?,?,?,?,?)",UUID.randomUUID().toString(),lawyerId.toString(),"New consultation request",safeTitle+" — please review the pending appointment request.","APPOINTMENT");
  audit.record(actor,"APPOINTMENT_CREATE","appointment",id.toString(),"SUCCESS",ip,correlation);return id;
 }
 private static String clean(String value,String fallback,int max){if(value==null||value.isBlank())return fallback;String v=value.trim().replaceAll("[\\p{Cntrl}&&[^\\n\\t]]","");return v.length()>max?v.substring(0,max):v;}
 @Transactional public void confirm(SessionUser actor,UUID id,String ip,String correlation){transition(actor,id,AppointmentStatus.CONFIRMED,null,"APPOINTMENT_CONFIRM",ip,correlation);}
 @Transactional public void reject(SessionUser actor,UUID id,String ip,String correlation){transition(actor,id,AppointmentStatus.REJECTED,null,"APPOINTMENT_REJECT",ip,correlation);}
 @Transactional public void complete(SessionUser actor,UUID id,String notes,String ip,String correlation){transition(actor,id,AppointmentStatus.COMPLETED,notes,"CONSULTATION_COMPLETE",ip,correlation);}
 private void transition(SessionUser actor,UUID id,AppointmentStatus to,String notes,String action,String ip,String correlation){
  if(actor==null)throw new SecurityException("Authentication required.");AppointmentDao.Participants p=dao.participants(id);
  if(actor.role()!=UserRole.ADMIN&&!actor.id().equals(p.lawyerId()))throw new SecurityException("Only the assigned lawyer or administrator can change this appointment.");
  AppointmentStatus from=p.status();
  boolean allowed=AppointmentPolicy.canTransition(from,to);
  if(!allowed)throw new IllegalStateException("Invalid appointment transition from "+from+" to "+to+".");
  String meeting=to==AppointmentStatus.CONFIRMED?"https://meet.jit.si/nyayaconnect-"+id:null;dao.transition(id,from,to,meeting,notes);
  audit.record(actor,action,"appointment",id.toString(),"SUCCESS",ip,correlation);
 }

}
