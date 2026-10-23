package com.nyayaconnect.appointment;

/** Centralized appointment state-transition rules used by the service layer. */
public final class AppointmentPolicy {
    private AppointmentPolicy() {}

    public static boolean canTransition(AppointmentStatus from, AppointmentStatus to) {
        if (from == null || to == null) return false;
        return (to == AppointmentStatus.CONFIRMED && (from == AppointmentStatus.PENDING || from == AppointmentStatus.REQUESTED))
            || (to == AppointmentStatus.REJECTED && (from == AppointmentStatus.PENDING || from == AppointmentStatus.REQUESTED))
            || (to == AppointmentStatus.COMPLETED && from == AppointmentStatus.CONFIRMED);
    }
}
