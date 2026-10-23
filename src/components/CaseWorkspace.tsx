import React, { useState } from 'react';
import { CaseWorkspace as ICaseWorkspace, CaseTimelineEvent, CaseDocument, UserRole } from '../types';
import { 
  FileCheck2, 
  Calendar, 
  Clock, 
  Plus, 
  CheckCircle2, 
  Circle, 
  FileText, 
  ShieldCheck, 
  User, 
  Scale, 
  Building2, 
  ArrowRight,
  Send,
  AlertTriangle,
  FolderOpen
} from 'lucide-react';

interface CaseWorkspaceProps {
  cases: ICaseWorkspace[];
  timelineEvents: CaseTimelineEvent[];
  documents: CaseDocument[];
  currentRole: UserRole;
  onAddTimelineEvent: (caseId: string, event: Omit<CaseTimelineEvent, 'id'>) => void;
  onToggleTask: (caseId: string, taskId: string) => void;
  onOpenDocumentVault: () => void;
}

export const CaseWorkspace: React.FC<CaseWorkspaceProps> = ({
  cases,
  timelineEvents,
  documents,
  currentRole,
  onAddTimelineEvent,
  onToggleTask,
  onOpenDocumentVault,
}) => {
  const [selectedCaseId, setSelectedCaseId] = useState<string>(cases[0]?.id || '');
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventDesc, setNewEventDesc] = useState('');
  const [newEventType, setNewEventType] = useState<CaseTimelineEvent['eventType']>('NOTICE');
  const [showAddEventModal, setShowAddEventModal] = useState(false);

  const activeCase = cases.find(c => c.id === selectedCaseId) || cases[0];
  const activeTimeline = timelineEvents
    .filter(e => e.caseId === activeCase?.id)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const caseDocs = documents.filter(d => d.caseId === activeCase?.id);

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCase || !newEventTitle.trim()) return;

    onAddTimelineEvent(activeCase.id, {
      caseId: activeCase.id,
      date: new Date().toISOString().split('T')[0],
      title: newEventTitle.trim(),
      description: newEventDesc.trim(),
      eventType: newEventType,
      createdByUserName: currentRole === 'LAWYER' ? activeCase.lawyerName : activeCase.clientName,
    });

    setNewEventTitle('');
    setNewEventDesc('');
    setShowAddEventModal(false);
  };

  if (!activeCase) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-xl mx-auto">
        <FolderOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-slate-900">No Active Case Workspace</h3>
        <p className="text-xs text-slate-500 mt-1">
          A case workspace is automatically provisioned when an advocate accepts and completes a consultation.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* Top Case Selector & Status Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono font-semibold text-slate-500 uppercase tracking-wide">
                Case File: {activeCase.caseNumber}
              </span>
              <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-semibold border ${
                activeCase.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                activeCase.status === 'RESOLVED' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' :
                'bg-slate-50 text-slate-700 border-slate-200'
              }`}>
                {activeCase.status}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 mt-1">
              {activeCase.title}
            </h1>
            <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-slate-500 font-medium">
              <span>CNR: <code className="text-slate-800 font-mono font-semibold">{activeCase.cnrNumber || 'Pending Filing'}</code></span>
              <span>·</span>
              <span>Court: <strong className="text-slate-800">{activeCase.court}</strong></span>
              <span>·</span>
              <span>Category: <strong className="text-slate-800">{activeCase.category}</strong></span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAddEventModal(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-xs"
            >
              <Plus className="w-3.5 h-3.5 text-amber-400" />
              <span>Record Timeline Event</span>
            </button>
            <button
              onClick={onOpenDocumentVault}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors border border-slate-200"
            >
              <FileText className="w-3.5 h-3.5 text-slate-500" />
              <span>Evidence Vault ({caseDocs.length})</span>
            </button>
          </div>
        </div>

        {/* Case Narrative Overview */}
        <p className="mt-4 text-xs sm:text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200/80">
          <strong className="text-slate-800">Brief Overview:</strong> {activeCase.description}
        </p>

        {/* Key Metadata Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4 pt-4 border-t border-slate-100 text-xs">
          <div>
            <span className="text-slate-400 text-[10px] uppercase font-bold block">Assigned Advocate</span>
            <span className="font-semibold text-slate-900">{activeCase.lawyerName}</span>
          </div>
          <div>
            <span className="text-slate-400 text-[10px] uppercase font-bold block">Client Name</span>
            <span className="font-semibold text-slate-900">{activeCase.clientName}</span>
          </div>
          <div>
            <span className="text-slate-400 text-[10px] uppercase font-bold block">Opened On</span>
            <span className="font-mono text-slate-900">{activeCase.openedAt}</span>
          </div>
          <div>
            <span className="text-slate-400 text-[10px] uppercase font-bold block">Next Hearing Date</span>
            <span className="font-mono font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded inline-block">
              {activeCase.nextHearingDate || 'Awaiting Court Listing'}
            </span>
          </div>
        </div>
      </div>

      {/* 2-Column Layout: Timeline (Left) & Tasks / Documents (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Chronological Case Timeline */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-600" />
              <span>Official Case Timeline</span>
            </h2>
            <span className="text-xs text-slate-500 font-mono">
              {activeTimeline.length} Recorded Milestone(s)
            </span>
          </div>

          <div className="relative border-l-2 border-slate-200 ml-3 pl-6 space-y-6">
            {activeTimeline.map((ev) => (
              <div key={ev.id} className="relative group">
                
                {/* Timeline Node Bullet */}
                <span className={`absolute -left-[31px] top-1 w-4 h-4 rounded-full border-2 border-white ring-2 ${
                  ev.eventType === 'CONSULTATION' ? 'bg-amber-500 ring-amber-200' :
                  ev.eventType === 'NOTICE' ? 'bg-indigo-600 ring-indigo-200' :
                  ev.eventType === 'FILING' ? 'bg-emerald-600 ring-emerald-200' :
                  'bg-slate-700 ring-slate-300'
                }`} />

                {/* Event Details */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 group-hover:border-slate-300 transition-all">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <span className="text-xs font-bold text-slate-900">{ev.title}</span>
                    <span className="text-[11px] font-mono text-slate-500">{ev.date}</span>
                  </div>
                  <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
                    {ev.description}
                  </p>
                  <div className="mt-2.5 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px] text-slate-400">
                    <span>Logged by: <strong className="text-slate-600">{ev.createdByUserName}</strong></span>
                    <span className="uppercase font-semibold tracking-wider text-slate-500">
                      Type: {ev.eventType}
                    </span>
                  </div>
                </div>

              </div>
            ))}
          </div>
        </div>

        {/* Right 1 Col: Action Tasks & Associated Documents */}
        <div className="space-y-6">
          
          {/* Action Tasks Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Next Legal Action Checklist</span>
            </h3>

            <div className="mt-4 space-y-2.5">
              {activeCase.tasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => onToggleTask(activeCase.id, task.id)}
                  className={`p-3 rounded-xl border text-xs cursor-pointer transition-all flex items-start gap-2.5 ${
                    task.completed 
                      ? 'bg-slate-50 border-slate-200 text-slate-400 line-through'
                      : 'bg-white border-slate-200 text-slate-800 hover:border-slate-400 shadow-xs'
                  }`}
                >
                  <span className="mt-0.5">
                    {task.completed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Circle className="w-4 h-4 text-slate-400" />
                    )}
                  </span>
                  <div className="flex-1">
                    <span className="font-medium block leading-tight">{task.title}</span>
                    <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">
                      Target: {task.dueDate}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Attached Evidence Vault Preview */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-slate-600" />
                <span>Case Evidence Vault</span>
              </h3>
              <span className="text-xs text-slate-400 font-mono">{caseDocs.length} Docs</span>
            </div>

            <div className="mt-4 space-y-2">
              {caseDocs.map((doc) => (
                <div 
                  key={doc.id}
                  className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2 truncate">
                    <FileText className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span className="font-medium text-slate-800 truncate">{doc.originalName}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono shrink-0 ml-2">
                    {doc.fileSizeKb} KB
                  </span>
                </div>
              ))}
            </div>

            <button
              onClick={onOpenDocumentVault}
              className="mt-4 w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg transition-colors"
            >
              Manage &amp; Upload More Evidence
            </button>
          </div>

        </div>

      </div>

      {/* Add Milestone Event Modal */}
      {showAddEventModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900">
              Log Case Timeline Milestone
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Updates your secure case timeline.
            </p>

            <form onSubmit={handleCreateEvent} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Milestone Title *
                </label>
                <input
                  type="text"
                  required
                  value={newEventTitle}
                  onChange={(e) => setNewEventTitle(e.target.value)}
                  placeholder="e.g. Dispatched Legal Notice via Registered Post"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Milestone Type
                </label>
                <select
                  value={newEventType}
                  onChange={(e) => setNewEventType(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-slate-800 bg-white"
                >
                  <option value="NOTICE">Statutory Demand Notice</option>
                  <option value="FILING">Court Filing / Plaint</option>
                  <option value="HEARING">Court Hearing / Appearance</option>
                  <option value="SETTLEMENT">Mediation / Settlement</option>
                  <option value="DOCUMENT">Evidence Submission</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Milestone Description
                </label>
                <textarea
                  rows={3}
                  value={newEventDesc}
                  onChange={(e) => setNewEventDesc(e.target.value)}
                  placeholder="Postal consignment tracking number, appearance details, or brief outcome..."
                  className="w-full p-2.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-slate-800 resize-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddEventModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-md shadow-xs"
                >
                  Save Milestone
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
