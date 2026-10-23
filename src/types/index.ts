export type UserRole = 'CLIENT' | 'LAWYER' | 'ADMIN';

export type LawyerVerificationStatus = 'PENDING' | 'UNDER_REVIEW' | 'VERIFIED' | 'REJECTED' | 'SUSPENDED';

export type AppointmentStatus = 'PENDING' | 'CONFIRMED' | 'REJECTED' | 'CANCELLED' | 'COMPLETED' | 'NO_SHOW';

export type CaseStatus = 'OPEN' | 'ACTIVE' | 'ON_HOLD' | 'RESOLVED' | 'CLOSED';

export interface NotificationPreferences {
  emailConsultations: boolean;
  smsReminders: boolean;
  whatsappAlerts: boolean;
  hearingDateAlerts: boolean;
  documentUpdates: boolean;
  securityLoginAlerts: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone: string;
  city: string;
  state?: string;
  address?: string;
  preferredLanguage?: string;
  isBlocked: boolean;
  avatarUrl?: string;
  twoFactorEnabled?: boolean;
  notificationPreferences?: NotificationPreferences;
  lastLogin?: string;
}

export interface LawyerProfile {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  barCouncilNumber: string;
  practiceAreas: string[];
  experienceYears: number;
  languages: string[];
  city: string;
  court: string;
  consultationFee: number; // in INR
  rating: number;
  reviewCount: number;
  verificationStatus: LawyerVerificationStatus;
  bio: string;
  education: string;
  availableDays: string[];
  timeSlots: string[];
}

export interface Appointment {
  id: string;
  clientId: string;
  clientName: string;
  lawyerId: string;
  lawyerName: string;
  date: string; // YYYY-MM-DD
  timeSlot: string; // e.g. "10:00 AM - 10:30 AM"
  legalIssueTitle: string;
  legalCategory: string;
  clientNotes: string;
  status: AppointmentStatus;
  meetingLink?: string;
  lawyerNotes?: string;
  prescribedNextSteps?: string[];
  caseId?: string;
  createdAt: string;
}

export interface CaseDocument {
  id: string;
  caseId?: string;
  appointmentId?: string;
  originalName: string;
  storedFileName: string;
  fileSizeKb: number;
  fileType: string;
  uploadedByUserId: string;
  uploadedByUserName: string;
  uploadedAt: string;
  classification?: string;
  aiSummary?: {
    plainLanguageSummary: string;
    partiesIdentified: string[];
    effectiveDate: string;
    monetaryValue: string;
    keyClauses: string[];
    potentialRiskPoints: string[];
  };
}

export interface CaseTimelineEvent {
  id: string;
  caseId: string;
  date: string;
  title: string;
  description: string;
  eventType: 'FILING' | 'CONSULTATION' | 'NOTICE' | 'HEARING' | 'SETTLEMENT' | 'DOCUMENT';
  createdByUserName: string;
  documentId?: string;
}

export interface CaseWorkspace {
  id: string;
  caseNumber: string; // e.g., NYA-2026-DEL-104
  cnrNumber?: string;
  title: string;
  category: string;
  clientId: string;
  clientName: string;
  lawyerId: string;
  lawyerName: string;
  court: string;
  status: CaseStatus;
  description: string;
  openedAt: string;
  lastUpdated: string;
  nextHearingDate?: string;
  tasks: { id: string; title: string; completed: boolean; dueDate: string }[];
}

export interface Review {
  id: string;
  appointmentId: string;
  clientId: string;
  clientName: string;
  lawyerId: string;
  rating: number; // 1-5
  comment: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'APPOINTMENT' | 'CASE' | 'DOCUMENT' | 'SECURITY' | 'VERIFICATION';
  read: boolean;
  createdAt: string;
  link?: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  userRole: UserRole;
  userName: string;
  action: string;
  resource: string;
  ipAddress: string;
  timestamp: string;
  status: 'SUCCESS' | 'DENIED' | 'FLAGGED';
  details: string;
}

export interface LegalTriageResult {
  category: string;
  practiceArea: string;
  urgency: 'Low' | 'Medium' | 'High' | 'Critical';
  confidenceLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  citations?: { title: string; url: string; publisher: string; excerpt: string }[];
  sourceVerified?: boolean;
  relevantActs: string[];
  summary: string;
  requiredDocuments: string[];
  legalRightsSummary: string;
  nextSteps: string[];
  suggestedSpecializations: string[];
}
