import React, { useState } from 'react';
import { LegalTriageResult } from '../types';
import { api } from '../api';
import { 
  Sparkles, 
  Send, 
  ShieldAlert, 
  FileText, 
  ArrowRight, 
  Scale, 
  CheckCircle, 
  BookOpen, 
  Mic, 
  RefreshCw,
  Clock,
  AlertTriangle
} from 'lucide-react';

interface TriageModuleProps {
  onTriageComplete: (result: LegalTriageResult, queryText: string) => void;
  onNavigateToLawyers: (category: string) => void;
}

export const TriageModule: React.FC<TriageModuleProps> = ({
  onTriageComplete,
  onNavigateToLawyers,
}) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<LegalTriageResult | null>(null);
  const [language, setLanguage] = useState<'English' | 'Hinglish' | 'Hindi'>('Hinglish');

  const presetQueries = [
    {
      label: 'Landlord Deposit Dispute (Hinglish)',
      text: 'Mere landlord ne deposit wapas nahi kiya. Maine 1 month ka notice diya tha aur flat clean handover kiya tha, phir bhi 75,000 roke hue hai.',
    },
    {
      label: 'Cheque Bounce / Sec 138 (English)',
      text: 'A business client gave me a cheque of INR 2,50,000 which bounced yesterday with bank return memo "Funds Insufficient".',
    },
    {
      label: 'Cyber Fraud / UPI Scam (Hinglish)',
      text: 'Kal sham ek fake electricity bill message aaya tha. Link click karne ke baad mere bank account se 45,000 unauthorized deduct ho gaye.',
    },
    {
      label: 'Unpaid Salary & Wrongful Exit (English)',
      text: 'My IT company terminated me without 60-day notice pay and has withheld my last 2 months salary and gratuity clearance.',
    },
    {
      label: 'Mutual Consent Divorce (English)',
      text: 'My spouse and I have lived separately for 18 months and wish to file for mutual consent divorce with settled maintenance terms.',
    },
  ];

  const handleTriageSubmit = async (e?: React.FormEvent, customQuery?: string) => {
    if (e) e.preventDefault();
    const queryToUse = customQuery || query;
    if (!queryToUse.trim()) return;

    setLoading(true);
    try {
      const data = await api.triage(queryToUse, language);
      setResult(data);
      onTriageComplete(data, queryToUse);
    } catch (err) {
      console.warn('Legal triage service unavailable', err);
      const unavailable: LegalTriageResult = {
        category: 'Triage unavailable',
        practiceArea: 'Not verified',
        urgency: 'Low',
        confidenceLevel: 'LOW',
        citations: [],
        sourceVerified: false,
        relevantActs: [],
        summary: 'The legal triage service is currently unavailable. No legal conclusion is being generated offline. Please retry when the secure backend is available or consult a qualified advocate.',
        requiredDocuments: [],
        legalRightsSummary: 'No legal rights conclusion can be safely provided without verified sources and the full case context.',
        nextSteps: ['Retry the secure triage service.', 'If the matter is urgent, contact a qualified advocate directly.'],
        suggestedSpecializations: []
      };
      setResult(unavailable);
      onTriageComplete(unavailable, queryToUse);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPreset = (presetText: string) => {
    setQuery(presetText);
    handleTriageSubmit(undefined, presetText);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      
      {/* Hero / Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-amber-700 bg-amber-50 px-3 py-1 rounded-full mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>AI Legal Triage Engine · Indian Law Augmented</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Describe Your Legal Concern in Plain Words
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-600 leading-relaxed">
            Type or speak your problem in English, Hindi, or conversational Hinglish (e.g. <em>"Mere landlord ne deposit wapas nahi kiya"</em>). 
            Our triage engine classifies the relevant legal provisions, evidence needed, and matches verified advocates.
          </p>
        </div>

        {/* Input Box */}
        <form onSubmit={handleTriageSubmit} className="mt-6">
          <div className="relative rounded-xl border border-slate-300 focus-within:border-slate-800 focus-within:ring-2 focus-within:ring-slate-900/10 transition-all bg-slate-50/50">
            <textarea
              rows={4}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Explain what happened, dates, amounts, and any notices or agreements involved..."
              className="w-full p-4 text-sm sm:text-base bg-transparent text-slate-900 placeholder:text-slate-400 focus:outline-none resize-none"
            />
            
            <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-white border-t border-slate-200 rounded-b-xl">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 font-medium">Input Format:</span>
                {(['Hinglish', 'English', 'Hindi'] as const).map((lang) => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => setLanguage(lang)}
                    className={`px-2 py-0.5 text-xs rounded font-medium transition-colors ${
                      language === lang
                        ? 'bg-slate-900 text-white'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="submit"
                  disabled={loading || !query.trim()}
                  className="inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-xs"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-amber-300" />
                      <span>Classifying Issue...</span>
                    </>
                  ) : (
                    <>
                      <span>Run Legal Triage</span>
                      <Send className="w-4 h-4 text-amber-400" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>

        {/* Presets */}
        <div className="mt-4 pt-4 border-t border-slate-100">
          <span className="text-xs font-semibold text-slate-500 block mb-2">
            Try Common Scenarios:
          </span>
          <div className="flex flex-wrap gap-2">
            {presetQueries.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectPreset(preset.text)}
                className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-md text-left transition-colors font-medium border border-slate-200/60"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Triage Output Card */}
      {result && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs animate-in fade-in slide-in-from-bottom-3 duration-300">
          
          {/* Header Row */}
          <div className="flex flex-wrap items-start justify-between gap-4 pb-6 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                  {result.category}
                </h2>
                <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${
                  result.urgency === 'Critical' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                  result.urgency === 'High' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                  'bg-emerald-50 text-emerald-700 border-emerald-200'
                }`}>
                  Urgency: {result.urgency}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-1 text-xs text-slate-500 font-medium">
                <span>Practice Area: <strong className="text-slate-800">{result.practiceArea}</strong></span>
                <span>·</span>
                <span>Source confidence: <strong className="text-slate-800">{result.confidenceLevel}</strong></span>
              </div>
            </div>

            <button
              onClick={() => onNavigateToLawyers(result.category)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-semibold hover:bg-slate-800 transition-colors shadow-xs"
            >
              <span>Match Qualified Advocates</span>
              <ArrowRight className="w-4 h-4 text-amber-400" />
            </button>
          </div>

          {/* Grid of Triage Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            
            {/* Left Column: Summary & Relevant Laws */}
            <div className="space-y-5">
              <div>
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-slate-700" />
                  Key Facts & Legal Analysis
                </h3>
                <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200/80">
                  {result.summary}
                </p>
              </div>

              <div>
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Scale className="w-4 h-4 text-slate-700" />
                  Potentially Relevant Legal Sources
                </h3>
                <div className="flex flex-wrap gap-2">
                  {result.relevantActs.map((act, i) => (
                    <span 
                      key={i} 
                      className="text-xs bg-slate-100 text-slate-800 font-medium px-3 py-1.5 rounded-lg border border-slate-200"
                    >
                      {act}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-slate-700" />
                  Your Legal Rights Position
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 bg-amber-50/50 p-3.5 rounded-xl border border-amber-200/60 leading-relaxed">
                  {result.legalRightsSummary}
                </p>
              </div>
            </div>

            {/* Right Column: Evidence Documents & Next Steps */}
            <div className="space-y-5">
              <div>
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-slate-700" />
                  Required Evidence Documents Checklist
                </h3>
                <ul className="space-y-2">
                  {result.requiredDocuments.map((doc, idx) => (
                    <li 
                      key={idx} 
                      className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-200/60"
                    >
                      <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{doc}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <ArrowRight className="w-4 h-4 text-slate-700" />
                  Recommended Next Actions
                </h3>
                <ul className="space-y-2">
                  {result.nextSteps.map((step, idx) => (
                    <li 
                      key={idx} 
                      className="flex items-start gap-2 text-xs sm:text-sm text-slate-700"
                    >
                      <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Legal Disclaimer Footer */}
          <div className="mt-8 pt-4 border-t border-slate-100 flex items-center gap-2 text-[11px] text-slate-500">
            <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
            <span>
              Disclaimer: This automated issue classification is intended for consultation preparation and triage under Indian legal provisions. It does not constitute formal legal representation or binding judicial advice.
            </span>
          </div>

        </div>
      )}

    </div>
  );
};
