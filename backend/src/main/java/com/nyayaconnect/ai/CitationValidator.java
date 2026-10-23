package com.nyayaconnect.ai;
import java.util.*;
public final class CitationValidator {private CitationValidator(){}public static List<LegalTriage.Citation> toCitations(List<LegalRetrievalService.SourceChunk> chunks){return chunks.stream().map(x->new LegalTriage.Citation(x.title(),x.url(),x.publisher(),trim(x.excerpt()))).distinct().toList();}private static String trim(String s){return s==null?"":s.length()>500?s.substring(0,500)+"…":s;}}
