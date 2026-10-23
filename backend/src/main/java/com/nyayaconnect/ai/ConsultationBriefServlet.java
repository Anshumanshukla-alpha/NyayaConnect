package com.nyayaconnect.ai;

import com.nyayaconnect.common.Api;
import com.nyayaconnect.common.Json;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;
import java.util.Map;

/**
 * Produces a structured consultation-preparation brief from supplied case context.
 * This endpoint intentionally creates an assistive draft, not legal advice.
 */
public final class ConsultationBriefServlet extends HttpServlet {
    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse res) throws IOException {
        try {
            Map<?, ?> body = Json.MAPPER.readValue(req.getInputStream(), Map.class);
            String caseTitle = value(body, "caseTitle", "Legal consultation");
            String category = value(body, "category", "Not classified");
            String client = value(body, "clientName", "Current client");
            String description = value(body, "description", "No case description supplied.");
            String language = value(body, "language", "English");

            String safeSummary = "Preparation brief only. Verify the facts, original documents, applicable law and procedural deadlines with a qualified advocate.";
            Map<String, Object> brief = Map.of(
                    "caseTitle", caseTitle,
                    "category", category,
                    "clientName", client,
                    "language", language,
                    "summary", safeSummary,
                    "factsToVerify", List.of(
                            "Chronology and dates",
                            "Identity of all relevant parties",
                            "Jurisdiction/court details",
                            "Original documents and their integrity"
                    ),
                    "documentsToReview", List.of(
                            "Agreement/contract or notice",
                            "Payment or transaction records",
                            "Previous correspondence/orders"
                    ),
                    "questionsForClient", List.of(
                            "What outcome are you seeking?",
                            "What deadlines or hearings are already known?",
                            "Has any notice, order or filing already been received?"
                    ),
                    "caseDescriptionReceived", description.length() > 2000 ? description.substring(0, 2000) : description,
                    "aiSafetyNote", "AI-generated drafting aid; not a legal opinion or guaranteed procedural guidance."
            );
            Api.json(res, 200, brief);
        } catch (Exception e) {
            Api.error(res, 400, "INVALID_REQUEST", "Invalid consultation brief request.");
        }
    }

    private static String value(Map<?, ?> map, String key, String fallback) {
        Object value = map.get(key);
        if (value == null) return fallback;
        String text = String.valueOf(value).trim();
        return text.isEmpty() ? fallback : text;
    }
}
