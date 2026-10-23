package com.nyayaconnect.appointment;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class AppointmentPolicyTest {
    @Test void pendingCanBeConfirmedOrRejected() {
        assertTrue(AppointmentPolicy.canTransition(AppointmentStatus.PENDING, AppointmentStatus.CONFIRMED));
        assertTrue(AppointmentPolicy.canTransition(AppointmentStatus.PENDING, AppointmentStatus.REJECTED));
    }

    @Test void requestedCanBeConfirmedOrRejected() {
        assertTrue(AppointmentPolicy.canTransition(AppointmentStatus.REQUESTED, AppointmentStatus.CONFIRMED));
        assertTrue(AppointmentPolicy.canTransition(AppointmentStatus.REQUESTED, AppointmentStatus.REJECTED));
    }

    @Test void onlyConfirmedCanBeCompleted() {
        assertTrue(AppointmentPolicy.canTransition(AppointmentStatus.CONFIRMED, AppointmentStatus.COMPLETED));
        assertFalse(AppointmentPolicy.canTransition(AppointmentStatus.PENDING, AppointmentStatus.COMPLETED));
        assertFalse(AppointmentPolicy.canTransition(AppointmentStatus.REJECTED, AppointmentStatus.COMPLETED));
    }

    @Test void terminalAndNullTransitionsAreRejected() {
        assertFalse(AppointmentPolicy.canTransition(AppointmentStatus.COMPLETED, AppointmentStatus.CONFIRMED));
        assertFalse(AppointmentPolicy.canTransition(AppointmentStatus.REJECTED, AppointmentStatus.CONFIRMED));
        assertFalse(AppointmentPolicy.canTransition(null, AppointmentStatus.CONFIRMED));
        assertFalse(AppointmentPolicy.canTransition(AppointmentStatus.PENDING, null));
    }
}
