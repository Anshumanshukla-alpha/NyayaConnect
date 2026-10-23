import React, { useState } from 'react';
import { LawyerProfile, User, Appointment, LawyerVerificationStatus } from '../types';
import { 
  ShieldAlert, 
  CheckCircle2, 
  XCircle, 
  UserX, 
  UserCheck, 
  Scale, 
  FileCheck2, 
  Briefcase, 
  Search, 
  Building2,
  Award,
  AlertTriangle
} from 'lucide-react';

interface AdminPortalProps {
  lawyers: LawyerProfile[];
  users: User[];
  appointments: Appointment[];
  onUpdateLawyerStatus: (lawyerId: string, status: LawyerVerificationStatus) => void;
  onToggleUserBlock: (userId: string) => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  lawyers,
  users,
  appointments,
  onUpdateLawyerStatus,
  onToggleUserBlock,
}) => {
  const [activeAdminTab, setActiveAdminTab] = useState<'LAWYERS' | 'USERS' | 'APPOINTMENTS'>('LAWYERS');
  const [searchQuery, setSearchQuery] = useState('');

  const pendingLawyers = lawyers.filter(l => l.verificationStatus !== 'VERIFIED');
  const verifiedLawyers = lawyers.filter(l => l.verificationStatus === 'VERIFIED');

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* Header with Metrics */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                System Administration &amp; Bar Verification Portal
              </h1>
              <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-slate-900 text-white font-bold">
                Admin Level 1
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Supervise advocate verification, manage account access and oversee platform compliance.
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg border border-slate-200">
            <button
              onClick={() => setActiveAdminTab('LAWYERS')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                activeAdminTab === 'LAWYERS' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Lawyer Verification ({pendingLawyers.length} Pending)
            </button>
            <button
              onClick={() => setActiveAdminTab('USERS')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                activeAdminTab === 'USERS' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              User Accounts ({users.length})
            </button>
            <button
              onClick={() => setActiveAdminTab('APPOINTMENTS')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                activeAdminTab === 'APPOINTMENTS' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Consultations ({appointments.length})
            </button>
          </div>
        </div>

        {/* Quick Stats Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4 pt-2 text-xs">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-slate-400 text-[10px] uppercase font-bold block">Total Registered Users</span>
            <span className="text-lg font-bold font-mono text-slate-900 mt-0.5 block">{users.length}</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-slate-400 text-[10px] uppercase font-bold block">Verified Advocates</span>
            <span className="text-lg font-bold font-mono text-emerald-700 mt-0.5 block">{verifiedLawyers.length}</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-slate-400 text-[10px] uppercase font-bold block">Verification Queue</span>
            <span className="text-lg font-bold font-mono text-amber-700 mt-0.5 block">{pendingLawyers.length}</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-slate-400 text-[10px] uppercase font-bold block">Platform Appointments</span>
            <span className="text-lg font-bold font-mono text-slate-900 mt-0.5 block">{appointments.length}</span>
          </div>
        </div>
      </div>

      {/* Tab 1: Lawyer Verification Queue */}
      {activeAdminTab === 'LAWYERS' && (
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-slate-900">
            Advocate Verification &amp; Bar Council Accreditation Queue
          </h2>

          <div className="space-y-3">
            {lawyers.map((lawyer) => {
              const isVerified = lawyer.verificationStatus === 'VERIFIED';
              return (
                <div 
                  key={lawyer.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-wrap items-center justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-slate-900">{lawyer.name}</h3>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold border ${
                        isVerified ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                        lawyer.verificationStatus === 'PENDING' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                        'bg-rose-50 text-rose-700 border-rose-200'
                      }`}>
                        {lawyer.verificationStatus}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
                      <span>Bar Enrollment: <strong className="text-slate-800 font-mono">{lawyer.barCouncilNumber}</strong></span>
                      <span>·</span>
                      <span>Jurisdiction: <strong>{lawyer.court}</strong></span>
                      <span>·</span>
                      <span>Experience: <strong>{lawyer.experienceYears} Years</strong></span>
                    </div>

                    <p className="text-xs text-slate-500 mt-1">
                      Practice Areas: {lawyer.practiceAreas.join(', ')}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {!isVerified ? (
                      <>
                        <button
                          onClick={() => onUpdateLawyerStatus(lawyer.id, 'REJECTED')}
                          className="px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg border border-rose-200 transition-colors"
                        >
                          Reject
                        </button>
                        <button
                          onClick={() => onUpdateLawyerStatus(lawyer.id, 'VERIFIED')}
                          className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-xs"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Approve &amp; Verify</span>
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => onUpdateLawyerStatus(lawyer.id, 'SUSPENDED')}
                        className="px-3 py-1.5 text-xs font-semibold text-amber-700 hover:bg-amber-50 rounded-lg border border-amber-200 transition-colors"
                      >
                        Suspend License
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 2: User Accounts & Block/Unblock */}
      {activeAdminTab === 'USERS' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900">
            Platform Users Directory &amp; Access Controls
          </h2>

          <div className="divide-y divide-slate-100">
            {users.map((u) => (
              <div key={u.id} className="py-3.5 flex items-center justify-between gap-4 text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">{u.name}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600 uppercase font-bold">
                      {u.role}
                    </span>
                    {u.isBlocked && (
                      <span className="text-[10px] px-2 py-0.5 rounded bg-rose-100 text-rose-700 font-bold">
                        BLOCKED
                      </span>
                    )}
                  </div>
                  <div className="text-slate-500 mt-0.5">
                    {u.email} · {u.phone} · {u.city}
                  </div>
                </div>

                <div>
                  {u.role !== 'ADMIN' && (
                    <button
                      onClick={() => onToggleUserBlock(u.id)}
                      className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                        u.isBlocked
                          ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                          : 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                      }`}
                    >
                      {u.isBlocked ? 'Unblock User' : 'Block User'}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Appointments Overview */}
      {activeAdminTab === 'APPOINTMENTS' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900">
            All Appointments Across Platform
          </h2>

          <div className="divide-y divide-slate-100 text-xs">
            {appointments.map((apt) => (
              <div key={apt.id} className="py-3.5 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <span className="font-bold text-slate-900">{apt.legalIssueTitle}</span>
                  <div className="text-slate-500 mt-0.5">
                    Client: <strong>{apt.clientName}</strong> · Advocate: <strong>{apt.lawyerName}</strong> · Date: {apt.date} ({apt.timeSlot})
                  </div>
                </div>

                <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-semibold border ${
                  apt.status === 'CONFIRMED' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                  apt.status === 'PENDING' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                  apt.status === 'COMPLETED' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' :
                  'bg-rose-50 text-rose-700 border-rose-200'
                }`}>
                  {apt.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
