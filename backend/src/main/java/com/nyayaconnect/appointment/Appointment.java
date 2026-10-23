package com.nyayaconnect.appointment;
import java.time.LocalDateTime;import java.util.UUID;
public record Appointment(UUID id,UUID clientId,UUID lawyerId,LocalDateTime startsAt,LocalDateTime endsAt,AppointmentStatus status,String meetingUrl) {}
