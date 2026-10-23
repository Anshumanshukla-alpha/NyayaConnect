package com.nyayaconnect.document;
import java.util.*;
public interface DocumentDao {
 UUID insert(UUID caseId,String original,String key,String mime,long size,String sha,UUID uploadedBy);
 void accessLog(UUID documentId,UUID userId,String action,String ip);
 Optional<DocumentRecord> find(UUID id);
 record DocumentRecord(UUID id,UUID caseId,String originalName,String storageKey,String mimeType,long sizeBytes) {}
}
