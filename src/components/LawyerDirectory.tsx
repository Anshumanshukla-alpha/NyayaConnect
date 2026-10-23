import React, { useState, useMemo } from 'react';
import { LawyerProfile } from '../types';
import { 
  Scale, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Languages, 
  Award, 
  Calendar, 
  IndianRupee, 
  HelpCircle,
  ShieldCheck,
  Star
} from 'lucide-react';

interface LawyerDirectoryProps {
  lawyers: LawyerProfile[];
  initialCategory?: string;
  onSelectLawyerForBooking: (lawyer: LawyerProfile) => void;
}

export const LawyerDirectory: React.FC<LawyerDirectoryProps> = ({
  lawyers,
  initialCategory,
  onSelectLawyerForBooking,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPracticeArea, setSelectedPracticeArea] = useState<string>(initialCategory || 'ALL');
  const [selectedCity, setSelectedCity] = useState<string>('ALL');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('ALL');
  const [maxBudget, setMaxBudget] = useState<number>(3000);
  const [showFormulaModal, setShowFormulaModal] = useState(false);

  // Practice area options
  const practiceAreas = [
    'ALL',
    'Property & Real Estate Law',
    'Commercial & Criminal Law',
    'Cyber Law & Criminal Defense',
    'Matrimonial & Family Dispute',
    'Labor & Employment Law',
    'Civil Litigation'
  ];

  const cities = ['ALL', 'New Delhi', 'Mumbai', 'Kolkata', 'Lucknow', 'Chennai'];
  const languages = ['ALL', 'English', 'Hindi', 'Marathi', 'Bengali', 'Tamil', 'Urdu'];

  // Explainable matching
  const calculateMatchScore = (lawyer: LawyerProfile) => {
    let score = 0;

    // 1. Practice Area (30 points)
    if (selectedPracticeArea !== 'ALL') {
      const match = lawyer.practiceAreas.some(area => 
        area.toLowerCase().includes(selectedPracticeArea.toLowerCase()) || 
        selectedPracticeArea.toLowerCase().includes(area.toLowerCase())
      );
      if (match) score += 30;
    } else {
      score += 24; // baseline for general search
    }

    // 2. Experience Depth (20 points, scaled to 15+ years)
    const expScore = Math.min(lawyer.experienceYears / 15.0, 1.0) * 20;
    score += expScore;

    // 3. Location / Court Match (15 points)
    if (selectedCity !== 'ALL') {
      if (lawyer.city.toLowerCase() === selectedCity.toLowerCase()) {
        score += 15;
      } else {
        score += 4;
      }
    } else {
      score += 12;
    }

    // 4. Language Synergy (10 points)
    if (selectedLanguage !== 'ALL') {
      if (lawyer.languages.includes(selectedLanguage)) {
        score += 10;
      }
    } else {
      score += 8;
    }

    // 5. Verification & Availability (10 points)
    if (lawyer.verificationStatus === 'VERIFIED') {
      score += 10;
    } else {
      score += 3;
    }

    // 6. Fee within budget (10 points)
    if (lawyer.consultationFee <= maxBudget) {
      score += 10;
    } else {
      score += 2;
    }

    // 7. Verified Client Rating (5 points)
    score += (lawyer.rating / 5.0) * 5;

    return Math.min(Math.round(score), 99);
  };

  // Filtered and sorted lawyers
  const filteredLawyers = useMemo(() => {
    return lawyers
      .map(lawyer => ({
        ...lawyer,
        matchScore: calculateMatchScore(lawyer)
      }))
      .filter(lawyer => {
        // Query match
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matches = 
            lawyer.name.toLowerCase().includes(q) ||
            lawyer.court.toLowerCase().includes(q) ||
            lawyer.practiceAreas.some(p => p.toLowerCase().includes(q)) ||
            lawyer.city.toLowerCase().includes(q);
          if (!matches) return false;
        }

        // Practice area match
        if (selectedPracticeArea !== 'ALL') {
          const matchesArea = lawyer.practiceAreas.some(p => 
            p.toLowerCase().includes(selectedPracticeArea.toLowerCase()) ||
            selectedPracticeArea.toLowerCase().includes(p.toLowerCase())
          );
          if (!matchesArea) return false;
        }

        // City match
        if (selectedCity !== 'ALL' && lawyer.city !== selectedCity) return false;

        // Language match
        if (selectedLanguage !== 'ALL' && !lawyer.languages.includes(selectedLanguage)) return false;

        // Budget match
        if (lawyer.consultationFee > maxBudget) return false;

        return true;
      })
      .sort((a, b) => b.matchScore - a.matchScore);
  }, [lawyers, searchQuery, selectedPracticeArea, selectedCity, selectedLanguage, maxBudget]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* Header with Title and Search Controls */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                Verified Advocates Directory
              </h1>
              <span className="text-xs text-slate-500 font-mono">({filteredLawyers.length} Available)</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Find Bar Council verified legal counsel with transparent deterministic Platform Match Scoring.
            </p>
          </div>

          <button
            onClick={() => setShowFormulaModal(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <HelpCircle className="w-4 h-4 text-slate-500" />
            <span>How Match Score is Calculated</span>
          </button>
        </div>

        {/* Filter Controls Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mt-4">
          
          {/* Search Input */}
          <div className="relative lg:col-span-2">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, court, or keyword..."
              className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-slate-800"
            />
          </div>

          {/* Practice Area Filter */}
          <div>
            <select
              value={selectedPracticeArea}
              onChange={(e) => setSelectedPracticeArea(e.target.value)}
              className="w-full py-2 px-3 text-xs sm:text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-slate-800 bg-white"
            >
              <option value="ALL">All Practice Areas</option>
              {practiceAreas.filter(p => p !== 'ALL').map((area) => (
                <option key={area} value={area}>{area}</option>
              ))}
            </select>
          </div>

          {/* City / Jurisdiction */}
          <div>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full py-2 px-3 text-xs sm:text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-slate-800 bg-white"
            >
              <option value="ALL">All Jurisdictions</option>
              {cities.filter(c => c !== 'ALL').map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Max Fee Slider */}
          <div className="flex flex-col justify-center px-1">
            <div className="flex justify-between text-[11px] font-medium text-slate-600 mb-1">
              <span>Max Fee:</span>
              <span className="font-mono font-semibold">₹{maxBudget}</span>
            </div>
            <input
              type="range"
              min={500}
              max={3000}
              step={100}
              value={maxBudget}
              onChange={(e) => setMaxBudget(Number(e.target.value))}
              className="w-full accent-slate-900 cursor-pointer"
            />
          </div>

        </div>
      </div>

      {/* Lawyers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLawyers.map((lawyer) => {
          const isVerified = lawyer.verificationStatus === 'VERIFIED';
          return (
            <div 
              key={lawyer.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between shadow-xs hover:border-slate-300 transition-all group"
            >
              <div>
                
                {/* Top Info & Match Score */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h2 className="text-base font-bold text-slate-900 group-hover:text-slate-800">
                        {lawyer.name}
                      </h2>
                      {isVerified && (
                        <span title="Bar Council Verified Advocate">
                          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] font-mono text-slate-500 mt-0.5">
                      Bar Enr: {lawyer.barCouncilNumber}
                    </div>
                  </div>

                  {/* Deterministic Match Score Badge */}
                  <div className="text-right">
                    <div className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-900 text-white rounded-lg text-xs font-bold font-mono">
                      <span>{lawyer.matchScore}%</span>
                    </div>
                    <div className="text-[9px] text-slate-500 font-medium tracking-tight mt-0.5">
                      Platform Match
                    </div>
                  </div>
                </div>

                {/* Court & Location */}
                <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-600">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{lawyer.court} · {lawyer.city}</span>
                </div>

                {/* Experience & Rating */}
                <div className="mt-2 flex items-center gap-3 text-xs text-slate-600">
                  <div className="flex items-center gap-1">
                    <Award className="w-3.5 h-3.5 text-slate-400" />
                    <span>{lawyer.experienceYears} Years Exp.</span>
                  </div>
                  <span>·</span>
                  <div className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                    <span className="font-semibold">{lawyer.rating}</span>
                    <span className="text-slate-400">({lawyer.reviewCount})</span>
                  </div>
                </div>

                {/* Practice Areas */}
                <div className="mt-3">
                  <div className="flex flex-wrap gap-1.5">
                    {lawyer.practiceAreas.map((area, i) => (
                      <span 
                        key={i} 
                        className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium border border-slate-200/60"
                      >
                        {area}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bio Snippet */}
                <p className="mt-3 text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  {lawyer.bio}
                </p>

                {/* Languages */}
                <div className="mt-3 flex items-center gap-1.5 text-[11px] text-slate-500">
                  <Languages className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{lawyer.languages.join(', ')}</span>
                </div>

              </div>

              {/* Bottom Actions: Fee & Book Button */}
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Fee / 30 Min</span>
                  <div className="flex items-center font-mono font-bold text-base text-slate-900">
                    <IndianRupee className="w-4 h-4" />
                    <span>{lawyer.consultationFee}</span>
                  </div>
                </div>

                <button
                  onClick={() => onSelectLawyerForBooking(lawyer)}
                  disabled={!isVerified}
                  className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all shadow-xs ${
                    isVerified
                      ? 'bg-slate-900 text-white hover:bg-slate-800'
                      : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  {isVerified ? 'Book Consultation' : 'Pending Verification'}
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {filteredLawyers.length === 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <Scale className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No Advocates Match Current Filters</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
            Try expanding your maximum fee slider or resetting practice area and jurisdiction filters.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedPracticeArea('ALL');
              setSelectedCity('ALL');
              setSelectedLanguage('ALL');
              setMaxBudget(3000);
            }}
            className="mt-4 px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-slate-800"
          >
            Reset All Filters
          </button>
        </div>
      )}

      {/* Formula Explanation Modal */}
      {showFormulaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900">
              Platform Match Score Calculation Formula
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Matching is based on your selected practice area, jurisdiction, experience, language and verification status.
            </p>

            <div className="mt-4 space-y-2.5 text-xs text-slate-700">
              <div className="flex justify-between p-2 bg-slate-50 rounded-lg">
                <span className="font-semibold">Practice Area Alignment:</span>
                <span className="font-mono font-bold text-slate-900">30%</span>
              </div>
              <div className="flex justify-between p-2 bg-slate-50 rounded-lg">
                <span className="font-semibold">Experience Depth (&gt;15 years max):</span>
                <span className="font-mono font-bold text-slate-900">20%</span>
              </div>
              <div className="flex justify-between p-2 bg-slate-50 rounded-lg">
                <span className="font-semibold">Court &amp; City Jurisdiction:</span>
                <span className="font-mono font-bold text-slate-900">15%</span>
              </div>
              <div className="flex justify-between p-2 bg-slate-50 rounded-lg">
                <span className="font-semibold">Language Compatibility:</span>
                <span className="font-mono font-bold text-slate-900">10%</span>
              </div>
              <div className="flex justify-between p-2 bg-slate-50 rounded-lg">
                <span className="font-semibold">Slot Availability &amp; Bar Verification:</span>
                <span className="font-mono font-bold text-slate-900">10%</span>
              </div>
              <div className="flex justify-between p-2 bg-slate-50 rounded-lg">
                <span className="font-semibold">Consultation Fee within Budget:</span>
                <span className="font-mono font-bold text-slate-900">10%</span>
              </div>
              <div className="flex justify-between p-2 bg-slate-50 rounded-lg">
                <span className="font-semibold">Verified Client Review Score:</span>
                <span className="font-mono font-bold text-slate-900">5%</span>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowFormulaModal(false)}
                className="px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-slate-800"
              >
                Understood
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
