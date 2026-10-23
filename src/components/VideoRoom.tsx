import React, { useState } from 'react';
import { Appointment, CaseDocument, UserRole } from '../types';
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Monitor, 
  PhoneOff, 
  FileText, 
  CheckCircle, 
  ShieldCheck, 
  User, 
  Scale, 
  Maximize2,
  Lock,
  Sparkles
} from 'lucide-react';

interface VideoRoomProps {
  appointment: Appointment;
  documents: CaseDocument[];
  currentRole: UserRole;
  onLeaveRoom: () => void;
  onFinishConsultation: (notes: string) => void;
}

export const VideoRoom: React.FC<VideoRoomProps> = ({
  appointment,
  documents,
  currentRole,
  onLeaveRoom,
  onFinishConsultation,
}) => {
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCamOn, setIsCamOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [activeSideTab, setActiveSideTab] = useState<'NOTES' | 'DOCS' | 'BRIEF'>('BRIEF');
  const [consultationNotes, setConsultationNotes] = useState(
    appointment.lawyerNotes || ''
  );

  return (
    <div className="bg-slate-900 text-white rounded-2xl overflow-hidden border border-slate-800 shadow-2xl max-w-6xl mx-auto flex flex-col h-[82vh]">
      
      {/* Top Video Header */}
      <div className="px-6 py-3.5 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-mono font-bold tracking-wider uppercase text-emerald-400">
              Live Encrypted Consultation
            </span>
          </div>
          <span className="text-slate-600">|</span>
          <div className="text-xs text-slate-300 font-medium">
            Secure consultation room
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Lock className="w-3.5 h-3.5 text-emerald-400" />
          <span className="hidden sm:inline">Private access verified</span>
          <button
            onClick={onLeaveRoom}
            className="ml-3 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-md transition-colors"
          >
            Leave
          </button>
        </div>
      </div>

      {/* Main Grid: Video Feeds + Side Panel */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 overflow-hidden">
        
        {/* Left 2 Cols: Main Video Viewport */}
        <div className="lg:col-span-2 p-4 bg-slate-900/90 flex flex-col justify-between relative">
          
          {/* Active Speakers Stage */}
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            
            {/* Primary Speaker (Advocate) */}
            <div className="relative aspect-4/3 sm:aspect-auto h-full min-h-[220px] rounded-xl bg-slate-800 border border-slate-700 overflow-hidden flex flex-col items-center justify-center p-6 text-center">
              <div className="w-20 h-20 rounded-full bg-slate-700 flex items-center justify-center text-2xl font-bold text-amber-300 mb-3 border-2 border-slate-600">
                P
              </div>
              <div className="font-bold text-sm text-slate-100">{appointment.lawyerName}</div>
              <div className="text-xs text-slate-400">Delhi High Court Advocate</div>
              
              <div className="absolute bottom-3 left-3 bg-slate-950/80 px-2.5 py-1 rounded-md text-[10px] font-mono text-slate-300 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>Advocate Feed (HD)</span>
              </div>
            </div>

            {/* Client Speaker */}
            <div className="relative aspect-4/3 sm:aspect-auto h-full min-h-[220px] rounded-xl bg-slate-800 border border-slate-700 overflow-hidden flex flex-col items-center justify-center p-6 text-center">
              <div className="w-20 h-20 rounded-full bg-slate-700 flex items-center justify-center text-2xl font-bold text-slate-300 mb-3 border-2 border-slate-600">
                R
              </div>
              <div className="font-bold text-sm text-slate-100">{appointment.clientName}</div>
              <div className="text-xs text-slate-400">Client Participant</div>

              <div className="absolute bottom-3 left-3 bg-slate-950/80 px-2.5 py-1 rounded-md text-[10px] font-mono text-slate-300 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>Client Feed</span>
              </div>
            </div>

          </div>

          {/* Media Controls Toolbar */}
          <div className="pt-4 flex items-center justify-center gap-3">
            <button
              onClick={() => setIsMicOn(!isMicOn)}
              className={`p-3 rounded-full transition-colors ${
                isMicOn ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-rose-600 text-white hover:bg-rose-700'
              }`}
              title={isMicOn ? 'Mute Mic' : 'Unmute Mic'}
            >
              {isMicOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
            </button>

            <button
              onClick={() => setIsCamOn(!isCamOn)}
              className={`p-3 rounded-full transition-colors ${
                isCamOn ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-rose-600 text-white hover:bg-rose-700'
              }`}
              title={isCamOn ? 'Turn off camera' : 'Turn on camera'}
            >
              {isCamOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
            </button>

            <button
              onClick={() => setIsScreenSharing(!isScreenSharing)}
              className={`p-3 rounded-full transition-colors ${
                isScreenSharing ? 'bg-amber-500 text-slate-900' : 'bg-slate-800 text-white hover:bg-slate-700'
              }`}
              title="Share Document / Screen"
            >
              <Monitor className="w-5 h-5" />
            </button>

            {currentRole === 'LAWYER' && (
              <button
                onClick={() => onFinishConsultation(consultationNotes)}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-full transition-colors shadow-xs ml-2"
              >
                Conclude Consultation &amp; Save Minutes
              </button>
            )}

            <button
              onClick={onLeaveRoom}
              className="p-3 bg-rose-600 hover:bg-rose-700 text-white rounded-full transition-colors ml-2"
              title="Disconnect"
            >
              <PhoneOff className="w-5 h-5" />
            </button>
          </div>

        </div>

        {/* Right 1 Col: Integrated Side Panel */}
        <div className="bg-slate-950 border-l border-slate-800 flex flex-col h-full">
          
          {/* Side Tabs */}
          <div className="flex border-b border-slate-800 text-xs">
            <button
              onClick={() => setActiveSideTab('BRIEF')}
              className={`flex-1 py-3 px-2 text-center font-semibold transition-colors ${
                activeSideTab === 'BRIEF'
                  ? 'text-amber-400 border-b-2 border-amber-400 bg-slate-900/50'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              AI Case Brief
            </button>
            <button
              onClick={() => setActiveSideTab('DOCS')}
              className={`flex-1 py-3 px-2 text-center font-semibold transition-colors ${
                activeSideTab === 'DOCS'
                  ? 'text-amber-400 border-b-2 border-amber-400 bg-slate-900/50'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Shared Docs ({documents.length})
            </button>
            <button
              onClick={() => setActiveSideTab('NOTES')}
              className={`flex-1 py-3 px-2 text-center font-semibold transition-colors ${
                activeSideTab === 'NOTES'
                  ? 'text-amber-400 border-b-2 border-amber-400 bg-slate-900/50'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Advocate Notes
            </button>
          </div>

          {/* Panel Content */}
          <div className="flex-1 p-4 overflow-y-auto text-xs text-slate-300 space-y-4">
            
            {activeSideTab === 'BRIEF' && (
              <div className="space-y-3">
                <div className="flex items-center gap-1.5 text-amber-400 font-semibold text-xs">
                  <Sparkles className="w-4 h-4" />
                  <span>Pre-Consultation Case Brief</span>
                </div>
                
                <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 space-y-2">
                  <div className="text-slate-400 text-[10px] uppercase font-bold">Issue Title</div>
                  <div className="text-slate-100 font-semibold">{appointment.legalIssueTitle}</div>
                  
                  <div className="text-slate-400 text-[10px] uppercase font-bold mt-2">Category</div>
                  <div className="text-amber-300 font-medium">{appointment.legalCategory}</div>
                </div>

                <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 space-y-1.5">
                  <div className="text-slate-400 text-[10px] uppercase font-bold">Client Notes</div>
                  <p className="text-slate-300 leading-relaxed">
                    {appointment.clientNotes || 'No specific notes recorded by client.'}
                  </p>
                </div>

                <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 text-[11px] space-y-1">
                  <span className="font-semibold text-slate-200 block">Advocate Checklist:</span>
                  <ul className="list-disc list-inside space-y-1 text-slate-400">
                    <li>Confirm lease end date &amp; key handover acknowledgement</li>
                    <li>Verify whether 30-day notice period was satisfied</li>
                    <li>Ascertain if security deposit was accepted via bank transfer</li>
                    <li>Advise on issuing Section 106 Statutory Legal Notice</li>
                  </ul>
                </div>
              </div>
            )}

            {activeSideTab === 'DOCS' && (
              <div className="space-y-3">
                <div className="text-slate-400 text-[11px] font-semibold">
                  Evidence Vault Files Shared for this Consultation:
                </div>
                {documents.map((doc) => (
                  <div 
                    key={doc.id}
                    className="p-3 bg-slate-900 rounded-lg border border-slate-800 space-y-1"
                  >
                    <div className="flex items-center gap-2 text-slate-200 font-semibold text-xs">
                      <FileText className="w-4 h-4 text-amber-400 shrink-0" />
                      <span className="truncate">{doc.originalName}</span>
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono">
                      {doc.classification} · {doc.fileSizeKb} KB
                    </div>
                    {doc.aiSummary && (
                      <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 italic">
                        "{doc.aiSummary.plainLanguageSummary}"
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {activeSideTab === 'NOTES' && (
              <div className="space-y-3 h-full flex flex-col">
                <div className="text-slate-400 text-[11px] font-semibold">
                  {currentRole === 'LAWYER' ? 'Take Real-time Consultation Minutes:' : 'Advocate Advice Recorded:'}
                </div>
                <textarea
                  rows={8}
                  readOnly={currentRole !== 'LAWYER'}
                  value={consultationNotes}
                  onChange={(e) => setConsultationNotes(e.target.value)}
                  placeholder={currentRole === 'LAWYER' ? 'Type advice notes, next statutory filing dates, legal fee quote, or action items...' : 'Advocate notes will appear here.'}
                  className="w-full flex-1 p-3 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-amber-400 resize-none font-mono"
                />
                {currentRole === 'LAWYER' && (
                  <p className="text-[10px] text-slate-500">
                    * Consultation notes are saved to the secure case record when the call is concluded.
                  </p>
                )}
              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
};
