import React, { useState } from 'react';
import { LawyerProfile, Appointment } from '../types';
import { 
  X, 
  Calendar, 
  Clock, 
  FileText, 
  CheckCircle, 
  IndianRupee, 
  ShieldCheck,
  Send
} from 'lucide-react';

interface AppointmentModalProps {
  lawyer: LawyerProfile;
  currentUserName: string;
  prefilledCategory?: string;
  prefilledIssueTitle?: string;
  onClose: () => void;
  onConfirmBooking: (appointmentData: Omit<Appointment, 'id' | 'createdAt'>) => void;
}

export const AppointmentModal: React.FC<AppointmentModalProps> = ({
  lawyer,
  currentUserName,
  prefilledCategory,
  prefilledIssueTitle,
  onClose,
  onConfirmBooking,
}) => {
  const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0,10);
  const [selectedDate, setSelectedDate] = useState(tomorrow);
  const [selectedSlot, setSelectedSlot] = useState(lawyer.timeSlots[0] || '10:00 AM - 10:30 AM');
  const [issueTitle, setIssueTitle] = useState(prefilledIssueTitle || '');
  const [category, setCategory] = useState(prefilledCategory || lawyer.practiceAreas[0] || 'Civil Litigation');
  const [clientNotes, setClientNotes] = useState('');
  const [attachingDoc, setAttachingDoc] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!issueTitle.trim() || !selectedDate || !selectedSlot) return;

    onConfirmBooking({
      clientId: 'usr_client_1',
      clientName: 'Rahul Sharma',
      lawyerId: lawyer.id,
      lawyerName: lawyer.name,
      date: selectedDate,
      timeSlot: selectedSlot,
      legalIssueTitle: issueTitle.trim(),
      legalCategory: category,
      clientNotes: clientNotes.trim(),
      status: 'PENDING',
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-xl font-bold text-slate-900">
                Book Legal Consultation
              </h2>
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Scheduling 30-min confidential video consultation with <strong>{lawyer.name}</strong>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 mt-5">
          
          {/* Lawyer Summary Box */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between text-xs">
            <div>
              <div className="font-semibold text-slate-800">{lawyer.court}</div>
              <div className="text-slate-500 font-mono">Bar Council: {lawyer.barCouncilNumber}</div>
            </div>
            <div className="text-right">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Consultation Fee</div>
              <div className="flex items-center font-mono font-bold text-slate-900">
                <IndianRupee className="w-3.5 h-3.5" />
                <span>{lawyer.consultationFee}</span>
              </div>
            </div>
          </div>

          {/* Issue Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Legal Issue Title *
            </label>
            <input
              type="text"
              required
              value={issueTitle}
              onChange={(e) => setIssueTitle(e.target.value)}
              placeholder="e.g. Non-refund of security deposit by landlord"
              className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-slate-800"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Legal Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-slate-800 bg-white"
            >
              {lawyer.practiceAreas.map((area) => (
                <option key={area} value={area}>{area}</option>
              ))}
              <option value="General Civil Litigation">General Civil Litigation</option>
            </select>
          </div>

          {/* Date & Time Slot Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Select Date *
              </label>
              <input
                type="date"
                required
                min={new Date().toISOString().slice(0,10)}
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-slate-800 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Available Time Slot *
              </label>
              <select
                value={selectedSlot}
                onChange={(e) => setSelectedSlot(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-slate-800 bg-white"
              >
                {lawyer.timeSlots.map((slot) => (
                  <option key={slot} value={slot}>{slot}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Client Notes / Summary */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Case Summary &amp; Specific Questions
            </label>
            <textarea
              rows={3}
              value={clientNotes}
              onChange={(e) => setClientNotes(e.target.value)}
              placeholder="State any specific relief you seek, key dates, or questions for the advocate during the video call..."
              className="w-full p-3 text-xs sm:text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-slate-800 resize-none"
            />
          </div>

          {/* Document Attachment Checkbox */}
          <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs">
            <input
              type="checkbox"
              id="docCheck"
              checked={attachingDoc}
              onChange={(e) => setAttachingDoc(e.target.checked)}
              className="rounded accent-slate-900"
            />
            <label htmlFor="docCheck" className="text-slate-700 cursor-pointer">
              Pre-attach my uploaded agreement / evidence from Document Vault
            </label>
          </div>

          {/* Submit Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 shadow-xs"
            >
              <span>Submit Appointment Booking</span>
              <Send className="w-3.5 h-3.5 text-amber-400" />
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
