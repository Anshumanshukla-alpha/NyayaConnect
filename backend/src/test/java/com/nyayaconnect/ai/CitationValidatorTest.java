package com.nyayaconnect.ai;

import org.junit.jupiter.api.Test;
import java.util.List;
import static org.junit.jupiter.api.Assertions.*;

class CitationValidatorTest {
    @Test void citationsAreMappedAndLongExcerptsAreBounded() {
        String longText = "x".repeat(700);
        var source = new LegalRetrievalService.SourceChunk("India Code", "Government of India", "https://example.test", longText, "v1");
        var citations = CitationValidator.toCitations(List.of(source));
        assertEquals(1, citations.size());
        assertEquals("India Code", citations.get(0).title());
        assertTrue(citations.get(0).excerpt().length() <= 501);
    }
}
