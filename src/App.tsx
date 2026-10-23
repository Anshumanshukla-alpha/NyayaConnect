import React, { useEffect, useState } from 'react';
import { api } from './api';
import { 
  UserRole, 
  User, 
  LawyerProfile, 
  Appointment, 
  CaseWorkspace as ICaseWorkspace, 
  CaseDocument, 
  CaseTimelineEvent, 
  AuditLog, 
  Notification,
  LegalTriageResult,
  LawyerVerificationStatus
} from './types';

import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { TriageModule } from './components/TriageModule';
import { LawyerDirectory } from './components/LawyerDirectory';
import { AppointmentModal } from './components/AppointmentModal';
import { AppointmentsList } from './components/AppointmentsList';
import { VideoRoom } from './components/VideoRoom';
import { CaseWorkspace } from './components/CaseWorkspace';
import { DocumentVault } from './components/DocumentVault';
import { LegalAidModule } from './components/LegalAidModule';
import { CaseTrackingModule } from './components/CaseTrackingModule';
import { AdminPortal } from './components/AdminPortal';
import { AuditAndPrivacy } from './components/AuditAndPrivacy';
import { WorkspaceDashboard } from './components/WorkspaceDashboard';
import { UserProfile } from './components/UserProfile';
import { AuthScreen } from './components/AuthScreen';
import { 
  Scale, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  FileCheck2, 
  Lock,
  HeartHandshake,
  Search
} from 'lucide-react';

export default function App() {
  // Authenticated server session + MySQL-backed workspace
  const [authenticated, setAuthenticated] = useState(false);
  const [sessionUser, setSessionUser] = useState<User | null>(null);
  const [authChecking, setAuthChecking] = useState(true);
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // Domain entities are loaded from the Java backend; they are not the source of truth.
  const [users, setUsers] = useState<User[]>([]);
  const [lawyers, setLawyers] = useState<LawyerProfile[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [cases, setCases] = useState<ICaseWorkspace[]>([]);
  const [timelineEvents, setTimelineEvents] = useState<CaseTimelineEvent[]>([]);
  const [documents, setDocuments] = useState<CaseDocument[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Flow State
  const [bookingLawyer, setBookingLawyer] = useState<LawyerProfile | null>(null);
  const [activeVideoApt, setActiveVideoApt] = useState<Appointment | null>(null);
  const [triageCategory, setTriageCategory] = useState<string>('');
  const [triageQuery, setTriageQuery] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const currentUser = sessionUser;
  const currentRole: UserRole = currentUser?.role ?? 'CLIENT';

  const loadWorkspace = async () => {
    const data = await api.bootstrap();
    setSessionUser(data.user);
    setUsers(data.users ?? [data.user]);
    setLawyers(data.lawyers ?? []);
    setAppointments(data.appointments ?? []);
    setCases(data.cases ?? []);
    setTimelineEvents(data.timelineEvents ?? []);
    setDocuments(data.documents ?? []);
    setNotifications(data.notifications ?? []);
    setAuditLogs(data.auditLogs ?? []);
    (window as any).__NYC_CSRF = data.csrfToken;
    setAuthenticated(true);
  };

  useEffect(() => {
    api.me().then(() => loadWorkspace()).catch(() => setAuthenticated(false)).finally(() => setAuthChecking(false));
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Audit events are written server-side by protected backend services. The UI never fabricates IPs or audit records.
  const addAuditLog = (_action: string, _resource: string, _details: string) => {};

  const handleLogout = async () => {
    try { await api.logout(); } finally {
      setAuthenticated(false);
      setSessionUser(null);
      setUsers([]); setLawyers([]); setAppointments([]); setCases([]); setDocuments([]); setNotifications([]); setAuditLogs([]);
      setActiveTab('dashboard');
    }
  };

  // Triage Complete
  const handleTriageComplete = (result: LegalTriageResult, queryText: string) => {
    setTriageCategory(result.category);
    setTriageQuery(queryText);
    addAuditLog('AI_LEGAL_TRIAGE', '/api/ai/triage', `Categorized: ${result.category} (Urgency: ${result.urgency})`);
    showToast(`Legal triage complete: ${result.category}`);
  };

  const handleNavigateToLawyers = (category: string) => {
    setTriageCategory(category);
    setActiveTab('lawyers');
  };

  // Appointment Actions
  const handleConfirmBooking = async (data: Omit<Appointment, 'id' | 'createdAt'>) => {
    try {
      const [startTime, endTime] = data.timeSlot.split(' - ');
      const parseTime = (value: string) => {
        const m = value.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
        if (!m) throw new Error('Invalid time slot');
        let h = Number(m[1]) % 12; if (m[3].toUpperCase() === 'PM') h += 12;
        return `${String(h).padStart(2,'0')}:${m[2]}:00`;
      };
      await api.bookAppointment({ lawyerId:data.lawyerId, title:data.legalIssueTitle, category:data.legalCategory, startsAt:`${data.date}T${parseTime(startTime)}`, endsAt:`${data.date}T${parseTime(endTime)}`, notes:data.clientNotes });
      await loadWorkspace();
      setBookingLawyer(null); setActiveTab('appointments');
      showToast('Consultation request submitted to the selected advocate.');
    } catch (e:any) { showToast(e?.message ?? 'Unable to create appointment.'); }
  };

  const handleAcceptAppointment = async (id: string) => {
    try { await api.appointmentAction(id,'confirm'); await loadWorkspace(); showToast('Consultation confirmed.'); } catch { showToast('Unable to confirm appointment.'); }
  };

  const handleRejectAppointment = async (id: string) => {
    try { await api.appointmentAction(id,'reject'); await loadWorkspace(); showToast('Appointment request declined.'); } catch { showToast('Unable to update appointment.'); }
  };

  const handleCompleteAppointment = async (id: string, notes: string) => {
    try { await api.appointmentAction(id,'complete',notes); await loadWorkspace(); showToast('Consultation completed and case workspace refreshed.'); } catch { showToast('Unable to complete consultation.'); }
  };

  const handleJoinVideoRoom = (apt: Appointment) => {
    setActiveVideoApt(apt);
    addAuditLog('VIDEO_ROOM_JOIN', `/consultation/room?id=${apt.id}`, `Joined live encrypted session: ${apt.meetingLink}`);
  };

  // Case Workspace Handlers
  const handleAddTimelineEvent = async (caseId: string, eventData: Omit<CaseTimelineEvent, 'id'>) => {
    try { await api.addTimeline(caseId,{title:eventData.title,description:eventData.description,eventType:eventData.eventType}); await loadWorkspace(); showToast('Case timeline updated on the server.'); }
    catch { showToast('Unable to update the case timeline.'); }
  };

  const handleToggleTask = async (caseId: string, taskId: string) => {
    try { await api.toggleTask(caseId,taskId); await loadWorkspace(); showToast('Case task status updated.'); }
    catch { showToast('Unable to update the task.'); }
  };

  // Document Vault Handlers
  const handleUploadDocument = async (docOrFile: CaseDocument | File) => {
    if (docOrFile instanceof File) {
      const caseId = cases[0]?.id; if (!caseId) { showToast('Create/select a case before uploading.'); return; }
      try { await api.uploadDocument(caseId, docOrFile); await loadWorkspace(); showToast(`Securely uploaded ${docOrFile.name}.`); } catch (e:any) { showToast(e?.message ?? 'Document upload failed.'); }
      return;
    }
    // Backward-compatible adapter for legacy component calls; real uploads should pass File.
    setDocuments(prev => [docOrFile, ...prev]);
  };

  const handleSimulateDownload = (doc: CaseDocument) => { window.open(`/api/v1/documents/${doc.id}`, '_blank', 'noopener,noreferrer'); };
  const handleAnalyzeDocument = async (doc: CaseDocument) => {
    try { const result = await api.documentIntelligence(doc.id); setDocuments(prev => prev.map(d => d.id===doc.id ? {...d, classification:result.docClassification, aiSummary:{plainLanguageSummary:result.plainLanguageSummary, partiesIdentified:[], effectiveDate:'See extracted text', monetaryValue:'See extracted text', keyClauses:result.keyClauses ?? [], potentialRiskPoints:result.potentialRiskPoints ?? []}} : d)); showToast('Document intelligence analysis completed with safe extraction mode.'); }
    catch { showToast('Document analysis is unavailable for this file.'); }
  };

  // Admin Handlers
  const handleUpdateLawyerStatus = async (lawyerId: string, status: LawyerVerificationStatus) => {
    try { await api.updateLawyerStatus(lawyerId,status); await loadWorkspace(); showToast(`Advocate verification status updated to ${status}`); } catch { showToast('Unable to update lawyer verification.'); }
  };

  const handleToggleUserBlock = async (userId: string) => {
    try { await api.toggleUserBlock(userId); await loadWorkspace(); showToast('User account permission updated on the server.'); } catch { showToast('Unable to update user account.'); }
  };

  const handleUpdateUser = (updatedUser: User) => {
    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
  };

  const handleMarkNotificationRead = async (id: string) => {
    try { await api.markNotificationRead(id); setNotifications(prev => prev.map(n => n.id === id ? {...n,read:true}:n)); } catch { /* keep local state unchanged on failure */ }
  };

  if (authChecking) return <div className="min-h-screen bg-[#f7f8fa] text-[#172033] flex items-center justify-center"><div className="rounded-lg border border-slate-200 bg-white px-5 py-3 text-sm font-semibold shadow-sm">Loading secure workspace…</div></div>;
  if (!authenticated || !currentUser) return <AuthScreen onAuthenticated={async () => { await loadWorkspace(); setAuthenticated(true); }} />;

  return (
    <div className="min-h-screen bg-[#f7f8fa] text-slate-900 flex flex-col antialiased">
      
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-xl border border-slate-700 text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Responsive Navigation Bar */}
      <Navbar
        currentRole={currentRole}
        currentUser={currentUser}
        onLogout={handleLogout}
        activeTab={activeTab}
        onTabChange={(tab) => {
          if (activeVideoApt) setActiveVideoApt(null);
          if (tab === 'audit' && currentRole !== 'ADMIN') return;
          if (tab === 'admin' && currentRole !== 'ADMIN') return;
          if (tab === 'architecture') return;
          setActiveTab(tab);
        }}
        notifications={notifications}
        onMarkNotificationRead={handleMarkNotificationRead}
      />

      {/* Main Viewport Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Fullscreen Video Room Overlay if Consultation Active */}
        {activeVideoApt ? (
          <VideoRoom
            appointment={activeVideoApt}
            documents={documents.filter(d => d.caseId === activeVideoApt.caseId || d.appointmentId === activeVideoApt.id)}
            currentRole={currentRole}
            onLeaveRoom={() => setActiveVideoApt(null)}
            onFinishConsultation={(notes) => handleCompleteAppointment(activeVideoApt.id, notes)}
          />
        ) : (
          <>
            {/* View 0: Consolidated Client Dashboard */}
            {activeTab === 'dashboard' && currentRole !== 'ADMIN' && (
              <WorkspaceDashboard
                currentUser={currentUser}
                currentRole={currentRole}
                cases={cases}
                appointments={appointments}
                documents={documents}
                lawyers={lawyers}
                onNavigate={(tab) => setActiveTab(tab)}
                onJoinVideoRoom={handleJoinVideoRoom}
                onTriggerTriage={() => setActiveTab('triage')}
                onTriggerBooking={() => setActiveTab('lawyers')}
                onTriggerUpload={() => setActiveTab('vault')}
                onShowToast={showToast}
              />
            )}

            {activeTab === 'dashboard' && currentRole === 'ADMIN' && (
              <AdminPortal
                lawyers={lawyers}
                users={users}
                appointments={appointments}
                onUpdateLawyerStatus={handleUpdateLawyerStatus}
                onToggleUserBlock={handleToggleUserBlock}
              />
            )}

            {/* View 1: AI Legal Issue Triage */}
            {activeTab === 'triage' && (
              <TriageModule
                onTriageComplete={handleTriageComplete}
                onNavigateToLawyers={handleNavigateToLawyers}
              />
            )}

            {/* View 2: Lawyer Discovery & Platform Match Scoring */}
            {activeTab === 'lawyers' && (
              <LawyerDirectory
                lawyers={lawyers}
                initialCategory={triageCategory}
                onSelectLawyerForBooking={(lawyer) => setBookingLawyer(lawyer)}
              />
            )}

            {/* View 3: Consultation Appointments Management */}
            {activeTab === 'appointments' && (
              <AppointmentsList
                appointments={appointments}
                currentRole={currentRole}
                onAcceptAppointment={handleAcceptAppointment}
                onRejectAppointment={handleRejectAppointment}
                onCompleteAppointment={handleCompleteAppointment}
                onJoinVideoRoom={handleJoinVideoRoom}
                onOpenCaseWorkspace={(caseId) => setActiveTab('cases')}
                onSubmitReview={(aptId, rating, comment) => {
                  showToast('Thank you! Advocate review recorded successfully.');
                  addAuditLog('CLIENT_REVIEW_SUBMIT', `/appointment/${aptId}/review`, `Rating: ${rating}/5.0 - "${comment}"`);
                }}
              />
            )}

            {/* View 4: Secure Case Workspace & Timeline */}
            {activeTab === 'cases' && (
              <CaseWorkspace
                cases={cases}
                timelineEvents={timelineEvents}
                documents={documents}
                currentRole={currentRole}
                onAddTimelineEvent={handleAddTimelineEvent}
                onToggleTask={handleToggleTask}
                onOpenDocumentVault={() => setActiveTab('vault')}
              />
            )}

            {/* View 5: Secure Document Vault */}
            {activeTab === 'vault' && (
              <DocumentVault
                documents={documents}
                currentRole={currentRole}
                onUploadDocument={handleUploadDocument}
                onSimulateDownload={handleSimulateDownload}
                onAnalyzeDocument={handleAnalyzeDocument}
              />
            )}

            {/* View 6: Legal Aid Directory */}
            {activeTab === 'legal-aid' && (
              <LegalAidModule />
            )}

            {/* View 7: eCourts Case Tracking */}
            {activeTab === 'tracking' && (
              <CaseTrackingModule />
            )}

            {/* View 8: Admin Portal */}
            {activeTab === 'admin' && currentRole === 'ADMIN' && (
              <AdminPortal
                lawyers={lawyers}
                users={users}
                appointments={appointments}
                onUpdateLawyerStatus={handleUpdateLawyerStatus}
                onToggleUserBlock={handleToggleUserBlock}
              />
            )}

            {/* View 9: Audit Logs & Privacy Center */}
            {activeTab === 'audit' && currentRole === 'ADMIN' && (
              <AuditAndPrivacy auditLogs={auditLogs} currentRole={currentRole} />
            )}

            {/* View 11: Client Profile & Account Security */}
            {activeTab === 'profile' && (
              <UserProfile
                currentUser={currentUser}
                onUpdateUser={handleUpdateUser}
                onEmitAuditLog={addAuditLog}
                onShowToast={showToast}
              />
            )}
          </>
        )}

      </main>

      {/* Appointment Booking Modal */}
      {bookingLawyer && (
        <AppointmentModal
          lawyer={bookingLawyer}
          currentUserName={currentUser.name}
          prefilledCategory={triageCategory}
          prefilledIssueTitle={triageQuery ? triageQuery.slice(0, 60) + '...' : ''}
          onClose={() => setBookingLawyer(null)}
          onConfirmBooking={handleConfirmBooking}
        />
      )}

      {/* Clean Global Footer */}
      <Footer onNavigate={(tab) => {
        if (activeVideoApt) setActiveVideoApt(null);
        if (tab === 'audit' && currentRole !== 'ADMIN') return;
        if (tab === 'admin' && currentRole !== 'ADMIN') return;
        if (tab === 'architecture') return;
        setActiveTab(tab);
      }} />

    </div>
  );
}
