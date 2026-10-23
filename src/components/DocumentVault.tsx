import React, { useState } from 'react';
import { CaseDocument, UserRole } from '../types';
import { 
  FileText, 
  Upload, 
  Download, 
  ShieldCheck, 
  Lock, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2, 
  FileCheck,
  Search,
  Eye,
  RefreshCw,
  X
} from 'lucide-react';

interface DocumentVaultProps {
  documents: CaseDocument[];
  currentRole: UserRole;
  onUploadDocument: (file: File) => Promise<void> | void;
  onSimulateDownload: (doc: CaseDocument) => void;
  onAnalyzeDocument: (doc: CaseDocument) => Promise<void> | void;
}

export const DocumentVault: React.FC<DocumentVaultProps> = ({
  documents,
  currentRole,
  onUploadDocument,
  onSimulateDownload,
  onAnalyzeDocument,
}) => {
  const [selectedDoc, setSelectedDoc] = useState<CaseDocument | null>(documents[0] || null);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [newDocCategory, setNewDocCategory] = useState('Rent Agreement / Lease Deed');
  const [accessDeniedMessage, setAccessDeniedMessage] = useState<string | null>(null);

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;
    setIsUploading(true);
    try { await onUploadDocument(selectedFile); setSelectedFile(null); } finally { setIsUploading(false); }
  };

  const handleDownload = (doc: CaseDocument) => { onSimulateDownload(doc); };

  const handleAnalyze = async (doc: CaseDocument) => { await onAnalyzeDocument(doc); };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* Header Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Secure Document Vault
            </h1>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              <Lock className="w-3 h-3 text-emerald-600" />
              Private server storage
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Private storage outside the public web directory with server-side case authorization and SHA-256 integrity verification.
          </p>
        </div>

        <button
          onClick={() => setIsUploading(!isUploading)}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-xs"
        >
          <Upload className="w-3.5 h-3.5 text-amber-400" />
          <span>Upload Legal Evidence</span>
        </button>
      </div>

      {/* Upload Drawer / Modal */}
      {isUploading && (
        <div className="bg-white rounded-2xl border border-slate-300 p-6 shadow-md animate-in fade-in">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900">
              Upload Case Evidence / Legal Instrument
            </h3>
            <button onClick={() => setIsUploading(false)} className="text-slate-400 hover:text-slate-600">
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleUploadSubmit} className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Evidence File *
              </label>
              <input
                type="file" required accept=".pdf,.png,.jpg,.jpeg,.txt"
                onChange={(e) => setSelectedFile(e.target.files?.[0] ?? null)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
              />
              <p className="mt-1 text-[10px] text-slate-500">Your original file is validated, stored privately and integrity-checked before it is added to the case.</p>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Instrument Classification
              </label>
              <select
                value={newDocCategory}
                onChange={(e) => setNewDocCategory(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-slate-800 bg-white"
              >
                <option value="Rent Agreement / Lease Deed">Rent Agreement / Lease Deed</option>
                <option value="Cheque Return Memo (Sec 138)">Cheque Return Memo (Sec 138)</option>
                <option value="Statutory Legal Demand Notice">Statutory Legal Demand Notice</option>
                <option value="Bank Statement / Financial Record">Bank Statement / Financial Record</option>
                <option value="Employment Offer / Termination Letter">Employment Offer / Termination Letter</option>
                <option value="Police / Cyber Crime Portal Acknowledgement">Police / Cyber Crime Ack</option>
              </select>
            </div>

            <div className="sm:col-span-3 flex items-center justify-between pt-2 border-t border-slate-100">
              <span className="text-[11px] text-slate-500">
                * Files are validated and integrity-checked before secure storage.
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsUploading(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-md shadow-xs"
                >
                  Upload securely
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Main Grid: Document List (Left) & AI Document Intelligence Inspector (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Document List */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-900">
              Stored Evidence Files
            </h2>
            <span className="text-xs text-slate-400 font-mono">{documents.length} Files</span>
          </div>

          <div className="space-y-2">
            {documents.map((doc) => {
              const isSelected = selectedDoc?.id === doc.id;
              return (
                <div
                  key={doc.id}
                  onClick={() => setSelectedDoc(doc)}
                  className={`p-3.5 rounded-xl border text-xs cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300 text-slate-800'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 truncate">
                      <FileText className={`w-4 h-4 shrink-0 ${isSelected ? 'text-amber-400' : 'text-slate-500'}`} />
                      <span className="font-semibold truncate">{doc.originalName}</span>
                    </div>
                  </div>

                  <div className={`mt-2 flex items-center justify-between text-[10px] font-mono ${
                    isSelected ? 'text-slate-300' : 'text-slate-400'
                  }`}>
                    <span>{doc.classification}</span>
                    <span>{doc.fileSizeKb} KB</span>
                  </div>

                  <div className={`mt-1 text-[10px] ${isSelected ? 'text-slate-400' : 'text-slate-400'}`}>
                    Uploaded by: {doc.uploadedByUserName} ({doc.uploadedAt})
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 2 Cols: AI Document Intelligence Deep Dive */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          {selectedDoc ? (
            <div className="space-y-6">
              
              {/* Document Metadata Header */}
              <div className="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-slate-900">
                      {selectedDoc.originalName}
                    </h2>
                    <span className="text-[11px] px-2 py-0.5 rounded font-mono bg-slate-100 text-slate-700">
                      {selectedDoc.classification}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 font-mono mt-1">
                    
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleAnalyze(selectedDoc)}
                    className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-amber-800 bg-amber-50 hover:bg-amber-100 rounded-lg transition-colors border border-amber-200"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Analyze</span>
                  </button>
                  <button
                    onClick={() => handleDownload(selectedDoc)}
                    className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors border border-slate-200"
                  >
                  <Download className="w-3.5 h-3.5 text-slate-600" />
                    <span>Download Authorized Copy</span>
                  </button>
                </div>
              </div>

              {/* AI Document Intelligence Breakdown */}
              {selectedDoc.aiSummary ? (
                <div className="space-y-5">
                  <div className="inline-flex items-center gap-2 text-xs font-semibold text-amber-700 bg-amber-50 px-3 py-1 rounded-full">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span>AI Document Intelligence Extraction</span>
                  </div>

                  {/* Plain Language Summary */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80">
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                      Plain-Language Legal Summary
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                      {selectedDoc.aiSummary.plainLanguageSummary}
                    </p>
                  </div>

                  {/* Extracted Metadata Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                      <span className="text-slate-400 text-[10px] uppercase font-bold block">Parties Identified</span>
                      <span className="font-semibold text-slate-900 block mt-0.5">
                        {selectedDoc.aiSummary.partiesIdentified.join(' & ')}
                      </span>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                      <span className="text-slate-400 text-[10px] uppercase font-bold block">Effective Timeline</span>
                      <span className="font-semibold text-slate-900 block mt-0.5">
                        {selectedDoc.aiSummary.effectiveDate}
                      </span>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                      <span className="text-slate-400 text-[10px] uppercase font-bold block">Financial Terms</span>
                      <span className="font-semibold text-slate-900 block mt-0.5">
                        {selectedDoc.aiSummary.monetaryValue}
                      </span>
                    </div>
                  </div>

                  {/* Key Clauses & Risk Points */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="space-y-2">
                      <h4 className="font-bold text-slate-800 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Key Clauses &amp; Obligations</span>
                      </h4>
                      <ul className="space-y-1.5">
                        {selectedDoc.aiSummary.keyClauses.map((clause, idx) => (
                          <li key={idx} className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-slate-700 leading-relaxed">
                            {clause}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-bold text-slate-800 flex items-center gap-1.5">
                        <AlertCircle className="w-4 h-4 text-amber-600" />
                        <span>Noted Risk Points &amp; Verifications</span>
                      </h4>
                      <ul className="space-y-1.5">
                        {selectedDoc.aiSummary.potentialRiskPoints.map((point, idx) => (
                          <li key={idx} className="p-2.5 bg-amber-50/50 rounded-lg border border-amber-200 text-slate-700 leading-relaxed">
                            {point}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                </div>
              ) : (
                <div className="p-8 text-center bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-500">
                  Document has been securely uploaded. AI analysis is available when processing is complete.
                </div>
              )}

              {/* Security Integrity Notice */}
              <div className="pt-4 border-t border-slate-100 flex items-center gap-2 text-[11px] text-slate-400">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  Your document is protected by private case-level access controls.
                </span>
              </div>

            </div>
          ) : (
            <div className="p-12 text-center text-slate-400 text-sm">
              Select a document on the left to inspect its security metadata and AI summary.
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
