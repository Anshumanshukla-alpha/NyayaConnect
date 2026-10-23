package com.nyayaconnect.ai;
import java.util.List;
public record LegalTriage(String category,String practiceArea,String urgency,String confidenceLevel,String summary,List<String> relevantActs,List<String> requiredDocuments,String legalRightsSummary,List<String> nextSteps,List<String> suggestedSpecializations,List<Citation> citations,boolean sourceVerified){
 public record Citation(String title,String url,String publisher,String excerpt){}
}
