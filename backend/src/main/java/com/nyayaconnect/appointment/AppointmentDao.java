package com.nyayaconnect.appointment;
import java.time.LocalDateTime;
import java.util.UUID;
public interface AppointmentDao {
  boolean overlaps(UUID lawyerId, LocalDateTime start, LocalDateTime end);
  UUID create(UUID caseId, UUID clientId, UUID lawyerId, LocalDateTime start, LocalDateTime end, String notes);
  Participants participants(UUID appointmentId);
  void transition(UUID appointmentId, AppointmentStatus from, AppointmentStatus to, String meetingUrl, String lawyerNotes);
  record Participants(UUID clientId, UUID lawyerId, AppointmentStatus status) {}
}
