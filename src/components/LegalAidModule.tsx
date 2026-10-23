import React, { useState } from 'react';
import { 
  Scale, 
  HelpCircle, 
  PhoneCall, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle, 
  Building, 
  FileText,
  Shield,
  HeartHandshake
} from 'lucide-react';

export const LegalAidModule: React.FC = () => {
  const [annualIncome, setAnnualIncome] = useState<number>(150000);
  const [isWomanOrChild, setIsWomanOrChild] = useState(false);
  const [isScOrSt, setIsScOrSt] = useState(false);
  const [isInCustody, setIsInCustody] = useState(false);
  const [isPersonWithDisability, setIsPersonWithDisability] = useState(false);
  const [selectedState, setSelectedState] = useState('Delhi');

  // Statutory Criteria under Section 12, Legal Services Authorities Act 1987
  const isEligible = 
    isWomanOrChild || 
    isScOrSt || 
    isInCustody || 
    isPersonWithDisability || 
    annualIncome <= 300000;

  const legalAidBodies = [
    {
      title: 'National Legal Services Authority (NALSA)',
      jurisdiction: 'Supreme Court of India & Nationwide Policy',
      tollFree: '15100 (National Legal Aid Helpline)',
      website: 'https://nalsa.gov.in',
      address: 'Jaipur House, India Gate, New Delhi - 110001'
    },
    {
      title: 'Delhi State Legal Services Authority (DSLSA)',
      jurisdiction: 'High Court of Delhi & District Courts',
      tollFree: '1516 (24x7 Delhi Toll-Free)',
      website: 'https://dslsa.org',
      address: 'Central Office, Patiala House Courts Complex, New Delhi'
    },
    {
      title: 'Maharashtra State Legal Services Authority (MSLSA)',
      jurisdiction: 'Bombay High Court & District Legal Services',
      tollFree: '1800 233 4000',
      website: 'https://legalservices.maharashtra.gov.in',
      address: 'PWD Building, High Court, Fort, Mumbai - 400032'
    },
    {
      title: 'Tele-Law Portal (Department of Justice)',
      jurisdiction: 'Common Service Centres (CSC) Pan-India',
      tollFree: '14488 / CSC Village Level Enterpreneurs',
      website: 'https://www.tele-law.in',
      address: 'Government of India e-Governance Initiative'
    }
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full mb-3 border border-emerald-200/60">
            <HeartHandshake className="w-3.5 h-3.5 text-emerald-700" />
            <span>Article 39A · Equal Justice &amp; Free Legal Aid</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Official Legal Aid Resources &amp; Eligibility
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
            The Constitution of India guarantees free legal representation to economically weaker citizens and vulnerable sections under the <strong>Legal Services Authorities Act, 1987</strong>. Check potential eligibility and connect with government bodies.
          </p>
        </div>
      </div>

      {/* Interactive Eligibility Checker */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="pb-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Scale className="w-5 h-5 text-slate-700" />
              <span>Section 12 Eligibility Assessment</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Eligibility guidance is based on the information you provide and should be confirmed with the appropriate legal-aid authority.
            </p>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Assessment Outcome</span>
            <span className={`text-xs font-bold px-3 py-1 rounded-full border inline-block ${
              isEligible 
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-slate-100 text-slate-700 border-slate-200'
            }`}>
              {isEligible ? 'Likely Eligible for Free Counsel' : 'Standard Income Bracket'}
            </span>
          </div>
        </div>

        {/* Questionnaire Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Statutory Category Checkboxes */}
          <div className="space-y-3">
            <span className="text-xs font-semibold text-slate-800 block">
              Vulnerable &amp; Protected Categories:
            </span>

            <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer text-xs transition-colors">
              <input
                type="checkbox"
                checked={isWomanOrChild}
                onChange={(e) => setIsWomanOrChild(e.target.checked)}
                className="rounded accent-slate-900"
              />
              <span className="text-slate-700 font-medium">Woman or Child (Sec 12(c))</span>
            </label>

            <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer text-xs transition-colors">
              <input
                type="checkbox"
                checked={isScOrSt}
                onChange={(e) => setIsScOrSt(e.target.checked)}
                className="rounded accent-slate-900"
              />
              <span className="text-slate-700 font-medium">Member of Scheduled Caste / Scheduled Tribe (Sec 12(b))</span>
            </label>

            <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer text-xs transition-colors">
              <input
                type="checkbox"
                checked={isInCustody}
                onChange={(e) => setIsInCustody(e.target.checked)}
                className="rounded accent-slate-900"
              />
              <span className="text-slate-700 font-medium">Person in custody or protective home (Sec 12(g))</span>
            </label>

            <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer text-xs transition-colors">
              <input
                type="checkbox"
                checked={isPersonWithDisability}
                onChange={(e) => setIsPersonWithDisability(e.target.checked)}
                className="rounded accent-slate-900"
              />
              <span className="text-slate-700 font-medium">Person with disability or industrial workman (Sec 12(d)/(e))</span>
            </label>
          </div>

          {/* Income Ceiling Slider */}
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-800 mb-2">
                <span>Annual Family Income:</span>
                <span className="font-mono font-bold text-slate-900">₹{annualIncome.toLocaleString('en-IN')}</span>
              </div>
              <input
                type="range"
                min={50000}
                max={600000}
                step={25000}
                value={annualIncome}
                onChange={(e) => setAnnualIncome(Number(e.target.value))}
                className="w-full accent-slate-900 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
                <span>₹50,000</span>
                <span>Statutory Cap: ₹3,00,000</span>
                <span>₹6,00,000</span>
              </div>
            </div>

            {/* Assessment Box */}
            <div className={`p-4 rounded-xl border text-xs space-y-2 ${
              isEligible ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950' : 'bg-slate-50 border-slate-200 text-slate-700'
            }`}>
              <div className="font-bold flex items-center gap-1.5">
                {isEligible ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-slate-500" />}
                <span>{isEligible ? 'Statutory Grounds Met for Free Representation' : 'Above Free Aid Income Threshold'}</span>
              </div>
              <p className="leading-relaxed">
                {isEligible 
                  ? 'Based on your selected inputs, you qualify to seek free legal services, panel advocate representation, and court fee exemption through DLSA or High Court Legal Services Committee.'
                  : 'For income exceeding state thresholds, legal consultations can be scheduled with our platform verified advocates at transparent fixed consultation fees.'}
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* Official Directory of Authorities */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-900">
          Official Government Legal Aid Bodies
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {legalAidBodies.map((body, i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
              <div>
                <h4 className="text-sm font-bold text-slate-900">{body.title}</h4>
                <div className="text-xs text-slate-500 mt-0.5">{body.jurisdiction}</div>
              </div>

              <div className="space-y-1.5 text-xs text-slate-600">
                <div className="flex items-center gap-2 font-mono text-slate-900 font-semibold">
                  <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{body.tollFree}</span>
                </div>
                <div className="text-[11px] text-slate-500">
                  {body.address}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-xs">
                <span className="text-[11px] text-slate-400">Official Portal</span>
                <a
                  href={body.website}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 font-semibold text-slate-900 hover:underline"
                >
                  <span>Visit nalsa.gov.in</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
