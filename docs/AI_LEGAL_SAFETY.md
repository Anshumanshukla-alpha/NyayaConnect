# AI Legal Safety and Retrieval

## Current behavior

- The triage classifier is deterministic and returns conservative classification/confidence labels.
- The chat endpoint searches MySQL full-text chunks linked to active legal sources with a non-null verification timestamp.
- If retrieval returns no material, the endpoint abstains instead of fabricating a legal answer.
- When results exist, the response labels the material as source retrieval rather than a legal opinion and returns citations derived from retrieved database records.
- No external LLM provider is configured in the inspected chat path. Do not claim LLM-based legal reasoning, calibrated legal confidence, or comprehensive legal accuracy.

## Source data requirements

For each source, curate title, publisher, canonical URL, jurisdiction, document type, publication/effective dates, source version, and last-verified date. Ensure only authorized, current sources are marked active/verified. Establish a process for amendments, repeals, superseded judgments, jurisdiction filtering and source review. A verification timestamp alone does not prove the content is correct or current.

## Privacy and prompt injection

Treat user-provided questions, uploaded documents and retrieved text as untrusted content. Do not execute instructions embedded in documents. Apply user/case authorization before retrieval of private matter documents. Minimize sensitive data in logs and do not send legal documents to external AI services without documented provider configuration, appropriate disclosure, authorization and privacy review.

## Evaluation needed

No comprehensive automated legal evaluation dataset was executed in this environment. Before making accuracy claims, add versioned cases covering jurisdiction, expected source IDs, amendment/repeal handling, unsupported questions, misleading citations, prompt injection, cross-user access, retrieval relevance, abstention, latency and provider failures. Human legal experts should review the dataset and results. Until then, present the feature as assistive legal information, not legal advice or a substitute for a qualified advocate.
