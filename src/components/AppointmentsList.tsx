import React, { useState } from 'react';
import { Appointment, UserRole } from '../types';
import { 
  Calendar, 
  Clock, 
  Video, 
  Check, 
  X, 
  CheckCircle2, 
  FileText, 
  Star, 
  ArrowRight, 
  Scale, 
  User, 
  Briefcase,
  AlertCircle
} from 'lucide-react';

interface AppointmentsListProps {
  appointments: Appointment[];
  currentRole: UserRole;
  onAcceptAppointment: (id: string) => void;
  onRejectAppointment: (id: string) => void;
  onCompleteAppointment: (id: string, notes: string) => void;
  onJoinVideoRoom: (appointment: Appointment) => void;
  onOpenCaseWorkspace: (caseId: string) => void;
  onSubmitReview: (appointmentId: string, rating: number, comment: string) => void;
}

export const AppointmentsList: React.FC<AppointmentsListProps> = ({
  appointments,
  currentRole,
  onAcceptAppointment,
  onRejectAppointment,
  onCompleteAppointment,
  onJoinVideoRoom,
  onOpenCaseWorkspace,
  onSubmitReview,
}) => {
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'PENDING' | 'CONFIRMED' | 'COMPLETED'>('ALL');
  const [completingAptId, setCompletingAptId] = useState<string | null>(null);
  const [lawyerNotesInput, setLawyerNotesInput] = useState('');
  
  // Review state
  const [reviewingAptId, setReviewingAptId] = useState<string | null>(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');

  const filteredAppointments = appointments.filter(apt => {
    if (activeFilter === 'ALL') return true;
    return apt.status === activeFilter;
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* Header and Filter Controls */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            {currentRole === 'LAWYER' ? 'Consultation Appointments Management' : 'My Legal Consultations'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            {currentRole === 'LAWYER' 
              ? 'Review pending client booking requests, accept/reject, join video sessions, and record post-consultation minutes.'
              : 'Track your consultation bookings, join secure video sessions with your advocate, and review legal briefs.'}
          </p>
        </div>

        {/* Filter Segmented Control */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg border border-slate-200/80">
          {(['ALL', 'PENDING', 'CONFIRMED', 'COMPLETED'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setActiveFilter(status)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                activeFilter === status
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Appointment Cards */}
      <div className="space-y-4">
        {filteredAppointments.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
            <Briefcase className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">No Appointments in "{activeFilter}"</h3>
            <p className="text-xs text-slate-500 mt-1">
              {currentRole === 'CLIENT' 
                ? 'Discover verified advocates and book your first 30-min confidential video consultation.'
                : 'New client requests will appear here in real-time.'}
            </p>
          </div>
        ) : (
          filteredAppointments.map((apt) => {
            const isConfirmed = apt.status === 'CONFIRMED';
            const isPending = apt.status === 'PENDING';
            const isCompleted = apt.status === 'COMPLETED';
            const isRejected = apt.status === 'REJECTED';

            return (
              <div 
                key={apt.id}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:border-slate-300 transition-all space-y-4"
              >
                
                {/* Top Row: Title, Date, Status */}
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-base sm:text-lg font-bold text-slate-900">
                        {apt.legalIssueTitle}
                      </h2>
                      <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-semibold border ${
                        isConfirmed ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                        isPending ? 'bg-amber-50 text-amber-700 border-amber-200' :
                        isCompleted ? 'bg-indigo-50 text-indigo-700 border-indigo-200' :
                        'bg-rose-50 text-rose-700 border-rose-200'
                      }`}>
                        {apt.status}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-slate-500">
                      <span>Category: <strong className="text-slate-700">{apt.legalCategory}</strong></span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <strong>{apt.date}</strong>
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1 font-mono">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {apt.timeSlot}
                      </span>
                    </div>
                  </div>

                  {/* Parties Info */}
                  <div className="text-right text-xs">
                    <div className="text-slate-500">
                      {currentRole === 'LAWYER' ? 'Client:' : 'Advocate:'}
                    </div>
                    <div className="font-bold text-slate-900">
                      {currentRole === 'LAWYER' ? apt.clientName : apt.lawyerName}
                    </div>
                  </div>
                </div>

                {/* Client Notes / Details */}
                {apt.clientNotes && (
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 text-xs text-slate-700">
                    <span className="font-semibold text-slate-900 block mb-1">Client Statement:</span>
                    <p className="leading-relaxed">{apt.clientNotes}</p>
                  </div>
                )}

                {/* Lawyer Notes (Post-Consultation) */}
                {apt.lawyerNotes && (
                  <div className="bg-indigo-50/50 p-3.5 rounded-xl border border-indigo-200/60 text-xs text-slate-800">
                    <span className="font-semibold text-indigo-950 block mb-1">Advocate Consultation Minutes:</span>
                    <p className="leading-relaxed">{apt.lawyerNotes}</p>
                    {apt.prescribedNextSteps && apt.prescribedNextSteps.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-indigo-200/50">
                        <span className="font-semibold text-indigo-900 text-[11px] block mb-1">Action Items:</span>
                        <ul className="list-disc list-inside space-y-0.5 text-slate-600">
                          {apt.prescribedNextSteps.map((step, idx) => (
                            <li key={idx}>{step}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {/* Action Bar */}
                <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                  
                  {/* Status Indicator */}
                  <div className="text-xs text-slate-500">
                    {isPending && 'Waiting for advocate acceptance...'}
                    {isConfirmed && 'Consultation confirmed. Video room link is active.'}
                    {isCompleted && 'Consultation completed successfully.'}
                    {isRejected && 'This appointment request was declined.'}
                  </div>

                  {/* Action Buttons based on Role & Status */}
                  <div className="flex items-center gap-2">
                    
                    {/* Lawyer Pending Actions: Accept / Reject */}
                    {currentRole === 'LAWYER' && isPending && (
                      <>
                        <button
                          onClick={() => onRejectAppointment(apt.id)}
                          className="px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg border border-rose-200 transition-colors"
                        >
                          Decline
                        </button>
                        <button
                          onClick={() => onAcceptAppointment(apt.id)}
                          className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-xs"
                        >
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Accept &amp; Generate Video Link</span>
                        </button>
                      </>
                    )}

                    {/* Both Client & Lawyer: Join Video Session when CONFIRMED */}
                    {isConfirmed && (
                      <button
                        onClick={() => onJoinVideoRoom(apt)}
                        className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors shadow-xs"
                      >
                        <Video className="w-4 h-4" />
                        <span>Join Video Consultation</span>
                      </button>
                    )}

                    {/* Lawyer can Mark Consultation Complete */}
                    {currentRole === 'LAWYER' && isConfirmed && (
                      <button
                        onClick={() => setCompletingAptId(apt.id)}
                        className="px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg border border-slate-300 transition-colors"
                      >
                        Record Notes &amp; Complete
                      </button>
                    )}

                    {/* Completed State Actions */}
                    {isCompleted && (
                      <>
                        {apt.caseId && (
                          <button
                            onClick={() => onOpenCaseWorkspace(apt.caseId!)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                          >
                            <FileText className="w-3.5 h-3.5 text-slate-600" />
                            <span>Open Case Workspace</span>
                          </button>
                        )}
                        {currentRole === 'CLIENT' && (
                          <button
                            onClick={() => setReviewingAptId(apt.id)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-lg border border-amber-200/80 transition-colors"
                          >
                            <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                            <span>Submit Review</span>
                          </button>
                        )}
                      </>
                    )}

                  </div>

                </div>

                {/* Modal / Inline form to Complete Consultation */}
                {completingAptId === apt.id && (
                  <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-300 space-y-3 animate-in fade-in">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">
                        Post-Consultation Minutes &amp; Legal Advice
                      </span>
                      <button 
                        onClick={() => setCompletingAptId(null)}
                        className="text-slate-400 hover:text-slate-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <textarea
                      rows={3}
                      value={lawyerNotesInput}
                      onChange={(e) => setLawyerNotesInput(e.target.value)}
                      placeholder="Summarize advocate advice, required legal notices, statutory deadlines, or next court actions..."
                      className="w-full p-2.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-slate-800 bg-white"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setCompletingAptId(null)}
                        className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-200 rounded-md"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => {
                          onCompleteAppointment(apt.id, lawyerNotesInput || 'Consultation concluded. Legal demand notice advised.');
                          setCompletingAptId(null);
                          setLawyerNotesInput('');
                        }}
                        className="px-4 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-md shadow-xs"
                      >
                        Save &amp; Mark Complete
                      </button>
                    </div>
                  </div>
                )}

                {/* Modal to Submit Review */}
                {reviewingAptId === apt.id && (
                  <div className="mt-4 p-4 bg-amber-50/50 rounded-xl border border-amber-200 space-y-3 animate-in fade-in">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">
                        Leave Advocate Consultation Review
                      </span>
                      <button 
                        onClick={() => setReviewingAptId(null)}
                        className="text-slate-400 hover:text-slate-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-600">Rating:</span>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewRating(star)}
                          className="focus:outline-none"
                        >
                          <Star className={`w-5 h-5 ${star <= reviewRating ? 'fill-amber-400 text-amber-500' : 'text-slate-300'}`} />
                        </button>
                      ))}
                    </div>
                    <input
                      type="text"
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      placeholder="Was the advocate helpful? How was their advice clarity?"
                      className="w-full p-2 text-xs border border-slate-300 rounded-lg bg-white focus:outline-none focus:border-slate-800"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setReviewingAptId(null)}
                        className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-200 rounded-md"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => {
                          onSubmitReview(apt.id, reviewRating, reviewComment || 'Very professional and knowledgeable advocate.');
                          setReviewingAptId(null);
                          setReviewComment('');
                        }}
                        className="px-4 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-md"
                      >
                        Submit Rating
                      </button>
                    </div>
                  </div>
                )}

              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
