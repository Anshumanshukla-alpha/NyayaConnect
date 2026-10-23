import React, { useState } from 'react';
import { AuditLog, UserRole } from '../types';
import { 
  ShieldCheck, 
  FileText, 
  Lock, 
  Download, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Terminal,
  Database
} from 'lucide-react';

interface AuditAndPrivacyProps {
  auditLogs: AuditLog[];
  currentRole: UserRole;
}

export const AuditAndPrivacy: React.FC<AuditAndPrivacyProps> = ({
  auditLogs,
  currentRole,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'AUDIT' | 'PRIVACY'>('AUDIT');
  const [dataConsent, setDataConsent] = useState(true);
  const [analyticsConsent, setAnalyticsConsent] = useState(true);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Security Audit Logs &amp; DPDP Privacy Center
            </h1>
            <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
              DPDP Act 2023 Compliant
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Tamper-evident system activity ledger recorded via Spring <code>AuditService.java</code> and database triggers.
          </p>
        </div>

        {/* SubTab Toggle */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg border border-slate-200">
          <button
            onClick={() => setActiveSubTab('AUDIT')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
              activeSubTab === 'AUDIT' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Tamper-Evident Audit Trail ({auditLogs.length})
          </button>
          <button
            onClick={() => setActiveSubTab('PRIVACY')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
              activeSubTab === 'PRIVACY' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Privacy &amp; Data Consent
          </button>
        </div>
      </div>

      {/* Audit Log Table View */}
      {activeSubTab === 'AUDIT' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
              <Terminal className="w-4 h-4 text-slate-700" />
              <span>Immutable Activity Log (MySQL <code>audit_logs</code> Table)</span>
            </div>
            <span className="text-[11px] font-mono text-slate-400">
              Stored with SHA-256 Checksums
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px] font-semibold">
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">User &amp; Role</th>
                  <th className="py-3 px-4">Event Action</th>
                  <th className="py-3 px-4">Resource Target</th>
                  <th className="py-3 px-4">IP Address</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Event Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-mono">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 text-slate-500 whitespace-nowrap">{log.timestamp}</td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="font-bold text-slate-900 font-sans">{log.userName}</span>
                      <span className="text-[10px] text-slate-400 ml-1">({log.userRole})</span>
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-800">{log.action}</td>
                    <td className="py-3 px-4 text-slate-600 truncate max-w-[160px]">{log.resource}</td>
                    <td className="py-3 px-4 text-slate-500">{log.ipAddress}</td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        log.status === 'SUCCESS' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                      }`}>
                        {log.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-sans text-slate-600 text-[11px] max-w-[280px] truncate" title={log.details}>
                      {log.details}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Privacy & Consent Center */}
      {activeSubTab === 'PRIVACY' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="max-w-3xl space-y-2">
            <h2 className="text-lg font-bold text-slate-900">
              Personal Data Governance &amp; Purpose Specification
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Pursuant to the Digital Personal Data Protection Act (DPDP Act, 2023), NyayaConnect operates as a Data Fiduciary. We process only minimal, necessary information required to facilitate legal consultation and court case proceedings.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100 text-xs">
            
            {/* Stored Attributes Breakdown */}
            <div className="space-y-4">
              <h3 className="font-bold text-slate-900 flex items-center gap-1.5">
                <Database className="w-4 h-4 text-slate-700" />
                <span>What Information We Retain &amp; Why</span>
              </h3>

              <div className="space-y-2.5">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="font-semibold text-slate-900">Client Contact &amp; Identity</div>
                  <div className="text-slate-500 text-[11px] mt-0.5">Name, verified phone number, email address.</div>
                  <div className="text-[10px] text-slate-400 mt-1"><strong>Purpose:</strong> Video consultation scheduling &amp; advocate contact.</div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="font-semibold text-slate-900">Case Documents &amp; Pleadings</div>
                  <div className="text-slate-500 text-[11px] mt-0.5">Encrypted PDF contracts, notices, and payment receipts.</div>
                  <div className="text-[10px] text-slate-400 mt-1"><strong>Purpose:</strong> Legal analysis strictly accessible by your assigned advocate.</div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="font-semibold text-slate-900">Consultation Minutes &amp; Timeline</div>
                  <div className="text-slate-500 text-[11px] mt-0.5">Advocate legal notes, court listing dates, CNR numbers.</div>
                  <div className="text-[10px] text-slate-400 mt-1"><strong>Purpose:</strong> Ongoing litigation workflow and statutory deadlines.</div>
                </div>
              </div>
            </div>

            {/* Consent Controls & User Rights */}
            <div className="space-y-4">
              <h3 className="font-bold text-slate-900 flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-slate-700" />
                <span>Your Data Rights &amp; Consent Preferences</span>
              </h3>

              <div className="space-y-3">
                <label className="flex items-start gap-3 p-3 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={dataConsent}
                    onChange={(e) => setDataConsent(e.target.checked)}
                    className="mt-0.5 rounded accent-slate-900"
                  />
                  <div>
                    <span className="font-semibold text-slate-900 block">Advocate Access Consent</span>
                    <span className="text-[11px] text-slate-500 block leading-relaxed mt-0.5">
                      Grant authorization to your selected verified advocate to view uploaded legal instruments for 30 days.
                    </span>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={analyticsConsent}
                    onChange={(e) => setAnalyticsConsent(e.target.checked)}
                    className="mt-0.5 rounded accent-slate-900"
                  />
                  <div>
                    <span className="font-semibold text-slate-900 block">AI Triage Context Processing</span>
                    <span className="text-[11px] text-slate-500 block leading-relaxed mt-0.5">
                      Allow statutory classification engine to categorize your issue prompt without storing personal identifiers.
                    </span>
                  </div>
                </label>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => alert('DPDP Right to Data Portability: Personal data bundle export generated with cryptographic signature.')}
                  className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
                >
                  <Download className="w-3.5 h-3.5 text-amber-400" />
                  <span>Download Portable Personal Data Archive (JSON)</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
