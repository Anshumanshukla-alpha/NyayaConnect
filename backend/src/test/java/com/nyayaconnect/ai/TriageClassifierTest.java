package com.nyayaconnect.ai;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class TriageClassifierTest {
    @Test void tenancyIssueIsClassifiedWithoutClaimingLegalAdvice() {
        LegalTriage result = TriageClassifier.classify("My landlord has not returned my rent deposit");
        assertEquals("Tenancy & Rental Dispute", result.category());
        assertEquals("Property & Real Estate Law", result.practiceArea());
        assertFalse(result.sourceVerified());
        assertTrue(result.summary().toLowerCase().contains("not legal advice"));
        assertFalse(result.nextSteps().isEmpty());
    }

    @Test void cyberFraudGetsCriticalUrgency() {
        LegalTriage result = TriageClassifier.classify("Someone stole money through a UPI scam");
        assertEquals("Cyber Crime & Financial Fraud", result.category());
        assertEquals("Critical", result.urgency());
        assertTrue(result.requiredDocuments().stream().anyMatch(x -> x.contains("UTR")));
    }

    @Test void blankInputIsRejected() {
        assertThrows(IllegalArgumentException.class, () -> TriageClassifier.classify("   "));
    }
}
