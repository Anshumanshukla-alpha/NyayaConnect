import React, { useState } from 'react';
import { 
  Search, 
  Building2, 
  Calendar, 
  Clock, 
  FileText, 
  Scale, 
  CheckCircle2, 
  AlertTriangle,
  Info
} from 'lucide-react';

export const CaseTrackingModule: React.FC = () => {
  const [cnrInput, setCnrInput] = useState('DLSK01-008492-2026');
  const [courtComplex, setCourtComplex] = useState('Saket District Court, South Delhi');
  const [searched, setSearched] = useState(true);

  // Mock eCourts Case Details (Clearly labelled as Demo Simulation)
  const caseData = {
    cnrNumber: 'DLSK01-008492-2026',
    caseType: 'Civil Suit (Summary Recovery / Order 37 CPC)',
    filingNumber: 'CS/8492/2026',
    registrationDate: '12th September 2026',
    parties: {
      petitioner: 'Rahul Sharma (through Adv. Priya Nair)',
      respondent: 'Vipin Gupta (Property Owner / Landlord)'
    },
    coram: 'Hon\'ble Additional Senior Civil Judge, South Delhi',
    caseStatus: 'PENDING / APPEARANCE',
    stageOfCase: 'Notice Returnable / Written Statement Filing',
    nextHearingDate: '24th October 2026',
    courtNumber: 'Court Room No. 204, Saket Courts',
    interimOrders: [
      {
        orderDate: '16th September 2026',
        judge: 'Hon\'ble ASCJ',
        summary: 'Summons issued to defendant via speed post and electronic messaging. Next date fixed for appearance & WS.',
        orderType: 'Summons Notice Order'
      },
      {
        orderDate: '12th September 2026',
        judge: 'Hon\'ble ASCJ',
        summary: 'Plaint admitted under Order 37 CPC. Court fees verification report placed on record.',
        orderType: 'Admission Order'
      }
    ]
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearched(true);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* Search Bar Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-slate-800 bg-slate-100 px-3 py-1 rounded-full mb-3">
            <Scale className="w-3.5 h-3.5 text-slate-700" />
            <span>eCourts Services Integration Gateway</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Case Status &amp; CNR Number Tracker
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
            Search case status, next hearing dates, coram, and daily court orders by 16-character Case Number Record (CNR) code.
          </p>
        </div>

        {/* Search Input Box */}
        <form onSubmit={handleSearch} className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2 relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              required
              value={cnrInput}
              onChange={(e) => setCnrInput(e.target.value)}
              placeholder="Enter 16-digit CNR Number (e.g. DLSK01-008492-2026)"
              className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-slate-800 font-mono uppercase"
            />
          </div>

          <div>
            <button
              type="submit"
              className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-semibold rounded-lg transition-colors shadow-xs"
            >
              Track Case File
            </button>
          </div>
        </form>

        {/* Mandatory Transparency Notice (Rule 29) */}
        <div className="mt-4 p-3 bg-amber-50 rounded-xl border border-amber-200/80 flex items-start gap-2.5 text-xs text-amber-900">
          <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <span>
            <strong>Notice:</strong> Case-tracking information shown here may be demonstration data unless an official court-data connection is enabled. Always verify status with the relevant court or official source.
          </span>
        </div>
      </div>

      {/* Case Details Card */}
      {searched && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6 animate-in fade-in">
          
          {/* Header Row */}
          <div className="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-slate-500 uppercase">
                  CNR: {caseData.cnrNumber}
                </span>
                <span className="text-[11px] px-2.5 py-0.5 rounded-full font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {caseData.caseStatus}
                </span>
              </div>
              <h2 className="text-lg font-bold text-slate-900 mt-1">
                {caseData.parties.petitioner} <span className="text-slate-400 font-normal">vs.</span> {caseData.parties.respondent}
              </h2>
              <div className="text-xs text-slate-500 mt-1">
                Filing No: <code className="text-slate-800 font-mono">{caseData.filingNumber}</code> · Registered: <strong>{caseData.registrationDate}</strong>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Next Listing Date</span>
              <span className="text-sm font-bold font-mono text-amber-800 bg-amber-50 px-3 py-1 rounded-lg border border-amber-200 inline-block mt-0.5">
                {caseData.nextHearingDate}
              </span>
            </div>
          </div>

          {/* Key Judicial Parameters Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-400 text-[10px] uppercase font-bold block">Court Complex</span>
              <span className="font-semibold text-slate-900 block mt-0.5">{courtComplex}</span>
              <span className="text-slate-500 block text-[11px] mt-0.5">{caseData.courtNumber}</span>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-400 text-[10px] uppercase font-bold block">Presiding Judicial Officer (Coram)</span>
              <span className="font-semibold text-slate-900 block mt-0.5">{caseData.coram}</span>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-400 text-[10px] uppercase font-bold block">Current Stage of Proceedings</span>
              <span className="font-semibold text-slate-900 block mt-0.5">{caseData.stageOfCase}</span>
            </div>
          </div>

          {/* Daily Orders History */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-slate-700" />
              <span>Interim Judicial Orders &amp; Proceedings History</span>
            </h3>

            <div className="space-y-3">
              {caseData.interimOrders.map((order, idx) => (
                <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{order.orderType}</span>
                    <span className="font-mono text-slate-500 text-[11px]">{order.orderDate}</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed">{order.summary}</p>
                  <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-200/60">
                    Bench: {order.judge}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
