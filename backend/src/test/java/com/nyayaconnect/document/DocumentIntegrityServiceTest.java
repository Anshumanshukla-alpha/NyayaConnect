package com.nyayaconnect.document;

import org.junit.jupiter.api.Test;
import java.io.ByteArrayInputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import static org.junit.jupiter.api.Assertions.*;

class DocumentIntegrityServiceTest {
    @Test void sha256IsDeterministic() throws Exception {
        var service = new DocumentIntegrityService();
        var bytes = "NyayaConnect integrity test".getBytes();
        assertEquals("703795e297cc31200ab73078b3f851e2bbc0bdbef02234f925759a885d63e5c8", service.sha256(new ByteArrayInputStream(bytes)), "Update expected digest if test data changes");
    }

    @Test void safePathRejectsTraversal() {
        var service = new DocumentIntegrityService();
        assertThrows(SecurityException.class, () -> service.safePath("../../outside.txt"));
    }
}
