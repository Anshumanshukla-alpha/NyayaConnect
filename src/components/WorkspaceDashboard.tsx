import React, { useMemo } from 'react';
import {
  ArrowRight, CalendarDays, CheckCircle2, Clock3, FileText, HeartHandshake,
  LockKeyhole, Search, Scale, ShieldCheck, UploadCloud, Video
} from 'lucide-react';
import { Appointment, CaseDocument, CaseWorkspace, LawyerProfile, User, UserRole } from '../types';
import { api } from '../api';

interface WorkspaceDashboardProps {
  currentUser: User;
  currentRole: UserRole;
  cases: CaseWorkspace[];
  appointments: Appointment[];
  documents: CaseDocument[];
  lawyers: LawyerProfile[];
  onNavigate: (tab: string) => void;
  onJoinVideoRoom: (appointment: Appointment) => void;
  onTriggerTriage: () => void;
  onTriggerBooking: () => void;
  onTriggerUpload: () => void;
  onShowToast: (message: string) => void;
}

const formatDate = (value?: string) => {
  if (!value) return 'Not scheduled';
  const normalized = value.includes('T') ? value : value.replace(' ', 'T');
  const date = new Date(normalized);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
};

const formatDateTime = (value?: string) => {
  if (!value) return 'Not scheduled';
  const normalized = value.includes('T') ? value : value.replace(' ', 'T');
  const date = new Date(normalized);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' });
};

const greeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  if (hour < 21) return 'Good evening';
  return 'Good night';
};

const StatusBadge = ({ status }: { status: string }) => {
  const tone = status === 'CONFIRMED' || status === 'ACTIVE' || status === 'VERIFIED'
    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
    : status === 'PENDING' || status === 'OPEN'
      ? 'bg-amber-50 text-amber-700 border-amber-200'
      : 'bg-slate-100 text-slate-600 border-slate-200';
  return <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold ${tone}`}>{status.replaceAll('_', ' ')}</span>;
};

const QuickLink = ({ icon: Icon, title, description, onClick }: { icon: React.ElementType; title: string; description: string; onClick: () => void }) => (
  <button onClick={onClick} className="group rounded-xl border border-slate-200 bg-white p-5 text-left transition hover:border-[#b79a63] hover:shadow-[0_8px_24px_rgba(15,23,42,0.06)]">
    <div className="flex items-center justify-between">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#f4f0e7] text-[#80601d]"><Icon className="h-4 w-4" /></div>
      <ArrowRight className="h-4 w-4 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-[#80601d]" />
    </div>
    <div className="mt-4 text-sm font-semibold text-[#172033]">{title}</div>
    <div className="mt-1 text-xs leading-5 text-slate-500">{description}</div>
  </button>
);

const EmptyPanel = ({ title, text, action, onClick }: { title: string; text: string; action?: string; onClick?: () => void }) => (
  <div className="rounded-xl border border-dashed border-slate-300 bg-[#fbfaf7] p-6">
    <div className="text-sm font-semibold text-[#172033]">{title}</div>
    <p className="mt-1 text-sm leading-6 text-slate-500">{text}</p>
    {action && onClick && <button onClick={onClick} className="mt-4 text-sm font-semibold text-[#80601d] hover:underline">{action} →</button>}
  </div>
);

export const WorkspaceDashboard: React.FC<WorkspaceDashboardProps> = ({
  currentUser, currentRole, cases, appointments, documents, lawyers,
  onNavigate, onJoinVideoRoom, onTriggerTriage, onTriggerBooking,
  onTriggerUpload, onShowToast
}) => {
  const activeCases = cases.filter(c => ['OPEN', 'ACTIVE', 'ON_HOLD'].includes(c.status));
  const activeCase = activeCases[0] ?? cases[0];
  const pendingTasks = activeCases.flatMap(c => c.tasks.filter(t => !t.completed).map(task => ({ ...task, caseTitle: c.title, caseId: c.id })));
  const nextTask = [...pendingTasks].sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())[0];
  const upcoming = appointments.find(a => ['CONFIRMED', 'PENDING'].includes(a.status));
  const confirmedCount = appointments.filter(a => a.status === 'CONFIRMED').length;
  const pendingCount = appointments.filter(a => a.status === 'PENDING').length;
  const completedTasks = activeCase?.tasks.filter(t => t.completed).length ?? 0;
  const totalTasks = activeCase?.tasks.length ?? 0;
  const progress = totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const verifiedLawyers = useMemo(
    () => lawyers.filter(l => l.verificationStatus === 'VERIFIED').sort((a, b) => b.rating - a.rating).slice(0, 3),
    [lawyers]
  );

  const prepareBrief = async () => {
    try {
      await api.consultationBrief({
        caseTitle: activeCase?.title,
        category: activeCase?.category,
        clientName: activeCase?.clientName ?? currentUser.name,
        description: activeCase?.description,
        language: currentUser.preferredLanguage === 'Hindi' ? 'Hinglish' : 'English'
      });
      onShowToast('Consultation preparation notes are ready.');
    } catch {
      onShowToast('Consultation preparation is temporarily unavailable.');
    }
  };

  if (currentRole === 'LAWYER') {
    const myAppointments = appointments.filter(a => a.lawyerId === currentUser.id || a.status === 'PENDING');
    const pending = myAppointments.filter(a => a.status === 'PENDING');
    const next = myAppointments.find(a => ['CONFIRMED', 'PENDING'].includes(a.status));
    const lawyerCases = cases.filter(c => c.lawyerId === currentUser.id);

    return (
      <div className="nyaya-client-home space-y-8">
        <section className="border-b border-slate-200 pb-7">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#80601d]">Advocate workspace</div>
              <h1 className="mt-2 font-serif text-3xl font-semibold tracking-tight text-[#172033]">{greeting()}, {currentUser.name.split(' ').slice(-1)[0]}</h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">Keep consultations, client matters and required actions in one professional workspace.</p>
            </div>
            <button onClick={prepareBrief} className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#172033] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#26334b]"><FileText className="h-4 w-4" /> Prepare consultation notes</button>
          </div>
        </section>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ['Open matters', lawyerCases.length],
            ['Upcoming consultations', myAppointments.filter(a => ['CONFIRMED', 'PENDING'].includes(a.status)).length],
            ['Pending requests', pending.length],
            ['Documents', documents.length]
          ].map(([label, value]) => <div key={String(label)} className="rounded-xl border border-slate-200 bg-white p-5"><div className="text-2xl font-semibold tabular-nums text-[#172033]">{value}</div><div className="mt-1 text-xs font-medium text-slate-500">{label}</div></div>)}
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <section className="rounded-xl border border-slate-200 bg-white p-6">
            <div className="flex items-center justify-between"><div><div className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#80601d]">Schedule</div><h2 className="mt-1 font-serif text-2xl font-semibold text-[#172033]">Next consultation</h2></div><button onClick={() => onNavigate('appointments')} className="text-sm font-semibold text-slate-500 hover:text-[#80601d]">View all</button></div>
            {next ? <div className="mt-5 rounded-lg border border-slate-200 bg-[#fbfaf7] p-5"><div className="flex items-start justify-between gap-4"><div><div className="font-semibold text-[#172033]">{next.clientName}</div><div className="mt-1 text-xs text-slate-500">{next.legalIssueTitle}</div></div><StatusBadge status={next.status} /></div><div className="mt-5 grid gap-4 sm:grid-cols-2"><div><div className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Date</div><div className="mt-1 text-sm font-medium text-slate-700">{next.date || 'To be confirmed'}</div></div><div><div className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Time</div><div className="mt-1 text-sm font-medium text-slate-700">{next.timeSlot || 'To be confirmed'}</div></div></div>{next.status === 'CONFIRMED' && next.meetingLink && <button onClick={() => onJoinVideoRoom(next)} className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#172033] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#26334b]"><Video className="h-4 w-4" /> Join consultation</button>}</div> : <div className="mt-5"><EmptyPanel title="No consultation scheduled" text="New requests and confirmed consultations will appear here." /></div>}
          </section>

          <section className="rounded-xl border border-slate-200 bg-[#fbfaf7] p-6"><div className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#80601d]">Client requests</div><h2 className="mt-1 font-serif text-2xl font-semibold text-[#172033]">Awaiting your review</h2>{pending.length ? <div className="mt-5 space-y-3">{pending.slice(0, 3).map(a => <button key={a.id} onClick={() => onNavigate('appointments')} className="w-full rounded-lg border border-slate-200 bg-white p-4 text-left hover:border-[#b79a63]"><div className="flex items-center justify-between gap-3"><span className="text-sm font-semibold text-[#172033]">{a.clientName}</span><span className="text-xs text-[#80601d]">Review →</span></div><div className="mt-1 text-xs text-slate-500">{a.legalIssueTitle}</div></button>)}</div> : <div className="mt-5"><EmptyPanel title="Nothing waiting" text="You have no pending consultation requests." /></div>}</section>
        </div>

        <section><div className="mb-4 flex items-end justify-between"><div><div className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#80601d]">Practice</div><h2 className="mt-1 font-serif text-2xl font-semibold text-[#172033]">Your matters</h2></div><button onClick={() => onNavigate('cases')} className="text-sm font-semibold text-slate-500 hover:text-[#80601d]">Open case list</button></div><div className="grid gap-3">{lawyerCases.slice(0, 4).map(c => <button key={c.id} onClick={() => onNavigate('cases')} className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-5 text-left hover:border-[#b79a63]"><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#f4f0e7] text-[#80601d]"><Scale className="h-4 w-4" /></div><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><span className="font-semibold text-[#172033]">{c.title}</span><StatusBadge status={c.status} /></div><div className="mt-1 text-xs text-slate-500">{c.caseNumber} · {c.clientName} · {c.category}</div></div><ArrowRight className="h-4 w-4 text-slate-300" /></button>)}{!lawyerCases.length && <EmptyPanel title="No matters yet" text="Accepted consultations will appear in your case workspace." />}</div></section>
      </div>
    );
  }

  return (
    <div className="nyaya-client-home space-y-8">
      <section className="border-b border-slate-200 pb-7">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-[#80601d]"><Scale className="h-3.5 w-3.5" /> Client workspace</div>
            <h1 className="mt-2 font-serif text-3xl font-semibold tracking-tight text-[#172033]">{greeting()}, {currentUser.name.split(' ')[0]}</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">Your consultations, case documents and next actions are organized here. Your advocate remains responsible for legal advice and decisions.</p>
          </div>
          <div className="flex flex-wrap gap-2"><button onClick={onTriggerTriage} className="inline-flex items-center gap-2 rounded-lg bg-[#172033] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#26334b]"><Scale className="h-4 w-4" /> Explain a legal issue</button><button onClick={onTriggerBooking} className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-[#172033] hover:border-[#b79a63] hover:bg-[#fbfaf7]"><Search className="h-4 w-4" /> Find an advocate</button></div>
        </div>
        <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-500"><span className="inline-flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5 text-emerald-600" /> Secure account</span><span>{[currentUser.city, currentUser.state].filter(Boolean).join(', ') || 'India'}</span></div>
      </section>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[['Active matters', activeCases.length, 'cases'], ['Confirmed consultations', confirmedCount, 'appointments'], ['Pending requests', pendingCount, 'appointments'], ['Documents', documents.length, 'vault']].map(([label, value, target]) => <button key={String(label)} onClick={() => onNavigate(target as string)} className="rounded-xl border border-slate-200 bg-white p-5 text-left transition hover:border-[#b79a63] hover:shadow-[0_8px_24px_rgba(15,23,42,0.05)]"><div className="text-2xl font-semibold tabular-nums text-[#172033]">{value}</div><div className="mt-1 text-xs font-medium text-slate-500">{label}</div></button>)}
      </div>

      <section>
        <div className="mb-4 flex items-end justify-between gap-4"><div><div className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#80601d]">Your matter</div><h2 className="mt-1 font-serif text-2xl font-semibold text-[#172033]">Case overview</h2></div><button onClick={() => onNavigate('cases')} className="text-sm font-semibold text-slate-500 hover:text-[#80601d]">View all cases →</button></div>
        {activeCase ? <div className="overflow-hidden rounded-xl border border-slate-200 bg-white"><div className="p-6 sm:p-7"><div className="flex flex-wrap items-center gap-2"><span className="text-xs font-semibold tracking-wide text-slate-400">{activeCase.caseNumber}</span><StatusBadge status={activeCase.status} /></div><h3 className="mt-3 font-serif text-2xl font-semibold leading-tight text-[#172033]">{activeCase.title}</h3><p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">{activeCase.description || 'Your advocate can add the matter summary and key facts here.'}</p><div className="mt-5 grid gap-4 border-t border-slate-100 pt-5 sm:grid-cols-3"><div><div className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Advocate</div><div className="mt-1 text-sm font-medium text-slate-700">{activeCase.lawyerName || 'To be assigned'}</div></div><div><div className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Practice area</div><div className="mt-1 text-sm font-medium text-slate-700">{activeCase.category}</div></div><div><div className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Last updated</div><div className="mt-1 text-sm font-medium text-slate-700">{formatDateTime(activeCase.lastUpdated)}</div></div></div><div className="mt-6 border-t border-slate-100 pt-5"><div className="flex items-center justify-between text-xs"><span className="font-semibold text-slate-600">Case actions completed</span><span className="font-semibold text-[#172033]">{completedTasks}/{totalTasks}</span></div><div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100"><div className="h-full bg-[#9a6a18]" style={{ width: `${progress}%` }} /></div><button onClick={() => onNavigate('cases')} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#80601d]">Open case workspace <ArrowRight className="h-4 w-4" /></button></div></div></div> : <EmptyPanel title="No matter has been opened yet" text="Start by explaining your legal issue or finding an advocate." action="Get legal help" onClick={onTriggerTriage} />}
      </section>

      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <section className="rounded-xl border border-slate-200 bg-white p-6"><div className="flex items-start justify-between gap-4"><div><div className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#80601d]">Schedule</div><h2 className="mt-1 font-serif text-2xl font-semibold text-[#172033]">Next consultation</h2></div><button onClick={() => onNavigate('appointments')} className="text-sm font-semibold text-slate-500 hover:text-[#80601d]">View schedule</button></div>{upcoming ? <div className="mt-5 rounded-lg border border-slate-200 bg-[#fbfaf7] p-5"><div className="flex items-start justify-between gap-4"><div><div className="font-semibold text-[#172033]">{upcoming.lawyerName}</div><div className="mt-1 text-xs text-slate-500">{upcoming.legalIssueTitle}</div></div><StatusBadge status={upcoming.status} /></div><div className="mt-5 grid gap-4 sm:grid-cols-2"><div><div className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Date</div><div className="mt-1 text-sm font-medium text-slate-700">{upcoming.date || 'To be confirmed'}</div></div><div><div className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Time</div><div className="mt-1 text-sm font-medium text-slate-700">{upcoming.timeSlot || 'To be confirmed'}</div></div></div>{upcoming.status === 'CONFIRMED' && upcoming.meetingLink && <button onClick={() => onJoinVideoRoom(upcoming)} className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#172033] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#26334b]"><Video className="h-4 w-4" /> Join consultation</button>}</div> : <div className="mt-5"><EmptyPanel title="No consultation scheduled" text="Your next confirmed appointment will appear here." action="Find an advocate" onClick={onTriggerBooking} /></div>}</section>

        <section className="rounded-xl border border-[#d9cfbb] bg-[#f7f3e9] p-6"><div className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#80601d]">Action required</div><h2 className="mt-1 font-serif text-2xl font-semibold text-[#172033]">Next step on your case</h2>{nextTask ? <><div className="mt-5 rounded-lg border border-[#dfd4bd] bg-white p-5"><div className="text-sm font-semibold text-[#172033]">{nextTask.title}</div><div className="mt-2 text-xs text-slate-500">Due {formatDate(nextTask.dueDate)}</div><div className="mt-1 text-xs text-slate-500">{nextTask.caseTitle}</div></div><button onClick={() => onNavigate('cases')} className="mt-4 text-sm font-semibold text-[#80601d]">Open case tasks →</button></> : <p className="mt-5 text-sm leading-6 text-slate-600">There are no outstanding actions at the moment. We will surface the next case task here.</p>}</section>
      </div>

      <section><div className="mb-4"><div className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#80601d]">Services</div><h2 className="mt-1 font-serif text-2xl font-semibold text-[#172033]">Manage your legal matter</h2></div><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4"><QuickLink icon={Scale} title="Find an advocate" description="Compare verified advocates by practice area and experience." onClick={onTriggerBooking} /><QuickLink icon={UploadCloud} title="Case documents" description="Upload and manage documents within your case workspace." onClick={onTriggerUpload} /><QuickLink icon={Search} title="Case tracking" description="Review the case information available to you." onClick={() => onNavigate('tracking')} /><QuickLink icon={HeartHandshake} title="Legal aid" description="Explore legal-aid and support resources." onClick={() => onNavigate('legal-aid')} /></div></section>

      <section className="grid gap-6 lg:grid-cols-[1fr_300px]">
        <div className="rounded-xl border border-slate-200 bg-white p-6"><div className="flex items-end justify-between gap-4"><div><div className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#80601d]">Advocates</div><h2 className="mt-1 font-serif text-2xl font-semibold text-[#172033]">Verified advocates</h2></div><button onClick={onTriggerBooking} className="text-sm font-semibold text-slate-500 hover:text-[#80601d]">Browse all</button></div><div className="mt-5 divide-y divide-slate-100">{verifiedLawyers.map(lawyer => <button key={lawyer.id} onClick={onTriggerBooking} className="flex w-full items-center gap-4 py-4 text-left first:pt-0 last:pb-0 hover:bg-[#fbfaf7]"><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-[#f8f6ef] font-serif text-base font-semibold text-[#172033]">{lawyer.name.charAt(0)}</div><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><span className="font-semibold text-[#172033]">{lawyer.name}</span><span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700"><CheckCircle2 className="h-3 w-3" /> Verified</span></div><div className="mt-1 truncate text-xs text-slate-500">{lawyer.practiceAreas.slice(0, 2).join(' · ')} · {lawyer.city}</div></div><div className="hidden text-right sm:block"><div className="text-sm font-semibold text-[#172033]">★ {lawyer.rating.toFixed(1)}</div><div className="mt-1 text-[11px] text-slate-500">{lawyer.experienceYears} years</div></div><ArrowRight className="h-4 w-4 text-slate-300" /></button>)}{!verifiedLawyers.length && <p className="py-2 text-sm text-slate-500">Verified advocates will appear here.</p>}</div></div>
        <div className="rounded-xl border border-slate-200 bg-[#fbfaf7] p-6"><div className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#80601d]">Account</div><h2 className="mt-1 font-serif text-2xl font-semibold text-[#172033]">Your details</h2><dl className="mt-5 divide-y divide-slate-200 text-sm"><div className="flex justify-between gap-4 py-3"><dt className="text-slate-500">Location</dt><dd className="text-right font-medium text-slate-700">{[currentUser.city, currentUser.state].filter(Boolean).join(', ') || 'India'}</dd></div><div className="flex justify-between gap-4 py-3"><dt className="text-slate-500">Open matters</dt><dd className="font-medium text-slate-700">{activeCases.length}</dd></div><div className="flex justify-between gap-4 py-3"><dt className="text-slate-500">Documents</dt><dd className="font-medium text-slate-700">{documents.length}</dd></div></dl><div className="mt-5 border-t border-slate-200 pt-4 text-xs leading-5 text-slate-500"><LockKeyhole className="mr-1 inline h-3.5 w-3.5" /> Your case information is shown according to your account permissions.</div></div>
      </section>
    </div>
  );
};
